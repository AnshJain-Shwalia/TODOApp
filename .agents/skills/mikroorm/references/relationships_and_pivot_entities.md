# Reference: Relationships & Explicit Pivot Entities in MikroORM v7

This document details relationship modeling in MikroORM v7 using `defineEntity`, property builder `p`, and explicit pivot entities for Many-to-Many associations.

---

## 1. Relationship Types Overview

| Relationship | Owning Side (Holds Foreign Key) | Inverse Side | Standard / Best Practice |
| :--- | :--- | :--- | :--- |
| **Many-to-One (1:N)** | `p.manyToOne(() => Parent)` with `.fieldName('parent_id')` | `p.oneToMany(() => Child).mappedBy('parent')` | Always specify `.deleteRule('cascade')` on owning side if parent deletion should cascade. |
| **One-to-One (1:1)** | `p.oneToOne(() => Target).owner().fieldName('target_id')` | `p.oneToOne(() => Source).mappedBy('target').nullable()` | Use `.owner()` on the entity holding the unique FK column. |
| **Many-to-Many (M:N)** | Decompose into **Explicit Pivot Entity** | Two `1:N` relationships on parent entities | **Mandatory**: Do not use implicit `p.manyToMany` join tables. |

---

## 2. One-to-Many & Many-to-One (1:N)

### Schema Definition
```typescript
// Child / Owning Side (src/task/task.entity.ts)
export const Task = defineEntity({
  name: 'Task',
  tableName: 'tasks',
  properties: {
    id: p.uuid().primary(),
    title: p.string().length(255),
    user: p
      .manyToOne(() => User)
      .fieldName('user_id')
      .inversedBy('tasks')
      .deleteRule('cascade'),
  },
});

// Parent / Inverse Side (src/user/user.entity.ts)
export const User = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary(),
    email: p.string().unique(),
    tasks: p.oneToMany(() => Task).mappedBy('user'),
  },
});
```

### Loading & Querying 1:N
```typescript
// 1. Load user with all tasks
const user = await this.userRepo.findOne({ id: userId }, { populate: ['tasks'] });

// 2. Load task with user
const task = await this.taskRepo.findOne({ id: taskId }, { populate: ['user'] });

// 3. Assign task using getReference (no need to query User row first)
const userRef = this.userRepo.getReference(userId);
const newTask = this.taskRepo.create({
  id: crypto.randomUUID(),
  title: 'New Task',
  user: userRef,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
await this.em.flush();
```

---

## 3. Explicit Pivot Entity Standard (Many-to-Many)

### Why Implicit Pivot Tables are Anti-Patterns
1. **Metadata Incompatibility**: Cannot add fields like `createdAt`, `assignedBy`, `role`, or `order` without breaking changes.
2. **Lack of DB Control**: Hidden foreign key names, implicit indexes, and opaque cascade rules.
3. **Query Inefficiency**: Cannot query the junction table directly without joining both parent tables.

### Implementation Pattern: Composite Primary Key Pivot Entity

```typescript
// 1. Pivot Entity: src/task/task-tag.entity.ts
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { Task } from './task.entity';
import { Tag } from '../tag/tag.entity';

export const TaskTag = defineEntity({
  name: 'TaskTag',
  tableName: 'task_tags',
  primaryKeys: ['task', 'tag'], // Composite PK (task_id, tag_id)
  properties: {
    task: p
      .manyToOne(() => Task)
      .fieldName('task_id')
      .inversedBy('taskTags')
      .deleteRule('cascade'),

    tag: p
      .manyToOne(() => Tag)
      .fieldName('tag_id')
      .inversedBy('taskTags')
      .deleteRule('cascade'),

    // Metadata payload
    createdAt: p.datetime().fieldName('created_at').columnType('timestamptz'),
    assignedBy: p.string().fieldName('assigned_by').length(255).nullable(),
  },
});

export type ITaskTag = InferEntity<typeof TaskTag>;
```

```typescript
// 2. Task Entity: src/task/task.entity.ts
export const Task = defineEntity({
  name: 'Task',
  tableName: 'tasks',
  properties: {
    id: p.uuid().primary(),
    title: p.string().length(255),
    taskTags: p.oneToMany(() => TaskTag).mappedBy('task'),
  },
});

// 3. Tag Entity: src/tag/tag.entity.ts
export const Tag = defineEntity({
  name: 'Tag',
  tableName: 'tags',
  properties: {
    id: p.uuid().primary(),
    name: p.string().length(50).unique(),
    taskTags: p.oneToMany(() => TaskTag).mappedBy('tag'),
  },
});
```

---

## 4. Runtime Operations with Pivot Entities

### A. Creating an Association
```typescript
const taskRef = this.taskRepo.getReference(taskId);
const tagRef = this.tagRepo.getReference(tagId);

const taskTag = this.taskTagRepo.create({
  task: taskRef,
  tag: tagRef,
  assignedBy: currentUserId,
  createdAt: new Date(),
});

await this.em.flush();
```

### B. Nested Population (Task $\rightarrow$ TaskTags $\rightarrow$ Tag)
```typescript
const task = await this.taskRepo.findOne(
  { id: taskId },
  { populate: ['taskTags.tag'] },
);

// Access nested tags cleanly
const tagNames = task?.taskTags.map((tt) => tt.tag.name) ?? [];
```

### C. Unlinking / Removing Association
```typescript
const link = await this.taskTagRepo.findOne({
  task: taskId,
  tag: tagId,
});

if (link) {
  await this.em.removeAndFlush(link);
}
```

### D. Finding All Tasks by Tag ID
```typescript
const links = await this.taskTagRepo.find(
  { tag: tagId },
  { populate: ['task'], orderBy: { createdAt: 'DESC' } },
);

const tasks = links.map((link) => link.task);
```
