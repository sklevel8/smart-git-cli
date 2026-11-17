/* Demo shim: lets the smart-git studio UI run as a static site.
   When no local companion server is present, /api/* is answered with a
   realistic in-memory repository so every screen stays interactive. */
(() => {
  'use strict';

  const isLocalHost = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname);
  const forced = new URLSearchParams(location.search).has('demo');
  const DEMO = forced || location.protocol === 'file:' || !isLocalHost;

  if (!DEMO) return;

  const DEMO_PATH = 'C:\\Users\\demo\\acme-storefront';
  const LAST_KEY = 'smartgit:lastRepo';

  const file = (status, path, label) => ({ status, path, label });

  const repo = {
    path: DEMO_PATH,
    name: 'acme-storefront',
    branch: 'feat/checkout-redesign',
    upstream: 'origin/feat/checkout-redesign',
    ahead: 2,
    behind: 0,
    clean: false,
    head: {
      hash: '8f3c1a2',
      subject: 'feat(ui): add repository dashboard',
      author: 'Sipho Makubalo',
      relativeDate: '2 hours ago',
    },
    staged: [
      file('M', 'src/components/Checkout.tsx', 'modified'),
      file('A', 'src/components/SavedCards.tsx', 'added'),
    ],
    unstaged: [
      file('M', 'src/lib/payments.ts', 'modified'),
    ],
    untracked: [
      file('?', 'src/components/PaymentSummary.test.tsx', 'untracked'),
    ],
  };

  const DIFF = `diff --git a/src/components/Checkout.tsx b/src/components/Checkout.tsx
index 4f2c1a8..9b7d3e1 100644
--- a/src/components/Checkout.tsx
+++ b/src/components/Checkout.tsx
@@ -18,9 +18,17 @@ export function Checkout({ cart }: CheckoutProps) {
   const total = useCartTotal(cart);
+  const [selectedCard, setSelectedCard] = useState<string | null>(null);
 
   return (
     <section className="checkout">
-      <h1>Checkout</h1>
-      <CartSummary items={cart} total={total} />
+      <header className="checkout__head">
+        <h1>Checkout</h1>
+        <span className="checkout__count">{cart.length} items</span>
+      </header>
+      <SavedCards value={selectedCard} onChange={setSelectedCard} />
+      <CartSummary items={cart} total={total} />
       <PayButton amount={total} cardId={selectedCard} />
     </section>
   );
 }
diff --git a/src/components/SavedCards.tsx b/src/components/SavedCards.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/SavedCards.tsx
@@ -0,0 +1,24 @@
+import { SavedCard } from '../types/payments';
+
+export function SavedCards({ value, onChange }: SavedCardsProps) {
+  return (
+    <ul className="saved-cards" aria-label="Saved cards">
+      {cards.map((card) => (
+        <li key={card.id}>
+          <button type="button" onClick={() => onChange(card.id)}>
+            •••• {card.last4}
+          </button>
+        </li>
+      ))}
+    </ul>
+  );
+}`;

  const COMMIT_MESSAGE = `feat(checkout): wire saved cards into the payment step

- load the customer's saved cards before render
- keep the selected card in local state and pass it to PayButton
- add a count to the checkout header so large carts are scannable

Refs: ACME-412`;

  const PR_DESCRIPTION = `## Summary
Adds a saved-card picker to checkout and passes the selected card into the payment step.

## Changes
- **Checkout** now renders a header count and the \`SavedCards\` picker
- **SavedCards** lists stored cards and reports selection upward
- **Payments** accepts an optional card id when charging

## Why
Returning customers re-enter card details on every order. This removes that step and
gives the payment request a stable card reference.

## Test plan
- [x] \`npm test\`
- [x] Manual checkout with 0, 1 and 3 saved cards
- [ ] Verify in Safari

## Notes
No database changes. The card list comes from the existing \`/v1/cards\` endpoint.`;

  let commitCount = 0;

  function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'X-Demo': 'true' },
    });
  }

  function handle(url, init) {
    const method = (init?.method || 'GET').toUpperCase();
    const [path, query] = url.split('?');
    const params = new URLSearchParams(query || '');
    const body = init?.body ? safeJson(init.body) : {};

    if (path === '/api/health') {
      return json({
        ok: true,
        demo: true,
        node: 'v24.19.0',
        git: '2.55.0',
        gemini: false,
        model: 'gemini-2.5-flash',
        home: 'C:\\Users\\demo',
        defaultPath: DEMO_PATH,
      });
    }

    if (path === '/api/repo') {
      if (method === 'POST') repo.path = body.path || repo.path;
      return json(repo);
    }

    if (path === '/api/stage') {
      const all = [...repo.staged, ...repo.unstaged, ...repo.untracked];
      const seen = new Set();
      repo.staged = all.filter((f) => {
        if (seen.has(f.path)) return false;
        seen.add(f.path);
        return true;
      }).map((f) => ({ ...f, status: f.status === '?' ? 'A' : f.status, label: f.status === '?' ? 'added' : f.label }));
      repo.unstaged = [];
      repo.untracked = [];
      repo.clean = false;
      return json(repo);
    }

    if (path === '/api/diff') {
      return json({ diff: DIFF, stats: { files: 2, insertions: 28, deletions: 3 }, truncated: false });
    }

    if (path === '/api/branches') {
      return json({ branches: ['main', 'develop', 'feat/checkout-redesign'] });
    }

    if (path === '/api/commit/generate') {
      return json({ message: COMMIT_MESSAGE, stats: { files: 2, insertions: 28, deletions: 3 } });
    }

    if (path === '/api/commit') {
      const message = (body.message || COMMIT_MESSAGE).trim();
      commitCount += 1;
      const hash = (0x8f3c1a2 + commitCount * 7919).toString(16).slice(-7);
      repo.head = {
        hash,
        subject: message.split('\n')[0],
        author: 'Sipho Makubalo',
        relativeDate: 'just now',
      };
      repo.staged = [];
      repo.unstaged = [file('M', 'src/lib/analytics.ts', 'modified')];
      repo.untracked = [file('?', 'src/lib/analytics.test.ts', 'untracked')];
      repo.clean = false;
      repo.ahead += 1;
      return json({ commit: { hash, subject: repo.head.subject } });
    }

    if (path === '/api/pr/generate') {
      return json({ description: PR_DESCRIPTION, base: body.base || 'main' });
    }

    if (path === '/api/directories') {
      const base = body.path || params.get('path') || 'C:\\Users\\demo';
      return json({
        path: base,
        parent: 'C:\\Users\\demo',
        directories: [
          { name: 'acme-storefront', path: `${base}\\acme-storefront`, isGitRepo: true },
          { name: 'internal-tools', path: `${base}\\internal-tools`, isGitRepo: true },
          { name: 'design-assets', path: `${base}\\design-assets`, isGitRepo: false },
        ],
      });
    }

    return json({ error: `Demo mode: no handler for ${method} ${path}` }, 404);
  }

  function safeJson(value) {
    try { return JSON.parse(value); } catch { return {}; }
  }

  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('/api/')) {
      try {
        return Promise.resolve(handle(url, init));
      } catch (error) {
        return Promise.resolve(json({ error: error.message }, 500));
      }
    }
    return realFetch(input, init);
  };

  try {
    if (!localStorage.getItem(LAST_KEY)) localStorage.setItem(LAST_KEY, DEMO_PATH);
  } catch { /* storage unavailable */ }

  window.__SMARTGIT_DEMO__ = true;

  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.querySelector('.badge-local');
    if (badge) badge.innerHTML = '<span class="dot"></span> Demo repository';
    const hint = document.querySelector('.connect-hint');
    if (hint) hint.textContent = 'Demo mode — the deployed build answers every /api call with an in-memory repository.';
  });
})();
