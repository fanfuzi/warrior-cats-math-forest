import { jsonResponse, getUserFromRequest } from './_lib';
import { aiChat, aiConfigured } from './_ai';

/* POST /api/ai-summary - AI analysis of the student's mistake book.
   Body (optional): { mistakes: [ { kp, wrong, samples:[ {q,your,ans} ] } ] }
   sent from the local mistake book so AI works even before cloud sync.
   Falls back to cloud weak_points when no local data is provided.
   Writes ai_summary onto the weakest knowledge-point row; returns the text. */
export async function onRequestPost(context){
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if(!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  if(!aiConfigured(env)) return jsonResponse({ error: 'AI not configured', configured: false });

  var body;
  try { body = await request.json(); } catch(e){ body = {}; }
  var localPoints = (body && body.mistakes) ? body.mistakes : [];

  var lines, weakestKp = null;
  if(localPoints.length){
    lines = localPoints.map(function(p){
      var head = '- [' + p.kp + '] wrong ' + (p.wrong||1) + 'x';
      var s = (p.samples||[]).map(function(x){
        return '    Q: ' + (x.q||'?') + ' | student: ' + (x.your||'?') + ' | correct: ' + (x.ans||'?');
      }).join('\n');
      return head + (s ? '\n' + s : '');
    }).join('\n');
    weakestKp = localPoints[0].kp;
  } else {
    var rows = await env.DB.prepare(
      'SELECT kp, attempts, correct, mastery_rate FROM weak_points WHERE user_id=? ORDER BY mastery_rate ASC LIMIT 10'
    ).bind(user.id).all();
    var points = rows.results || [];
    if(!points.length) return jsonResponse({ summaries: [], note: 'no data yet' });
    lines = points.map(function(p){
      return '- ' + p.kp + ': mastery ' + Math.round((p.mastery_rate||0)*100) + '% (' + p.correct + '/' + p.attempts + ')';
    }).join('\n');
    weakestKp = points[0].kp;
  }

  var messages = [
    { role: 'system', content: 'You are a friendly math-mentor cat (Warrior Cats style) analyzing a Hong Kong primary student math mistakes. Reply in Traditional Chinese. Be concise: group the error patterns, name the weakest knowledge points (use the kp ids given), infer the likely misconception from the wrong answers, and give one short actionable practice tip for each. End with one encouraging sentence for the young warrior.' },
    { role: 'user', content: 'Mistake book (kp ids + sample questions showing the student answer vs the correct answer):\n' + lines + '\n\n請歸類錯因、指出最薄弱的知識點、說明可能的錯誤概念、每個給一句練習建議，最後鼓勵一下小武士。' }
  ];
  var res = await aiChat(env, messages, { temperature: 0.4, max_tokens: 600 });
  if(res.error) return jsonResponse({ error: res.error }, 502);

  var now = new Date().toISOString();
  if(weakestKp){
    await env.DB.prepare(
      'UPDATE weak_points SET ai_summary=?, ai_updated_at=? WHERE user_id=? AND kp=?'
    ).bind(res.text, now, user.id, weakestKp).run();
  }
  return jsonResponse({ summaries: [{ kp: weakestKp, text: res.text, updated_at: now }], usage: res.usage });
}
