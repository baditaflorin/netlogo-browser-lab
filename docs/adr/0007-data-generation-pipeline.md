# 0007 Data Generation Pipeline

## Status

Accepted

## Context

Mode B needs an offline pipeline that produces deterministic static artifacts.

## Decision

`make data` runs `go run ./cmd/build-index --source data/source/models.seed.json --out public/data/v1 --saveEvery 100`. The command validates inputs, sorts models by title, writes JSON with stable indentation, computes SHA-256 checksums, and writes sibling metadata.

## Consequences

Data changes produce small readable diffs. The pipeline is idempotent and resumable for the current curated library size.

## Alternatives Considered

A Node script was simpler but the project requirements call for Go data generators in Mode B.
