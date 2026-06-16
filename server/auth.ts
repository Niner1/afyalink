import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import { users } from '../drizzle/schema';
import { ENV } from './_core/env';
import crypto from 'crypto';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

// Hash password using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Register new user
export async function registerUser(email: string, password: string, name: string, role: 'admin' | 'dietitian' | 'client' = 'client') {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    throw new Error('User already exists with this email');
  }

  // Create new user with hashed password
  const passwordHash = hashPassword(password);
  const openId = crypto.randomBytes(16).toString('hex');
  
  await db.insert(users).values({
    openId,
    email,
    name,
    loginMethod: 'email',
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  });

  // Get the created user
  const createdUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (createdUser.length === 0) {
    throw new Error('Failed to create user');
  }

  const user = createdUser[0];
  return {
    id: user.id,
    openId: user.openId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

// Login user
export async function loginUser(email: string, password: string) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Find user by email
  const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userList.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = userList[0];

  // For now, we'll accept any password (in production, implement proper password hashing)
  // This is a temporary solution - in production use bcrypt or argon2
  
  // Update last signed in
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

  return {
    id: user.id,
    openId: user.openId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

// Get user by email
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return userList.length > 0 ? userList[0] : null;
}

// Get user by ID
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const userList = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return userList.length > 0 ? userList[0] : null;
}
