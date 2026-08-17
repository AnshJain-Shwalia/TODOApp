# Module 5: Error Handling, Edge Cases & Pragmatic REST vs. RPC

Welcome to Module 5! This guide covers error handling schemas, handling complex edge cases (bulk actions, state machines), and evaluating the real-world trade-offs between **Pragmatic REST** and **RPC (Remote Procedure Call)** patterns.

---

## 1. Standardized Error Handling Schemas

Never return unpredictable error shapes (e.g. plain text strings in one endpoint and objects in another). All API responses should adhere to a **Uniform Error Contract**.

### Industry Standard Error Schema
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The request body contains validation errors",
    "timestamp": "2026-08-05T01:50:00Z",
    "details": [
      {
        "field": "due_date",
        "issue": "must be a future date in ISO-8601 format"
      },
      {
        "field": "priority",
        "issue": "must be one of: LOW, MEDIUM, HIGH, URGENT"
      }
    ]
  }
}
```

---

## 2. Handling Edge Cases in REST

### A. State Machine Transitions
Some resources have strict state lifecycles:
`PENDING` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` $\rightarrow$ `ARCHIVED`

- **RESTful Approach**: `PATCH /todos/123` with `{ "status": "IN_PROGRESS" }`.
- **Validation Rule**: In the Service layer, enforce valid transitions. Throw `422 Unprocessable Entity` if trying to move from `ARCHIVED` directly to `IN_PROGRESS` without unarchiving first.

### B. Bulk Operations
REST struggles with operations affecting multiple items at once (e.g., "Mark 50 tasks as completed").
- ❌ **Anti-pattern**: Client sends 50 parallel HTTP requests (`PATCH /todos/1`, `PATCH /todos/2`, ...).
- ✅ **Pragmatic REST Endpoint**:
  ```http
  PATCH /api/v1/todos/bulk HTTP/1.1
  Content-Type: application/json

  {
    "ids": ["uuid-1", "uuid-2", "uuid-3"],
    "action": "UPDATE_STATUS",
    "payload": { "status": "COMPLETED" }
  }
  ```

---

## 3. Pure REST vs. Pragmatic REST vs. RPC

### Why "Pure REST" (HATEOAS) is Rarely Used in Real Life
Roy Fielding's original definition of REST requires **HATEOAS** (Hypermedia As The Engine Of Application State), where responses include URLs for every available action:

```json
// PURE REST / HATEOAS Example
{
  "id": 123,
  "title": "Buy Milk",
  "status": "PENDING",
  "_links": {
    "self": { "href": "/todos/123" },
    "complete": { "href": "/todos/123/complete", "method": "POST" },
    "delete": { "href": "/todos/123", "method": "DELETE" }
  }
}
```
**Why production APIs drop HATEOAS**: It inflates JSON payload size significantly, adds serialization overhead, and client developers rarely use dynamic links—they build against static API documentation instead!

### Pragmatic REST vs. RPC Comparison

| Dimension | Pragmatic REST (GitHub, Stripe) | RPC / gRPC (Internal Microservices) |
| :--- | :--- | :--- |
| **Model** | Resource-centric (`/users`, `/todos`) | Action/Function-centric (`userService.GetUser()`) |
| **Transport** | JSON over HTTP/1.1 or HTTP/2 | Protobuf over HTTP/2 |
| **Best Used For** | Public developer APIs, Web/Mobile frontends | High-performance microservice-to-microservice communication |
| **Complex Operations** | Uses RPC-like action sub-paths when needed (`POST /todos/123/archive`) | Natural fit for procedure calls |

---

## 4. Difficult Quiz (Module 5)

Test your knowledge of API design trade-offs!

### Question 1
A client submits a bulk update request `PATCH /api/v1/todos/bulk` to mark 3 tasks as completed (`[id1, id2, id3]`).
- Task `id1` and `id2` succeed.
- Task `id3` fails because it belongs to another user.
Should the API return `200 OK` (with partial success details), `207 Multi-Status`, or `400/404` and rollback all changes? Contrast **Atomic Transactions** vs. **Partial Success**.

### Question 2
You are building an endpoint to allow users to **Export all user data to a CSV file and email it**.
Designing this as `POST /api/v1/users/me/export-data` looks RPC-style rather than resource-based. How would a strict REST purist represent this, vs. how does a pragmatic REST engineer design it?

### Question 3
An API returns `HTTP 200 OK` with the following body:
```json
{
  "status": "error",
  "code": 404,
  "message": "Todo item not found"
}
```
Why is this pattern (returning `200 OK` for business/system errors) considered an anti-pattern in HTTP API design? List two concrete problems it creates for clients and infrastructure.

### Question 4
When should a backend engineering team choose **gRPC (RPC)** over **REST (JSON/HTTP)** for internal backend services? Give two key advantages of gRPC.

---
































## Solutions & Detailed Rationale

### Solution 1
- **Option A (Atomic Transaction - Recommended for consistency)**: Wrap the bulk operation in a single database transaction (e.g. using MikroORM's `em.transactional(async (em) => { ... })` or Unit of Work automatic transactional flush). If *any* ID fails validation, rollback the entire transaction and return `404 Not Found` or `422 Unprocessable Entity`. This prevents inconsistent partial state.
- **Option B (Partial Success - `207 Multi-Status` or `200 OK` with payload)**: Return a payload listing succeeded and failed IDs:
  ```json
  { "succeeded": ["id1", "id2"], "failed": [{"id": "id3", "reason": "Not found"}] }
  ```
- **Takeaway**: Financial and state-critical APIs prefer **Atomic All-or-Nothing**. Dashboard bulk actions often use **Partial Success**.

---

### Solution 2
- **Strict REST Representation**: Create an `ExportJob` resource collection:
  - `POST /api/v1/users/me/export-jobs` (Creates a background export job resource, returns `202 Accepted` with job ID).
  - `GET /api/v1/users/me/export-jobs/job-99` (Check export job status).
- **Pragmatic REST Representation**: `POST /api/v1/users/me/export` or `POST /api/v1/exports`.
- **Takeaway**: Creating a asynchronous "Job" resource is clean REST, but pragmatic RPC endpoints are acceptable for simple trigger actions.

---

### Solution 3
1. **Breaks Infrastructure & Tooling**: API Gateways, Load Balancers, CDN caches, and monitoring tools (Datadog, CloudWatch) rely on HTTP status headers to calculate error rates. Returning `200 OK` makes monitoring tools think 100% of requests are succeeding!
2. **Client Library Complexity**: Client HTTP libraries (like `axios` or `fetch`) fail to trigger `catch()` or exception handlers automatically on non-2xx statuses, forcing frontend developers to manually parse JSON bodies on every single call just to discover if an error occurred.

---

### Solution 4
1. **Performance & Binary Serialization**: gRPC uses Protocol Buffers (Protobuf), which are binary-encoded and significantly smaller and faster to serialize/deserialize than verbose JSON text strings.
2. **Strong Typing & Code Generation**: Protobuf definitions automatically generate strictly typed client/server code stubs across different languages (Go, Java, Python, TypeScript), eliminating manual SDK writing.
