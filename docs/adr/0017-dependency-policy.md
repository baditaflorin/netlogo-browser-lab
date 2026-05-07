# 0017 Dependency Policy

## Status

Accepted

## Context

The project touches browser runtime, data validation, and tests. Custom low-level implementations would add risk.

## Decision

Use production-grade libraries for the app shell and data flow: Vite, React, TypeScript, TanStack Query, Zod, Lucide React, idb, Vitest, Playwright, and Go stdlib JSON/checksum utilities. Add heavy runtime libraries only behind user action.

## Consequences

The baseline app stays maintainable and small. New dependencies require an ADR when they change the runtime model or payload budget.

## Alternatives Considered

Hand-rolled data fetching, schema validation, and browser tests were rejected.
