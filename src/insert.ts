import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { JwfwItem, JwfwXkItem, XkItem } from './types'
import { logger, readJSONFile } from './utils'

// 数据存储目录相关
const INSERT_PATH = join(process.cwd(), 'data', 'insert')
const XK_PATH = join(INSERT_PATH, 'xk.json')
const JWFW_PATH = join(INSERT_PATH, 'jwfw.json')
const RES_PATH = join(INSERT_PATH, 'insert.json')

if (!existsSync(XK_PATH)) {
  logger.error(`请将待注入的数据置于 ${XK_PATH} 后再运行`)
  process.exit(1)
}
if (!existsSync(JWFW_PATH)) {
  logger.error(`请将用于注入的数据置于 ${JWFW_PATH} 后再运行`)
  process.exit(1)
}

const xkItems = readJSONFile(XK_PATH) as XkItem[]
const jwfwItems = readJSONFile(JWFW_PATH) as JwfwItem[]

/** 课程 Id 到开课院系的映射 */
const id2Department: Record<number, string> = {}

// 用 jwfw 数据建立 Id 到院系映射
jwfwItems.forEach((jwfwItem) => {
  if (jwfwItem.id && jwfwItem.department) {
    id2Department[jwfwItem.id] = jwfwItem.department
  }
})

// 将开课院系注入，如果没有用空字符串
const jwfwXkItems: JwfwXkItem[] = xkItems.map((xkItem) => ({
  ...xkItem,
  department: id2Department[xkItem.id] || '',
}))

// 统计用
const xkItemIds = new Set(xkItems.map((xkItem) => xkItem.id))
const jwfwItemIds = new Set(jwfwItems.map((jwfwItem) => jwfwItem.id))
const xkOnlyItemIds = [...xkItemIds].filter(
  (xkItemId) => !jwfwItemIds.has(xkItemId),
)
const jwfwOnlyItemIds = [...jwfwItemIds].filter(
  (jwfwItemId) => !xkItemIds.has(jwfwItemId),
)
if (xkOnlyItemIds.length) {
  // 存在仅在 xk 有而 jwfw 无的课程
  logger.warn(
    `有 ${xkOnlyItemIds.length} 门课程仅存在于 xk 数据中，它们的注入结果将是空字符串：`,
  )
  xkOnlyItemIds.forEach((id) => {
    logger.warn(`  ${id}`)
  })
}
if (jwfwOnlyItemIds.length) {
  // 存在仅在 jwfw 有而 xk 无的数据
  logger.warn(
    `有 ${jwfwOnlyItemIds.length} 门课程仅存在于 jwfw 数据中，它们不会出现在最终结果中：`,
  )
  jwfwOnlyItemIds.forEach((id) => {
    logger.warn(`  ${id}`)
  })
}
writeFileSync(RES_PATH, JSON.stringify(jwfwXkItems))
logger.success(`注入结果位于 ${RES_PATH}`)
