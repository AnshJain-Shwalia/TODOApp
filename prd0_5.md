# PRD v0.5: ZenTodo (Realistic Starting Point)

This is a scoped-down version of the full ZenTodo PRD, written specifically for a **returning developer** who has been away for ~2 years and needs to rebuild confidence before tackling the full vision.

The goal here is simple: **ship something that works and feels good**, not something that is feature-complete.

---

## The Honest Goal

By the end of this version, you should have:
- A working full-stack todo app you built yourself
- Refreshed knowledge of NestJS, PostgreSQL, React, and TypeScript
- Enough confidence and momentum to tackle the full PRD

If it looks a little rough around the edges, that is fine. **Working > perfect.**

---

## What Is Cut (and Why)

| Cut Feature | Why |
|---|---|
| Real-time WebSockets | Hard to debug while relearning. Add later. |
| Kanban Board | Drag-and-drop is tricky. List view is enough for v0.5. |
| Calendar View | Complexity not worth it at this stage. |
| Analytics Dashboard | Needs solid data first. Skip entirely for now. |
| GitHub-style Heatmap | Purely cosmetic at this stage. |
| Confetti / micro-animations | Fun but a distraction right now. |
| Glassmorphism & advanced theming | Keep the UI clean and simple instead. |
| Framer Motion | Skip entirely. Chakra's built-ins are enough. |
| Subtask checklists | Over-engineered for v0.5. |
| Markdown in task description | Nice to have, not essential. |
| Collaboration / multi-user workspaces | Auth is enough. Sharing comes later. |

---

## What You Are Actually Building

A clean, functional, full-stack todo app with:

1. **User Auth** — Register and login with email + password
2. **Workspaces** — Organize tasks into named groups (e.g. Personal, Work)
3. **Task Management** — Create, edit, complete, and delete tasks
4. **Priorities** — Low / Medium / High / Urgent tags on tasks
5. **Due Dates** — Optional due date on each task
6. **Light / Dark Mode** — A single toggle, handled by Chakra UI
7. **Data persisted in PostgreSQL** — No localStorage in production

That is it. No more, no less.

---

## Tech Stack (Simplified)

### Frontend
- **React + TypeScript** (Vite)
- **Chakra UI v2** — for layout, components, dark mode
- **React Router v6** — for page navigation (login, app, etc.)
- **Axios** — for API calls (easier than raw fetch for a returner)

> No Framer Motion. No Recharts. No drag-and-drop. Keep it lean.

### Backend
- **NestJS** — modular TypeScript backend
- **TypeORM** — database ORM
- **PostgreSQL** — relational database
- **Passport.js + JWT** — authentication
- **bcrypt** — password hashing

> Same as the full PRD. This is your comfort zone.

---

## Database Schema

Three tables. No more.

```
User
  - id (uuid)
  - email (unique)
  - passwordHash
  - fullName
  - createdAt

Workspace
  - id (uuid)
  - name
  - color (hex string, for sidebar dot)
  - userId (FK → User)
  - createdAt

Task
  - id (uuid)
  - title
  - description (nullable)
  - isCompleted (boolean)
  - priority ('low' | 'medium' | 'high' | 'urgent')
  - dueDate (nullable)
  - workspaceId (FK → Workspace)
  - createdAt
  - updatedAt
```

---

## REST API Endpoints

Everything your frontend needs, nothing it doesn't.

### Auth
```
POST /auth/register    → create account, return JWT
POST /auth/login       → verify credentials, return JWT
GET  /auth/profile     → return logged-in user info (protected)
```

### Workspaces (all protected by JWT guard)
```
GET    /workspaces        → list user's workspaces
POST   /workspaces        → create workspace
PATCH  /workspaces/:id    → rename or recolor workspace
DELETE /workspaces/:id    → delete workspace (cascades tasks)
```

### Tasks (all protected by JWT guard)
```
GET    /workspaces/:id/tasks    → list tasks in a workspace
POST   /workspaces/:id/tasks    → create task in a workspace
PATCH  /tasks/:id               → update task (title, status, priority, dueDate)
DELETE /tasks/:id               → delete task
```

---

## Frontend Pages

Keep it simple. Four pages total.

### 1. `/login` and `/register`
- Simple centered card with email + password fields
- On success, save JWT to localStorage, redirect to `/app`

### 2. `/app` (main view — protected route)
- **Sidebar** (left): list of workspaces, a button to create a new one
- **Main area** (right): tasks for the selected workspace
  - Input field at top to add a new task
  - List of task items below
  - Each task: checkbox, title, priority badge, due date, delete button
- **Header**: app title, dark mode toggle, logout button

### 3. No other pages needed yet

---

## UI Guidelines (Realistic)

You are not a designer and that is okay. Follow these simple rules:

- Use **Chakra UI defaults**. Don't fight the library.
- Pick a **dark background** (`gray.900`) and enable dark mode by default.
- Use **colored dots or badges** for priority (red = urgent, orange = high, etc.)
- Use **`VStack` and `HStack`** for layouts. Don't touch CSS if you can avoid it.
- **One font** — Chakra's default system font is fine.

The goal is "clean and functional", not "stunning". You can polish later.

---

## Phase Breakdown for v0.5

### Step 1 — Frontend Shell (no backend yet)
- Initialize Vite + React + TypeScript project
- Install and configure Chakra UI with dark mode
- Build the layout: sidebar + main area + header
- Hardcode 2–3 fake tasks to verify the UI looks right
- Add the login/register page (no real auth yet, just the UI)

**Done when:** You can see the app layout with fake data in the browser.

---

### Step 2 — NestJS Backend + PostgreSQL
- Initialize NestJS project
- Connect TypeORM to a local PostgreSQL database
- Create the `Task` entity
- Implement `GET`, `POST`, `PATCH`, `DELETE` for `/tasks`
- Test with Postman or curl — no frontend yet

**Done when:** You can CRUD tasks via API calls in Postman.

---

### Step 3 — Connect Frontend to Backend
- Replace hardcoded tasks with real `axios` calls
- Add loading states (Chakra `Spinner`)
- Add error handling (Chakra `Alert` or `useToast`)

**Done when:** Creating and completing tasks in the browser persists to PostgreSQL.

---

### Step 4 — Workspaces
- Add `Workspace` entity and its endpoints
- Add `workspaceId` FK to `Task`
- Update sidebar to fetch and display real workspaces
- Clicking a workspace filters the task list

**Done when:** You have at least 2 workspaces with separate task lists.

---

### Step 5 — Authentication
- Add `User` entity
- Implement register + login endpoints with bcrypt + JWT
- Add `JwtAuthGuard` to all workspace and task routes
- Build the login and register pages in React
- Store token in localStorage, pass it in Axios headers
- Redirect unauthenticated users to `/login`

**Done when:** Two separate accounts cannot see each other's tasks.

---

## Definition of Done for v0.5

You are finished when you can do all of the following:

- [ ] Register a new account
- [ ] Log in and be redirected to the app
- [ ] Create a workspace
- [ ] Add tasks to that workspace with priorities and due dates
- [ ] Mark tasks as complete
- [ ] Delete a task
- [ ] Log out and log back in — data is still there
- [ ] Open the app in an incognito window with a different account and confirm data is isolated

If you can tick all of these, **you have a real full-stack app**. Everything in the full PRD is just building on top of this foundation.

---

## What Comes After v0.5

Once this is solid, you can layer on features from the original PRD in any order:

- Kanban board view (drag-and-drop)
- Task sorting and filtering
- Real-time sync (WebSockets)
- Analytics dashboard
- Framer Motion polish
- Subtasks and markdown descriptions
