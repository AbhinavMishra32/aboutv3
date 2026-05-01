---
slug: rgrep
title: rgrep
status: Building
phase: Rust foundation
startedAt: 2026-05-02
updatedAt: 2026-05-02
repo: https://github.com/AbhinavMishra32/rgrep
stack:
  - Rust
  - TypeScript
---

## What I'm building

A tiny grep-style CLI in Rust with a TypeScript-facing interface layer later on.

## What I'm learning

- file traversal and recursive search
- `String` vs `&str`
- `Result`-first error flow
- borrowing data without reaching for `clone`

## Latest milestone

Basic query matching and CLI argument parsing are the first pieces I want solid before I add recursion and flags.

## My words

This is the first project where the Rust compiler is not just blocking me, it is teaching me where my mental model is still fuzzy.

## Next step

Recursive folder search, line numbers, and a clean case-insensitive flag.
