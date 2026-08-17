# Workspace Rules & Development Standards

## 1. ORM & Persistence Layer Standard (MikroORM)
- **MikroORM Standard**: **MikroORM** (`@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/nestjs`) is the sole designated ORM for entity definitions, database modeling, migrations, and repository access.
- **Data Mapper & Unit of Work**: Leverage MikroORM's Data Mapper and Unit of Work (Identity Map) architecture. Do not use Active Record patterns.

## 2. Dumb ORM & Dumb Database Standard (Explicit Application Authority)
- **No ORM Lifecycle Hooks**: Entity schemas (`defineEntity`) must NOT use `.onCreate()`, `.onUpdate()`, or property-level default hooks.
- **No Database Server Defaults**: PostgreSQL DDL / schemas must NOT rely on server-side defaults (`DEFAULT NOW()`, `DEFAULT gen_random_uuid()`, `DEFAULT <value>`).
- **Explicit Application Authority**: The application/service layer is the single authority for generating primary keys (UUIDs), setting initial default values, and managing timestamps (`createdAt`, `updatedAt`, `deletedAt`). All values must be explicitly supplied in domain logic and DTOs.
