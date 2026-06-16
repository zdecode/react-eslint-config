import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 运行时定位数据文件（*.rule.jsonc 与 *.deps.json）。
// - 开发态：本文件在 src/，pkgRoot = src 的上一级 = 仓库根
// - 打包后：被 tsup 打进 dist/index.mjs，pkgRoot = dist 的上一级 = 包根
// 两种情况下 pkgRoot 都是包根，rulesDir 都是 <pkgRoot>/src/rules（随包发布）。
export const pkgRoot: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const rulesDir: string = path.join(pkgRoot, 'src', 'rules')
