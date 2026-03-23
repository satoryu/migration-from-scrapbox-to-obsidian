import { sanitizeFilename, replaceDateSlashes } from '../src/sanitize'

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

  test('replaces date slashes with hyphens', () => {
    expect(sanitizeFilename('2026/3/23')).toBe('2026-3-23')
  })

  test('replaces date slashes with hyphens for zero-padded dates', () => {
    expect(sanitizeFilename('2026/03/23')).toBe('2026-03-23')
  })

  test('replaces date slashes with hyphens and non-date slashes with underscores', () => {
    expect(sanitizeFilename('notes/2026/3/23')).toBe('notes_2026-3-23')
  })

  test('replaces trailing non-date slash after date with underscore', () => {
    expect(sanitizeFilename('2026/3/23/notes')).toBe('2026-3-23_notes')
  })
})

describe('replaceDateSlashes', () => {
  test('replaces slashes in YYYY/M/D pattern with hyphens', () => {
    expect(replaceDateSlashes('2026/3/23')).toBe('2026-3-23')
  })

  test('replaces slashes in YYYY/MM/DD pattern with hyphens', () => {
    expect(replaceDateSlashes('2026/03/23')).toBe('2026-03-23')
  })

  test('does not modify non-date slashes', () => {
    expect(replaceDateSlashes('path/to/page')).toBe('path/to/page')
  })

  test('replaces only the date portion when mixed with non-date slashes', () => {
    expect(replaceDateSlashes('path/to/2026/3/23')).toBe('path/to/2026-3-23')
  })

  test('handles date followed by trailing slash content', () => {
    expect(replaceDateSlashes('2026/3/23/notes')).toBe('2026-3-23/notes')
  })

  test('handles multiple dates in one string', () => {
    expect(replaceDateSlashes('2026/3/23 and 2025/12/1')).toBe('2026-3-23 and 2025-12-1')
  })

  test('returns string unchanged when no date pattern present', () => {
    expect(replaceDateSlashes('Hello World')).toBe('Hello World')
  })

  test('does not match incomplete date patterns like YYYY/M', () => {
    expect(replaceDateSlashes('2026/3')).toBe('2026/3')
  })
})
