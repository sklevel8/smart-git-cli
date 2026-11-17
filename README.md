# smart-git-cli (`smart-git`)

An AI-assisted Git workflow that reads your staged diff and writes the commit message — or the
pull-request description — for you. Runs from the terminal, or from a local dashboard.

**Live demo:** https://sklevel8-smart-git.netlify.app
**Stack:** Node.js 22 · Commander · Express · Google Gemini · vanilla JS dashboard

---

## Why this exists

Two things are true of almost every repository: commit messages degrade under deadline pressure
(`fix`, `wip`, `stuff`), and the work of writing a good PR summary happens when you are least
inclined to do it.

Handing that to a language model is easy. Doing it *safely and cheaply* is the actual engineering
problem, and that is what this project is about:

- **A diff is not a prompt.** Real diffs contain `package-lock.json`, minified bundles and vendor
  code. Sending them wastes tokens, blows context windows, and buries the signal. The tool strips
  lockfiles and build artefacts before the model ever sees them.
- **Diff text is untrusted input.** Commit messages are generated from repository content, which
  may contain anything. Git operations therefore never go through a shell string; they use
  argument arrays.
- **A model call should not be a blank cheque.** Oversized diffs are truncated at a documented
  character budget instead of failing with a context-length error halfway through a refactor.

The result is a small tool that behaves like a careful colleague: it reads only what matters, it
never runs a shell string built from file contents, and it always shows you the message before you
commit.

## How it works

```
git add .
   │
smart-git commit
   │  1. git diff --cached            (lockfiles and artefacts excluded)
   │  2. truncate to a 12,000-char budget
   │  3. Gemini → Conventional Commit subject + body
   │  4. print, confirm (or --dry-run to stop here)
   │  5. git commit -m <subject> -m <body>     via execFileSync(argArray)
   ▼
new commit
```

For pull requests the flow is the same up to the model call, with `git log <base>..HEAD` and the
stat summary as context; the output is Markdown you can paste straight into GitHub.

The **dashboard** wraps the same modules in an Express API:

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness |
| `GET /api/directories?path=` | Git-aware directory browser |
| `POST /api/repo` | Repository status, branches, upstream state |
| `POST /api/diff` | Staged diff plus insertions/deletions stats |
| `POST /api/stage` | Stage everything |
| `POST /api/commit/generate` | Draft a Conventional Commit |
| `POST /api/commit` | Commit the reviewed message |
| `POST /api/pr/generate` | Draft a PR description against a base branch |

It binds to `127.0.0.1` only, and the only thing sent to Gemini is the truncated diff you chose to
summarise.

## Features

- Conventional Commits with scope inference from changed paths
- PR summaries with a base-branch picker, preview and copy
- Lockfile and build-artefact exclusion before tokenisation
- 12,000-character diff budget with explicit truncation flag in the response
- Shell-safe git execution (`execFileSync` with argument arrays, never `exec`)
- Zero-build dashboard: plain HTML, CSS and modules — no bundler, no `node_modules` for the UI
- `--dry-run` for commit previews

## Run it locally

```bash
git clone https://github.com/sklevel8/smart-git-cli.git
cd smart-git-cli
npm install
cp .env.example .env     # add GEMINI_API_KEY from Google AI Studio
npm link                 # exposes the `smart-git` binary
```

Terminal:

```bash
git add .
smart-git commit                 # generate, review, commit
smart-git commit --dry-run       # print only
smart-git pr --base main         # Markdown PR description
```

Dashboard:

```bash
npm run web          # http://127.0.0.1:4173
npm run web:open     # same, but opens a browser
```

## The deployed demo

The Netlify site serves `web/` with `web/demo-api.js` loaded first. That shim intercepts the
dashboard's `fetch` calls and answers them from an in-memory fake repository — branch list, staged
files, a realistic colourised diff, generated commit text and PR summaries. It activates on any
non-localhost origin (or with `?demo`), so the hosted dashboard stays fully interactive without a
backend or an API key.

Locally, the shim is inert: `npm run web` talks to the real Express API.

## Project layout

```
bin/cli.js          CLI entry point (Commander)
src/git.js          git subprocess helpers, repo status, diff extraction
src/ai.js           Gemini prompt construction and response parsing
src/server.js       Express API for the dashboard
web/                zero-build dashboard (HTML, CSS, vanilla JS)
web/demo-api.js     mock API used by the static deployment
tests/              unit tests (diff filtering, truncation, parsing)
```

## Tests

```bash
npm test
```

## Deployment

`netlify.toml` publishes `web/` with security headers. The CLI and API need a local checkout — they
cannot run on a static host by design, since they inspect a real working tree.

## Licence

MIT
