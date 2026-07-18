/* Warrior Cats Math Forest - mistake book & spaced repetition (Phase B) */
window.WCM = window.WCM || {};

/* Spaced-repetition intervals (days) by review stage: 1 -> 3 -> 7 -> 21. */
WCM.REVIEW_INTERVALS = [1, 3, 7, 21];

/* Due mistakes: next_review_at <= now and not mastered. Oldest due first. */
WCM.getDueMistakes = function(){
  var m = WCM.state.mistakesMirror || {};
  var now = new Date().toISOString();
  var out = [];
  for(var k in m){
    var row = m[k];
    if(row.mastered) continue;
    if(!row.next_review_at || row.next_review_at <= now) out.push(row);
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
    var stage = (row.review_stage||0) + 1;
    var days = WCM.REVIEW_INTERVALS[Math.min(stage, WCM.REVIEW_INTERVALS.length-1)];
    row.review_stage = stage;
    row.next_review_at = new Date(now.getTime() + days*86400000).toISOString();
    if(stage >= WCM.REVIEW_INTERVALS.length) row.mastered = 1;
  } else {
    row.review_stage = 0;
    row.wrong_count = (row.wrong_count||0) + 1;
    row.next_review_at = new Date(now.getTime() + 86400000).toISOString();
    row.mastered = 0;
  }
  m[qKey] = row;
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
