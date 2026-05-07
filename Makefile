SHELL := /bin/sh
VERSION := $(shell node -p "require('./package.json').version")
COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo local)
GO_PACKAGES := ./cmd/... ./internal/... ./pkg/...

.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview docker-build docker-push release compose-up compose-down clean hooks-pre-commit hooks-commit-msg hooks-pre-push

help:
	@printf "%s\n" "Targets:"
	@printf "%s\n" "  make install-hooks     Wire local git hooks"
	@printf "%s\n" "  make dev               Run the frontend dev server"
	@printf "%s\n" "  make build             Build static Pages site into dist/"
	@printf "%s\n" "  make data              Regenerate static data artifacts"
	@printf "%s\n" "  make test              Run unit tests"
	@printf "%s\n" "  make smoke             Build, serve, and run Playwright smoke tests"
	@printf "%s\n" "  make lint              Run linters and format checks"
	@printf "%s\n" "  make fmt               Autoformat code"
	@printf "%s\n" "  make pages-preview     Serve dist/ as Pages would"
	@printf "%s\n" "  make release           Tag current commit as v$(VERSION)"

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev:
	npm run dev

data:
	go run ./cmd/build-index --source data/source/models.seed.json --out public/data/v1 --version $(VERSION)

build: data
	VITE_APP_VERSION=$(VERSION) VITE_GIT_COMMIT=$(COMMIT) VITE_GITHUB_REPOSITORY_URL=https://github.com/baditaflorin/netlogo-browser-lab VITE_PAYPAL_URL=https://www.paypal.com/paypalme/florinbadita npm run build
	cp dist/index.html dist/404.html

test:
	npm test
	go test $(GO_PACKAGES)

test-integration:
	@printf "%s\n" "No integration tests are required for Mode B v1."

smoke:
	./scripts/smoke.sh

lint:
	npm run lint
	npm run fmt:check
	go vet $(GO_PACKAGES)

fmt:
	npm run fmt
	gofmt -w cmd internal pkg

pages-preview: build
	npm run preview -- --host 127.0.0.1 --port 4173

docker-build:
	@printf "%s\n" "Mode B has no Docker backend."

docker-push:
	@printf "%s\n" "Mode B has no Docker backend."

release:
	git tag v$(VERSION)
	@printf "%s\n" "Tagged v$(VERSION). Publish with: git push origin v$(VERSION)"

compose-up:
	@printf "%s\n" "Mode B has no Docker Compose stack."

compose-down:
	@printf "%s\n" "Mode B has no Docker Compose stack."

clean:
	rm -rf dist coverage playwright-report test-results

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	@test -n "$(MSG)" || (printf "%s\n" "Usage: make hooks-commit-msg MSG=.git/COMMIT_EDITMSG" && exit 1)
	.githooks/commit-msg "$(MSG)"

hooks-pre-push:
	.githooks/pre-push
