# 🟦 TypeScript Primer — For This Learning Path

> You're writing **TypeScript from day one** — no plain JS.
> TypeScript IS JavaScript with a type layer on top.
> Everything in the other docs applies — you just add types as you go.

---

## What TypeScript Actually Is

```
JavaScript:   const greet = (name) => `Hello ${name}`
TypeScript:   const greet = (name: string): string => `Hello ${name}`
                                    ^^^^^^^^  ^^^^^^^^
                                    type in   return type
```

TypeScript compiles down to JavaScript before the browser runs it.
You never ship `.ts` files — Vite handles the compilation automatically.

---

## ⚡ Project Setup (use this for every vanilla project)

```bash
# Create a new vanilla TypeScript project
npm create vite@latest my-project -- --template vanilla-ts
cd my-project
npm install
npm run dev
```

Your project structure:
```
my-project/
├── index.html       ← your HTML (same as always)
├── src/
│   ├── main.ts      ← TypeScript entry point (replaces main.js)
│   └── style.css    ← your CSS (same as always)
├── tsconfig.json    ← TypeScript config (don't touch for now)
└── package.json
```

> Write `.ts` files. Import them in `index.html` as `type="module"`. Vite does the rest.

---

## ⚛️ React + TypeScript Setup (when you get there)

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

Files use `.tsx` extension instead of `.jsx`. Everything else is the same.

---

## TypeScript Basics — The Types You'll Use Most

### Primitive Types
```ts
const name: string = "Alice"
const age: number = 30
const isLoggedIn: boolean = true
const nothing: null = null
const notYet: undefined = undefined
```
> In practice, TypeScript **infers** most types — you rarely need to annotate primitives:
> ```ts
> const name = "Alice"   // TypeScript knows this is a string automatically
> ```

### Arrays
```ts
const scores: number[] = [90, 85, 92]
const names: string[] = ["Alice", "Bob"]
const mixed: (string | number)[] = ["Alice", 30]   // union type
```

### Objects with `interface`
```ts
interface User {
  name: string
  age: number
  email?: string   // ? means optional
}

const user: User = { name: "Alice", age: 30 }
```

### Objects with `type` (interchangeable with interface for most cases)
```ts
type User = {
  name: string
  age: number
}
```
> **Convention**: use `interface` for objects, `type` for unions and aliases.

### Functions
```ts
// Named function
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const greet = (name: string): string => `Hello ${name}`

// Void return (function returns nothing)
const logMessage = (msg: string): void => {
  console.log(msg)
}
```

### Union Types
```ts
// This variable can be a string OR null
const username: string | null = null

// A function that accepts multiple types
function formatId(id: string | number): string {
  return String(id)
}
```

### The `any` type — avoid it
```ts
const data: any = "whatever"   // ❌ defeats the purpose of TypeScript
```
> `any` turns off type checking. Only use it temporarily when you're stuck.
> Use `unknown` instead if you genuinely don't know the type.

---

## TypeScript with Arrays & Objects (the React-critical patterns)

### Typing `.map()` and `.filter()`
```ts
interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos: Todo[] = [
  { id: 1, text: "Learn TypeScript", completed: false }
]

// .map() — TypeScript infers the return type automatically
const texts = todos.map(todo => todo.text)          // string[]
const done = todos.filter(todo => todo.completed)   // Todo[]
```

### Spread with types
```ts
// Adding to an array (immutably)
const newTodos: Todo[] = [...todos, { id: 2, text: "Build something", completed: false }]

// Updating an object (immutably)
const updatedUser: User = { ...user, age: 31 }
```

### Destructuring with types (types are inferred, no annotation needed)
```ts
const { name, age } = user           // TypeScript knows the types from User interface
const [first, ...rest] = todos       // first is Todo, rest is Todo[]
```

---

## TypeScript with the DOM

The DOM has specific types for elements and events:

```ts
// Selecting elements — use type assertion or type guard
const button = document.querySelector("#submit") as HTMLButtonElement
const input = document.getElementById("username") as HTMLInputElement

// Reading input value
const value: string = input.value

// Event listeners — type the event parameter
button.addEventListener("click", (e: MouseEvent) => {
  console.log(e.target)
})

input.addEventListener("input", (e: Event) => {
  const target = e.target as HTMLInputElement
  console.log(target.value)
})

// Form submit
const form = document.querySelector("form") as HTMLFormElement
form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault()
})
```

### Common DOM Types to Know
| Type | What it's for |
|---|---|
| `HTMLElement` | Any HTML element (generic) |
| `HTMLButtonElement` | `<button>` |
| `HTMLInputElement` | `<input>` — has `.value` |
| `HTMLFormElement` | `<form>` |
| `HTMLDivElement` | `<div>` |
| `MouseEvent` | click, mouseover events |
| `KeyboardEvent` | keydown, keyup events |
| `SubmitEvent` | form submit |
| `Event` | generic event (fallback) |

---

## TypeScript with Async / Fetch

```ts
interface WeatherData {
  temperature: number
  condition: string
  city: string
}

async function fetchWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`https://api.example.com/weather?city=${city}`)

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  const data: WeatherData = await response.json()
  return data
}

// Usage
try {
  const weather = await fetchWeather("London")
  console.log(weather.temperature)   // TypeScript knows this is a number ✅
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

---

## TypeScript with React (preview — covered fully in Doc 3)

```tsx
// Typing props
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

// Function component
function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// useState with type
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)

// useRef with type
const inputRef = useRef<HTMLInputElement>(null)

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}
```

---

## Common TypeScript Errors You'll Hit (and what they mean)

| Error | Meaning | Fix |
|---|---|---|
| `Type 'string' is not assignable to type 'number'` | Wrong type passed | Fix the type or the value |
| `Object is possibly 'null'` | Value might be null | Add null check: `if (el) { ... }` |
| `Property 'x' does not exist on type 'Y'` | Accessing wrong property | Check your interface or use correct property |
| `Parameter 'x' implicitly has an 'any' type` | Missing type annotation | Add a type to the parameter |
| `Cannot find module './file'` | Import path wrong | Check the path and file extension |

---

## tsconfig.json — Know These Options Exist

You won't need to edit this often, but know what it is:

```json
{
  "compilerOptions": {
    "strict": true,         // enables all strict checks — keep this on
    "target": "ES2020",     // what JS version to compile to
    "module": "ESNext",     // module system
    "jsx": "react-jsx"      // needed for .tsx files
  }
}
```
> Vite's template sets this up correctly. Don't touch it until you know why you're changing something.

---

## Resources

| Resource | What it covers |
|---|---|
| [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Official TS docs — very readable |
| [typescript-exercises.github.io](https://typescript-exercises.github.io) | Hands-on TS exercises |
| [Total TypeScript (Matt Pocock)](https://www.totaltypescript.com/tutorials) | Best free TS video content |
| [TS Playground](https://www.typescriptlang.org/play) | Write TS in browser, see compiled JS |

> [!TIP]
> Use the **TS Playground** constantly while learning — paste code in, see errors instantly, hover over variables to see what type TypeScript inferred.

> [!IMPORTANT]
> Don't annotate everything manually. TypeScript's **type inference** is smart — let it do the work. Only add type annotations where inference can't figure it out (function parameters, API responses, useState with complex types).
