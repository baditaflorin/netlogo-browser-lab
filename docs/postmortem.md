# Postmortem

## What Was Built

V1 delivers a static GitHub Pages app with a curated NetLogo model library, browser visual simulations, static local explanations, CheerpJ runtime initialization, WebGPU capability detection, IndexedDB preferences, build metadata, and local checks.

## Was Mode B Correct?

Yes. Mode B kept the public surface fully static while giving the model library a reproducible generator and artifact metadata. A runtime backend would not have helped v1. Pure Mode A would have made the curated data contract less disciplined.

## What Worked

The static architecture fit GitHub Pages well. The browser visual runner makes the concept tangible before bundling large Java assets. The version and commit markers make published builds traceable.

## What Did Not Work

Redistributing the full NetLogo runtime and model archive was not appropriate without a separate license and payload review. The v1 CheerpJ integration is therefore a runtime bridge and warm-up path rather than a bundled NetLogo JAR launcher.

## Surprises

Keeping source documentation under `docs/` made a `gh-pages` branch much cleaner than publishing from `main/docs`.

## Accepted Tech Debt

The visual runner is a curated JavaScript simulator for selected models while the CheerpJ bridge is prepared for redistributable Java artifacts. WebGPU is detected and surfaced, but deterministic v1 stepping remains CPU-side with canvas rendering.

## Next Improvements

1. Add a licensed NetLogo JAR artifact path and run one unmodified model through CheerpJ.
2. Expand the offline indexer to ingest the official NetLogo models repository with license filters.
3. Add optional WebLLM model loading for richer local explanations.

## Time Spent Vs Estimate

Estimated: one focused implementation session for v1 scaffold and publish. Actual: one focused implementation session.
