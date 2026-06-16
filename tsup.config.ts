import { defineConfig } from 'tsup'

export default defineConfig({
  // CLI 入口；src/* 会被打进同一个 bundle
  entry: { index: 'bin/index.ts' },
  outDir: 'dist',
  format: ['cjs'], // 输出 CommonJS，兼容老版本 Node
  target: 'node16',
  platform: 'node',
  clean: true,
  dts: false,
  shims: true, // CJS 下提供 import.meta.url 垫片
  // 把运行时依赖一起打进 bundle，发布的 CLI 自包含，无需用户再装这两个包
  noExternal: [
    '@clack/prompts',
    'jsonc-parser',
  ],
})
