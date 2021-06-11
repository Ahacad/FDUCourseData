/**
 * 将所有课程 JSON 放到 data/temp 中后运行，输出所有可能的课程号前六位前缀集合
 */
import fs from 'fs'
import path from 'path'

const files = fs.readdirSync(path.join(process.cwd(), 'data', 'temp'))

const res = new Set()

files.forEach((file) => {
  const fileContent = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'temp', file), 'utf-8'),
  )
  fileContent.forEach((obj: { code: string }) => res.add(obj.code.slice(0, 6)))
})

res.forEach((i) => console.log(i))
