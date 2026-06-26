# Phase 2: Simple Backend & Database Connection

In this phase, you will write a modular backend service using **NestJS**, hook it up to a local **PostgreSQL** database via **TypeORM**, and swap your frontend's `localStorage` state with real REST API requests.

---

## 1. Goal & Deliverable
- A fully functional NestJS API listening on `http://localhost:3000`.
- A running PostgreSQL database containing a `task` table managed by TypeORM.
- Dynamic data integration in the React frontend, fetching and updating database state via HTTP requests.

---

## 2. Learning Outcomes
- Structuring modular backends with NestJS controllers, services, and modules.
- Integrating database migrations and entities using TypeORM.
- Implementing standard REST operations (`GET`, `POST`, `PATCH`, `DELETE`).
- Integrating HTTP requests (`fetch` or `axios`) inside React components.

---

## 3. Expected Directory Structure
```text
TODOApp/
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   │   ├── create-task.dto.ts # Validation schemas
│   │   │   │   └── update-task.dto.ts
│   │   │   ├── task.entity.ts         # Database row definition
│   │   │   ├── tasks.controller.ts    # REST route handlers
│   │   │   ├── tasks.module.ts
│   │   │   └── tasks.service.ts       # Database query operations
│   │   ├── app.module.ts              # Global imports & DB configuration
│   │   └── main.ts                    # Server initialization & CORS config
└── frontend/ (connected to backend instead of localStorage)
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Initialize the NestJS Project
Generate the NestJS app inside a `backend` folder:
```bash
# Inside TODOApp/
npx -y @nestjs/cli new backend --directory backend --skip-git
cd backend
npm install @nestjs/typeorm typeorm pg class-validator class-transformer
```

### Step 2: Configure the Database Connection
Update `src/app.module.ts` to configure the PostgreSQL database parameters (replace with your local database credentials):
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Change as appropriate
      password: 'password', // Change as appropriate
      database: 'zentodo',
      entities: [Task],
      synchronize: true, // Use only in dev, auto-syncs schemas
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

### Step 3: Write the Task Entity
Create `src/tasks/task.entity.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'urgent'], default: 'low' })
  priority: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Step 4: Write Controllers and Services
- Develop `tasks.service.ts` to perform database queries using TypeORM repository pattern (`this.taskRepository.find()`, `.save()`, `.delete()`).
- Establish `tasks.controller.ts` with API route routes (`@Get()`, `@Post()`, `@Patch(':id')`, `@Delete(':id')`).
- Enable CORS in `backend/src/main.ts` so the frontend can query it:
  ```typescript
  app.enableCors({ origin: 'http://localhost:5173' });
  ```

### Step 5: Connect Frontend to the REST API
Replace the `useLocalStorage` state logic in `frontend/src/App.tsx` with standard API calls using React `useEffect` and standard browser `fetch` (or `axios`):
```typescript
// Fetch tasks on load
useEffect(() => {
  fetch('http://localhost:3000/tasks')
    .then((res) => res.json())
    .then((data) => setTasks(data));
}, []);

// Creating a task example
const addTask = async (title: string, priority: string) => {
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority }),
  });
  const newTask = await response.json();
  setTasks((prev) => [...prev, newTask]);
};
```

---

## 5. Verification Checklist
- Run `npm run start:dev` in the backend.
- Run `npm run dev` in the frontend.
- Perform tasks creation/deletion/toggles on the web page.
- Log into your PostgreSQL instance (`psql` or pgAdmin) and query the `task` table to verify rows are properly generated and updated.
