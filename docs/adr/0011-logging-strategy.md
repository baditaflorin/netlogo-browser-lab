# 0011 Logging Strategy

## Status

Accepted

## Context

Mode B has no server logs. Browser console noise should be minimal in production.

## Decision

Only log runtime initialization failures and unexpected recoverable errors in production. User-facing failures are shown in the UI.

## Consequences

The app remains quiet by default. Debugging production issues depends on reproducible local builds and user reports.

## Alternatives Considered

Client log shipping was rejected as unnecessary for v1.
