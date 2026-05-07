# 0013 Testing Strategy

## Status

Accepted

## Context

The app needs confidence in data generation, frontend logic, and the published shell.

## Decision

Use Go unit tests for the generator, Vitest for TypeScript logic, Playwright for one browser happy path, and `scripts/smoke.sh` to build, serve, and test the static site.

## Consequences

`make test` and `make smoke` cover the highest-risk paths without requiring a remote server.

## Alternatives Considered

Full cross-browser e2e was deferred because v1 needs one reliable smoke path first.
