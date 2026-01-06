# System Architecture Diagram

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         TASK MANAGER APP                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│  FRONTEND (React)    │ ◄─────► │  BACKEND (Express)   │
│  Port: 3000          │  HTTP   │  Port: 5000          │
│                      │  JSON   │                      │
└──────────────────────┘         └──────────────────────┘
                                           │
                                           │
                                           ▼
                                  ┌──────────────┐
                                  │              │
                                  │   SQLite     │
                                  │   Database   │
                                  │              │
                                  └──────────────┘
```

## Detailed Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                              BROWSER                               │
│                        http://localhost:3000                       │
└────────────────────────────────────────────────────────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
              ┌──────────────────┐  ┌──────────────────┐
              │  Auth Component  │  │  Task Component  │
              │  (Login/Register)│  │  (CRUD)          │
              └──────────────────┘  └──────────────────┘
                         │                   │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │   API Service     │
                         │   (fetch calls)   │
                         └─────────┬─────────┘
                                   │
                                   │ HTTP Requests
                                   │ + JWT Token
                                   ▼
              ┌────────────────────────────────────────┐
              │      EXPRESS SERVER (Backend)          │
              │      http://localhost:5000/api         │
              └────────────────────────────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
              ┌──────────────────┐  ┌──────────────────┐
              │  Auth Routes     │  │  Task Routes     │
              │  /register       │  │  /tasks          │
              │  /login          │  │  /tasks/:id      │
              └──────────────────┘  └──────────────────┘
                         │                   │
                         │                   │
                         │                   ▼
                         │         ┌──────────────────┐
                         │         │  Auth Middleware │
                         │         │  (JWT Verify)    │
                         │         └──────────────────┘
                         │                   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │  Database Layer  │
                         │  (SQLite)        │
                         └──────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
              ┌──────────────────┐  ┌──────────────────┐
              │   Users Table    │  │   Tasks Table    │
              │   - id           │  │   - id           │
              │   - username     │  │   - title        │
              │   - password     │  │   - done         │
              │   - created_at   │  │   - created_at   │
              └──────────────────┘  └──────────────────┘
```

## Request Flow

### 1. User Registration Flow

```
User ──► Auth Form ──► POST /api/register ──► Validate Input
                                               │
                                               ▼
                                          Hash Password
                                               │
                                               ▼
                                          Save to DB
                                               │
                                               ▼
                                       Generate JWT Token
                                               │
                                               ▼
                                       Return Token + User
                                               │
                                               ▼
                          Store in localStorage ◄── Browser
```

### 2. Task Creation Flow

```
User ──► Task Form ──► POST /api/tasks ──► Verify JWT Token
                          + JWT Token         │
                                              ▼
                                         Token Valid?
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                                   YES                 NO
                                    │                   │
                                    ▼                   ▼
                            Validate Input        401 Unauthorized
                                    │
                                    ▼
                              Create Task
                                    │
                                    ▼
                               Save to DB
                                    │
                                    ▼
                          Return Created Task
                                    │
                                    ▼
                       Update UI ◄── Browser
```

### 3. Get Tasks Flow

```
User ──► Page Load ──► GET /api/tasks ──► Verify JWT Token
                        + JWT Token         │
                                            ▼
                                       Token Valid?
                                            │
                                  ┌─────────┴─────────┐
                                  │                   │
                                 YES                 NO
                                  │                   │
                                  ▼                   ▼
                          Query Database        401 Unauthorized
                                  │
                                  ▼
                          Return Task Array
                                  │
                                  ▼
                       Display Tasks ◄── Browser
```

## Component Hierarchy

```
App.js (Main Container)
│
├─── Header
│    ├─── Logo
│    ├─── Username Display
│    └─── Logout Button
│
├─── Auth.js (Conditional: if not logged in)
│    ├─── Login Form
│    │    ├─── Username Input
│    │    ├─── Password Input
│    │    └─── Submit Button
│    └─── Register Form
│         ├─── Username Input
│         ├─── Password Input
│         └─── Submit Button
│
└─── Task Dashboard (Conditional: if logged in)
     │
     ├─── TaskForm.js
     │    ├─── Task Input
     │    └─── Add Button
     │
     └─── TaskList.js
          └─── TaskItem.js (Multiple)
               ├─── Checkbox
               ├─── Title Display / Edit Input
               ├─── Edit Button
               ├─── Save Button
               ├─── Cancel Button
               └─── Delete Button
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                   │
└─────────────────────────────────────────────────────────┘

App.js State:
├─── isAuthenticated (boolean)
├─── user (object)
└─── refreshTrigger (number)

TaskList.js State:
├─── tasks (array)
├─── loading (boolean)
└─── error (string)

TaskItem.js State:
├─── isEditing (boolean)
├─── editTitle (string)
└─── loading (boolean)

TaskForm.js State:
├─── title (string)
├─── loading (boolean)
└─── error (string)

Auth.js State:
├─── isLogin (boolean)
├─── username (string)
├─── password (string)
├─── error (string)
└─── loading (boolean)
```

## API Endpoints Map

```
Backend Routes:
http://localhost:5000/api/
│
├─── /register (POST)
│    └─── Create new user + return token
│
├─── /login (POST)
│    └─── Authenticate user + return token
│
└─── /tasks (Protected Routes - Require JWT)
     │
     ├─── / (GET)
     │    └─── Get all tasks
     │
     ├─── /:id (GET)
     │    └─── Get single task
     │
     ├─── / (POST)
     │    └─── Create new task
     │
     ├─── /:id (PUT)
     │    └─── Update task
     │
     └─── /:id (DELETE)
          └─── Delete task
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                   JWT AUTHENTICATION                      │
└──────────────────────────────────────────────────────────┘

1. Login/Register
   User sends credentials
        │
        ▼
   Server validates
        │
        ▼
   Server generates JWT token
        │
        ▼
   Client receives token
        │
        ▼
   Store in localStorage

2. Protected Request
   Client reads token from localStorage
        │
        ▼
   Add to Authorization header
        │
        ▼
   Send request with header
        │
        ▼
   Server validates token
        │
   ├─── Valid: Process request
   │
   └─── Invalid: Return 401

3. Logout
   Client removes token from localStorage
```

## Database Schema

```
┌─────────────────────┐         ┌─────────────────────┐
│   Users Table       │         │   Tasks Table       │
├─────────────────────┤         ├─────────────────────┤
│ id (INTEGER PK)     │         │ id (INTEGER PK)     │
│ username (TEXT)     │         │ title (TEXT)        │
│ password (TEXT)     │         │ done (INTEGER)      │
│ created_at (DATE)   │         │ created_at (DATE)   │
└─────────────────────┘         └─────────────────────┘

Relationships:
- No direct foreign key (simplified MVP)
- In production: add user_id to tasks table
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│                    SECURITY FLOW                       │
└────────────────────────────────────────────────────────┘

Frontend:
├─── Token stored in localStorage
├─── Auto-attach to requests
└─── Clear on logout

Backend:
├─── CORS enabled
├─── Password hashing (bcrypt)
├─── JWT token verification
├─── Input validation
├─── SQL prepared statements
└─── Error handling (no sensitive info leaked)
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                     TECH STACK                          │
└─────────────────────────────────────────────────────────┘

Frontend:
├─── React 18
├─── Fetch API
├─── CSS3
└─── React Hooks

Backend:
├─── Node.js
├─── Express.js
├─── better-sqlite3
├─── jsonwebtoken
├─── bcryptjs
├─── cors
└─── dotenv

Database:
└─── SQLite 3
```

---

This architecture provides:
✅ Separation of concerns
✅ Scalable structure
✅ Security best practices
✅ Clear data flow
✅ Maintainable code
