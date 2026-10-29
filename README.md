# smart-git-cli (`smart-git`)

![CI Status](https://github.com/sklevel8/smart-git-cli/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)

An AI-powered developer toolkit that inspects staged Git diffs and branch histories to generate **Conventional Commits** and structured **Pull Request Markdown descriptions** — from the terminal or a local web dashboard.

## Key Engineering Features

- **Noise & Lockfile Exclusion:** Automatically strips `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, and minified build artifacts from `git diff` subprocesses.
- **Token-Budget Guardrails:** Safely truncates oversized multi-file diffs (`12,000` char cap) so large refactors never trigger LLM context-window errors.
- **Shell-Safe Execution:** Uses Node.js `execFileSync` argument arrays instead of raw shell interpolation to prevent command injection when committing.
- **Local Web Dashboard:** Express API plus a zero-build frontend for browsing repositories, previewing diffs, generating messages, and committing.
- **Path-Safe Repository Picker:** Server-side directory browser with Git detection; the dashboard binds to `127.0.0.1` only.

## Quick Start

```bash
git clone https://github.com/sklevel8/smart-git-cli.git
cd smart-git-cli
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm link
```

## Web Dashboard

```bash
npm run web
# Or launch it and open the browser automatically:
npm run web:open
```

Open **http://127.0.0.1:4173**.

From the dashboard you can:

- Browse to any local Git repository, or paste an absolute path.
- Review staged files and a colorized diff preview.
- Generate a Conventional Commit with Gemini, edit it, and commit without leaving the page.
- Generate a Pull Request summary against any base branch, preview the Markdown, and copy it.
- Stage all changes, switch repositories, and inspect branch/upstream status.

The dashboard is local-only: it binds to `127.0.0.1`, and it uses the same `GEMINI_API_KEY` from the project `.env` file. Only the diff you choose to summarize is sent to Gemini.

## CLI Usage

### 1. Generate & Execute a Conventional Commit

```bash
git add .
smart-git commit
# Or preview without committing:
smart-git commit --dry-run
```

### 2. Generate a Pull Request Summary

```bash
smart-git pr --base main
```

## Running Tests

```bash
npm test
```

## Project Structure

```text
bin/cli.js            CLI entry point (Commander)
src/git.js            Git subprocess helpers and repository status
src/ai.js             Gemini commit and PR generation
src/server.js         Express API for the web dashboard
web/                  Zero-build dashboard (HTML, CSS, vanilla JS)
tests/git.test.js     Unit tests
```
