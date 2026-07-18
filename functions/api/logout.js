import { jsonResponse, getUserFromRequest } from './_lib';

export async function onRequestPost(context) {
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if (user) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(user.token).run();
  }
  return jsonResponse({ ok: true });
}
