const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, '../database.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tasks database functions
const tasksDb = {
  // Get all tasks
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
    return stmt.all();
  },

  // Get task by ID
  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id);
  },

  // Create a new task
  create: (title) => {
    const stmt = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)');
    const info = stmt.run(title);
    return tasksDb.getById(info.lastInsertRowid);
  },

  // Update a task
  update: (id, title, done) => {
    const task = tasksDb.getById(id);
    if (!task) return null;

    const newTitle = title !== undefined ? title : task.title;
    const newDone = done !== undefined ? done : task.done;

    const stmt = db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?');
    stmt.run(newTitle, newDone, id);
    return tasksDb.getById(id);
  },

  // Delete a task
  delete: (id) => {
    const task = tasksDb.getById(id);
    if (!task) return null;

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
    return task;
  }
};

// Users database functions
const usersDb = {
  // Get user by username
  getByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // Create a new user
  create: (username, hashedPassword) => {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(username, hashedPassword);
    return { id: info.lastInsertRowid, username };
  }
};

module.exports = { tasksDb, usersDb, db };
