import { existsSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { logger, readJSONFile, getLessonCategory } from './utils'
import { OldXkItem, DBLessonItem, RealXkItem } from './other-types'

// 数据存储目录相关
const TRANSFORM_PATH = join(process.cwd(), 'data', 'transform')
if (!existsSync(TRANSFORM_PATH)) {
  logger.error(`请将待转换的 JSON 文件放入 ${TRANSFORM_PATH} 目录后再运行`)
  process.exit(1)
}

const fileNames = readdirSync(TRANSFORM_PATH).filter((fileName) =>
  fileName.endsWith('.json'),
)

if (fileNames.length === 0) {
  logger.error(`${TRANSFORM_PATH} 目录下没有 JSON 文件`)
  process.exit(1)
}

/** 遍历课程计数器 */
let allCourseCnt = 0
/** 跳过文件计数器 */
let skippedFile = 0

const unCategoriedXkItems: DBLessonItem[] = []

function combineTeachers(oldTeachers: string[][]) {
  const teachers = new Set<string>()
  for (const teacher of oldTeachers) {
    for (const tcr of teacher) {
      teachers.add(tcr)
    }
  }
  return Array.from(teachers).join(',')
}

function dealWithdrawable(drop: boolean | '是' | '否' | '') {
  if (drop === '是') {
    return true
  }
  if (drop === '否') {
    return false
  }
  if (drop === '') {
    return true
  }
  if (typeof drop !== 'boolean') {
    logger.warn(`unknown withdrawable ${drop}`)
  }
  return drop
}

function isRealXkItem(xk: RealXkItem | OldXkItem): xk is RealXkItem {
  return xk.scheduled !== undefined
}

fileNames.forEach((fileName, i) => {
  logger.info(`正在处理 ${fileName} (${i + 1}/${fileNames.length})...`)
  const fileContent = readJSONFile(join(TRANSFORM_PATH, fileName)) as
    | Record<string, any>
    | RealXkItem[]
    | OldXkItem[]

  if (!Array.isArray(fileContent)) {
    logger.error(`文件 ${fileName} 存储的不是数组，跳过`)
    skippedFile += 1
  } else {
    const RES_PATH = join(process.cwd(), 'data', fileName)

    /** 结果数组 */
    const allXkItems: DBLessonItem[] = []

    fileContent.forEach((xkItem) => {
      // TODO: 对对象字段进行格式校验

      const lesson: DBLessonItem = {
        id: xkItem.id,
        no: xkItem.no,
        semester: xkItem.semester,
        code: xkItem.code,
        name: xkItem.name,
        category: getLessonCategory(xkItem.no),
        credits: xkItem.credits,
        department: xkItem.department,
        campusName: xkItem.campusName,
        remark: xkItem.remark,
        examFormName: xkItem.examFormName,
        examTime: xkItem.examTime,
        withdrawable: dealWithdrawable(xkItem.withdrawable),
        maxStudent: xkItem.maxStudent,
        teachers: '',
        arrangeInfo: [],
      }

      if (lesson.category === '未分类') {
        unCategoriedXkItems.push(lesson)
      }

      if (isRealXkItem(xkItem)) {
        // 新数据
        lesson.teachers = xkItem.teachers
        lesson.arrangeInfo = xkItem.arrangeInfo.map((arrange) => ({
          weekDay: arrange.weekDay,
          startUnit: arrange.startUnit,
          endUnit: arrange.endUnit,
          rooms: arrange.rooms,
          weekStateDigest: arrange.weekStateDigest,
        }))
        allXkItems.push(lesson)
      } else {
        // 旧数据
        lesson.teachers = combineTeachers(
          xkItem.arrangeInfo.map((arrange) => arrange.teachers),
        )
        lesson.arrangeInfo = xkItem.arrangeInfo.map((arrange) => ({
          weekDay: arrange.weekDay,
          startUnit: Number(arrange.section.split('-')[0]),
          endUnit: Number(arrange.section.split('-')[1]),
          rooms: arrange.rooms,
          weekStateDigest: arrange.weekStateDigest,
        }))

        allXkItems.push(lesson)
      }

      allCourseCnt += 1
    })
    writeFileSync(RES_PATH, JSON.stringify(allXkItems))
  }
})

if (skippedFile) {
  logger.warn(`共跳过 ${skippedFile} 个文件`)
}
logger.success(`共处理 ${allCourseCnt} 条课程数据`)
logger.warn(`未分类 ${unCategoriedXkItems.length} 条课程数据`)
