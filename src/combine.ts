import { existsSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { XkItem } from './types'
import { logger, readJSONFile } from './utils'

// 数据存储目录相关
const COMBINE_PATH = join(process.cwd(), 'data', 'combine')
if (!existsSync(COMBINE_PATH)) {
  logger.error(`请将待合并 JSON 文件放入 ${COMBINE_PATH} 目录后再运行`)
  process.exit(1)
}
const RES_PATH = join(process.cwd(), 'data', 'combine.json')

const fileNames = readdirSync(COMBINE_PATH).filter((fileName) =>
  fileName.endsWith('.json'),
)

if (fileNames.length === 0) {
  logger.error(`${COMBINE_PATH} 目录下没有 JSON 文件`)
  process.exit(1)
}

/** 结果数组 */
const allXkItems: XkItem[] = []
/** 已经处理过的课程 ID 集合 */
const processedIds = new Set<number>()

/** 遍历课程计数器 */
let allCourseCnt = 0
/** 跳过文件计数器 */
let skippedFile = 0

fileNames.forEach((fileName, i) => {
  logger.info(`正在处理 ${fileName} (${i + 1}/${fileNames.length})...`)
  const fileContent = readJSONFile(join(COMBINE_PATH, fileName)) as
    | Record<string, any>
    | XkItem[]

  if (!Array.isArray(fileContent)) {
    logger.error(`文件 ${fileName} 存储的不是数组，跳过`)
    skippedFile += 1
  } else {
    fileContent.forEach((xkItem) => {
      // TODO: 对对象字段进行格式校验

      if (xkItem.id && !processedIds.has(xkItem.id)) {
        // 如果 id 存在且未被处理过，将该项加入结果
        allXkItems.push(xkItem)
        processedIds.add(xkItem.id)
      }

      allCourseCnt += 1
    })
  }
})

writeFileSync(RES_PATH, JSON.stringify(allXkItems))
if (skippedFile) {
  logger.warn(`共跳过 ${skippedFile} 个文件`)
}
logger.success(`共 ${allCourseCnt} 条课程数据被合并为 ${processedIds.size} 条`)
logger.success(`合并结果位于 ${RES_PATH}`)
