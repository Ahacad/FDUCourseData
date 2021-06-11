import { existsSync, readFileSync } from 'fs'
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

try {
  /** config.json 文件内容 */
  const parsedConfigFileContent = JSON.parse(
    readFileSync(CONFIG_FILE_PATH, 'utf-8'),
  )
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
} catch (err) {
  if (err.message === 'Unexpected end of JSON input') {
    logger.error('config.json 文件格式不正确')
    process.exit(1)
  }
  throw err
}

export { config }
