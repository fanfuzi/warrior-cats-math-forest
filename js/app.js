/* Warrior Cats Math Forest - bootstrap & router */
window.WCM = window.WCM || {};
WCM.app = {
  init: function(){
    WCM.checkDaily();
    var el = document.getElementById('app');
    el.addEventListener('click', WCM.ui.handleClick);
    // stop iOS double-tap zoom delay on buttons
    el.addEventListener('touchstart', function(){}, {passive:true});
    WCM.ui.render();
    // PWA service worker (only when served over http/https)
    if('serviceWorker' in navigator && location.protocol.indexOf('http')===0){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    }
  }
};
document.addEventListener('DOMContentLoaded', WCM.app.init);
