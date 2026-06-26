# 🧱 React Prerequisites — TypeScript Vanilla First

> You know HTML & CSS. React is just **TypeScript that generates HTML**.
> The gap between "I know HTML/CSS" and "I can learn React" is **TypeScript fluency**.
> Close that gap first or React will feel like magic you can't debug.

---

## ✅ TypeScript Topics You Must Know Before React

Work through these in order. Check them off as you go.
> All examples are in TypeScript. Keep `00_typescript_primer.md` open as a reference.

### 1. The Absolute Basics
- [ ] Variables: `let`, `const` (avoid `var`)
- [ ] TS types: `string`, `number`, `boolean`, `null`, `undefined`
- [ ] Type inference — TS figures out types automatically most of the time
- [ ] Operators: arithmetic, comparison (`===` not `==`), logical (`&&`, `||`, `!`)
- [ ] `if/else`, ternary operator (`condition ? a : b`)
- [ ] `for` loops, `while` loops
- [ ] Functions with typed parameters: `(name: string): string => ...`

### 2. Arrays — Critical for React
React lists live and die by these methods. Know them cold.
- [ ] Typed arrays: `const scores: number[] = [90, 85]`, `const todos: Todo[] = []` ⭐⭐⭐
- [ ] `.map()` — transform every item → returns new array ⭐⭐⭐
- [ ] `.filter()` — keep items matching a condition ⭐⭐⭐
- [ ] `.find()` — get the first matching item ⭐⭐
- [ ] `.some()` / `.every()` — check if any/all items match ⭐
- [ ] `.reduce()` — fold array into a single value ⭐
- [ ] Spread operator: `[...arr, newItem]` ⭐⭐⭐
- [ ] Destructuring: `const [first, second] = arr` ⭐⭐⭐

### 3. Objects — Critical for React State
- [ ] Define shape with `interface User { name: string; age: number }` ⭐⭐⭐
- [ ] Creating typed objects: `const user: User = { name: "Alice", age: 30 }`
- [ ] Object destructuring: `const { name, age } = user` (types are inferred) ⭐⭐⭐
- [ ] Spread to update immutably: `const updated: User = { ...user, age: 31 }` ⭐⭐⭐
- [ ] Optional properties: `email?: string`
- [ ] Optional chaining: `user?.address?.street` ⭐⭐
- [ ] Nullish coalescing: `value ?? 'default'` ⭐⭐

### 4. Functions (Typed)
- [ ] Arrow functions with types: `const add = (a: number, b: number): number => a + b` ⭐⭐⭐
- [ ] Default parameters: `function greet(name: string = "World") {}`
- [ ] Rest parameters: `function sum(...nums: number[]): number {}`
- [ ] Higher-order functions (functions that take/return functions) ⭐⭐
- [ ] `void` return type for functions that don't return a value

### 5. Asynchronous TypeScript — Critical for Data Fetching
- [ ] What "async" means (TS/JS is single-threaded, non-blocking)
- [ ] Callbacks (understand the concept, you won't write many)
- [ ] Promises: `Promise<T>`, `.then()`, `.catch()` ⭐⭐
- [ ] `async/await` — the modern way ⭐⭐⭐
- [ ] Typed fetch: `async function getData(): Promise<MyType> {}`
- [ ] `fetch()` API — making HTTP requests ⭐⭐⭐
- [ ] `try/catch` for error handling, `error instanceof Error` ⭐⭐⭐

### 6. The DOM with TypeScript
> React abstracts this away, but you need to know what it's abstracting.
- [ ] Selecting elements with type assertions: `document.querySelector("#id") as HTMLInputElement`
- [ ] Common element types: `HTMLButtonElement`, `HTMLInputElement`, `HTMLFormElement`
- [ ] Reading/writing content: `.textContent`, `.value`
- [ ] Changing styles: `.classList.add/remove/toggle`
- [ ] Typed event listeners: `(e: MouseEvent) => ...`, `(e: SubmitEvent) => ...`
- [ ] Creating/appending elements: `createElement`, `appendChild`
- [ ] Forms: `e.preventDefault()`, reading `input.value` ⭐⭐

### 7. Modules (ES Modules in TypeScript)
- [ ] `export` and `export default`
- [ ] `import { thing } from './file'`
- [ ] `import type { MyType } from './file'` (type-only import)
- [ ] Exporting interfaces alongside functions

### 8. Modern Syntax You'll Use Constantly
- [ ] Template literals: `` `Hello ${name}!` `` ⭐⭐⭐
- [ ] Ternary expressions (used constantly in TSX/JSX)
- [ ] Short-circuit evaluation: `isLoggedIn && showDashboard()`
- [ ] Union types: `string | null`, `number | undefined`
- [ ] Type narrowing: `if (typeof x === 'string') { ... }`

---

## 🛠️ 5 Vanilla TypeScript Projects to Build (in order)

Build these **before** starting React. Each uses **Vite + `vanilla-ts` template**.

```bash
# Setup for each project:
npm create vite@latest project-name -- --template vanilla-ts
cd project-name && npm install && npm run dev
```

---

### Project 1 — Interactive Todo List
**Time**: 2–4 hours | **Difficulty**: ⭐

**What to build**: A todo app where you can add tasks, check them off, and delete them. No frameworks, no libraries.

**TypeScript focus**:
```ts
interface Todo {
  id: number
  text: string
  completed: boolean
}
let todos: Todo[] = []
```

**What it teaches**:
- DOM manipulation with typed element selectors
- Typed event listeners
- Array state management with typed arrays (`Todo[]`)
- Re-rendering the list manually (you'll appreciate React doing this for you!)

**Stretch goals**: Filter by "All / Active / Completed", persist to `localStorage`

---

### Project 2 — Weather App (API Fetch)
**Time**: 3–5 hours | **Difficulty**: ⭐⭐

**What to build**: Enter a city name, fetch weather from a free API ([Open-Meteo](https://open-meteo.com/) — no key needed), display temperature, condition, and icon.

**TypeScript focus**:
```ts
interface WeatherResponse {
  current: { temperature_2m: number; weathercode: number }
}
async function fetchWeather(city: string): Promise<WeatherResponse> { ... }
```

**What it teaches**:
- `fetch()` + `async/await` with typed responses
- `Promise<T>` return types
- Displaying API data in the DOM
- Query params in URLs

**Stretch goals**: 5-day forecast, unit toggle (°C / °F), geolocation

---

### Project 3 — Quiz App
**Time**: 4–6 hours | **Difficulty**: ⭐⭐

**What to build**: A multi-question quiz. Show one question at a time, track score, show results at the end.

**What it teaches**:
- State management across multiple "views" (without a router)
- Arrays of objects (question data)
- Conditional rendering (show question vs show results)
- Event handling and data flow

**Stretch goals**: Timer per question, shuffle questions, category picker

---

### Project 4 — GitHub Profile Finder
**Time**: 3–5 hours | **Difficulty**: ⭐⭐

**What to build**: Search for a GitHub username, display their profile info and a list of their public repos using the [GitHub API](https://docs.github.com/en/rest) (no auth needed for public data).

**What it teaches**:
- Working with a real REST API
- Nested data (user object + repos array)
- Debouncing search input (don't fire on every keystroke)
- Error handling (user not found, rate limit)

**Stretch goals**: Sort repos by stars, pagination, link to profile

---

### Project 5 — Expense Tracker / Budget App
**Time**: 5–8 hours | **Difficulty**: ⭐⭐⭐

**What to build**: Add income and expense transactions. Show a running balance, categorized spending, and a summary.

**What it teaches**:
- Complex state (array of objects with multiple fields)
- `reduce()` for calculating totals
- Forms with validation
- Filtering and grouping data
- `localStorage` for persistence

**Stretch goals**: Charts with Chart.js, monthly view, CSV export

---

## 🎯 When Are You Ready for React?

You're ready to start React when you can:

| Checkpoint | How to verify |
|---|---|
| ✅ Write a typed `interface` for a data structure | Do it without looking it up |
| ✅ Use `.map()` on a typed array | `todos.map((t: Todo) => ...)` without hesitation |
| ✅ Fetch data from an API with a typed response | Project 2 |
| ✅ Handle a form submit with typed event handler | Project 1 or 5 |
| ✅ Use `async/await` and `Promise<T>` without confusion | Project 2 or 4 |
| ✅ Destructure typed objects comfortably | Write it naturally |

---

> [!TIP]
> **Don't aim for perfect projects.** Aim for working projects. A messy todo app that works teaches you more than a perfect one you never finish.

> [!IMPORTANT]
> The **single most important prerequisite** for React is `.map()`. In React, every list is `.map()` over an array into JSX. If `array.map()` isn't second nature, do 10 small exercises on it before anything else.

> [!NOTE]
> These 5 projects will take 2–4 weeks at a casual pace. After Project 3, you'll likely understand *why* React exists — manually updating the DOM gets tedious fast, and React automates exactly that pain.
