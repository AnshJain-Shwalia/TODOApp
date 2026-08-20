---
name: mikroorm
description: >-
  Comprehensive guide and reference for MikroORM v7 in NestJS and PostgreSQL.
  Use when defining entities with defineEntity and property builder p, implementing
  Dumb ORM standards (explicit UUIDs/timestamps/defaults), managing Unit of Work and
  repositories, modeling relationships (1:N, 1:1, explicit pivot M:N), querying with
  QueryBuilder, handling transactions, configuring NestJS 11 modules, or managing migrations.
---

# MikroORM v7 Development Skill

This skill provides operational rules, code patterns, and references for building and maintaining persistence layers using **MikroORM v7** (`@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/nestjs`) with **PostgreSQL** in **NestJS**.

---

## 1. Architectural Mandates & Workspace Standards

1. **Dumb ORM & Dumb Database Rule**:
   - **No ORM Lifecycle Hooks**: Never use `.onCreate()`, `.onUpdate()`, or property-level default hooks in `defineEntity`.
   - **No DB Server Defaults**: Never use SQL defaults (`DEFAULT NOW()`, `DEFAULT gen_random_uuid()`, `DEFAULT <value>`) in schema definitions or migrations.
   - **Explicit Application Authority**: The application/service layer is the single authority for generating primary keys (`crypto.randomUUID()`), setting initial defaults, and managing timestamps (`createdAt`, `updatedAt`, `deletedAt`).
2. **MikroORM v7 Engine Standards**:
   - **Native ESM & `moduleResolution`**: MikroORM v7 is native ESM. Requires `moduleResolution: "nodenext"` or `"bundler"`, Node.js 22.17+, and TypeScript 5.8+.
   - **`forceUtcTimezone` Default**: Enabled by default for all SQL drivers in v7. All timestamps are serialized/retrieved in UTC.
   - **Kysely Engine**: Knex is replaced by Kysely under the hood for query execution.
   - **Zero Core Dependencies**: `@mikro-orm/core` does not auto-load `.env` (use NestJS `ConfigModule` or explicit `dotenv`).
   - **Decorators Moved**: Decorators are in `@mikro-orm/decorators` (legacy). The official recommended standard is programmatic definition with `defineEntity` and property builder `p`.
3. **Schema Definition Standard**:
   - Always use `defineEntity()`, property builder `p`, and `InferEntity<typeof Entity>` (do **not** use class decorators like `@Entity()`, `@Property()`).
4. **Relationship Standard**:
   - **1:N / N:1**: `p.manyToOne` with `.fieldName('parent_id')` on child, `p.oneToMany` with `.mappedBy('parent')` on parent.
   - **M:N**: Always use **Explicit Pivot Entities** (decompose M:N into two 1:N relations with a dedicated join entity holding composite primary keys and metadata). Do **not** use implicit `p.manyToMany()`.
5. **Data Mapper & Unit of Work**:
   - Mutate entity instances in memory and commit via `await em.flush()`.
   - Use `em.persist(item)` / `repo.create(data)` to stage new entities; `em.remove(item)` to stage deletions.

---

## 2. Quick Reference: Entity Schema Syntax

```typescript
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';

export const Task = defineEntity({
  name: 'Task',
  tableName: 'tasks',
  properties: {
    id: p.uuid().primary(),
    title: p.string().fieldName('title').length(255),
    description: p.text().fieldName('description').nullable(),
    isCompleted: p.boolean().fieldName('is_completed'),
    priority: p.enum(['LOW', 'MEDIUM', 'HIGH']).fieldName('priority'),
    
    // Explicit Foreign Key (Many-to-One)
    user: p
      .manyToOne(() => User)
      .fieldName('user_id')
      .inversedBy('tasks')
      .deleteRule('cascade'),

    // Explicit Timestamps & Soft Delete (Application-managed)
    createdAt: p.datetime().fieldName('created_at').columnType('timestamptz'),
    updatedAt: p.datetime().fieldName('updated_at').columnType('timestamptz'),
    deletedAt: p.datetime().fieldName('deleted_at').columnType('timestamptz').nullable(),
  },
});

export type ITask = InferEntity<typeof Task>;
```

---

## 3. Quick Reference: Service & Repository Operations

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Task, type ITask } from './task.entity';
import { User, type IUser } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: EntityRepository<ITask>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<IUser>,
    private readonly em: EntityManager,
  ) {}

  // 1. Create (Explicit Application Authority)
  async createTask(userId: string, dto: { title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) {
    const userRef = this.userRepo.getReference(userId);
    const now = new Date();

    const task = this.taskRepo.create({
      id: crypto.randomUUID(), // Explicit primary key
      title: dto.title,
      description: null,
      isCompleted: false,      // Explicit initial default
      priority: dto.priority,
      user: userRef,
      createdAt: now,          // Explicit timestamp
      updatedAt: now,          // Explicit timestamp
      deletedAt: null,
    });

    await this.em.flush();
    return task;
  }

  // 2. Read with Population
  async getTask(taskId: string) {
    const task = await this.taskRepo.findOne(
      { id: taskId, deletedAt: null },
      { populate: ['user'] },
    );
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // 3. Update (Unit of Work Mutation)
  async updateTask(taskId: string, dto: { title?: string; isCompleted?: boolean }) {
    const task = await this.taskRepo.findOneOrFail({ id: taskId, deletedAt: null });
    
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.isCompleted !== undefined) task.isCompleted = dto.isCompleted;
    task.updatedAt = new Date(); // Explicit update timestamp

    await this.em.flush(); // Identity Map detects dirty properties and executes UPDATE
    return task;
  }

  // 4. Soft Delete
  async softDeleteTask(taskId: string) {
    const task = await this.taskRepo.findOneOrFail({ id: taskId, deletedAt: null });
    task.deletedAt = new Date();
    task.updatedAt = new Date();
    await this.em.flush();
  }

  // 5. Hard Delete
  async hardDeleteTask(taskId: string) {
    const task = await this.taskRepo.findOneOrFail({ id: taskId });
    await this.em.removeAndFlush(task);
  }
}
```

---

## 4. QueryBuilder & Dynamic Filtering

```typescript
async searchTasks(userId: string, filter: { search?: string; priority?: string; limit?: number; offset?: number }) {
  const qb = this.taskRepo.createQueryBuilder('t')
    .select('*')
    .leftJoinAndSelect('t.user', 'u')
    .where({ 't.user': userId, 't.deletedAt': null });

  if (filter.priority) {
    qb.andWhere({ 't.priority': filter.priority });
  }

  if (filter.search) {
    qb.andWhere({ 't.title': { $ilike: `%${filter.search}%` } });
  }

  qb.orderBy({ 't.createdAt': 'DESC' })
    .limit(filter.limit ?? 20)
    .offset(filter.offset ?? 0);

  const [items, total] = await qb.getResultAndCount();
  return { items, total };
}
```

---

## 5. Background Jobs & `AsyncLocalStorage` (`@CreateRequestContext` / `em.fork()`)

In background jobs (e.g. `@Cron`, BullMQ workers, message consumers), the HTTP request context does not exist. Always isolate the `EntityManager` to prevent memory leaks and state pollution:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { Task } from './task.entity';

@Injectable()
export class TaskCronService {
  constructor(private readonly em: EntityManager) {}

  @Cron('0 0 * * *')
  @CreateRequestContext() // Creates an isolated ALS request context & forks EM
  async cleanupDeletedTasks() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldTasks = await this.em.find(Task, { deletedAt: { $lt: cutoff } });
    
    for (const task of oldTasks) {
      this.em.remove(task);
    }
    await this.em.flush();
  }
}
```

---

## 6. Detailed Reference Documentation

For comprehensive guides, edge cases, and deep dives, consult the following references:

1. [Entity Definition & Dumb ORM Standard](./references/entity_definition_and_dumb_orm.md) - Types, indexes, enums, and strict application authority rules.
2. [Relationships & Explicit Pivot Entities](./references/relationships_and_pivot_entities.md) - 1:N, 1:1, and M:N composite pivot entity architecture.
3. [Querying, Transactions & Request Context](./references/querying_transactions_and_context.md) - QueryBuilder, transactions (`em.transactional`), batch operations, and ALS.
4. [MikroORM v7 Complete Handbook](file:///home/ansh/Projects/TODOApp/guides/08_mikroorm_v7_complete_handbook.md) - Comprehensive developer manual in the project workspace.
