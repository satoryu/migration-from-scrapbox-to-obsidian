# Task List: ハッシュタグを内部リンクに変換

## TDD Phase 1: 基本的なハッシュタグ変換

- [ ] `__tests__/converter.test.ts` の既存テストを `convert('#tag')` === `'[[tag]]'` に更新（失敗確認）
- [ ] `src/convert.ts` の hashTag case を `[[${replaceDateSlashes(node.href)}]]` に変更 → テスト通過

## TDD Phase 2: 追加テストケース

- [ ] 日本語ハッシュタグのテスト追加（`#日本語` → `[[日本語]]`）
- [ ] 複数ハッシュタグのテスト追加（`#foo #bar` → `[[foo]] [[bar]]`）
- [ ] 前後にテキストがある場合のテスト追加（`Hello #world end` → `Hello [[world]] end`）
- [ ] 日付形式ハッシュタグのテスト追加（`#2026/3/23` → `[[2026-3-23]]`）

## Verification

- [ ] `npm test` で全テスト通過を確認
- [ ] `npm run build` でビルド成功を確認

## PR

- [ ] Pull Request を作成
- [ ] セルフレビューをコメントとして投稿
