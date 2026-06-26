# 🏗️ From Zero to Vanilla Projects — The Full Foundation

> You know HTML & CSS already — this guide will tell you exactly what to brush up on
> and what **TypeScript** to learn, starting from scratch. No assumptions.
> You're writing TypeScript from day one — read `00_typescript_primer.md` first for Vite setup.
> Follow this before the 5 Vanilla Projects.

---

## Your Starting Point

```
You are here:
  ✅ HTML (know it, may be rusty)
  ✅ CSS (know it, may be rusty)
  ❌ TypeScript (need to build this up — superset of JS, same concepts + types)
  ❌ The DOM (the bridge between TS and HTML)
  ❌ Async TS (needed for APIs)

Stack: Vite + vanilla-ts template for all projects
Target: Be able to build the 5 Vanilla Projects in TypeScript
```

---

# 🌐 PART 1 — HTML Brush-Up (1–2 days)

> You know HTML, but here's what to make sure you're solid on before JS.

## 1.1 Structure Essentials
- [ ] The anatomy of an HTML file: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
- [ ] Block vs inline elements (`div` vs `span`)
- [ ] Semantic tags: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`
- [ ] `<h1>` through `<h6>` hierarchy (only one `<h1>` per page)
- [ ] Links: `<a href="">` — absolute vs relative URLs, `target="_blank"`
- [ ] Images: `<img src="" alt="">` — always use `alt`

## 1.2 Forms — Critical (JS will interact with these constantly)
- [ ] `<form>` element and the `action` / `method` attributes
- [ ] Input types: `text`, `email`, `password`, `number`, `checkbox`, `radio`
- [ ] `<label>` and connecting it to an input with `for` / `id`
- [ ] `<button type="submit">` vs `<button type="button">`
- [ ] `<select>` and `<option>`
- [ ] `<textarea>`
- [ ] The `placeholder`, `required`, `disabled`, `value` attributes

## 1.3 Attributes That JS Uses
- [ ] `id` — uniquely identifies one element (JS uses this to target it)
- [ ] `class` — groups elements (CSS and JS both use this)
- [ ] `data-*` attributes — custom data embedded in HTML for JS to read
  ```html
  <button data-id="42" data-action="delete">Delete</button>
  ```

---

# 🎨 PART 2 — CSS Brush-Up (2–3 days)

> Less critical for JS, but you'll need this for making projects look decent.

## 2.1 Selectors
- [ ] Element, class, ID selectors (`div`, `.class`, `#id`)
- [ ] Descendant: `div p`, Child: `div > p`
- [ ] Pseudo-classes: `:hover`, `:focus`, `:nth-child()`, `:not()`
- [ ] Pseudo-elements: `::before`, `::after`
- [ ] Attribute selectors: `input[type="text"]`

## 2.2 The Box Model (must know this cold)
- [ ] `content` → `padding` → `border` → `margin`
- [ ] `box-sizing: border-box` (always add this — makes sizing predictable)
- [ ] `width`, `height`, `max-width`, `min-height`

## 2.3 Layout (the big two)
- [ ] **Flexbox**: `display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`, `flex-wrap`
- [ ] **CSS Grid**: `display: grid`, `grid-template-columns`, `grid-template-rows`, `gap`, `grid-column`
- [ ] `position`: `static`, `relative`, `absolute`, `fixed`, `sticky`
- [ ] `z-index`

## 2.4 Common Properties to Know
- [ ] Colors: hex (`#ff0000`), rgb, hsl, named colors
- [ ] Typography: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-align`
- [ ] Spacing: `padding`, `margin` (shorthand: top right bottom left)
- [ ] `display`: `block`, `inline`, `inline-block`, `none`
- [ ] `overflow`: `hidden`, `scroll`, `auto`
- [ ] `border-radius`, `box-shadow`, `opacity`
- [ ] CSS Variables: `--color-primary: #6366f1;` and `var(--color-primary)`

## 2.5 Responsive Design
- [ ] Media queries: `@media (max-width: 768px) { ... }`
- [ ] Mobile-first approach (start with small screens, scale up)
- [ ] `rem` vs `px` vs `%` vs `vh`/`vw`

---

# ⚡ PART 3 — TypeScript / JavaScript (The Big One)

> Split into 5 stages. Learn them in this exact order.
> All code examples below are written in **TypeScript**.
> TypeScript = JavaScript + types. The concepts are identical — you're just always typing them.
> Keep `00_typescript_primer.md` open as a reference while working through these.

---

## Stage 1 — The Language Itself (1 week)

> Before you touch the browser or the DOM, learn TS/JS as a pure language.
> Use the [TS Playground](https://www.typescriptlang.org/play) to experiment — paste code, see errors instantly.

### Variables & Data Types
- [ ] `let` — block-scoped, reassignable
- [ ] `const` — block-scoped, NOT reassignable (use this by default)
- [ ] `var` — old, avoid it (function-scoped, causes bugs)
- [ ] TS types: `string`, `number`, `boolean`, `null`, `undefined`
- [ ] Type annotations: `const name: string = "Alice"` (TypeScript will usually infer this)
- [ ] Type inference: `const name = "Alice"` — TS knows it's a string automatically
- [ ] `typeof` operator
- [ ] Type coercion gotcha: `"5" + 1 = "51"` but `"5" - 1 = 4` (JS/TS is weird)
- [ ] `===` (strict equality) vs `==` (loose equality — avoid `==`)

### Strings
- [ ] String methods: `.length`, `.toUpperCase()`, `.toLowerCase()`, `.trim()`
- [ ] `.includes()`, `.startsWith()`, `.endsWith()`
- [ ] `.split()`, `.join()` (used constantly)
- [ ] `.slice()`, `.substring()`
- [ ] Template literals: `` `Hello ${name}, you are ${age} years old` `` ⭐⭐⭐
- [ ] String to number: `Number("42")`, `parseInt("42")`, `parseFloat("3.14")`
- [ ] Number to string: `String(42)`, `(42).toString()`

### Numbers
- [ ] `Math.round()`, `Math.floor()`, `Math.ceil()`
- [ ] `Math.max()`, `Math.min()`
- [ ] `Math.random()` — generates 0 to 1
- [ ] `NaN` — "Not a Number", check with `isNaN()`
- [ ] `toFixed(2)` — format to 2 decimal places

### Booleans & Conditionals
- [ ] Truthy vs falsy values:
  - Falsy: `false`, `0`, `""`, `null`, `undefined`, `NaN`
  - Everything else is truthy
- [ ] `if / else if / else`
- [ ] Ternary: `const label = isAdmin ? "Admin" : "User"` ⭐⭐⭐
- [ ] Short-circuit: `isLoggedIn && showMenu()` ⭐⭐⭐
- [ ] Nullish coalescing: `const name = user.name ?? "Anonymous"` ⭐⭐
- [ ] `switch` statement

### Functions
- [ ] Function declaration:
  ```ts
  function greet(name: string): string {
    return "Hello " + name;
  }
  ```
- [ ] Function expression:
  ```ts
  const greet = function(name: string): string {
    return "Hello " + name;
  };
  ```
- [ ] Arrow function (use this most often):
  ```ts
  const greet = (name: string): string => "Hello " + name;
  ```
- [ ] Parameters vs arguments
- [ ] Default parameters: `function greet(name: string = "World") {}`
- [ ] `void` return type: `const log = (msg: string): void => console.log(msg)`
- [ ] `return` — functions stop executing at `return`
- [ ] Scope: variables inside a function are not accessible outside

### Arrays ⭐⭐⭐ (most important for React)
- [ ] Creating with type: `const items: number[] = [1, 2, 3]`
- [ ] Array of objects: `const users: User[] = []`
- [ ] Accessing: `items[0]` (zero-indexed!)
- [ ] `.length`
- [ ] Adding: `.push(item)` (mutates), spread `[...items, newItem]` (does not mutate — prefer this)
- [ ] Removing: `.pop()`, `.shift()`, `.filter()` (prefer filter — does not mutate)
- [ ] Finding: `.indexOf()`, `.find()`, `.findIndex()`
- [ ] Checking: `.includes()`, `.some()`, `.every()`
- [ ] **The Big Three** (know these inside-out):
  - `.map(item => newItem)` — transform each item, returns new array
  - `.filter(item => condition)` — keep matching items, returns new array
  - `.reduce((acc, item) => acc + item, 0)` — fold into single value
- [ ] Sorting: `.sort()` — ⚠️ it mutates! Use `[...arr].sort()`
- [ ] Flattening: `.flat()`, `.flatMap()`
- [ ] Destructuring: `const [first, second, ...rest] = arr` ⭐⭐⭐
- [ ] Spread: `const newArr: number[] = [...arr1, ...arr2]` ⭐⭐⭐

### Objects ⭐⭐⭐
- [ ] Define shape with `interface`:
  ```ts
  interface User {
    name: string
    age: number
    email?: string   // optional property
  }
  ```
- [ ] Creating: `const user: User = { name: "Alice", age: 30 }`
- [ ] Accessing: `user.name`, `user["name"]` (use dot notation unless key is dynamic)
- [ ] Spread update (immutable): `const updated: User = { ...user, age: 31 }` ⭐⭐⭐
- [ ] Destructuring: `const { name, age } = user` — types are inferred ⭐⭐⭐
- [ ] Destructuring with rename: `const { name: userName } = user`
- [ ] Shorthand properties: `const obj = { name, age }` instead of `{ name: name, age: age }`
- [ ] `Object.keys()`, `Object.values()`, `Object.entries()`
- [ ] Optional chaining: `user?.address?.city` — safe navigation ⭐⭐

### Loops
- [ ] `for` loop: `for (let i = 0; i < 10; i++) {}`
- [ ] `for...of` loop: `for (const item of items) {}` ← use this for arrays
- [ ] `for...in` loop: iterates over object keys
- [ ] `while` loop
- [ ] `break` and `continue`
- [ ] `forEach`: `items.forEach(item => console.log(item))` ← does not return anything

---

## Stage 2 — The DOM (3–4 days)

> The DOM is the bridge between JavaScript and the HTML on your page.
> "DOM" = Document Object Model — a JS representation of your HTML.

### Selecting Elements
```ts
// TypeScript needs to know what type of element you're selecting
const button = document.querySelector("#submit") as HTMLButtonElement
const input = document.getElementById("username") as HTMLInputElement
const items = document.querySelectorAll(".item")  // NodeList
```
- [ ] `querySelector` vs `querySelectorAll`
- [ ] `as HTMLInputElement` — type assertion telling TS what element type it is
- [ ] A NodeList is not an Array — convert with `Array.from()` or spread
- [ ] Common element types: `HTMLButtonElement`, `HTMLInputElement`, `HTMLDivElement`, `HTMLFormElement`

### Reading & Changing Content
```ts
const el = document.querySelector(".box") as HTMLElement
const input = document.querySelector("#name") as HTMLInputElement

el.textContent = "Hello"              // sets plain text (safe)
el.innerHTML = "<b>Hello</b>"         // sets HTML (be careful with user input)
const val: string = input.value       // read input value
input.value = ""                      // clear input
el.getAttribute("data-id")            // returns string | null
el.setAttribute("disabled", "")
```

### Changing Styles & Classes
```js
element.style.color = "red"           // inline style (use sparingly)
element.classList.add("active")       // add a class
element.classList.remove("active")    // remove a class
element.classList.toggle("active")    // toggle on/off
element.classList.contains("active")  // check if class exists
```

### Creating & Inserting Elements
```js
const li = document.createElement("li")     // create
li.textContent = "New item"
ul.appendChild(li)                           // insert at end
ul.prepend(li)                               // insert at beginning
ul.insertBefore(li, referenceNode)           // insert before a specific node
element.remove()                             // remove element
parent.removeChild(child)                    // remove a child
```

### Traversing the DOM
```js
element.parentElement          // go up one level
element.children               // direct children
element.firstElementChild      // first child
element.lastElementChild       // last child
element.nextElementSibling     // next sibling
element.previousElementSibling // previous sibling
```

---

## Stage 3 — Events (3–4 days) ⭐⭐⭐

> Everything interactive in a web app is an event. This is critical.

### Adding Event Listeners
```ts
const button = document.querySelector("#btn") as HTMLButtonElement

// TypeScript infers the event type from the event name
button.addEventListener("click", (e: MouseEvent) => {
  console.log(e.target)
})

const input = document.querySelector("#name") as HTMLInputElement
input.addEventListener("input", (e: Event) => {
  const target = e.target as HTMLInputElement
  console.log(target.value)
})
```

### The Event Object (`e`)
- [ ] `e.target` — the element that triggered the event
- [ ] `e.currentTarget` — the element the listener is attached to
- [ ] `e.preventDefault()` — stop default browser behavior (e.g., stop form submit from refreshing page) ⭐⭐⭐
- [ ] `e.stopPropagation()` — stop event from bubbling up to parent

### Common Events
| Event | Triggered when |
|---|---|
| `click` | User clicks element |
| `dblclick` | User double-clicks |
| `submit` | Form is submitted |
| `input` | Input value changes (fires every keystroke) |
| `change` | Input loses focus after change |
| `keydown` | Key is pressed |
| `keyup` | Key is released |
| `mouseover` | Mouse enters element |
| `mouseout` | Mouse leaves element |
| `focus` | Element receives focus |
| `blur` | Element loses focus |
| `DOMContentLoaded` | HTML is fully parsed |
| `load` | Page fully loaded (images too) |

### Event Delegation ⭐⭐
> Instead of adding a listener to every child, add ONE listener to the parent.
```js
// ❌ Bad — adds 100 listeners for 100 items
items.forEach(item => item.addEventListener("click", handler))

// ✅ Good — one listener on the parent
ul.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    // handle the clicked li
  }
})
```

### Forms
```ts
const form = document.querySelector("form") as HTMLFormElement
const input = document.querySelector("#task") as HTMLInputElement

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault()              // ALWAYS do this first
  const value: string = input.value.trim()
  input.value = ""                // clear the field
})
```

---

## Stage 4 — Asynchronous JavaScript (4–5 days) ⭐⭐⭐

> JS is single-threaded — it can only do one thing at a time.
> Async JS lets you *wait* for things (like an API response) without freezing the page.

### The Problem
```js
// This BLOCKS — the page freezes for 3 seconds. Bad.
const result = waitThreeSeconds()

// This doesn't block — it schedules a callback. Good.
setTimeout(() => console.log("3 seconds later"), 3000)
```

### Callbacks (the old way — know the concept)
```js
fetchData(function(data) {
  // runs when data is ready
})
```

### Promises (the middle ground)
```ts
fetch("https://api.example.com/users")
  .then(response => response.json())    // parse JSON
  .then(data => console.log(data))      // use the data
  .catch((error: Error) => console.error(error.message))
```
- [ ] A Promise is an object representing a future value
- [ ] States: `pending`, `fulfilled`, `rejected`
- [ ] `.then()` chains run in sequence

### async/await (the modern way — use this) ⭐⭐⭐
```ts
interface User {
  id: number
  name: string
}

async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch("https://api.example.com/users")
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    const data: User[] = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return []
  }
}
```
- [ ] `async` before a function makes it return a `Promise`
- [ ] `Promise<T>` — a promise that resolves to type `T`
- [ ] `await` pauses execution until the Promise resolves
- [ ] Always wrap `await` in `try/catch`
- [ ] You can only use `await` inside an `async` function

### The Fetch API ⭐⭐⭐
```ts
// Define what the API returns
interface WeatherData {
  temperature: number
  condition: string
}

// GET request
async function getWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`https://api.example.com/weather?city=${city}`)
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
  return response.json() as Promise<WeatherData>
}

// POST request
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 30 })
})
```
- [ ] Always check `response.ok` before using data
- [ ] `.json()` parses the response body (also returns a Promise!)
- [ ] Type your API responses with `interface` so TS knows the shape
- [ ] JSON: JavaScript Object Notation — how APIs send data
  - `JSON.stringify()` — TS object → JSON string
  - `JSON.parse()` — JSON string → TS object (returns `any` — annotate it!)

---

## Stage 5 — JS Patterns You'll Use Constantly (2–3 days)

### localStorage (save data in the browser)
```ts
interface Todo {
  id: number
  text: string
  completed: boolean
}

// Save
localStorage.setItem("todos", JSON.stringify(todos))

// Load — JSON.parse returns any, so annotate it
const raw = localStorage.getItem("todos")
const todos: Todo[] = raw ? (JSON.parse(raw) as Todo[]) : []

// Delete
localStorage.removeItem("todos")
```

### ES Modules (how files talk to each other)
```ts
// math.ts
export const add = (a: number, b: number): number => a + b
export default function multiply(a: number, b: number): number { return a * b }

// Also export types/interfaces
export interface User {
  name: string
  age: number
}

// main.ts
import multiply, { add } from "./math.ts"
import type { User } from "./math.ts"   // type-only import
```
- [ ] `export` / `export default` — exposing things from a file
- [ ] `import` — bringing things in from another file
- [ ] `import type` — importing only a type (erased at compile time)

### Error Handling
```js
try {
  const data = JSON.parse(invalidJSON) // might throw
} catch (error) {
  console.error(error.message)
} finally {
  // always runs
}
```

### Closures (understand the concept)
```js
function makeCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = makeCounter()
counter() // 1
counter() // 2
```
> A closure is a function that "remembers" variables from its outer scope.
> React's hooks are built on this concept.

### `this` keyword (know enough to avoid bugs)
- [ ] In regular functions, `this` depends on *how* the function is called
- [ ] In arrow functions, `this` is inherited from the surrounding scope (no rebinding)
- [ ] This is why event handlers as arrow functions are safer

---

## 📊 Full Learning Timeline

```
Week 1:    TS Primer (Doc 0) + HTML brush-up + CSS brush-up
Week 2:    TS Stage 1 — Variables, Strings, Numbers, Functions (with types)
Week 3:    TS Stage 1 continued — Arrays (typed), Objects (interfaces), Loops
Week 4:    TS Stage 2 — The DOM (typed selectors, HTMLElement types)
Week 5:    TS Stage 3 — Events (typed event handlers, forms)
Week 6:    TS Stage 4 — Async TS (Promise<T>, typed fetch responses)
Week 7:    TS Stage 5 — Patterns + Start Project 1 (Todo List in TS)
Week 8-9:  Projects 2-3 (Weather App, Quiz App — all in Vite + vanilla-ts)
Week 10-11: Projects 4-5 (GitHub Finder, Expense Tracker)
Week 12:   → START REACT (Vite + react-ts template)
```

---

## 🔗 Resources (free, no fluff)

| Resource | What it covers | Format |
|---|---|---|
| [TS Playground](https://www.typescriptlang.org/play) | Write TS in browser, see errors instantly | Interactive |
| [javascript.info](https://javascript.info) | Best JS fundamentals resource (concepts apply to TS) | Reading |
| [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Official TS docs — very readable | Reference |
| [MDN Web Docs](https://developer.mozilla.org) | Reference for HTML, CSS, DOM APIs | Reference |
| [Total TypeScript](https://www.totaltypescript.com/tutorials) | Best free TS video content | Video |
| [css-tricks.com/flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) | Best Flexbox visual guide | Visual |

---

> [!IMPORTANT]
> **javascript.info** is the single best resource for JS fundamentals — everything there applies to TypeScript too. Read it like a book, in order. Use the [TS Playground](https://www.typescriptlang.org/play) to re-run their examples with types added.

> [!TIP]
> Don't skip the DOM and Events stages. React abstracts them, but when something breaks in React, understanding what React is doing under the hood (DOM manipulation) is how you debug it.

> [!WARNING]
> Do NOT try to learn everything before building. After Stage 1, start experimenting in the TS Playground. After Stage 2, build something tiny with Vite. Learning by doing accelerates everything.
