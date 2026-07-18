import { jsonResponse, generateId, hashPassword, validEmail, createSession } from './_lib';

export async function onRequestPost(context) {
  var request = context.request, env = context.env;
  var body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
  var email = (body.email || '').trim().toLowerCase();
  var password = body.password || '';
  if (!validEmail(email)) return jsonResponse({ error: 'Invalid email' }, 400);
  if (password.length < 6) return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);

  var existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return jsonResponse({ error: 'Email already registered' }, 409);

  var id = generateId();
  var salt = generateId();
  var passwordHash = await hashPassword(password, salt);
  await env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, email, passwordHash, salt, new Date().toISOString()).run();

  /* Migrate existing local progress to cloud on first registration */
  if (body.data) {
    await env.DB.prepare(
      'INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?)'
    ).bind(id, JSON.stringify(body.data), new Date().toISOString()).run();
  }

  var token = await createSession(env, id);
  return jsonResponse({ token: token, user: { id: id, email: email } });
}
