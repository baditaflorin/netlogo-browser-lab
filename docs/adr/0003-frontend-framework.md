# 0003 Frontend Framework And Build Tooling

## Status

Accepted

## Context

The app needs a rich browser UI, strict TypeScript, local state, canvas rendering, tests, and GitHub Pages publishing.

## Decision

Use React, TypeScript strict mode, Vite, TanStack Query, Zod, Lucide icons, Vitest, and Playwright. Tailwind is included as an approved styling dependency, while the v1 interface uses a small hand-authored CSS system to keep the payload and build pipeline simple.

## Consequences

The app is fast to develop and easy to publish as static assets. Runtime-heavy pieces are lazy-loaded after user action.

## Alternatives Considered

Svelte and Solid were considered, but React has broader library and testing support for this scope. Next.js was rejected because the app does not need server rendering.
