/* Warrior Cats Math Forest - service worker (offline shell) */
var CACHE = 'wcm-v18';
var ASSETS = ['./','./index.html','./css/style.css','./js/i18n.js','./js/visual.js','./js/engine.js','./js/mistakes.js','./js/learning.js','./js/auth.js','./js/ui.js','./js/app.js','./manifest.webmanifest','./assets/icon.svg'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })); self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); })); self.clients.claim(); });
self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(function(resp){
    var cp=resp.clone();
    caches.open(CACHE).then(function(c){ c.put(e.request, cp); }).catch(function(){});
    return resp;
  }).catch(function(){
    return caches.match(e.request).then(function(r){ return r || new Response('', {status:504}); });
  }));
});
