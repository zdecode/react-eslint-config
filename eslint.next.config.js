// eslint.next.config.js
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import format from 'eslint-plugin-format'
import jsonc from 'eslint-plugin-jsonc'
import * as mdx from 'eslint-plugin-mdx'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import yml from 'eslint-plugin-yml'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([

  // ==================== Next.js 基础配置 ====================
  // Next.js 官方推荐的 Core Web Vitals 规则集（性能与可访问性），
  // 以及 TypeScript 专属规则集
  ...nextVitals,
  ...nextTs,


  // ==================== 全局忽略 ====================
  // 排除构建产物、依赖目录和锁文件，避免 ESLint 扫描无意义的文件
  globalIgnores([
    // 构建产物
    'dist',
    'out/**',
    'build/**',
    '.next/**',
    // 依赖
    '**/node_modules/**',
    // 锁文件与生成文件
    'package-lock.json',
    '**/pnpm-lock.yaml',
    'next-env.d.ts',
    '.source/**',
    // 工具目录
    '.agents',
    '.claude',
    '.heroui-docs',
    'runtime',
    // 特殊命名约定：nocheck 文件跳过 ESLint
    '**/*.nocheck.mdx',
    '**/*/type-check.mdx',
  ]),


  // ==================== YAML ====================
  // 对 .yml / .yaml 文件启用语法校验与风格检查
  ...yml.configs['flat/recommended'],


  // ==================== MDX / Markdown ====================
  // 对 .mdx 文件启用完整的 MDX 语法解析；
  // lintCodeBlocks: true 会同时校验文档内的代码块
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },

  // 对 MDX 内的代码块单独约束：禁止 var，强制 const
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // 禁止使用 var，统一用 let/const
      'no-var': 'error',
      // 对不会重新赋值的变量强制使用 const
      'prefer-const': 'error',
    },
  },

  // 对 .mdx 和 .md 文件使用 Prettier 引擎统一排版，
  // 并关闭 @stylistic 中会与之冲突的规则，防止规则互相打架
  {
    files: ['**/*.mdx', '**/*.md'],
    plugins: { format },
    rules: {
      // 调用 Prettier（mdx 解析器）自动处理 Markdown 文本排版（缩进、引号、换行等）
      'format/prettier': ['error', {
        parser: 'mdx',
        tabWidth: 2,
        // 尽量与 JS/TS 文件保持一致的单引号风格
        singleQuote: true,
        // 与 @stylistic/semi: 'never' 保持一致，避免 MDX 代码块循环修复
        semi: false,
        endOfLine: 'auto',
      }],

      // 以下规则在 MDX 中全权交给 format/prettier 处理，避免冲突，全部关闭
      '@stylistic/indent': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/array-element-newline': 'off',
      '@stylistic/array-bracket-newline': 'off',
      '@stylistic/object-curly-spacing': 'off',
      '@stylistic/jsx-quotes': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
    },
  },


  // ==================== JSON / JSONC / JSON5 ====================
  // 分别为标准 JSON、带注释的 JSONC、JSON5 启用推荐规则集
  ...jsonc.configs['flat/recommended-with-json'],
  ...jsonc.configs['flat/recommended-with-jsonc'],
  ...jsonc.configs['flat/recommended-with-json5'],

  // 对所有 JSON 变体统一风格，与 JS/TS 保持一致
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
    rules: {
      // 统一使用 2 空格缩进
      'jsonc/indent': ['error', 2],
      // JSON 规范要求必须使用双引号
      'jsonc/quotes': ['error', 'double'],
      // 所有属性名都必须加引号（JSON 规范）
      'jsonc/quote-props': ['error', 'always'],
      // 标准 JSON 不允许尾随逗号
      'jsonc/comma-dangle': ['error', 'never'],
      // 数组方括号内部不加空格：[1, 2]
      'jsonc/array-bracket-spacing': ['error', 'never'],
      // 对象花括号内部加空格：{ "a": 1 }
      'jsonc/object-curly-spacing': ['error', 'always'],
      // 冒号前无空格，冒号后有空格："key": value
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      // 逗号放在行尾而不是行首
      'jsonc/comma-style': ['error', 'last'],
    },
  },

  // tsconfig.json、VSCode 配置等实际上是 JSONC 格式，允许注释，单独放行
  {
    files: [
      '**/*.jsonc', // 扩展名本身就是 jsonc
      '**/.vscode/*.json', // VSCode 工作区配置，均支持注释
      '**/tsconfig*.json', // TypeScript 配置文件，均支持注释
    ],
    rules: {
      // 以上文件允许写注释，关闭“禁止注释”规则
      'jsonc/no-comments': 'off',
    },
  },


  // ==================== TypeScript / JavaScript / JSX ====================
  {
    files: ['**/*.{ts,js,jsx,cjs,mjs,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.next,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {

      // ----------- 基础排版 -----------

      // 统一使用 2 空格缩进
      '@stylistic/indent': ['error', 2],
      // 统一使用单引号；当字符串内部包含单引号时允许转义为双引号（avoidEscape）
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      // 禁止行尾分号
      '@stylistic/semi': ['error', 'never'],
      // 多行结构（数组、对象、参数等）的最后一项后必须加尾随逗号，方便 git diff
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      // 对象花括号内部加空格：{ a: 1 }
      '@stylistic/object-curly-spacing': ['error', 'always'],
      // 数组方括号内部不加空格：[1, 2]
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      // 箭头函数参数始终加括号：(x) => x，保持风格统一且便于加类型注解
      '@stylistic/arrow-parens': ['error', 'always'],
      // 文件末尾必须有换行符（Unix 规范，防止 git 出现 No newline at end of file）
      '@stylistic/eol-last': ['error', 'always'],
      // 禁止行尾多余的空格
      '@stylistic/no-trailing-spaces': 'error',
      // 禁止连续多个空格（注释对齐除外）
      '@stylistic/no-multi-spaces': 'error',

      // ----------- 换行 -----------

      // 数组元素换行保持一致：要么全部同行，要么全部换行
      '@stylistic/array-element-newline': ['error', 'consistent'],
      // 数组方括号的换行与元素保持一致
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      // 普通对象、解构赋值、import/export：有换行则保持一致
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: { multiline: true, consistent: true }, // 普通对象字面量
        ObjectPattern: { multiline: true, consistent: true }, // 解构赋值
        ImportDeclaration: { multiline: true, consistent: true }, // import 语句
        ExportDeclaration: { multiline: true, consistent: true }, // export 语句
      }],
      // 函数括号内的参数换行保持一致：要么全部同行，要么全部换行
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      // 三元表达式跨多行时，操作数之间强制换行
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],

      // ----------- 间距 -----------

      // 逗号前无空格，逗号后有空格：a, b, c
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      // 对象冒号前无空格，冒号后有空格：{ key: value }
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      // 括号内部不加空格：fn(a, b) 而不是 fn( a, b )
      '@stylistic/space-in-parens': ['error', 'never'],
      // 箭头 => 前后均有空格：const fn = (a: string): void => {}
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      // 三元运算符 ? 和 : 前后必须有空格
      '@stylistic/space-infix-ops': ['error', { int32Hint: false }],
      // 模板字符串的变量花括号内部禁止空格：`${x}` 而不是 `${ x }`
      '@stylistic/template-curly-spacing': ['error', 'never'],

      // ----------- TypeScript -----------

      // 统一使用 interface 而不是 type 定义对象类型（便于声明合并与扩展）
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // 空接口仅在单继承场景下允许，其余情况禁止（避免无意义的空类型）
      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends',
      }],
      // 允许使用 any
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用变量校验
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // 变量忽略正则：允许以下划线开头，或名为 'ignore' 的变量
          varsIgnorePattern: '^_|^ignore$',
          // 核心配置：忽略剩余属性（Rest Property）同级的兄弟变量
          // 这允许你为了从 ...props 中排除某些值而进行解构，即便这些值没被使用
          ignoreRestSiblings: true,
          // 参数忽略正则：允许函数参数以下划线开头
          argsIgnorePattern: '^_',
          // 捕获的错误变量忽略正则
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // 强制类型导入：import type { Foo } from '...'
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],

      // ----------- JSX 排版 -----------

      // JSX 属性引号使用双引号：className="foo"（与 HTML 习惯一致）
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      // 多行 JSX 标签时，每行最多 1 个属性，保持可读性
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      // 多行多属性时，第一个属性必须另起一行
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      // 多行标签的闭合 > 必须与开始标签的 < 对齐
      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      // JSX 属性缩进使用 2 空格
      '@stylistic/jsx-indent-props': ['error', 2],
      // 多行 JSX 表达式统一用括号包裹并换行，适用于变量声明、return、箭头函数、props 等所有场景
      '@stylistic/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line', // const el = (\n  <div />\n)
        assignment: 'parens-new-line', // el = (\n  <div />\n)
        return: 'parens-new-line', // return (\n  <div />\n)
        arrow: 'parens-new-line', // () => (\n  <div />\n)
        condition: 'parens-new-line', // cond ? (\n  <div />\n) : null
        logical: 'parens-new-line', // flag && (\n  <div />\n)
        prop: 'parens-new-line', // prop={(\n  <div />\n)}
      }],
      // JSX 标签内前后空格规范
      '@stylistic/jsx-tag-spacing': ['error', {
        closingSlash: 'never', // </div> 斜杠前不加空格
        beforeSelfClosing: 'always', // <div /> 自闭合标签 /> 前必须有空格
        afterOpening: 'never', // <div> 开标签 < 后不加空格
        beforeClosing: 'never', // <div > 开标签 > 前不加空格
      }],
      // 处理 JSX 子元素之间的空格问题，禁止 <div> {a} {b} </div> 中的多余空格
      '@stylistic/jsx-child-element-spacing': 'error',

      // ----------- React 组件 -----------

      // 没有子节点的组件或 HTML 标签强制自闭合：<Comp /> 而不是 <Comp></Comp>
      'react/self-closing-comp': ['error', {
        component: true, // React 组件自闭合
        html: false, // 原生 HTML 标签不强制（避免与 HTML 规范冲突）
      }],
      // 禁止使用 dangerouslySetInnerHTML
      'react/no-danger': ['error', {}],
      // 属性值为字符串时禁止不必要的花括号：size="sm" 而不是 size={"sm"}
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never', // 属性中禁止不必要的花括号
          children: 'never', // 子元素中禁止不必要的花括号
          propElementValues: 'always', // 如果属性值是 JSX 元素，则要求花括号
        },
      ],

      // ----------- 最佳实践 -----------

      // 有变量拼接时强制使用模板字符串，禁止 "hello " + name 写法
      'prefer-template': 'error',
      // 对象属性/方法强制使用简写：{ foo } 而不是 { foo: foo }
      'object-shorthand': ['error', 'always'],
      // 强制循环条件中的变量必须在循环体内被修改，防止死循环
      'no-unmodified-loop-condition': 'error',
      // 关闭：不强制保留捕获到的原始错误
      'preserve-caught-error': 'off',

      // ----------- 导入约束（lucide-react 图标命名） -----------

      // 通过 AST 选择器：匹配来自 lucide-react 且不以 Icon 结尾的导入成员
      // 注意：Service/Action 层覆盖块会重定义 no-restricted-syntax，从而在那些文件中覆盖此条
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value='lucide-react'] > ImportSpecifier[imported.name=/^(?!.*Icon$).*$/]",
          message: "从 'lucide-react' 导入图标时，必须使用以 'Icon' 结尾的成员（例如：使用 'PiIcon' 而不是 'Pi'）。",
        },
      ],
      // 通过导入名约束：同样强制 lucide-react 图标必须以 Icon 结尾
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              importNames: [
                '/^(?!.*Icon$).*$/',
              ],
              message: "从 'lucide-react' 导入图标时，必须使用以 'Icon' 结尾的成员名（例如：使用 'PiIcon' 而不是 'Pi'）。",
            },
          ],
        },
      ],
    },
  },


  // ==================== MDX 虚拟文件覆盖 ====================
  // mdx.createRemarkProcessor 会把 .mdx 中的 import/JSX/代码块抽取为虚拟文件，
  // 路径形如 path/to/file.mdx/0_0.jsx，会被上面的 TS/JS 规则块匹配到。
  // 必须放在 TS/JS 块之后，才能覆盖里面的规则。
  {
    files: ['**/*.{md,mdx}/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-useless-assignment': 'off',
      'no-unused-private-class-members': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'no-with': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'jsonc/no-comments': 'off',
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react/jsx-no-undef': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-danger': 'off',
      '@stylistic/jsx-child-element-spacing': 'off',
      'react/no-deprecated': 'off',
      'react/display-name': 'off',
    },
  },

  // ==================== 测试文件 ====================
  // 测试文件不需要遵守“只导出组件”的限制（测试用例会导出各种工具函数）
  {
    files: ['tests/**/*.{ts,js,jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },


  // ==================== Service 层规范（*.service.ts） ====================
  // 架构约束：Service 层负责数据请求与业务逻辑，强制以下规范保证一致性与健壮性
  {
    files: ['**/*.service.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        // 所有导出函数必须是 async，确保调用方可以统一用 await 处理
        {
          selector: `
            :matches(ExportNamedDeclaration, ExportDefaultDeclaration) > FunctionDeclaration[async=false],
            ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression[async=false]
          `.trim(),
          message: 'Service 层导出的函数必须声明为 async (异步)',
        },
        // 所有导出函数必须包含 try-catch，统一在 Service 层处理异常，不向上抛
        {
          selector: `
            :matches(ExportNamedDeclaration, ExportDefaultDeclaration) > FunctionDeclaration:not(:has(TryStatement)),
            ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression:not(:has(TryStatement))
          `.trim(),
          message: 'Service 层导出的函数必须包含 try-catch 结构',
        },
        // 所有导出的异步函数命名必须以 Service 结尾，明确层级归属，便于全局搜索
        // 示例：getUserService、submitOrderService
        {
          selector: [
            'ExportNamedDeclaration > FunctionDeclaration[async=true]:not([id.name=/Service$/])',
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator:not([id.name=/Service$/]) > ArrowFunctionExpression[async=true]',
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator:not([id.name=/Service$/]) > FunctionExpression[async=true]',
            'ExportDefaultDeclaration > FunctionDeclaration[async=true][id!=null]:not([id.name=/Service$/])',
          ].join(', '),
          message: 'Service 层导出的异步函数必须以 "Service" 结尾 (例如: getUserService)',
        },
      ],
    },
  },


  // ==================== Action 层规范（*.action.ts） ====================
  // 架构约束：Action 层负责 Server Action（Next.js），强制命名以 Action 结尾，明确层级归属
  // 示例：submitFormAction、deleteUserAction
  {
    files: ['**/*.action.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        // 所有导出的异步函数命名必须以 Action 结尾
        {
          selector: [
            'ExportNamedDeclaration > FunctionDeclaration[async=true]:not([id.name=/Action$/])',
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator:not([id.name=/Action$/]) > ArrowFunctionExpression[async=true]',
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator:not([id.name=/Action$/]) > FunctionExpression[async=true]',
            'ExportDefaultDeclaration > FunctionDeclaration[async=true][id!=null]:not([id.name=/Action$/])',
          ].join(', '),
          message: 'Action 层导出的异步函数必须以 "Action" 结尾 (例如: submitFormAction)',
        },
      ],
    },
  },
])
