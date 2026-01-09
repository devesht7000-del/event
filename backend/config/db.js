import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database
const db = new Database(path.join(__dirname, '../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        date TEXT,
        time TEXT,
        category TEXT,
        price REAL,
        total_seats INTEGER,
        available_seats INTEGER,
        image TEXT,
        helpline TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Create bookings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        num_tickets INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'confirmed',
        booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

    // Create tickets table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        ticket_number TEXT UNIQUE NOT NULL,
        qr_code TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    console.log('✅ SQLite Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
}

// Helper function to run queries
export function query(sql, params = []) {
  try {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return db.prepare(sql).all(params);
    } else {
      return db.prepare(sql).run(params);
    }
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Helper for transactions
export function transaction(callback) {
  const trans = db.transaction(callback);
  return trans();
}

export { db };
