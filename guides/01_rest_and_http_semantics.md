# Module 1: RESTful Architecture & HTTP Semantics

Welcome to Module 1! This guide covers the essential principles of designing clean, resource-oriented RESTful APIs.

---

## 1. Core Principles of REST

REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server protocol—almost always **HTTP**.

### Principle A: Resources over Verbs (Nouns in URIs)
In REST, everything is treated as a **resource**. URIs (Uniform Resource Identifiers) should identify *nouns*, never *actions* or *verbs*.

* ❌ **Bad (RPC-style in URI)**:
  - `GET /api/getTodos`
  - `POST /api/createTodo`
  - `POST /api/deleteTodo?id=123`
* ✅ **Good (RESTful URIs)**:
  - `GET /api/v1/todos` (Fetch all todos)
  - `POST /api/v1/todos` (Create a new todo)
  - `DELETE /api/v1/todos/123` (Delete todo #123)

### Principle B: Plural Nouns & Clean Scoping
- Always use **plural nouns** for resource collections: `/projects`, `/todos`, `/users`.
- Use nesting for natural sub-resources, but keep nesting to **at most 2 levels deep**:
  - `GET /projects/42/todos` (Fetch todos belonging to project #42)
  - `POST /projects/42/todos` (Create a todo inside project #42)
  - Avoid over-nesting like `/users/1/projects/42/todos/123/tags/5`. Flatten deep resources to direct access endpoints like `/tags/5` or `/todos/123/tags`.

---

## 2. HTTP Verbs: Safety vs. Idempotency

Understanding the HTTP method semantics is crucial for building predictable APIs.

| HTTP Method | Primary Purpose | Safe? | Idempotent? |
| :--- | :--- | :---: | :---: |
| **`GET`** | Read resource data | **Yes** | **Yes** |
| **`POST`** | Create a new resource or execute processing | No | **No** |
| **`PUT`** | Completely replace a resource (or create if non-existent with client ID) | No | **Yes** |
| **`PATCH`** | Partially update specific attributes of a resource | No | No (usually)* |
| **`DELETE`** | Remove a resource | No | **Yes** |

> 💡 **Definitions**:
> - **Safe**: Reading data without altering server state. Calling a safe endpoint 100 times changes nothing.
> - **Idempotent**: Executing the request 1 time vs. 100 times results in the **exact same final server state**.

### Example: `PUT` vs `PATCH`
- **`PUT /todos/123`** expects the *entire* resource payload. Missing fields will be overwritten with defaults or `null`.
  ```json
  // Request
  { "title": "Buy Milk", "status": "PENDING", "priority": "LOW" }
  ```
- **`PATCH /todos/123`** updates *only* the fields provided in the payload, leaving others untouched.
  ```json
  // Request (only updating status)
  { "status": "COMPLETED" }
  ```

---

## 3. HTTP Status Codes & Their Semantics

Never return `200 OK` for an error response! Use the appropriate HTTP status category:

### 2xx Success
- **`200 OK`**: Successful `GET`, `PATCH`, or `PUT`. Returns resource data.
- **`201 Created`**: Successful `POST` creating a resource. Includes `Location` header pointing to new resource.
- **`204 No Content`**: Successful request where no response body is needed (commonly used for `DELETE`).

### 4xx Client Errors
- **`400 Bad Request`**: Request payload is syntactically invalid (e.g., malformed JSON or missing required fields).
- **`401 Unauthorized`**: Authentication is missing or invalid token.
- **`403 Forbidden`**: Authenticated, but user lacks permission to perform action on this resource.
- **`404 Not Found`**: Resource endpoint or ID does not exist.
- **`409 Conflict`**: Conflict with current server state (e.g., registering an email that already exists).
- **`422 Unprocessable Entity`**: Request format is valid JSON, but business logic semantic validation failed (e.g. `due_date` is in the past).

### 5xx Server Errors
- **`500 Internal Server Error`**: Unexpected server-side bug or unhandled exception.

---

## 4. Real-World API Examples

### Creating a Todo
```http
POST /api/v1/todos HTTP/1.1
Host: api.todoapp.com
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "title": "Finish Backend Specs",
  "priority": "HIGH",
  "project_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

**Response (`201 Created`)**:
```http
HTTP/1.1 201 Created
Location: /api/v1/todos/7c9e6679-7425-40de-944b-e07fc1f90ae7
Content-Type: application/json

{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "title": "Finish Backend Specs",
  "status": "PENDING",
  "priority": "HIGH",
  "project_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "created_at": "2026-08-05T01:50:00Z"
}
```

---

## 5. Difficult Quiz (Module 1)

Test your understanding! Try answering these without looking at the solutions below.

### Question 1
A backend developer creates an endpoint `POST /api/v1/todos/123/increment-views` to increment a task view counter by 1 every time it's hit. Is this operation idempotent? Why or why not? What would happen if a client retries this request 3 times due to network failure?

### Question 2
You have a `PATCH /api/v1/todos/123` endpoint. The body contains `{ "tags": ["urgent"] }`.
- Scenario A: The backend replaces the current tags with `["urgent"]`.
- Scenario B: The backend appends `"urgent"` to the existing array of tags.
Which scenario maintains idempotency and which breaks it? Explain why.

### Question 3
A user submits a request `DELETE /api/v1/todos/999`. Task `999` does not exist in the database.
What HTTP status code should the API return on the **first** request? If the client immediately sends the **second** identical `DELETE /api/v1/todos/999` request, what status code should be returned, and is `DELETE` still considered idempotent in this system?

### Question 4
An authenticated user attempts to update a TODO item using `PATCH /api/v1/todos/456`. Task `456` exists in the database, but it belongs to another user. Which status code is best practice to return: `401`, `403`, or `404`? Provide security rationale for your choice.

---
































## Solutions & Detailed Rationale

### Solution 1
- **Is it Idempotent?**: **No**.
- **Explanation**: `POST /api/v1/todos/123/increment-views` modifies server state dynamically with every execution (incrementing a counter $N \rightarrow N+1$). Calling it 3 times causes the counter to increase by +3 instead of +1. If a client retries due to a dropped network response, the counter will be incorrectly incremented multiple times.

---

### Solution 2
- **Scenario A (`replaces array`)**: **Idempotent**. If you send `{ "tags": ["urgent"] }` 1 time or 10 times, the final state of the task's tags will always be `["urgent"]`.
- **Scenario B (`appends to array`)**: **Non-Idempotent**. Sending `{ "tags": ["urgent"] }` 3 times results in `["urgent", "urgent", "urgent"]` (or a set growing with duplicates).
- **Takeaway**: When designing `PATCH` endpoints for collections/arrays, explicitly decide whether the operation is a *replacement* (idempotent) or an *append/mutation operation* (non-idempotent action).

---

### Solution 3
- **First Request**: `404 Not Found` (or `204 No Content` if the API treats deletion as target state achieved).
- **Second Request**: `404 Not Found` (or `204 No Content`).
- **Is it Idempotent?**: **Yes**. Idempotency means the *final state of the server* after $N$ requests is identical to the state after 1 request (the item does not exist in the database). Both requests result in the task not being in the database. Returning `404 Not Found` on subsequent calls is completely compatible with idempotency.

---

### Solution 4
- **Recommended Status Code**: **`404 Not Found`** (or `403 Forbidden` if explicit access control policies are publicly known).
- **Security Rationale**: Returning `403 Forbidden` reveals to an attacker that task `456` actually exists in the database (exposing ID existence). Returning `404 Not Found` prevents resource enumeration/scanning by making non-existent resources and unauthorized resources indistinguishable.
