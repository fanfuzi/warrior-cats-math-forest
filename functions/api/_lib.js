/* Shared helpers for WCM API: password hashing, sessions, auth */
export function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function generateId() {
  return crypto.randomUUID();
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* PBKDF2 password hashing via Web Crypto (available in Workers runtime) */
export async function hashPassword(password, salt) {
  var enc = new TextEncoder();
  var keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  var bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  var arr = new Uint8Array(bits);
  var str = '';
  for (var i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  return btoa(str);
}

var SESSION_MAX_AGE_DAYS = 30;

export async function createSession(env, userId) {
  var token = generateId();
  var now = new Date();
  var expires = new Date(now.getTime() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(token, userId, now.toISOString(), expires.toISOString()).run();
  return token;
}

/* Extract bearer token, verify against sessions table, return user or null */
export async function getUserFromRequest(request, env) {
  var auth = request.headers.get('Authorization');
  if (!auth || auth.indexOf('Bearer ') !== 0) return null;
  var token = auth.slice(7);
  var row = await env.DB.prepare(
    'SELECT s.user_id, s.expires_at, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'
  ).bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return { id: row.user_id, email: row.email, token: token };
}
