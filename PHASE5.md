# Phase 5: Real-Time Synchronization (WebSockets)

In this phase, you will write a full-duplex WebSocket communication pipeline using **Socket.io**. This will propagate modifications instantly to all active workspace participants across multiple browser screens.

---

## 1. Goal & Deliverable
- A NestJS WebSocket Gateway that authorizes clients using JWT tokens.
- Automatic workspace room subscription: when users change workspaces, the client registers to `workspace:{workspaceId}`.
- Real-time broadcasts when tasks are created, updated, or deleted.
- Frontend socket synchronization: active boards will reflect additions, status moves, and removals automatically.

---

## 2. Learning Outcomes
- Creating event-driven NestJS WebSocket Gateways.
- Authenticating Socket.io connection handshakes.
- Organizing WebSocket connection scopes using room concepts.
- React integration: maintaining persistent socket connections inside custom hooks or context scopes.

---

## 3. Expected Directory Structure Updates
```text
backend/
├── src/
│   └── ws/
│       ├── ws.gateway.ts       # Main websocket handler
│       ├── ws.module.ts
│       └── ws.guard.ts         # Handshake auth guard
frontend/
└── src/
    └── context/
        └── SocketContext.tsx   # Manages socket.io client connection
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Install Websockets in Backend
```bash
# In backend/
npm install @nestjs/websockets @nestjs/platform-socket.io
```

### Step 2: Build the Gateway Controller
Create `backend/src/ws/ws.gateway.ts`. The gateway authorizes connection events using the jwt library:
```typescript
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.auth.token || client.handshake.headers['authorization'];
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token, { secret: 'SUPER_SECRET_KEY' });
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected client: ${client.id}`);
  }

  @SubscribeMessage('join_workspace')
  handleJoinWorkspace(@MessageBody() workspaceId: string, @ConnectedSocket() client: Socket) {
    // Leave previous workspace rooms
    client.rooms.forEach((room) => {
      if (room.startsWith('workspace:')) client.leave(room);
    });
    client.join(`workspace:${workspaceId}`);
  }
}
```

### Step 3: Broadcast Updates from Controller Paths
To broadcast event alerts when tasks change, inject `WsGateway` into your `TasksService` or `TasksController` and call:
```typescript
// Inside TasksService update logic
this.wsGateway.server.to(`workspace:${workspaceId}`).emit('task_updated', updatedTask);
```

### Step 4: Implement Socket Context in Frontend
Install client dependency:
```bash
# In frontend/
npm install socket.io-client
```

Create `frontend/src/context/SocketContext.tsx` to handle the connection lifecycle:
```tsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:3000', {
        auth: { token: `Bearer ${token}` }
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
```

### Step 5: Connect Task Views to Socket Broadcasts
Inside `TaskList.tsx` or `App.tsx`:
- Emit `join_workspace` whenever the user switches workspaces.
- Set up socket listeners to synchronize state:
  ```typescript
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.on('task_updated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    });

    return () => {
      socket.off('task_updated');
    };
  }, [socket]);
  ```

---

## 5. Verification Checklist
- Open the application in two different browsers (or an incognito tab) and log in with the same account.
- Open the same workspace in both windows.
- Perform edits, create tasks, or drag columns. Confirm the updates appear instantly on the opposite screen without manually reloading.
