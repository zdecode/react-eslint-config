import { defineConfig } from 'tsup'

export default defineConfig({
  // CLI 入口；src/* 会被打进同一个 bundle
  entry: { index: 'bin/index.ts' },
  outDir: 'dist',
  format: ['esm'], // 用到 import.meta.url 与 top-level await，必须 ESM
  target: 'node18',
  platform: 'node',
  clean: true,
  dts: false,
  shims: false,
  // @clack/prompts、jsonc-parser 保持外部依赖（随 dependencies 安装）
})
