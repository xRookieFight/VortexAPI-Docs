// Turns data/api.json into the markdown pages under docs/reference.
// The generated folder is gitignored, edit api.json (or the guide pages) instead.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const api = JSON.parse(readFileSync(join(root, 'data/api.json'), 'utf8'))
const out = join(root, 'docs/reference')

rmSync(out, { recursive: true, force: true })

const slug = (name) => name.toLowerCase()

const write = (rel, text) => {
  const file = join(out, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text.trimEnd() + '\n')
}

// everything that has its own page, so types in signatures can link to it
const pages = new Map()
for (const s of api.services) pages.set(s.name, `/reference/services/${slug(s.name)}`)
for (const c of api.classes) pages.set(c.name, `/reference/classes/${slug(c.name)}`)
for (const d of api.datatypes) if (!pages.has(d.name)) pages.set(d.name, `/reference/datatypes/${slug(d.name)}`)
for (const e of Object.keys(api.enums)) pages.set(`Enum.${e}`, `/reference/enums#${slug(e)}`)

// cells go into tables, so pipes and newlines would break the row
const cell = (s) => (s ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ')

const typeLink = (type) => {
  if (!type) return ''
  const bare = type.replace(/[?{}[\]]/g, '')
  const href = pages.get(bare)
  return href ? `[\`${cell(type)}\`](${href})` : `\`${cell(type)}\``
}

const badges = (m) => {
  const b = []
  if (m.side === 'client') b.push('<Badge type="info" text="client" />')
  if (m.side === 'server') b.push('<Badge type="info" text="server" />')
  if (m.readonly) b.push('<Badge type="tip" text="read only" />')
  if (m.deprecated) b.push('<Badge type="danger" text="deprecated" />')
  if (m.unverified) b.push('<Badge type="warning" text="unverified" />')
  return b.join(' ')
}

const UNVERIFIED_NOTE =
  '::: warning Unverified\nItems marked unverified follow Roblox conventions or Studio labels but haven\'t been seen in Vortex\'s script bindings. Test them before relying on them.\n:::\n'

function membersSection(title, members, opts = {}) {
  if (!members.length) return ''
  let s = `## ${title}\n\n`
  if (opts.table) {
    s += '| Name | Type | Notes |\n| --- | --- | --- |\n'
    for (const m of members) {
      const notes = [badges(m), cell(m.description)].filter(Boolean).join(' ')
      s += `| \`${m.name}\` | ${typeLink(m.type)} | ${notes} |\n`
    }
    return s + '\n'
  }
  for (const m of members) {
    s += `### ${m.name} ${badges(m)}\n\n`
    if (m.signature) s += '```lua\n' + m.signature + '\n```\n\n'
    else if (m.type) s += `Type: ${typeLink(m.type)}\n\n`
    if (m.description) s += `${m.description}\n\n`
  }
  return s
}

function inheritedSection(type, all) {
  let s = ''
  let parent = type.inherits
  const seen = new Set()
  while (parent && !seen.has(parent)) {
    seen.add(parent)
    const p = all.find((c) => c.name === parent)
    if (!p) break
    // properties live in a table without anchors, so link the page rather than a heading
    const names = p.members.map((m) => `\`${m.name}\``)
    if (names.length) s += `## Inherited from [${p.name}](${pages.get(p.name)})\n\n${names.join(', ')}\n\n`
    parent = p.inherits
  }
  return s
}

function typePage(kind, t) {
  const tags = [kind]
  if (t.inherits) tags.push(`inherits [${t.inherits}](${pages.get(t.inherits)})`)
  if (t.creatable) tags.push('creatable with `Instance.new`')
  if (t.side === 'client') tags.push('client only')
  if (t.abstract) tags.push('abstract')

  let s = `# ${t.name}${t.unverified ? ' <Badge type="warning" text="unverified" />' : ''}\n\n`
  s += `<p class="kind-line">${tags.join(' · ')}</p>\n\n`
  if (t.description) s += `${t.description}\n\n`
  if (kind === 'service') {
    s += '```lua\n' + `local ${t.name} = game:GetService("${t.name}")` + '\n```\n\n'
  }
  if (t.creatable) {
    const variable = t.name[0].toLowerCase() + t.name.slice(1)
    s += '```lua\n' + `local ${variable} = Instance.new("${t.name}")` + '\n```\n\n'
  }
  const by = (k) => t.members.filter((m) => m.kind === k)
  s += membersSection('Constructors', by('constructor'))
  s += membersSection('Constants', by('constant'), { table: true })
  s += membersSection('Properties', by('property'), { table: true })
  s += membersSection('Methods', by('method'))
  s += membersSection('Events', by('event'))
  s += membersSection('Callbacks', by('callback'))
  if (kind === 'class') s += inheritedSection(t, api.classes)
  if (t.unverified || t.members.some((m) => m.unverified)) s += UNVERIFIED_NOTE
  if (!t.members.length && !t.inherits) s += '_No members of its own._\n'
  return s
}

for (const s of api.services) write(`services/${slug(s.name)}.md`, typePage('service', s))
for (const c of api.classes) write(`classes/${slug(c.name)}.md`, typePage('class', c))
for (const d of api.datatypes) {
  // Instance is both a class and the Instance.new datatype, the class page covers it
  if (pages.get(d.name) !== `/reference/datatypes/${slug(d.name)}`) continue
  write(`datatypes/${slug(d.name)}.md`, typePage('datatype', d))
}

// overview pages for each section
const list = (items, dir) =>
  items.map((t) => `| [${t.name}](/reference/${dir}/${slug(t.name)}) | ${cell(t.description)} |`).join('\n')

write(
  'services/index.md',
  `# Services\n\nReach them with \`game:GetService("Name")\`.\n\n| Service | |\n| --- | --- |\n${list(api.services, 'services')}\n`,
)
write(
  'classes/index.md',
  `# Classes\n\n## Creatable\n\nThese work with \`Instance.new\`.\n\n| Class | |\n| --- | --- |\n${list(api.classes.filter((c) => c.creatable), 'classes')}\n\n## Other\n\n| Class | |\n| --- | --- |\n${list(api.classes.filter((c) => !c.creatable), 'classes')}\n`,
)
write(
  'datatypes/index.md',
  `# Datatypes\n\n| Datatype | |\n| --- | --- |\n${list(api.datatypes.filter((d) => pages.get(d.name) === `/reference/datatypes/${slug(d.name)}`), 'datatypes')}\n\n\`Instance.new\` is documented on the [Instance](/reference/classes/instance) page.\n`,
)

let enums = '# Enums\n\nUse them as `Enum.Name.Item`, for example `Enum.Material.Wood`. Every enum also has `GetEnumItems()`, `FromName(name)` and `FromValue(value)`, and items have `Name`, `Value` and `EnumType`.\n\n'
for (const [name, items] of Object.entries(api.enums)) {
  enums += `## ${name}\n\n`
  const extra = api.enums_unverified?.[name] ?? []
  enums += items.map((i) => `\`${i}\``).join(', ')
  if (extra.length) enums += ', ' + extra.map((i) => `\`${i}\` <Badge type="warning" text="unverified" />`).join(', ')
  enums += '\n\n'
}
write('enums.md', enums)

let globals = '# Globals\n\nAvailable in every script without a `require`.\n\n'
for (const g of api.globals) {
  globals += `## ${g.name} ${badges(g)}\n\n`
  if (g.signature) globals += '```lua\n' + g.signature + '\n```\n\n'
  else if (g.type) globals += `Type: ${typeLink(g.type)}\n\n`
  if (g.description) globals += `${g.description}\n\n`
}
write('globals.md', globals)

let libs = '# Libraries\n\nVortex runs Luau. These are the standard library functions it exposes. Anything not listed here is missing, even if stock Luau or Roblox has it.\n\n'
for (const [lib, funcs] of Object.entries(api.libraries)) {
  libs += `## ${lib}\n\n${funcs.map((f) => `\`${lib}.${f}\``).join(', ')}\n\n`
}
write('libraries.md', libs)

// sidebar for the config, kept next to the pages it describes
const sidebar = [
  { text: 'Overview', items: [
    { text: 'Globals', link: '/reference/globals' },
    { text: 'Libraries', link: '/reference/libraries' },
    { text: 'Enums', link: '/reference/enums' },
  ] },
  { text: 'Services', link: '/reference/services/', collapsed: false, items: api.services.map((s) => ({ text: s.name, link: pages.get(s.name) })) },
  { text: 'Classes', link: '/reference/classes/', collapsed: false, items: api.classes.map((c) => ({ text: c.name, link: pages.get(c.name) })) },
  { text: 'Datatypes', link: '/reference/datatypes/', collapsed: false, items: api.datatypes
    .filter((d) => pages.get(d.name) === `/reference/datatypes/${slug(d.name)}`)
    .map((d) => ({ text: d.name, link: pages.get(d.name) })) },
]
write('sidebar.json', JSON.stringify(sidebar, null, 2))

console.log(`generated ${api.services.length} services, ${api.classes.length} classes, ${api.datatypes.length} datatypes, ${Object.keys(api.enums).length} enums`)
