# Phase 4: User Authentication & Security

In this phase, you will support multi-tenant accounts by implementing registration, login, and secure token authentication. You will restrict API access so users can only access their own workspaces and tasks.

---

## 1. Goal & Deliverable
- A backend user registration and JWT-based authentication system.
- Secure API endpoints wrapped inside guards.
- Register & Login panels styled with Chakra UI.
- React Context wrapping the client state, managing authentication status, and configuring global headers for REST requests.

---

## 2. Learning Outcomes
- Hashing passwords using `bcrypt` and generating secure JSON Web Tokens (JWT).
- Integrating Passport.js strategies inside NestJS module files.
- Restricting routes with NestJS Guards and extracting logged-in user identifiers from tokens.
- Creating dynamic Auth Context providers and protecting frontend page views in React.

---

## 3. Expected Directory Structure Updates
```text
backend/
├── src/
│   ├── auth/
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   └── users/
│       ├── user.entity.ts
│       ├── users.module.ts
│       └── users.service.ts
frontend/
└── src/
    ├── context/
    │   └── AuthContext.tsx    # React Context Provider for sessions
    └── components/
        ├── Login.tsx          # Login UI Card
        └── Register.tsx       # Signup UI Card
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Install Auth Dependencies in Backend
```bash
# In backend/
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### Step 2: Write User Entity and Database Relations
Create `backend/src/users/user.entity.ts` representing the user schema:
- Must contain `id`, `email` (unique), `passwordHash`, `fullName`, and `createdAt`.
- Establish relationships:
  - `Workspace` entity links to `User` (1-to-many relationship).
  - Modify `Workspace` to belong to a `User`.

### Step 3: Implement Auth Service and Strategy
- Write `jwt.strategy.ts` to validate JWTs in authorization headers:
  ```typescript
  import { ExtractJwt, Strategy } from 'passport-jwt';
  import { PassportStrategy } from '@nestjs/passport';
  import { Injectable } from '@nestjs/common';

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'SUPER_SECRET_KEY', // Swap out for environment variables
      });
    }

    async validate(payload: any) {
      return { userId: payload.sub, email: payload.email };
    }
  }
  ```
- Develop login paths that verify the database password hash using `bcrypt.compare()` and return an access token:
  ```typescript
  return { access_token: this.jwtService.sign(payload) };
  ```

### Step 4: Secure Tasks and Workspaces Endpoints
Annotate controllers with `@UseGuards(JwtAuthGuard)` to prevent unauthorized API requests:
```typescript
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  @Post()
  create(@Body() dto: CreateWorkspaceDto, @Request() req) {
    // Inject user reference from JWT token payload
    return this.workspacesService.create(dto, req.user.userId);
  }
}
```

### Step 5: Implement Auth Context in Frontend
Create `frontend/src/context/AuthContext.tsx` to save session states. On load, read token from `localStorage` and fetch profile:
```tsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Validate token and fetch user details
      fetch('http://localhost:3000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : handleLogout())
        .then(data => data && setUser(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 5. Verification Checklist
- Access `/tasks` without Authorization header. Confirm API yields `401 Unauthorized`.
- Register an account, log in, and secure the returned token.
- Pass token in bearer headers. Verify you can CRUD workspaces and tasks successfully.
- Log in with a second user account. Ensure you cannot view the first user's workspaces.
