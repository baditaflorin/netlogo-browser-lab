# Contributing

Thanks for helping make old educational simulations easier to reach.

Local setup:

```sh
npm install
make data
make dev
```

Before pushing:

```sh
make install-hooks
make test
make build
make smoke
```

Commits use Conventional Commits, for example `feat: add model search`.
