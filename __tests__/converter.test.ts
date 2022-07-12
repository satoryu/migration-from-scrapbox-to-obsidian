import { convert } from '../src/convert'

test(" a line consisting of only one decoration is converted to a header", () => {
  const actual = convert('[* Foo]')
  const expected = '# Foo'

  expect(actual).toBe(expected)
})
