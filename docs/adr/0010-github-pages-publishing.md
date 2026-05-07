# 0010 GitHub Pages Publishing

## Status

Accepted

## Context

The repository needs source documentation under `docs/` and a public GitHub Pages site from day one.

## Decision

Publish the built Vite output from the `gh-pages` branch root. Keep `dist/` ignored on `main`; the `gh-pages` branch contains the generated site. Configure Vite with `base: "/netlogo-browser-lab/"`, hashed assets, and a copied `404.html` SPA fallback.

## Consequences

The source branch can use `docs/` for ADRs and guides without colliding with Pages artifacts. Rollback is a branch revert or re-publish from an earlier commit.

## Alternatives Considered

Publishing from `main/docs` was rejected because it would mix source docs and generated frontend files.
