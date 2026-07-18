# Repository Guidelines

Warrior Cats Math Forest (猫武士数学森林) — a cat-themed math game for Hong Kong
P3–P6 students. Bilingual (English + 繁體中文). A static PWA built with plain
HTML, CSS, and vanilla JavaScript: **no bundler, framework, or package manager**.

## Project Structure

```
index.html              # Entry point; loads scripts in dependency order
css/style.css           # All styles (CSS variables defined in :root)
js/i18n.js              # i18n + game data (ranks, prey, regions, LEVELS, badges)
js/visual.js            # SVG generators for 2D/3D shapes
js/engine.js            # Question generators, grader, state, storage, audio
js/ui.js                # Screen rendering & interaction
js/app.js               # Bootstrap & router
sw.js                   # Service worker (offline shell)
manifest.webmanifest    # PWA manifest
assets/                 # icon.svg, data/ (future level configs)
DESIGN.md               # Design & curriculum blueprint
```

Script load order in `index.html` is significant: `i18n.js` creates the global
`WCM` namespace and data that the later modules depend on.

## Build & Development Commands

No build step. Serve the root over HTTP (required for the service worker):

```sh
python3 -m http.server 8000   # open http://localhost:8000
```

After changing assets, bump the cache version in `sw.js`
(`var CACHE = 'wcm-vN';`) so clients fetch updates.

## Coding Style & Naming Conventions

- **JavaScript**: ES5 syntax (`var`, `function` — no arrow functions or ES
  modules). Two-space indent; statements are semicolon-terminated; single quotes
  for string literals.
- Namespaces: start each module with `window.WCM = window.WCM || {};`.
- Section dividers: `/* ---------- name ---------- */` or
  `/* ============ name ============ */`.
- Question generators: `gen<Name>` (e.g. `genDecAdd`, `genGeoArea`); helpers
  stay short (`ri`, `pick`, `shuffle`).
- **CSS**: kebab-case classes with dot modifiers (`.btn.primary`); reuse `:root`
  variables instead of hardcoding colors.
- **i18n**: all user-facing strings live in `WCM.I18N` (`en` + `zh-TW`) and are
  read via `WCM.t('key')`. Default language is English.

## Adding Content (Data-Driven)

New levels follow three steps (see DESIGN.md): add a definition to `LEVELS` in
`i18n.js`, a matching `gen*` generator in `engine.js`, and any SVG art in
`visual.js`.

## Testing Guidelines

No automated test suite exists. Verify changes manually in a browser: run both
languages, walk the level → reward flow, confirm scoring/persistence, and test
offline mode (reload with the network disabled).

## Commit & Pull Request Guidelines

No commit history exists yet — use Conventional Commits (`feat:`, `fix:`,
`content:`, `docs:`, `chore:`). Keep commits focused. PRs should describe what
changed, reference the affected territory/level, and list any new `gen*`
functions or `LEVELS` entries.
