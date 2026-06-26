# Phase 3: Workspaces & Organization (Relational Data)

In this phase, you will add structural layers to your todo management engine. You will create **Workspaces** (e.g., Personal, Work, Side Project) using TypeORM relationships, expand your frontend UI with side navigation, and build dynamic Kanban board layouts.

---

## 1. Goal & Deliverable
- A database model supporting a 1-to-many relationship: One `Workspace` can contain many `Tasks`.
- Backend endpoints for workspaces (`GET`, `POST`, `PATCH`, `DELETE`).
- Frontend sidebar dynamically pulling active workspaces and filtering task items based on the active workspace.
- Multi-layout toggle enabling users to swap between standard List View and a drag-and-drop Kanban Board (`Todo` | `In Progress` | `Done`).

---

## 2. Learning Outcomes
- Implementing 1-to-many (`@OneToMany`) and many-to-1 (`@ManyToOne`) database relations in TypeORM.
- Handling cascade operations and relational integrity in PostgreSQL.
- Using drag-and-drop mechanics in React (with `@hello-pangea/dnd` or custom drag-and-drop API).
- Structuring modular sidebar navigations in Chakra UI.

---

## 3. Expected Directory Structure Updates
```text
backend/
├── src/
│   ├── workspaces/
│   │   ├── workspaces.controller.ts
│   │   ├── workspaces.module.ts
│   │   ├── workspaces.service.ts
│   │   └── workspace.entity.ts       # Relation to Task.entity.ts
│   ├── tasks/
│   │   └── task.entity.ts             # Contains @ManyToOne relationship
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Write the Workspace Entity
Create `backend/src/workspaces/workspace.entity.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '#3182ce' }) // Hex color code for branding
  color: string;

  @OneToMany(() => Task, (task) => task.workspace, { cascade: true })
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
```

Update `backend/src/tasks/task.entity.ts` to include the relationship column:
```typescript
import { ManyToOne } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';

// Inside Task Entity class:
@Column({ default: 'todo' }) // status enum 'todo', 'in_progress', 'done'
status: string;

@ManyToOne(() => Workspace, (workspace) => workspace.tasks, { onDelete: 'CASCADE' })
workspace: Workspace;
```

### Step 2: Implement Backend Modules
- Build out the `workspaces` module. Inject it into `AppModule` and register the `Workspace` entity.
- Update `TasksService` query builder (or repositories) to filter tasks by `workspaceId`:
  ```typescript
  async findByWorkspace(workspaceId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { createdAt: 'ASC' },
    });
  }
  ```

### Step 3: Expand the Sidebar Layout
Modify your React interface:
- Fetch and display the list of workspaces in the sidebar.
- Allow users to add a new workspace via a small popover or modal.
- Tracking active workspace state. Clicking a workspace updates the main task window to fetch and display tasks associated with that ID.

### Step 4: Build Kanban Board Integration
Install drag-and-drop:
```bash
# In frontend/
npm install @hello-pangea/dnd
```
Implement a board view containing columns for `Todo`, `In Progress`, and `Done`:
- Map the workspace tasks into their respective columns according to their `status` property.
- Implement an `onDragEnd` handler. When a task card is moved to another column:
  1. Optimistically update local component state to maintain visual smoothness.
  2. Fire an HTTP `PATCH /tasks/:id` updating the task's `status` to match the target column.
  3. Revert changes if the network request fails (shake animation).

---

## 5. Verification Checklist
- Verify you can create multiple workspaces with different colors.
- Ensure clicking on a workspace displays only tasks inside that space.
- Drag tasks between Kanban columns. Reload the page and ensure the status updates persist.
