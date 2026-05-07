# 0014 Error Handling Conventions

## Status

Accepted

## Context

Errors can occur in data generation, static fetches, browser capabilities, and runtime adapters.

## Decision

Go code wraps errors with context and reports them through `internal/utils.HandleErrorOrLogWithMessages`. Frontend code validates static data with Zod, shows clear fallback UI, and keeps simulation controls usable when CheerpJ or WebGPU are unavailable.

## Consequences

Failures are explicit and recoverable. The app does not panic or silently swallow data problems.

## Alternatives Considered

Fail-open parsing was rejected because bad model metadata would make teaching explanations misleading.
