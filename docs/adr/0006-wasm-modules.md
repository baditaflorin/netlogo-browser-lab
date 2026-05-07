# 0006 WASM Modules

## Status

Accepted

## Context

CheerpJ is the Java/WASM bridge for running Java applications in the browser. GitHub Pages cannot set custom COOP/COEP headers.

## Decision

Load CheerpJ 4.3 from Leaning Technologies only after the user chooses to initialize the Java runtime. Use the documented `cheerpjInit`, `cheerpjCreateDisplay`, and JAR execution path conventions. The v1 app includes the adapter and runtime warm-up; redistributable NetLogo JAR assets can be added later under the same adapter.

## Consequences

The app does not block initial load on the Java runtime. CheerpJ licensing and NetLogo model licenses must be respected before bundling binary assets.

## Alternatives Considered

Shipping NetLogo JARs directly was deferred until redistribution terms and size budgets are settled. A native JavaScript rewrite was rejected as the long-term runtime strategy, though v1 includes faithful visual previews for curated models.
