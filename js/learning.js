/* Warrior Cats Math Forest - learning profile & cross-session adaptive difficulty (Phase C) */
window.WCM = window.WCM || {};

/* Mastery rate (0..1) for a knowledge point (kp = level.gen), from weak_points.
   Returns null when there is no data yet. */
WCM.kpMastery = function(kp){
  if(!kp) return null;
  var wp = WCM.state.weakPoints || [];
  for(var i=0;i<wp.length;i++){
    if(wp[i].kp===kp) return wp[i].mastery_rate!=null ? wp[i].mastery_rate : null;
  }
  return null;
};

/* Initial difficulty tier (0=easing, 1=steady, 2=challenge) for a level,
   based on its knowledge-point mastery. Falls back to 1 when no data.
   Target zone: keep success rate in the 70-85% "zone of proximal development". */
WCM.initialTierForLevel = function(level){
  var m = WCM.kpMastery(level && level.gen);
  var masteryTier = m==null ? 0 : (m >= 0.85 ? 2 : m < 0.60 ? 0 : 1);
  var prog = WCM.getProgress(level && level.id);
  var bestTier = (prog && prog.tier) || 0;
  return Math.max(masteryTier, bestTier);
};

/* Mastery percentage (0-100) for display, or null. */
WCM.masteryPct = function(level){
  var m = WCM.kpMastery(level && level.gen);
  return m==null ? null : Math.round(m*100);
};
