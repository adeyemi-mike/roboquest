# ROBOQUEST — React front-end

The ROBOQUEST coding & robotics platform as a **Vite + React** application
(plain JavaScript, no TypeScript). Deploy to Vercel in one step — see below.

## Architecture

```
src/
  main.jsx            boot: loads the engine, seeds demo data, bridges RQ.render → React
  App.jsx             hash router + auth/track guards (port of engine RQ.render)
  style.css           the one stylesheet shared by React shell AND hosted views
  components/
    TopBar.jsx        app shell: logo, track-aware nav, HUD, avatar, mobile drawer
    ViewHost.jsx      mounts any engine view (RQ.views[route]) into React
    Welcome.jsx       landing page — native React
    Login.jsx         login form — native React (controlled inputs)
  legacy/
    rq-bundle.js      GENERATED — the 26 framework-agnostic engine files as one
                      classic script (same code as roboquest.html, zero rewrites)
```

**Why this structure:** the game engine (simulators, block editors, curriculum
data, 2,285 automated checks' worth of behavior) is plain JavaScript and has no
framework dependency. React owns the shell, routing and auth screens; every
other screen keeps working through `ViewHost` unchanged. New screens can be
written as native React components (like `Welcome`/`Login`) — move them over
one at a time by rendering them in `App.jsx` instead of `ViewHost`.

**The bridge:** `RQ.go()` only sets `location.hash` (React listens to
`hashchange`), and `RQ.render()` was redefined in `main.jsx` to fire an
`rq:render` event that re-renders the React shell — so legacy calls like
"login → RQ.render()" refresh React instead of clobbering it.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
```

After changing any engine file in `../robo/`:

```bash
python3 ../robo/make_react.py   # regenerates src/legacy/rq-bundle.js + style.css
```

The engine sources remain the single source of truth; the standalone single-file
build (`../robo/build.py`) and this React app are both generated from them.

## Build & deploy to Vercel

```bash
npm run build        # outputs static site to dist/
vercel --prod        # run from THIS folder — Vercel auto-detects Vite
```

Vercel builds it directly from source when you import this folder as a Git
repository (Framework preset: **Vite**, output `dist/`). `vercel.json` adds SPA
rewrites and immutable caching for hashed `/assets/*` files.
