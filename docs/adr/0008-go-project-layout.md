# 0008 Go Project Layout

## Status

Accepted

## Context

The project has no runtime Go server, but it does have a build-time data generator.

## Decision

Use the Go project layout conventions where useful:

- `cmd/build-index` for the executable.
- `internal/modelindex` for generator internals.
- `internal/utils` for shared error reporting.
- `pkg/contracts` for JSON contracts shared by tests and future tools.

## Consequences

The Go surface remains small and easy to test. Runtime server directories are intentionally absent.

## Alternatives Considered

A flat single-file command was rejected because the generator already has validation, checksumming, and tests.
