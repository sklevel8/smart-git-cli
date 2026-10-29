const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const icons = {
  git: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="8" r="2.4"/><path d="M6 8.4v7.2M8.4 6H14a4 4 0 0 1 4 4v1.6"/></svg>`,
  branch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="8" r="2.4"/><path d="M6 8.4v7.2M8.4 6H14a4 4 0 0 1 4 4v6"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2h7A2.5 2.5 0 0 1 20.5 9.5v7A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z"/></svg>`,
  folderOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2h7A2.5 2.5 0 0 1 20.5 9.5v1"/><path d="M3.5 9h16.2a1.5 1.5 0 0 1 1.45 1.88l-1.3 5.2A2.5 2.5 0 0 1 17.45 18H6a2.5 2.5 0 0 1-2.5-2.5V9Z"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l1.9 5.1 5.1 1.9-5.1 1.9L12 16.5l-1.9-5.1L5 9.5l5.1-1.9L12 2.5Z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><circle cx="12" cy="16.6" r=".8" fill="currentColor" stroke="none"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".8" fill="currentColor" stroke="none"/></svg>`,
  pr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="12" r="2.4"/><path d="M6 8.4v7.2M8.4 6h3.1a4 4 0 0 1 4 4v0"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/></svg>`,
};

const state = {
  health: null,
  repo: null,
  diff: '',
  diffStats: { files: 0, insertions: 0, deletions: 0 },
  diffTruncated: false,
  branches: [],
  commitMessage: '',
  prDescription: '',
  prBase: 'main',
  prView: 'preview',
  tab: 'commit',
  busy: null,
  picker: null,
};

const RECENT_KEY = 'smartgit:recent';
const LAST_KEY = 'smartgit:lastRepo';
const numberFormatter = new Intl.NumberFormat('en-US');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

function prettyModel(model) {
  return String(model || 'Gemini')
    .replace(/^gemini-/, 'Gemini ')
    .replace(/-flash$/, ' Flash')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function statusClass(status) {
  const map = {
    A: 'added',
    M: 'modified',
    D: 'deleted',
    R: 'renamed',
    C: 'copied',
    U: 'unmerged',
    T: 'type',
    '?': 'untracked',
  };

  return `status-${map[status] ?? 'modified'}`;
}

async function api(path, { method = 'GET', body } = {}) {
  const options = { method, headers: {} };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with HTTP ${response.status}.`);
  }

  return payload;
}

function showToast(message, type = 'info') {
  const container = $('#toasts');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const iconName = type === 'success' ? 'check' : type === 'error' ? 'alert' : 'info';
  toast.innerHTML = `
    <span class="toast-icon">${icons[iconName]}</span>
    <p>${escapeHtml(message)}</p>
    <button class="toast-close" type="button" aria-label="Dismiss notification">${icons.x}</button>
  `;

  container.append(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));

  const remove = () => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, type === 'error' ? 9000 : 5500);
}

async function copyText(text, successMessage = 'Copied to clipboard.') {
  const value = String(text ?? '');
  if (!value) {
    showToast('Nothing to copy yet.', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    showToast(successMessage, 'success');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast(successMessage, 'success');
  }
}

function getRecentRepos() {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function rememberRepo(repo) {
  try {
    const recent = getRecentRepos().filter((item) => item.path !== repo.path);
    recent.unshift({ path: repo.path, name: repo.name });
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
    localStorage.setItem(LAST_KEY, repo.path);
  } catch {
    // localStorage can be unavailable in private windows.
  }

  renderRecentRepos();
}

function setView(view) {
  const connect = $('#connect-view');
  const workspace = $('#workspace-view');

  if (connect) connect.hidden = view !== 'connect';
  if (workspace) workspace.hidden = view !== 'workspace';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showConnectLoading(loading) {
  const button = $('[data-action="connect"]');
  if (!button) return;

  button.disabled = loading;
  button.innerHTML = loading
    ? '<span class="spinner small"></span><span>Connecting…</span>'
    : `<span>Connect repository</span>${icons.arrowRight}`;
}

function renderRecentRepos() {
  const container = $('#recent-repos');
  const list = $('#recent-list');
  if (!container || !list) return;

  const recent = getRecentRepos();
  if (!recent.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  list.innerHTML = recent.map((item) => `
    <button class="recent-chip" type="button" data-action="connect-recent" data-path="${escapeHtml(item.path)}" title="${escapeHtml(item.path)}">
      ${icons.folder}
      <span>${escapeHtml(item.name)}</span>
    </button>
  `).join('');
}

function renderWorkspace() {
  const workspace = $('#workspace-view');
  if (!workspace || !state.repo) return;

  workspace.innerHTML = `
    <div class="workspace">
      <aside id="sidebar" class="sidebar" aria-label="Repository summary"></aside>
      <section class="main-panel">
        <div class="tabbar" role="tablist" aria-label="Workspace views">
          <button class="tab ${state.tab === 'commit' ? 'active' : ''}" type="button" data-action="tab" data-tab="commit" role="tab" aria-selected="${state.tab === 'commit'}">
            ${icons.git}<span>Commit</span>
          </button>
          <button class="tab ${state.tab === 'pr' ? 'active' : ''}" type="button" data-action="tab" data-tab="pr" role="tab" aria-selected="${state.tab === 'pr'}">
            ${icons.pr}<span>Pull request</span>
          </button>
        </div>
        <div id="commit-panel" class="tab-panel" role="tabpanel" ${state.tab !== 'commit' ? 'hidden' : ''}></div>
        <div id="pr-panel" class="tab-panel" role="tabpanel" ${state.tab !== 'pr' ? 'hidden' : ''}></div>
      </section>
    </div>
  `;

  renderSidebar();
  renderCommitPanel();
  renderPRPanel();
}

function switchTab(tab) {
  if (!['commit', 'pr'].includes(tab)) return;

  state.tab = tab;
  $$('.tab').forEach((button) => {
    const active = button.dataset.tab === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });

  const commit = $('#commit-panel');
  const pr = $('#pr-panel');
  if (commit) commit.hidden = tab !== 'commit';
  if (pr) pr.hidden = tab !== 'pr';
}

function renderSidebar() {
  const sidebar = $('#sidebar');
  const repo = state.repo;
  if (!sidebar || !repo) return;

  sidebar.innerHTML = `
    <section class="card repo-card">
      <div class="repo-ident">
        <div class="repo-avatar">${icons.git}</div>
        <div class="repo-ident-text">
          <h2 title="${escapeHtml(repo.name)}">${escapeHtml(repo.name)}</h2>
          <button class="path-copy mono" type="button" data-action="copy-path" title="Copy repository path">${escapeHtml(repo.path)}</button>
        </div>
      </div>
      <div class="repo-badges">
        <span class="branch-pill">${icons.branch}${escapeHtml(repo.branch)}</span>
        <span class="muted small">${repo.upstream ? escapeHtml(repo.upstream) : 'no upstream'}</span>
      </div>
      ${repo.ahead || repo.behind ? `
        <div class="sync-row">
          <span class="sync-pill">↑ ${repo.ahead}</span>
          <span class="sync-pill">↓ ${repo.behind}</span>
        </div>` : ''}
    </section>

    <section class="card sidebar-card">
      <div class="section-label">Working tree</div>
      <div class="stat-grid">
        <div class="stat">
          <span class="stat-value">${repo.staged.length}</span>
          <span class="stat-label">Staged</span>
        </div>
        <div class="stat">
          <span class="stat-value">${repo.unstaged.length}</span>
          <span class="stat-label">Modified</span>
        </div>
        <div class="stat">
          <span class="stat-value">${repo.untracked.length}</span>
          <span class="stat-label">Untracked</span>
        </div>
      </div>
      <div class="sidebar-actions">
        <button class="btn btn-soft btn-block" type="button" data-action="stage-all" ${repo.clean || state.busy ? 'disabled' : ''}>
          ${icons.plus}<span>Stage all changes</span>
        </button>
        <button class="btn btn-ghost btn-block" type="button" data-action="refresh-repo" ${state.busy ? 'disabled' : ''}>
          ${icons.refresh}<span>Refresh</span>
        </button>
        <button class="btn btn-link btn-block" type="button" data-action="switch-repo">Switch repository</button>
      </div>
    </section>

    <section class="card last-commit">
      <div class="section-label">Latest commit</div>
      ${repo.head ? `
        <div class="commit-subject">${escapeHtml(repo.head.subject)}</div>
        <div class="commit-meta">
          <span class="mono">${escapeHtml(repo.head.hash)}</span>
          <span>${escapeHtml(repo.head.author)}</span>
          <span>${escapeHtml(repo.head.relativeDate)}</span>
        </div>` : '<p class="muted small">No commits yet.</p>'}
    </section>
  `;
}

function renderCommitPanel() {
  const panel = $('#commit-panel');
  if (!panel || !state.repo) return;

  const staged = state.repo.staged;
  const busy = state.busy?.kind === 'commit';

  panel.innerHTML = `
    <div class="panel-stack">
      <section class="card panel-card">
        <div class="panel-head">
          <div>
            <div class="section-label">Staged changes</div>
            <h2>${staged.length ? `${staged.length} file${staged.length === 1 ? '' : 's'} ready to commit` : 'Nothing staged yet'}</h2>
          </div>
          <div class="panel-head-actions">
            <button class="icon-btn" type="button" data-action="refresh-repo" title="Refresh repository" aria-label="Refresh repository" ${busy ? 'disabled' : ''}>${icons.refresh}</button>
            <button class="btn btn-ghost btn-sm" type="button" data-action="stage-all" ${state.repo.clean || busy ? 'disabled' : ''}>
              ${icons.plus}<span>Stage all</span>
            </button>
          </div>
        </div>
        ${staged.length ? renderFileList(staged) : renderEmptyTree()}
        ${staged.length ? renderDiffBlock() : ''}
      </section>

      <section class="card generate-card" aria-live="polite">
        ${renderCommitGenerator()}
      </section>
    </div>
  `;
}

function renderEmptyTree() {
  if (state.repo.clean) {
    return `
      <div class="empty-state">
        <div class="empty-illustration">${icons.check}</div>
        <div>
          <h3>Working tree is clean</h3>
          <p>Make a change and stage it to generate your next commit.</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="empty-state">
      <div class="empty-illustration">${icons.folderOpen}</div>
      <div>
        <h3>No staged changes</h3>
        <p>Stage files from your terminal with <code>git add</code>, or let the dashboard stage everything.</p>
      </div>
      <button class="btn btn-primary btn-sm" type="button" data-action="stage-all">
        ${icons.plus}<span>Stage all changes</span>
      </button>
    </div>
  `;
}

function renderFileList(files) {
  return `
    <div class="file-list">
      ${files.map((file) => `
        <div class="file-row">
          <span class="status-badge ${statusClass(file.status)}" title="${escapeHtml(file.label)}">${escapeHtml(file.status)}</span>
          <span class="file-path mono" title="${escapeHtml(file.path)}">${escapeHtml(file.path)}</span>
          <span class="file-label">${escapeHtml(file.label)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDiffBlock() {
  if (!state.diff) {
    return `
      <div class="notice">
        The staged files are all excluded from AI context — lockfiles, minified assets, build output, or coverage.
      </div>
    `;
  }

  const stats = state.diffStats;
  return `
    <div class="diff-block">
      <div class="diff-head">
        <span class="section-label">Diff preview</span>
        <span class="diff-stats">
          <span>${stats.files} file${stats.files === 1 ? '' : 's'}</span>
          <span class="add-count">+${formatNumber(stats.insertions)}</span>
          <span class="del-count">−${formatNumber(stats.deletions)}</span>
          ${state.diffTruncated ? '<span class="badge badge-warn">truncated</span>' : ''}
        </span>
      </div>
      <pre class="diff-view" tabindex="0" aria-label="Staged diff preview">${highlightDiff(state.diff)}</pre>
    </div>
  `;
}

function renderCommitGenerator() {
  if (state.busy?.kind === 'commit') return renderBusy('commit');
  if (state.commitMessage) return renderCommitEditor();

  const canGenerate = state.repo.staged.length > 0 && Boolean(state.diff);

  return `
    <div class="generator-head">
      <div class="generator-icon">${icons.sparkle}</div>
      <div>
        <div class="section-label">AI commit message</div>
        <h3>Turn this diff into a Conventional Commit</h3>
        <p>Gemini reads only the staged diff, skipping lockfiles, minified files, and build output.</p>
      </div>
    </div>
    <button class="btn btn-generate" type="button" data-action="generate-commit" ${canGenerate ? '' : 'disabled'}>
      ${icons.sparkle}<span>Generate commit message</span>
    </button>
    ${canGenerate ? '' : '<p class="generate-hint">Stage a non-excluded file to generate a message.</p>'}
  `;
}

function renderCommitEditor() {
  return `
    <div class="editor-head">
      <div>
        <div class="section-label">Generated message</div>
        <p class="muted small">Review and edit before committing.</p>
      </div>
      <span class="char-count" id="message-count">${state.commitMessage.length} chars</span>
    </div>
    <textarea id="commit-message" class="message-editor mono" spellcheck="false" aria-label="Commit message">${escapeHtml(state.commitMessage)}</textarea>
    <div class="editor-actions">
      <button class="btn btn-ghost" type="button" data-action="copy-message">${icons.copy}<span>Copy</span></button>
      <button class="btn btn-ghost" type="button" data-action="generate-commit">${icons.refresh}<span>Regenerate</span></button>
      <button class="btn btn-primary" type="button" data-action="create-commit">${icons.check}<span>Create commit</span></button>
    </div>
  `;
}

function renderBusy(kind) {
  const label = state.busy?.label ?? 'Working…';
  const detail = kind === 'pr'
    ? 'Gemini is comparing branch histories and drafting the summary. Large branches can take a minute or two.'
    : 'Gemini is reading the staged diff and drafting a Conventional Commit. Large diffs can take a minute or two.';

  return `
    <div class="busy-card" aria-busy="true">
      <div class="spinner" aria-hidden="true"></div>
      <div>
        <h3>${escapeHtml(label)}</h3>
        <p>${detail}</p>
      </div>
      <div class="busy-time" id="busy-elapsed">0:00</div>
    </div>
    <div class="busy-tips" id="busy-tip">Tip: only the staged diff is sent — lockfiles and build output are excluded.</div>
  `;
}

function renderPRPanel() {
  const panel = $('#pr-panel');
  if (!panel || !state.repo) return;

  const busy = state.busy?.kind === 'pr';

  panel.innerHTML = `
    <div class="panel-stack">
      <section class="card panel-card">
        <div class="panel-head">
          <div>
            <div class="section-label">Pull request</div>
            <h2>Summarize this branch</h2>
          </div>
          <span class="branch-pill">${icons.branch}${escapeHtml(state.repo.branch)}</span>
        </div>
        <p class="panel-copy">Compares <code>HEAD</code> with the base branch, then turns the commits and diff into a Markdown description you can paste into GitHub.</p>
        <div class="pr-form">
          <div class="field">
            <label class="field-label" for="pr-base">Base branch</label>
            <input id="pr-base" class="text-input mono" type="text" list="branch-list" value="${escapeHtml(state.prBase)}" autocomplete="off" spellcheck="false" ${busy ? 'disabled' : ''} />
            <datalist id="branch-list">
              ${state.branches.map((branch) => `<option value="${escapeHtml(branch)}"></option>`).join('')}
            </datalist>
          </div>
          <button class="btn btn-primary" type="button" data-action="generate-pr" ${busy ? 'disabled' : ''}>
            ${icons.sparkle}<span>Generate description</span>
          </button>
        </div>
        ${state.prDescription ? renderPROutput() : ''}
      </section>
      ${busy ? `<section class="card generate-card">${renderBusy('pr')}</section>` : ''}
    </div>
  `;
}

function renderPROutput() {
  return `
    <div class="pr-output">
      <div class="pr-output-head">
        <div class="segmented" role="tablist" aria-label="PR output format">
          <button class="segment ${state.prView === 'preview' ? 'active' : ''}" type="button" data-action="pr-view" data-view="preview">Preview</button>
          <button class="segment ${state.prView === 'raw' ? 'active' : ''}" type="button" data-action="pr-view" data-view="raw">Markdown</button>
        </div>
        <div class="panel-head-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-action="copy-pr">${icons.copy}<span>Copy</span></button>
          <button class="btn btn-ghost btn-sm" type="button" data-action="generate-pr">${icons.refresh}<span>Regenerate</span></button>
        </div>
      </div>
      ${state.prView === 'raw'
        ? `<pre class="raw-markdown mono">${escapeHtml(state.prDescription)}</pre>`
        : `<div class="markdown-body">${renderMarkdown(state.prDescription)}</div>`}
    </div>
  `;
}

function highlightDiff(diff) {
  return diff.split('\n').map((line) => {
    let type = 'context';

    if (line.startsWith('@@')) {
      type = 'hunk';
    } else if (
      line.startsWith('+++')
      || line.startsWith('---')
      || line.startsWith('diff --git')
      || line.startsWith('index ')
    ) {
      type = 'meta';
    } else if (line.startsWith('+')) {
      type = 'add';
    } else if (line.startsWith('-')) {
      type = 'del';
    }

    return `<span class="diff-line ${type}">${escapeHtml(line) || ' '}</span>`;
  }).join('');
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function renderMarkdown(markdown) {
  const lines = String(markdown ?? '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let listType = null;
  let codeFence = null;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (codeFence !== null) {
      if (line.trim().startsWith('```')) {
        html.push(`<pre><code>${escapeHtml(codeFence)}</code></pre>`);
        codeFence = null;
      } else {
        codeFence += `${line}\n`;
      }
      continue;
    }

    if (line.trim().startsWith('```')) {
      flushParagraph();
      closeList();
      codeFence = '';
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (unordered) {
      flushParagraph();
      if (listType !== 'ul') {
        closeList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (listType !== 'ol') {
        closeList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  if (codeFence !== null) {
    html.push(`<pre><code>${escapeHtml(codeFence)}</code></pre>`);
  }

  flushParagraph();
  closeList();
  return html.join('\n');
}

const BUSY_TIPS = {
  commit: [
    'Tip: only the staged diff is sent — lockfiles and build output are excluded.',
    'Tip: the 12,000 character guardrail keeps large refactors inside the context window.',
    'Tip: you can edit the generated message before creating the commit.',
  ],
  pr: [
    'Tip: choose the branch you plan to merge into as the base.',
    'Tip: the description is standard Markdown, ready for GitHub.',
    'Tip: commit history and the branch diff are both sent to Gemini.',
  ],
};

let busyTick = null;
let busyTipTimer = null;

function startBusy(kind, label) {
  stopBusy();
  state.busy = { kind, label, startedAt: Date.now() };

  if (kind === 'commit') {
    renderCommitPanel();
  } else {
    renderPRPanel();
  }

  updateBusyElapsed();
  const tips = BUSY_TIPS[kind] ?? [];
  let tipIndex = 0;
  const tipElement = $('#busy-tip');
  if (tipElement && tips.length) tipElement.textContent = tips[0];

  busyTick = setInterval(updateBusyElapsed, 1000);
  if (tips.length > 1) {
    busyTipTimer = setInterval(() => {
      tipIndex = (tipIndex + 1) % tips.length;
      const element = $('#busy-tip');
      if (element) {
        element.textContent = tips[tipIndex];
        element.classList.remove('tip-in');
        void element.offsetWidth;
        element.classList.add('tip-in');
      }
    }, 12000);
  }
}

function updateBusyElapsed() {
  const element = $('#busy-elapsed');
  if (!element || !state.busy) return;

  const seconds = Math.max(0, Math.floor((Date.now() - state.busy.startedAt) / 1000));
  const minutes = Math.floor(seconds / 60);
  element.textContent = `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

function stopBusy() {
  clearInterval(busyTick);
  clearInterval(busyTipTimer);
  busyTick = null;
  busyTipTimer = null;
  state.busy = null;
}

async function connectToRepo(path, { silent = false } = {}) {
  const input = $('#repo-path');
  if (input) input.value = path;
  showConnectLoading(true);

  try {
    const repo = await api('/api/repo', { method: 'POST', body: { path } });

    state.repo = repo;
    state.diff = '';
    state.diffStats = { files: 0, insertions: 0, deletions: 0 };
    state.diffTruncated = false;
    state.commitMessage = '';
    state.prDescription = '';
    state.branches = [];
    state.tab = 'commit';
    state.prBase = 'main';

    rememberRepo(repo);
    setView('workspace');
    renderWorkspace();

    await Promise.all([loadDiff(), loadBranches()]);
    renderCommitPanel();
    renderPRPanel();
    return true;
  } catch (error) {
    setView('connect');
    if (!silent) showToast(error.message, 'error');
    return false;
  } finally {
    showConnectLoading(false);
  }
}

async function connectFromInput() {
  const input = $('#repo-path');
  const value = input?.value.trim();

  if (!value) {
    showToast('Enter a repository path or browse for a folder.', 'error');
    input?.focus();
    return;
  }

  const connected = await connectToRepo(value);
  if (!connected) input?.focus();
}

async function loadHealth() {
  try {
    state.health = await api('/api/health');
    const badge = $('#model-badge');
    if (badge) badge.textContent = prettyModel(state.health.model);
  } catch {
    // The UI still works; the server will report details on the first request.
  }
}

async function loadDiff() {
  if (!state.repo) return;

  try {
    const result = await api('/api/diff', {
      method: 'POST',
      body: { path: state.repo.path },
    });

    state.diff = result.diff ?? '';
    state.diffStats = result.stats ?? { files: 0, insertions: 0, deletions: 0 };
    state.diffTruncated = Boolean(result.truncated);
  } catch {
    state.diff = '';
    state.diffStats = { files: 0, insertions: 0, deletions: 0 };
    state.diffTruncated = false;
  }
}

async function loadBranches() {
  if (!state.repo) return;

  try {
    const result = await api(`/api/branches?path=${encodeURIComponent(state.repo.path)}`);
    state.branches = Array.isArray(result.branches) ? result.branches : [];

    if (!state.branches.includes(state.prBase)) {
      state.prBase = state.branches.includes('main')
        ? 'main'
        : state.branches[0] || 'main';
    }
  } catch {
    state.branches = [];
  }
}

async function refreshRepo({ keepMessage = true, silent = false } = {}) {
  if (!state.repo || state.busy) return;

  try {
    const repo = await api('/api/repo', {
      method: 'POST',
      body: { path: state.repo.path },
    });

    state.repo = repo;
    if (!keepMessage) state.commitMessage = '';

    await loadDiff();
    renderSidebar();
    renderCommitPanel();
    renderPRPanel();

    if (!silent) showToast('Repository refreshed.', 'info');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function stageAllChanges() {
  if (!state.repo || state.busy) return;

  const button = $('[data-action="stage-all"]');
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner small"></span><span>Staging…</span>';
  }

  try {
    const repo = await api('/api/stage', {
      method: 'POST',
      body: { path: state.repo.path },
    });

    state.repo = repo;
    state.commitMessage = '';
    await loadDiff();
    renderSidebar();
    renderCommitPanel();
    renderPRPanel();
    showToast('All changes staged.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
    renderCommitPanel();
  }
}

async function generateCommit() {
  if (!state.repo || state.busy) return;

  if (!state.repo.staged.length) {
    showToast('Stage at least one file first.', 'error');
    return;
  }

  if (!state.diff) {
    showToast('The staged files are all excluded from AI context.', 'error');
    return;
  }

  startBusy('commit', 'Gemini is drafting your commit message');

  try {
    const result = await api('/api/commit/generate', {
      method: 'POST',
      body: { path: state.repo.path },
    });

    state.commitMessage = result.message;
    if (result.stats) state.diffStats = result.stats;
    showToast('Commit message ready — review it before committing.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    stopBusy();
    renderCommitPanel();
  }
}

async function createCommit() {
  if (!state.repo || state.busy) return;

  const textarea = $('#commit-message');
  const message = (textarea?.value ?? state.commitMessage).trim();

  if (!message) {
    showToast('Add a commit message first.', 'error');
    return;
  }

  state.commitMessage = message;
  const button = $('[data-action="create-commit"]');
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner small"></span><span>Committing…</span>';
  }

  try {
    const result = await api('/api/commit', {
      method: 'POST',
      body: { path: state.repo.path, message },
    });

    const hash = result.commit?.hash ? `${result.commit.hash} ` : '';
    showToast(`Committed ${hash}${result.commit?.subject ?? ''}`.trim(), 'success');
    state.commitMessage = '';
    await refreshRepo({ keepMessage: false, silent: true });
  } catch (error) {
    showToast(error.message, 'error');
    renderCommitPanel();
  }
}

async function generatePR() {
  if (!state.repo || state.busy) return;

  const baseInput = $('#pr-base');
  const base = (baseInput?.value ?? state.prBase).trim();

  if (!base) {
    showToast('Enter a base branch.', 'error');
    return;
  }

  state.prBase = base;
  startBusy('pr', `Gemini is summarizing ${state.repo.branch} against ${base}`);

  try {
    const result = await api('/api/pr/generate', {
      method: 'POST',
      body: { path: state.repo.path, base },
    });

    state.prDescription = result.description;
    state.prView = 'preview';
    showToast('Pull request description ready.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    stopBusy();
    renderPRPanel();
  }
}

function openFolderPicker(startPath) {
  state.picker = {
    path: startPath || state.health?.home || '',
    loading: true,
    directories: [],
  };
  renderPicker();
  loadPicker(state.picker.path);
}

async function loadPicker(targetPath) {
  if (!targetPath) return;

  state.picker = {
    ...(state.picker || {}),
    path: targetPath,
    loading: true,
    error: null,
  };
  renderPicker();

  try {
    const data = await api(`/api/directories?path=${encodeURIComponent(targetPath)}`);
    state.picker = { ...data, loading: false, error: null };
  } catch (error) {
    state.picker = { ...(state.picker || {}), loading: false, error: error.message };
  }

  renderPicker();
}

function closePicker() {
  state.picker = null;
  const root = $('#modal-root');
  if (root) root.innerHTML = '';
}

function renderPicker() {
  const root = $('#modal-root');
  const picker = state.picker;
  if (!root) return;

  if (!picker) {
    root.innerHTML = '';
    return;
  }

  const directories = picker.directories ?? [];
  const loading = picker.loading;

  const list = loading
    ? `<div class="picker-loading">${'<div class="skeleton-row"></div>'.repeat(5)}</div>`
    : picker.error
      ? `<div class="picker-empty">${escapeHtml(picker.error)}</div>`
      : directories.length
        ? directories.map((directory) => `
            <button class="picker-row" type="button" data-action="picker-dir" data-path="${escapeHtml(directory.path)}">
              <span class="folder-icon">${icons.folder}</span>
              <span class="picker-name">${escapeHtml(directory.name)}</span>
              ${directory.isGitRepo ? '<span class="badge badge-success">git</span>' : ''}
              <span class="picker-chevron">${icons.chevronRight}</span>
            </button>
          `).join('')
        : '<div class="picker-empty">No subfolders here. You can still use this folder.</div>';

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal card" role="dialog" aria-modal="true" aria-labelledby="picker-title">
        <div class="modal-head">
          <div>
            <div class="section-label">Repository browser</div>
            <h2 id="picker-title">Choose a folder</h2>
          </div>
          <button class="icon-btn" type="button" data-action="picker-close" aria-label="Close folder browser">${icons.x}</button>
        </div>
        <div class="picker-path-row">
          <button class="icon-btn" type="button" data-action="picker-up" title="Parent folder" aria-label="Parent folder" ${picker.parent ? '' : 'disabled'}>${icons.arrowUp}</button>
          <input id="picker-path" class="text-input mono" type="text" value="${escapeHtml(picker.path ?? '')}" spellcheck="false" aria-label="Folder path" />
          <button class="btn btn-ghost btn-sm" type="button" data-action="picker-go">Go</button>
        </div>
        <div class="picker-status">
          ${picker.isGitRepo
            ? `<span class="badge badge-success">${icons.check} Git repository</span>`
            : '<span class="badge badge-muted">Not a git repository</span>'}
          <span class="muted small">${directories.length} folder${directories.length === 1 ? '' : 's'}</span>
        </div>
        <div class="picker-list">${list}</div>
        <div class="modal-foot">
          <p class="muted small">Pick a folder that contains a <code>.git</code> directory, or a folder inside one.</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" type="button" data-action="picker-close">Cancel</button>
            <button class="btn btn-primary" type="button" data-action="picker-use" ${loading ? 'disabled' : ''}>
              ${icons.branch}<span>Use this folder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const backdrop = $('.modal-backdrop', root);
  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closePicker();
    });
  }

  if (!loading) {
    const pathInput = $('#picker-path');
    if (pathInput) {
      pathInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          loadPicker(pathInput.value.trim());
        }
      });
    }
  }
}

async function handleAction(action, trigger) {
  switch (action) {
    case 'connect':
      await connectFromInput();
      break;

    case 'connect-recent':
      await connectToRepo(trigger.dataset.path ?? '');
      break;

    case 'browse-repo':
      openFolderPicker(
        $('#repo-path')?.value.trim()
        || state.health?.home
        || state.repo?.path,
      );
      break;

    case 'switch-repo':
      setView('connect');
      $('#repo-path')?.focus();
      $('#repo-path')?.select();
      break;

    case 'tab':
      switchTab(trigger.dataset.tab);
      break;

    case 'refresh-repo':
      await refreshRepo();
      break;

    case 'stage-all':
      await stageAllChanges();
      break;

    case 'generate-commit':
      await generateCommit();
      break;

    case 'create-commit':
      await createCommit();
      break;

    case 'copy-message':
      await copyText(state.commitMessage, 'Commit message copied.');
      break;

    case 'copy-pr':
      await copyText(state.prDescription, 'PR description copied.');
      break;

    case 'copy-path':
      if (state.repo) await copyText(state.repo.path, 'Repository path copied.');
      break;

    case 'pr-view':
      state.prView = trigger.dataset.view === 'raw' ? 'raw' : 'preview';
      renderPRPanel();
      break;

    case 'generate-pr':
      await generatePR();
      break;

    case 'picker-close':
      closePicker();
      break;

    case 'picker-up':
      if (state.picker?.parent) await loadPicker(state.picker.parent);
      break;

    case 'picker-go':
      await loadPicker($('#picker-path')?.value.trim());
      break;

    case 'picker-use':
      if (state.picker?.path) {
        const path = state.picker.path;
        closePicker();
        await connectToRepo(path);
      }
      break;

    case 'picker-dir':
      if (trigger.dataset.path) await loadPicker(trigger.dataset.path);
      break;

    default:
      break;
  }
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  handleAction(trigger.dataset.action, trigger).catch((error) => {
    console.error(error);
    showToast(error.message || 'Something went wrong.', 'error');
  });
});

document.addEventListener('input', (event) => {
  const target = event.target;

  if (target.id === 'commit-message') {
    state.commitMessage = target.value;
    const counter = $('#message-count');
    if (counter) counter.textContent = `${target.value.length} chars`;
  }

  if (target.id === 'pr-base') {
    state.prBase = target.value;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.picker) {
    closePicker();
    return;
  }

  if (event.key === 'Enter' && event.target.id === 'repo-path') {
    event.preventDefault();
    connectFromInput();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    if (event.target.id === 'commit-message') {
      event.preventDefault();
      createCommit();
    } else if (event.target.id === 'pr-base') {
      event.preventDefault();
      generatePR();
    }
  }
});

async function init() {
  setView('connect');
  await loadHealth();
  renderRecentRepos();

  let lastRepo = null;
  try {
    lastRepo = localStorage.getItem(LAST_KEY);
  } catch {
    lastRepo = null;
  }

  const pathInput = $('#repo-path');
  if (pathInput) {
    pathInput.value = lastRepo || state.health?.defaultPath || '';
  }

  if (lastRepo) {
    const connected = await connectToRepo(lastRepo, { silent: true });
    if (!connected) {
      showToast('Could not reopen the last repository. Choose another folder.', 'info');
    }
  }
}

init();



