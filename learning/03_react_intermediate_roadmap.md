# ⛛️ React + TypeScript Intermediate Mastery Roadmap

> **Goal**: Cover all the topics needed to go from zero → intermediate React + TypeScript fluency.
> Work through these phases in order — each builds on the last.
> **Prerequisite**: Complete `00_typescript_primer.md` and `02_react_prerequisites.md` first.

---

## 🗺️ Phases Overview

| Phase | Focus | Priority |
|---|---|---|
| 1 | Core Fundamentals | 🔴 Must-know |
| 2 | Hooks (the heart of modern React) | 🔴 Must-know |
| 3 | Component Patterns | 🟠 Important |
| 4 | State Management | 🟠 Important |
| 5 | Routing | 🟠 Important |
| 6 | Data Fetching & Side Effects | 🟠 Important |
| 7 | Performance Optimization | 🟡 Intermediate |
| 8 | Styling in React | 🟡 Intermediate |
| 9 | Tooling & Ecosystem | 🟡 Intermediate |
| 10 | Testing | 🟢 Good to have |

---

> [!IMPORTANT]
> **Stack for all projects in this roadmap**: `npm create vite@latest my-app -- --template react-ts`
> All files use `.tsx` (components) and `.ts` (logic/types). TypeScript is not optional — it's the default.

---

## Phase 1 — Core Fundamentals 🔴

### 1.1 JSX
- [ ] What JSX is (syntactic sugar over `React.createElement`)
- [ ] JSX rules: single root element, `className` vs `class`, self-closing tags
- [ ] Embedding expressions: `{}` syntax
- [ ] Conditional rendering: ternary, `&&` short-circuit, early return
- [ ] Rendering lists with `.map()` and the `key` prop
- [ ] Fragments: `<>...</>` and `<React.Fragment>`

### 1.2 Components
- [ ] Function components (the modern standard)
- [ ] Props: passing, receiving, destructuring
- [ ] `children` prop
- [ ] Default props
- [ ] Component composition (building big UIs from small pieces)
- [ ] The difference between controlled and uncontrolled components

### 1.3 The React Mental Model
- [ ] React's one-way data flow (parent → child)
- [ ] The virtual DOM and reconciliation (conceptual understanding)
- [ ] When React re-renders a component
- [ ] Immutability: why you never mutate state directly

---

## Phase 2 — Hooks (The Heart of Modern React) 🔴

> Hooks are the most important concept in modern React. Spend the most time here.

### 2.1 `useState`
- [ ] Basic usage: `const [value, setValue] = useState(initialValue)`
- [ ] Updating state (always use the setter, never mutate)
- [ ] State with objects and arrays (spread to preserve immutability)
- [ ] Functional updates: `setValue(prev => prev + 1)`
- [ ] Lazy initialization: `useState(() => expensiveComputation())`

### 2.2 `useEffect`
- [ ] Purpose: syncing with external systems (DOM, APIs, timers)
- [ ] The dependency array: `[]`, `[dep]`, no array
- [ ] Cleanup functions (preventing memory leaks)
- [ ] Common patterns: fetching on mount, event listeners, subscriptions
- [ ] The "Effect is not for everything" mindset

### 2.3 `useRef`
- [ ] Accessing DOM elements directly
- [ ] Storing mutable values that don't trigger re-renders
- [ ] `ref` vs `state`: when to use which

### 2.4 `useContext`
- [ ] Creating a context: `React.createContext()`
- [ ] Providing context: `<Context.Provider value={...}>`
- [ ] Consuming context: `useContext(MyContext)`
- [ ] When to use context vs prop drilling vs state management

### 2.5 `useMemo` & `useCallback`
- [ ] `useMemo`: memoizing expensive computed values
- [ ] `useCallback`: memoizing function references
- [ ] When they actually help (and when they don't — avoid premature optimization)

### 2.6 `useReducer`
- [ ] The reducer pattern: `(state, action) => newState`
- [ ] When to prefer `useReducer` over `useState`
- [ ] Combining with `useContext` for lightweight global state

### 2.7 Custom Hooks
- [ ] What makes a custom hook (a function starting with `use`)
- [ ] Extracting logic into reusable hooks
- [ ] Examples: `useFetch`, `useLocalStorage`, `useDebounce`, `useToggle`
- [ ] The "rules of hooks" and why they exist

---

## Phase 3 — Component Patterns 🟠

### 3.1 Composition Patterns
- [ ] Container vs Presentational components
- [ ] Lifting state up
- [ ] Prop drilling and when it becomes a problem
- [ ] Slot pattern using `children`

### 3.2 Advanced Patterns (pick 2-3 to understand)
- [ ] Render Props pattern
- [ ] Higher Order Components (HOCs) — legacy but common in older codebases
- [ ] Compound Components pattern
- [ ] Controlled vs Uncontrolled inputs

### 3.3 Error Boundaries
- [ ] What they are (class components only — the one place classes still matter)
- [ ] How to use them with `react-error-boundary` library
- [ ] Graceful error UIs

### 3.4 Portals
- [ ] `ReactDOM.createPortal()` — rendering outside the parent DOM node
- [ ] Use cases: modals, tooltips, dropdowns

---

## Phase 4 — State Management 🟠

### 4.1 Local State Strategies
- [ ] When component state is enough
- [ ] Co-locating state close to where it's used

### 4.2 Context API (revisited)
- [ ] Pattern: context + `useReducer` for medium-complexity state
- [ ] Performance pitfall: unnecessary re-renders from context changes

### 4.3 External State Libraries
- [ ] **Zustand** (recommended starting point — simple, minimal)
  - [ ] Creating a store with `create()`
  - [ ] Reading state in components
  - [ ] Updating state with actions
- [ ] **Redux Toolkit** (understand for enterprise codebases)
  - [ ] `createSlice`, `configureStore`
  - [ ] `useSelector`, `useDispatch`
  - [ ] Async with `createAsyncThunk`
- [ ] **Jotai / Recoil** (atomic model — good to know exists)

> **Recommendation**: Learn Zustand first. It teaches the right concepts without Redux boilerplate.

---

## Phase 5 — Routing 🟠

> The standard is **React Router v6** (or Next.js App Router if using Next.js).

### 5.1 React Router v6
- [ ] `<BrowserRouter>`, `<Routes>`, `<Route>`
- [ ] `<Link>` and `<NavLink>`
- [ ] `useNavigate` hook — programmatic navigation
- [ ] `useParams` — reading URL parameters
- [ ] `useSearchParams` — query strings
- [ ] Nested routes and `<Outlet>`
- [ ] Protected routes (auth guards)
- [ ] `loader` and `action` (data APIs in v6.4+)

---

## Phase 6 — Data Fetching & Side Effects 🟠

### 6.1 Native Fetch in useEffect
- [ ] Basic pattern: fetch on mount, handle loading/error/data states
- [ ] Race conditions and cleanup
- [ ] Why this gets complicated fast

### 6.2 TanStack Query (React Query) — The Modern Standard
- [ ] `QueryClientProvider` setup
- [ ] `useQuery`: fetching, caching, background refetching
- [ ] `useMutation`: POST/PUT/DELETE operations
- [ ] Cache invalidation with `queryClient.invalidateQueries()`
- [ ] Loading, error, and success states
- [ ] Stale time and cache time concepts

### 6.3 SWR (alternative to React Query — simpler)
- [ ] Basic `useSWR` hook
- [ ] Revalidation strategies

> **Recommendation**: Learn React Query. It eliminates 80% of data-fetching boilerplate.

---

## Phase 7 — Performance Optimization 🟡

### 7.1 Understanding Re-renders
- [ ] What causes a re-render (state change, prop change, context change, parent re-render)
- [ ] Using React DevTools Profiler to identify bottlenecks

### 7.2 Memoization
- [ ] `React.memo` — preventing re-renders of pure components
- [ ] `useMemo` and `useCallback` (revisited with performance lens)
- [ ] When NOT to memoize (the cost of memoization itself)

### 7.3 Code Splitting & Lazy Loading
- [ ] `React.lazy()` and `<Suspense>`
- [ ] Dynamic imports for route-level splitting
- [ ] `<Suspense>` boundaries for loading states

### 7.4 Lists & Virtual Scrolling
- [ ] The `key` prop and why it matters for list performance
- [ ] `react-window` or `react-virtual` for huge lists

---

## Phase 8 — Styling in React 🟡

### 8.1 Options Overview
- [ ] Plain CSS / CSS Modules (scope styles to components)
- [ ] CSS-in-JS: **styled-components** or **Emotion**
- [ ] Utility-first: **Tailwind CSS**
- [ ] Component libraries: **shadcn/ui**, **MUI**, **Chakra UI**, **Mantine**

### 8.2 CSS Modules (recommended to learn first)
- [ ] `import styles from './Component.module.css'`
- [ ] `className={styles.myClass}`
- [ ] Composing classes: `clsx` / `classnames` library

### 8.3 Tailwind CSS (most popular in 2025)
- [ ] Utility class fundamentals
- [ ] Responsive design with breakpoint prefixes
- [ ] Conditional classes with `clsx`/`cn`

---

## Phase 9 — Tooling & Ecosystem 🟡

### 9.1 Project Setup
- [ ] **Vite + react-ts** — what you've been using (`--template react-ts`)
- [ ] **Next.js** — full-stack React framework (SSR, SSG, API routes)
  - [ ] App Router vs Pages Router
  - [ ] Server Components vs Client Components
  - [ ] `use client` directive
  - [ ] Next.js has TypeScript built-in

### 9.2 TypeScript in React — React-Specific Patterns
> You already know TS basics from `00_typescript_primer.md`. This section covers React-specific TS patterns.
- [ ] Typing props with `interface` or `type`:
  ```tsx
  interface ButtonProps {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  function Button({ label, onClick, disabled = false }: ButtonProps) { ... }
  ```
- [ ] Typing `useState`: `useState<User | null>(null)`, `useState<Todo[]>([])`
- [ ] Typing events: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`
- [ ] Typing refs: `useRef<HTMLInputElement>(null)`
- [ ] `React.FC` vs plain function (prefer plain function)
- [ ] `PropsWithChildren<Props>` for components that accept children
- [ ] Typing `useReducer` actions with discriminated unions:
  ```ts
  type Action =
    | { type: 'ADD'; payload: Todo }
    | { type: 'DELETE'; id: number }
  ```
- [ ] Generics in custom hooks: `function useFetch<T>(url: string): { data: T | null }`

### 9.3 Forms
- [ ] Controlled inputs (state-driven)
- [ ] **React Hook Form** — the standard for complex forms
  - [ ] `useForm`, `register`, `handleSubmit`, `formState`
  - [ ] Validation with **Zod** schema

### 9.4 Developer Tools
- [ ] React DevTools browser extension (components tree, profiler)
- [ ] ESLint with `eslint-plugin-react-hooks`
- [ ] Prettier for formatting

---

## Phase 10 — Testing 🟢

### 10.1 Unit Testing Components
- [ ] **Vitest** or **Jest** as test runner
- [ ] **React Testing Library (RTL)**
  - [ ] Philosophy: test behavior, not implementation
  - [ ] `render()`, `screen`, queries (`getByRole`, `getByText`)
  - [ ] `fireEvent` and `userEvent`
  - [ ] `waitFor` for async

### 10.2 Integration & E2E
- [ ] **Playwright** or **Cypress** for end-to-end tests
- [ ] Testing user flows (login, form submission, navigation)

---

## 🧠 Key Mental Models to Internalize

> These are the conceptual shifts that separate React beginners from intermediate devs.

1. **"State is a snapshot"** — State doesn't change mid-render; each render sees its own snapshot.
2. **"Rendering is pure"** — Components should be pure functions (same props → same output). Side effects belong in `useEffect`.
3. **"Lift state up"** — When two components need the same state, move it to their closest common ancestor.
4. **"Data flows down, events flow up"** — Props go parent→child; callbacks go child→parent.
5. **"Effects are for syncing"** — `useEffect` syncs React state with something outside React (DOM, API, timer). Don't use it to transform data.
6. **"Don't derive state"** — If you can compute something from existing state/props, just compute it; don't store it in state.

---

## 📅 Suggested Study Order

```
Week 1:  Phase 1 (JSX, Components) + Phase 2 (useState, useEffect)
Week 2:  Phase 2 continued (useRef, useContext, useReducer, custom hooks)
Week 3:  Phase 3 (Patterns) + Phase 5 (Routing)
Week 4:  Phase 6 (Data Fetching / React Query)
Week 5:  Phase 4 (State Management / Zustand) + Phase 9 (TypeScript, Forms)
Week 6:  Phase 7 (Performance) + Phase 8 (Styling) + Phase 10 (Testing basics)
```

---

## 🛠️ Project Ideas to Solidify Each Phase

| Project | Skills Practiced |
|---|---|
| Counter / Toggle / Todo List | useState, JSX, events |
| Multi-step form | useReducer, controlled inputs |
| Weather App | useEffect, fetch, loading states |
| Movie search app | React Query, routing, useParams |
| Auth-protected dashboard | Context, protected routes, Zustand |
| Full CRUD app | All of the above + forms with RHF + Zod |

---

> [!TIP]
> The fastest path to intermediate fluency is **building projects**, not just reading. After each phase, build something small that uses what you just learned.

> [!NOTE]
> You don't need to master everything here. Phases 1–6 are the core — get solid there first. Phases 7–10 become relevant once you're working on real projects.
