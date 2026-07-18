/* Warrior Cats Math Forest - UI rendering & interaction */
window.WCM = window.WCM || {};
WCM.ui = { screen:'home', session:null, currentRegion:null, authMode:'login', authError:'', aiText:'' };

WCM.ui.go = function(screen){ WCM.ui.screen = screen; WCM.ui.render(); };

/* ---------- toast (transient message) ---------- */
WCM.ui.toast = function(msg){
  var old = document.querySelector('.toast');
  if(old) old.parentNode.removeChild(old);
  var el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function(){ el.classList.add('show'); }, 10);
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 300);
  }, 1800);
};

WCM.ui.render = function(){
  var el = document.getElementById('app');
  switch(WCM.ui.screen){
    case 'regions': el.innerHTML = WCM.ui.renderRegions(); break;
    case 'map': el.innerHTML = WCM.ui.renderMap(); break;
    case 'story': el.innerHTML = WCM.ui.renderStory(); break;
    case 'level': el.innerHTML = WCM.ui.renderLevel(); break;
    case 'reward': el.innerHTML = WCM.ui.renderReward(); break;
    case 'settings': el.innerHTML = WCM.ui.renderSettings(); break;
    case 'cards': el.innerHTML = WCM.ui.renderCards(); break;
    case 'cardview': el.innerHTML = WCM.ui.renderCardView(); break;
    case 'auth': el.innerHTML = WCM.ui.renderAuth(); break;
    case 'mistakes': el.innerHTML = WCM.ui.renderMistakes(); break;
    case 'grade': el.innerHTML = WCM.ui.renderGrade(); break;
    default: el.innerHTML = WCM.ui.renderHome();
  }
  window.scrollTo(0,0);
};

/* ---------- shared bits ---------- */
function diffStars(n){ var s=''; for(var i=0;i<4;i++) s+= i<n?'★':'☆'; return s; }
function bestStars(n){ var s=''; for(var i=0;i<3;i++) s+= i<n?'★':'☆'; return s; }
function praise(){ return WCM.t(pick(['praise1','praise2','praise3','praise4','praise5'])); }

function rankProgress(){
  var pts=WCM.state.points, idx=WCM.rankIndexAt(pts), r=WCM.RANKS[idx];
  var next = WCM.RANKS[idx+1];
  var pct = next ? Math.round((pts-r.min)/(next.min-r.min)*100) : 100;
  return { r:r, next:next, pct:pct, pts:pts };
}

function statusBar(){
  var rp=rankProgress();
  var nextTxt = rp.next ? (rp.next.min - rp.pts) : '';
  var bar = '<div class="rankbar">'+
    '<span class="rank-emoji">'+rp.r.emoji+'</span>'+
    '<span class="rank-name">'+WCM.rankName(rp.r)+'</span>'+
    '<div class="bar"><div class="bar-fill" style="width:'+rp.pct+'%"></div></div>'+
    '<span class="rank-pts">'+rp.pts+' '+WCM.t('points')+(rp.next?' · '+nextTxt:'')+'</span></div>';
  var backAction = WCM.ui.screen==='map' ? 'territories' : (WCM.ui.screen==='cardview' ? 'cards' : 'home');
  var backIcon = WCM.ui.screen==='map' ? '‹' : '🏠';
  return '<div class="statusbar"><button class="icon-btn" data-action="'+backAction+'">'+backIcon+'</button>'+bar+'</div>';
}

function freshkillMini(){
  var p=WCM.state.prey, html='<div class="fk-mini"><span class="fk-label">'+WCM.t('freshkill')+':</span> ';
  var any=false;
  WCM.PREY.forEach(function(pr){ if(p[pr.key]){ any=true; html+='<span class="fk-item">'+pr.emoji+'<sub>'+p[pr.key]+'</sub></span>'; } });
  if(!any) html+='<span class="fk-empty">-</span>';
  html+='</div>';
  return html;
}

function badgeRow(){
  var html='<div class="badge-row">';
  WCM.REGIONS.forEach(function(r){
    var earned = WCM.hasBadge(r.id);
    var badge = WCM.BADGES[r.id];
    html+='<span class="badge-icon'+(earned?' earned':'')+'" title="'+WCM.badgeName(badge)+'">'+badge.emoji+'</span>';
  });
  html+='</div>';
  return html;
}

/* ---------- daily tasks & streak ---------- */
WCM.ui.renderDaily = function(){
  WCM.checkDaily();
  var d=WCM.state.daily;
  var zh=WCM.lang==='zh-TW';
  var tasks=[
    {label:WCM.t('task1'), done:d.tasks[0]},
    {label:WCM.t('task2')+' ('+d.correctToday+'/10)', done:d.tasks[1]},
    {label:WCM.t('task3'), done:d.tasks[2]}
  ];
  var taskHtml=tasks.map(function(t,i){
    return '<div class="dtask'+(t.done?' done':'')+'">'+
      '<span class="dtask-check">'+(t.done?'✅':'⬜')+'</span>'+
      '<span class="dtask-label">'+t.label+'</span></div>';
  }).join('');
  var streakHtml='';
  if(WCM.state.streak.count>0){
    streakHtml='<div class="streak-box">'+
      '<span class="streak-fire'+(WCM.streakActive()?'':' inactive')+'">🔥</span>'+
      '<span class="streak-count">'+WCM.state.streak.count+'</span>'+
      '<span class="streak-label">'+WCM.t('day')+' '+(zh?'連續':'streak')+'</span></div>';
  }
  var claimHtml='';
  if(WCM.allDailyDone() && !d.claimed){
    claimHtml='<button class="btn primary claim-btn" data-action="claim-daily">🎁 '+WCM.t('dailyReward')+'</button>';
  } else if(d.claimed){
    claimHtml='<div class="daily-done-msg">'+WCM.t('dailyAllDone')+'</div>';
  }
  return '<div class="daily-section">'+
    (streakHtml?streakHtml:'')+
    '<div class="daily-head">📜 '+WCM.t('dailyTasks')+'</div>'+
    taskHtml+claimHtml+
  '</div>';
};

/* ---------- home ---------- */
WCM.ui.renderHome = function(){
  var rp=rankProgress();
  var zh = WCM.lang==='zh-TW';
  return '<div class="screen home">'+
    '<div class="forest-bg"></div>'+
    '<div class="hero">'+
      '<div class="cat-hero">🐱</div>'+
      '<div class="fireflies"><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div>'+
      '<h1>'+WCM.t('appTitle')+'</h1>'+
      '<p class="subtitle">'+WCM.t('subtitle')+'</p>'+
      '<p class="story-intro">'+WCM.t('storyIntro')+'</p>'+
      '<div class="rank-chip">'+rp.r.emoji+' '+WCM.rankName(rp.r)+' · '+rp.pts+' '+WCM.t('points')+'</div>'+
      badgeRow()+
    '</div>'+
    WCM.ui.renderDaily()+
    '<div class="actions">'+
      (WCM.state.grade ? '<button class="btn primary big" data-action="daily-checkin">🎯 '+WCM.t('dailyHuntBtn')+'</button>' : '<button class="btn primary big" data-action="grade">🎯 '+WCM.t('gradeSelect')+'</button>')+
      '<button class="btn primary big" data-action="play">▶ '+WCM.t('play')+'</button>'+
      '<button class="btn" data-action="settings">⚙ '+WCM.t('settings')+'</button>'+
      '<button class="btn" data-action="cards">🃏 '+WCM.t('cardAlbum')+' ('+WCM.cardCount()+'/'+WCM.CARDS.length+')</button>'+
      '<button class="btn" data-action="mistakes">📖 '+WCM.t('mistakeBook')+' ('+WCM.mistakeCount()+')</button>'+
      '<button class="btn ghost lang-toggle" data-action="lang-toggle">🌐 '+(zh?'English':'繁體中文')+'</button>'+
    '</div>'+
    (WCM.isLoggedIn()
      ? '<div class="auth-status"><span>👤 '+WCM.auth.email+'</span><button class="btn ghost small" data-action="logout">'+WCM.t('authLogout')+'</button></div>'
      : '<div class="auth-status"><button class="btn ghost small" data-action="auth">🔑 '+WCM.t('authLogin')+' / '+WCM.t('authRegister')+'</button></div>')+
    '<p class="lang-hint">'+(zh?'點擊 🌐 一鍵切換 English / 繁體中文':'Tap 🌐 to switch English / 繁體中文')+'</p>'+
  '</div>';
};

/* ---------- regions ---------- */
WCM.ui.renderRegions = function(){
  var cards = WCM.REGIONS.map(function(r, idx){
    var mentor = WCM.MENTORS[r.mentor];
    var stars = WCM.regionStars(r.id);
    var maxStars = WCM.levelsInRegion(r.id).length * 3;
    var hasBadge = WCM.hasBadge(r.id);
    var badge = WCM.BADGES[r.id];
    return '<button class="region-card" data-action="select-region" data-id="'+r.id+'">'+
      '<div class="rc-left">'+
        '<div class="rc-icon">'+r.icon+'</div>'+
        (hasBadge ? '<div class="rc-badge">'+badge.emoji+'</div>' : '')+
      '</div>'+
      '<div class="rc-body">'+
        '<div class="rc-name">'+WCM.regionName(r)+'</div>'+
        '<div class="rc-topic">'+WCM.t('season'+(r.season||1)+'_short')+' · '+WCM.regionTopic(r)+'</div>'+
        '<div class="rc-mentor">'+mentor.emoji+' '+WCM.mentorName(mentor)+'</div>'+
      '</div>'+
      '<div class="rc-right">'+
        '<div class="rc-stars">'+stars+' / '+maxStars+' ★</div>'+
        '<div class="rc-go">›</div>'+
      '</div>'+
    '</button>';
  }).join('');
  return '<div class="screen regions">'+
    '<div class="forest-bg"></div>'+
    statusBar()+
    '<div class="content">'+
      '<div class="region-head"><h2>'+WCM.t('territories')+'</h2>'+
      '<p class="region-desc">'+WCM.t('chooseTerritory')+'</p></div>'+
      '<div class="region-list">'+cards+'</div>'+
      badgeRow()+
    '</div>'+
  '</div>';
};

/* ---------- region map ---------- */
WCM.ui.renderMap = function(){
  var r = WCM.ui.currentRegion || WCM.REGIONS[0];
  var mentor = WCM.MENTORS[r.mentor];
  var levels = WCM.levelsInRegion(r.id);
  var cards = levels.map(function(lv){
    var prog = WCM.getProgress(lv.id);
    var locked = !WCM.isLevelUnlocked(lv);
    var mPct = WCM.masteryPct ? WCM.masteryPct(lv) : null;
    var masteryHtml = mPct!=null ? '<div class="lc-mastery"><span class="lc-ml">'+WCM.t('mastery')+'</span><div class="bar"><div class="bar-fill" style="width:'+mPct+'%"></div></div><span class="lc-mp">'+mPct+'%</span></div>' : '';
    var cls = 'level-card'+(lv.boss?' boss':'')+(locked?' locked':'');
    if(locked){
      var hint = lv.boss ? WCM.t('lockBoss') : WCM.t('lockLevel');
      return '<button class="'+cls+'" data-action="locked-level" data-id="'+lv.id+'">'+
        '<div class="lc-top"><span class="lc-icon">🔒</span></div>'+
        '<div class="lc-name">'+WCM.levelName(lv)+'</div>'+
        '<div class="lc-lock-hint">'+hint+'</div>'+
      '</button>';
    }
    return '<button class="'+cls+'" data-action="start-level" data-id="'+lv.id+'">'+
      '<div class="lc-top"><span class="lc-icon">'+lv.icon+'</span>'+
        '<span class="lc-best">'+(prog.stars>0?bestStars(prog.stars):'')+'</span></div>'+
      '<div class="lc-name">'+WCM.levelName(lv)+'</div>'+
      '<div class="lc-diff">'+WCM.t('difficulty')+': '+diffStars(lv.diff)+' <span class="lc-tier">'+WCM.t('tier'+lv.diff)+'</span></div>'+
      '<div class="lc-desc">'+WCM.t('lvlDesc_'+lv.id)+'</div>'+
      masteryHtml+
    '</button>';
  }).join('');
  return '<div class="screen map">'+
    '<div class="forest-bg region-bg-'+r.id+'"></div>'+
    statusBar()+
    '<div class="content">'+
      '<div class="mentor-box">'+
        '<div class="mentor-avatar">'+mentor.emoji+'</div>'+
        '<div class="mentor-text">'+
          '<div class="mentor-name">'+WCM.t('mentor')+': '+WCM.mentorName(mentor)+'</div>'+
          '<div class="mentor-intro">'+WCM.mentorIntro(mentor)+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="region-head">'+
        '<h2>'+r.icon+' '+WCM.regionName(r)+'</h2>'+
        '<p class="region-desc">'+WCM.regionDesc(r)+'</p>'+
      '</div>'+
      freshkillMini()+
      '<button class="btn primary random-btn" data-action="random-hunt">🎲 '+WCM.t('randomHunt')+'</button>'+
      '<div class="level-grid">'+cards+'</div>'+
    '</div>'+
  '</div>';
};

/* ---------- story chapter popup ---------- */
WCM.ui.renderStory = function(){
  var r = WCM.ui.currentRegion;
  if(!r) { WCM.ui.go('regions'); return ''; }
  var chapter = WCM.chapterForRegion(r.id);
  var mentor = WCM.MENTORS[r.mentor];
  var zh = WCM.lang==='zh-TW';
  var titleHtml = chapter ? '<div class="story-chapter">'+WCM.t('chapter')+' '+chapter.num+'</div>' : '';
  var titleText = chapter ? WCM.t(chapter.titleKey) : WCM.regionName(r);
  var storyText = chapter ? WCM.t(chapter.textKey) : WCM.mentorIntro(mentor);
  return '<div class="screen story"><div class="forest-bg"></div>'+
    '<div class="story-content">'+
      '<div class="story-mentor-big">'+mentor.emoji+'</div>'+
      titleHtml+
      '<h2 class="story-title">'+titleText+'</h2>'+
      '<div class="story-text">'+storyText+'</div>'+
      '<button class="btn primary big" data-action="enter-map">▶ '+(zh?'進入領地':'Enter Territory')+'</button>'+
    '</div>'+
  '</div>';
};

/* ---------- level ---------- */
WCM.ui.startLevel = function(level){
  WCM.trackPractice();
  var n = level.boss ? WCM.QCOUNT.boss : WCM.QCOUNT.normal;
  var _t = WCM.initialTierForLevel ? WCM.initialTierForLevel(level) : 1;
  WCM.setGenTier(_t);
  var q = WCM.generateUnique(level);
  var seenKeys = {}; seenKeys[WCM.qKey(level, q)] = true;
  WCM.ui.session = { level:level, total:n, questions:[q], idx:0, correct:0, gainedPts:0, gainedPrey:{},
    tier:_t, streak:0, hintShown:false, answered:false, input:'', selected:null,
    seenKeys:seenKeys, startRankIdx:WCM.rankIndexAt(WCM.state.points), badgeEarned:false, qStart:Date.now() };
  WCM.ui.go('level');
};

WCM.ui.renderLevel = function(){
  var s=WCM.ui.session; if(!s) return '';
  var q=s.questions[s.idx]; var total=s.total;
  var progTxt = WCM.t('question')+' '+(s.idx+1)+' '+WCM.t('of')+' '+total;
  var longCls = q.display.length>26 ? ' long':'';
  var tierIcons=['❄','🌿','🔥'];
  var tierLabels=[WCM.t('adaptEasy'),WCM.t('adaptNormal'),WCM.t('adaptHard')];
  var tierChip='<span class="lvl-tier tier-'+s.tier+'">'+tierIcons[s.tier]+' '+tierLabels[s.tier]+'</span>';
  var _lv = s.curLevel || s.level;
  var _back = s.isReview ? 'home' : 'map';
  var _title = s.isDaily ? WCM.t('dailyCheckin') : (s.isReview ? (WCM.t('reviewTitle')+' · '+WCM.levelName(_lv)) : (_lv.icon+' '+WCM.levelName(_lv)));
  var head = '<div class="lvl-head"><button class="icon-btn" data-action="'+_back+'">‹</button>'+
    '<div class="lvl-title">'+_title+'</div>'+
    '<div class="lvl-prog">'+progTxt+'</div></div>'+
    '<div class="lvl-score">'+WCM.t('score')+': '+s.correct+' · '+WCM.t('points')+': '+s.gainedPts+tierChip+'</div>';

  var hintHtml='';
  if(!s.answered){
    if(s.hintShown){ hintHtml='<div class="hint-box">💡 '+q.hint+'</div>'; }
    else { hintHtml='<button class="btn ghost hint-btn" data-action="hint">💡 '+WCM.t('hint')+'</button>'; }
  }

  var svgHtml = q.svg ? '<div class="q-svg">'+q.svg+'</div>' : '';

  var body='';
  if(q.type==='mc'){
    var isText = q.choices.some(function(c){ return isNaN(Number(c)); });
    var choiceCls = isText ? 'choice text-choice' : 'choice';
    var choices=q.choices.map(function(c){
      var cls = choiceCls;
      if(s.answered){
        if(String(c)===String(q.answer)) cls += ' correct';
        else if(s.selected===c) cls += ' wrong';
        else cls += ' faded';
      } else if(s.selected===c){
        cls += ' selected';
      }
      return '<button class="'+cls+'" data-action="mc" data-val="'+c+'"'+(s.answered?' disabled':'')+'>'+c+'</button>';
    }).join('');
    body='<div class="choices'+(isText?' choices-text':'')+'">'+choices+'</div>';
  } else {
    var keys=['1','2','3','4','5','6','7','8','9','.','0','⌫'];
    var pad=keys.map(function(k){
      if(k==='⌫') return '<button class="key key-op" data-action="del">'+WCM.t('del')+'</button>';
      return '<button class="key" data-action="key" data-key="'+k+'">'+k+'</button>';
    }).join('');
    var dis = s.input.length===0?' disabled':'';
    body='<div class="answer-display'+(s.answered?' locked':'')+'" id="answer-display">'+(s.input||'')+'</div>'+
         '<button class="btn ghost clear-btn" data-action="clear"'+(s.answered?' disabled':'')+'>✕ '+WCM.t('clear')+'</button>'+
         '<div class="keypad">'+pad+'</div>'+
         (s.answered?'':'<button class="btn primary big submit'+dis+'" data-action="submit">'+WCM.t('submit')+'</button>');
  }

  var fb='';
  if(s.answered){
    var prey=WCM.preyBy(q.prey);
    if(s.lastCorrect){
      fb='<div class="feedback correct"><div class="fb-head">✅ '+WCM.t('correct')+' '+praise()+'</div>'+
         '<div class="fb-prey">'+prey.emoji+' +'+WCM.preyName(prey)+' (+'+q.pts+' '+WCM.t('points')+')</div></div>';
    } else {
      var sol=q.solution.map(function(st){ return '<div class="sol-step">'+st+'</div>'; }).join('');
      fb='<div class="feedback wrong"><div class="fb-head">❌ '+WCM.t('wrong')+'</div>'+
         '<div class="fb-ans">'+WCM.t('correctAnswer')+': <b>'+q.answer+'</b></div>'+
         '<div class="fb-sol"><div class="sol-label">'+WCM.t('solution')+':</div>'+sol+'</div></div>';
    }
    fb+='<button class="btn primary big next-btn" data-action="next">'+WCM.t('next')+' ›</button>';
  }

  return '<div class="screen level">'+ (s.level.boss?'<div class="boss-bg"></div>':'<div class="forest-bg"></div>') +
    head+'<div class="content lvl-content">'+
      svgHtml+
      '<div class="q-display'+longCls+'">'+q.display+'</div>'+
      hintHtml+body+fb+
    '</div></div>';
};

/* ---------- reward ---------- */
WCM.ui.renderReward = function(){
  var s=WCM.ui.session; if(!s) return '';
  var rp=rankProgress();
  var preyHtml=''; var keys=Object.keys(s.gainedPrey);
  if(keys.length===0) preyHtml='<div class="prey-none">'+WCM.t('noStars')+'</div>';
  keys.forEach(function(k){ var pr=WCM.preyBy(k); preyHtml+='<div class="prey-item">'+pr.emoji+'<div class="pi-name">'+WCM.preyName(pr)+'</div><div class="pi-cnt">×'+s.gainedPrey[k]+'</div></div>'; });
  var rankUpHtml = s.rankUp ? '<div class="rankup"><div class="ru-label">'+WCM.t('rankUp')+'</div>'+
      '<div class="ru-emoji">'+s.rankUp.emoji+'</div><div class="ru-text">'+WCM.t('newRank')+' <b>'+WCM.rankName(s.rankUp)+'</b>!</div></div>' : '';
  var badgeHtml='';
  if(s.badgeEarned){
    var region = WCM.regionOfLevel(s.level.id);
    var badge = WCM.BADGES[region.id];
    badgeHtml='<div class="badge-earned"><div class="be-emoji">'+badge.emoji+'</div>'+
      '<div class="be-label">'+WCM.t('badgeEarned')+'</div>'+
      '<div class="be-name">'+WCM.badgeName(badge)+'</div></div>';
  }
  var cardHtml='';
  if(s.cardEarned){
    cardHtml='<div class="card-reveal"><div class="cr-label">✨ '+WCM.t('newCard')+' ✨</div>'+
      WCM.svg.card(s.cardEarned,{big:true})+
      '<div class="cr-blurb">'+WCM.cardBlurb(s.cardEarned)+'</div></div>';
  }
  return '<div class="screen reward"><div class="forest-bg"></div>'+
    '<div class="content reward-content">'+
      '<h2>'+WCM.t('levelComplete')+'</h2>'+
      '<div class="big-stars">'+bestStars(s.stars)+'</div>'+
      cardHtml+rankUpHtml+badgeHtml+
      '<div class="prey-grid">'+preyHtml+'</div>'+
      '<div class="reward-stats"><div class="rs-item"><span>'+WCM.t('pointsGained')+'</span><b>+'+s.gainedPts+'</b></div>'+
        '<div class="rs-item"><span>'+WCM.t('score')+'</span><b>'+s.correct+'/'+s.total+'</b></div>'+(s.bonus?'<div class="rs-item"><span>'+WCM.t('completeBonus')+'</span><b>+'+s.bonus+'</b></div>':'')+'</div>'+
      '<div class="cur-rank">'+rp.r.emoji+' '+WCM.rankName(rp.r)+' · '+rp.pts+' '+WCM.t('points')+'</div>'+
      '<div class="reward-actions">'+
        '<button class="btn primary" data-action="replay">↻ '+WCM.t('replay')+'</button>'+
        '<button class="btn" data-action="map">🗺️ '+WCM.t('chooseLevel')+'</button>'+
      '</div>'+
    '</div></div>';
};

/* ---------- settings ---------- */
WCM.ui.renderCards = function(){
  var html = WCM.CARDS.map(function(c){
    var got = WCM.hasCard(c.id);
    var svg = WCM.svg.card(c, got?{}:{hidden:true});
    return '<div class="album-card'+(got?'':' locked')+'" data-action="view-card" data-id="'+c.id+'">'+svg+
      (got?'':'<div class="album-lock">🔒</div>')+'</div>';
  }).join('');
  return '<div class="screen cards"><div class="forest-bg"></div>'+
    statusBar()+
    '<div class="content">'+
      '<div class="region-head"><h2>🃏 '+WCM.t('cardAlbum')+'</h2>'+
      '<p class="region-desc">'+WCM.cardCount()+' / '+WCM.CARDS.length+' '+WCM.t('collected')+'</p></div>'+
      '<div class="album-grid">'+html+'</div>'+
      '<p class="lang-hint">'+WCM.t('cardView')+'</p>'+
    '</div></div>';
};

WCM.ui.renderCardView = function(){
  var c = WCM.cardById(WCM.ui.viewCardId||WCM.CARDS[0].id);
  var got = WCM.hasCard(c.id);
  return '<div class="screen cardview"><div class="forest-bg"></div>'+
    statusBar()+
    '<div class="content cardview-content">'+
      '<div class="cv-card">'+WCM.svg.card(c, got?{big:true}:{hidden:true,big:true})+'</div>'+
      '<div class="cv-blurb">'+(got?WCM.cardBlurb(c):WCM.t('undiscovered'))+'</div>'+
    '</div></div>';
};

WCM.ui.renderSettings = function(){
  var en = WCM.lang==='en'?' active':'';
  var zh = WCM.lang==='zh-TW'?' active':'';
  var son = WCM.state.sound;
  return '<div class="screen settings"><div class="forest-bg"></div>'+
    '<div class="content">'+
      '<div class="lvl-head"><button class="icon-btn" data-action="home">‹</button><div class="lvl-title">'+WCM.t('settings')+'</div></div>'+
      '<div class="set-row"><label>'+WCM.t('language')+'</label>'+
        '<div class="seg"><button class="seg-btn'+en+'" data-action="lang-en">'+WCM.t('en')+'</button>'+
        '<button class="seg-btn'+zh+'" data-action="lang-zh">'+WCM.t('zh-TW')+'</button></div></div>'+
      '<div class="set-row"><label>'+WCM.t('sound')+'</label>'+
        '<div class="seg"><button class="seg-btn'+(son?' active':'')+'" data-action="sound-on">'+WCM.t('on')+'</button>'+
        '<button class="seg-btn'+(!son?' active':'')+'" data-action="sound-off">'+WCM.t('off')+'</button></div></div>'+
    '<div class="set-row auth-set">'+(WCM.isLoggedIn()
      ? '<div><label>'+WCM.t('authLoggedInAs')+'</label><div class="auth-email-display">'+WCM.auth.email+'</div></div><button class="btn" data-action="logout">'+WCM.t('authLogout')+'</button>'
      : '<button class="btn primary" data-action="auth">🔑 '+WCM.t('authLogin')+' / '+WCM.t('authRegister')+'</button>')+
    '</div>'+
    '<button class="btn danger" data-action="reset">'+(WCM.lang==='zh-TW'?'重置進度':'Reset Progress')+'</button>'+
    '</div></div>';
};

WCM.ui.renderAuth = function(){
  var mode = WCM.ui.authMode || 'login';
  var isReg = mode === 'register';
  var title = isReg ? WCM.t('authRegisterTitle') : WCM.t('authLoginTitle');
  var btnLabel = isReg ? WCM.t('authRegisterBtn') : WCM.t('authLoginBtn');
  var switchLink = isReg
    ? '<button class="btn ghost small" data-action="auth-mode-login">'+WCM.t('authHaveAccount')+'</button>'
    : '<button class="btn ghost small" data-action="auth-mode-register">'+WCM.t('authNoAccount')+'</button>';
  var errHtml = WCM.ui.authError ? '<div class="auth-error">⚠ '+WCM.ui.authError+'</div>' : '';
  var syncNote = '<p class="auth-note">'+(isReg?'✓ ':'☁ ')+(isReg?WCM.t('authCloudSync'):WCM.t('authLocalOnly'))+'</p>';
  return '<div class="screen auth"><div class="forest-bg"></div>'+
    '<div class="content">'+
      '<div class="lvl-head"><button class="icon-btn" data-action="home">‹</button><div class="lvl-title">'+title+'</div></div>'+
      '<div class="auth-form">'+
        '<div class="auth-cat">🐱</div>'+
        '<label>'+WCM.t('authEmail')+'</label>'+
        '<input id="auth-email" type="email" autocomplete="email" placeholder="you@example.com">'+
        '<label>'+WCM.t('authPassword')+'</label>'+
        '<input id="auth-password" type="password" autocomplete="'+(isReg?'new-password':'current-password')+'" placeholder="'+WCM.t('authPasswordHint')+'">'+
        errHtml+
        '<button class="btn primary big" data-action="'+(isReg?'auth-register':'auth-login')+'">'+btnLabel+'</button>'+
        switchLink+syncNote+
      '</div>'+
    '</div></div>';
};
WCM.ui.doLogin = function(){
  var email = (document.getElementById('auth-email')||{}).value || '';
  var password = (document.getElementById('auth-password')||{}).value || '';
  if(!email || !password){ WCM.ui.authError = WCM.t('authError'); WCM.ui.render(); return; }
  WCM.login(email, password).then(function(res){
    if(res.error){ WCM.ui.authError = res.error; WCM.ui.render(); return; }
    WCM.setAuth({ token: res.token, email: res.user.email });
    WCM.cloudPull().then(function(){
      WCM.ui.authError=''; WCM.ui.toast(WCM.t('authLoginSuccess')); WCM.ui.go('home');
    });
  }).catch(function(){ WCM.ui.authError = WCM.t('authError'); WCM.ui.render(); });
};
WCM.ui.doRegister = function(){
  var email = (document.getElementById('auth-email')||{}).value || '';
  var password = (document.getElementById('auth-password')||{}).value || '';
  if(!email || !password){ WCM.ui.authError = WCM.t('authError'); WCM.ui.render(); return; }
  WCM.register(email, password, WCM.state).then(function(res){
    if(res.error){ WCM.ui.authError = res.error; WCM.ui.render(); return; }
    WCM.setAuth({ token: res.token, email: res.user.email });
    WCM.ui.authError=''; WCM.ui.toast(WCM.t('authRegisterSuccess')); WCM.ui.go('home');
  }).catch(function(){ WCM.ui.authError = WCM.t('authError'); WCM.ui.render(); });
};

/* ---------- interaction ---------- */
WCM.ui.handleClick = function(e){
  var node = e.target.closest('[data-action]'); if(!node) return;
  var a = node.getAttribute('data-action');
  WCM.audio.resume();
  switch(a){
    case 'play': WCM.audio.click(); WCM.ui.go('regions'); break;
    case 'settings': WCM.audio.click(); WCM.ui.go('settings'); break;
    case 'home': WCM.audio.click(); WCM.ui.go('home'); break;
    case 'auth': WCM.audio.click(); WCM.ui.authError=''; WCM.ui.authMode='login'; WCM.ui.go('auth'); break;
    case 'auth-mode-login': WCM.audio.click(); WCM.ui.authMode='login'; WCM.ui.authError=''; WCM.ui.render(); break;
    case 'auth-mode-register': WCM.audio.click(); WCM.ui.authMode='register'; WCM.ui.authError=''; WCM.ui.render(); break;
    case 'auth-login': WCM.ui.doLogin(); break;
    case 'auth-register': WCM.ui.doRegister(); break;
    case 'logout':
      if(confirm(WCM.t('authLogoutConfirm'))){ WCM.logoutCloud().then(function(){ WCM.ui.render(); }); }
      break;
    case 'territories': WCM.audio.click(); WCM.ui.go('regions'); break;
    case 'map': WCM.audio.click(); WCM.ui.go('map'); break;
    case 'select-region':
      WCM.audio.click();
      WCM.ui.currentRegion = WCM.regionById(node.getAttribute('data-id'));
      if(!WCM.hasVisited(WCM.ui.currentRegion.id) && WCM.chapterForRegion(WCM.ui.currentRegion.id)){
        WCM.ui.go('story');
      } else {
        WCM.markVisited(WCM.ui.currentRegion.id);
        WCM.ui.go('map');
      }
      break;
    case 'enter-map':
      WCM.audio.click();
      if(WCM.ui.currentRegion) WCM.markVisited(WCM.ui.currentRegion.id);
      WCM.ui.go('map'); break;
    case 'start-level':
      WCM.audio.click();
      var sl = WCM.levelById(node.getAttribute('data-id'));
      if(!WCM.isLevelUnlocked(sl)){ WCM.ui.toast(sl.boss?WCM.t('lockBoss'):WCM.t('lockLevel')); break; }
      WCM.ui.startLevel(sl); break;
    case 'locked-level':
      WCM.audio.click();
      var ll = WCM.levelById(node.getAttribute('data-id'));
      WCM.ui.toast(ll.boss?WCM.t('lockBoss'):WCM.t('lockLevel')); break;
    case 'claim-daily': WCM.claimDailyBonus(); WCM.ui.render(); break;
    case 'random-hunt':
      WCM.audio.click();
      var rLevels = WCM.ui.currentRegion ? WCM.levelsInRegion(WCM.ui.currentRegion.id) : WCM.LEVELS;
      var rPool = rLevels.filter(function(l){ return !l.boss && WCM.isLevelUnlocked(l); });
      if(rPool.length) WCM.ui.startLevel(pick(rPool)); break;
    case 'lang-en': WCM.setLang('en'); WCM.ui.render(); break;
    case 'lang-zh': WCM.setLang('zh-TW'); WCM.ui.render(); break;
    case 'lang-toggle': WCM.setLang(WCM.lang==='en'?'zh-TW':'en'); WCM.ui.render(); break;
    case 'cards': WCM.audio.click(); WCM.ui.go('cards'); break;
    case 'mistakes': WCM.audio.click(); WCM.ui.go('mistakes'); break;
    case 'review': WCM.audio.click(); WCM.ui.startReview(); break;
    case 'grade': WCM.audio.click(); WCM.ui.go('grade'); break;
    case 'set-grade': WCM.audio.click(); WCM.setGrade(parseInt(node.getAttribute('data-grade'),10)||1); WCM.ui.go('home'); break;
    case 'daily-checkin': WCM.audio.click(); WCM.ui.startDailyCheckin(); break;
    case 'ai-summary':
      WCM.audio.click();
      WCM.ui.aiText = WCM.t('aiAnalyzing');
      WCM.ui.render();
      WCM.api('ai-summary','POST').then(function(res){
        if(res && res.configured===false){ WCM.ui.aiText = WCM.t('aiNotConfigured'); }
        else if(res && res.summaries && res.summaries.length){ WCM.ui.aiText = res.summaries[0].text; WCM.syncLearningMirror(); }
        else if(res && res.error){ WCM.ui.aiText = res.error; }
        else { WCM.ui.aiText = WCM.t('noMistakes'); }
        WCM.ui.render();
      }).catch(function(e){ WCM.ui.aiText = String(e); WCM.ui.render(); });
      break;
    case 'view-card': WCM.ui.viewCardId = node.getAttribute('data-id'); WCM.audio.click(); WCM.ui.go('cardview'); break;
    case 'sound-on': WCM.setSound(true); WCM.audio.click(); WCM.ui.render(); break;
    case 'sound-off': WCM.setSound(false); WCM.ui.render(); break;
    case 'reset':
      if(confirm(WCM.lang==='zh-TW'?'確定重置所有進度？':'Reset all progress?')){
        WCM.state=WCM.defaultState(); WCM.lang='en'; WCM.saveState(); WCM.ui.render();
      } break;
    case 'hint': WCM.ui.session.hintShown=true; WCM.ui.render(); break;
    case 'key': WCM.ui.keypad(node.getAttribute('data-key')); break;
    case 'clear': WCM.ui.keypad('clear'); break;
    case 'del': WCM.ui.keypad('del'); break;
    case 'submit': WCM.ui.submit(); break;
    case 'mc': WCM.ui.gradeCurrent(node.getAttribute('data-val')); break;
    case 'next': WCM.ui.next(); break;
    case 'replay': WCM.audio.click(); WCM.ui.startLevel(WCM.ui.session.level); break;
  }
};

WCM.ui.keypad = function(key){
  var s=WCM.ui.session; if(!s||s.answered) return;
  if(key==='del'){ s.input=s.input.slice(0,-1); }
  else if(key==='clear'){ s.input=''; }
  else if(key==='.'){ if(s.input.indexOf('.')===-1 && s.input.length>0) s.input+='.'; }
  else { if(s.input.length<8) s.input+=key; }
  WCM.audio.click();
  var el=document.getElementById('answer-display');
  if(el){ el.textContent=s.input||''; el.classList.remove('shake'); }
  var sb=document.querySelector('[data-action="submit"]'); if(sb) sb.classList.toggle('disabled', s.input.length===0);
};

WCM.ui.submit = function(){
  var s=WCM.ui.session; if(!s||s.answered) return;
  if(s.input.length===0) return;
  WCM.ui.gradeCurrent(s.input);
};

WCM.ui.gradeCurrent = function(val){
  var s=WCM.ui.session; if(!s||s.answered) return;
  var q=s.questions[s.idx];
  var lv = s.curLevel || s.level;
  s.selected = (q.type==='mc')?val:null;
  s.answered=true; s.lastVal=val; s.lastCorrect=WCM.isCorrect(q,val);
  if(s.lastCorrect){
    s.streak = s.streak>=0 ? s.streak+1 : 1;
    if(!s.isReview && s.streak>=2 && s.tier<2){ s.tier++; s.streak=0; }
    var bonus = s.tier*2;
    s.correct++; s.gainedPts+=q.pts+bonus; s.gainedPrey[q.prey]=(s.gainedPrey[q.prey]||0)+1;
    WCM.addReward(q.prey,q.pts+bonus); WCM.audio.correct(); WCM.trackCorrect();
    if(!s.isReview) WCM.markMastered(lv, q);
  } else {
    s.streak = s.streak<=0 ? s.streak-1 : -1;
    if(!s.isReview && s.streak<=-3 && s.tier>0){ s.tier--; s.streak=0; }
    WCM.audio.wrong();
  }
  var _dur = s.qStart ? (Date.now()-s.qStart) : null;
  WCM.recordAttempt(lv, q, s.lastCorrect, val, s.tier, _dur);
  if(s.isReview){ var _o=s.reviewOrigins[s.idx]; if(_o) WCM.scheduleReview(_o, s.lastCorrect); }
  WCM.ui.render();
};

WCM.ui.next = function(){
  var s=WCM.ui.session; s.idx++;
  if(s.idx>=s.total){ WCM.ui.finish(); return; }
  if(s.isReview){
    var item = s.reviewQueue[s.idx];
    s.curLevel = item.level;
    s.questions.push(item.q);
    s.reviewOrigins.push(item.originKey);
  } else {
    WCM.setGenTier(s.tier);
    var q = WCM.generateUnique(s.level, s.seenKeys);
    s.seenKeys[WCM.qKey(s.level, q)] = true;
    s.questions.push(q);
  }
  s.answered=false; s.input=''; s.hintShown=false; s.selected=null; s.qStart=Date.now();
  WCM.ui.render();
};

WCM.ui.finish = function(){
  var s=WCM.ui.session; var total=s.total; var acc=s.correct/total;
  WCM.trackHuntComplete();
  var stars = acc>=0.9?3:acc>=0.7?2:acc>=0.5?1:0;
  s.stars=stars;
  if(!s.isReview) WCM.recordLevel(s.level.id, stars, s.correct);
  s.bonus = stars>0 ? stars*5 : 0;
  if(s.bonus>0){ WCM.state.points += s.bonus; WCM.saveState(); }
  if(!s.isReview && s.level.boss && stars>=2){
    var region=WCM.regionOfLevel(s.level.id);
    s.badgeEarned=WCM.awardBadge(region.id);
    if(s.badgeEarned) WCM.audio.badge();
  }
  var curIdx=WCM.rankIndexAt(WCM.state.points);
  s.rankUp = curIdx>s.startRankIdx ? WCM.RANKS[curIdx] : null;
  var cardId=null;
  if(s.rankUp){ cardId=WCM.signatureCardForRank(curIdx); if(!cardId||WCM.hasCard(cardId)) cardId=WCM.randomUncollectedCard(); }
  else if(s.isReview && stars>=2){ cardId=WCM.randomUncollectedCard(); }
  else if(!s.isReview && s.level.boss && stars>=2){ cardId=WCM.randomUncollectedCard(); }
  if(cardId){ WCM.addCard(cardId); s.cardEarned=WCM.cardById(cardId); }
  if(s.badgeEarned){ /* badge fanfare already played */ }
  else if(s.rankUp) WCM.audio.levelup();
  else if(s.cardEarned) WCM.audio.badge();
  else WCM.audio.star();
  WCM.ui.go('reward');
};

/* ---------- mistake book & review hunt (Phase B) ---------- */
WCM.ui.startReview = function(){
  var due = WCM.getAllMistakes();
  if(!due.length){ WCM.ui.toast(WCM.t('noMistakes')); return; }
  var queue = [], seen = {};
  for(var i=0;i<due.length && queue.length<5;i++){
    var lv = WCM.levelById(due[i].level_id);
    if(!lv) continue;
    seen[due[i].q_key] = true;
    var q = WCM.generateUnique(lv, seen);
    queue.push({ level: lv, q: q, originKey: due[i].q_key });
    seen[WCM.qKey(lv, q)] = true;
  }
  if(!queue.length){ WCM.ui.toast(WCM.t('noMistakes')); return; }
  WCM.ui.session = {
    isReview: true, reviewQueue: queue, reviewOrigins: [queue[0].originKey],
    questions: [queue[0].q], curLevel: queue[0].level, level: queue[0].level,
    idx:0, total: queue.length, correct:0, gainedPts:0, gainedPrey:{},
    tier:1, streak:0, hintShown:false, answered:false, input:'', selected:null,
    seenKeys: seen, startRankIdx: WCM.rankIndexAt(WCM.state.points), badgeEarned:false, qStart: Date.now()
  };
  WCM.ui.go('level');
};

WCM.ui.renderMistakes = function(){
  var active = WCM.getAllMistakes();
  var wp = WCM.weakPointsSorted();
  var reviewHtml = active.length
    ? '<button class="btn primary big" data-action="review">▶ '+WCM.t('startReview')+' ('+active.length+')</button>'
    : '<div class="daily-done-msg">'+WCM.t('noMistakes')+'</div>';
  var listHtml = active.map(function(m){
    var lv = WCM.levelById(m.level_id);
    var name = lv ? WCM.levelName(lv) : (m.kp||'?');
    var icon = lv ? lv.icon : '📝';
    var dueTxt = m.next_review_at ? new Date(m.next_review_at).toLocaleDateString() : '-';
    var disp = m.display || '';
    var ua = (m.user_answer!=null && m.user_answer!=='') ? m.user_answer : '—';
    var ca = m.correct_answer || '';
    var svgHtml = m.svg ? '<div class="q-svg">'+m.svg+'</div>' : '';
    return '<div class="card-row mistake-item"><span class="cr-icon">'+icon+'</span>'+
      '<div class="cr-body"><div class="cr-name">'+name+'</div>'+
      (disp?'<div class="cr-q">'+disp+'</div>':'')+
      svgHtml+
      '<div class="cr-ans"><span class="wrong-ans">'+WCM.t('yourAnswer')+': '+ua+'</span>'+
      '<span class="right-ans">'+WCM.t('correctAnswer')+': '+ca+'</span></div>'+
      '<div class="cr-meta">'+WCM.t('dueNow')+': '+dueTxt+' · ×'+(m.wrong_count||1)+'</div></div></div>';
  }).join('');
  var wpHtml = wp.slice(0,6).map(function(p){
    var pct = Math.round((p.mastery_rate||0)*100);
    var lv = WCM.levelById(p.kp);
    if(!lv){ for(var i=0;i<WCM.LEVELS.length;i++){ if(WCM.LEVELS[i].gen===p.kp){ lv=WCM.LEVELS[i]; break; } } }
    var name = lv ? WCM.levelName(lv) : p.kp;
    return '<div class="card-row"><span class="cr-name">'+name+'</span>'+
      '<div class="bar"><div class="bar-fill" style="width:'+pct+'%"></div></div>'+
      '<span class="cr-meta">'+pct+'%</span></div>';
  }).join('');
  return '<div class="screen mistakes">'+
    '<div class="forest-bg"></div>'+
    statusBar()+
    '<div class="content">'+
      '<h2>📖 '+WCM.t('mistakeBook')+'</h2>'+
      reviewHtml+
      '<h3>📋 '+WCM.t('mistakeBook')+' ('+active.length+')</h3>'+
      listHtml+
      (wp.length ? '<h3>🎯 '+WCM.t('weakPoints')+'</h3>'+wpHtml : '')+
      '<div class="ai-section"><button class="btn" data-action="ai-summary">🤖 '+WCM.t('aiAnalyze')+'</button>'+(WCM.ui.aiText?'<div class="ai-text">'+WCM.ui.aiText+'</div>':'')+'</div>'+
    '</div></div>';
};

/* ---------- grade selection & daily check-in (Phase D) ---------- */
WCM.ui.renderGrade = function(){
  var zh = WCM.lang==='zh-TW';
  var opts = [1,2,3].map(function(s){
    return '<button class="btn big" data-action="set-grade" data-grade="'+s+'">'+WCM.t('grade'+s)+'</button>';
  }).join('');
  return '<div class="screen grade"><div class="forest-bg"></div>'+
    '<div class="content">'+
      '<h2>🎯 '+WCM.t('gradeSelect')+'</h2>'+
      '<p class="story-intro">'+(zh?'選擇年級後，每日打卡會按你的年級出題，錯題也會編入複習。':'Pick your grade and daily hunts will be tailored to it, with your mistakes woven into review.')+'</p>'+
      opts+
      (WCM.state.grade ? '<button class="btn ghost" data-action="home">'+WCM.t('back')+'</button>' : '')+
    '</div></div>';
};

/* Daily check-in: 5 fresh questions from the current grade's unlocked levels
   (adaptive via generateUnique) + up to 2 due mistakes as review. Reuses the
   review-session machinery (curLevel/reviewOrigins) so new questions have
   originKey=null (no scheduleReview) and due mistakes advance their schedule. */
WCM.ui.startDailyCheckin = function(){
  var season = WCM.state.grade || 1;
  var pool = [];
  WCM.REGIONS.forEach(function(r){
    if(r.season !== season) return;
    r.levels.forEach(function(lid){
      var lv = WCM.levelById(lid);
      if(lv && !lv.boss) pool.push(lv);
    });
  });
  if(!pool.length){ WCM.ui.toast(WCM.t('lockLevel')); return; }
  var queue = [], seen = {};
  for(var i=0;i<5;i++){
    var lv = pool[Math.floor(Math.random()*pool.length)];
    var q = WCM.generateUnique(lv, seen);
    queue.push({ level: lv, q: q, originKey: null });
    seen[WCM.qKey(lv,q)] = true;
  }
  var due = WCM.getDueMistakes ? WCM.getDueMistakes() : [];
  for(var j=0;j<due.length && queue.length<7;j++){
    var mlv = WCM.levelById(due[j].level_id);
    if(!mlv) continue;
    seen[due[j].q_key] = true;
    var mq = WCM.generateUnique(mlv, seen);
    queue.push({ level: mlv, q: mq, originKey: due[j].q_key });
    seen[WCM.qKey(mlv,mq)] = true;
  }
  WCM.ui.session = {
    isReview: true, isDaily: true, reviewQueue: queue, reviewOrigins: [queue[0].originKey],
    questions: [queue[0].q], curLevel: queue[0].level, level: queue[0].level,
    idx:0, total: queue.length, correct:0, gainedPts:0, gainedPrey:{},
    tier:1, streak:0, hintShown:false, answered:false, input:'', selected:null,
    seenKeys: seen, startRankIdx: WCM.rankIndexAt(WCM.state.points), badgeEarned:false, qStart: Date.now()
  };
  WCM.ui.go('level');
};
