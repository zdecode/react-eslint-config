import type { Framework } from './build'

// 一个依赖项的完整描述：npm 包名 + 版本（按需可按框架覆盖）
export interface Dep {
  /** npm 包名 */
  pkg: string
  /** 默认版本范围 */
  version: string
  /** 按框架覆盖版本（如 eslint：next 锁 9.x、vite 用 10.x） */
  byFramework?: Partial<Record<Framework, string>>
}

// 带 import 语句的依赖项（会出现在生成文件顶部的 import 区）
export interface ImportDep extends Dep {
  /** import 语句 */
  import: string
}

// import key -> { import 语句 + 包名 + 版本 }
// 此对象的定义顺序即生成文件中 import 的输出顺序（已按模块路径排序）
export const REGISTRY = {
  eslintReact: { import: "import eslintReact from '@eslint-react/eslint-plugin'", pkg: '@eslint-react/eslint-plugin', version: '^5.9.0' },
  js: { import: "import js from '@eslint/js'", pkg: '@eslint/js', version: '^10.0.1' },
  stylistic: { import: "import stylistic from '@stylistic/eslint-plugin'", pkg: '@stylistic/eslint-plugin', version: '^5.10.0' },
  nextVitals: { import: "import nextVitals from 'eslint-config-next/core-web-vitals'", pkg: 'eslint-config-next', version: '16.2.6' },
  nextTs: { import: "import nextTs from 'eslint-config-next/typescript'", pkg: 'eslint-config-next', version: '16.2.6' },
  format: { import: "import format from 'eslint-plugin-format'", pkg: 'eslint-plugin-format', version: '^2.0.1' },
  jsonc: { import: "import jsonc from 'eslint-plugin-jsonc'", pkg: 'eslint-plugin-jsonc', version: '^3.2.0' },
  mdx: { import: "import * as mdx from 'eslint-plugin-mdx'", pkg: 'eslint-plugin-mdx', version: '^3.7.0' },
  react: { import: "import react from 'eslint-plugin-react'", pkg: 'eslint-plugin-react', version: '^7.37.5' },
  reactHooks: { import: "import reactHooks from 'eslint-plugin-react-hooks'", pkg: 'eslint-plugin-react-hooks', version: '^7.1.1' },
  reactRefresh: { import: "import reactRefresh from 'eslint-plugin-react-refresh'", pkg: 'eslint-plugin-react-refresh', version: '^0.5.2' },
  yml: { import: "import yml from 'eslint-plugin-yml'", pkg: 'eslint-plugin-yml', version: '^3.4.0' },
  eslintConfig: { import: "import { defineConfig, globalIgnores } from 'eslint/config'", pkg: 'eslint', version: '^10.3.0', byFramework: { next: '^9.39.4' } },
  globals: { import: "import globals from 'globals'", pkg: 'globals', version: '^17.6.0' },
  tseslint: { import: "import tseslint from 'typescript-eslint'", pkg: 'typescript-eslint', version: '^8.59.4' },
} satisfies Record<string, ImportDep>

export type ImportKey = keyof typeof REGISTRY

// 未被 import 直接引用、但运行必需的 peer 依赖（版本同样内联在此）
export const PEER: { always: Dep[], perImport: Partial<Record<ImportKey, Dep[]>> } = {
  // 恒需要：typescript-eslint 依赖 typescript
  always: [
    { pkg: 'typescript', version: '^6.0.3' },
  ],
  // 仅当对应 import key 被选中时才需要
  perImport: {
    yml: [{ pkg: 'yaml-eslint-parser', version: '^2.0.0' }], // eslint-plugin-yml 解析 YAML 需要
  },
}

// 取某依赖在指定框架下的版本（无 byFramework 覆盖则用默认）
export function versionFor(dep: Dep, framework: Framework): string {
  return dep.byFramework?.[framework] ?? dep.version
}
