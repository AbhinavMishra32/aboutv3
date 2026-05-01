---
slug: rqueue
title: rqueue
status: Planned
phase: Queue semantics
startedAt: 2026-05-09
updatedAt: 2026-05-09
repo: https://github.com/AbhinavMishra32/rqueue
stack:
  - Rust
  - TypeScript SDK
---

## What I'm building

An in-memory job queue in Rust with push, pop, ack, retry, delayed jobs, and a TypeScript interface.

## What I'm learning

- queue state ownership
- delayed jobs with priority structures
- retries and dead-letter flows
- designing a clean TS wrapper over a Rust engine

## Latest milestone

The first version is about getting queue semantics right before I touch persistence.

## My words

This one connects closest to the kind of backend work I already do. It feels like the bridge between product engineering and systems engineering.

## Next step

Model the queue state, then add delayed jobs and retry handling.
