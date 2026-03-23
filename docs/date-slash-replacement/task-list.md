# Task List: Date-Aware Slash Replacement

## TDD Phase 1: `replaceDateSlashes` 関数

- [ ] `__tests__/sanitize.test.ts` に `replaceDateSlashes` のテストを追加（失敗確認）
- [ ] `src/sanitize.ts` に `replaceDateSlashes` を実装 → テスト通過

## TDD Phase 2: `sanitizeFilename` の日付対応

- [ ] `__tests__/sanitize.test.ts` に `sanitizeFilename` の日付テストを追加（失敗確認）
- [ ] `src/sanitize.ts` の `sanitizeFilename` を修正（`replaceDateSlashes` を先に適用）→ テスト通過

## TDD Phase 3: `convertLink` の日付対応

- [ ] `__tests__/converter.test.ts` に内部リンクの日付テストを追加（失敗確認）
- [ ] `src/convert.ts` の `convertLink` を修正（`replaceDateSlashes` を適用）→ テスト通過

## Verification

- [ ] `npm test` で全テスト通過を確認
- [ ] `npm run build` でビルド成功を確認

## PR

- [ ] Pull Request を作成
- [ ] セルフレビューをコメントとして投稿
