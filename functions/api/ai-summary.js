import { jsonResponse, getUserFromRequest } from './_lib';
import { aiChat, aiConfigured } from './_ai';

/* POST /api/ai-summary - AI grouping of the student's weak points.
   Writes ai_summary onto the weakest knowledge point row; returns the text.
   (Phase A skeleton - richer per-kp summaries arrive in Phase E.) */
export async function onRequestPost(context){
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if(!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  if(!aiConfigured(env)) return jsonResponse({ error: 'AI not configured', configured: false });

  var rows = await env.DB.prepare(
    'SELECT kp, attempts, correct, mastery_rate FROM weak_points WHERE user_id=? ORDER BY mastery_rate ASC LIMIT 10'
  ).bind(user.id).all();
  var points = rows.results || [];
  if(!points.length) return jsonResponse({ summaries: [], note: 'no data yet' });

  var lines = points.map(function(p){
    return '- ' + p.kp + ': mastery ' + Math.round((p.mastery_rate||0)*100) + '% (' + p.correct + '/' + p.attempts + ')';
  }).join('\n');

  var messages = [
    { role: 'system', content: 'You are a friendly math-mentor cat (Warrior Cats style) analyzing a HK primary student math weak points. Reply in Traditional Chinese. Be concise: group error patterns, name the 3 weakest knowledge points (use the kp ids given), and give one short actionable tip each.' },
    { role: 'user', content: 'Weak points (kp: mastery% correct/total):\n' + lines + '\n\n請歸類錯因、列出最薄弱3個知識點、每個給一句建議。' }
  ];
  var res = await aiChat(env, messages, { temperature: 0.4, max_tokens: 500 });
  if(res.error) return jsonResponse({ error: res.error }, 502);

  var now = new Date().toISOString();
  var weakest = points[0];
  if(weakest){
    await env.DB.prepare(
      'UPDATE weak_points SET ai_summary=?, ai_updated_at=? WHERE user_id=? AND kp=?'
    ).bind(res.text, now, user.id, weakest.kp).run();
  }
  return jsonResponse({ summaries: [{ kp: weakest?weakest.kp:null, text: res.text, updated_at: now }], usage: res.usage });
}
