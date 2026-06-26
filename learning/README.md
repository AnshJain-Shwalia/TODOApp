# 📚 Learning Docs — Index

A structured roadmap from zero → React intermediate.
**Stack: TypeScript + HTML + CSS → TSX + React**
Read and work through these **in order**.

---

| # | File | What it covers | When to read |
|---|---|---|---|
| 0 | [00_typescript_primer.md](./00_typescript_primer.md) | Vite setup, TS types, DOM types, async with TS, React previews | **Read first, keep as reference** |
| 1 | [01_frontend_foundations.md](./01_frontend_foundations.md) | HTML/CSS brush-up + all 5 JS/TS stages (language, DOM, events, async, patterns) | After TS primer |
| * | [html_css_practice/README.md](./html_css_practice/README.md) | 3 pure HTML & CSS projects (no forms, no JS) to practice layout & styling | Alongside foundations |
| 2 | [02_react_prerequisites.md](./02_react_prerequisites.md) | TS checklist + 5 vanilla projects to build (using Vite + TS) | After foundations |
| 3 | [03_react_intermediate_roadmap.md](./03_react_intermediate_roadmap.md) | Full React + TypeScript topic roadmap across 10 phases | When starting React |

---

## The full journey at a glance

```
TypeScript primer + Vite setup  (Doc 0)
        ↓
HTML + CSS brush-up             (Doc 1, Parts 1 & 2)
        ↓
TypeScript / JS — 5 stages      (Doc 1, Part 3)
  Stage 1: Language basics (write TS from the start)
  Stage 2: The DOM (with DOM types)
  Stage 3: Events (typed event handlers)
  Stage 4: Async / fetch (Promise<T>, typed responses)
  Stage 5: Patterns (localStorage, modules, closures)
        ↓
5 Vanilla TS Projects           (Doc 2)
  Each uses: Vite + vanilla-ts template
  1. Todo List
  2. Weather App
  3. Quiz App
  4. GitHub Profile Finder
  5. Expense Tracker
        ↓
React + TypeScript — 10 phases  (Doc 3)
  Each project uses: Vite + react-ts template
  Phase 1-2: JSX/TSX + Hooks    ← most important
  Phase 3-6: Patterns, State, Routing, Data Fetching
  Phase 7-10: Performance, Styling, Tooling, Testing
```

---

## Project setup — quick reference

```bash
# Vanilla TypeScript project (for Docs 1 & 2 projects)
npm create vite@latest my-project -- --template vanilla-ts

# React + TypeScript project (for Doc 3 projects)
npm create vite@latest my-react-app -- --template react-ts
```

---

## Recommended free resources

- **[typescriptlang.org/play](https://www.typescriptlang.org/play)** — TS Playground, use constantly while learning
- **[javascript.info](https://javascript.info)** — best JS fundamentals resource (concepts apply to TS too)
- **[typescriptlang.org/docs](https://www.typescriptlang.org/docs/)** — official TS docs, very readable
- **[MDN Web Docs](https://developer.mozilla.org)** — reference for HTML, CSS, DOM APIs
- **[react.dev](https://react.dev)** — official React docs (has TypeScript examples throughout)
- **[Total TypeScript](https://www.totaltypescript.com/tutorials)** — best free TS video content
