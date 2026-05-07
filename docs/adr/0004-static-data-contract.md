# 0004 Static Data Contract

## Status

Accepted

## Context

The browser needs a searchable list of curated model cards with stable metadata and a freshness indicator.

## Decision

The build pipeline writes:

- `public/data/v1/models.json`
- `public/data/v1/models.meta.json`

`models.json` contains `{ schemaVersion, models }`. Each model has a stable `id`, `title`, `category`, `difficulty`, `tags`, `sourceUrl`, `license`, `runtime`, `summary`, `mechanics`, `defaultParameters`, and `simulationKind`.

`models.meta.json` contains `schemaVersion`, `generatedAt`, `sourceCommit`, `inputChecksum`, `modelCount`, and `artifactVersion`.

## Consequences

The frontend can cache by schema version and surface data freshness. Breaking changes move to `/data/v2/`.

## Alternatives Considered

SQLite WASM was deferred because v1 has a small curated set. Parquet was unnecessary for browser startup.
