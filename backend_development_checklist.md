# Backend Development Master Checklist

This checklist synthesizes the core principles, practices, and rules from the backend engineering guides into an actionable review document.

---

## 1. RESTful Architecture & HTTP Semantics

_Reference: [01_rest_and_http_semantics.md](file:///home/ansh/Projects/TODOApp/guides/01_rest_and_http_semantics.md)_

- [ ] **Resource-Oriented URIs**: Name endpoints using plural nouns (`/todos`, `/projects`), never actions or verbs (`/getTodos`, `/createTodo`).
- [ ] **Limit Resource Nesting**: Keep nesting to a maximum of 2 levels (e.g., `/projects/42/todos`). Flatten deeper hierarchies to direct endpoints (`/todos/123/tags`).
- [ ] **Respect HTTP Method Semantics**:
    - `GET`: Must be **safe** and **idempotent** (reads data without mutating server state).
    - `POST`: Non-safe & non-idempotent (creates resources or triggers execution).
    - `PUT`: Idempotent full replacement of a resource payload.
    - `PATCH`: Partial update. Ensure array updates are explicitly defined as idempotent replacements or non-idempotent appends.
    - `DELETE`: Idempotent resource removal. Returning `404` or `204` on repeated deletes remains idempotent.
- [ ] **Correct HTTP Status Codes**:
    - **2xx**: `200 OK`, `201 Created` (include `Location` header), `204 No Content`.
    - **4xx**: `400 Bad Request` (syntactic/schema invalidity), `401 Unauthorized` (missing/invalid credentials), `403 Forbidden` (lack of permission), `404 Not Found` (resource/ID missing or hidden), `409 Conflict` (state collision), `422 Unprocessable Entity` (semantic business validation failure).
    - **5xx**: `500 Internal Server Error` (unexpected server failures). Never hide errors inside a `200 OK` response.

---

## 2. Layered Architecture & MVC

_Reference: [02_layered_architecture_mvc.md](file:///home/ansh/Projects/TODOApp/guides/02_layered_architecture_mvc.md)_

- [ ] **Enforce 3-Tier Layer Boundaries**:
    - **Controller / Router**: Parses HTTP request bodies/params, validates DTO formats, maps errors to status codes. _No SQL queries or domain business logic._
    - **Service Layer**: Enforces core domain rules, state machine constraints, and side effects. _Keep completely agnostic of HTTP (`req`, `res` objects)._
    - **Repository Layer (DAL)**: Handles database queries and ORM calls. _No HTTP token checks or status handling._
- [ ] **Use Data Transfer Objects (DTOs)**: Define separate input DTOs (e.g., `CreateTodoDTO`) and output DTOs (e.g., `TodoResponseDTO`) to prevent exposing internal DB fields.
- [ ] **Prevent SQL Injection**: Always use parameterized queries (`$1`, `$2`) or ORM bindings—never concatenate dynamic user input strings into SQL statements.
- [ ] **Decouple for Unit Testing**: Keep layers independent so Services and Repositories can be tested with stubs/mocks without needing live DB or HTTP server instances.

---

## 3. Database Modeling & Relationships

_Reference: [03_database_modeling_and_relationships.md](file:///home/ansh/Projects/TODOApp/guides/03_database_modeling_and_relationships.md)_

- [ ] **Primary Keys**: Prefer **UUIDs** (or time-ordered UUID v7) over auto-incrementing integers for client-exposed resources to block resource enumeration attacks.
- [ ] **Foreign Keys & Cardinality**:
    - **1:N**: Place Foreign Key on the child table and explicitly choose `ON DELETE CASCADE`, `SET NULL`, or `RESTRICT`.
    - **N:M**: Use a dedicated join/pivot table with composite primary key `(todo_id, tag_id)`. Add secondary index on the second foreign key column if queried independently.
- [ ] **Indexing Strategy**:
    - Index all Foreign Key columns (`user_id`, `project_id`).
    - Create **Composite Indexes** aligned with query filtering order (e.g., `(user_id, status)`).
    - Avoid single-column indexes on low-cardinality fields (e.g., `status` alone).
- [ ] **Soft Delete Implementation**:
    - Include `is_deleted BOOLEAN` and `deleted_at TIMESTAMP`.
    - Ensure all `SELECT` queries filter `WHERE is_deleted = false`.
    - Use **Partial Unique Indexes** (e.g., `WHERE is_deleted = false`) so soft-deleted rows don't prevent creating new rows with the same unique fields.

---

## 4. Authentication, Authorization & Multi-Tenancy

_Reference: [04_auth_and_multitenancy.md](file:///home/ansh/Projects/TODOApp/guides/04_auth_and_multitenancy.md)_

- [ ] **Password Security**: Hash passwords using salted algorithms (**Argon2id** or **bcrypt** with cost $\ge 10$). Never store plain text or use plain MD5/SHA-256.
- [ ] **Secure Token Storage**: Use `HttpOnly; Secure; SameSite=Strict` cookies instead of `localStorage` to guard access tokens against XSS theft.
- [ ] **Prevent IDOR & Enforce Tenant Isolation**:
    - Always enforce ownership constraints directly in SQL/ORM queries (`WHERE id = $1 AND user_id = $2 AND is_deleted = false`).
    - Never query items solely by direct resource ID from URL parameters without checking user identity.
- [ ] **Centralized Auth Middleware**: Verify JWTs/sessions in an Express/router middleware to inject `req.user` before controllers run.
- [ ] **Prevent Resource Enumeration**: Return `404 Not Found` (rather than `403 Forbidden`) when users attempt to access resources owned by another user.

---

## 5. Error Handling, Edge Cases & Pragmatic REST vs. RPC

_Reference: [05_error_handling_and_pragmatic_rest.md](file:///home/ansh/Projects/TODOApp/guides/05_error_handling_and_pragmatic_rest.md)_

- [ ] **Uniform Error Contract**: Return standardized JSON error payloads containing `code`, `message`, `timestamp`, and an array of field-level `details`.
- [ ] **Enforce Domain State Machines**: Validate valid state transitions in the Service layer (e.g., reject jumping from `ARCHIVED` directly to `IN_PROGRESS` with `422 Unprocessable Entity`).
- [ ] **Design Bulk Endpoints**: Use designated batch endpoints (`PATCH /api/v1/todos/bulk`) instead of firing multi-parallel individual HTTP calls.
    - Wrap batch updates in **Atomic Database Transactions** when all-or-nothing consistency is required.
- [ ] **Model Asynchronous Jobs**: Represent long-running background tasks (e.g., data exports) as asynchronous job resources (`POST /exports` returning `202 Accepted` + Job ID).
- [ ] **Protocol Trade-offs**: Use **Pragmatic REST** (JSON/HTTP) for external and web client endpoints; use **gRPC** (Protobuf/HTTP2) for high-performance internal microservice communication.
