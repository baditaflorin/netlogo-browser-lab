# 0015 Deployment Topology

## Status

Accepted

## Context

Mode B requires only GitHub Pages and static data.

## Decision

Deploy the app to `https://baditaflorin.github.io/netlogo-browser-lab/` from the `gh-pages` branch. There is no Docker backend, nginx proxy, runtime database, or Prometheus service.

## Consequences

Operations are limited to rebuilding and re-publishing the static branch. GitHub Pages limitations, including lack of `_headers`, are documented.

## Alternatives Considered

Docker Compose was rejected because there is no runtime server.
