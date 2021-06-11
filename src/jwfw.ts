import axios from 'axios'
import xpath from 'xpath'
import parse5 from 'parse5'
import xmlser from 'xmlserializer'
import { DOMParser } from 'xmldom'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { JwfwItem } from './types'
import { config, logger, formUrlEncoded } from './utils'

if (!config.SEMESTER_ID) {
  logger.error('请在 config.json 中配置学期 ID 字段 SEMESTER_ID')
  process.exit(1)
}
if (!config.JWFW_COOKIES) {
  logger.error('请在 config.json 中配置 jwfw 登录态字段 JWFW_COOKIES')
  process.exit(1)
}

/** 请求头 */
const HEADERS = {
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'content-length': '81',
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  cookie: config.JWFW_COOKIES,
  origin: 'https://jwfw.fudan.edu.cn',
  referer: `https://jwfw.fudan.edu.cn/eams/stdSyllabus!search.action?lesson.project.id=1&lesson.semester.id=${config.SEMESTER_ID}`,
  'sec-ch-ua':
    '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
}

// 数据存储目录相关
const DATA_PATH = join(process.cwd(), 'data')
const SEMESTER_PATH = join(DATA_PATH, `${config.SEMESTER_ID}`)
const HTML_PATH = join(SEMESTER_PATH, 'jwfw.html')
const JSON_PATH = join(SEMESTER_PATH, `jwfw.json`)

/** 获取 jwfw 中开课大纲数据并解析存储 */
async function getJwfw() {
  // 爬取课程大纲页并写入 jwfw.html

  logger.info('正在爬取课程大纲页，可能需要等待数分钟...')
  const jwfwHtml = await axios.post(
    'https://jwfw.fudan.edu.cn/eams/stdSyllabus!search.action',
    formUrlEncoded({
      'lesson.project.id': 1,
      'lesson.semester.id': config.SEMESTER_ID,
      _: +new Date(),
      pageNo: 1,
      pageSize: 9999,
    }),
    {
      headers: HEADERS,
      responseType: 'stream',
    },
  )

  mkdirSync(SEMESTER_PATH, { recursive: true })
  const writer = createWriteStream(HTML_PATH)
  await jwfwHtml.data.pipe(writer)

  writer.on('finish', () => {
    logger.success('课程大纲页爬取完毕')

    // 读取写入完成的 HTML
    const html = readFileSync(HTML_PATH, 'utf-8')
    if (html.includes('<h2>统一身份认证</h2>')) {
      logger.error(
        '爬取到的课程大纲页无有效数据，可能是登录态失效所致，请尝试更新 JWFW_COOKIES 后重新爬取',
      )
      process.exit(1)
    }

    // 解析 HTML
    logger.info('正在解析课程大纲页数据...')
    const doc = new DOMParser().parseFromString(
      xmlser.serializeToString(parse5.parse(html)),
    )
    const select = xpath.useNamespaces({ x: 'http://www.w3.org/1999/xhtml' })

    const rows = select('//x:tbody/x:tr', doc)
    logger.info(`共解析出 ${rows.length} 门课程`)

    /** 用 XPATH 解析出每一行中的数据 */
    const jwfwItems: JwfwItem[] = rows.map((row) => {
      const id =
        select('x:td[1]/x:input/@value', row as Node)[0]
          .toString()
          .match(/\d+/)?.[0] || ''
      // console.log('正在处理课程', id)
      const no =
        select('x:td[2]/text()', row as Node)[0]
          ?.toString()
          ?.trim() ||
        select('x:td[2]/x:a/text()', row as Node)[0]
          ?.toString()
          ?.trim() ||
        ''
      const name =
        select('x:td[3]/text()', row as Node)[0]
          ?.toString()
          ?.trim() || ''
      const credits =
        select('x:td[4]/text()', row as Node)[0]
          ?.toString()
          ?.trim() || ''
      const teachers =
        select('x:td[5]/text()', row as Node)[0]
          ?.toString()
          ?.trim() || ''
      const titles =
        select('x:td[6]/text()', row as Node)[0]
          ?.toString()
          ?.trim() || ''
      const department =
        select('x:td[7]/text()', row as Node)[0]
          ?.toString()
          ?.trim() || ''
      return {
        id: parseInt(id, 10),
        no,
        name,
        credits: parseInt(credits, 10),
        teachers,
        titles,
        department,
      }
    })

    writeFileSync(JSON_PATH, JSON.stringify(jwfwItems))
    logger.success(`结果位于 ${JSON_PATH}`)
  })
}

getJwfw()
