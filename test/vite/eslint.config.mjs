import eslintReact from '@eslint-react/eslint-plugin'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import format from 'eslint-plugin-format'
import jsonc from 'eslint-plugin-jsonc'
import * as mdx from 'eslint-plugin-mdx'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import yml from 'eslint-plugin-yml'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([

  // ---------------------- 全局忽略 ----------------------
  // 排除构建产物、依赖目录和锁文件
  globalIgnores([
    'dist',
    'build/**',
    'out/**',
    '.next/**',
    '**/node_modules/**',
    'package-lock.json',
    '**/pnpm-lock.yaml',
    'bun.lock',
    '.agents',
    '.claude',
    '.heroui-docs',
    'runtime',
    'public',
    'data/*.json',
  ]),

  // ---------------------- YAML ----------------------
  // 对 .yml / .yaml 启用语法校验与风格检查
  ...yml.configs['flat/recommended'],

  // ---------------------- MDX / Markdown ----------------------
  // 启用 MDX 解析；lintCodeBlocks 同时校验文档内代码块
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },

  // MDX 代码块约束
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // .md / .mdx 文本交给 Prettier 排版
  {
    files: ['**/*.mdx', '**/*.md'],
    plugins: { format },
    rules: {
      'format/prettier': [
        'error',
        {
          parser: 'mdx',
          tabWidth: 2,
          singleQuote: true,
          semi: false,
          endOfLine: 'auto',
        },
      ],
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

  // ---------------------- JSON / JSONC / JSON5 ----------------------
  ...jsonc.configs['flat/recommended-with-json'],
  ...jsonc.configs['flat/recommended-with-jsonc'],
  ...jsonc.configs['flat/recommended-with-json5'],

  // 统一 JSON 风格
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
    rules: {
      'jsonc/indent': ['error', 2],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/quote-props': ['error', 'always'],
      'jsonc/comma-dangle': ['error', 'never'],
      'jsonc/array-bracket-spacing': ['error', 'never'],
      'jsonc/object-curly-spacing': ['error', 'always'],
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'jsonc/comma-style': ['error', 'last'],
    },
  },

  // tsconfig / VSCode 等 JSONC 文件允许注释
  {
    files: [
      '**/*.jsonc',
      '**/.vscode/*.json',
      '**/tsconfig*.json',
    ],
    rules: {
      'jsonc/no-comments': 'off',
    },
  },

  // ---------------------- TypeScript / JavaScript / JSX ----------------------
  {
    files: ['**/*.{ts,js,jsx,cjs,mjs,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@stylistic': stylistic,
      '@eslint-react': eslintReact,
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // 固定 TS 解析根目录为本配置所在目录，避免 monorepo 下「多候选 tsconfigRootDir」报错
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
          ImportDeclaration: { multiline: true, consistent: true },
          ExportDeclaration: { multiline: true, consistent: true },
        },
      ],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@stylistic/jsx-child-element-spacing': 'error',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-parens': 'off',
      '@stylistic/arrow-spacing': ['error', { after: true, before: true }],
      '@stylistic/block-spacing': 'off',
      '@stylistic/brace-style': ['off', 'stroustrup', { allowSingleLine: true }],
      '@stylistic/comma-dangle': 'off',
      '@stylistic/comma-spacing': ['error', { after: true, before: false }],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/eol-last': 'off',
      '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
      '@stylistic/indent': 'off',
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-closing-bracket-location': 'error',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/jsx-curly-brace-presence': ['error', { propElementValues: 'always' }],
      '@stylistic/jsx-curly-newline': 'error',
      '@stylistic/jsx-curly-spacing': ['error', 'never'],
      '@stylistic/jsx-equals-spacing': 'error',
      '@stylistic/jsx-first-prop-new-line': 'error',
      '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-quotes': 'error',
      '@stylistic/jsx-tag-spacing': [
        'error',
        {
          afterOpening: 'never',
          beforeClosing: 'never',
          beforeSelfClosing: 'always',
          closingSlash: 'never',
        },
      ],
      '@stylistic/jsx-wrap-multilines': [
        'error',
        {
          arrow: 'parens-new-line',
          assignment: 'parens-new-line',
          condition: 'parens-new-line',
          declaration: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
          propertyValue: 'parens-new-line',
          return: 'parens-new-line',
        },
      ],
      '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      '@stylistic/keyword-spacing': ['error', { after: true, before: true }],
      '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'none', requireLast: false },
          multilineDetection: 'brackets',
          overrides: {
            interface: { multiline: { delimiter: 'none', requireLast: false } },
          },
          singleline: { delimiter: 'comma' },
        },
      ],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/new-parens': 'error',
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-mixed-operators': [
        'error',
        {
          allowSamePrecedence: true,
          groups: [
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
        },
      ],
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces': 'off',
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'off',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/padded-blocks': [
        'error',
        { blocks: 'never', classes: 'never', switches: 'never' },
      ],
      '@stylistic/padding-line-between-statements': 'off',
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/quotes': 'off',
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/semi': 'off',
      '@stylistic/semi-spacing': ['error', { after: true, before: false }],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-before-function-paren': [
        'error',
        { anonymous: 'always', asyncArrow: 'always', named: 'never' },
      ],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', { nonwords: false, words: true }],
      '@stylistic/spaced-comment': 'off',
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/template-tag-spacing': ['error', 'never'],
      '@stylistic/type-annotation-spacing': ['error', {}],
      '@stylistic/type-generic-spacing': 'error',
      '@stylistic/type-named-tuple-spacing': 'error',
      '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
      '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],
      'react/self-closing-comp': ['error', { component: true, html: false }],
      'react/no-danger': ['error', {}],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
      'react-refresh/only-export-components': ['error', { allowConstantExport: true, allowExportNames: [] }],
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'warn',
      '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error',
      '@eslint-react/dom-no-find-dom-node': 'error',
      '@eslint-react/dom-no-flush-sync': 'error',
      '@eslint-react/dom-no-hydrate': 'error',
      '@eslint-react/dom-no-render': 'error',
      '@eslint-react/dom-no-render-return-value': 'error',
      '@eslint-react/dom-no-script-url': 'warn',
      '@eslint-react/dom-no-string-style-prop': 'off',
      '@eslint-react/dom-no-unknown-property': 'off',
      '@eslint-react/dom-no-unsafe-iframe-sandbox': 'warn',
      '@eslint-react/dom-no-use-form-state': 'error',
      '@eslint-react/dom-no-void-elements-with-children': 'error',
      '@eslint-react/error-boundaries': 'error',
      '@eslint-react/exhaustive-deps': 'warn',
      '@eslint-react/jsx-no-children-prop': 'warn',
      '@eslint-react/jsx-no-children-prop-with-children': 'error',
      '@eslint-react/jsx-no-comment-textnodes': 'warn',
      '@eslint-react/jsx-no-key-after-spread': 'error',
      '@eslint-react/jsx-no-leaked-dollar': 'warn',
      '@eslint-react/jsx-no-leaked-semicolon': 'warn',
      '@eslint-react/jsx-no-namespace': 'error',
      '@eslint-react/naming-convention-context-name': 'warn',
      '@eslint-react/naming-convention-id-name': 'warn',
      '@eslint-react/naming-convention-ref-name': 'warn',
      '@eslint-react/no-access-state-in-setstate': 'error',
      '@eslint-react/no-array-index-key': 'warn',
      '@eslint-react/no-children-count': 'warn',
      '@eslint-react/no-children-for-each': 'warn',
      '@eslint-react/no-children-map': 'warn',
      '@eslint-react/no-children-only': 'warn',
      '@eslint-react/no-children-to-array': 'warn',
      '@eslint-react/no-clone-element': 'warn',
      '@eslint-react/no-component-will-mount': 'error',
      '@eslint-react/no-component-will-receive-props': 'error',
      '@eslint-react/no-component-will-update': 'error',
      '@eslint-react/no-context-provider': 'warn',
      '@eslint-react/no-create-ref': 'error',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/no-forward-ref': 'warn',
      '@eslint-react/no-missing-key': 'error',
      '@eslint-react/no-nested-component-definitions': 'error',
      '@eslint-react/no-nested-lazy-component-declarations': 'error',
      '@eslint-react/no-set-state-in-component-did-mount': 'warn',
      '@eslint-react/no-set-state-in-component-did-update': 'warn',
      '@eslint-react/no-set-state-in-component-will-update': 'warn',
      '@eslint-react/no-unnecessary-use-prefix': 'warn',
      '@eslint-react/no-unsafe-component-will-mount': 'warn',
      '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
      '@eslint-react/no-unsafe-component-will-update': 'warn',
      '@eslint-react/no-unused-class-component-members': 'warn',
      '@eslint-react/no-use-context': 'warn',
      '@eslint-react/purity': 'warn',
      '@eslint-react/rsc-function-definition': 'error',
      '@eslint-react/rules-of-hooks': 'error',
      '@eslint-react/set-state-in-effect': 'warn',
      '@eslint-react/set-state-in-render': 'error',
      '@eslint-react/static-components': 'error',
      '@eslint-react/unsupported-syntax': 'error',
      '@eslint-react/use-memo': 'error',
      '@eslint-react/use-state': 'warn',
      '@eslint-react/web-api-no-leaked-event-listener': 'warn',
      '@eslint-react/web-api-no-leaked-fetch': 'warn',
      '@eslint-react/web-api-no-leaked-interval': 'warn',
      '@eslint-react/web-api-no-leaked-resize-observer': 'warn',
      '@eslint-react/web-api-no-leaked-timeout': 'warn',
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
      'no-unmodified-loop-condition': 'error',
      'preserve-caught-error': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value='lucide-react'] > ImportSpecifier[imported.name=/^(?!.*Icon$).*$/]",
          message: "从 'lucide-react' 导入图标时，必须使用以 'Icon' 结尾的成员（例如：使用 'PiIcon' 而不是 'Pi'）。",
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              importNames: ['/^(?!.*Icon$).*$/'],
              message: "从 'lucide-react' 导入图标时，必须使用以 'Icon' 结尾的成员名（例如：使用 'PiIcon' 而不是 'Pi'）。",
            },
          ],
        },
      ],
    },
  },

  // ---------------------- MDX 虚拟文件覆盖 ----------------------
  // 必须放在核心 TS/JS 块之后，才能覆盖里面的规则
  {
    files: ['**/*.{md,mdx}/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-useless-assignment': 'off',
      'no-unused-private-class-members': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'no-with': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react/jsx-no-undef': 'off',
      'react/no-danger': 'off',
      '@stylistic/jsx-child-element-spacing': 'off',
      'react/no-deprecated': 'off',
      'react/display-name': 'off',
      'jsonc/no-comments': 'off',
    },
  },

  // ---------------------- 测试文件 ----------------------
  {
    files: ['tests/**/*.{ts,js,jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // ---------------------- shadcn/ui 组件 ----------------------
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
