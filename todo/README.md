# TODO App Backend

A production-ready, multi-tenant TODO application backend built with **NestJS**, **MikroORM**, and **PostgreSQL**.

---

## 🛠️ Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11+)
- **ORM / Persistence**: [MikroORM](https://mikro-orm.io/) (v6+) (`@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/nestjs`)
  - **Pattern**: Data Mapper & Unit of Work (Identity Map)
- **Database Engine**: [PostgreSQL](https://www.postgresql.org/) (v16+)
- **Configuration & Validation**: `@nestjs/config` & [Zod](https://zod.dev/)
- **API Documentation**: OpenAPI / [Swagger](https://swagger.io/) (`@nestjs/swagger`)

---

## 🏗️ Architecture & Key Concepts

The application strictly follows a 3-tier layered architecture (Controller → Service → Repository/DAL):

1. **Controller / Router**: Validates incoming DTOs, extracts authenticated user claims, and formats HTTP response codes.
2. **Service Layer**: Enforces core domain logic, state machine lifecycles, and side-effects.
3. **Data Access Layer (DAL) / MikroORM**:
   - Manages entity mapping with `@Entity()`, `@PrimaryKey({ type: 'uuid' })`, `@Property()`, `@ManyToOne()`, and `@ManyToMany()`.
   - Utilizes MikroORM's `EntityRepository` and `EntityManager` (`em.fork()`) for request-scoped database transactions.
   - Enforces automatic soft-deletion filtering via `@Filter({ name: 'softDelete', cond: { isDeleted: false }, default: true })`.
   - Enforces multi-tenant isolation on all queries to prevent IDOR vulnerabilities.
   - Supports type-safe advanced SQL queries via MikroORM's Kysely integration (`@mikro-orm/kysely` / `em.getKysely()`). See [mikroorm_and_kysely_mental_model.md](../guides/mikroorm_and_kysely_mental_model.md).

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL (running locally or via Docker)

### 2. Environment Setup

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db
JWT_SECRET=your_jwt_secret_key
```

### 3. Installation

```bash
npm install
```

### 4. Database Schema & Migrations (MikroORM)

MikroORM CLI provides migration and schema management commands:

```bash
# Create a new migration based on entity changes
npx mikro-orm migration:create

# Run pending migrations
npx mikro-orm migration:up

# Check schema sync status
npx mikro-orm schema:update
```

### 5. Running the Application

```bash
# Development mode with watch
npm run start:dev

# Production build & start
npm run build
npm run start:prod
```
