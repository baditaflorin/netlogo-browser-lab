# Deploy Guide

Live site: https://baditaflorin.github.io/netlogo-browser-lab/

Repository: https://github.com/baditaflorin/netlogo-browser-lab

GitHub Pages publishes from the `gh-pages` branch root. The source branch keeps generated `dist/` ignored.

Publish manually:

```sh
make data
make build
npm run pages:publish
```

Rollback by checking out a known good source commit, rebuilding, and re-running `npm run pages:publish`, or by reverting the `gh-pages` branch commit.

Custom domains can be added by placing a `CNAME` file in `public/` before publishing and configuring DNS with the GitHub Pages records documented at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site.
