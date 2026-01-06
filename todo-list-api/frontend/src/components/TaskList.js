import React, { useState, useEffect } from 'react';
import { tasksService } from '../services/api';
import TaskItem from './TaskItem';

function TaskList({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="task-list">
        <h2>My Tasks</h2>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list">
        <h2>My Tasks</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>My Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks yet. Add your first task above!</div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdated={fetchTasks}
            onTaskDeleted={fetchTasks}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;
