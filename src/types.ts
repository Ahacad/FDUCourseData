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
