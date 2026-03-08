import { convert } from './convert'
import { ScrapboxPage } from './types'

export function convertPage(page: ScrapboxPage): string {
  const bodyLines = page.lines.slice(1)
  const bodyText = bodyLines.join('\n')
  const convertedBody = convert(bodyText)
  return `# ${page.title}\n\n${convertedBody}`
}
