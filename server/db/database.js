import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'data.json');

// Initialize database structure
let db = {
  users: [],
  campaigns: [],
  assets: [],
  approvals: [],
  approval_steps: [],
  ai_generations: [],
  notifications: [],
  activity_log: [],
  _nextId: {
    users: 1,
    campaigns: 1,
    assets: 1,
    approvals: 1,
    approval_steps: 1,
    ai_generations: 1,
    notifications: 1,
    activity_log: 1
  }
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      db = JSON.parse(data);

      // Initialize _nextId if missing
      if (!db._nextId) {
        db._nextId = {};
        Object.keys(db).forEach(table => {
          if (table !== '_nextId' && Array.isArray(db[table])) {
            const maxId = db[table].length > 0 ? Math.max(...db[table].map(r => r.id || 0)) : 0;
            db._nextId[table] = maxId + 1;
          }
        });
      }
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Load database on startup
loadDatabase();

/**
 * Initialize database
 */
export function initDatabase() {
  console.log('✓ Database initialized successfully (JSON file storage)');
}

/**
 * Seed database with initial data
 */
export async function seedDatabase() {
  const existingAdmin = db.users.find(u => u.email === 'admin@adorch.local');

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    db.users.push({
      id: db._nextId.users++,
      email: 'admin@adorch.local',
      password_hash: passwordHash,
      name: 'Admin User',
      role: 'admin',
      department: 'Management',
      status: 'active',
      avatar: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    saveDatabase();

    console.log('✓ Default admin user created');
    console.log('  Email: admin@adorch.local');
    console.log('  Password: admin123');
  }
}

function getTableName(sql) {
  const match = sql.match(/(?:from|into|update|table)\s+(\w+)/i);
  return match ? match[1] : null;
}

/**
 * Query single row
 */
export function queryOne(sql, params = []) {
  const table = getTableName(sql);
  if (!table || !db[table]) return null;

  const sqlLower = sql.toLowerCase();

  // Handle COUNT(*) queries
  if (sqlLower.includes('count(*)')) {
    let data = [...db[table]];

    // Parse WHERE clause
    if (sqlLower.includes('where')) {
      const whereMatch = sql.match(/where\s+(.+?)(?:order|limit|$)/i);
      if (whereMatch && params.length > 0) {
        const whereClause = whereMatch[1].trim();

        // Simple status = ? filter
        if (whereClause.includes('status = ?')) {
          data = data.filter(row => row.status === params[0]);
        }
        // Simple type = ? filter
        else if (whereClause.includes('type = ?')) {
          data = data.filter(row => row.type === params[0]);
        }
        // SLA deadline filter (a.sla_deadline < ?)
        else if (whereClause.includes('sla_deadline') && whereClause.includes('< ?')) {
          const statusFilter = params.length > 1 ? params[1] : null;
          data = data.filter(row => {
            if (statusFilter && row.status !== 'pending') return false;
            if (!row.sla_deadline) return false;
            return new Date(row.sla_deadline) < new Date(params[0]);
          });
        }
      }
    }

    return { count: data.length };
  }

  // Generic WHERE clause support
  if (params.length > 0 && sqlLower.includes('where')) {
    const whereMatch = sqlLower.match(/where\s+(\w+)\s*=\s*\?/);
    if (whereMatch) {
      const column = whereMatch[1];
      const value = params[0];

      // Handle numeric IDs if column is 'id'
      if (column === 'id') {
        const id = typeof value === 'string' ? parseInt(value) : value;
        return db[table].find(row => row.id === id) || null;
      }

      return db[table].find(row => row[column] === value) || null;
    }
  }

  return db[table][0] || null;
}

/**
 * Query multiple rows
 */
export function queryAll(sql, params = []) {
  const table = getTableName(sql);
  if (!table || !db[table]) return [];

  return [...db[table]];
}

/**
 * Execute INSERT/UPDATE/DELETE
 */
export function execute(sql, params = []) {
  const sqlLower = sql.toLowerCase().trim();
  const table = getTableName(sql);

  if (!table) return { changes: 0, lastInsertRowid: null };

  if (sqlLower.startsWith('insert')) {
    // Extract column names
    const columnsMatch = sql.match(/\(([^)]+)\)/);
    const columns = columnsMatch ? columnsMatch[1].split(',').map(c => c.trim()) : [];

    const newId = db._nextId[table]++;
    const newRecord = { id: newId };

    columns.forEach((col, index) => {
      newRecord[col] = params[index] !== undefined ? params[index] : null;
    });

    if (!newRecord.created_at) newRecord.created_at = new Date().toISOString();
    if (!newRecord.updated_at) newRecord.updated_at = new Date().toISOString();

    db[table].push(newRecord);
    saveDatabase();

    return { lastInsertRowid: newId, changes: 1 };
  }

  if (sqlLower.startsWith('update')) {
    const id = typeof params[params.length - 1] === 'string' ? parseInt(params[params.length - 1]) : params[params.length - 1];
    const recordIndex = db[table].findIndex(r => r.id === id);

    if (recordIndex === -1) {
      console.log('UPDATE: Record not found with id:', id);
      return { changes: 0 };
    }

    const setMatch = sql.match(/set\s+(.+?)\s+where/i);
    if (!setMatch) return { changes: 0 };

    const setPairs = setMatch[1].split(',').map(s => s.trim());

    let paramIndex = 0;
    setPairs.forEach(pair => {
      const parts = pair.split('=').map(s => s.trim());
      const column = parts[0];
      const value = parts[1];

      // Check if this is a parameter placeholder (?)
      if (value && value.includes('?')) {
        if (params[paramIndex] !== undefined) {
          db[table][recordIndex][column] = params[paramIndex];
        }
        paramIndex++;
      }
    });

    db[table][recordIndex].updated_at = new Date().toISOString();
    saveDatabase();

    return { changes: 1 };
  }

  if (sqlLower.startsWith('delete')) {
    const id = typeof params[0] === 'string' ? parseInt(params[0]) : params[0];
    const initialLength = db[table].length;
    db[table] = db[table].filter(r => r.id !== id);
    saveDatabase();

    return { changes: initialLength - db[table].length };
  }

  if (sqlLower.startsWith('select') && sql.toLowerCase().includes('count(*)')) {
    let count = db[table].length;
    return { count };
  }

  return { changes: 0, lastInsertRowid: null };
}

/**
 * Transaction helper
 */
export function transaction(callback) {
  try {
    const result = callback();
    saveDatabase();
    return result;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Close database
 */
export function closeDatabase() {
  saveDatabase();
  console.log('✓ Database saved and closed');
}

export default db;
