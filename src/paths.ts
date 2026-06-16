import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 运行时定位数据文件（src/rules/*.rule.jsonc 与 src/*.deps.json）。
// - 开发态：本文件在 src/，pkgRoot = src 的上一级 = 包根
// - 打包后：被 tsup 打进 dist/index.mjs，pkgRoot = dist 的上一级 = 包根
// 两种情况下 srcDir 都是 <pkgRoot>/src（随包发布）。
export const pkgRoot: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const srcDir: string = path.join(pkgRoot, 'src')
export const rulesDir: string = path.join(srcDir, 'rules')
