/**
 * Secure password hashing using the native Web Crypto API (SHA-256).
 * Never stores or compares plaintext passwords.
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifies a plain password against a stored SHA-256 hex hash.
 */
export async function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash) return false;
  const computedHash = await hashPassword(plainPassword);
  return computedHash === storedHash;
}
