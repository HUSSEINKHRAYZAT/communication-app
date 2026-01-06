import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { authService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleTaskAdded = () => {
    // Trigger a refresh of the task list
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>📝 Task Manager</h1>
        <div className="user-info">
          <span>Welcome, <strong>{user?.username}</strong>!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
