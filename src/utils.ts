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
  if (/NDEC/.test(code)) {
    return '军理'
  }
  if (/PEDU/.test(code)) {
    return '体育'
  }
  if (
    /PTSS110067|PTSS110082|PTSS110079|PTSS110072|PTSS110073|PTSS110053|PTSS110008|PTSS110058|PTSS110059|PTSS110060|PTSS110061|STUO11000(1|2|3|4)/.test(
      code,
    )
  ) {
    return '思政 (A组)'
  }
  if (
    /PTSS110005|PTSS110012|PTSS110016|PTSS110042|PTSS110056|PTSS110063|PTSS110064|PTSS110083|PTSS110062|PTSS110068|PTSS110069|PTSS110070|PTSS110080|PTSS110084|PTSS110085|PTSS110086|PTSS110081/.test(
      code,
    )
  ) {
    return '思政 (B组)'
  }
  if (
    /CHIN11900|CHIN11901|CHIN11902(2|3|4|5)|HIST119002|HIST119024|HIST119018|HIST119035|PHIL119006|PHIL119008|PHIL119013|PHIL119017|PHIL119022|PHIL119052/.test(
      code,
    )
  ) {
    return '一模'
  }
  if (
    /CHIN119020|PHIL11900(2|3|5)|PHIL11901(0|1|4|5|6|8)|PHIL11902(3|5|7)|PHIL11903|PHIL11904(?!7|8|9)|PHIL11905(0|3|4|5|6|7)|HIST119021|POLI119002|PTSS119006/.test(
      code,
    )
  ) {
    return '二模'
  }
  if (
    /FORE11900(3|4|5|7|8|9)|HIST11900(3|5|7|8|9)|HIST11901(2|4|5|6|7|9)|HIST11902|HIST11903|PHIL119020|PHIL11904|HIST11904(0|1|3|4)|POLI119004/.test(
      code,
    )
  ) {
    return '三模'
  }
  if (/ECON119|JOUR119|LAWS119|POLI119|SOCI119/.test(code)) {
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
    /BIOL119|ENVI119|MED119001|HIST119042|PHAR119|PHPM119|PTSS119(?!005)/.test(
      code,
    )
  ) {
    return '六模'
  }
  if (
    /CHIN119021|FORE119002|FINE119|MUSE119|FINE110(?!022|023|024|025)|PTSS119005|PHIL119051|HIST119045/.test(
      code,
    )
  ) {
    return '七模'
  }
  if (/ENGL110049|ENGL110050|ENGL110051|ENGL110070|ENGL110059/.test(code)) {
    return '综合英语'
  }
  if (
    /ENGL110052|ENGL110012|ENGL110033|ENGL110077|ENGL110073|ENGL110035|ENGL110074|ENGL110036|ENGL110056|ENGL110060|ENGL110066|ENGL110043|ENGL110042|ENGL110079|ENGL110068|ENGL110025|ENGL110064|ENGL110061|ENGL110062|ENGL110078|ENGL110063/.test(
      code,
    )
  ) {
    return '通用英语'
  }
  if (
    /ENGL110045|ENGL110046|ENGL110047|ENGL110048|ENGL110055|ENGL110067/.test(
      code,
    )
  ) {
    return '专用英语'
  }
  if (
    /ENGL110009|ENGL110072|ENGL110024|ENGL110076|ENGL110069|ENGL110053|ENGL110071|ENGL110054|ENGL110057|ENGL110065/.test(
      code,
    )
  ) {
    return '英语文化'
  }
  if (
    /FORE11004|FORE110050|FORE110051|FORE110054|FORE110055|FORE110056|FORE110057|FORE110058|FORE110059|FORE110060|FORE110064|FORE110065|FORE110092|FORE110079|FORE110080|FORE110088|FORE110083|FORE110084|FORE110085|FORE110086|FORE11087|FORE110087|FORE110109|FORE11011/.test(
      code,
    )
  ) {
    return '二外'
  }
  if (
    /COMP110001|COMP110034|COMP110032|COMP110033|COMP110003|COMP110004|COMP110036|COMP110037|COMP110042|COMP110043/.test(
      code,
    )
  ) {
    return '大学计算机基础'
  }
  if (
    /INNO115|CHIN115|FORE115|BIOL115|POLI115|JOUR115|LAWS115|PTSS115|COMP115|ECON115|FINE115|ICES115|INFO115|MACR115|MANA115|ENVI115|SOFT115|PHYS115|MATE115|MATH115|MECH115|MICR115|MUSE115|NURS115|PHAR115|PHIL115|PHPM115|SOCI115|TCPH115|TOUR115|CHEM115|DATA115|MED115/.test(
      code,
    )
  ) {
    return '三创'
  }
  if (
    /ATMO110|BIOL110|CHEM110|POLI16|CHIN110|COMP110007|COMP110009|COMP110014|COMP110016|COMP110017|COMP110018|COMP110026|COMP110030|COMP110038|COMP110040|COMP110029|FINE110069|COMP110031|COMP110039|COMP110041|COMP110044|COMP110045|ECON110|ENVI110|FINE110083|FINE110094|FINE110022|FINE110023|FINE110024|FINE110025|FORE110001|FORE110006|FORE110007|FORE110013|FORE11002|FORE11003|FORE11006(?!0|4|5)|FORE11007|FORE110081|FORE110082|FORE110093|FORE110097|FORE110099|FORE110101|FORE110107|FORE110108|HIST110|JOUR110|ICES110|INFO110|LAWS110|MACR110|MANA110|MANA116|MATE110(?!013)|MATH110|MECH110|MED110|MED116|MICR110|MUSE110|NURS110|PHAR1100|PHIL110|PHPM110|PHYS110|POLI110|SOCI110(?!061|062|063)|SOFT110|TCPH110|TOUR110|PTSS110009|PTSS110017|PTSS11002|PTSS110049|NDEC110006|PTSS110015|PTSS110039|PTSS110040|PTSS110041|PTSS110044|PTSS110052|SOCI116/.test(
      code,
    )
  ) {
    return '通选'
  }
  if (/KQSY|RZSY|TFSY|XDSY|ZDSY/.test(code)) {
    return '书院新生'
  }
  if (/FINE110083|PHAR110034|FINE110094|MICR110|SOCI110/.test(code)) {
    return '服务学习'
  }
  if (
    /SOCI17|JOUR17|PTSS17|SOCI130039|SOCI130137|POLI17|CHIN17|PHIL17|HIST17|FINE17|MANA17|ECON17|LAWS17|MATE110|ENV117/.test(
      code,
    )
  ) {
    return '暑期国际'
  }
  if (/CHIN12/.test(code)) {
    return '中文基础'
  }
  if (/CHIN13/.test(code)) {
    return '中文专业'
  }
  if (/FORE12/.test(code)) {
    return '外院基础'
  }
  if (/FORE13/.test(code)) {
    return '外院专业'
  }
  if (/PHIL12/.test(code)) {
    return '哲学基础'
  }
  if (/PHIL13/.test(code)) {
    return '哲学专业'
  }
  if (/ECON13/.test(code)) {
    return '经院专业'
  }
  if (/SOSC12/.test(code)) {
    return '社科基础'
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
  if (/JOUR12/.test(code)) {
    return '新闻基础'
  }
  if (/JOUR13/.test(code)) {
    return '新闻专业'
  }
  if (/HIST12/.test(code)) {
    return '文史基础'
  }
  if (/HIST13/.test(code)) {
    return '历史专业'
  }
  if (/TOUR13/.test(code)) {
    return '旅游专业'
  }
  if (/ICES12/.test(code)) {
    return '留学生选修'
  }
  if (/ICES13/.test(code)) {
    return '国交专业'
  }
  if (/MUSE12/.test(code)) {
    return '文博基础'
  }
  if (/MUSE13/.test(code)) {
    return '文博专业'
  }
  if (
    /MATH120044|MATH120016|MATH120002|MATH120003|MATH120012|MATH120045|MATH120005|MATH120007|MATH120021|MATH120020|MATH120017|MATH120004|MATH120013|MATH120022/.test(
      code,
    )
  ) {
    return '理工医基础'
  }
  if (/MATH120006|MATH120010|MATH120011|MATH120014|MATH120015/.test(code)) {
    return '数院基础'
  }
  if (/MATH13/.test(code)) {
    return '数院专业'
  }
  if (/MANA120008/.test(code)) {
    return '经管类基础'
  }
  if (/PHYS12/.test(code)) {
    return '理工医基础'
  }
  if (/PHYS13/.test(code)) {
    return '物理专业'
  }
  if (/TCPH13/.test(code)) {
    return '核工专业'
  }
  if (/CHEM12/.test(code)) {
    return '理工医基础'
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
  if (/COMP12/.test(code)) {
    return '技科基础'
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
  if (/INFO12|INFO13/.test(code)) {
    return '信院专业'
  }
  if (/MICR12/.test(code)) {
    return '微电子基础'
  }
  if (/MICR13/.test(code)) {
    return '微电专业'
  }
  if (/MECH13/.test(code)) {
    return '航系专业'
  }
  if (/BIOL12/.test(code)) {
    return '理工医基础'
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
    return '二专（汉语言）'
  }
  if (/912/.test(code)) {
    return '二专（翻译）'
  }
  if (/913/.test(code)) {
    return '二专（新闻）'
  }
  if (/916/.test(code)) {
    return '二专（哲院）'
  }
  if (/924/.test(code)) {
    return '二专（数据科学）'
  }
  if (/927/.test(code)) {
    return '二专（法学）'
  }
  if (/934/.test(code)) {
    return '二专（公管）'
  }
  if (/942/.test(code)) {
    return '二专（会计）'
  }
  if (/945/.test(code)) {
    return '二专（环境）'
  }
  if (/968/.test(code)) {
    return '二专（经济）'
  }
  if (/972/.test(code)) {
    return '二专（数据科学）'
  }
  if (/993/.test(code)) {
    return '二专（对外汉语）'
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
