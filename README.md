# 复旦大学历年本科开课数据爬虫

## 使用说明

### 我想要历年课程数据

如果你只需要已经爬取好的课程数据包，可以前往 [Releases](https://github.com/CLDXiang/FDUCourseData/releases) 页面下载所需数据包。

⚠️ 注意：[2021冬季学期及以前的数据](https://github.com/CLDXiang/FDUCourseData/releases/tag/old)为旧版格式，与新版爬虫脚本生成的格式并不完全一致，若需要统一格式请自行处理。本仓库的 Releases 页面仅出于备份数据目的。

### 我想要爬取本学期课程数据

#### 0. 做好准备

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

#### 1. 获取要爬取的学期 ID

每个学期都有一个唯一的整数作为其 ID，其会作为之后爬虫请求中一个必填的参数，所以我们需要先得到它。

获取单个学期 ID 最简单的方法就是登录 jwfw，进入“我的”->“课程大纲查询”，切换到要查询的学期后，看浏览器 URL 参数中 `lesson.semester.id` 这一项对应的值。

如果要查看过往所有学期的 ID 映射，需要使用浏览器开发者工具，捕获上述页面的 Network 中 `dataQuery.action` 这个请求，其中会包含所有 ID 映射数据。

在获取到要爬取的学期 ID 后，请将其填入 `config.json` 中 `SEMESTER_ID` 这一项。

#### 2. 配置登录态

由于学校登录系统逻辑时不时会改变（加上我懒），所以我并没有做自动登录逻辑。每次爬取前需要手动登录 xk 后将本地 Cookies 复制到配置文件中，以拿到网页中的登录态。

**⚠️ 注意：Cookies 是学校网站判断你身份的凭据，请不要将它泄露给别人，否则相当于将账号和密码交给别人。**

拿 Cookies 的方法：

1. 进入 xk 网站页面并登录
1. 打开浏览器开发者工具（一般快捷键是 F12，或者右键“检查”/“审查元素”）
1. 选中“Network”栏后，随便点击页面中某个不会导致跳转的链接（比如左侧菜单里的选项）
1. 随便点击一个类型为 XHR 的请求，找到“Request Headers”中“cookie”这一项，**完整**复制其内容，就是我们要的 Cookies

将拿到的 Cookies 填入到 `config.json` 中对应的 `XK_COOKIES` 中即可。现在在一段时间内我们拥有了登录态。

#### 3. 运行爬取脚本

<!-- TODO: profileId -->

在项目根目录运行：

```shell
yarn xk
```

即可爬取到当前账号在当前学期所有可选课程的数据。

#### 4. （可选）合并结果

如果需要合并两份爬取到的数据（比如男生女生账号），将需要合并的 JSON 文件放到 `data/combine` 目录下，在项目根目录运行：

```shell
yarn combine
```

即可将 `data/combine` 中所有 ID 不同的课程合并到一个 JSON 文件下。

#### 关于 xk 的注意事项

- 每个学生账号只能搜索到自己在三轮选课中可以选择的课程，所以对限制年级、限制专业、限制性别的课程（如体育）需要合并多个账号的爬取结果才能得到完整数据。建议至少分别至少使用一个男生和一个女生账号进行爬取（大一最好）。
- 每学期可爬取到的课程和课程信息（如上课地点等）会随选课轮次更新，一般到三轮选课才可以获得完整开课信息
- Cookies 登录态一段时间无活动会过期，每次爬取前请手动更新配置文件中的 Cookies
- 如果在网页端触发了登出操作（包括“另一设备已经登陆”这种情况），Cookies 会失效，所以程序运行期间尽量不要用其他设备登录 jwfw 或 xk

### 开课院系？

开课院系无法从 xk 获取，仅能在 jwfw 课程大纲列表拿到，如果需要这一字段，需要另外从 jwfw 爬取。

#### 1. 准备工作

和 xk 部分一样，需要先安装好前置依赖，并且获取到 jwfw 的 Cookies（和 xk 不通用），填入 `config.json` 的 `JWFW_COOKIES` 字段。

#### 2. 爬取大纲列表数据

运行如下命令来爬取到指定学期的大纲列表数据：

```shell
yarn jwfw
```

#### 3. 注入 xk 数据

将 xk 数据放到 `data/insert/xk.json`，将大纲列表数据放到 `data/insert/jwfw.json`，运行：

```shell
yarn insert
```

该脚本会试图把大纲列表数据中的开课院系字段插入到 xk 数据中对应课程的数据中，并且输出仅存在于某一边的课程列表。

#### 关于 jwfw 的注意事项

- 极少数课程因不明原因仅能在 jwfw 或 xk 其中一边爬取到，且不同同学有所区别，原因不明
- jwfw 课程大纲有时会在很晚才发布，在发布前运行爬虫是没有用滴，请先在网页上确认有数据

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

学校于 2021 年初下线了 jwfw 课程大纲中每门课程的详情页，导致此后的学期无法再爬取到部分字段，这些字段的爬取程序不再存于此仓库，仅在 [Releases](https://github.com/CLDXiang/FDUCourseData/releases) 中过往学期的数据存有备份：

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
