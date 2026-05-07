# 0001 Deployment Mode

## Status

Accepted

## Context

The product must make NetLogo models accessible from a public URL without requiring a local Java installation. The default architecture is GitHub Pages first. The app needs a curated model library, generated metadata, static explanations, a browser runtime bridge, and no runtime secrets.

## Decision

Use Mode B: GitHub Pages plus pre-built data.

The frontend is a static Vite app published from the `gh-pages` branch. The data pipeline is an offline Go command that converts curated source metadata into versioned static JSON artifacts copied into the built site. No runtime backend is deployed.

## Consequences

Users get a static public app with no server to operate. Model library freshness depends on regenerating and publishing artifacts. Large NetLogo runtime assets are not committed unless their licenses permit redistribution.

## Alternatives Considered

Mode A was rejected because the curated library index benefits from reproducible build-time normalization and metadata checksums. Mode C was rejected because v1 has no auth, mutations, secrets, or cross-device sync.
