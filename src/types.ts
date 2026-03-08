export interface ScrapboxExport {
  name: string
  displayName: string
  exported: number
  pages: ScrapboxPage[]
}

export interface ScrapboxPage {
  title: string
  created: number
  updated: number
  id: string
  lines: string[]
}
