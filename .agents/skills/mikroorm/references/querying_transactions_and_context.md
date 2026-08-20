# Reference: Querying, Transactions & Request Context in MikroORM v7

This document details query methods, QueryBuilder usage, transaction handling, and AsyncLocalStorage request context management in MikroORM v7.

---

## 1. Repository Query Methods & Filter Operators

### Basic Query API
```typescript
// 1. Find with filtering, sorting, pagination, and fields selection
const users = await this.userRepo.find(
  {
    deletedAt: null,
    status: { $in: ['ACTIVE', 'PENDING'] },
    age: { $gte: 18, $lte: 65 },
  },
  {
    orderBy: { createdAt: 'DESC' },
    limit: 20,
    offset: 0,
    fields: ['id', 'email', 'firstName', 'lastName'],
    populate: ['projects'],
  },
);

// 2. Find and count (returns [entities, count])
const [tasks, totalCount] = await this.taskRepo.findAndCount(
  { user: userId, deletedAt: null },
  { limit: 10, offset: 0 },
);

// 3. Find one or throw 404 (NotFoundError in MikroORM, can be caught or transformed)
const task = await this.taskRepo.findOneOrFail({ id: taskId, deletedAt: null });
```

### Common Filter Operators
| Operator | Example | Generated SQL Equivalent |
| :--- | :--- | :--- |
| `$eq` | `{ status: { $eq: 'ACTIVE' } }` | `status = 'ACTIVE'` |
| `$ne` | `{ status: { $ne: 'DELETED' } }` | `status != 'DELETED'` |
| `$in` | `{ role: { $in: ['ADMIN', 'MANAGER'] } }` | `role IN ('ADMIN', 'MANAGER')` |
| `$nin` | `{ role: { $nin: ['GUEST'] } }` | `role NOT IN ('GUEST')` |
| `$gt` / `$gte` | `{ count: { $gte: 5 } }` | `count >= 5` |
| `$lt` / `$lte` | `{ createdAt: { $lt: new Date() } }` | `created_at < $1` |
| `$ilike` | `{ title: { $ilike: '%todo%' } }` | `title ILIKE '%todo%'` |
| `$like` | `{ code: { $like: 'US-%' } }` | `code LIKE 'US-%'` |
| `$null` | `{ deletedAt: null }` / `{ deletedAt: { $ne: null } }` | `deleted_at IS NULL` / `deleted_at IS NOT NULL` |
| `$and` | `{ $and: [{ a: 1 }, { b: 2 }] }` | `(a = 1 AND b = 2)` |
| `$or` | `{ $or: [{ status: 'OPEN' }, { priority: 'HIGH' }] }` | `(status = 'OPEN' OR priority = 'HIGH')` |

---

## 2. Built-in QueryBuilder

### Chaining & Dynamic Conditions
```typescript
async searchProjects(userId: string, query: {
  search?: string;
  isArchived?: boolean;
  minTasks?: number;
  page?: number;
  limit?: number;
}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const offset = (page - 1) * limit;

  const qb = this.projectRepo.createQueryBuilder('p')
    .select(['p.id', 'p.name', 'p.description', 'p.createdAt'])
    .leftJoinAndSelect('p.tasks', 't', { 't.deletedAt': null })
    .where({ 'p.user': userId, 'p.deletedAt': null });

  if (query.isArchived !== undefined) {
    qb.andWhere({ 'p.isArchived': query.isArchived });
  }

  if (query.search) {
    qb.andWhere({ 'p.name': { $ilike: `%${query.search}%` } });
  }

  qb.orderBy({ 'p.createdAt': 'DESC' })
    .limit(limit)
    .offset(offset);

  const [projects, total] = await qb.getResultAndCount();
  return { projects, total, page, limit };
}
```

---

## 3. High-Performance Batch Operations (`nativeUpdate` & `nativeDelete`)

When updating or deleting large sets of records where loading entities into the Identity Map is unnecessary overhead:

```typescript
// 1. Direct bulk update in SQL (bypasses Identity Map)
const affectedRows = await this.taskRepo.nativeUpdate(
  { user: userId, status: 'OPEN', deletedAt: null },
  { status: 'ARCHIVED', updatedAt: new Date() },
);

// 2. Direct bulk delete in SQL
const deletedCount = await this.taskRepo.nativeDelete({
  deletedAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
});
```

---

## 4. Transactions (`em.transactional`)

MikroORM provides automatic commit/rollback transaction wrappers. The callback receives a scoped `em` instance that must be used for all operations in that transaction.

```typescript
async transferTaskOwnership(taskId: string, currentUserId: string, newUserId: string) {
  return await this.em.transactional(async (txEm) => {
    // 1. Load task within the transaction
    const task = await txEm.findOneOrFail(Task, {
      id: taskId,
      user: currentUserId,
      deletedAt: null,
    });

    const newUserRef = txEm.getReference(User, newUserId);

    // 2. Mutate task
    task.user = newUserRef;
    task.updatedAt = new Date();

    // 3. Create an audit log entry within the same transaction
    const auditLog = txEm.create(AuditLog, {
      id: crypto.randomUUID(),
      action: 'TASK_OWNERSHIP_TRANSFERRED',
      entityId: taskId,
      performedBy: currentUserId,
      createdAt: new Date(),
    });

    // 4. Flushing occurs automatically upon returning from transactional()
    // If any error is thrown, the entire transaction is rolled back.
    return task;
  });
}
```

---

## 5. AsyncLocalStorage & RequestContext Isolation

### Why Context Isolation Matters
MikroORM uses an in-memory Identity Map. Without proper scoping:
- HTTP requests could share mutated objects across threads/requests.
- Background tasks (Crons, Queues) would cache entities indefinitely in the root `EntityManager`.

### In HTTP Requests (Automatic)
NestJS HTTP middleware creates a request context automatically via `MikroOrmMiddleware` or `RequestContext.create()`.

### In Background Tasks / Schedulers (Explicit)
Always use `@CreateRequestContext()` or `this.em.fork()`:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { Task } from './task.entity';

@Injectable()
export class TaskScheduler {
  constructor(private readonly em: EntityManager) {}

  // Option A: Decorator (recommended for class methods)
  @Cron('0 2 * * *')
  @CreateRequestContext()
  async dailyTaskCleanup() {
    const tasks = await this.em.find(Task, { isCompleted: true, deletedAt: null });
    for (const t of tasks) {
      t.deletedAt = new Date();
      t.updatedAt = new Date();
    }
    await this.em.flush();
  }

  // Option B: Manual Forking (ideal for standalone handlers or loops)
  async processJob(jobPayload: { taskId: string }) {
    const forkEm = this.em.fork();
    const task = await forkEm.findOneOrFail(Task, { id: jobPayload.taskId });
    task.isCompleted = true;
    task.updatedAt = new Date();
    await forkEm.flush();
  }
}
```
