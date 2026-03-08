# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A TypeScript CLI tool to migrate pages from Scrapbox to Obsidian format. It parses Scrapbox syntax using `@progfay/scrapbox-parser` and converts it to Obsidian-compatible Markdown.

## Commands

```sh
npm run build    # Compile TypeScript to dist/
npm run watch    # Watch mode for incremental compilation
npm test         # Run all tests with Jest
npx jest --testPathPattern=<file>  # Run a single test file
```

## Architecture

- `src/index.ts` — Scratch/exploration file for experimenting with the Scrapbox parser output. Not the main entry point.
- `src/convert.ts` — Core conversion logic. Exports `convert(text: string): string` which takes raw Scrapbox text and returns Obsidian Markdown.
- `__tests__/converter.test.ts` — Jest tests for the `convert` function.

The conversion pipeline: raw Scrapbox text → `parse()` from `@progfay/scrapbox-parser` → traverse AST nodes → emit Obsidian Markdown.

TypeScript compiles to `dist/` (CommonJS, ES2016 target, strict mode).

The codes in this repository must be in functional programming manner. Avoid side effects and mutable state where possible. Use pure functions that take inputs and return outputs without modifying external state. This makes the code easier to test and reason about.

## Development workflow:

1. Create a new branch for your work (e.g., `docs/[issue no.]-[short-description]`).
  - `docs/[issue no.]-[short-description]/requirements.md`:
    - Problem Statement
    - User Stories
    - Functional Requirements, Non-Functional Requirements
    - Acceptance Criteria
  - `docs/[issue no.]-[short-description]/design.md`:
    - Architectural Design
    - Component Diagrams
    - Sequence Diagrams
  - `docs/[issue no.]-[short-description]/task-list.md`:
    - Detailed Task Breakdown
2. User must approve these documents before starting implementation.
3. Create a new branch for implementation (e.g., `feature/[issue no.]-[short-description]`).
4. Implement the feature in TDD manner:
  - Write a failing test case that captures the expected behavior.
  - Implement the minimum code to pass the test.
  - Refactor the code while ensuring tests still pass.
5. Once implementation is complete, create a pull request for review.
6. Just after creating the pull request, you must review your own code yourself and put feedback as comments of the pull request.
