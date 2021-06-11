# 复旦大学历年本科开课数据爬虫

## 功能说明

- [x] 爬取 jwfw 某学期开课数据
- [ ] 爬取 xk 当前开课数据
- [ ] 合并某学期 jwfw 和 xk 爬取到的数据，并输出两边互相缺失的课程列表
- [ ] 合并某学期多份爬取到的数据

## 使用说明

<!-- TODO: release 页面链接 -->

### 只需要数据包

如果你只需要现成课程数据包，那你并不需要手动运行程序爬取数据，前往 release 页面下载所需数据包就完事了。如果你想要手动爬取数据，请继续阅读以下小节。

### 做好准备

将源码下载或 clone 到本地，确保本地安装了较新版本的 [Node.js](https://nodejs.org/)，本程序应该可以直接用 NPM CLI 运行，但我喜欢用 [yarn](https://yarnpkg.com/) 🐶，所以本文说明中均使用 yarn。

要安装 yarn，可以执行：

```shell
npm i -g yarn
```

接下来在代码根目录执行下方命令来安装依赖：

```shell
yarn # 或者 yarn install
```

然后将项目根目录中的 `config.example.json` 重命名为 `config.json`。现在试试

```shell
yarn hello # 或者 yarn run hello
```

如果你的命令行向你打了个招呼，那说明准备工作相当 OK 👍。

### 该做什么

本程序提供了很多子功能，如果你需要获取一个学期的开课数据，大体上有以下步骤：

1. 拿到想要爬取的学期 ID
2. 配置登录态
3. 在选课窗口开放期间，用一个男生账号和一个女生账号分别爬取 xk 上的开课数据
4. 合并男女生数据
5. （可选）爬取 jwfw 开课大纲数据，补充字段

下面会具体说明各步骤如何操作。

### 如何获取学期 ID

每个学期都有一个唯一的整数作为其 ID，其会作为之后爬虫请求中一个必填的参数，所以我们需要先得到它。

获取单个学期 ID 最简单的方法就是登录 jwfw，进入“我的”->“课程大纲查询”，切换到要查询的学期后，看浏览器 URL 参数中 `lesson.semester.id` 这一项对应的值。

如果要查看过往所有学期的 ID 映射，需要使用浏览器开发者工具，捕获上述页面的 Network 中 `dataQuery.action` 这个请求，其中会包含所有 ID 映射数据。

在获取到要爬取的学期 ID 后，请将其填入 `config.json` 中 `SEMESTER_ID` 这一项。

### 配置登录态

由于学校登录系统逻辑时不时会改变（而且我懒），所以并没有做自动登录逻辑。每次爬取前需要手动登录 jwfw/xk 后将本地 Cookies 复制到配置文件中，以拿到网页中的登录态。

**⚠️ 注意：Cookies 是学校网站判断你身份的凭据，请不要将它泄露给别人，否则约等于将账号和密码交给别人。**

jwfw 和 xk 使用不同的登录态，所以在运行对应程序前请手动登录对应网站拿 Cookies。

拿 Cookies 的方法：

1. 进入对应网站页面并登录
1. 打开浏览器开发者工具（一般快捷键是 F12，或者右键“检查”/“审查元素”）
1. 选中“Network”栏后，随便点击页面中某个不会导致跳转的链接
1. 随便点击一个类型为 XHR 的请求，找到“Request Headers”中“cookie”这一项，**完整**复制其内容，就是我们要的 Cookies

将拿到的 Cookies 填入到 `config.json` 中对应的 `JWFW_COOKIES` 或 `XK_COOKIES` 中即可。现在在一定时间内我们拥有了登录态。

### 爬取 xk 数据

### 合并多份数据

### 爬取 jwfw 数据

### 用 jwfw 数据补全 xk 数据

## 一些注意事项

- 每学期的数据需要使用男生、女生账号各爬取一份后合并，因为如体育等课程一般仅能搜到对应自己性别的课程
- 类似上一条的原因，部分限制选取专业和年级的课程仅可由可选取的同学搜索到，需要人工发现并补全
- 极少数课程因不明原因仅能在 jwfw 或 xk 其中一边爬取到，且不同同学有所区别，原因不明
- 每学期可爬取到的课程和课程信息（如上课地点等）会随选课轮次更新，一般到三轮选课才可以获得完整开课信息
- Cookies 登录态一段时间无活动会过期，每次爬取前请手动更新配置文件中的 Cookies
- 如果在网页端触发了登出操作（包括“另一设备已经登陆”这种情况），Cookies 会失效，所以程序运行期间尽量不要用其他设备登录 jwfw 或 xk

## 数据字段说明

- `arrangeInfo` 是一个数组，其中每一个元素是一个对象，下表中方便起见以 `arrangeInfo.<subField>` 表示 `arrangeInfo[i].<subField>`，即子字段是针对每一个子元素对象的
- `course` 开头的字段对应的是“课程代码相同的课程”相关的字段，下表说明中以“课程集”来指代这种情况

### 可从 xk 获取的数据

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

### 可从 jwfw 补全的数据

此处仅列出 jwfw 有而 xk 没有的字段：

| 字段 | 类型 | 说明 | 示例 | 备注 |
| --- | --- | --- | --- | --- |
| department | string | 开课院系 | "计算机科学技术学院" | |

### 可获取但不保留的数据

这些数据可用该爬虫获取，但出于对时效性、使用价值等方面的考虑，不会放入最终结果中：

- 实际选课人数
- 教师职称

### 目前已无法获取的数据

学校于2021年初下线了 jwfw 课程大纲中每门课程的详情页，导致此后的学期无法再爬取到部分字段，这些字段的爬取程序不再存于此仓库，仅在 releases 中过往学期的数据存有备份：

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
