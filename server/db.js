import path from 'node:path';
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DEFAULT_SQLITE_PATH = isVercel ? '/tmp/spotdrop.db' : './data/spotdrop.db';
const DB_PATH = process.env.DATABASE_PATH || DEFAULT_SQLITE_PATH;
const JSON_FALLBACK_PATH = isVercel ? '/tmp/spotdrop.json' : './data/spotdrop.json';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const REFERRAL_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateReferralCode() {
  let result = 'SPOT-';
  for (let i = 0; i < 5; i++) {
    result += REFERRAL_CHARS.charAt(Math.floor(Math.random() * REFERRAL_CHARS.length));
  }
  return result;
}

function ensureDirSafe(filePath) {
  try {
    const dir = path.dirname(path.resolve(filePath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn(`[Spotdrop DB] Directory creation bypassed for ${filePath}:`, err.message);
    return false;
  }
}

/* ===================================================================
   ADAPTER 1: SUPABASE POSTGRESQL (PRODUCTION SERVERLESS RECOMMENDED)
   =================================================================== */
function initSupabaseAdapter(url, key) {
  console.info('[Spotdrop DB] Initializing Supabase cloud adapter for persistent storage.');
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  return {
    type: 'supabase',
    async findByEmail(email) {
      if (!email) return null;
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .ilike('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[Spotdrop DB] Supabase findByEmail error:', error);
      }
      return data || null;
    },

    async findByReferralCode(code) {
      if (!code) return null;
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('referral_code', code.trim().toUpperCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[Spotdrop DB] Supabase findByReferralCode error:', error);
      }
      return data || null;
    },

    async createSignup({ email, source = 'direct', referredBy = null }) {
      const normalizedEmail = email.trim().toLowerCase();
      let referralCode = generateReferralCode();
      let attempts = 0;

      while (attempts < 5) {
        const existing = await this.findByReferralCode(referralCode);
        if (!existing) break;
        referralCode = generateReferralCode();
        attempts++;
      }

      const normalizedSource = (source || 'direct').trim().toLowerCase().slice(0, 50);
      const normalizedReferredBy = referredBy ? referredBy.trim().toUpperCase().slice(0, 30) : null;

      const record = {
        email: normalizedEmail,
        created_at: new Date().toISOString(),
        source: normalizedSource,
        referral_code: referralCode,
        referred_by: normalizedReferredBy,
        status: 'waitlisted',
        notes: '',
      };

      const { data, error } = await supabase
        .from('waitlist')
        .insert([record])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique violation - already exists
          return await this.findByEmail(normalizedEmail);
        }
        console.error('[Spotdrop DB] Supabase createSignup error:', error);
        throw error;
      }

      return data;
    },

    async getStats() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      try {
        const [totalRes, todayRes, weekRes, refRes] = await Promise.all([
          supabase.from('waitlist').select('*', { count: 'exact', head: true }),
          supabase.from('waitlist').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
          supabase.from('waitlist').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
          supabase.from('waitlist').select('*', { count: 'exact', head: true }).not('referred_by', 'is', null).neq('referred_by', ''),
        ]);

        return {
          total: totalRes.count || 0,
          today: todayRes.count || 0,
          thisWeek: weekRes.count || 0,
          referrals: refRes.count || 0,
        };
      } catch (err) {
        console.error('[Spotdrop DB] Supabase stats error:', err);
        return { total: 0, today: 0, thisWeek: 0, referrals: 0 };
      }
    },

    async getSignups({ search = '', source = '', status = '', sort = 'newest', page = 1, limit = 25 }) {
      try {
        let query = supabase.from('waitlist').select('*', { count: 'exact' });

        if (search && search.trim()) {
          const term = `%${search.trim()}%`;
          query = query.or(`email.ilike.${term},referral_code.ilike.${term}`);
        }

        if (source && source.trim()) {
          query = query.eq('source', source.trim().toLowerCase());
        }

        if (status && status.trim()) {
          query = query.eq('status', status.trim().toLowerCase());
        }

        const ascending = sort === 'oldest';
        query = query.order('created_at', { ascending });

        const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 25));
        const parsedPage = Math.max(1, parseInt(page, 10) || 1);
        const offset = (parsedPage - 1) * parsedLimit;

        query = query.range(offset, offset + parsedLimit - 1);

        const { data, count, error } = await query;
        if (error) throw error;

        return {
          signups: data || [],
          total: count || 0,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil((count || 0) / parsedLimit) || 1,
        };
      } catch (err) {
        console.error('[Spotdrop DB] Supabase getSignups error:', err);
        return { signups: [], total: 0, page: 1, limit, totalPages: 1 };
      }
    },

    async updateStatus(id, newStatus) {
      const allowed = ['waitlisted', 'invited', 'joined', 'inactive'];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid status. Allowed values: ${allowed.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('waitlist')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateNotes(id, notes) {
      const { data, error } = await supabase
        .from('waitlist')
        .update({ notes: (notes || '').slice(0, 500) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getAllForExport() {
      const { data, error } = await supabase
        .from('waitlist')
        .select('email, created_at, source, referral_code, referred_by, status, notes')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  };
}

/* ===================================================================
   ADAPTER 2: NATIVE SQLITE (LOCAL DEV & TRADITIONAL NODE SERVER)
   =================================================================== */
function initSqliteAdapter(targetPath, DatabaseSync) {
  ensureDirSafe(targetPath);
  const db = new DatabaseSync(path.resolve(targetPath));

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

  return {
    type: 'sqlite',
    async findByEmail(email) {
      if (!email) return null;
      const stmt = db.prepare('SELECT * FROM waitlist WHERE email = ? COLLATE NOCASE LIMIT 1');
      const rows = stmt.all(email.trim().toLowerCase());
      return rows.length > 0 ? rows[0] : null;
    },
    async findByReferralCode(code) {
      if (!code) return null;
      const stmt = db.prepare('SELECT * FROM waitlist WHERE referral_code = ? LIMIT 1');
      const rows = stmt.all(code.trim().toUpperCase());
      return rows.length > 0 ? rows[0] : null;
    },
    async createSignup({ email, source = 'direct', referredBy = null }) {
      const normalizedEmail = email.trim().toLowerCase();
      let referralCode = generateReferralCode();
      let attempts = 0;
      while ((await this.findByReferralCode(referralCode)) && attempts < 10) {
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
      return await this.findByEmail(normalizedEmail);
    },
    async getStats() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const totalStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist');
      const total = totalStmt.all()[0]?.count || 0;

      const todayStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE created_at >= ?');
      const today = todayStmt.all(todayStart)[0]?.count || 0;

      const weekStmt = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE created_at >= ?');
      const thisWeek = weekStmt.all(weekStart)[0]?.count || 0;

      const refStmt = db.prepare("SELECT COUNT(*) as count FROM waitlist WHERE referred_by IS NOT NULL AND referred_by != ''");
      const referrals = refStmt.all()[0]?.count || 0;

      return { total, today, thisWeek, referrals };
    },
    async getSignups({ search = '', source = '', status = '', sort = 'newest', page = 1, limit = 25 }) {
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

      const countSql = `SELECT COUNT(*) as total FROM waitlist ${whereClause}`;
      const countStmt = db.prepare(countSql);
      const total = countStmt.all(...params)[0]?.total || 0;

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
    },
    async updateStatus(id, newStatus) {
      const allowed = ['waitlisted', 'invited', 'joined', 'inactive'];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid status. Allowed values: ${allowed.join(', ')}`);
      }
      const stmt = db.prepare('UPDATE waitlist SET status = ? WHERE id = ?');
      stmt.run(newStatus, id);
      const fetchStmt = db.prepare('SELECT * FROM waitlist WHERE id = ?');
      const rows = fetchStmt.all(id);
      return rows.length > 0 ? rows[0] : null;
    },
    async updateNotes(id, notes) {
      const safeNotes = (notes || '').slice(0, 500);
      const stmt = db.prepare('UPDATE waitlist SET notes = ? WHERE id = ?');
      stmt.run(safeNotes, id);
      const fetchStmt = db.prepare('SELECT * FROM waitlist WHERE id = ?');
      const rows = fetchStmt.all(id);
      return rows.length > 0 ? rows[0] : null;
    },
    async getAllForExport() {
      const stmt = db.prepare('SELECT email, created_at, source, referral_code, referred_by, status, notes FROM waitlist ORDER BY created_at DESC');
      return stmt.all();
    },
  };
}

/* ===================================================================
   ADAPTER 3: FILE-BACKED JSON STORE (UNIVERSAL ZERO-DEPENDENCY FALLBACK)
   =================================================================== */
function initJsonAdapter(targetPath) {
  ensureDirSafe(targetPath);
  let signups = [];
  let nextId = 1;

  try {
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        signups = data;
        nextId = (signups.reduce((max, s) => Math.max(max, s.id || 0), 0) || 0) + 1;
      }
    }
  } catch (err) {
    console.warn('[Spotdrop DB] Could not read JSON store:', err.message);
  }

  function persist() {
    try {
      ensureDirSafe(targetPath);
      fs.writeFileSync(targetPath, JSON.stringify(signups, null, 2), 'utf8');
    } catch (err) {
      console.warn('[Spotdrop DB] JSON store persist failed:', err.message);
    }
  }

  return {
    type: 'json',
    async findByEmail(email) {
      if (!email) return null;
      const lower = email.trim().toLowerCase();
      return signups.find((s) => s.email.toLowerCase() === lower) || null;
    },
    async findByReferralCode(code) {
      if (!code) return null;
      const upper = code.trim().toUpperCase();
      return signups.find((s) => s.referral_code?.toUpperCase() === upper) || null;
    },
    async createSignup({ email, source = 'direct', referredBy = null }) {
      const normalizedEmail = email.trim().toLowerCase();
      let referralCode = generateReferralCode();
      let attempts = 0;
      while ((await this.findByReferralCode(referralCode)) && attempts < 10) {
        referralCode = generateReferralCode();
        attempts++;
      }

      const newRecord = {
        id: nextId++,
        email: normalizedEmail,
        created_at: new Date().toISOString(),
        source: (source || 'direct').trim().toLowerCase().slice(0, 50),
        referral_code: referralCode,
        referred_by: referredBy ? referredBy.trim().toUpperCase().slice(0, 30) : null,
        status: 'waitlisted',
        notes: '',
      };

      signups.push(newRecord);
      persist();
      return newRecord;
    },
    async getStats() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const total = signups.length;
      const today = signups.filter((s) => s.created_at >= todayStart).length;
      const thisWeek = signups.filter((s) => s.created_at >= weekStart).length;
      const referrals = signups.filter((s) => Boolean(s.referred_by)).length;

      return { total, today, thisWeek, referrals };
    },
    async getSignups({ search = '', source = '', status = '', sort = 'newest', page = 1, limit = 25 }) {
      let filtered = [...signups];

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (s) => s.email.toLowerCase().includes(q) || s.referral_code.toLowerCase().includes(q)
        );
      }

      if (source && source.trim()) {
        const src = source.trim().toLowerCase();
        filtered = filtered.filter((s) => (s.source || '').toLowerCase() === src);
      }

      if (status && status.trim()) {
        const st = status.trim().toLowerCase();
        filtered = filtered.filter((s) => (s.status || '').toLowerCase() === st);
      }

      if (sort === 'oldest') {
        filtered.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
      } else {
        filtered.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      }

      const total = filtered.length;
      const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 25));
      const parsedPage = Math.max(1, parseInt(page, 10) || 1);
      const offset = (parsedPage - 1) * parsedLimit;

      const slice = filtered.slice(offset, offset + parsedLimit);

      return {
        signups: slice,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1,
      };
    },
    async updateStatus(id, newStatus) {
      const allowed = ['waitlisted', 'invited', 'joined', 'inactive'];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid status. Allowed values: ${allowed.join(', ')}`);
      }
      const record = signups.find((s) => s.id === Number(id));
      if (!record) return null;
      record.status = newStatus;
      persist();
      return record;
    },
    async updateNotes(id, notes) {
      const record = signups.find((s) => s.id === Number(id));
      if (!record) return null;
      record.notes = (notes || '').slice(0, 500);
      persist();
      return record;
    },
    async getAllForExport() {
      return [...signups].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    },
  };
}

// Storage adapter initialization
let storageAdapter = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    storageAdapter = initSupabaseAdapter(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.error('[Spotdrop DB] Failed to init Supabase adapter:', err);
  }
}

if (!storageAdapter) {
  try {
    let sqliteModule;
    try {
      const mod = await import('node:sqlite');
      if (mod && mod.DatabaseSync) {
        sqliteModule = mod;
      }
    } catch {
      // node:sqlite not supported
    }

    if (sqliteModule && sqliteModule.DatabaseSync) {
      try {
        storageAdapter = initSqliteAdapter(DB_PATH, sqliteModule.DatabaseSync);
      } catch (err) {
        console.warn(`[Spotdrop DB] Failed to init SQLite at ${DB_PATH} (${err.message}). Retrying in /tmp/spotdrop.db`);
        try {
          storageAdapter = initSqliteAdapter('/tmp/spotdrop.db', sqliteModule.DatabaseSync);
        } catch (err2) {
          console.warn(`[Spotdrop DB] SQLite in /tmp failed (${err2.message}). Falling back to JSON adapter.`);
          storageAdapter = initJsonAdapter(JSON_FALLBACK_PATH);
        }
      }
    } else {
      storageAdapter = initJsonAdapter(JSON_FALLBACK_PATH);
    }
  } catch (err) {
    console.error('[Spotdrop DB] Fallback initialization error:', err);
    storageAdapter = initJsonAdapter(JSON_FALLBACK_PATH);
  }
}

/* ===================================================================
   EXPORTED INTERFACE (UNIFIED & FULLY ASYNC COMPATIBLE)
   =================================================================== */

export async function findByEmail(email) {
  return await storageAdapter.findByEmail(email);
}

export async function findByReferralCode(code) {
  return await storageAdapter.findByReferralCode(code);
}

export async function createSignup(data) {
  return await storageAdapter.createSignup(data);
}

export async function getStats() {
  return await storageAdapter.getStats();
}

export async function getSignups(params) {
  return await storageAdapter.getSignups(params);
}

export async function updateStatus(id, newStatus) {
  return await storageAdapter.updateStatus(id, newStatus);
}

export async function updateNotes(id, notes) {
  return await storageAdapter.updateNotes(id, notes);
}

export async function getAllForExport() {
  return await storageAdapter.getAllForExport();
}
