---
slug: rstore
title: rstore
status: Planned
phase: Storage engine
startedAt: 2026-05-16
updatedAt: 2026-05-16
repo: https://github.com/AbhinavMishra32/rstore
stack:
  - Rust
  - TypeScript SDK
---

## What I'm building

A tiny persistent key-value store with an append-only log, in-memory index, replay on startup, and compaction later.

## What I'm learning

- append-only persistence
- in-memory indexing
- crash recovery thinking
- separating write paths from read paths

## Latest milestone

The first checkpoint is `SET`, `GET`, and `DEL` backed by an append-only file.

## My words

If this clicks, I know I will understand Redis and storage systems at a much deeper level than I do today.

## Next step

Write path first, replay on startup second, compaction after that.
