/* Warrior Cats Math Forest - weak-point micro-lessons (Phase F)
   CPA (Concrete -> Pictorial -> Abstract) lessons tied to knowledge points
   (level.gen). Each lesson teaches the concept, then a short guided practice
   reuses the level session; finishing unlocks a "consolidation hunt" on the
   linked practice level so mastery updates and the weak point can recover.
   Loop: diagnose (weak_points) -> recommend lesson -> learn -> guided ->
   consolidate hunt -> re-diagnose. Add a course object to WCM.COURSES to
   cover another knowledge point. */
window.WCM = window.WCM || {};

/* Pick a string from a bilingual {en,'zh-TW'} object. */
WCM.lt = function(obj){
  if(obj == null) return '';
  if(typeof obj === 'string') return obj;
  return obj[WCM.lang] || obj['en'] || obj['zh-TW'] || '';
};

/* Find the first level whose generator matches a knowledge point. */
WCM.levelByGen = function(gen){
  for(var i=0;i<WCM.LEVELS.length;i++){ if(WCM.LEVELS[i].gen===gen) return WCM.LEVELS[i]; }
  return null;
};

/* Resolve a static bilingual guided-question descriptor into a plain q object
   (same shape as the gen functions return) for the level-session renderer. */
WCM.resolveQ = function(gq){
  var ans = gq.answer;
  if(ans && typeof ans === 'object') ans = WCM.lt(ans);
  return {
    type: gq.type || 'input',
    display: WCM.lt(gq.display),
    answer: ans,
    choices: gq.choices ? gq.choices.map(function(c){ return (c && typeof c==='object') ? WCM.lt(c) : c; }) : null,
    svg: typeof gq.svg === 'function' ? gq.svg() : (gq.svg || null),
    hint: WCM.lt(gq.hint),
    solution: (gq.solution||[]).map(function(s){ return (s && typeof s==='object') ? WCM.lt(s) : s; }),
    prey: gq.prey || 'mouse',
    pts: gq.pts || 1,
    diff: gq.diff || 1
  };
};

WCM.courseForKp = function(kp){
  for(var i=0;i<WCM.COURSES.length;i++){ if(WCM.COURSES[i].kp===kp) return WCM.COURSES[i]; }
  return null;
};
WCM.courseById = function(id){
  for(var i=0;i<WCM.COURSES.length;i++){ if(WCM.COURSES[i].id===id) return WCM.COURSES[i]; }
  return null;
};

/* Local mastery estimate per kp from the recent attempts cache (offline
   fallback when cloud weak_points have not synced yet). */
WCM.localWeakKps = function(){
  var cache = WCM.state.attemptsCache || [];
  var byKp = {};
  for(var i=0;i<cache.length;i++){
    var a = cache[i], kp = a.kp; if(!kp) continue;
    if(!byKp[kp]) byKp[kp] = { kp:kp, attempts:0, correct:0 };
    byKp[kp].attempts++; if(a.correct) byKp[kp].correct++;
  }
  var out = [];
  for(var k in byKp){
    var r = byKp[k];
    r.mastery_rate = r.attempts ? r.correct/r.attempts : 0;
    out.push(r);
  }
  return out;
};

/* Weak knowledge points (<70% mastery, >=2 attempts) that have a micro-lesson,
   lowest mastery first. Merges cloud weak_points with the local cache. */
WCM.weakCourseRecommendations = function(){
  var map = {};
  var wp = WCM.state.weakPoints || [];
  for(var i=0;i<wp.length;i++){ var ex=map[wp[i].kp]; if(!ex || (wp[i].mastery_rate||0) < (ex.mastery_rate||0)) map[wp[i].kp] = wp[i]; }
  var local = WCM.localWeakKps();
  for(var j=0;j<local.length;j++){ if(!map[local[j].kp]) map[local[j].kp] = local[j]; }
  var out = [];
  for(var k in map){
    var p = map[k];
    var m = p.mastery_rate==null ? 0 : p.mastery_rate;
    if(m >= 0.7) continue;
    if(p.attempts && p.attempts < 2) continue;
    if(!WCM.courseForKp(p.kp)) continue;
    out.push(p);
  }
  out.sort(function(a,b){ return (a.mastery_rate||0) - (b.mastery_rate||0); });
  return out;
};

/* ============ COURSE CONTENT (CPA) ============ */
WCM.COURSES = [
  /* ---------- 立體圖形 (spatial) ---------- */
  {
    id:'crs_sp_shape', kp:'sp_shape', season:1, practiceLevelId:'s1',
    title:{ en:'Recognizing 3D Shapes', 'zh-TW':'認識立體圖形' },
    steps:[
      { kind:'concrete', heading:{en:'See it in life', 'zh-TW':'生活中找一找'},
        body:{en:'A gift box is a cuboid, a ball is a sphere, an ice-cream cone is a cone. 3D shapes take up space.',
              'zh-TW':'禮盒是長方體、足球是球體、雪糕筒是圓錐體。立體圖形會佔據空間。'},
        svg:function(){ return WCM.svg.cuboid3d('#7c9885')+WCM.svg.sphere3d('#c97b4a')+WCM.svg.cone3d('#e0a35a'); } },
      { kind:'pictorial', heading:{en:'Spot the faces', 'zh-TW':'認識「面」'},
        body:{en:'A cube has 6 equal square faces. A cuboid has 6 rectangular faces. A cylinder has 2 flat circles and 1 curved surface.',
              'zh-TW':'正方體有 6 個一樣大的正方形面；長方體有 6 個長方形面；圓柱體有 2 個平的圓面和 1 個曲面。'},
        svg:function(){ return WCM.svg.cube3d('#6b8e3c'); } },
      { kind:'abstract', heading:{en:'Names to remember', 'zh-TW':'記住名字'},
        body:{en:'Learn the shape names and what they look like.',
              'zh-TW':'記住立體圖形的名字和樣子。'},
        formula:{en:'Cube · Cuboid · Cylinder · Cone · Sphere · Prism · Pyramid', 'zh-TW':'正方體 · 長方體 · 圓柱體 · 圓錐體 · 球體 · 三角柱體 · 四角錐體'} }
    ],
    guided:[
      { type:'mc', prey:'squirrel', pts:2, diff:1,
        display:{en:'What 3D shape is this?', 'zh-TW':'這是什麼立體圖形？'},
        answer:{en:'Cuboid', 'zh-TW':'長方體'},
        choices:[{en:'Cube','zh-TW':'正方體'},{en:'Cuboid','zh-TW':'長方體'},{en:'Cylinder','zh-TW':'圓柱體'},{en:'Sphere','zh-TW':'球體'}],
        svg:function(){ return WCM.svg.cuboid3d('#7c9885'); },
        hint:{en:'Like a box - 6 rectangular faces.', 'zh-TW':'像盒子一樣，有 6 個長方形面。'},
        solution:[{en:'This is a cuboid - 6 rectangular faces.', 'zh-TW':'這是長方體，有 6 個長方形面。'}] }
    ]
  },
  {
    id:'crs_sp_props', kp:'sp_props', season:1, practiceLevelId:'s2',
    title:{ en:'Faces, Edges & Vertices', 'zh-TW':'立體圖形的面、邊、頂點' },
    steps:[
      { kind:'concrete', heading:{en:'Feel the parts', 'zh-TW':'摸一摸'},
        body:{en:'Flat parts are faces. Where two faces meet is an edge. Where edges meet is a vertex.',
              'zh-TW':'平平的是「面」，兩面相交的是「邊」，邊相交的是「頂點」。'},
        svg:function(){ return WCM.svg.cube3d('#6b8e3c'); } },
      { kind:'pictorial', heading:{en:'Count a cube', 'zh-TW':'數一數正方體'},
        body:{en:'A cube has 6 faces, 12 edges and 8 vertices.',
              'zh-TW':'正方體有 6 個面、12 條邊、8 個頂點。'},
        svg:function(){ return WCM.svg.cube3d('#6b8e3c'); } },
      { kind:'abstract', heading:{en:'Key counts', 'zh-TW':'牢記數量'},
        body:{en:'Memorize the face / edge / vertex counts of common solids.',
              'zh-TW':'記住常見立體圖形的面、邊、頂點數量。'},
        formula:{en:'Cube 6/12/8 · Cuboid 6/12/8 · Cylinder 3/2/0', 'zh-TW':'正方體 6/12/8 · 長方體 6/12/8 · 圓柱體 3/2/0'} }
    ],
    guided:[
      { type:'mc', prey:'squirrel', pts:2, diff:1,
        display:{en:'How many faces does a cube have?', 'zh-TW':'正方體有幾個面？'},
        answer:6,
        choices:[4,6,8,12],
        hint:{en:'A cube has equal square faces.', 'zh-TW':'正方體的面都是一樣大的正方形。'},
        solution:[{en:'A cube has 6 faces.', 'zh-TW':'正方體有 6 個面。'}] }
    ]
  },
  {
    id:'crs_sp_count', kp:'sp_count', season:1, practiceLevelId:'s5',
    title:{ en:'Counting Cubes', 'zh-TW':'數立方體' },
    steps:[
      { kind:'concrete', heading:{en:'Count layer by layer', 'zh-TW':'一層一層數'},
        body:{en:'Count cubes one layer at a time. Hidden cubes underneath count too.',
              'zh-TW':'一層一層數積木，下面藏著的也要算。'},
        svg:function(){ return WCM.svg.cubeStack(2,2,2); } },
      { kind:'pictorial', heading:{en:'Multiply it out', 'zh-TW':'用乘法算'},
        body:{en:'Each layer: 3 x 2 = 6 cubes. Two layers: 6 x 2 = 12.',
              'zh-TW':'每層 3×2=6 個，共 2 層：6×2=12。'},
        svg:function(){ return WCM.svg.cubeStack(3,2,2); } },
      { kind:'abstract', heading:{en:'The formula', 'zh-TW':'計算方法'},
        body:{en:'Total = cubes per layer x number of layers.',
              'zh-TW':'總數 = 每層個數 × 層數。'},
        formula:{en:'Total = (length x width) x layers', 'zh-TW':'總數 =（長 × 寬）× 層數'} }
    ],
    guided:[
      { type:'input', prey:'rabbit', pts:3, diff:3,
        display:{en:'How many cubes in total?', 'zh-TW':'圖中共有多少個立方體？'},
        answer:12,
        svg:function(){ return WCM.svg.cubeStack(3,2,2); },
        hint:{en:'Each layer 3x2=6, two layers.', 'zh-TW':'每層 3×2=6，共 2 層。'},
        solution:[{en:'Each layer 3 x 2 = 6; two layers: 6 x 2 = 12.', 'zh-TW':'每層 3×2=6，共 2 層：6×2=12。'}] }
    ]
  },
  {
    id:'crs_sp_volume', kp:'sp_volume', season:1, practiceLevelId:'s4',
    title:{ en:'Volume', 'zh-TW':'體積' },
    steps:[
      { kind:'concrete', heading:{en:'How much space', 'zh-TW':'佔多少空間'},
        body:{en:'Volume is how much space a solid takes up, measured in cm³.',
              'zh-TW':'體積是物體佔多少空間，用 cm³ 表示。'},
        svg:function(){ return WCM.svg.cuboidLabeled(4,3,2,'cm'); } },
      { kind:'pictorial', heading:{en:'Length x width x height', 'zh-TW':'長 × 寬 × 高'},
        body:{en:'Cuboid volume = length x width x height. 4 x 3 x 2 = 24 cm³.',
              'zh-TW':'長方體體積 = 長 × 寬 × 高。4×3×2=24 cm³。'},
        svg:function(){ return WCM.svg.cuboidLabeled(4,3,2,'cm'); } },
      { kind:'abstract', heading:{en:'The formula', 'zh-TW':'公式'},
        body:{en:'Multiply the three dimensions; the unit is cubic.',
              'zh-TW':'把長、寬、高相乘，單位是立方單位。'},
        formula:{en:'Volume = length x width x height (cm³)', 'zh-TW':'體積 = 長 × 寬 × 高（cm³）'} }
    ],
    guided:[
      { type:'input', prey:'rabbit', pts:3, diff:3,
        display:{en:'Find the volume (cm³).', 'zh-TW':'求體積（cm³）。'},
        answer:30,
        svg:function(){ return WCM.svg.cuboidLabeled(5,2,3,'cm'); },
        hint:{en:'Multiply length x width x height.', 'zh-TW':'長 × 寬 × 高。'},
        solution:[{en:'5 x 2 x 3 = 30 cm³.', 'zh-TW':'5 × 2 × 3 = 30 cm³。'}] }
    ]
  },
  /* ---------- 平面圖形 (geometry) ---------- */
  {
    id:'crs_geo_shape', kp:'geo_shape', season:1, practiceLevelId:'g1',
    title:{ en:'Recognizing 2D Shapes', 'zh-TW':'認識平面圖形' },
    steps:[
      { kind:'concrete', heading:{en:'Flat shapes', 'zh-TW':'平平的圖形'},
        body:{en:'Flat shapes lie in a plane: triangle, square, rectangle, circle.',
              'zh-TW':'平面圖形是平的：三角形、正方形、長方形、圓形。'},
        svg:function(){ return WCM.svg.triangle('#e0a35a')+WCM.svg.square('#6b8e3c')+WCM.svg.rectangle('#7c9885')+WCM.svg.circle('#c97b4a'); } },
      { kind:'pictorial', heading:{en:'Count the sides', 'zh-TW':'數邊數'},
        body:{en:'Triangle 3 sides; quadrilateral 4 sides; circle has no corners.',
              'zh-TW':'三角形 3 條邊；四邊形 4 條邊；圓形沒有角。'},
        svg:function(){ return WCM.svg.triangle('#e0a35a'); } },
      { kind:'abstract', heading:{en:'By side count', 'zh-TW':'按邊數分類'},
        body:{en:'Name polygons by their number of sides.',
              'zh-TW':'按邊數命名多邊形。'},
        formula:{en:'Triangle 3 · Quad 4 · Pentagon 5 · Hexagon 6 · Circle 0', 'zh-TW':'三角形 3 · 四邊形 4 · 五邊形 5 · 六邊形 6 · 圓形 0'} }
    ],
    guided:[
      { type:'mc', prey:'mouse', pts:1, diff:1,
        display:{en:'What shape is this?', 'zh-TW':'這是什麼圖形？'},
        answer:{en:'Triangle', 'zh-TW':'三角形'},
        choices:[{en:'Triangle','zh-TW':'三角形'},{en:'Square','zh-TW':'正方形'},{en:'Rectangle','zh-TW':'長方形'},{en:'Circle','zh-TW':'圓形'}],
        svg:function(){ return WCM.svg.triangle('#e0a35a'); },
        hint:{en:'It has 3 sides.', 'zh-TW':'它有 3 條邊。'},
        solution:[{en:'A triangle has 3 sides.', 'zh-TW':'三角形有 3 條邊。'}] }
    ]
  },
  {
    id:'crs_geo_area', kp:'geo_area', season:1, practiceLevelId:'g4',
    title:{ en:'Area', 'zh-TW':'面積' },
    steps:[
      { kind:'concrete', heading:{en:'How much surface', 'zh-TW':'佔多大面'},
        body:{en:'Area is how much surface a shape covers, measured in cm².',
              'zh-TW':'面積是圖形佔多大平面，用 cm² 表示。'},
        svg:function(){ return WCM.svg.rectLabeled(4,3,'cm'); } },
      { kind:'pictorial', heading:{en:'Count the squares', 'zh-TW':'數方格'},
        body:{en:'Rectangle area = length x width. 4 x 3 = 12 cm².',
              'zh-TW':'長方形面積 = 長 × 寬。4×3=12 cm²。'},
        svg:function(){ return WCM.svg.rectLabeled(4,3,'cm'); } },
      { kind:'abstract', heading:{en:'The formulas', 'zh-TW':'公式'},
        body:{en:'Rectangle: length x width. Square: side x side.',
              'zh-TW':'長方形：長 × 寬；正方形：邊長 × 邊長。'},
        formula:{en:'Rectangle = L x W · Square = side² (cm²)', 'zh-TW':'長方形 = 長 × 寬 · 正方形 = 邊長²（cm²）'} }
    ],
    guided:[
      { type:'input', prey:'thrush', pts:2, diff:2,
        display:{en:'Find the area (cm²).', 'zh-TW':'求面積（cm²）。'},
        answer:20,
        svg:function(){ return WCM.svg.rectLabeled(5,4,'cm'); },
        hint:{en:'Area = length x width.', 'zh-TW':'面積 = 長 × 寬。'},
        solution:[{en:'5 x 4 = 20 cm².', 'zh-TW':'5 × 4 = 20 cm²。'}] }
    ]
  },
  /* ---------- 小數 (decimal) ---------- */
  {
    id:'crs_dec_add', kp:'dec_add', season:1, practiceLevelId:'d3',
    title:{ en:'Adding Decimals', 'zh-TW':'小數加法' },
    steps:[
      { kind:'concrete', heading:{en:'Line up the dots', 'zh-TW':'對齊小數點'},
        body:{en:'Adding decimals is like adding whole numbers, but line up the decimal points.',
              'zh-TW':'小數加法和整數一樣，但要對齊小數點。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Add column by column', 'zh-TW':'逐位相加'},
        body:{en:'2.5 + 1.3: line up the dots, 5+3=8, 2+1=3, answer 3.8.',
              'zh-TW':'2.5 + 1.3：小數點對齊，5+3=8，2+1=3，答 3.8。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The steps', 'zh-TW':'計算步驟'},
        body:{en:'Line up decimal points, add each column, carry if needed, drop the point.',
              'zh-TW':'對齊小數點，逐位相加，滿十進一，最後落下小數點。'},
        formula:{en:'Line up · Add columns · Drop the point', 'zh-TW':'對齊 → 逐位相加 → 落下小數點'} }
    ],
    guided:[
      { type:'input', prey:'fish', pts:2, diff:2,
        display:{en:'2.5 + 1.3 = ?', 'zh-TW':'2.5 + 1.3 = ?'},
        answer:3.8,
        hint:{en:'Line up the decimal points.', 'zh-TW':'小數點對齊。'},
        solution:[{en:'2.5 + 1.3 = 3.8.', 'zh-TW':'2.5 + 1.3 = 3.8。'}] }
    ]
  },
  /* ---------- 四則運算 (mixed) ---------- */
  {
    id:'crs_review', kp:'review', season:1, practiceLevelId:'m1',
    title:{ en:'Four Operations', 'zh-TW':'四則運算' },
    steps:[
      { kind:'concrete', heading:{en:'The basics', 'zh-TW':'基本功'},
        body:{en:'Add puts together, subtract takes away, multiply is repeated adding, divide shares equally.',
              'zh-TW':'加是合起來，減是拿走，乘是連加，除是平分。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Order matters', 'zh-TW':'運算順序'},
        body:{en:'Multiply/divide first, then add/subtract. Brackets first. e.g. 2 + 3 x 4 = 2 + 12 = 14.',
              'zh-TW':'先乘除後加減，有括號先算括號。例：2 + 3×4 = 2+12 = 14。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The rule', 'zh-TW':'運算法則'},
        body:{en:'Brackets first, then x and /, then + and -.',
              'zh-TW':'括號最先，再乘除，後加減。'},
        formula:{en:'( ) -> x / -> + -', 'zh-TW':'（ ）→ × ÷ → + −'} }
    ],
    guided:[
      { type:'input', prey:'vole', pts:1, diff:1,
        display:{en:'6 x 7 = ?', 'zh-TW':'6 × 7 = ?'},
        answer:42,
        hint:{en:'Use the times table.', 'zh-TW':'背乘法表。'},
        solution:[{en:'6 x 7 = 42.', 'zh-TW':'6 × 7 = 42。'}] }
    ]
  },
  /* ---------- 運算律 (laws) ---------- */
  {
    id:'crs_laws', kp:'laws', season:1, practiceLevelId:'m6',
    title:{ en:'Operation Laws', 'zh-TW':'運算律' },
    steps:[
      { kind:'concrete', heading:{en:'Friendly numbers', 'zh-TW':'湊整好幫手'},
        body:{en:'25 x 4 = 100 and 50 x 2 = 100. Spot these round pairs to compute fast.',
              'zh-TW':'25 × 4 = 100，50 × 2 = 100。認出這些「湊整」的好朋友，算得又快又準。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Share it out', 'zh-TW':'分配律'},
        body:{en:'25 x (4 + 8) = 25 x 4 + 25 x 8 = 100 + 200 = 300. Multiply BOTH parts by 25.',
              'zh-TW':'25 × (4 + 8) = 25×4 + 25×8 = 100 + 200 = 300。兩部分都要乘 25。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The laws', 'zh-TW':'運算律'},
        body:{en:'Distributive: a x (b+c) = ab + ac. Associative: (a x b) x c = a x (b x c). Reorder to make round numbers.',
              'zh-TW':'分配律：a×(b+c)=a×b+a×c。結合律：(a×b)×c=a×(b×c)。重新組合讓數字湊整。'},
        formula:{en:'a(b+c)=ab+ac · (ab)c=a(bc)', 'zh-TW':'a(b+c)=ab+ac · (ab)c=a(bc)'} }
    ],
    guided:[
      { type:'input', prey:'rabbit', pts:2, diff:2,
        display:{en:'25 x (4 + 8) = ?', 'zh-TW':'25 × (4 + 8) = ?'},
        answer:300,
        hint:{en:'25 x 4 = 100, 25 x 8 = ?.', 'zh-TW':'25×4=100，25×8=？'},
        solution:[{en:'25 x 4 + 25 x 8 = 100 + 200 = 300.', 'zh-TW':'25×4 + 25×8 = 100 + 200 = 300。'}] }
    ]
  },
  /* ---------- 找錯驗算 (checkwork) ---------- */
  {
    id:'crs_checkwork', kp:'checkwork', season:1, practiceLevelId:'m7',
    title:{ en:'Spot the Mistake', 'zh-TW':'找錯驗算' },
    steps:[
      { kind:'concrete', heading:{en:'Carelessness is the enemy', 'zh-TW':'馬虎是大敵'},
        body:{en:'Most wrong answers come from order of operations or forgetting to distribute. Slow down and check.',
              'zh-TW':'大部分錯誤來自運算順序錯或漏乘。慢一點，回頭檢查。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Estimate to check', 'zh-TW':'估算驗算'},
        body:{en:'3 + 4 x 5: 4x5=20, plus 3 is 23, not 35. Estimate ~20-25 to catch big errors.',
              'zh-TW':'3 + 4×5：4×5=20，加 3 是 23，不是 35。先估算約 20 多，就能發現大錯。'},
        svg:'' },
      { kind:'abstract', heading:{en:'Three anti-slip rules', 'zh-TW':'防馬虎三招'},
        body:{en:'1) Brackets first, then x/, then +-. 2) Distribute to EVERY term. 3) Estimate, then recheck the last step.',
              'zh-TW':'1）括號先，再乘除，後加減。2）分配律要乘到每一項。3）先估算，再回看最後一步。'},
        formula:{en:'( ) -> x/ -> +- · share to all · estimate', 'zh-TW':'（ ）-> ×÷ -> +− · 每項都乘 · 估算'} }
    ],
    guided:[
      { type:'mc', prey:'rabbit', pts:3, diff:3,
        display:{en:'Kitten: 3 + 4 x 5 = 7 x 5 = 35. Correct answer?', 'zh-TW':'小貓算：3 + 4 × 5 = 7 × 5 = 35。正確答案是？'},
        answer:23, choices:[23,35,15,43],
        hint:{en:'Multiply before adding.', 'zh-TW':'先乘除後加減。'},
        solution:[{en:'4 x 5 = 20, 3 + 20 = 23.', 'zh-TW':'4×5=20，3+20=23。'}] }
    ]
  },
  /* ---------- 運算律進階 (laws_adv) ---------- */
  {
    id:'crs_laws_adv', kp:'laws_adv', season:1, practiceLevelId:'m8',
    title:{ en:'Advanced Laws', 'zh-TW':'運算律進階' },
    steps:[
      { kind:'concrete', heading:{en:'Round friends', 'zh-TW':'湊整好朋友'},
        body:{en:'25 x 4 = 100 and 125 x 8 = 1000. Break big numbers into these round pairs to compute fast.',
              'zh-TW':'25 × 4 = 100，125 × 8 = 1000。把大數拆成這些湊整好朋友，算得又快又準。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Near 100 trick', 'zh-TW':'接近 100 的巧算'},
        body:{en:'99 x 47 = (100 - 1) x 47 = 4700 - 47 = 4653. Turn 99, 101, 98, 999 into 100 +/- k.',
              'zh-TW':'99 × 47 = (100 - 1) × 47 = 4700 - 47 = 4653。把 99、101、98、999 看成 100 ± k。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The toolkit', 'zh-TW':'巧算工具箱'},
        body:{en:'Distribute a x (b+c) = ab + ac. Group round pairs. Sum 1..n = (1+n) x n / 2.',
              'zh-TW':'分配律 a×(b+c)=a×b+a×c。結合律湊整配對。1 加到 n = (1+n)×n÷2。'},
        formula:{en:'a(b+c)=ab+ac · 99=100-1 · sum=(1+n)n/2', 'zh-TW':'a(b+c)=ab+ac · 99=100-1 · 和=(1+n)n÷2'} }
    ],
    guided:[
      { type:'input', prey:'rabbit', pts:3, diff:3,
        display:{en:'25 x 44 = ?', 'zh-TW':'25 × 44 = ?'},
        answer:1100,
        hint:{en:'25 x 4 = 100, so split 44 into 40 + 4.', 'zh-TW':'25×4=100，把 44 拆成 40 + 4。'},
        solution:[{en:'25 x (40 + 4) = 25x40 + 25x4 = 1000 + 100 = 1100.', 'zh-TW':'25×(40 + 4) = 25×40 + 25×4 = 1000 + 100 = 1100。'}] }
    ]
  },
  /* ---------- 思考密林：雞兔同籠 (puz_chicken) ---------- */
  {
    id:'crs_puz_chicken', kp:'puz_chicken', season:1, practiceLevelId:'pz5',
    title:{ en:'Chickens & Rabbits', 'zh-TW':'雞兔同籠' },
    steps:[
      { kind:'concrete', heading:{en:'Heads and legs', 'zh-TW':'頭與腳'},
        body:{en:'Each animal has 1 head. A chicken has 2 legs, a rabbit has 4. Count heads and legs to find how many of each.',
              'zh-TW':'每隻動物有 1 個頭。雞有 2 隻腳，兔有 4 隻腳。數清楚頭和腳，就能算出各幾隻。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Assume all chickens', 'zh-TW':'假設全是雞'},
        body:{en:'If all 10 were chickens, there would be 20 legs. But there are 28, so 8 extra legs. Each rabbit adds 2 extra legs, so 8 / 2 = 4 rabbits.',
              'zh-TW':'若 10 隻全是雞，就有 20 隻腳。但實際有 28 隻，多出 8 隻。每隻兔多 2 隻腳，所以 8 ÷ 2 = 4 隻兔。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The formula', 'zh-TW':'公式'},
        body:{en:'Rabbits = (legs - 2 x heads) / 2. Chickens = heads - rabbits.',
              'zh-TW':'兔 = (腳數 - 2 × 頭數) ÷ 2。雞 = 頭數 - 兔數。'},
        formula:{en:'rabbit = (legs - 2*heads)/2', 'zh-TW':'兔 = (腳 - 2×頭) ÷ 2'} }
    ],
    guided:[
      { type:'input', prey:'rabbit', pts:3, diff:3,
        display:{en:'10 heads, 28 legs. How many rabbits?', 'zh-TW':'雞兔同籠，共 10 隻，腳 28 隻。兔有幾隻？'},
        answer:4,
        hint:{en:'Assume all chickens: 20 legs. Extra 8 legs / 2.', 'zh-TW':'假設全是雞：20 隻腳，多出 8 隻，÷ 2。'},
        solution:[{en:'(28 - 2x10) / 2 = 8 / 2 = 4 rabbits.', 'zh-TW':'(28 - 2×10) ÷ 2 = 8 ÷ 2 = 4 隻兔。'}] }
    ]
  },
  /* ---------- 思考密林：還原問題 (puz_restore) ---------- */
  {
    id:'crs_puz_restore', kp:'puz_restore', season:1, practiceLevelId:'pz4',
    title:{ en:'Work Backward', 'zh-TW':'還原問題' },
    steps:[
      { kind:'concrete', heading:{en:'Undo the steps', 'zh-TW':'倒回去走'},
        body:{en:'A number went through some steps to reach a result. To find it, walk the steps backward.',
              'zh-TW':'一個數經過幾步變成結果。要找原數，就把步驟倒著走一遍。'},
        svg:'' },
      { kind:'pictorial', heading:{en:'Reverse each op', 'zh-TW':'反過來運算'},
        body:{en:'+3 then x4 gives 32. Reverse: 32 / 4 = 8, then 8 - 3 = 5. The last step is undone first.',
              'zh-TW':'加 3 再乘 4 得 32。倒推：32 ÷ 4 = 8，再 8 - 3 = 5。最後一步最先還原。'},
        svg:'' },
      { kind:'abstract', heading:{en:'The rule', 'zh-TW':'法則'},
        body:{en:'Reverse the order AND reverse each operation: + becomes -, x becomes /.',
              'zh-TW':'順序倒過來，運算也反過來：加變減，乘變除。'},
        formula:{en:'last op undone first · + <-> - · x <-> /', 'zh-TW':'最後一步先還原 · 加↔減 · 乘↔除'} }
    ],
    guided:[
      { type:'input', prey:'vole', pts:2, diff:2,
        display:{en:'A number +3, then x4, gives 32. Original number?', 'zh-TW':'一個數加 3 再乘 4 得 32，原數是多少？'},
        answer:5,
        hint:{en:'Work backward: divide first, then subtract.', 'zh-TW':'倒推：先除後減。'},
        solution:[{en:'32 / 4 = 8, 8 - 3 = 5.', 'zh-TW':'32 ÷ 4 = 8，8 - 3 = 5。'}] }
    ]
  }
];
