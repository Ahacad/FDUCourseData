import axios from 'axios'
import {
  mkdirSync,
  existsSync,
  createWriteStream,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import { XkItem } from './types'
import { config, formUrlEncoded, logger, CODE_PREFIXES, sleep } from './utils'

// TODO: 二轮窗口开放后进行测试

if (!config.SEMESTER_ID) {
  logger.error('请在 config.json 中配置学期 ID 字段 SEMESTER_ID')
  process.exit(1)
}
if (!config.XK_COOKIES) {
  logger.error('请在 config.json 中配置 xk 登录态字段 XK_COOKIES')
  process.exit(1)
}
if (!config.XK_PROFILE_ID) {
  logger.error('请在 config.json 中配置 xk 配置字段 XK_PROFILE_ID')
  process.exit(1)
}

const HEADERS = {
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'content-length': '39',
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  cookie: config.XK_COOKIES,
  origin: 'https://xk.fudan.edu.cn',
  referer: 'https://xk.fudan.edu.cn/xk/stdElectCourse!defaultPage.action',
  'sec-ch-ua':
    '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
}

// 数据存储目录相关
const DATA_PATH = join(process.cwd(), 'data')
const SEMESTER_PATH = join(DATA_PATH, `${config.SEMESTER_ID}`)
const RAW_PATH = join(SEMESTER_PATH, 'raw')
mkdirSync(RAW_PATH, { recursive: true })
const XK_PATH = join(SEMESTER_PATH, `xk.json`)

/** 爬取某一个代码前缀的所有课程信息 */
async function getDataByCode(prefix: string): Promise<boolean> {
  const OUTPUT_PATH = join(RAW_PATH, `${prefix}`)
  if (existsSync(OUTPUT_PATH)) {
    // 高频爬取比较敏感，所以如果想重新爬取需要手动删除上一次的文件来确认
    return false
  }
  // TODO: 失败后重试若干次，若检测到“请不要过快点击”字符串则动态增加间隔时间
  // 爬取前歇一会儿
  await sleep(1000)
  const res = await axios.post(
    `https://xk.fudan.edu.cn/xk/stdElectCourse!queryLesson.action?profileId=${config.XK_PROFILE_ID}`,
    formUrlEncoded({
      lessonNo: prefix,
      courseCode: '',
      courseName: '',
    }),
    {
      headers: HEADERS,
      responseType: 'stream',
    },
  )

  return new Promise<boolean>((r) => {
    const writer = createWriteStream(OUTPUT_PATH)
    res.data.pipe(writer)

    writer.on('finish', () => {
      r(true)
    })
  })
}

/** 爬取本学期所有前缀课程数据 */
async function getAllDataByCode() {
  let i = 0
  for (const prefix of CODE_PREFIXES) {
    logger.info(
      `正在爬取前缀为 ${prefix} 的课程数据 (${i + 1}/${CODE_PREFIXES.length})`,
    )
    const res = await getDataByCode(prefix)
    if (!res) {
      logger.warn(
        `文件 ${join(RAW_PATH, `${prefix}`)} 已存在，若需重新爬取请手动删除`,
      )
    }
    i += 1
  }
}

/** 将爬取到的文本转为可用 JSON 数据 */
function parseData(prefix: string) {
  const text = readFileSync(join(RAW_PATH, `${prefix}`), 'utf-8')
  const str1 = /var lessonJSONs = (\[.*\]);/.exec(text)?.[1]
  const str2 = /window\.lessonId2Counts=({.*})/.exec(text)?.[1]
  if (!str1 || !str2) {
    console.error(`${prefix} 中没有检测到正确的数据格式，请确认数据格式正确`)
    process.exit(1)
  }
  /* eslint-disable no-eval */
  const xkItems = eval(`(${str1})`) as XkItem[]
  const counts = eval(`(${str2})`) as Record<
    string,
    {
      sc: number
      lc: number
    }
  >
  /* eslint-enable no-eval */
  return xkItems.map((lesson) => ({
    // 本来该按照数据字段说明一一映射，但多存储一点数据总没有坏处，先全存下来好了
    ...lesson,
    maxStudent: counts[`${lesson.id}`].lc,
  }))
}

async function xk() {
  await getAllDataByCode()
  const rawFileNames = readdirSync(RAW_PATH).filter((fileName) =>
    /^[A-Z0-9]{6}$/.test(fileName),
  )

  let allXkItems: XkItem[] = []

  // 解析并合并所有前缀文件
  rawFileNames.forEach((fileName) => {
    const lessonsData = parseData(fileName)
    allXkItems = [...allXkItems, ...lessonsData]
  })

  writeFileSync(XK_PATH, JSON.stringify(allXkItems))
  logger.success(`输出课程数据于 ${XK_PATH}`)
}

xk()
