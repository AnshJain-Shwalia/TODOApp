# Phase 1: Minimalist Local Todo App (Frontend Only)

In this phase, you will build a high-fidelity, interactive Todo app client that runs entirely in the browser using `localStorage`.

---

## 1. Goal & Deliverable
- A beautiful, responsive task manager built using **React (TypeScript)** and **Chakra UI**.
- Core task operations (Create, Toggle Complete, Edit Title, Delete) persisted in browser local storage.
- Support for Light/Dark mode toggling.

---

## 2. Learning Outcomes
- Declaring state variables with `useState` and managing side effects with `useEffect`.
- Building modular components in React with TypeScript interfaces.
- Customizing themes, layouts, flexboxes, and responsive patterns in Chakra UI.

---

## 3. Expected Directory Structure
Once set up, your frontend directory should look like this:
```text
TODOApp/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddTask.tsx      # Simple input form for new tasks
    │   │   ├── Header.tsx       # App title and theme toggle switch
    │   │   ├── Sidebar.tsx      # Sidebar navigation (static for now)
    │   │   ├── TaskItem.tsx     # Single task line item with actions
    │   │   └── TaskList.tsx     # List wrapper holding task items
    │   ├── hooks/
    │   │   └── useLocalStorage.ts # Custom hook for storage synchronization
    │   ├── App.tsx              # Main orchestrator layout
    │   └── main.tsx             # React DOM renderer
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Initialize the React App
Create a directory named `frontend` and initialize a Vite template:
```bash
# Inside TODOApp/
mkdir frontend
cd frontend
# Run Vite template in non-interactive mode
npx -y create-vite@latest . --template react-ts
npm install
```

### Step 2: Install Chakra UI & Dependecies
Install Chakra UI (v2 is highly recommended for stability and ease of hook use) along with its dependencies:
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons
```

### Step 3: Configure Chakra Provider
Open `src/main.tsx` and wrap the `<App />` component in `<ChakraProvider>` to enable Chakra theme styling:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
```

### Step 4: Write the Custom LocalStorage Hook
Create `src/hooks/useLocalStorage.ts` to manage state synchronized with browser storage:
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

### Step 5: Define interfaces and components
- Define a `Task` interface:
  ```typescript
  export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
  }
  ```
- Build components (`Header`, `Sidebar`, `TaskItem`, `TaskList`, `AddTask`) styling them with Chakra elements like `Box`, `Flex`, `Heading`, `Button`, `Input`, `Select`, `IconButton`, and `Checkbox`.
- Ensure you support responsive spacing (e.g. `p={[4, 6, 8]}`).

---

## 5. Verification Checklist
- Run `npm run dev` in the frontend directory.
- Open `http://localhost:5173`.
- Verify you can:
  1. Add a new task (checking priority selects).
  2. Toggle a task as completed.
  3. Change the UI between light mode and dark mode.
  4. Reload the page and ensure the tasks remain visible.
