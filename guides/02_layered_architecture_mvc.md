# Module 2: Layered Architecture & MVC

Welcome to Module 2! This guide covers how to organize backend code maintainably using **Layered Architecture** (Controller - Service - Repository pattern).

---

## 1. The 3-Tier Layered Pattern

In production backend applications, mixing HTTP handling, business logic, and SQL queries in a single file leads to unmaintainable "spaghetti code." Instead, we divide responsibilities into 3 distinct layers:

```
 HTTP Request ──> [ Controller / Router ]
                         │  (Request parsing, DTO validation, HTTP status codes)
                         ▼
                  [ Service Layer ]
                         │  (Business rules, domain validation, state transitions)
                         ▼
                  [ Repository / DAL ]
                         │  (Database queries, SQL/ORM execution)
                         ▼
                      Database
```

### Layer Responsibilities Breakdown

| Layer | Primary Duty | What it DOES | What it MUST NOT DO |
| :--- | :--- | :--- | :--- |
| **1. Controller (Router)** | HTTP Transport Layer | Reads HTTP body/params, validates DTO formats, maps errors to HTTP status codes (`400`, `404`, `500`). | No SQL queries, no complex business logic decisions. |
| **2. Service Layer** | Core Business Logic | Enforces domain rules (e.g., state machine checks, calculating due date offsets, sending notifications). | No HTTP request/response objects (`req`, `res`), no raw database connection management. |
| **3. Repository (DAL)** | Data Access Layer | Executes database queries (SQL / ORM), mapping database rows to domain models. | No HTTP logic, no validation of HTTP request tokens. |

---

## 2. Request Data Flow & DTOs

### What is a DTO (Data Transfer Object)?
A **DTO** defines the exact shape of data sent over the network.
- **`CreateTodoDTO`**: Fields required to create a task (e.g., `title`, `priority`, `due_date`).
- **`TodoResponseDTO`**: Public fields returned to the client (excludes sensitive database internals or private keys).

---

## 3. Code Example: Clean Layered Implementation

Here is how a task creation request flows cleanly through the three layers (in clean TypeScript/JavaScript):

### 1. Controller Layer (`TodoController.ts`)
```typescript
import { Request, Response } from 'express';
import { TodoService } from './TodoService';

export class TodoController {
  constructor(private todoService: TodoService) {}

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id; // Extracted from Auth Middleware
      const dto = req.body;       // e.g. { title, priority, project_id }

      // 1. Basic HTTP level validation
      if (!dto.title || dto.title.trim() === '') {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      // 2. Pass clean data to Service layer
      const newTodo = await this.todoService.createTask(userId, dto);

      // 3. Return HTTP response
      res.status(201).json(newTodo);
    } catch (error) {
      if (error.message === 'PROJECT_NOT_FOUND') {
        res.status(404).json({ error: 'Project does not exist' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
```

### 2. Service Layer (`TodoService.ts`)
```typescript
import { TodoRepository } from './TodoRepository';
import { ProjectRepository } from './ProjectRepository';

export class TodoService {
  constructor(
    private todoRepo: TodoRepository,
    private projectRepo: ProjectRepository
  ) {}

  async createTask(userId: string, data: any) {
    // 1. Business Logic Rule: Check if assigned project exists & belongs to user
    if (data.project_id) {
      const project = await this.projectRepo.findById(data.project_id);
      if (!project || project.user_id !== userId) {
        throw new Error('PROJECT_NOT_FOUND');
      }
    }

    // 2. Business Logic Rule: Default priority if unspecified
    const priority = data.priority || 'MEDIUM';

    // 3. Delegate database persistence to Repository layer
    return await this.todoRepo.create({
      user_id: userId,
      title: data.title,
      priority: priority,
      project_id: data.project_id || null,
      status: 'PENDING'
    });
  }
}
```

### 3. Repository Layer (`TodoRepository.ts`)
```typescript
import { Database } from '../db';

export class TodoRepository {
  constructor(private db: Database) {}

  async create(taskData: any) {
    const query = `
      INSERT INTO todos (user_id, title, priority, project_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [taskData.user_id, taskData.title, taskData.priority, taskData.project_id, taskData.status];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
}
```

---

## 4. Difficult Quiz (Module 2)

Test your architectural intuition!

### Question 1
A developer places the following code inside a `TodoService` method:
```typescript
if (!req.headers['authorization']) {
  return res.status(401).send('Unauthorized');
}
```
Which architectural principles are violated here, and why does this make unit testing the `TodoService` difficult?

### Question 2
Suppose you want to add a feature where completing a task (`status = COMPLETED`) sends a real-time WebSocket notification and increments a metric counter in Prometheus. 
Which layer (`Controller`, `Service`, or `Repository`) should trigger these side effects? Explain why.

### Question 3
A junior developer writes a SQL query directly inside a Controller endpoint:
`db.query('SELECT * FROM todos WHERE user_id = ' + req.params.userId)`
Name **two major problems** with this approach—one related to security and one related to software architecture.

### Question 4
Why should the `Repository` layer return database entities/objects rather than sending HTTP responses directly? What testing advantage does this separation provide?

---
































## Solutions & Detailed Rationale

### Solution 1
- **Violations**:
  1. **Transport Layer Leakage**: The Service layer is accepting Express HTTP objects (`req`, `res`). The service layer should be completely agnostic of the transport mechanism (HTTP, gRPC, CLI, WebSockets).
  2. **Violation of Single Responsibility Principle**: Auth header checking is an HTTP concern belonging to Middleware or Controllers, not core business domain logic.
- **Testing Impact**: You cannot unit test `TodoService` without mocking HTTP request/response objects.

---

### Solution 2
- **Correct Layer**: **Service Layer**.
- **Rationale**: Completing a task and triggering notifications/metrics is a **business domain workflow**. The Repository layer should only care about persisting data to the database, and the Controller layer only cares about receiving the HTTP request and returning the HTTP response. Putting this orchestration in the Service layer ensures that if a task is completed via an automated background job or a CLI script, the same notifications and metrics will still be triggered.

---

### Solution 3
1. **Security Vulnerability (SQL Injection)**: String concatenation (`+ req.params.userId`) allows an attacker to inject arbitrary SQL statements into the database query. Parameterized queries (`$1`) must always be used.
2. **Architectural Violation (Coupling Data Access to Controller)**: The Controller is directly coupled to database query logic. If you change the database schema or switch ORMs, you have to modify Controller code instead of isolating changes to the Repository layer.

---

### Solution 4
- **Rationale**: Returning raw domain data objects allows the Service layer to combine, transform, or filter data from multiple repositories before deciding what to return.
- **Testing Advantage**: It enables **Mocking / Stubbing**. You can mock the Repository in unit tests to return fake database objects without needing a live running database instance, allowing fast unit test execution.
