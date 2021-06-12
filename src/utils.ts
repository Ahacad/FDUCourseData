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

/** 暂停数毫秒 */
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

export { config }
