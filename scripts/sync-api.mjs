// Pulls the latest data/api.json from VortexStudio-MCP, which owns the data.
// Run it, review the diff, commit.

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const url = 'https://raw.githubusercontent.com/xRookieFight/VortexStudio-MCP/main/data/api.json'
const target = join(dirname(fileURLToPath(import.meta.url)), '../data/api.json')

const res = await fetch(url)
if (!res.ok) {
  console.error(`couldn't fetch ${url}: ${res.status} ${res.statusText}`)
  process.exit(1)
}
const text = await res.text()
// refuse anything that isn't the shape we generate from
const data = JSON.parse(text)
for (const key of ['services', 'classes', 'datatypes', 'enums', 'globals', 'libraries']) {
  if (!(key in data)) {
    console.error(`downloaded api.json has no "${key}", not overwriting`)
    process.exit(1)
  }
}
writeFileSync(target, text.endsWith('\n') ? text : text + '\n')
console.log(`updated data/api.json from ${url}`)
