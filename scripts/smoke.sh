#!/bin/sh
set -eu

npm run build
cp dist/index.html dist/404.html
npx playwright test
