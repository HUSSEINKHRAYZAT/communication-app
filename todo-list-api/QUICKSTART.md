# Quick Start Guide

## Installation

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
App runs on: http://localhost:3000

## First Steps

1. Open http://localhost:3000 in your browser
2. Click "Register" and create an account
3. You'll be automatically logged in
4. Start adding tasks!

## Common Commands

### Backend
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production

## Troubleshooting

**Port already in use?**
- Backend: Change PORT in `.env`
- Frontend: Set PORT=3001 before `npm start`

**Database errors?**
- Delete `database.db` file and restart backend

**Token expired?**
- Logout and login again

**CORS errors?**
- Make sure backend is running on port 5000
- Check frontend package.json has correct proxy

## Testing API with curl

Register:
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

Get Tasks (replace TOKEN):
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Create Task (replace TOKEN):
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My new task"}'
```
