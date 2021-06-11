/** 课程大纲页数据条目 */
export interface JwfwItem {
  /** 课程 ID */
  id: number
  /** 课程序号 */
  no: string
  /** 课程名称 */
  name: string
  /** 学分 */
  credits: number
  /** 授课教师 */
  teachers: string
  /** 职称 */
  titles: string
  /** 开课院系 */
  department: string
}

/** 课时详情 */
export interface ArrangeInfo {
  /** 星期几，1 对应星期一 */
  weekDay: number
  /** 开始课时，从 1 开始 */
  startUnit: number
  /** 结束课时，从 1 开始 */
  endUnit: number
  /** 上课地点 */
  rooms: string
  /** 上课周位图 */
  weekState: string
  /** 上课周语义描述 */
  weekStateDigest: string
}

/** 选课数据条目 */
export interface XkItem {
  /** 课程唯一 ID */
  id: number
  /** 课程序号 */
  no: string
  /** 课程代码 */
  code: string
  /** 课程名 */
  name: string
  /** 学分 */
  credits: number
  /** 起始周 */
  startWeek: number
  /** 结束周 */
  endWeek: number
  /** 是否有教材 */
  hasTextBook: boolean
  /** 总学时 */
  period: number
  /** 周学时 */
  weekHour: number
  /** 不确定，或许是是否已确定时间和教室 */
  scheduled: boolean
  /** 授课教师列表 */
  teachers: string
  /** 教材 */
  textbooks: string
  /** 课程集唯一 ID */
  courseId: number
  /** 课程集类型代号 */
  courseTypeCode: string
  /** 课程集类型 ID */
  courseTypeId: number
  /** 课程集类型名称 */
  courseTypeName: string
  /** 校区编号 */
  campusCode: string
  /** 校区名称 */
  campusName: string
  /** 备注 */
  remark: string
  /** 考试类型名称 */
  examFormName: string
  /** 考试时间 */
  examTime: string
  /** 是否允许期中退课 */
  withdrawable: boolean | '是' | '否' | ''
  /** 排课时间段 */
  arrangeInfo: ArrangeInfo[]
  /** 选课人数上限 */
  maxStudent: number
}

/** 加入 jwfw 补充信息的 xk 条目 */
export interface JwfwXkItem extends XkItem {
  /** 开课院系 */
  department: string
}
