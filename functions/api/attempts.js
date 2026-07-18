import { jsonResponse, getUserFromRequest, generateId } from './_lib';

/* POST /api/attempts - record one answered question + update aggregates. */
export async function onRequestPost(context){
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if(!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  var body;
  try { body = await request.json(); } catch(e){ return jsonResponse({ error: 'Invalid request' }, 400); }

  var now = new Date().toISOString();
  var correct = body.correct ? 1 : 0;
  await env.DB.prepare(
    'INSERT INTO attempts (id,user_id,level_id,region,season,kp,q_key,correct,user_answer,correct_answer,tier,duration_ms,created_at) ' +
    'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(generateId(), user.id, body.level_id||'', body.region||'', body.season||0, body.kp||'', body.q_key||'',
         correct, body.user_answer!=null?String(body.user_answer):null, body.correct_answer!=null?String(body.correct_answer):null,
         body.tier!=null?body.tier:null, body.duration_ms!=null?body.duration_ms:null, now).run();

  /* upsert weak_points (running mastery rate) */
  var wp = await env.DB.prepare('SELECT attempts, correct FROM weak_points WHERE user_id=? AND kp=?').bind(user.id, body.kp||'').first();
  var att = (wp?wp.attempts:0)+1, cor = (wp?wp.correct:0)+correct;
  var rate = att ? Math.round(cor/att*100)/100 : 0;
  await env.DB.prepare(
    'INSERT INTO weak_points (user_id,kp,season,attempts,correct,mastery_rate,last_updated) VALUES (?,?,?,?,?,?,?) ' +
    'ON CONFLICT(user_id,kp) DO UPDATE SET season=excluded.season, attempts=excluded.attempts, correct=excluded.correct, mastery_rate=excluded.mastery_rate, last_updated=excluded.last_updated'
  ).bind(user.id, body.kp||'', body.season||0, att, cor, rate, now).run();

  /* mistakes: spaced-repetition queue, only on wrong answers */
  if(!correct){
    var next = new Date(Date.now() + 24*60*60*1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO mistakes (user_id,q_key,level_id,kp,error_type,wrong_count,last_wrong_at,next_review_at,mastered,review_stage) ' +
      'VALUES (?,?,?,?,?,1,?,?,0,0) ' +
      'ON CONFLICT(user_id,q_key) DO UPDATE SET wrong_count=mistakes.wrong_count+1, last_wrong_at=excluded.last_wrong_at, next_review_at=excluded.next_review_at, mastered=0, review_stage=0'
    ).bind(user.id, body.q_key||'', body.level_id||'', body.kp||'', body.error_type||null, now, next).run();
  }
  /* correct review answer: advance spaced-repetition stage */
  if(correct && body.review){
    var cur = await env.DB.prepare('SELECT review_stage FROM mistakes WHERE user_id=? AND q_key=?').bind(user.id, body.q_key||'').first();
    if(cur){
      var stage = (cur.review_stage||0)+1;
      var intervals=[1,3,7,21]; var days=intervals[Math.min(stage,3)];
      var rnext = new Date(Date.now()+days*86400000).toISOString();
      var rmastered = stage>=3?1:0;
      await env.DB.prepare('UPDATE mistakes SET next_review_at=?, review_stage=?, mastered=? WHERE user_id=? AND q_key=?').bind(rnext, stage, rmastered, user.id, body.q_key||'').run();
    }
  }
  return jsonResponse({ ok: true });
}

/* GET /api/attempts - sync mirror: active mistakes + weak points for this user. */
export async function onRequestGet(context){
  var request = context.request, env = context.env;
  var user = await getUserFromRequest(request, env);
  if(!user) return jsonResponse({ error: 'Unauthorized' }, 401);
  var mistakes = await env.DB.prepare(
    'SELECT q_key,level_id,kp,error_type,wrong_count,last_wrong_at,next_review_at,mastered,review_stage FROM mistakes WHERE user_id=? AND mastered=0'
  ).bind(user.id).all();
  var weak = await env.DB.prepare(
    'SELECT kp,season,attempts,correct,mastery_rate,ai_summary,ai_updated_at FROM weak_points WHERE user_id=?'
  ).bind(user.id).all();
  return jsonResponse({ mistakes: mistakes.results||[], weakPoints: weak.results||[] });
}
