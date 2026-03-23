# Design: Date-Aware Slash Replacement

## Architectural Design

既存の変換パイプラインに最小限の変更を加える。日付スラッシュ変換の共通関数 `replaceDateSlashes` を `src/sanitize.ts` に追加し、ファイル名生成とリンク変換の両方から呼び出す。

### 変更対象モジュール

```
src/sanitize.ts  ← replaceDateSlashes 追加、sanitizeFilename 修正
src/convert.ts   ← convertLink で replaceDateSlashes を使用
```

## Component Diagram

```mermaid
graph TD
    subgraph "sanitize.ts"
        RDS["replaceDateSlashes(text): string<br/>新規追加"]
        SF["sanitizeFilename(title): string<br/>修正"]
    end

    subgraph "convert.ts"
        CL["convertLink(node): string<br/>修正"]
    end

    subgraph "cli.ts"
        PTF["pageToFile(page)"]
    end

    PTF --> SF
    SF --> RDS
    CL --> RDS
```

## Sequence Diagrams

### ファイル名生成

```mermaid
sequenceDiagram
    participant PTF as pageToFile
    participant SF as sanitizeFilename
    participant RDS as replaceDateSlashes

    PTF->>SF: "2026/3/23"
    SF->>RDS: "2026/3/23"
    RDS-->>SF: "2026-3-23"
    Note over SF: .replace(/[<>:"/\\|?*]/g, '_')<br/>→ 変更なし（/ は残っていない）
    SF-->>PTF: "2026-3-23"
    Note over PTF: filename: "2026-3-23.md"
```

### 内部リンク変換

```mermaid
sequenceDiagram
    participant CN as convertNode
    participant CL as convertLink
    participant RDS as replaceDateSlashes

    CN->>CL: {pathType: 'relative', href: '2026/3/23'}
    CL->>RDS: "2026/3/23"
    RDS-->>CL: "2026-3-23"
    CL-->>CN: "[[2026-3-23]]"
    Note over CN: ファイル名 "2026-3-23.md" と<br/>リンク "[[2026-3-23]]" が一致
```

### 非日付スラッシュ（既存動作維持）

```mermaid
sequenceDiagram
    participant SF as sanitizeFilename
    participant RDS as replaceDateSlashes

    SF->>RDS: "path/to/page"
    RDS-->>SF: "path/to/page"（変更なし）
    Note over SF: .replace(/[<>:"/\\|?*]/g, '_')<br/>→ "path_to_page"
    SF-->>SF: return "path_to_page"
```

## Design Decisions

### 正規表現パターン: `/\d{4}\/\d{1,2}\/\d{1,2}/g`

- `YYYY/M/D` と `YYYY/MM/DD` の両方にマッチ
- カレンダー上の妥当性チェック（月が1-12かなど）は行わない。ファイル名変換ツールとしては構文的に日付に見えるものを変換すれば十分
- `g` フラグで文字列中の複数の日付に対応

### `replaceDateSlashes` を一般置換の前に適用する理由

一般置換 (`/[<>:"\/\\|?*]/g` → `_`) を先に実行すると全ての `/` が `_` に変わり、日付パターンの検出ができなくなる。そのため日付変換を先に行う必要がある。
