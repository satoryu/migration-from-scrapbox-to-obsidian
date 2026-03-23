export function replaceDateSlashes(text: string): string {
  return text.replace(/\d{4}\/\d{1,2}\/\d{1,2}/g, (match) => match.replace(/\//g, '-'))
}

export function sanitizeFilename(title: string): string {
  return replaceDateSlashes(title)
    .replace(/[<>:"\/\\|?*]/g, '_')
    .replace(/\.\.$/, '_')
    .replace(/^\./, '_')
    .trim()
}
