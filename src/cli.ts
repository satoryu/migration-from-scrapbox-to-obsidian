#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { ScrapboxExport, ScrapboxPage } from './types'
import { convertPage } from './convertPage'
import { sanitizeFilename } from './sanitize'

interface ConvertSuccess {
  readonly kind: 'success'
  readonly title: string
}

interface ConvertFailure {
  readonly kind: 'failure'
  readonly title: string
  readonly error: string
}

type ConvertResult = ConvertSuccess | ConvertFailure

function parseArgs(argv: readonly string[]): { inputPath: string; outputDir: string } | null {
  const args = argv.slice(2)
  return args.length >= 2 ? { inputPath: args[0], outputDir: args[1] } : null
}

function validateExport(data: unknown): data is ScrapboxExport {
  return typeof data === 'object' && data !== null &&
    'pages' in data && Array.isArray((data as ScrapboxExport).pages)
}

function pageToFile(page: ScrapboxPage): { filename: string; content: string } {
  return {
    filename: sanitizeFilename(page.title) + '.md',
    content: convertPage(page),
  }
}

function tryConvertPage(outputDir: string, page: ScrapboxPage): ConvertResult {
  try {
    const file = pageToFile(page)
    fs.writeFileSync(path.join(outputDir, file.filename), file.content, 'utf-8')
    return { kind: 'success', title: page.title }
  } catch (err) {
    return { kind: 'failure', title: page.title, error: (err as Error).message }
  }
}

function formatSummary(results: readonly ConvertResult[]): string {
  const successCount = results.filter(r => r.kind === 'success').length
  const errorCount = results.filter(r => r.kind === 'failure').length
  const errorMessages = results
    .filter((r): r is ConvertFailure => r.kind === 'failure')
    .map(r => `Error converting page "${r.title}": ${r.error}`)
  return [...errorMessages, `Done. Converted ${successCount} pages. ${errorCount} errors.`].join('\n')
}

function main(): void {
  const args = parseArgs(process.argv)
  if (args === null) {
    console.error('Usage: scrapbox2obsidian <input.json> <output-dir>')
    process.exitCode = 1
    return
  }

  const raw = (() => {
    try { return fs.readFileSync(args.inputPath, 'utf-8') }
    catch (err) { return err as Error }
  })()
  if (raw instanceof Error) {
    console.error(`Error reading input file: ${raw.message}`)
    process.exitCode = 1
    return
  }

  const data: unknown = JSON.parse(raw)
  if (!validateExport(data)) {
    console.error('Invalid JSON: expected "pages" array')
    process.exitCode = 1
    return
  }

  fs.mkdirSync(args.outputDir, { recursive: true })

  const results = data.pages.map(page => tryConvertPage(args.outputDir, page))
  console.log(formatSummary(results))
}

main()
