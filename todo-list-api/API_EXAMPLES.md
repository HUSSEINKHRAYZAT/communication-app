# API Response Examples

This file contains example API responses for all endpoints.

## Authentication Endpoints

### 1. Register User

**Request:**
```http
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "mypassword123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImpvaG5fZG9lIn0sImlhdCI6MTY0MTQ4MjQwMCwiZXhwIjoxNjQxNTY4ODAwfQ.example",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Username already exists"
}
```

### 2. Login User

**Request:**
```http
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "mypassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImpvaG5fZG9lIn0sImlhdCI6MTY0MTQ4MjQwMCwiZXhwIjoxNjQxNTY4ODAwfQ.example",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

## Task Endpoints (All require Authorization header)

**Authorization Header Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Get All Tasks

**Request:**
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Learn REST APIs",
    "done": 0,
    "created_at": "2026-01-06 10:30:00"
  },
  {
    "id": 2,
    "title": "Build CRUD app",
    "done": 1,
    "created_at": "2026-01-06 11:00:00"
  },
  {
    "id": 3,
    "title": "Deploy to production",
    "done": 0,
    "created_at": "2026-01-06 12:15:00"
  }
]
```

**Empty List Response (200 OK):**
```json
[]
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "No token, authorization denied"
}
```

### 4. Get Single Task

**Request:**
```http
GET /api/tasks/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": 0,
  "created_at": "2026-01-06 10:30:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

### 5. Create Task

**Request:**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Write documentation"
}
```

**Success Response (201 Created):**
```json
{
  "id": 4,
  "title": "Write documentation",
  "done": 0,
  "created_at": "2026-01-06 13:00:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Title is required"
}
```

### 6. Update Task - Title Only

**Request:**
```http
PUT /api/tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn REST APIs and GraphQL"
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Learn REST APIs and GraphQL",
  "done": 0,
  "created_at": "2026-01-06 10:30:00"
}
```

### 7. Update Task - Done Status Only

**Request:**
```http
PUT /api/tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "done": 1
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Learn REST APIs and GraphQL",
  "done": 1,
  "created_at": "2026-01-06 10:30:00"
}
```

### 8. Update Task - Both Title and Done

**Request:**
```http
PUT /api/tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Master REST APIs",
  "done": 1
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Master REST APIs",
  "done": 1,
  "created_at": "2026-01-06 10:30:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Title cannot be empty"
}
```

### 9. Delete Task

**Request:**
```http
DELETE /api/tasks/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": 1,
    "title": "Master REST APIs",
    "done": 1,
    "created_at": "2026-01-06 10:30:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

## Common Error Responses

### Invalid Token
**Status:** 401 Unauthorized
```json
{
  "error": "Token is not valid"
}
```

### Missing Token
**Status:** 401 Unauthorized
```json
{
  "error": "No token, authorization denied"
}
```

### Invalid Token Format
**Status:** 401 Unauthorized
```json
{
  "error": "Invalid token format. Use: Bearer <token>"
}
```

### Server Error
**Status:** 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

### Not Found (Invalid Route)
**Status:** 404 Not Found
```json
{
  "error": "Not found"
}
```

## Status Code Summary

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing/invalid authentication |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side errors |

## Testing Flow Example

### Complete Workflow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test1234"}'

# Response: Copy the token

# 2. Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My first task"}'

# 3. Get all tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Mark task as done
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"done":1}'

# 5. Delete task
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Field Descriptions

### User Object
```json
{
  "id": 1,              // Auto-incremented integer
  "username": "string", // Unique username, min 3 chars
  "password": "string"  // Hashed password (never returned in responses)
}
```

### Task Object
```json
{
  "id": 1,                           // Auto-incremented integer
  "title": "string",                 // Task title, required
  "done": 0,                         // 0 = not done, 1 = done
  "created_at": "2026-01-06 10:30:00" // ISO datetime string
}
```

### Token Response
```json
{
  "message": "string",   // Success message
  "token": "string",     // JWT token (valid for 24 hours)
  "user": {              // User object without password
    "id": 1,
    "username": "string"
  }
}
```

---

**Note:** All examples use placeholder tokens. In real usage, use the actual token received from login/register responses.
