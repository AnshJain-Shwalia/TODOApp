# Module 4: Authentication, Authorization & Multi-Tenancy

Welcome to Module 4! This guide covers secure password handling, JWT authentication, multi-tenancy authorization, and preventing security flaws like IDOR (Insecure Direct Object References).

---

## 1. Authentication Basics: Passwords & Tokens

### A. Password Hashing (Never Store Plain Text!)
Never store user passwords in plain text or use fast cryptographic hash functions like MD5 or SHA-256 (which are vulnerable to GPU rainbow table attacks).
- **Use Salted Password Hashes**: Use adaptive hashing algorithms designed for passwords: **Argon2id** or **bcrypt** (with a work factor / cost of 10+).

```typescript
import bcrypt from 'bcrypt';

// Password Registration / Storage
const saltRounds = 12;
const passwordHash = await bcrypt.hash(userPlainPassword, saltRounds);

// Password Verification at Login
const isValid = await bcrypt.compare(loginInputPassword, storedPasswordHash);
```

### B. Session Tokens vs. JWTs (JSON Web Tokens)

| Feature | Stateful Sessions (Database / Redis) | Stateless JWTs |
| :--- | :--- | :--- |
| **Storage** | Session ID in HTTP-only Cookie; full session stored in Redis/DB | Encoded JSON signed with server secret stored on Client |
| **Revocation** | Instant (delete session key from Redis) | Difficult (valid until token expiration unless blocklist maintained) |
| **Scalability** | Requires central memory store (Redis) | Scalable across server nodes (no DB lookup needed to verify signature) |

---

## 2. Multi-Tenancy Isolation & IDOR Vulnerabilities

### What is IDOR (Insecure Direct Object Reference)?
An IDOR vulnerability occurs when an API accepts a resource identifier (e.g. `/todos/555`) from a client and fetches that resource from the database **without verifying that the resource belongs to the currently authenticated user**.

### ❌ Vulnerable Implementation (IDOR Bug)
```typescript
// VULNERABLE CONTROLLER / SERVICE
async function getTodoById(req: Request, res: Response) {
  const todoId = req.params.id; // User inputs /todos/555
  
  // BUG: Fetches item purely by ID regardless of owner!
  // In raw SQL: SELECT * FROM todos WHERE id = $1
  const todo = await em.findOne(Todo, { id: todoId });
  
  if (!todo) return res.status(404).json({ error: 'Not found' });
  return res.json(todo); // Attacker can read ANY user's todo!
}
```

### ✅ Secure Implementation (Tenant Isolated)
```typescript
async function getTodoById(req: Request, res: Response) {
  const todoId = req.params.id;
  const currentUserId = req.user.id; // From verified Auth Middleware!
  
  // SECURE (MikroORM): Enforces ownership constraint directly in query criteria!
  const todo = await em.findOne(Todo, {
    id: todoId,
    user: currentUserId,
    isDeleted: false,
  });
  
  // Equivalent SQL:
  // SELECT * FROM todos WHERE id = $1 AND user_id = $2 AND is_deleted = false
  
  if (!todo) return res.status(404).json({ error: 'Task not found' });
  return res.json(todo);
}
```

---

## 3. Auth Middleware Pattern

Authentication logic should be centralized in a **Middleware** component that runs before protected routes.

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']; // "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Attach decoded user payload to request object
    req.user = user; 
    next(); // Proceed to controller handler
  });
}
```

---

## 4. Difficult Quiz (Module 4)

Test your security knowledge!

### Question 1
An attacker registers an account on your app and calls `DELETE /api/v1/projects/888`. Project `888` belongs to another user.
The endpoint code executes:
```sql
DELETE FROM projects WHERE id = '888';
```
The database deletes project `888` and returns `204 No Content`.
What security vulnerability was exploited here, what HTTP status code should have been returned instead, and how do you fix the SQL statement?

### Question 2
Why is storing JWT access tokens in browser `localStorage` susceptible to **XSS (Cross-Site Scripting)** attacks, and what is the security advantage of storing session tokens in **`HttpOnly; Secure; SameSite=Strict` Cookies**?

### Question 3
Suppose a user changes their password because their account was compromised. If your system uses **purely stateless JWT tokens** with a 7-day expiration time, can the attacker still use their existing stolen JWT token to access the user's account? How do production systems mitigate this?

### Question 4
What is the difference between returning `401 Unauthorized` vs. `403 Forbidden`? Give an example scenario for each.

---
































## Solutions & Detailed Rationale

### Solution 1
- **Vulnerability**: **IDOR (Insecure Direct Object Reference)**. The application authorized the user to hit the delete endpoint, but failed to authorize ownership of object `888`.
- **Status Code**: Should return `404 Not Found` (or `403 Forbidden`).
- **SQL Fix**:
  ```sql
  DELETE FROM projects WHERE id = $1 AND user_id = $2;
  ```
  Check the affected row count. If `rowCount === 0`, return `404 Not Found`.

---

### Solution 2
- **`localStorage` & XSS**: Any malicious third-party JavaScript snippet or compromised NPM package executing on your frontend page can read `localStorage.getItem('token')` and send the token to an attacker's server.
- **`HttpOnly` Cookies**: Cookies marked with `HttpOnly` **cannot be accessed by JavaScript** (`document.cookie` cannot read them). Browsers automatically attach them to HTTP requests, completely protecting the token from client-side script theft via XSS.

---

### Solution 3
- **Stolen JWT Problem**: **Yes**, the attacker can continue using the stolen token until it expires in 7 days! Stateless JWT signatures are verified mathematically without consulting a server database on every request.
- **Mitigation Strategies**:
  1. **Short-Lived Access Tokens (e.g. 15 mins) + Refresh Tokens**: Store refresh tokens in database/Redis so revoking the refresh token invalidates access upon refresh.
  2. **Token Blocklist / Revocation List in Redis**: Maintain a Redis key-value store of revoked JWT IDs (`jti`) or user token epoch timestamps.

---

### Solution 4
- **`401 Unauthorized`**: Authentication credentials are missing or invalid.
  - *Example*: Request has no `Authorization` header or an expired JWT.
- **`403 Forbidden`**: Authentication is valid, but the user does not have permission for the requested action.
  - *Example*: A authenticated "Standard User" attempts to access an endpoint reserved for "Admin Users" (`POST /admin/purge-system`).
