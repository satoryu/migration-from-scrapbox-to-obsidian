import { convertPage } from '../src/convertPage'

describe('convertPage', () => {
  test('converts a page with title and body', () => {
    const page = {
      title: 'My Page',
      created: 1234567890,
      updated: 1234567890,
      id: 'test-id',
      lines: ['My Page', 'Hello world', ' item1', ' item2'],
    }
    const result = convertPage(page)
    expect(result).toBe('# My Page\n\nHello world\n- item1\n- item2')
  })

  test('converts a page with only title', () => {
    const page = {
      title: 'Empty Page',
      created: 1234567890,
      updated: 1234567890,
      id: 'test-id',
      lines: ['Empty Page'],
    }
    const result = convertPage(page)
    expect(result).toBe('# Empty Page\n\n')
  })
})
