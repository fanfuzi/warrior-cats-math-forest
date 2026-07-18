import { jsonResponse, getUserFromRequest } from './_lib';

export async function onRequestGet(context) {
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  var row = await env.DB.prepare('SELECT data FROM user_data WHERE user_id = ?').bind(user.id).first();
  if (!row) return jsonResponse({ data: null });
  try { return jsonResponse({ data: JSON.parse(row.data) }); }
  catch (e) { return jsonResponse({ data: null }); }
}

export async function onRequestPut(context) {
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  var body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
  var dataStr = JSON.stringify(body.data);
  var now = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
  ).bind(user.id, dataStr, now).run();
  return jsonResponse({ ok: true });
}
