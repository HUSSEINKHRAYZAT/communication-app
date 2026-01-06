# Real-time Chat Application - Event Flow

## 🚀 Quick Start

**Frontend:** http://localhost:5174  
**Backend:** http://localhost:3002

```bash
# Start both servers
./start.sh

# Or manually:
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

---

## 📡 WebSocket Event Flow

### 1. User Joins Chat

**Client Side:**
```
User enters username → Click "Join" → Connect to WebSocket server
→ Emit 'join' event with {username}
```

**Server Side:**
```
Receive 'join' event → Validate username → Store user in Map
→ Emit 'system' (welcome) to user
→ Broadcast 'system' (user joined) to others
→ Emit 'users' (updated list) to everyone
```

**All Clients:**
```
Receive 'system' event → Display "User joined" message
Receive 'users' event → Update online count & user list
```

---

### 2. User Sends Message

**Client Side:**
```
User types message → Press Send → Emit 'message' event with {text}
```

**Server Side:**
```
Receive 'message' event → Get user info from Map
→ Create message object {id, username, text, timestamp}
→ Broadcast 'message' to ALL clients (including sender)
```

**All Clients:**
```
Receive 'message' event → Add message to messages array
→ Re-render chat → Auto-scroll to bottom
```

---

### 3. User Typing

**Client Side:**
```
User starts typing → Emit 'typing' with {isTyping: true}
User stops typing (1s timeout) → Emit 'typing' with {isTyping: false}
```

**Server Side:**
```
Receive 'typing' event → Get user info
→ Broadcast 'typing' to OTHER clients (not sender)
```

**Other Clients:**
```
Receive 'typing' event → Add/remove username from typing set
→ Display "Username is typing..." indicator
```

---

### 4. User Disconnects

**Client Side:**
```
User closes tab/window → WebSocket disconnect
```

**Server Side:**
```
Detect 'disconnect' event → Get user from Map → Delete user
→ Broadcast 'system' (user left) to remaining clients
→ Emit 'users' (updated list) to remaining clients
```

**Remaining Clients:**
```
Receive 'system' event → Display "User left" message
Receive 'users' event → Update online count & user list
```

---

### 5. Connection Lost & Reconnect

**Client Side:**
```
Network issue → WebSocket disconnect detected
→ Socket.IO auto-reconnection starts
→ Try reconnect every 1 second (up to 5 attempts)
→ On reconnect success → Auto re-emit 'join' with saved username
```

**Server Side:**
```
Receive new connection → Wait for 'join' event
→ Process as new user join (same flow as #1)
```

**Client:**
```
Receive 'system' (welcome) → Display "Reconnected" to user
→ Continue chatting seamlessly
```

---

## 🔄 Complete Message Flow Diagram

```
┌─────────────┐                  ┌─────────────┐                  ┌─────────────┐
│   Client 1  │                  │   Server    │                  │   Client 2  │
│   (Alice)   │                  │  (Node.js)  │                  │    (Bob)    │
└─────────────┘                  └─────────────┘                  └─────────────┘
       │                                │                                │
       │  join {username: "Alice"}      │                                │
       │─────────────────────────────────>                               │
       │                                │                                │
       │  ← system "Welcome Alice"      │                                │
       │<─────────────────────────────  │                                │
       │                                │  system "Alice joined" ───────>│
       │                                │                                │
       │                                │  ← join {username: "Bob"}      │
       │                                │<───────────────────────────────│
       │                                │                                │
       │  ← system "Bob joined"         │  system "Welcome Bob" ───────>│
       │<─────────────────────────────  │                                │
       │                                │                                │
       │  ← users {count: 2, users:[]}  │  users {count: 2, users:[]} ─>│
       │<─────────────────────────────  │                                │
       │                                │                                │
       │  message {text: "Hi Bob!"}     │                                │
       │─────────────────────────────────>                               │
       │                                │                                │
       │  ← message {username: "Alice"} │  message {username: "Alice"} ─>│
       │<─────────────────────────────  │                                │
       │                                │                                │
       │                                │  ← message {text: "Hey!"}      │
       │                                │<───────────────────────────────│
       │                                │                                │
       │  ← message {username: "Bob"}   │  message {username: "Bob"} ───>│
       │<─────────────────────────────  │                                │
```

---

## 📋 Event Reference

### Client → Server Events

| Event     | Data              | Purpose                    |
|-----------|-------------------|----------------------------|
| `join`    | `{username}`      | User joins chat            |
| `message` | `{text}`          | Send chat message          |
| `typing`  | `{isTyping}`      | Update typing status       |

### Server → Client Events

| Event     | Data                              | Purpose                        |
|-----------|-----------------------------------|--------------------------------|
| `message` | `{id, username, text, timestamp}` | Chat message from user         |
| `system`  | `{text, timestamp}`               | System notification            |
| `users`   | `{count, users: []}`              | Online users update            |
| `typing`  | `{username, isTyping}`            | Another user typing status     |
| `error`   | `{message}`                       | Error notification             |

---

## 🔑 Key Implementation Details

**Backend (server.js):**
- Uses `Map()` to store connected users (key: socket.id, value: user data)
- `io.emit()` broadcasts to ALL clients
- `socket.broadcast.emit()` broadcasts to all EXCEPT sender
- `socket.emit()` sends to specific client only

**Frontend (App.jsx):**
- `socket.on()` listens for events from server
- `socket.emit()` sends events to server
- Uses React state to manage messages, users, connection status
- Auto-reconnection configured in Socket.IO client options

---

## 🎯 Testing Flow

1. Open 3 browser tabs at http://localhost:5174
2. Tab 1: Join as "Alice" → See welcome message
3. Tab 2: Join as "Bob" → All tabs see "Bob joined"
4. Tab 1: Send "Hello!" → All tabs see message instantly
5. Tab 3: Start typing → Tabs 1 & 2 see "typing..."
6. Close Tab 3 → Tabs 1 & 2 see "User left"

---

**Built with React, Express, and Socket.IO**
