---
slug: json-lite
title: json-lite
status: Planned
phase: Parser training
startedAt: 2026-05-05
updatedAt: 2026-05-05
repo: https://github.com/AbhinavMishra32/json-lite
stack:
  - Rust
---

## What I'm building

A small JSON parser that handles strings, numbers, booleans, null, arrays, and objects.

## What I'm learning

- enums for recursive data
- parser state machines
- walking byte-by-byte without losing clarity
- building structure from raw input

## Latest milestone

The target is not “full JSON support.” It is building a parser that makes protocol work feel natural later.

## My words

I want parsing to stop feeling magical. If I can turn bytes into structure myself, Redis stops being intimidating.

## Next step

Tokenization first, then recursive descent parsing for arrays and objects.
