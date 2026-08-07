# Module 3: Database Modeling & Relationships

Welcome to Module 3! This guide covers relational database schema design, entity relationships, primary/foreign keys, indexing strategies, and soft delete patterns.

---

## 1. Primary Keys: UUID vs. Auto-Incrementing IDs

Selecting the right Primary Key (PK) strategy is a fundamental data modeling decision.

| Feature | Auto-Incrementing Integer (`INT` / `BIGINT`) | UUID (`v4` / `v7`) |
| :--- | :--- | :--- |
| **Storage Size** | 4 or 8 bytes (compact) | 16 bytes (larger index overhead) |
| **Read/Write Performance** | Sequential, fast B-tree index inserts | Random inserts (UUID v4) can cause B-tree fragmentation* |
| **Security / Enumeration** | ❌ Vulnerable to enumeration (`/todos/1`, `/todos/2`) | ✅ Unguessable (`/todos/9b1deb4d-...`) |
| **Distributed Generation** | Requires centralized DB sequence generator | ✅ Generated client-side or microservice-side without DB collisions |

> 💡 **Best Practice**: Use **UUIDs** for client-exposed IDs to prevent resource enumeration attacks, or **UUID v7** (time-ordered UUIDs) which combine time-sequential sorting with randomness!

---

## 2. Entity Relationships & Cardinality

### A. One-to-Many (1:N)
A single user owns multiple projects; a project contains multiple tasks.
- **Implementation**: Place the **Foreign Key (FK)** on the "Many" side table.
  ```sql
  CREATE TABLE todos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL
  );
  ```

### B. Many-to-Many (N:M)
A task can have multiple tags (`#urgent`, `#work`), and a tag can be attached to multiple tasks.
- **Implementation**: Requires a **Join Table (Pivot Table)** with a composite primary key.
  ```sql
  CREATE TABLE tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      name VARCHAR(50) NOT NULL
  );

  -- Join Table
  CREATE TABLE todo_tags (
      todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
      tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (todo_id, tag_id)
  );
  ```

---

## 3. Database Indexes & Performance

An **Index** is a data structure (usually a B-Tree) that speeds up data retrieval queries at the cost of slightly slower write operations (`INSERT`/`UPDATE`).

### Rule of Thumb for Indexes:
1. Always index **Foreign Key** columns (`user_id`, `project_id`).
2. Index columns frequently used in `WHERE`, `ORDER BY`, and `JOIN` clauses.
3. Use **Composite Indexes** for multi-column queries (e.g. searching user tasks by status):
   ```sql
   -- Speeds up queries like: SELECT * FROM todos WHERE user_id = '...' AND status = 'PENDING';
   CREATE INDEX idx_todos_user_status ON todos(user_id, status);
   ```

---

## 4. Soft Delete vs. Hard Delete

- **Hard Delete**: `DELETE FROM todos WHERE id = '...';` (Data is permanently erased).
- **Soft Delete**: `UPDATE todos SET is_deleted = true, deleted_at = NOW() WHERE id = '...';` (Data remains in DB for recovery/audit).

### Soft Delete Schema Pattern:
```sql
ALTER TABLE todos ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE todos ADD COLUMN deleted_at TIMESTAMP NULL;
```
> ⚠️ **Caution**: Every `SELECT` query must explicitly include `WHERE is_deleted = false` to avoid leaking trashed items!

---

## 5. Difficult Quiz (Module 3)

Test your data modeling knowledge!

### Question 1
You have a `users` table and a `projects` table. The `projects` table has a foreign key `user_id REFERENCES users(id) ON DELETE CASCADE`.
What happens when a row in `users` is deleted? What would happen if the constraint was instead `ON DELETE SET NULL` or `ON DELETE RESTRICT`?

### Question 2
Consider the join table `todo_tags` with `PRIMARY KEY (todo_id, tag_id)`.
- Query A: `SELECT * FROM todo_tags WHERE todo_id = '123';`
- Query B: `SELECT * FROM todo_tags WHERE tag_id = '456';`
Will both queries use the composite primary key index efficiently in PostgreSQL/MySQL? If not, which query will trigger a full table scan and how do you fix it?

### Question 3
A database table has 10 million `todos`. A unique constraint exists on `tags(user_id, name)` so a user cannot create two tags with the same name.
If you implement **Soft Delete** on the `tags` table (`is_deleted` column), what problem occurs when a user soft-deletes tag `"Work"` and then tries to create a new tag named `"Work"`? How do you solve this in SQL?

### Question 4
Why is creating a single-column index on `status` alone (`CREATE INDEX idx_status ON todos(status);`) usually useless in a multi-tenant application with millions of tasks?

---
































## Solutions & Detailed Rationale

### Solution 1
- **`ON DELETE CASCADE`**: Deleting a user automatically deletes all projects created by that user.
- **`ON DELETE SET NULL`**: Deleting a user sets `user_id = NULL` on their projects (requires `user_id` column to be nullable).
- **`ON DELETE RESTRICT`**: The database **blocks/refuses** the deletion of the user if they still own any projects, throwing a Foreign Key Violation error.

---

### Solution 2
- **Query A (`WHERE todo_id = '123'`)**: **Fast (Uses PK Index)**. Composite index `(todo_id, tag_id)` indexes by the left-most column first (`todo_id`).
- **Query B (`WHERE tag_id = '456'`)**: **Slow (Full Table Scan)**. B-Tree composite indexes cannot search by the second column (`tag_id`) alone without inspecting the first column.
- **Fix**: Create a secondary index on `tag_id`: `CREATE INDEX idx_todo_tags_tag_id ON todo_tags(tag_id);`.

---

### Solution 3
- **The Problem**: The database unique constraint on `(user_id, name)` will see the old soft-deleted row (`"Work"`, `is_deleted = true`) and reject inserting a new `"Work"` row with a duplicate key error!
- **Solution (Partial Unique Index)**: Replace the standard unique constraint with a **filtered partial index**:
  ```sql
  CREATE UNIQUE INDEX idx_unique_active_tag_name 
  ON tags(user_id, name) 
  WHERE is_deleted = false;
  ```
  This allows duplicate names as long as previous entries have `is_deleted = true`.

---

### Solution 4
- **Low Cardinality**: `status` has very low cardinality (only 3–4 discrete values: `PENDING`, `IN_PROGRESS`, `COMPLETED`). A database query planner will reject using a single-column index on low-cardinality fields because scanning the table is faster.
- **Multi-tenancy Isolation**: All user queries filter by `user_id` first! A composite index on `(user_id, status)` is required so the database can instantly narrow down to that specific user's tasks first.
