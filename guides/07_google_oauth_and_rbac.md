# Guide: Google OAuth & Role-Based Access Control (RBAC) Architecture

This guide covers the end-to-end architecture and implementation details for **Google OAuth 2.0 (Authentication)** and **Role-Based Access Control (RBAC - Authorization)** for a unified backend serving both Web SPAs and Mobile applications.

---

## 1. Mental Model: Authentication vs. Authorization

```
+-----------------------------------------------------------------------------------+
| 1. Authentication (AuthN) -> "Who are you?"                                       |
|    - Verified via Google OAuth (ID Token) & Your App's JWT                        |
|    - Handled by: `POST /auth/google` and `JwtAuthGuard`                           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 2. Authorization (AuthZ) -> "What are you allowed to do?"                          |
|    - Verified via User Roles (e.g., USER, ADMIN, MANAGER)                         |
|    - Handled by: `@Roles(...)` Decorator and `RolesGuard`                         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Unified Backend Architecture (Web & Mobile)

Whether requests come from a Web SPA (React/Vue) or Mobile app (iOS/Android/React Native/Flutter), the backend provides a single, unified contract:

```
+------+             +-------------------+             +-------------+             +-------------+             +------------+
| User |             | Client (Web / App)|             | Google Auth |             | Backend API |             | PostgreSQL |
+------+             +-------------------+             +-------------+             +-------------+             +------------+
   |                           |                              |                           |                           |
   | 1. Click "Sign in"        |                              |                           |                           |
   |-------------------------->|                              |                           |                           |
   |                           | 2. Open Google Login flow    |                           |                           |
   |                           |----------------------------->|                           |                           |
   | 3. Authenticate           |                              |                           |                           |
   |--------------------------------------------------------->|                           |                           |
   |                           | 4. Return Google idToken     |                           |                           |
   |                           |<-----------------------------|                           |                           |
   |                           |                                                          |                           |
   |                           | 5. POST /auth/google { idToken: "..." }                  |                           |
   |                           |--------------------------------------------------------->|                           |
   |                           |                                                          | 6. Verify token signature |
   |                           |                                                          |    with Google library    |
   |                           |                                                          |                           |
   |                           |                                                          | 7. Find or Create User    |
   |                           |                                                          |-------------------------->|
   |                           |                                                          |<--------------------------|
   |                           |                                                          |                           |
   |                           |                                                          | 8. Issue App JWT          |
   |                           | 9. Return { accessToken, user }                          |                           |
   |                           |<---------------------------------------------------------|                           |
   |                           |                                                          |                           |
   |                           | 10. GET /tasks (Header: Authorization: Bearer <token>)   |                           |
   |                           |--------------------------------------------------------->|                           |
   |                           |                                                          | 11. JwtAuthGuard checks   |
   |                           |                                                          |     token & RolesGuard    |
   |                           |                                                          |     checks permissions    |
   |                           | 12. 200 OK + Task Data                                   |                           |
   |                           |<---------------------------------------------------------|                           |
```

---

## 3. Pre-requisites & Setup Checklist

### A. Google Cloud Console
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/).
2. Configure **OAuth Consent Screen** (External, Scopes: `openid`, `email`, `profile`).
3. Create **OAuth Client IDs**:
   - **Web Client ID**: Set Authorized JavaScript Origins (e.g., `http://localhost:3000`, `http://localhost:5173`).
   - **iOS Client ID**: Enter your iOS Bundle ID.
   - **Android Client ID**: Enter your Package Name + SHA-1 fingerprint.
4. Save the Client ID strings.

### B. Environment Variables (`.env`)
```env
# Google OAuth Client IDs
GOOGLE_WEB_CLIENT_ID=1234567890-web.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=1234567890-ios.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=1234567890-android.apps.googleusercontent.com

# App JWT Secret
JWT_SECRET=super_secret_jwt_signing_key_change_in_production
JWT_EXPIRES_IN=7d
```

### C. Backend Dependencies
```bash
npm install google-auth-library @nestjs/jwt class-validator class-transformer
```

---

## 4. Database & Entity Definitions (MikroORM)

Following the project's **Dumb ORM & Explicit Application Authority** standards:

### A. Role Enum (`src/auth/enums/role.enum.ts`)
```typescript
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}
```

### B. User Entity (`src/user/user.entity.ts`)
```typescript
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { Role } from '../auth/enums/role.enum';

export const User = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary(),
    firstName: p.string().fieldName('first_name').length(255),
    lastName: p.string().fieldName('last_name').length(255).nullable(),
    googleId: p.string().fieldName('google_id').length(255).unique(),
    emailId: p.string().fieldName('email_id').length(255).unique(),
    role: p.enum(() => Role).fieldName('role').default(Role.USER),
    createdAt: p.datetime().fieldName('created_at').columnType('timestamptz'),
    updatedAt: p.datetime().fieldName('updated_at').columnType('timestamptz'),
    deletedAt: p
      .datetime()
      .fieldName('deleted_at')
      .columnType('timestamptz')
      .nullable(),
  },
});

export type IUser = InferEntity<typeof User>;
```

---

## 5. Google Authentication Implementation

### A. Google Login DTO (`src/auth/dto/google-login.dto.ts`)
```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
```

### B. Auth Service (`src/auth/auth.service.ts`)
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { OAuth2Client } from 'google-auth-library';
import { User, type IUser } from '../user/user.entity';
import { Role } from './enums/role.enum';
import { randomUUID } from 'crypto';

const googleClient = new OAuth2Client();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<IUser>,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(idToken: string) {
    let payload;
    try {
      // Validates Google token against all supported client IDs (Web, iOS, Android)
      const allowedAudiences = [
        process.env.GOOGLE_WEB_CLIENT_ID,
        process.env.GOOGLE_IOS_CLIENT_ID,
        process.env.GOOGLE_ANDROID_CLIENT_ID,
      ].filter((id): id is string => Boolean(id));

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: allowedAudiences,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Google token payload missing email');
    }

    const { email, sub: googleId, given_name, family_name } = payload;
    const now = new Date();

    // 1. Find user by googleId or emailId
    let user = await this.userRepository.findOne({
      $or: [{ googleId }, { emailId: email }],
    });

    if (!user) {
      // 2. Create new user with explicit application-generated values
      user = this.userRepository.create({
        id: randomUUID(),
        emailId: email,
        googleId: googleId,
        firstName: given_name || 'User',
        lastName: family_name || null,
        role: Role.USER,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });
      await this.userRepository.getEntityManager().persistAndFlush(user);
    } else if (!user.googleId) {
      // Link googleId if user originally registered via another method
      user.googleId = googleId;
      user.updatedAt = now;
      await this.userRepository.getEntityManager().flush();
    }

    // 3. Issue application JWT containing User ID and Role
    const appAccessToken = this.jwtService.sign({
      sub: user.id,
      email: user.emailId,
      role: user.role,
    });

    return {
      accessToken: appAccessToken,
      user: {
        id: user.id,
        email: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
```

### C. Auth Controller (`src/auth/auth.controller.ts`)
```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.idToken);
  }
}
```

---

## 6. Role-Based Access Control (RBAC) Implementation

### A. `@Roles(...)` Custom Decorator (`src/auth/decorators/roles.decorator.ts`)
```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### B. `@CurrentUser()` Param Decorator (`src/auth/decorators/current-user.decorator.ts`)
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  userId: string;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### C. Native JWT Auth Guard (`src/auth/guards/jwt-auth.guard.ts`)

Instead of using Passport (`@nestjs/passport` / `passport-jwt`), this native Guard directly extracts the `Bearer` token and verifies it using `@nestjs/jwt`:

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'dev_secret_key',
      });

      // Attach user object to request so @CurrentUser() and RolesGuard can access it
      request['user'] = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
```

### D. Roles Guard (`src/auth/guards/roles.guard.ts`)
```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() decorator is attached to the route/class, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource',
      );
    }

    return true;
  }
}
```

### E. Auth Module (`src/auth/auth.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { User } from '../user/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, // Makes JwtService available everywhere without re-importing
      secret: process.env.JWT_SECRET || 'dev_secret_key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
```

---

## 7. Putting It Together: Protecting Controllers

Example showing how domain endpoints use authentication, authorization, and tenant isolation without any Passport dependencies:

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard) // Protects all routes in this controller
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Any authenticated user can view their own tasks
  @Get()
  getMyTasks(@CurrentUser() user: CurrentUserPayload) {
    return this.taskService.findAllForUser(user.userId);
  }

  // Any authenticated user can create a task
  @Post()
  createTask(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.create(user.userId, dto);
  }

  // Only users with ADMIN role can delete a task
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteTask(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
```

---

## 8. Summary of Key Architectural Decisions

1. **Decoupled Identity Provider**: Google handles credential authentication and 2FA; your backend handles application sessions and authorization.
2. **Multi-Platform Support**: The backend validates Google `idToken`s across Web, iOS, and Android seamlessly using an array of allowed audiences.
3. **Declarative Authorization**: Route permissions are explicitly declared via `@Roles(...)` metadata and checked uniformly by `RolesGuard`.
4. **Tenant Isolation**: Handlers receive the verified `user.userId` via `@CurrentUser()` to enforce multi-tenancy constraints on all database queries.
