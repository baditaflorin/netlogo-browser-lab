# 0009 Configuration And Secrets

## Status

Accepted

## Context

The public frontend must never hold secrets. Build metadata and links need configuration.

## Decision

Use public Vite environment variables for non-secret build metadata only: app version, commit, repository URL, and PayPal URL. Keep `.env*` ignored except `.env.example`. Use gitleaks in local hooks.

## Consequences

There are no runtime secrets. Public URLs can be changed at build time without code edits.

## Alternatives Considered

Server-side secrets were rejected because no backend exists.
