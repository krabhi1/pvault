import crypto from 'crypto';

// Configuration
const algorithm = 'aes-256-gcm';
const keyLength = 32; // AES-256 requires a 32-byte key
const ivLength = 12; // Recommended length for AES-GCM

function deriveKey(password: string, salt: Buffer): Buffer {
  // @ts-ignore
  return crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');
}

export function encrypt(text: string, password: string) {
  const salt = crypto.randomBytes(16); // Generate random salt
  const key = deriveKey(password, salt); // Derive the key from the password and salt
  const iv = crypto.randomBytes(ivLength); // Generate a random initialization vector
  // @ts-ignore
  const cipher = crypto.createCipheriv(algorithm, key, iv); // Use derived key and IV

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag(); // Authentication tag for integrity
  return `v1|${encrypted}|${iv.toString('base64')}|${salt.toString('base64')}|${authTag.toString('base64')}`;
}

export function decrypt(data: string, password: string): string {
  const [_v, encryptedData, ivBase64, saltBase64, authTagBase64] = data.split('|');
  const salt = Buffer.from(saltBase64, 'base64'); // Decode the salt
  const key = deriveKey(password, salt); // Derive the key from the password and salt
  const iv = Buffer.from(ivBase64, 'base64'); // Decode the IV
  const authTag = Buffer.from(authTagBase64, 'base64'); // Decode the authentication tag
  // @ts-ignore
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // @ts-ignore
  decipher.setAuthTag(authTag); // Set the authentication tag for integrity check

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

