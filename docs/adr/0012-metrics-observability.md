# 0012 Metrics And Observability

## Status

Accepted

## Context

The app is static and privacy-sensitive. Usage insight is useful but not required for v1.

## Decision

Ship no analytics by default. Surface build version, commit, data version, WebGPU support, and CheerpJ status in the UI.

## Consequences

No PII is collected. Operational visibility comes from the published version markers and local smoke tests.

## Alternatives Considered

Plausible analytics was considered and deferred until there is explicit consent and a privacy need.
