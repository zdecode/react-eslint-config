// 读取 src/rules/*.rule.jsonc：用 jsonc-parser 解析（容忍注释与尾随逗号）
import fs from 'node:fs'
import path from 'node:path'
import { type ParseError, parse } from 'jsonc-parser'
import type { JsonValue } from './serialize'
import { rulesDir } from './paths'

export function readRuleFile(name: string): Record<string, JsonValue> {
  const file = path.join(rulesDir, `${name}.rule.jsonc`)
  const text = fs.readFileSync(file, 'utf8')
  const errors: ParseError[] = []
  const data = parse(text, errors, { allowTrailingComma: true }) as Record<string, JsonValue>
  if (errors.length)
    throw new Error(`解析 ${name}.rule.jsonc 失败（offset ${errors[0].offset}）`)
  return data
}
