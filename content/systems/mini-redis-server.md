---
slug: mini-redis-server
title: mini-redis-server
status: Planned
phase: Networking and execution
startedAt: 2026-05-30
updatedAt: 2026-05-30
repo: https://github.com/AbhinavMishra32/mini-redis-server
stack:
  - Rust
  - TypeScript dashboard
---

## What I'm building

A small Redis-compatible server in Rust with TCP handling, RESP parsing, and core commands like `PING`, `SET`, `GET`, and `EXPIRE`.

## What I'm learning

- Tokio and async networking
- shared state across multiple clients
- command execution paths
- connecting parser work to real server behavior

## Latest milestone

The first success condition is simple: `redis-cli` can talk to my server and basic commands work.

## My words

This is the project that turns the whole journey into a real identity shift.

## Next step

Wire the RESP parser into a TCP listener and get `PING` working end to end.
