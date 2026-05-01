---
slug: resp-parser
title: resp-parser
status: Planned
phase: Protocol parsing
startedAt: 2026-05-23
updatedAt: 2026-05-23
repo: https://github.com/AbhinavMishra32/resp-parser
stack:
  - Rust
---

## What I'm building

A RESP parser that turns Redis protocol frames into typed command structures.

## What I'm learning

- byte-oriented parsing
- zero-copy instincts
- command modeling with enums
- keeping parser state readable

## Latest milestone

I want to parse `PING`, `GET`, and `SET` cleanly before thinking about a server.

## My words

This is where the Redis story stops being abstract and starts turning into something I can hold in code.

## Next step

Parse arrays and bulk strings into a command enum.
