import { sanitizeFilename } from '../src/sanitize'

describe('sanitizeFilename', () => {
  test('passes through normal titles', () => {
    expect(sanitizeFilename('Hello World')).toBe('Hello World')
  })

  test('replaces slashes', () => {
    expect(sanitizeFilename('path/to/page')).toBe('path_to_page')
  })

  test('replaces colons', () => {
    expect(sanitizeFilename('Note: important')).toBe('Note_ important')
  })

  test('replaces multiple invalid characters', () => {
    expect(sanitizeFilename('a<b>c:d"e')).toBe('a_b_c_d_e')
  })

  test('handles leading dot', () => {
    expect(sanitizeFilename('.hidden')).toBe('_hidden')
  })

  test('handles trailing ..', () => {
    expect(sanitizeFilename('test..')).toBe('test_')
  })
})
