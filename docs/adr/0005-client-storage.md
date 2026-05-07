# 0005 Client-Side Storage

## Status

Accepted

## Context

Users need local preferences, recent model selection, and simple run settings without accounts.

## Decision

Use IndexedDB through the `idb` library for structured preferences. Use memory state for live simulations and avoid storing personal data.

## Consequences

The app works offline after first load and needs no backend persistence. Cross-device sync is out of scope.

## Alternatives Considered

`localStorage` was rejected for structured data. OPFS was unnecessary for v1 because no large user-authored artifacts are stored.
