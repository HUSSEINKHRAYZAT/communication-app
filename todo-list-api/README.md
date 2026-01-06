# Mini CRUD + Auth - Task Manager

A full-stack task management application with CRUD operations and JWT authentication.

![Task Manager](https://img.shields.io/badge/Status-Complete-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![React](https://img.shields.io/badge/React-v18-blue)
![SQLite](https://img.shields.io/badge/SQLite-v3-blue)

## 📋 Project Overview

This project demonstrates a complete REST API implementation with:
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ JWT-based authentication
- ✅ SQLite database for persistent storage
- ✅ React frontend with state management
- ✅ Error handling and loading states
- ✅ Proper HTTP status codes

## 🎯 Features

### Backend Features
- **Authentication System**
  - User registration with password hashing (bcrypt)
  - User login with JWT token generation
  - Protected routes with JWT middleware
  
- **Task Management**
  - Create new tasks
  - List all tasks
  - Update task (title and completion status)
  - Delete tasks
  - Persistent storage with SQLite

### Frontend Features
- **User Interface**
  - Login/Register forms
  - Task list with real-time updates
  - Add new tasks
  - Mark tasks as done/undone
  - Edit task titles
  - Delete tasks with confirmation
  
- **UX Enhancements**
  - Loading states during API calls
  - Error messages for failed operations
  - Responsive design
  - Beautiful gradient UI

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Middleware**: CORS, dotenv

### Frontend
- **Library**: React 18
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS3

## 📁 Project Structure

```
a/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   └── database.js          # SQLite database setup and queries
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── tasks.js             # Task CRUD routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server setup
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Auth.js          # Login/Register component
    │   │   ├── TaskForm.js      # Add task component
    │   │   ├── TaskItem.js      # Individual task component
    │   │   └── TaskList.js      # Task list component
    │   ├── services/
    │   │   └── api.js           # API service functions
    │   ├── App.js               # Main app component
    │   ├── index.css            # Global styles
    │   └── index.js             # React entry point
    └── package.json
```

## 🚀 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

Response (201 Created):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

### Task Endpoints (Protected - Requires JWT Token)

All task endpoints require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Tasks
```http
GET /api/tasks

Response (200 OK):
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
  }
]
```

#### Get Single Task
```http
GET /api/tasks/:id

Response (200 OK):
{
  "id": 1,
  "title": "Learn REST APIs",
  "done": 0,
  "created_at": "2026-01-06 10:30:00"
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "New task"
}

Response (201 Created):
{
  "id": 3,
  "title": "New task",
  "done": 0,
  "created_at": "2026-01-06 12:00:00"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated task title",
  "done": 1
}

Response (200 OK):
{
  "id": 1,
  "title": "Updated task title",
  "done": 1,
  "created_at": "2026-01-06 10:30:00"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id

Response (200 OK):
{
  "message": "Task deleted successfully",
  "task": {
    "id": 1,
    "title": "Learn REST APIs",
    "done": 0,
    "created_at": "2026-01-06 10:30:00"
  }
}
```

### HTTP Status Codes Used
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST (creation)
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created) and verify settings:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Register a new account**
   - Open http://localhost:3000
   - Click "Register"
   - Enter username (min 3 characters) and password (min 6 characters)

2. **Login**
   - Enter your credentials
   - You'll receive a JWT token (stored in localStorage)

3. **Manage Tasks**
   - Add new tasks using the input form
   - Click checkbox to mark tasks as done/undone
   - Click "Edit" to modify task title
   - Click "Delete" to remove a task

4. **Logout**
   - Click the "Logout" button to clear your session

## 🧪 Testing with Postman/Insomnia

### Step 1: Register/Login
```
POST http://localhost:5000/api/register
Body (JSON):
{
  "username": "testuser",
  "password": "test1234"
}
```

Copy the token from the response.

### Step 2: Use Token for Protected Routes
Add to Headers:
```
Authorization: Bearer <your_token_here>
```

### Step 3: Test CRUD Operations
```
GET    http://localhost:5000/api/tasks
POST   http://localhost:5000/api/tasks
       Body: { "title": "Test task" }
PUT    http://localhost:5000/api/tasks/1
       Body: { "done": 1 }
DELETE http://localhost:5000/api/tasks/1
```

## 📸 Screenshots

### Login/Register Screen
- Clean authentication interface
- Form validation
- Error handling

### Task Management Dashboard
- Task list with completion status
- Add new tasks
- Edit/Delete functionality
- Real-time updates

## 🎓 Learning Outcomes

This project teaches:
1. **REST API Design** - Proper endpoint structure and HTTP methods
2. **Request/Response Flow** - Understanding how client-server communication works
3. **JSON** - Working with JSON data format
4. **HTTP Status Codes** - Using appropriate status codes
5. **Authentication** - JWT-based authentication and authorization
6. **Database Operations** - CRUD with SQLite
7. **Frontend-Backend Integration** - Connecting React to Express API
8. **State Management** - Managing application state with React hooks
9. **Error Handling** - Proper error handling on both frontend and backend
10. **Security** - Password hashing, token-based auth, protected routes

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS configuration

## 🚀 Future Enhancements

Possible improvements:
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Task priority levels
- [ ] User profile management
- [ ] Task search and filter
- [ ] Task sharing between users
- [ ] Dark mode
- [ ] Mobile app version

## 📝 Notes

- The SQLite database file (`database.db`) is automatically created on first run
- JWT tokens expire after 24 hours
- Frontend uses proxy to avoid CORS issues in development

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📄 License

ISC

## 👨‍💻 Author

Built as a learning project to understand REST APIs, CRUD operations, and authentication.

---

**Happy Coding! 🎉**
