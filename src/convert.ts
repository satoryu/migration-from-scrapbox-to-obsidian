import { parse } from '@progfay/scrapbox-parser'
import type { Block } from '@progfay/scrapbox-parser/lib/block'
import type { Title } from '@progfay/scrapbox-parser/lib/block/Title'
import type { Line } from '@progfay/scrapbox-parser/lib/block/Line'
import type { CodeBlock } from '@progfay/scrapbox-parser/lib/block/CodeBlock'
import type { Table } from '@progfay/scrapbox-parser/lib/block/Table'
import type { Node, DecorationNode } from '@progfay/scrapbox-parser/lib/block/node/type'
import { replaceDateSlashes } from './sanitize'

export function convert(text: string): string {
  const blocks = parse(text, { hasTitle: false })
  return blocks.map(convertBlock).join('\n')
}

function convertBlock(block: Block): string {
  switch (block.type) {
    case 'title':
      return `# ${(block as Title).text}`
    case 'line':
      return convertLine(block as Line)
    case 'codeBlock':
      return convertCodeBlock(block as CodeBlock)
    case 'table':
      return convertTable(block as Table)
  }
}

function applyInlineDecos(decos: readonly string[], text: string): string {
  const withStrike = decos.includes('-') ? `~~${text}~~` : text
  return decos.includes('/') ? `*${withStrike}*` : withStrike
}

function convertLine(line: Line): string {
  if (line.nodes.length === 0) return ''

  // Single decoration node with asterisk → heading
  if (line.indent === 0 && line.nodes.length === 1 && line.nodes[0].type === 'decoration') {
    const deco = line.nodes[0] as DecorationNode
    const asteriskDeco = deco.decos.find(d => typeof d === 'string' && d.startsWith('*-'))
    if (asteriskDeco) {
      const level = parseInt((asteriskDeco as string).split('-')[1], 10)
      const headingLevel = Math.max(1, 5 - level)
      const hashes = '#'.repeat(headingLevel)
      const innerText = applyInlineDecos(deco.decos, convertNodes(deco.nodes))
      return `${hashes} ${innerText}`
    }
  }

  const content = convertNodes(line.nodes)

  // Indented lines → list items
  if (line.indent > 0) {
    // Check for number list
    if (line.nodes.length === 1 && line.nodes[0].type === 'numberList') {
      const prefix = '  '.repeat(line.indent - 1)
      return `${prefix}${content}`
    }
    const prefix = '  '.repeat(line.indent - 1)
    return `${prefix}- ${content}`
  }

  return content
}

function convertCodeBlock(block: CodeBlock): string {
  const lang = extractLanguage(block.fileName)
  return '```' + lang + '\n' + block.content + '\n```'
}

function convertTable(block: Table): string {
  if (block.cells.length === 0) return ''

  const formatRow = (row: Node[][]): string =>
    '| ' + row.map(cell => convertNodes(cell).trim()).join(' | ') + ' |'

  const headerRow = formatRow(block.cells[0])
  const separator = '| ' + Array(block.cells[0].length).fill('---').join(' | ') + ' |'
  const bodyRows = block.cells.slice(1).map(formatRow)

  return [headerRow, separator, ...bodyRows].join('\n')
}

function convertNodes(nodes: Node[]): string {
  return nodes.map(convertNode).join('')
}

function convertNode(node: Node): string {
  switch (node.type) {
    case 'plain':
      return node.text
    case 'decoration':
      return convertDecoration(node)
    case 'strong':
      return `**${convertNodes(node.nodes)}**`
    case 'link':
      return convertLink(node)
    case 'hashTag':
      return `#${node.href}`
    case 'code':
      return `\`${node.text}\``
    case 'quote':
      return `> ${convertNodes(node.nodes).trim()}`
    case 'image':
      return node.link ? `[![](${node.src})](${node.link})` : `![](${node.src})`
    case 'formula':
      return `$${node.formula}$`
    case 'icon':
      return `[${node.path}.icon]`
    case 'blank':
      return node.text
    case 'numberList':
      return `${node.number}. ${convertNodes(node.nodes)}`
    case 'commandLine':
      return `\`${node.symbol} ${node.text}\``
    case 'strongImage':
      return `![](${node.src})`
    case 'strongIcon':
      return `[${node.path}.icon]`
    case 'helpfeel':
      return `\`? ${node.text}\``
    case 'googleMap':
      return `[${node.place}](${node.url})`
  }
}

function convertDecoration(node: DecorationNode): string {
  const hasAsterisk = node.decos.some(d => typeof d === 'string' && d.startsWith('*-'))
  const base = applyInlineDecos(node.decos, convertNodes(node.nodes))
  return hasAsterisk ? `**${base}**` : base
}

function convertLink(node: { type: 'link'; pathType: string; href: string; content: string }): string {
  if (node.pathType === 'relative') {
    return `[[${replaceDateSlashes(node.href)}]]`
  }
  if (node.content) {
    return `[${node.content}](${node.href})`
  }
  return node.href
}

function extractLanguage(fileName: string): string {
  const trimmed = fileName.trim()
  const ext = trimmed.split('.').pop()?.toLowerCase() ?? ''
  const extToLang: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    rb: 'ruby',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    sh: 'sh',
    bash: 'bash',
    css: 'css',
    html: 'html',
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    swift: 'swift',
    kt: 'kotlin',
    php: 'php',
    xml: 'xml',
    toml: 'toml',
    md: 'markdown',
  }
  return extToLang[ext] ?? ext
}
