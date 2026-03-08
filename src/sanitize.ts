export function sanitizeFilename(title: string): string {
  return title
    .replace(/[<>:"\/\\|?*]/g, '_')
    .replace(/\.\.$/, '_')
    .replace(/^\./, '_')
    .trim()
}
