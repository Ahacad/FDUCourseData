import { existsSync, readFileSync, PathLike } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

export const logger = {
  /** output a error message */
  error(msg: string) {
    console.error(`${chalk.red('error')} ${msg}`)
  },
  /** output a warning message */
  warn(msg: string) {
    console.warn(`${chalk.yellow('warn')} ${msg}`)
  },
  /** output a success message */
  success(msg: string) {
    console.log(`${chalk.green('success')} ${msg}`)
  },
  /** output a normal message */
  info(msg: string) {
    console.log(`${chalk.blueBright('info')} ${msg}`)
  },
}

/** 配置对象 */
const config = {
  /** 学期 ID */
  SEMESTER_ID: 0,
  /** jwfw cookies */
  JWFW_COOKIES: '',
  /** xk cookies */
  XK_COOKIES: '',
  /** xk profileId */
  XK_PROFILE_ID: '',
}

const CONFIG_FILE_PATH = join(process.cwd(), 'config.json')

if (!existsSync(CONFIG_FILE_PATH)) {
  logger.error(
    '请在根目录创建 config.json 文件，可直接重命名 config.example.json 为 config.json',
  )
  process.exit(1)
}

export function readJSONFile(path: PathLike) {
  let parsedFileContent
  try {
    /** config.json 文件内容 */
    parsedFileContent = JSON.parse(readFileSync(path, 'utf-8'))
  } catch (err) {
    if (err.message === 'Unexpected end of JSON input') {
      logger.error(`${path} 文件不是标准 JSON 格式`)
      process.exit(1)
    }
    throw err
  }
  return parsedFileContent
}

/** config.json 文件内容 */
const parsedConfigFileContent = readJSONFile(CONFIG_FILE_PATH)

if (parsedConfigFileContent.SEMESTER_ID) {
  config.SEMESTER_ID = parsedConfigFileContent.SEMESTER_ID
}
if (parsedConfigFileContent.JWFW_COOKIES) {
  config.JWFW_COOKIES = parsedConfigFileContent.JWFW_COOKIES
}
if (parsedConfigFileContent.XK_COOKIES) {
  config.XK_COOKIES = parsedConfigFileContent.XK_COOKIES
}
if (parsedConfigFileContent.XK_PROFILE_ID) {
  config.XK_PROFILE_ID = parsedConfigFileContent.XK_PROFILE_ID
}

/** 将对象转为 Form Data 格式 */
export const formUrlEncoded = (x: Record<string, any>) =>
  Object.keys(x).reduce((p, c) => `${p}&${c}=${encodeURIComponent(x[c])}`, '')

/** 暂停数毫秒
 *
 * 注意，不要在 forEach/map/filter 等方法内使用该函数，因为它们会默认并行化要迭代的任务，请使用 for of
 */
export const sleep = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/** 课程代码前缀集合 */
export const CODE_PREFIXES = [
  'HIST13',
  'JOUR13',
  'INFO13',
  'MED130',
  'ECON11',
  'PHYS13',
  'PHAR13',
  'ECON13',
  'BIOL11',
  'MANA13',
  'PHIL11',
  'CHEM12',
  'ICES13',
  'PTSS11',
  'ENGL11',
  'MUSE13',
  'FORE13',
  'PEDU11',
  'ENVI13',
  'COMP11',
  'MACR11',
  'PHIL13',
  'HIST12',
  'CHEM13',
  'SOCI13',
  'CHIN13',
  'MATH13',
  'PHIL12',
  'CHIN11',
  'SOSC12',
  'LAWS13',
  'MACR13',
  'MATE13',
  'COMP13',
  'PHPM13',
  'BIOL13',
  'SOFT13',
  'GNUR13',
  'ENVI11',
  'GNUR11',
  'PHYS12',
  'FORE11',
  'CHEM11',
  'JOUR11',
  'MATE11',
  'XDSY11',
  'SOCI11',
  'LAWS11',
  'MECH13',
  'PHAR11',
  'TOUR13',
  'ECON12',
  'MED110',
  'FINE11',
  'HIST11',
  'ECON16',
  'POLI13',
  'MANA12',
  'JOUR17',
  'SOFT11',
  'PHPM11',
  'ICES11',
  'MED119',
  'TCPH13',
  'POLI11',
  'MECH11',
  'PHYS11',
  'JOUR16',
  'MATH12',
  'NURS13',
  'NDEC11',
  'INFO12',
  'JOUR12',
  'ICES12',
  'MATH11',
  'CHIN12',
  'TFSY11',
  'MED116',
  'NURS11',
  'FORE12',
  'INFO11',
  'RZSY11',
  'LAWS16',
  'MANA11',
  'LAWS12',
  'BIOL12',
  'STUO11',
  'MUSE12',
  'JWCH11',
  'POLI16',
  'ZDSY11',
  'COMP12',
  'KQSY11',
  'TOUR11',
  'TCPH11',
  'ECON17',
  'HIST17',
  'POLI17',
  'ICES17',
  'SOCI17',
  'MANA17',
  'PTSS17',
  'LAWS17',
  'ENVI17',
  'SOFT12',
  'DATA13',
  'MED115',
  'MUSE11',
  'PEDU17',
  'CHIN17',
  'SOCI12',
  'PTSS01',
  'MATH01',
  'ENGL01',
  'MICR11',
  'DATA11',
  'ATMO11',
  'INNO11',
  'MATE17',
  'MED170',
  'MATH17',
  'ATMO13',
  'MICR12',
  'MICR13',
  'PTSS13',
]

/** 映射分类 */
export function getLessonCategory(code: string): string {
  if (/NDEC110002|NDEC110004|NDEC110005/.test(code)) {
    return '军理'
  }
  if (/PEDU/.test(code)) {
    return '体育'
  }
  if (
    /PTSS110067|PTSS110082|PTSS110087|PTSS110088|PTSS110089|PTSS110079|PTSS110072|PTSS110073|PTSS110053|PTSS110008|PTSS110058|PTSS110059|PTSS110060|PTSS110061|STUO11000(1|2|3|4)/.test(
      code,
    )
  ) {
    return '思政·A组'
  }
  if (
    /PTSS110005|PTSS110012|PTSS110016|PTSS110042|PTSS110056|PTSS110063|PTSS110064|PTSS110083|PTSS110062|PTSS110068|PTSS110069|PTSS110070|PTSS110080|PTSS110084|PTSS110085|PTSS110086|PTSS110081/.test(
      code,
    )
  ) {
    return '思政·B组'
  }
  if (
    /CHIN11900|CHIN11901|CHIN11902(2|3|4|5|6)|HIST119002|HIST119024|HIST119018|HIST119035|HIST119038|PHIL119006|PHIL119008|PHIL119013|PHIL119017|PHIL119022|PHIL119052/.test(
      code,
    )
  ) {
    return '一模'
  }
  if (
    /CHIN119020|PHIL11900(2|3|5)|PHIL11901(0|1|4|5|6|8)|PHIL11902(3|5|7)|PHIL11903|PHIL11904(?!7|8|9)|PHIL11905(0|3|4|5|6|7)|HIST119021|POLI11900(2|6)|PTSS119006/.test(
      code,
    )
  ) {
    return '二模'
  }
  if (
    /FORE11900(3|4|5|6|7|8|9)|HIST11900(3|5|7|8|9)|HIST11901(2|4|5|6|7|9)|HIST11902|HIST11903|HIST11904(0|1|3|4|6)|PHIL119020|PHIL11904|POLI11900(4|7)/.test(
      code,
    )
  ) {
    return '三模'
  }
  if (/ECON119|JOUR119|LAWS119|POLI119|SOCI11900(3|4|5)/.test(code)) {
    return '四模'
  }
  if (
    /CHEM119|COMP119|INFO119|MACR119|MATE119|MATH119|MECH119|MED119005|PHYS119|SOFT119|TCPH119/.test(
      code,
    )
  ) {
    return '五模'
  }
  if (
    /BIOL119|ENVI119|MED119001|HIST11904(2|7)|PHAR119|PHPM119|PTSS119(?!005)/.test(
      code,
    )
  ) {
    return '六模'
  }
  if (
    /CHIN119021|FORE11900(2|5)|FINE119|MUSE119|FINE110(?!022|023|024|025|069|083|085|086|090|091|092|094|096)|PTSS119005|PHIL119051|HIST11904(5|8)/.test(
      code,
    )
  ) {
    return '七模'
  }
  if (
    /ENGL110050|ENGL110051|ENGL110070|ENGL110079|ENGL110059|ENGL110049/.test(
      code,
    )
  ) {
    return '大英基础'
  }
  if (/ENGL110(068|012|077|033|035|074|043|042|025|064|061)/.test(code)) {
    return '英语进阶·通用学术英语'
  }
  if (/ENGL110(073|078|066)/.test(code)) {
    return '英语进阶·专用学术英语'
  }
  if (/ENGL110(009|072|024|076|069|071|054|057|065|063)/.test(code)) {
    return '英语进阶·英语文化'
  }
  if (/ENGL110(067|036|056|060|062)/.test(code)) {
    return '英语高阶·通用学术英语'
  }
  if (/ENGL110(045|046|047|048|055)/.test(code)) {
    return '英语高阶·专用学术英语'
  }
  if (
    /FORE11004|FORE11005|FORE11006(0|4|5)|FORE110092|FORE110079|FORE11008(0|8|3|4|5|6|7)|FORE110109|FORE11011/.test(
      code,
    )
  ) {
    return '二外'
  }
  if (
    /COMP110001|COMP110034|COMP110032|COMP110033|COMP110003|COMP110004|COMP110036|COMP110037|COMP110042|COMP110043|COMP110044/.test(
      code,
    )
  ) {
    return '大学计算机基础'
  }
  if (
    /INNO115|CHIN115|FORE115|BIOL115|POLI115|JOUR115|LAWS115|PTSS115|COMP115|ECON115|FINE115|ICES115|INFO115|MACR115|MANA115|ATMO115|ENVI115|SOFT115|PHYS115|MATE115|MATH115|MECH115|MICR115|MUSE115|NURS115|PHAR115|PHIL115|PHPM115|SOCI115|TCPH115|TOUR115|CHEM115|DATA115|MED115/.test(
      code,
    )
  ) {
    return '三创'
  }
  if (
    /CHIN110|ICES110|ICES170|FORE110(001|006|007|013|021|030|031|036|037|038|039|061|062|063|066|068|071|073|074|075|076|077|081|082|093|094|095|096|097|098|099|100|101|102|103|104|105|106|107|108|121)|HIST110|JOUR110|MUSE110|PHIL110(?!052)|PTSS110(017|009|02|049|075|039|040|044|052)|NDEC110006|FINE110(022|023|024|025|069)/.test(
      code,
    )
  ) {
    return '通选·人文艺术'
  }
  if (
    /MANA116|ECON110|LAWS110|MANA110|POLI110(?!065|066)|POLI116|PTSS110(015|041)|SOCI110(?!061|062|063|071)|SOCI116|TOUR110/.test(
      code,
    )
  ) {
    return '通选·社会科学'
  }
  if (
    /ATMO110|MECH110|BIOL110|CHEM110|COMP110(007|009|014|016|017|018|026|029|030|031|038|039|040|041|045)|ENVI110(?!021)|INFO110|MACR110|MATE110(?!024)|MATH110|PHYS110|SOFT110(?!014)|TCPH110/.test(
      code,
    )
  ) {
    return '通选·自然科学'
  }
  if (/MED110(?!062)|MED116|NURS110|PHAR110(?!034)|PHPM110/.test(code)) {
    return '通选·医学与药学'
  }
  if (/KQSY|RZSY|TFSY|XDSY|ZDSY/.test(code)) {
    return '书院新生'
  }
  if (
    /FINE110(083|085|086|090|091|092|094|096)|MED110062|PHAR110034|FINE110094|MICR110001|SOCI110|SOFT110014/.test(
      code,
    )
  ) {
    return '行知课程·服务学习'
  }
  if (/POLI110065|PHIL110052|POLI110066/.test(code)) {
    return '行知课程·咨政服务'
  }
  if (/SOCI17|JOUR17|POLI17/.test(code)) {
    return '暑期国际·中国社会与政治'
  }
  if (/CHIN17|FORE17|PHIL17|PTSS17|HIST17|FINE17/.test(code)) {
    return '暑期国际·中国历史与文化'
  }
  if (/MANA17|ECON17(?!026|028|029)|LAWS17/.test(code)) {
    return '暑期国际·中国经济与管理'
  }
  if (/MATH17|MATE110024|MATE17|ENV117|MED17|ECON17(026|028|029)/.test(code)) {
    return '暑期国际·科学技术'
  }
  if (/CHIN120012|HIST120012|PHIL120012|PHIL120013/.test(code)) {
    return '人文基础·必修'
  }
  if (
    /CHIN120(?!012)|HIST120(?!012)|MUSE120|PHIL120(?!012|013)|JOUR120|FORE120|ICES120/.test(
      code,
    )
  ) {
    return '人文基础·选修'
  }
  if (/SOSC120/.test(code)) {
    return '社科基础'
  }
  if (
    /MATH1200(02|03|04|05|06|07|12|13|14|15|16|17|20|21|22|44|45|)/.test(code)
  ) {
    return '非数学类基础·必修'
  }
  if (/PHYS120|CHEM120|BIOL120/.test(code)) {
    return '自然科学·基础'
  }
  if (/COMP120|INFO120|MICR120/.test(code)) {
    return '技术科学·基础'
  }
  if (/CHIN13/.test(code)) {
    return '中文专业'
  }
  if (/FORE13/.test(code)) {
    return '外院专业'
  }
  if (/PHIL13/.test(code)) {
    return '哲学专业'
  }
  if (/ECON13/.test(code)) {
    return '经院专业'
  }
  if (/MANA13/.test(code)) {
    return '管院专业'
  }
  if (/LAWS13/.test(code)) {
    return '法学专业'
  }
  if (/SOCI13/.test(code)) {
    return '社政专业'
  }
  if (/POLI13/.test(code)) {
    return '国务专业'
  }
  if (/JOUR13/.test(code)) {
    return '新闻专业'
  }
  if (/HIST13/.test(code)) {
    return '历史专业'
  }
  if (/TOUR13/.test(code)) {
    return '旅游专业'
  }
  if (/ICES13/.test(code)) {
    return '国交专业'
  }
  if (/MUSE13/.test(code)) {
    return '文博专业'
  }
  if (/MATH120(010|011)/.test(code)) {
    return '数院基础'
  }
  if (/MATH13/.test(code)) {
    return '数院专业'
  }
  if (/MANA12/.test(code)) {
    return '经管类基础'
  }
  if (/PHYS13/.test(code)) {
    return '物理专业'
  }
  if (/TCPH13/.test(code)) {
    return '核工专业'
  }
  if (/CHEM13/.test(code)) {
    return '化学专业'
  }
  if (/MATE13/.test(code)) {
    return '材料专业'
  }
  if (/MACR13/.test(code)) {
    return '高分子专业'
  }
  if (/ENVI13/.test(code)) {
    return '环科专业'
  }
  if (/COMP13/.test(code)) {
    return '计科专业'
  }
  if (/SOFT12/.test(code)) {
    return '软工基础'
  }
  if (/SOFT13/.test(code)) {
    return '软工专业'
  }
  if (/INFO13/.test(code)) {
    return '信院专业'
  }
  if (/MICR13/.test(code)) {
    return '微电专业'
  }
  if (/MECH13/.test(code)) {
    return '航系专业'
  }
  if (/BIOL13/.test(code)) {
    return '生科专业'
  }
  if (/DATA13/.test(code)) {
    return '大数据专业'
  }
  if (/ATMO13/.test(code)) {
    return '大气专业'
  }
  if (/MED13/.test(code)) {
    return '基医专业'
  }
  if (/PHPM13/.test(code)) {
    return '公卫专业'
  }
  if (/PHAR13/.test(code)) {
    return '药学专业'
  }
  if (/NURS13|GNUR13|GNUR11/.test(code)) {
    return '护理专业'
  }
  if (/911/.test(code)) {
    return '二专·汉语言'
  }
  if (/912/.test(code)) {
    return '二专·翻译'
  }
  if (/913/.test(code)) {
    return '二专·新闻'
  }
  if (/916/.test(code)) {
    return '二专·哲院'
  }
  if (/924/.test(code)) {
    return '二专·数据科学'
  }
  if (/927/.test(code)) {
    return '二专·法学'
  }
  if (/934/.test(code)) {
    return '二专·公管'
  }
  if (/942/.test(code)) {
    return '二专·会计'
  }
  if (/945/.test(code)) {
    return '二专·环境'
  }
  if (/968/.test(code)) {
    return '二专·经济'
  }
  if (/972/.test(code)) {
    return '二专·数据科学'
  }
  if (/993/.test(code)) {
    return '二专·对外汉语'
  }
  if (/PTSS13/.test(code)) {
    return '马院专业'
  }
  if (/PTSS01|MATH01|ENGL01/.test(code)) {
    return '预科'
  }
  return '未分类'
}

export { config }
