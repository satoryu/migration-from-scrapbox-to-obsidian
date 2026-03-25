# Requirements: ハッシュタグを内部リンクに変換

## Problem Statement

Scrapbox のハッシュタグ（`#hoge`）は Scrapbox 内でリンクとして機能し、同名のページへの参照を表す。現在の変換ロジックでは `#hoge` をそのまま出力しているが、Obsidian では `#hoge` はタグとして扱われ、ページリンクとしては機能しない。Scrapbox のハッシュタグを Obsidian の内部リンク `[[hoge]]` に変換することで、ページ間の参照関係を維持する必要がある。

## User Stories

1. ユーザーとして、Scrapbox の `#hoge` を変換したとき、Obsidian で `[[hoge]]` として対応するページへリンクしてほしい。
2. ユーザーとして、日本語のハッシュタグ（`#日本語`）も同様に `[[日本語]]` に変換されてほしい。
3. ユーザーとして、日付形式のハッシュタグ（`#2026/3/23`）が `[[2026-3-23]]` に変換され、対応するファイル名と一致してほしい。

## Functional Requirements

1. `hashTag` ノードの変換結果を `#href` から `[[href]]` に変更する。
2. `href` に対して `replaceDateSlashes` を適用し、日付形式のスラッシュをハイフンに変換する（`convertLink` と同じ処理）。
3. 既存の他のノード型の変換に影響を与えない。

## Non-Functional Requirements

1. 純粋関数として実装し、副作用を持たない。
2. 既存の他のテストが全てパスし続ける。

## Acceptance Criteria

- [ ] `convert('#tag')` === `'[[tag]]'`
- [ ] `convert('#日本語')` === `'[[日本語]]'`
- [ ] `convert('#foo #bar')` === `'[[foo]] [[bar]]'`
- [ ] `convert('Hello #world end')` === `'Hello [[world]] end'`
- [ ] `convert('#2026/3/23')` === `'[[2026-3-23]]'`
- [ ] 全既存テスト（hashTag 以外）がパスする
- [ ] `npm run build` が成功する
