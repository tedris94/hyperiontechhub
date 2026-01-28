import crypto from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashed = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hashed}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashed = crypto.scryptSync(password, salt, KEY_LENGTH);
  const storedHash = Buffer.from(hash, 'hex');
  return crypto.timingSafeEqual(hashed, storedHash);
}
