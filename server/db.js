import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = process.env.DATABASE_PATH || './data/spotdrop.db';

// Ensure data directory exists
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const db = new DatabaseSync(path.resolve(DB_PATH));

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    created_at TEXT NOT NULL,
    source TEXT DEFAULT 'direct',
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT,
    status TEXT DEFAULT 'waitlisted',
    notes TEXT DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
  CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist(referral_code);
  CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
`);

/**
 * Generate a clean, human-readable unique referral code (e.g. SPOT-A8K4X)
 * Uses characters without ambiguous glyphs (no 0/O, 1/I)
 */
const REFERRAL_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export function generateReferralCode() {
  let result = 'SPOT-';
  for (let i = 0; i < 5; i++) {
    result += REFERRAL_CHARS.charAt(Math.floor(Math.random() * REFERRAL_CHARS.length));
  }
  return result;
}

export function findByEmail(email) {
  if (!email) return null;
  const stmt = db.prepare('SELECT * FROM waitlist WHERE email = ? COLLATE NOCASE LIMIT 1');
  const rows = stmt.all(email.trim().toLowerCase());
  return rows.length > 0 ? rows[0] : null;
}

export function findByReferralCode(code) {
  if (!code) return null;
  const stmt = db.prepare('SELECT * FROM waitlist WHERE referral_code = ? LIMIT 1');
  const rows = stmt.all(code.trim().toUpperCase());
  return rows.length > 0 ? rows[0] : null;
}

export function createSignup({ email, source = 'direct', referredBy = null }) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Ensure unique referral code
  let referralCode = generateReferralCode();
  let attempts = 0;
  while (findByReferralCode(referralCode) && attempts < 10) {
    referralCode = generateReferralCode();
    attempts++;
  }

  const createdAt = new Date().toISOString();
  const normalizedSource = (source || 'direct').trim().toLowerCase().slice(0, 50);
  const normalizedReferredBy = referredBy ? referredBy.trim().toUpperCase().slice(0, 30) : null;

  const stmt = db.prepare(`
    INSERT INTO waitlist (email, created_at, source, referral_code, referred_by, status, notes)
    VALUES (?, ?, ?, ?, ?, 'waitlisted', '')
  `);

  stmt.run(normalizedEmail, createdAt, normalizedSource, referralCode, normalizedReferredBy);

  return findByEmail(normalizedEmail);
}

export function getStats() {
  const now = new Date();
  
  // ISO date strings for today and 7 days ago
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const totalStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist');
  const total = totalStmt.all()[0].count;

  const todayStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE created_at >= ?');
  const today = todayStmt.all(todayStart)[0].count;

  const weekStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE created_at >= ?');
  const thisWeek = weekStmt.all(weekStart)[0].count;

  const refStmt = db.prepare("SELECT COUNT(*) as count FROM waitlist WHERE referred_by IS NOT NULL AND referred_by != ''");
  const referrals = refStmt.all()[0].count;

  return { total, today, thisWeek, referrals };
}

export function getSignups({ search = '', source = '', status = '', sort = 'newest', page = 1, limit = 25 }) {
  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    conditions.push('(email LIKE ? OR referral_code LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  if (source && source.trim()) {
    conditions.push('source = ?');
    params.push(source.trim().toLowerCase());
  }

  if (status && status.trim()) {
    conditions.push('status = ?');
    params.push(status.trim().toLowerCase());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';

  // Count total matching records
  const countSql = `SELECT COUNT(*) as total FROM waitlist ${whereClause}`;
  const countStmt = db.prepare(countSql);
  const total = countStmt.all(...params)[0].total;

  // Fetch paginated slice
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 25));
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (parsedPage - 1) * parsedLimit;

  const dataSql = `SELECT * FROM waitlist ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
  const dataStmt = db.prepare(dataSql);
  const signups = dataStmt.all(...params, parsedLimit, offset);

  return {
    signups,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit) || 1,
  };
}

export function updateStatus(id, newStatus) {
  const allowed = ['waitlisted', 'invited', 'joined', 'inactive'];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid status. Allowed values: ${allowed.join(', ')}`);
  }

  const stmt = db.prepare('UPDATE waitlist SET status = ? WHERE id = ?');
  stmt.run(newStatus, id);

  const fetchStmt = db.prepare('SELECT * FROM waitlist WHERE id = ?');
  const rows = fetchStmt.all(id);
  return rows.length > 0 ? rows[0] : null;
}

export function updateNotes(id, notes) {
  const safeNotes = (notes || '').slice(0, 500);
  const stmt = db.prepare('UPDATE waitlist SET notes = ? WHERE id = ?');
  stmt.run(safeNotes, id);

  const fetchStmt = db.prepare('SELECT * FROM waitlist WHERE id = ?');
  const rows = fetchStmt.all(id);
  return rows.length > 0 ? rows[0] : null;
}

export function getAllForExport() {
  const stmt = db.prepare('SELECT email, created_at, source, referral_code, referred_by, status, notes FROM waitlist ORDER BY created_at DESC');
  return stmt.all();
}
