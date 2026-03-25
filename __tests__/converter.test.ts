import { convert } from '../src/convert'

describe('convert', () => {
  describe('decorations as headings', () => {
    test('[* text] with single star is converted to H4', () => {
      expect(convert('[* Foo]')).toBe('#### Foo')
    })

    test('[** text] with two stars is converted to H3', () => {
      expect(convert('[** Foo]')).toBe('### Foo')
    })

    test('[*** text] with three stars is converted to H2', () => {
      expect(convert('[*** Foo]')).toBe('## Foo')
    })

    test('[**** text] with four stars is converted to H1', () => {
      expect(convert('[**** Foo]')).toBe('# Foo')
    })
  })

  describe('inline decorations', () => {
    test('bold [[text]] converts to **text**', () => {
      expect(convert('Hello [[world]]')).toBe('Hello **world**')
    })

    test('italic [/ text] converts to *text*', () => {
      expect(convert('[/ italic]')).toBe('*italic*')
    })

    test('strikethrough [- text] converts to ~~text~~', () => {
      expect(convert('[- deleted]')).toBe('~~deleted~~')
    })

    test('inline bold [* text] within other content', () => {
      expect(convert('Hello [* bold] world')).toBe('Hello **bold** world')
    })
  })

  describe('links', () => {
    test('internal link [Page] converts to [[Page]]', () => {
      expect(convert('[Other page]')).toBe('[[Other page]]')
    })

    test('external link [label url] converts to [label](url)', () => {
      expect(convert('[Google https://google.com]')).toBe('[Google](https://google.com)')
    })

    test('bare external link [url] converts to url', () => {
      expect(convert('[https://example.com]')).toBe('https://example.com')
    })

    test('internal link with date path replaces slashes with hyphens', () => {
      expect(convert('[2026/3/23]')).toBe('[[2026-3-23]]')
    })

    test('internal link with date and surrounding text', () => {
      expect(convert('See [2026/3/23] for details')).toBe('See [[2026-3-23]] for details')
    })
  })

  describe('hashtags', () => {
    test('#tag is converted to [[tag]]', () => {
      expect(convert('#tag')).toBe('[[tag]]')
    })

    test('#tag with Japanese characters converts to internal link', () => {
      expect(convert('#日本語')).toBe('[[日本語]]')
    })

    test('multiple hashtags on a line are each converted to internal links', () => {
      expect(convert('#foo #bar')).toBe('[[foo]] [[bar]]')
    })

    test('hashtag with surrounding text', () => {
      expect(convert('Hello #world end')).toBe('Hello [[world]] end')
    })

    test('hashtag with date-like value applies date slash replacement', () => {
      expect(convert('#2026/3/23')).toBe('[[2026-3-23]]')
    })
  })

  describe('indentation / lists', () => {
    test('indented lines become bullet list items', () => {
      expect(convert('Items:\n item1\n item2')).toBe('Items:\n- item1\n- item2')
    })

    test('nested indentation becomes nested bullets', () => {
      expect(convert('Top\n item\n  nested')).toBe('Top\n- item\n  - nested')
    })
  })

  describe('code blocks', () => {
    test('code block with filename converts to fenced block', () => {
      const input = 'code:hello.js\n console.log("hi")'
      const expected = '```javascript\nconsole.log("hi")\n```'
      expect(convert(input)).toBe(expected)
    })
  })

  describe('inline code', () => {
    test('`code` is preserved', () => {
      expect(convert('use `npm install`')).toBe('use `npm install`')
    })
  })

  describe('quotes', () => {
    test('> text converts to blockquote', () => {
      expect(convert('> hello')).toBe('> hello')
    })
  })

  describe('formulas', () => {
    test('[$ formula] converts to $formula$', () => {
      expect(convert('[$ E=mc^2]')).toBe('$E=mc^2$')
    })
  })

  describe('empty lines', () => {
    test('empty lines are preserved', () => {
      expect(convert('line1\n\nline2')).toBe('line1\n\nline2')
    })
  })

  describe('tables', () => {
    test('table converts to markdown table', () => {
      const input = 'table:test\n A\tB\n 1\t2'
      const expected = '| A | B |\n| --- | --- |\n| 1 | 2 |'
      expect(convert(input)).toBe(expected)
    })
  })
})
