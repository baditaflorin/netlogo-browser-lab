# NetLogo Browser Lab

[![Live site](https://img.shields.io/badge/live-GitHub%20Pages-0f766e)](https://baditaflorin.github.io/netlogo-browser-lab/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Live site: https://baditaflorin.github.io/netlogo-browser-lab/

Repository: https://github.com/baditaflorin/netlogo-browser-lab

NetLogo Browser Lab makes classic agent-based models approachable from a static browser app: curated model cards, visual simulations, local explanations, WebGPU capability detection, and an on-demand CheerpJ runtime bridge without a Java install.

![NetLogo Browser Lab screenshot](docs/assets/screenshot.svg)

## Quickstart

```sh
npm install
make data
make dev
```

Run checks:

```sh
make test
make build
make smoke
```

Install local hooks:

```sh
make install-hooks
```

## Architecture

```mermaid
flowchart LR
  source["Curated seed data"] --> generator["Go build-index"]
  generator --> artifacts["Static JSON artifacts"]
  artifacts --> app["Vite React app"]
  app --> pages["GitHub Pages"]
  app --> cheerpj["CheerpJ 4.3 loader"]
  app --> browser["Canvas / WebGPU-capable browser"]
```

ADRs: docs/adr/

Deployment guide: docs/deploy.md

Data contract: docs/data.md

Privacy: docs/privacy.md
