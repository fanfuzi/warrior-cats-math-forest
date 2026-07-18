/* Warrior Cats Math Forest - mistake book & spaced repetition (Phase B) */
window.WCM = window.WCM || {};

/* Cache of the exact original question for each wrong q_key, so review
   re-shows the very same question/figure the student missed (not a fresh
   random one of the same type). Kept in its own localStorage key so cloud
   sync (which rebuilds mistakesMirror from server rows) never wipes it. */
WCM.RQ_KEY = 'wcm_rq_v1';
WCM._rq = null;
WCM.rqAll = function(){
  if(WCM._rq===null){ try{ WCM._rq = JSON.parse(localStorage.getItem(WCM.RQ_KEY))||{}; }catch(e){ WCM._rq={}; } }
  return WCM._rq;
};
WCM.rqGet = function(qKey){ return WCM.rqAll()[qKey] || null; };
WCM.rqPut = function(qKey, q){
  var r = WCM.rqAll();
  r[qKey] = q;
  var keys = Object.keys(r);
  if(keys.length > 60){ for(var i=0;i<keys.length-50;i++){ delete r[keys[i]]; } }
  try{ localStorage.setItem(WCM.RQ_KEY, JSON.stringify(r)); }catch(e){}
};

/* Keep the local mistake mirror from growing without bound: when it exceeds
   the cap, drop graduated (mastered) entries - they are hidden anyway. */
WCM.pruneMistakeMirror = function(m){
  var keys = Object.keys(m);
  if(keys.length <= 50) return;
  for(var i=0;i<keys.length;i++){ if(m[keys[i]] && m[keys[i]].mastered) delete m[keys[i]]; }
};

/* Due mistakes: next_review_at <= now and not mastered. Oldest due first. */
WCM.getDueMistakes = function(){
  var m = WCM.state.mistakesMirror || {};
  var now = new Date().toISOString();
  var out = [];
  for(var k in m){
    var row = m[k];
    if(row.mastered) continue;
    row.q_key = k;
    if(!row.next_review_at || row.next_review_at <= now) out.push(row);
  }
  out.sort(function(a,b){ return (a.next_review_at||'') < (b.next_review_at||'') ? -1 : 1; });
  return out;
};

/* All active (non-mastered) mistakes, due first. Display/answer backfilled from q_key. */
WCM.getAllMistakes = function(){
  var m = WCM.state.mistakesMirror || {};
  var out = [];
  for(var k in m){
    var row = m[k];
    if(row.mastered) continue;
    row.q_key = k;
    if(!row.display){ var p=(k||'').split('|'); if(p.length>=3){ row.display=p.slice(1,-1).join('|'); if(!row.correct_answer) row.correct_answer=p[p.length-1]; } }
    out.push(row);
  }
  out.sort(function(a,b){ return (a.next_review_at||'') < (b.next_review_at||'') ? -1 : 1; });
  return out;
};

/* Count of active (non-mastered) mistakes. */
WCM.mistakeCount = function(){
  var m = WCM.state.mistakesMirror || {}; var n = 0;
  for(var k in m) if(!m[k].mastered) n++;
  return n;
};

/* On answering a review question: advance (correct) or reset (wrong) the
   mistake's spaced-repetition schedule. Updates local mirror + cloud. */
WCM.scheduleReview = function(qKey, correct){
  var m = WCM.state.mistakesMirror || {};
  var row = m[qKey];
  if(!row) return;
  var now = new Date();
  if(correct){
    /* Correct on review -> graduate: remove from the active mistake book.
       If the same question is missed again later, recordAttempt re-adds it. */
    row.mastered = 1;
    row.review_stage = (row.review_stage||0) + 1;
    row.next_review_at = null;
  } else {
    row.review_stage = 0;
    row.wrong_count = (row.wrong_count||0) + 1;
    row.next_review_at = new Date(now.getTime() + 86400000).toISOString();
    row.mastered = 0;
  }
  m[qKey] = row;
  WCM.pruneMistakeMirror(m);
  WCM.state.mistakesMirror = m;
  WCM.saveLocal();
  if(WCM.isLoggedIn && WCM.isLoggedIn()){
    WCM.api('attempts', 'POST', {
      level_id: row.level_id||'', region:'', season:0, kp: row.kp||'',
      q_key: qKey, correct: correct?1:0, review: 1
    }).catch(function(){});
  }
};

/* Weak points sorted by lowest mastery rate (for the mistake-book page). */
WCM.weakPointsSorted = function(){
  var wp = WCM.state.weakPoints || [];
  return wp.slice().sort(function(a,b){ return (a.mastery_rate||0) - (b.mastery_rate||0); });
};

/* Build a compact summary of the local mistake book for AI analysis.
   Groups active mistakes by knowledge point with up to 3 sample questions
   (question text, the student's wrong answer, the correct answer) each. */
WCM.buildAiPayload = function(){
  var all = WCM.getAllMistakes();
  var byKp = {};
  var order = [];
  for(var i=0;i<all.length;i++){
    var row = all[i];
    var kp = row.kp || 'other';
    if(!byKp[kp]){ byKp[kp] = { kp: kp, wrong: 0, samples: [] }; order.push(kp); }
    byKp[kp].wrong += (row.wrong_count||1);
    if(byKp[kp].samples.length < 3){
      byKp[kp].samples.push({
        q: row.display || '',
        your: row.user_answer!=null ? String(row.user_answer) : '',
        ans: row.correct_answer!=null ? String(row.correct_answer) : ''
      });
    }
  }
  var points = order.map(function(k){ return byKp[k]; });
  return { mistakes: points, count: all.length };
};
