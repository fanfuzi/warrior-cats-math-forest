/* Warrior Cats Math Forest - auth & cloud sync */
window.WCM = window.WCM || {};

/* ============ AUTH STATE ============ */
WCM.AUTH_KEY = 'wcm_auth';

WCM.getAuth = function(){
  try { return JSON.parse(localStorage.getItem(WCM.AUTH_KEY)); } catch(e){ return null; }
};
WCM.setAuth = function(auth){
  if(auth){ localStorage.setItem(WCM.AUTH_KEY, JSON.stringify(auth)); }
  else { localStorage.removeItem(WCM.AUTH_KEY); }
  WCM.auth = auth || null;
};
WCM.auth = WCM.getAuth();
WCM.isLoggedIn = function(){ return !!(WCM.auth && WCM.auth.token); };

/* ============ API CALLS ============ */
WCM.api = function(path, method, body){
  var headers = { 'Content-Type': 'application/json' };
  if(WCM.auth && WCM.auth.token) headers['Authorization'] = 'Bearer ' + WCM.auth.token;
  var opts = { method: method || 'GET', headers: headers };
  if(body !== undefined && body !== null) opts.body = JSON.stringify(body);
  return fetch('/api/' + path, opts).then(function(r){
    return r.json().catch(function(){ return { error: 'Network error' }; });
  });
};

WCM.register = function(email, password, data){
  return WCM.api('register', 'POST', { email: email, password: password, data: data });
};
WCM.login = function(email, password){
  return WCM.api('login', 'POST', { email: email, password: password });
};
WCM.logoutCloud = function(){
  return WCM.api('logout', 'POST').then(function(){ WCM.setAuth(null); }, function(){ WCM.setAuth(null); });
};

/* ============ CLOUD SYNC ============ */
var _syncTimer = null;
/* Push local state to cloud (debounced 1.5s). Called by WCM.saveState when logged in. */
WCM.cloudPush = function(){
  if(!WCM.isLoggedIn()) return;
  if(_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function(){
    WCM.api('data', 'PUT', { data: WCM.state }).then(function(res){
      if(res && res.error === 'Unauthorized'){ WCM.setAuth(null); }
    });
  }, 1500);
};

/* Pull cloud data on login - cloud is source of truth when logged in.
   Returns true if cloud data was found and applied. */
WCM.cloudPull = function(){
  return WCM.api('data', 'GET').then(function(res){
    if(res && res.data){
      var merged = WCM.defaultState();
      var k;
      for(k in merged){ if(k in res.data) merged[k] = res.data[k]; }
      WCM.state = merged;
      WCM.lang = WCM.state.lang || 'en';
      WCM.saveLocal();
      return true;
    }
    return false;
  });
};

/* On app startup: if we have a token, verify it and pull cloud data */
WCM.restoreSession = function(){
  if(!WCM.isLoggedIn()) return Promise.resolve(false);
  return WCM.api('me', 'GET').then(function(res){
    if(res && res.user){
      WCM.auth.email = res.user.email;
      WCM.setAuth(WCM.auth);
      return WCM.cloudPull().then(function(){ WCM.syncLearningMirror(); return true; });
    }
    WCM.setAuth(null);
    return false;
  }).catch(function(){
    WCM.setAuth(null);
    return false;
  });
};

/* ============ LEARNING DATA SYNC ============ */
/* Pull mistake-book mirror + weak points from cloud (best-effort, for offline UI). */
WCM.syncLearningMirror = function(){
  if(!WCM.isLoggedIn()) return;
  WCM.api('attempts', 'GET').then(function(res){
    if(res && !res.error){
      var m = {};
      (res.mistakes||[]).forEach(function(row){ m[row.q_key] = row; });
      WCM.state.mistakesMirror = m;
      WCM.state.weakPoints = res.weakPoints || [];
      WCM.saveLocal();
    }
  }).catch(function(){});
};
