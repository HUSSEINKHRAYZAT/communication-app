import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SOCKET_URL = 'http://localhost:3002';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // Rejoin if we were already joined
      if (isJoined && username) {
        newSocket.emit('join', { username });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Message events
    newSocket.on('message', (data) => {
      setMessages((prev) => [...prev, { type: 'message', ...data }]);
    });

    newSocket.on('system', (data) => {
      setMessages((prev) => [...prev, { type: 'system', ...data }]);
    });

    newSocket.on('users', (data) => {
      setOnlineUsers(data.count);
      setUserList(data.users || []);
    });

    newSocket.on('typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => new Set([...prev, data.username]));
      } else {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
      }
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data.message);
      alert(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Handle join
  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.connect();
      socket.emit('join', { username: username.trim() });
      setIsJoined(true);
    }
  };

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket && isConnected) {
      socket.emit('message', { text: message.trim() });
      setMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        socket.emit('typing', { isTyping: false });
        setIsTyping(false);
      }
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket || !isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { isTyping: true });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { isTyping: false });
    }, 1000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="join-container">
        <div className="join-card">
          <h1>💬 Real-time Chat</h1>
          <p>Join the conversation</p>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button type="submit" disabled={!username.trim()}>
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>💬 Chat Room</h2>
          <span className="username-badge">@{username}</span>
        </div>
        <div className="header-right">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="online-count">
            <span className="online-icon">👥</span>
            {onlineUsers} online
          </div>
        </div>
      </div>

      <div className="chat-body">
        <div className="messages-section">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet. Start the conversation! 👋</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`message ${msg.type} ${
                    msg.username === username ? 'own-message' : ''
                  }`}
                >
                  {msg.type === 'message' ? (
                    <>
                      <div className="message-header">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </>
                  ) : (
                    <div className="system-text">
                      <span>ℹ️</span> {msg.text}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {typingUsers.size > 0 && (
            <div className="typing-indicator">
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
              disabled={!isConnected}
            />
            <button type="submit" disabled={!message.trim() || !isConnected}>
              Send
            </button>
          </form>
        </div>

        <div className="sidebar">
          <h3>Online Users ({onlineUsers})</h3>
          <div className="user-list">
            {userList.map((user) => (
              <div
                key={user.id}
                className={`user-item ${user.username === username ? 'current-user' : ''}`}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.username}</span>
                {user.username === username && <span className="you-badge">(you)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
