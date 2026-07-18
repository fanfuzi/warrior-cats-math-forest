import { jsonResponse, hashPassword, createSession } from './_lib';

export async function onRequestPost(context) {
  var request = context.request, env = context.env;
  var body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
  var email = (body.email || '').trim().toLowerCase();
  var password = body.password || '';

  var row = await env.DB.prepare(
    'SELECT id, email, password_hash, salt FROM users WHERE email = ?'
  ).bind(email).first();
  if (!row) return jsonResponse({ error: 'Invalid email or password' }, 401);

  var hash = await hashPassword(password, row.salt);
  if (hash !== row.password_hash) return jsonResponse({ error: 'Invalid email or password' }, 401);

  var token = await createSession(env, row.id);
  return jsonResponse({ token: token, user: { id: row.id, email: row.email } });
}
