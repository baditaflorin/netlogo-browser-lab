# 0002 Architecture Overview

## Status

Accepted

## Context

The system has a public static app, generated data artifacts, browser runtime adapters, local storage, and tests.

## Decision

Use these module boundaries:

- `cmd/build-index` builds static model artifacts.
- `internal/modelindex` owns artifact normalization and metadata.
- `src/features/library` loads and validates library data.
- `src/features/runtime` owns simulation stepping, canvas rendering, WebGPU probing, and CheerpJ loading.
- `src/features/explainer` generates local teaching explanations.
- `src/features/storage` persists browser preferences and recent selections.

## Consequences

Data generation remains independent from the UI. Browser-only runtime code stays lazy and isolated. The first release can be useful before bundling every upstream NetLogo model.

## Alternatives Considered

A monolithic frontend-only JSON file was simpler but harder to validate and regenerate. A server API added operational cost without v1 value.
