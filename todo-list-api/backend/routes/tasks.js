const express = require('express');
const router = express.Router();
const { tasksDb } = require('../models/database');
const authMiddleware = require('../middleware/auth');

// GET /api/tasks - Get all tasks
router.get('/', authMiddleware, (req, res) => {
  try {
    const tasks = tasksDb.getAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const task = tasksDb.getById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTask = tasksDb.create(title.trim());
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;
    
    // Validation
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    
    if (done !== undefined && typeof done !== 'number') {
      return res.status(400).json({ error: 'Done must be 0 or 1' });
    }
    
    const updatedTask = tasksDb.update(
      id, 
      title !== undefined ? title.trim() : undefined, 
      done
    );
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = tasksDb.delete(id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
