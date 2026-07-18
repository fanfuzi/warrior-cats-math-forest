import { jsonResponse, getUserFromRequest } from './_lib';

export async function onRequestGet(context) {
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ user: null }, 401);
  return jsonResponse({ user: { id: user.id, email: user.email } });
}
