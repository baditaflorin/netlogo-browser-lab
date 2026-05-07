# 0016 Local Git Hooks

## Status

Accepted

## Context

The project intentionally uses no GitHub Actions. Checks must run locally.

## Decision

Use plain `.githooks/` wired by `make install-hooks`. Hooks run formatting checks, ESLint, TypeScript, Go tests, gitleaks, Conventional Commits validation, build, and smoke tests.

## Consequences

Contributors can reproduce checks locally. The first install step is explicit and idempotent.

## Alternatives Considered

Lefthook was considered but is not installed by default on this machine.
