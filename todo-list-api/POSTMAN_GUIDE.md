# Mini CRUD + Auth - Postman Collection

This document provides example requests you can import into Postman or Insomnia.

## Setup

1. Create a new environment in Postman
2. Add variable: `baseUrl` = `http://localhost:5000/api`
3. Add variable: `token` = (will be set automatically from login)

## 1. Register User

```
POST {{baseUrl}}/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "test1234"
}
```

Expected Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

## 2. Login User

```
POST {{baseUrl}}/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "test1234"
}
```

Expected Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

**Note**: Copy the token and use it in the Authorization header for the following requests.

## 3. Get All Tasks

```
GET {{baseUrl}}/tasks
Authorization: Bearer {{token}}
```

Expected Response (200):
```json
[
  {
    "id": 1,
    "title": "Learn REST APIs",
    "done": 0,
    "created_at": "2026-01-06 10:30:00"
  }
]
```

## 4. Create Task

```
POST {{baseUrl}}/tasks
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Learn Node.js"
}
```

Expected Response (201):
```json
{
  "id": 2,
  "title": "Learn Node.js",
  "done": 0,
  "created_at": "2026-01-06 11:00:00"
}
```

## 5. Get Single Task

```
GET {{baseUrl}}/tasks/1
Authorization: Bearer {{token}}
```

Expected Response (200):
```json
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": 0,
  "created_at": "2026-01-06 10:30:00"
}
```

## 6. Update Task (Title)

```
PUT {{baseUrl}}/tasks/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Learn REST APIs - Updated"
}
```

Expected Response (200):
```json
{
  "id": 1,
  "title": "Learn REST APIs - Updated",
  "done": 0,
  "created_at": "2026-01-06 10:30:00"
}
```

## 7. Update Task (Mark as Done)

```
PUT {{baseUrl}}/tasks/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "done": 1
}
```

Expected Response (200):
```json
{
  "id": 1,
  "title": "Learn REST APIs - Updated",
  "done": 1,
  "created_at": "2026-01-06 10:30:00"
}
```

## 8. Update Task (Both Title and Done)

```
PUT {{baseUrl}}/tasks/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Complete REST API Tutorial",
  "done": 1
}
```

Expected Response (200):
```json
{
  "id": 1,
  "title": "Complete REST API Tutorial",
  "done": 1,
  "created_at": "2026-01-06 10:30:00"
}
```

## 9. Delete Task

```
DELETE {{baseUrl}}/tasks/1
Authorization: Bearer {{token}}
```

Expected Response (200):
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": 1,
    "title": "Complete REST API Tutorial",
    "done": 1,
    "created_at": "2026-01-06 10:30:00"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "No token, authorization denied"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

## Testing Workflow

1. **Register** a new user
2. **Login** with the credentials (save the token)
3. **Create** a few tasks
4. **Get All** tasks to see them
5. **Update** a task (mark as done or change title)
6. **Get Single** task to verify the update
7. **Delete** a task
8. **Get All** tasks again to confirm deletion

## Tips

- In Postman, you can use Tests tab to automatically save the token:
  ```javascript
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
  ```

- Check the status codes match the expected responses
- Verify error handling by sending invalid requests
- Test authentication by omitting the token header
