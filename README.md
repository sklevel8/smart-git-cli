# smart-git-cli (`smart-git`)

![CI Status](https://github.com/sklevel8/smart-git-cli/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)

An AI-powered developer CLI tool that inspects staged Git diffs and branch histories to generate **Conventional Commits** and structured **Pull Request Markdown descriptions**.

## Key Engineering Features
- **Noise & Lockfile Exclusion:** Automatically strips `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, and minified build artifacts from `git diff` subprocesses.
- **Token-Budget Guardrails:** Safely truncates oversized multi-file diffs (`12,000` char cap) so large refactors never trigger LLM context-window errors.
- **Shell-Safe Execution:** Uses Node.js `execFileSync` argument arrays instead of raw shell interpolation to prevent command injection when committing.

## Quick Start

```bash
git clone https://github.com/sklevel8/smart-git-cli.git
cd smart-git-cli
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm link
```

## Usage

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
