import React, { useState } from 'react';
import { tasksService } from '../services/api';

function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleToggleDone = async () => {
    setLoading(true);
    try {
      await tasksService.updateTask(task.id, { done: task.done ? 0 : 1 });
      onTaskUpdated();
    } catch (err) {
      console.error('Error toggling task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await tasksService.updateTask(task.id, { title: editTitle });
      setIsEditing(false);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await tasksService.deleteTask(task.id);
      onTaskDeleted();
    } catch (err) {
      console.error('Error deleting task:', err);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className={`task-item ${task.done ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={!!task.done}
        onChange={handleToggleDone}
        disabled={loading}
      />
      
      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={loading}
            autoFocus
          />
        ) : (
          <>
            <div className="task-title">{task.title}</div>
            <div className="task-date">Created: {formatDate(task.created_at)}</div>
          </>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onClick={handleSaveEdit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
