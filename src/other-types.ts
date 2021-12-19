import { JwfwXkItem } from './types'

/** 课时详情 */
export interface DBArrangeInfo {
  /** 星期几，1 对应星期一 */
  weekDay: number
  /** 开始课时，从 1 开始 */
  startUnit: number
  /** 结束课时，从 1 开始 */
  endUnit: number
  /** 上课地点 */
  rooms: string
  /** 上课周语义描述 */
  weekStateDigest: string
}

/** 选课数据条目 */
export interface DBLessonItem {
  /** 课程唯一 ID */
  id: number
  /** 课程序号 */
  no: string
  /** 学期 */
  semester: string
  /** 开课院系 */
  department: string
  /** 课程代码 */
  code: string
  /** 课程名 */
  name: string
  /** 课程分类 */
  category: string
  /** 学分 */
  credits: number
  /** 授课教师列表 */
  teachers: string
  /** 校区名称 */
  campusName: string
  /** 备注 */
  remark: string
  /** 考试类型名称 */
  examFormName: string
  /** 考试时间 */
  examTime: string
  /** 是否允许期中退课 */
  withdrawable: boolean
  /** 排课时间段 */
  arrangeInfo: DBArrangeInfo[]
  /** 选课人数上限 */
  maxStudent: number
}

/** 课时详情 */
export interface OldArrangeInfo {
  /** 课时安排 ID，从 0 开始 */
  id: number
  /** 课时安排 ID，全局唯一 */
  aid: number
  /** 对应课程 ID */
  cid: number
  /** 星期几，1 对应星期一 */
  weekDay: number
  /** 课程起始时间，11-13 对应当日第 11-13 节课 */
  section: string
  /** 上课地点 */
  rooms: string
  /** 教师容量 */
  capacity: string
  /** 上课周语义描述 */
  weekStateDigest: string
  /** 授课教师列表 */
  teachers: string[]
}

/** 选课数据条目 */
export interface OldXkItem {
  /** 课程唯一 ID */
  id: number
  /** 课程序号 */
  no: string
  /** 学期 */
  semester: string
  /** 课程代码 */
  code: string
  /** 课程名 */
  name: string
  /** 学分 */
  credits: number
  /** 开课院系 */
  department: string
  /** 校区名称 */
  campusName: string
  /** 授课语言 */
  language: string
  /** 备注 */
  remark: string
  /** 考试类型名称 */
  examFormName: string
  /** 考试时间 */
  examTime: string
  /** 是否允许期中退课 */
  withdrawable: boolean | '是' | '否' | ''
  /** 三轮选课限制 */
  r3limit: string
  /** 排课时间段 */
  arrangeInfo: OldArrangeInfo[]
  /** 选课人数上限 */
  maxStudent: number
  /** 公选人数上限 */
  maxPublic: number
}

/** 选课数据条目 */
export interface RealXkItem extends JwfwXkItem {
  semester: string
}
