# Reference: Entity Definition & Dumb ORM Standard in MikroORM v7

This document details entity schema definition using MikroORM v7's `defineEntity` and `p` property builder API, strictly enforcing the workspace's **Dumb ORM & Dumb Database** standard.

---

## 1. The Dumb ORM & Dumb Database Standard

### Core Principles
1. **Explicit Application Authority**: The application is the single source of truth for entity state, identity, and lifecycle.
2. **No ORM Hooks**: Never use `.onCreate()`, `.onUpdate()`, `@BeforeCreate()`, or property-level default generator hooks.
3. **No Database Server Defaults**: Schemas and DDL migrations must NOT declare `DEFAULT NOW()`, `DEFAULT gen_random_uuid()`, or column-level defaults.
4. **Explicit Application Assignment**:
   - UUIDs must be generated in application code (`crypto.randomUUID()`).
   - Timestamps (`createdAt`, `updatedAt`, `deletedAt`) must be explicitly passed as `new Date()`.
   - Booleans and default statuses must be explicitly passed in entity creation payloads.

### Comparison Table

| Feature | Forbidden (Magic / Server-Side) | Required (Explicit Application Authority) |
| :--- | :--- | :--- |
| **Primary Key ID** | `id: p.uuid().defaultRaw('gen_random_uuid()')` | `id: p.uuid().primary()` + `crypto.randomUUID()` in Service |
| **Created Timestamp** | `createdAt: p.datetime().onCreate(() => new Date())` | `createdAt: p.datetime().columnType('timestamptz')` + `createdAt: new Date()` in DTO/Service |
| **Updated Timestamp** | `updatedAt: p.datetime().onUpdate(() => new Date())` | `updatedAt: p.datetime().columnType('timestamptz')` + `entity.updatedAt = new Date()` in Service |
| **Default Booleans** | `isArchived: p.boolean().default(false)` | `isArchived: p.boolean()` + `isArchived: false` in `repo.create()` |
| **Default Enums** | `status: p.enum().default('PENDING')` | `status: p.enum(...)` + `status: 'PENDING'` in `repo.create()` |

---

## 2. Property Builder (`p`) Syntax Cheat Sheet

| Data Type | MikroORM v7 Schema Definition | TypeScript Inferred Type | PostgreSQL Column Type |
| :--- | :--- | :--- | :--- |
| **UUID (Primary Key)** | `p.uuid().primary()` | `string` | `uuid` |
| **String / Varchar** | `p.string().fieldName('first_name').length(255)` | `string` | `varchar(255)` |
| **Nullable String** | `p.string().fieldName('last_name').length(255).nullable()` | `string \| null` | `varchar(255)` |
| **Text (Long)** | `p.text().fieldName('description').nullable()` | `string \| null` | `text` |
| **Integer** | `p.integer().fieldName('retry_count')` | `number` | `integer` |
| **BigInt** | `p.bigint().fieldName('view_count')` | `string \| number` | `bigint` |
| **Float / Double** | `p.double().fieldName('score')` | `number` | `double precision` |
| **Decimal / Numeric** | `p.decimal({ precision: 10, scale: 2 }).fieldName('price')` | `string` | `numeric(10, 2)` |
| **Boolean** | `p.boolean().fieldName('is_active')` | `boolean` | `boolean` |
| **Timestamp with TZ** | `p.datetime().fieldName('created_at').columnType('timestamptz')` | `Date` | `timestamptz` |
| **Date Only** | `p.date().fieldName('birth_date').columnType('date')` | `Date \| string` | `date` |
| **Enum** | `p.enum(['ACTIVE', 'INACTIVE']).fieldName('status')` | `'ACTIVE' \| 'INACTIVE'` | `text` / `enum` |
| **JSON / JSONB** | `p.json().fieldName('metadata').nullable()` | `Record<string, unknown> \| null` | `jsonb` |
| **String Array** | `p.array(() => 'string').fieldName('tags')` | `string[]` | `text[]` |

---

## 3. Complete Entity Example

```typescript
// src/project/project.entity.ts
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { User } from '../user/user.entity';

export const Project = defineEntity({
  name: 'Project',
  tableName: 'projects',
  properties: {
    id: p.uuid().primary(),
    name: p.string().fieldName('name').length(255),
    description: p.text().fieldName('description').nullable(),
    isArchived: p.boolean().fieldName('is_archived'),
    settings: p.json().fieldName('settings').nullable(),
    
    // Relationships
    user: p
      .manyToOne(() => User)
      .fieldName('user_id')
      .inversedBy('projects')
      .deleteRule('cascade'),

    // Timestamps
    createdAt: p.datetime().fieldName('created_at').columnType('timestamptz'),
    updatedAt: p.datetime().fieldName('updated_at').columnType('timestamptz'),
    deletedAt: p.datetime().fieldName('deleted_at').columnType('timestamptz').nullable(),
  },
  indexes: [
    { properties: ['user', 'deletedAt'] }, // Composite index for tenant filtering
    { properties: ['name'] },
  ],
});

export type IProject = InferEntity<typeof Project>;
```

---

## 4. Entity Factory / Creation Pattern

To enforce strict application-side defaults across test suites and services, use a factory function or explicit service creation:

```typescript
export function createProjectPayload(params: {
  userId: string;
  name: string;
  description?: string;
  settings?: Record<string, unknown>;
}): IProject {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    name: params.name,
    description: params.description ?? null,
    isArchived: false,
    settings: params.settings ?? null,
    user: params.userId as any, // or user reference
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
}
```
