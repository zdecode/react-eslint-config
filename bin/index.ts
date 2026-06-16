#!/usr/bin/env node
// @zd~/react-eslint-config 初始化脚本
// 触发：npx @zd~/react-eslint-config
// 作用：① 让用户选择框架与要格式化的模块
//       ② 拼装出一个自包含的 eslint.config.mjs（不 import 本包）
//       ③ 按需把所需依赖补齐到用户 package.json（不执行安装）
import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import { type Features, type Framework, assemble } from '../src/build'

const cwd = process.cwd()

function bail(msg: string): never {
  p.cancel(msg)
  process.exit(1)
}

function guardCancel<T>(value: T | symbol): T {
  if (p.isCancel(value))
    bail('已取消。')
  return value as T
}

p.intro('@zd~/react-eslint-config')

// ---------------------- 0. 最先检查已存在的 ESLint 配置 ----------------------
for (const name of ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts']) {
  if (fs.existsSync(path.join(cwd, name)))
    bail(`检测到项目已存在 ${name}，为避免覆盖已终止。请先删除后再运行。`)
}

// ---------------------- 1. 选择框架（默认 vite） ----------------------
const framework = guardCancel(await p.select<Framework>({
  message: '选择项目类型',
  initialValue: 'vite',
  options: [
    { value: 'vite', label: 'Vite' },
    { value: 'next', label: 'Next.js' },
    { value: 'fallback', label: '通用 / 其他', hint: 'Vite 配置 + recommended 预设' },
  ],
}))

// ---------------------- 2. 选择要格式化的模块（默认全选） ----------------------
const selectedFeatures = guardCancel(await p.multiselect<'yml' | 'mdx' | 'json'>({
  message: '选择需要额外格式化的文件类型（空格切换，回车确认）',
  required: false,
  initialValues: ['yml', 'mdx', 'json'],
  options: [
    { value: 'yml', label: 'YAML', hint: '.yml / .yaml' },
    { value: 'mdx', label: 'Markdown / MDX', hint: '.md / .mdx' },
    { value: 'json', label: 'JSON', hint: '.json / .jsonc / .json5' },
  ],
}))

const features: Features = {
  yml: selectedFeatures.includes('yml'),
  mdx: selectedFeatures.includes('mdx'),
  json: selectedFeatures.includes('json'),
}

// ---------------------- 3. 拼装单文件 + 推导依赖 ----------------------
const { content, deps, missing } = assemble({ framework, features })
for (const name of missing)
  p.log.warn(`模板中找不到依赖 ${name} 的版本，已跳过。`)

// ---------------------- 4. 写文件 + 改 package.json ----------------------
const userPkgPath = path.join(cwd, 'package.json')
if (!fs.existsSync(userPkgPath))
  bail('当前目录下找不到 package.json，请在项目根目录运行。')

let userPkg: Record<string, unknown>
try {
  userPkg = JSON.parse(fs.readFileSync(userPkgPath, 'utf8'))
}
catch {
  bail('package.json 解析失败，请检查 JSON 格式。')
}

const existingDeps = userPkg.dependencies as Record<string, string> | undefined
const existingDevDeps = userPkg.devDependencies as Record<string, string> | undefined
const userDeps = { ...existingDeps, ...existingDevDeps }
const devDeps: Record<string, string> = { ...existingDevDeps }
const added: string[] = []
for (const [name, version] of Object.entries(deps)) {
  // 用户已声明则保留其版本
  if (name in userDeps)
    continue
  devDeps[name] = version
  added.push(name)
}
const sortedDevDeps: Record<string, string> = {}
for (const key of Object.keys(devDeps).sort())
  sortedDevDeps[key] = devDeps[key]
userPkg.devDependencies = sortedDevDeps

const s = p.spinner()
s.start('正在写入文件')
fs.writeFileSync(path.join(cwd, 'eslint.config.mjs'), content)
fs.writeFileSync(userPkgPath, `${JSON.stringify(userPkg, null, 2)}\n`)
s.stop('文件写入完成')

// ---------------------- 5. 输出总结 ----------------------
const frameworkLabel = framework === 'next' ? 'Next.js' : framework === 'vite' ? 'Vite' : '通用（recommended 预设）'
const featureLabel = selectedFeatures.length ? selectedFeatures.join(' / ') : '无'
p.log.success(`框架：${frameworkLabel}　格式化：${featureLabel}`)
p.log.success('已生成：eslint.config.mjs')

if (added.length) {
  const list = added
    .sort()
    .map((name) => `${name}  ${deps[name]}`)
    .join('\n')
  p.note(list, `已向 devDependencies 新增 ${added.length} 个依赖`)
}
else {
  p.log.info('所需依赖均已存在，未改动 devDependencies。')
}

p.outro('完成！下一步运行：pnpm install（或 npm install / yarn）')
