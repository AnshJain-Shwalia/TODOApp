# TODO App Backend Requirements (PRD)

This document specifies the **Functional Requirements (FR)** and **Non-Functional Requirements (NFR)** for building a TODO application backend. It intentionally omits data schemas, entity-relationship diagrams, and API endpoints so that you can design the REST architecture, data model, and API contract yourself.

---

## 1. Functional Requirements (FR)

### FR-1: User Authentication & Identity Management
- **FR-1.1**: The system must allow users to authenticate using both Sign in with Google (OAuth2 / OpenID Connect) and traditional Email & Password verification.
- **FR-1.2**: For first-time Google sign-ins, the system must automatically provision a user account using profile details provided by Google (e.g., email, full name, Google subject ID). For Email/Password registration, passwords must be securely hashed before storage.
- **FR-1.3**: The system must validate Google ID tokens / OAuth credentials as well as email/password credentials securely, issuing session access tokens and refresh tokens for subsequent protected API requests (supporting SPA web and mobile clients).
- **FR-1.4**: Users must be able to retrieve and update their own profile details.

### FR-2: Project / Category Management
- **FR-2.1**: Users must be able to create custom projects/categories (e.g., "Work", "Personal") to organize their tasks.
- **FR-2.2**: Users must be able to view a list of all their projects, including task counts for each project.
- **FR-2.3**: Users must be able to rename, update, or delete projects.
- **FR-2.4**: When a project is deleted, the backend must safely handle associated tasks according to predefined rules (e.g., unassigning the project or soft-deleting).

### FR-3: TODO Task Lifecycle & Management
- **FR-3.1**: Users must be able to create TODO tasks with attributes such as title, description, priority (e.g., Low, Medium, High, Urgent), optional due date, and an optional project assignment.
- **FR-3.2**: Tasks must support lifecycle status transitions: `Pending` → `In Progress` → `Completed` → `Archived`.
- **FR-3.3**: Users must be able to re-open completed or archived tasks.
- **FR-3.4**: Users must be able to update any task field (title, description, due date, priority, status, project).
- **FR-3.5**: The system must support soft-deletion (moving tasks to Trash) and restoring soft-deleted tasks back to their original state.
- **FR-3.6**: Users must be able to permanently purge tasks from Trash.

### FR-4: Tagging & Labeling
- **FR-4.1**: Users must be able to create custom tags/labels (e.g., `#urgent`, `#home`).
- **FR-4.2**: Users must be able to attach one or multiple tags to a task.
- **FR-4.3**: Users must be able to remove tags from a task.

### FR-5: Searching, Filtering, Sorting & Pagination
- **FR-5.1**: Users must be able to filter tasks by status, priority, project, and tag.
- **FR-5.2**: Users must be able to filter tasks by due date ranges (e.g., overdue tasks, due today, due within a date range).
- **FR-5.3**: Users must be able to search tasks by title or description keyword.
- **FR-5.4**: The system must support sorting task lists by creation date, due date, or priority.
- **FR-5.5**: Task list queries must support pagination (page index / offset and page size limit).

### FR-6: Bulk Operations
- **FR-6.1**: Users must be able to perform batch actions on multiple tasks in a single request (e.g., marking multiple tasks as completed or moving them to a project).

---

## 2. Non-Functional Requirements (NFR)

### NFR-1: Security & Multi-Tenancy
- **NFR-1.1**: Strict tenant isolation: A user must only be able to view, modify, or delete their own data. Any attempt to access another user's resource must be rejected with appropriate authorization status codes.
- **NFR-1.2**: Google ID tokens / OAuth credentials must be securely verified on the server side using Google's public keys or verification libraries.
- **NFR-1.3**: All protected endpoints must require valid authentication credentials/tokens.

### NFR-2: Data Validation & Error Handling
- **NFR-2.1**: All incoming request payloads must be strictly validated. Invalid inputs must be rejected with descriptive validation error messages.
- **NFR-2.2**: The API must return consistent, standardized JSON error responses across all endpoints.

### NFR-3: Performance & Scalability
- **NFR-3.1**: Database queries for listing tasks must scale efficiently using appropriate indexes (e.g., indexed foreign keys, user IDs, and status fields).
- **NFR-3.2**: Page size limits must be enforced on list endpoints to prevent memory overflow and huge payload transfers.

### NFR-4: API Semantics & Idempotency
- **NFR-4.1**: HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and HTTP status codes must be used appropriately according to REST principles.
- **NFR-4.2**: `GET`, `PUT`, and `DELETE` requests must be idempotent.

---

## 3. Technology Stack & Architectural Standards

- **Application Framework**: NestJS (v11+) with TypeScript.
- **Database Engine**: PostgreSQL (v16+).
- **ORM / Persistence Layer**: **MikroORM** (`@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/nestjs`).
  - Architectural Pattern: **Data Mapper** & **Unit of Work** (Identity Map).
  - Schema & Migrations: MikroORM Migrations (`@mikro-orm/migrations`) and Schema Generator (`@mikro-orm/postgresql`).
  - Request Context: MikroORM Request Context / `em.fork()` for isolated request-scoped transactions.
- **Validation & Environment**: Zod for environment configuration validation and input DTO schemas.
- **Testing Standard**: Jest with pure isolation for unit tests (mocking MikroORM repositories) and dedicated PostgreSQL test instances for integration/E2E tests.

