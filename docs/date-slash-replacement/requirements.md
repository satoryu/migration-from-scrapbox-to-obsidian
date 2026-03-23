# Requirements: Date-Aware Slash Replacement

## Problem Statement

現在、`sanitizeFilename` はファイル名中の `/` を一律 `_` に置換する。しかし Scrapbox には `2026/3/23` のように日付フォーマットをタイトルに持つページが存在し、これが `2026_3_23.md` に変換されてしまう。日付としての意味を保ったまま OS 互換のファイル名にするため、日付パターンの `/` は `-` に置換すべきである。

また、ファイル名だけを変換すると内部リンク `[[2026/3/23]]` との間に不整合が生じるため、内部リンク側にも同じ変換を適用する必要がある。

## User Stories

1. ユーザーとして、日付タイトル (`2026/3/23`) のページを変換したとき、ファイル名が `2026-3-23.md` になってほしい。
2. ユーザーとして、本文中の `[2026/3/23]` というリンクが `[[2026-3-23]]` に変換され、対応するファイル名と一致してほしい。
3. ユーザーとして、日付でないスラッシュ (`path/to/page`) は従来通り `_` に置換されてほしい。

## Functional Requirements

1. `YYYY/M/D` または `YYYY/MM/DD` 形式の日付パターン中の `/` を `-` に置換する。
2. 日付パターンに該当しない `/` は従来通り `_` に置換する。
3. 内部リンク (`pathType === 'relative'`) の `href` にも同じ日付スラッシュ変換を適用する。
4. 変換ロジックはファイル名・リンクで共通の関数を使い、一貫性を保証する。

## Non-Functional Requirements

1. 純粋関数として実装し、副作用を持たない。
2. 既存テストが全てパスし続ける（後方互換性）。

## Acceptance Criteria

- [x] `sanitizeFilename('2026/3/23')` === `'2026-3-23'`
- [x] `sanitizeFilename('2026/03/23')` === `'2026-03-23'`
- [x] `sanitizeFilename('notes/2026/3/23')` === `'notes_2026-3-23'`
- [x] `sanitizeFilename('2026/3/23/notes')` === `'2026-3-23_notes'`
- [x] `sanitizeFilename('path/to/page')` === `'path_to_page'`（既存動作維持）
- [x] `convert('[2026/3/23]')` === `'[[2026-3-23]]'`
- [x] `convert('[Other page]')` === `'[[Other page]]'`（既存動作維持）
- [x] 全既存テストがパスする
- [x] `npm run build` が成功する
