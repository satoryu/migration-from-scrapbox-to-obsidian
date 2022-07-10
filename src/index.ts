import { parse } from '@progfay/scrapbox-parser'

const text = `
[* Bold Type]

Here is [the link to my web site https://www.satoryu.com]

My Favorites are:
 Oshigoto
  BABYMETAL
  Ayami Muto
  @onefive

This is #tag and internal link [Other page]

code: foo.rb
  class Foo
    def hello
      puts "hello"
    end
  end

> かたつむり
> 休まず登れ
> [** 富士の山]
`

const parsed = parse(text)

console.log(JSON.stringify(parsed, null, 2))