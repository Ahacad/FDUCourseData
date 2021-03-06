# 数据字段说明

- `arrangeInfo` 是一个数组，其中每一个元素是一个对象，下表中方便起见以 `arrangeInfo.<subField>` 表示 `arrangeInfo[i].<subField>`，即子字段是针对每一个子元素对象的
- `course` 开头的字段对应的是“课程代码相同的课程”相关的字段，下表说明中以“课程集”来指代这种情况

## 可从 xk 获取的数据

| 字段 | 类型 | 说明 | 示例 | 备注 |
| --- | --- | --- | --- | --- |
| id | number | 课程唯一 ID | 676528 | |
| no | string | 课程序号 | "COMP110004.02" | |
| code | string | 课程代码 | "COMP110004" | |
| name | string | 课程名称 | "计算机基础与数据库" | |
| credits | number | 学分 | 1 | |
| startWeek | number | 起始周 | 1 | |
| endWeek | number | 结束周 | 18 | |
| hasTextBook | boolean | 是否有教材 | false | |
| period | number | 总学时 | 36 | |
| weekHour | number | 周学时 | 4 | |
| scheduled | boolean | 不确定，或许是是否已确定时间和教室 | true | |
| teachers | string | 授课教师列表 | "张晓菊,成磊,曹庆,张涛" | 以英文逗号分隔 |
| textbooks | string | 教材 | "" | 现有数据中几乎都是空字符串 |
| courseId | number | 课程集唯一 ID | 42037 | |
| courseTypeCode | string | 课程集类型代号 | "06_02_04_01" | |
| courseTypeId | number | 课程集类型 ID | 103 | |
| courseTypeName | string | 课程集类型名称 | "计算机I组" | |
| campusCode | string | 校区编号 | "H" | |
| campusName | string | 校区名称 | "邯郸校区" | |
| remark | string | 备注 | "混合式教学" | |
| examFormName | string | 考试类型名称 | "闭卷" | |
| examTime | string | 考试时间 | "2021-06-20 08:00-22:00 第17周 星期日" | |
| withdrawable | boolean / string | 是否允许期中退课 | true | 此字段可能为正常布尔值或三个字符串之一："是", "否", "" |
| arrangeInfo | Array | 课时详情数组，具体见下方子字段说明 | | |
| arrangeInfo.weekDay | number | 课时在星期几 | 1 | 有效值 1~7，1 对应星期一，以此类推 |
| arrangeInfo.startUnit | number | 课时从第几节开始 | 1 | 闭区间，1 对应早上第一节课，以此类推 |
| arrangeInfo.endUnit | number | 课时到第几节结束 | 2 | 闭区间，2 对应早上第二节课，以此类推 |
| arrangeInfo.rooms | string | 课时上课地点 | "H4504" | |
| arrangeInfo.weekState | string | 课时上课周位图 | "00101010101010101000000000000000000000000000000000000" | 0 表示对应周不上课，1 表示上课 |
| arrangeInfo.weekStateDigest | string | 课时上课周（便于阅读） | "2-16双" | |
| maxStudent | number | 最大选课人数 | 120 | |

## 可从 jwfw 补全的数据

此处仅列出 jwfw 有而 xk 没有的字段：

| 字段 | 类型 | 说明 | 示例 | 备注 |
| --- | --- | --- | --- | --- |
| department | string | 开课院系 | "计算机科学技术学院" | |

## 可获取但不保留的数据

这些数据可用该爬虫获取，但出于对时效性、使用价值等方面的考虑，不会放入最终结果中：

- 实际选课人数
- 教师职称

## 目前已无法获取的数据

学校于 2021 年初下线了 jwfw 课程大纲中每门课程的详情页，导致此后的学期无法再爬取到部分字段，这些字段的爬取程序不再存于此仓库，仅在 [Releases](https://github.com/Ahacad/FDUCourseData/releases) 中过往学期的数据存有备份：

| 字段 | 类型 | 说明 | 示例 | 备注 |
| --- | --- | --- | --- | --- |
| language | string | 授课语言 | "中文" | |
| r3limit | string | 三轮选课限制 | "开放" | |
| arrangeInfo.id | number | 课时 ID（仅对当前课程唯一） | 1 | |
| arrangeInfo.aid | number | 课时 ID（全局唯一） | 883005 | |
| arrangeInfo.cid | number | 课时对应课程 ID | 676528 | 不必要，可以直接从上层数据中的 id 字段获取 |
| arrangeInfo.capacity | string | 课时上课地点教室容量 | "110" | |
| arrangeInfo.teachers | Array\<string\> | 课时授课教师 | \["方雁雁","朱晓松"\] | |
| maxPublic | number | 最大公选人数 | 30 | |
