/* Warrior Cats Math Forest - engine: generators, grader, state, storage, audio */
window.WCM = window.WCM || {};

/* ---------- helpers ---------- */
var _gTier = 1; /* 0=easy, 1=normal, 2=hard — adaptive difficulty bias */
function ri(min, max){
  var r = Math.random();
  if(_gTier===0) r = r*r;                /* easy: bias toward smaller values */
  else if(_gTier===2) r = 1-(1-r)*(1-r); /* hard: bias toward larger values  */
  return Math.floor(r*(max-min+1))+min;
}
WCM.setGenTier = function(t){ _gTier = t; };
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function fmtDec(n){ return Math.round(n*100)/100; }
function decStr(n){ return String(fmtDec(n)); }

function step1(op, expr, val){ return WCM.lang==='zh-TW' ? '先'+op+'：'+expr+' = '+val : 'First, '+op+': '+expr+' = '+val; }
function step2(op, expr, val){ return WCM.lang==='zh-TW' ? '再'+op+'：'+expr+' = '+val : 'Then, '+op+': '+expr+' = '+val; }
function step3(op, expr, val){ return WCM.lang==='zh-TW' ? '最後'+op+'：'+expr+' = '+val : 'Finally, '+op+': '+expr+' = '+val; }
function line(op, expr, val){ return WCM.lang==='zh-TW' ? op+'：'+expr+' = '+val : cap(op)+': '+expr+' = '+val; }

function makeNumChoices(correct, distractors){
  var set = {}, arr = [correct]; set[correct] = true;
  for(var i=0;i<distractors.length;i++){ var d=distractors[i]; if(d!==correct && d>=0 && arr.length<4 && !(d in set)){ set[d]=true; arr.push(d); } }
  var tries=0;
  while(arr.length<4 && tries<30){ var d=correct+ri(-6,6); if(d!==correct && d>=0 && !(d in set)){ set[d]=true; arr.push(d);} tries++; }
  return shuffle(arr).map(String);
}
function makeTextChoices(correct, pool){
  var arr=[String(correct)], seen={}; seen[String(correct)]=true;
  for(var i=0;i<pool.length && arr.length<4;i++){ var s=String(pool[i]); if(!seen[s]){ seen[s]=true; arr.push(s); } }
  return shuffle(arr);
}

function mkQ(display, answer, solution, hint, diff, type, choices, svg){
  var pkey = WCM.preyForDiff(diff);
  var prey = WCM.preyBy(pkey);
  return { type:type||'input', display:display, answer:answer, solution:solution,
           hint:hint, prey:pkey, pts:prey.pts, diff:diff, choices:choices, svg:svg||null };
}

/* ---------- shape data ---------- */
var SHAPES_2D = [
  { key:'triangle',      color:'#f4a738', svg:WCM.svg.triangle,      t:'triangle' },
  { key:'square',        color:'#5b9bd5', svg:WCM.svg.square,        t:'square' },
  { key:'rectangle',     color:'#5cb85c', svg:WCM.svg.rectangle,     t:'rectangle' },
  { key:'circle',        color:'#e0654a', svg:WCM.svg.circle,        t:'circle' },
  { key:'pentagon',      color:'#9b59b6', svg:WCM.svg.pentagon,      t:'pentagon' },
  { key:'hexagon',       color:'#2bb8a7', svg:WCM.svg.hexagon,       t:'hexagon' },
  { key:'parallelogram', color:'#e9688b', svg:WCM.svg.parallelogram, t:'parallelogram' },
  { key:'trapezium',     color:'#d4881a', svg:WCM.svg.trapezium,     t:'trapezium' },
  { key:'rhombus',       color:'#7d3c98', svg:WCM.svg.rhombus,       t:'rhombus' }
];
var SHAPES_3D = [
  { key:'cube',     color:'#5b9bd5', svg:WCM.svg.cube3d,     t:'cube',     faces:6, edges:12, vertices:8 },
  { key:'cuboid',   color:'#5cb85c', svg:WCM.svg.cuboid3d,   t:'cuboid',   faces:6, edges:12, vertices:8 },
  { key:'cylinder', color:'#2bb8a7', svg:WCM.svg.cylinder3d, t:'cylinder', faces:3, edges:2,  vertices:0 },
  { key:'cone',     color:'#f4a738', svg:WCM.svg.cone3d,     t:'cone',     faces:2, edges:1,  vertices:1 },
  { key:'sphere',   color:'#e0654a', svg:WCM.svg.sphere3d,   t:'sphere',   faces:1, edges:0,  vertices:0 },
  { key:'prism',    color:'#9b59b6', svg:WCM.svg.prism3d,    t:'prism',    faces:5, edges:9,  vertices:6 },
  { key:'pyramid',  color:'#e9688b', svg:WCM.svg.pyramid3d,  t:'pyramid',  faces:5, edges:8,  vertices:5 }
];
var NETS = [
  { key:'cube',     svg:WCM.svg.netCube,     t:'cube' },
  { key:'cylinder', svg:WCM.svg.netCylinder, t:'cylinder' },
  { key:'cone',     svg:WCM.svg.netCone,     t:'cone' },
  { key:'prism',    svg:WCM.svg.netPrism,    t:'prism' },
  { key:'pyramid',  svg:WCM.svg.netPyramid,  t:'pyramid' }
];

/* ================ REGION 1: MIXED OPERATIONS ================ */
function genReview(){
  var op = pick(['+','-','×','÷']);
  var a,b,ans;
  if(op==='+'){ a=ri(1000,9999); b=ri(1000,9999); ans=a+b; }
  else if(op==='-'){ a=ri(3000,9999); b=ri(100,a); ans=a-b; }
  else if(op==='×'){ a=ri(12,49); b=ri(3,9); ans=a*b; }
  else { b=ri(3,9); var q=ri(8,15); a=b*q; ans=q; }
  var display = a+' '+op+' '+b+' = ?';
  var sol = [ line(WCM.t(op), a+' '+op+' '+b, ans) ];
  var hint = WCM.lang==='zh-TW' ? ('算出 '+a+' '+op+' '+b) : ('Work out '+a+' '+op+' '+b);
  return mkQ(display, ans, sol, hint, 1, 'input', null, null);
}

function genOrder(){
  var f = pick(['a+bc','a-bc','ab+c','ab-c','a+bdc','adb+c']);
  var a,b,c,mid,ans,expr,midExpr,finalExpr,midOp,finalOp;
  if(f==='a+bc'){ a=ri(20,99); b=ri(4,9); c=ri(4,9); mid=b*c; ans=a+mid; expr=a+' + '+b+' × '+c; midExpr=b+' × '+c; finalExpr=a+' + '+mid; midOp='×'; finalOp='+'; }
  else if(f==='a-bc'){ a=ri(60,120); b=ri(4,9); c=ri(4,9); mid=b*c; while(mid>=a){ a+=20; } ans=a-mid; expr=a+' - '+b+' × '+c; midExpr=b+' × '+c; finalExpr=a+' - '+mid; midOp='×'; finalOp='-'; }
  else if(f==='ab+c'){ a=ri(4,9); b=ri(4,9); c=ri(15,80); mid=a*b; ans=mid+c; expr=a+' × '+b+' + '+c; midExpr=a+' × '+b; finalExpr=mid+' + '+c; midOp='×'; finalOp='+'; }
  else if(f==='ab-c'){ a=ri(5,9); b=ri(5,9); mid=a*b; c=ri(10, Math.max(11,mid-1)); ans=mid-c; expr=a+' × '+b+' - '+c; midExpr=a+' × '+b; finalExpr=mid+' - '+c; midOp='×'; finalOp='-'; }
  else if(f==='a+bdc'){ c=ri(3,9); var q=ri(4,9); b=c*q; a=ri(30,99); mid=q; ans=a+mid; expr=a+' + '+b+' ÷ '+c; midExpr=b+' ÷ '+c; finalExpr=a+' + '+mid; midOp='÷'; finalOp='+'; }
  else { b=ri(3,9); var q2=ri(4,9); a=b*q2; c=ri(15,80); mid=q2; ans=mid+c; expr=a+' ÷ '+b+' + '+c; midExpr=a+' ÷ '+b; finalExpr=mid+' + '+c; midOp='÷'; finalOp='+'; }
  var display = expr+' = ?';
  var sol = [ step1(WCM.t(midOp), midExpr, mid), step2(WCM.t(finalOp), finalExpr, ans) ];
  var hint = WCM.lang==='zh-TW' ? '記住：先乘除，後加減。' : 'Remember: multiply and divide before add and subtract.';
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genParens(){
  var mc = Math.random()<0.45;
  var f = pick(['(a+b)xc','(a-b)xc','ax(b+c)','ax(b-c)','(a+b)dc']);
  var a,b,c,inner,ans,expr,innerExpr,finalExpr,innerOp,outerOp,noParens;
  if(f==='(a+b)xc'){ a=ri(3,12); b=ri(3,12); c=ri(2,9); inner=a+b; ans=inner*c; expr='('+a+' + '+b+') × '+c; innerExpr='('+a+' + '+b+')'; finalExpr=inner+' × '+c; innerOp='+'; outerOp='×'; noParens=a+b*c; }
  else if(f==='(a-b)xc'){ a=ri(10,20); b=ri(2,a-1); c=ri(2,9); inner=a-b; ans=inner*c; expr='('+a+' - '+b+') × '+c; innerExpr='('+a+' - '+b+')'; finalExpr=inner+' × '+c; innerOp='-'; outerOp='×'; noParens=a-b*c; }
  else if(f==='ax(b+c)'){ a=ri(2,9); b=ri(3,9); c=ri(3,9); inner=b+c; ans=a*inner; expr=a+' × ('+b+' + '+c+')'; innerExpr='('+b+' + '+c+')'; finalExpr=a+' × '+inner; innerOp='+'; outerOp='×'; noParens=a*b+c; }
  else if(f==='ax(b-c)'){ a=ri(2,9); b=ri(10,20); c=ri(2,b-1); inner=b-c; ans=a*inner; expr=a+' × ('+b+' - '+c+')'; innerExpr='('+b+' - '+c+')'; finalExpr=a+' × '+inner; innerOp='-'; outerOp='×'; noParens=a*b-c; }
  else { c=ri(2,9); var q=ri(3,9); inner=c*q; a=ri(2, Math.max(3, inner-2)); b=inner-a; ans=q; expr='('+a+' + '+b+') ÷ '+c; innerExpr='('+a+' + '+b+')'; finalExpr=inner+' ÷ '+c; innerOp='+'; outerOp='÷'; noParens=-1; }
  var display = expr+' = ?';
  var sol = [ step1(WCM.t(innerOp), innerExpr, inner), step2(WCM.t(outerOp), finalExpr, ans) ];
  var hint = WCM.lang==='zh-TW' ? '先算括號裡面的。' : 'Calculate the parentheses first.';
  if(mc){
    var ds = [noParens>=0?noParens:ans+ri(1,5), ans+ri(1,5), ans-ri(1,5)];
    return mkQ(display, ans, sol, hint, 2, 'mc', makeNumChoices(ans, ds), null);
  }
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genTwoStep(){
  var f = pick(['ab+cd','p1','p2','p3']);
  var a,b,c,d,ans,expr,sol;
  if(f==='ab+cd'){
    a=ri(4,9); b=ri(4,9); c=ri(3,8); d=ri(3,8);
    var m1=a*b, m2=c*d; ans=m1+m2;
    expr=a+' × '+b+' + '+c+' × '+d;
    sol=[ step1(WCM.t('×'), a+' × '+b, m1), step2(WCM.t('×'), c+' × '+d, m2), step3(WCM.t('+'), m1+' + '+m2, ans) ];
  } else if(f==='p1'){
    a=ri(3,9); b=ri(3,9); c=ri(2,8); var inner=a+b; var mid=inner*c; d=ri(5, mid-1); ans=mid-d;
    expr='('+a+' + '+b+') × '+c+' - '+d;
    sol=[ step1(WCM.t('+'), '('+a+' + '+b+')', inner), step2(WCM.t('×'), inner+' × '+c, mid), step3(WCM.t('-'), mid+' - '+d, ans) ];
  } else if(f==='p2'){
    a=ri(8,15); b=ri(2,a-1); c=ri(2,8); var inner2=a-b; var mid2=inner2*c; d=ri(5,40); ans=mid2+d;
    expr='('+a+' - '+b+') × '+c+' + '+d;
    sol=[ step1(WCM.t('-'), '('+a+' - '+b+')', inner2), step2(WCM.t('×'), inner2+' × '+c, mid2), step3(WCM.t('+'), mid2+' + '+d, ans) ];
  } else {
    a=ri(20,60); b=ri(3,9); c=ri(3,9); var mid3=b*c; var tmp=a+mid3; d=ri(5, tmp-1); ans=tmp-d;
    expr=a+' + '+b+' × '+c+' - '+d;
    sol=[ step1(WCM.t('×'), b+' × '+c, mid3), step2(WCM.t('+'), a+' + '+mid3, tmp), step3(WCM.t('-'), tmp+' - '+d, ans) ];
  }
  var hint = WCM.lang==='zh-TW' ? '先乘除、先括號，再從左到右加減。' : 'Multiply/divide or parentheses first, then add/subtract left to right.';
  return mkQ(expr+' = ?', ans, sol, hint, 3, 'input', null, null);
}

function genWord(){
  var tpl = pick([0,1,2,3]);
  var p, ans, sol, hint, zh = WCM.lang==='zh-TW';
  if(tpl===0){
    var mice=ri(3,9), squir=ri(2,6); ans=mice+squir*2;
    p = zh ? ('一次巡邏獵到 '+mice+' 隻老鼠和 '+squir+' 隻松鼠。每隻老鼠餵飽 1 隻貓，每隻松鼠餵飽 2 隻貓。共可餵飽幾隻貓？')
           : ('A patrol caught '+mice+' mice and '+squir+' squirrels. Each mouse feeds 1 cat and each squirrel feeds 2 cats. How many cats can be fed?');
    sol=[ line(WCM.t('×'), squir+' × 2', squir*2), line(WCM.t('+'), mice+' + '+(squir*2), ans) ];
    hint = zh?'先算松鼠能餵幾隻貓，再加老鼠。':'First find cats fed by squirrels, then add mice.';
  } else if(tpl===1){
    var border=ri(40,80), pat=ri(3,6), each=ri(4,9); var covered=pat*each; ans=border-covered; while(ans<1){ border+=10; ans=border-covered; }
    p = zh ? ('邊界長 '+border+' 個狐長。'+pat+' 巡邏隊每隊走 '+each+' 個狐長。還剩多少狐長沒巡？')
           : ('The border is '+border+' fox-lengths. '+pat+' patrols each cover '+each+' fox-lengths. How many are left?');
    sol=[ line(WCM.t('×'), pat+' × '+each, covered), line(WCM.t('-'), border+' - '+covered, ans) ];
    hint = zh?'先算巡邏隊共走了多遠。':'First find total distance covered.';
  } else if(tpl===2){
    var war=ri(4,8), per=ri(3,7), eaten=ri(5, war*per-1); var total=war*per; ans=total-eaten;
    p = zh ? (war+' 名武士各獵到 '+per+' 隻獵物，被吃掉 '+eaten+' 隻。還剩多少隻？')
           : (war+' warriors each catch '+per+' prey. '+eaten+' are eaten. How many remain?');
    sol=[ line(WCM.t('×'), war+' × '+per, total), line(WCM.t('-'), total+' - '+eaten, ans) ];
    hint = zh?'先算共獵到多少。':'First find total prey caught.';
  } else {
    var bun=ri(3,6), leaves=ri(4,8), used=ri(5, bun*leaves-1); var total2=bun*leaves; ans=total2-used;
    p = zh ? ('巫醫採了 '+bun+' 把草藥，每把 '+leaves+' 片葉子，用掉 '+used+' 片。還剩多少片葉子？')
           : ('A medicine cat gathers '+bun+' bundles, each with '+leaves+' leaves, and uses '+used+' leaves. How many leaves remain?');
    sol=[ line(WCM.t('×'), bun+' × '+leaves, total2), line(WCM.t('-'), total2+' - '+used, ans) ];
    hint = zh?'先算共有多少片葉子。':'First find total leaves.';
  }
  return mkQ(p, ans, sol, hint, 3, 'input', null, null);
}

function genMixed(){
  var r=Math.random();
  if(r<0.5) return pick([genTwoStep,genWord])();
  if(r<0.8) return pick([genOrder,genParens])();
  return genReview();
}

/* ---------- 運算律巧算 (laws + friendly numbers) ---------- */
function genLaws(){
  var zh = WCM.lang==='zh-TW';
  var distPairs = [[25,4],[4,25],[8,50],[50,8],[20,5],[5,20]];
  var assocPairs = [[25,4],[4,25],[20,5],[5,20],[50,2],[2,50],[125,8]];
  var factorNs = [25,37,48,12,36,8];
  var kind = pick(['dist','factor','assoc','distMC']);
  var display, ans, sol, hint, choices=null, type='input';
  if(kind==='dist'){
    var pr = pick(distPairs); var a=pr[0], b=pr[1], c=ri(2,9);
    ans = a*(b+c);
    display = a+' × ('+b+' + '+c+') = ?';
    sol = [
      line(zh?'分配律':'Distribute', a+'×'+b+' + '+a+'×'+c, (a*b)+' + '+(a*c)),
      line(zh?'再算':'Then', (a*b)+' + '+(a*c), ans)
    ];
    hint = zh?'用分配律：a×(b+c)=a×b+a×c。':'Use the distributive law: a×(b+c)=a×b+a×c.';
  } else if(kind==='factor'){
    var n = pick(factorNs);
    var sub = pick([0,1,2]);
    if(sub===0){            /* n×99+n = n×100 */
      ans = n*100;
      display = n+' × 99 + '+n+' = ?';
      sol = [ line(zh?'提取公因數':'Factor', n+'×99 + '+n+'×1', n+'×(99+1)'), line(zh?'再算':'Then', n+'×100', ans) ];
      hint = zh?'把 '+n+' 提出來：'+n+'×(99+1)。':'Factor out '+n+': '+n+'×(99+1).';
    } else if(sub===1){     /* n×101 = n×100+n */
      ans = n*101;
      display = n+' × 101 = ?';
      sol = [ line(zh?'拆成':'Split', n+'×100 + '+n, (n*100)+' + '+n), line(zh?'再算':'Then', (n*100)+' + '+n, ans) ];
      hint = zh?'101 = 100 + 1。':'101 = 100 + 1.';
    } else {                /* n×98 = n×100 - n×2 */
      ans = n*98;
      display = n+' × 98 = ?';
      sol = [ line(zh?'拆成':'Split', n+'×100 - '+n+'×2', (n*100)+' - '+(n*2)), line(zh?'再算':'Then', (n*100)+' - '+(n*2), ans) ];
      hint = zh?'98 = 100 - 2。':'98 = 100 - 2.';
    }
  } else if(kind==='assoc'){
    var pr2 = pick(assocPairs); var a2=pr2[0], b2=pr2[1], c2=ri(3,9);
    ans = a2*b2*c2;
    display = a2+' × '+c2+' × '+b2+' = ?';
    sol = [
      line(zh?'結合律':'Group', '('+a2+'×'+b2+') × '+c2, (a2*b2)+' × '+c2),
      line(zh?'再算':'Then', (a2*b2)+' × '+c2, ans)
    ];
    hint = zh?'先算湊整的兩個數。':'Multiply the pair that makes a round number first.';
  } else { /* distMC - careless distractor */
    var pr3 = pick(distPairs); var a3=pr3[0], b3=pr3[1], c3=ri(2,9);
    ans = a3*(b3+c3);
    var careless = a3*b3 + c3;          /* forgot to distribute to 2nd term */
    display = a3+' × ('+b3+' + '+c3+') = ?';
    sol = [
      line(zh?'分配律':'Distribute', a3+'×'+b3+' + '+a3+'×'+c3, (a3*b3)+' + '+(a3*c3)),
      line(zh?'再算':'Then', (a3*b3)+' + '+(a3*c3), ans),
      zh?('小心：'+a3+'×'+b3+'+'+c3+' = '+careless+' 是漏乘第二項的錯誤。') : ('Careful: '+a3+'×'+b3+'+'+c3+' = '+careless+' forgets to distribute to the second term.')
    ];
    hint = zh?'每項都要乘 '+a3+'。':'Multiply BOTH terms by '+a3+'.';
    choices = makeNumChoices(ans, [careless, ans+ri(5,30), ans-ri(5,20)]);
    type = 'mc';
  }
  return mkQ(display, ans, sol, hint, 2, type, choices, null);
}

/* ---------- 找錯驗算 (spot the mistake + estimate) ---------- */
function genCheckWork(){
  var zh = WCM.lang==='zh-TW';
  var kind = pick(['mistake','mistake2','est']);
  var display, ans, sol, hint, choices=null, type='mc';
  if(kind==='mistake'){
    var a=ri(3,9), b=ri(3,9), c=ri(3,9);
    var wrong=(a+b)*c; ans=a+b*c;
    display = zh ? ('小貓算：'+a+' + '+b+' × '+c+' = '+(a+b)+' × '+c+' = '+wrong+'。正確答案是？')
                 : ('Kitten computes: '+a+' + '+b+' × '+c+' = '+(a+b)+' × '+c+' = '+wrong+'. The correct answer?');
    sol = [
      line(zh?'先乘除':'Multiply first', b+' × '+c, b*c),
      line(zh?'再算':'Then', a+' + '+(b*c), ans),
      zh?('小貓錯在先算了 '+a+'+'+b+'，違反「先乘除後加減」。') : ('The kitten added '+a+'+'+b+' first, breaking "multiply before add".')
    ];
    hint = zh?'先乘除，後加減。':'Multiply first, then add.';
    choices = makeNumChoices(ans, [wrong, ans+ri(2,12), ans-ri(2,12)]);
  } else if(kind==='mistake2'){
    var a2=25, b2=4, c2=ri(2,9);
    var wrong2=a2*b2+c2; ans=a2*(b2+c2);
    display = zh ? ('小貓算：'+a2+' × ('+b2+' + '+c2+') = '+a2+' × '+b2+' + '+c2+' = '+wrong2+'。正確答案是？')
                 : ('Kitten computes: '+a2+' × ('+b2+' + '+c2+') = '+a2+' × '+b2+' + '+c2+' = '+wrong2+'. The correct answer?');
    sol = [
      line(zh?'分配律':'Distribute', a2+'×'+b2+' + '+a2+'×'+c2, (a2*b2)+' + '+(a2*c2)),
      line(zh?'再算':'Then', (a2*b2)+' + '+(a2*c2), ans),
      zh?('小貓錯在沒有把 '+a2+' 也乘到 '+c2+'。') : ('The kitten forgot to multiply '+a2+' by '+c2+' too.')
    ];
    hint = zh?'a×(b+c)=a×b+a×c。':'a×(b+c)=a×b+a×c.';
    choices = makeNumChoices(ans, [wrong2, ans+ri(5,30), ans-ri(5,20)]);
  } else { /* est - estimation */
    var sub = pick([0,1,2]);
    var x,y,real,approx;
    if(sub===0){            /* round to hundreds, add */
      x=ri(150,249); y=ri(150,249);
      approx = Math.round(x/100)*100 + Math.round(y/100)*100;
      real = x+y;
      display = zh ? ('估算：'+x+' + '+y+' ≈ ?') : ('Estimate: '+x+' + '+y+' ≈ ?');
      sol = [ line(zh?'百位估算':'Round to 100s', Math.round(x/100)*100+' + '+Math.round(y/100)*100, approx) ];
      hint = zh?'把兩個數四捨五入到百位。':'Round both numbers to the nearest hundred.';
    } else if(sub===1){     /* round x to tens, multiply by small y */
      x=ri(380,520); y=ri(3,9);
      approx = Math.round(x/10)*10 * y;
      real = x*y;
      display = zh ? ('估算：'+x+' × '+y+' ≈ ?') : ('Estimate: '+x+' × '+y+' ≈ ?');
      sol = [ line(zh?'十位估算':'Round to 10s', Math.round(x/10)*10+' × '+y, approx) ];
      hint = zh?'先把 '+x+' 四捨五入到十位。':'Round '+x+' to the nearest ten first.';
    } else {                /* round both to tens, multiply */
      x=ri(25,45); y=ri(25,45);
      approx = Math.round(x/10)*10 * Math.round(y/10)*10;
      real = x*y;
      display = zh ? ('估算：'+x+' × '+y+' ≈ ?') : ('Estimate: '+x+' × '+y+' ≈ ?');
      sol = [ line(zh?'兩數十位估算':'Round both to 10s', Math.round(x/10)*10+' × '+Math.round(y/10)*10, approx) ];
      hint = zh?'兩個數都四捨五入到十位。':'Round both numbers to the nearest ten.';
    }
    ans = approx;
    choices = makeNumChoices(ans, [real, ans+ri(5,40), ans-ri(5,40)]);
    sol.push(zh ? ('精確值是 '+real+'，估算值只是接近。') : ('The exact value is '+real+'; an estimate only needs to be close.'));
  }
  return mkQ(display, ans, sol, hint, 3, type, choices, null);
}

/* ================ REGION 2: DECIMALS ================ */
function genDecPlace(){
  var zh = WCM.lang==='zh-TW';
  var intPart = ri(1,9), tenth = ri(1,9), hundredth = ri(1,9);
  var num = intPart+'.'+tenth+hundredth;
  var askTenths = Math.random()<0.5;
  var digit, value, placeName;
  if(askTenths){ digit=tenth; value=fmtDec(tenth*0.1); placeName=WCM.t('tenthsPlace'); }
  else { digit=hundredth; value=fmtDec(hundredth*0.01); placeName=WCM.t('hundredthsPlace'); }
  var display = WCM.t('whatValue')+' '+digit+' '+WCM.t('in_the_number')+' '+num+'?';
  var correct = decStr(value);
  var pool = [String(digit), decStr(value*10), decStr(value*100), String(digit*10)];
  var choices = makeTextChoices(correct, pool);
  var sol = [zh ? digit+' 在'+placeName+'，表示 '+correct : digit+' is in the '+placeName+', value = '+correct];
  return mkQ(display, correct, sol, WCM.t('decHint_place'), 1, 'mc', choices, null);
}

function genDecCompare(){
  var zh = WCM.lang==='zh-TW';
  var nums=[], vals=[];
  while(nums.length<4){
    var n = Math.random()<0.5 ? ri(1,9)+ri(1,9)/10 : ri(1,9)+ri(0,9)/10+ri(1,9)/100;
    n = fmtDec(n);
    var dup=false; for(var j=0;j<vals.length;j++){ if(Math.abs(vals[j]-n)<0.005) dup=true; }
    if(!dup){ vals.push(n); nums.push(decStr(n)); }
  }
  var maxIdx=0; for(var i=1;i<vals.length;i++){ if(vals[i]>vals[maxIdx]) maxIdx=i; }
  var answer = nums[maxIdx];
  var display = WCM.t('whichLargest');
  var sol = [zh ? '最大的數是 '+answer : 'The largest number is '+answer];
  return mkQ(display, answer, sol, WCM.t('decHint_compare'), 1, 'mc', shuffle(nums), null);
}

function genDecAdd(){
  var zh = WCM.lang==='zh-TW';
  var a, b, variant = ri(0,2);
  if(variant===0){ a=ri(1,9)+ri(1,9)/10; b=ri(1,9)+ri(1,9)/10; }
  else if(variant===1){ a=ri(1,9)+ri(0,9)/10+ri(1,9)/100; b=ri(1,9)+ri(0,9)/10+ri(1,9)/100; }
  else { a=ri(10,89)+ri(1,9)/10; b=ri(2,9)+ri(1,9)/10; }
  a=fmtDec(a); b=fmtDec(b); var ans=fmtDec(a+b);
  var display = decStr(a)+' + '+decStr(b)+' = ?';
  var sol = [zh ? '對齊小數點相加：'+decStr(a)+' + '+decStr(b)+' = '+decStr(ans) : 'Align decimals: '+decStr(a)+' + '+decStr(b)+' = '+decStr(ans)];
  return mkQ(display, ans, sol, WCM.t('decHint_add'), 2, 'input', null, null);
}

function genDecSub(){
  var zh = WCM.lang==='zh-TW';
  var a, b, variant = ri(0,1);
  if(variant===0){
    a=ri(5,19)+ri(1,9)/10; b=ri(1,9)+ri(1,9)/10;
    while(b>=a) b=ri(1,9)+ri(1,9)/10;
  } else {
    a=ri(5,19)+ri(0,9)/10+ri(1,9)/100; b=ri(1,9)+ri(0,9)/10+ri(1,9)/100;
    while(b>=a) b=ri(1,9)+ri(0,9)/10+ri(1,9)/100;
  }
  a=fmtDec(a); b=fmtDec(b); var ans=fmtDec(a-b);
  var display = decStr(a)+' - '+decStr(b)+' = ?';
  var sol = [zh ? '對齊小數點相減：'+decStr(a)+' - '+decStr(b)+' = '+decStr(ans) : 'Align decimals: '+decStr(a)+' - '+decStr(b)+' = '+decStr(ans)];
  return mkQ(display, ans, sol, WCM.t('decHint_sub'), 2, 'input', null, null);
}

function genDecMul(){
  var zh = WCM.lang==='zh-TW';
  var a, b = ri(2,9), variant = ri(0,1);
  if(variant===0){ a=ri(1,9)+ri(1,9)/10; }
  else { a=ri(1,9)+ri(0,9)/10+ri(1,9)/100; }
  a=fmtDec(a); var ans=fmtDec(a*b);
  var aStr = decStr(a).replace('.','');
  var decPlaces = decStr(a).indexOf('.')>=0 ? decStr(a).length-decStr(a).indexOf('.')-1 : 0;
  var wholeProd = Number(aStr)*b;
  var divisor = Math.pow(10, decPlaces);
  var display = decStr(a)+' × '+b+' = ?';
  var sol = [
    zh ? '先當整數乘：'+aStr+' × '+b+' = '+wholeProd : 'Multiply as whole numbers: '+aStr+' × '+b+' = '+wholeProd,
    zh ? '小數點左移 '+decPlaces+' 位：'+wholeProd+' ÷ '+divisor+' = '+decStr(ans) : 'Move decimal '+decPlaces+' places left: '+wholeProd+' ÷ '+divisor+' = '+decStr(ans)
  ];
  return mkQ(display, ans, sol, WCM.t('decHint_mul'), 3, 'input', null, null);
}

function genDecMixed(){
  return pick([genDecPlace, genDecCompare, genDecAdd, genDecSub, genDecMul, genDecWord])();
}

/* ================ REGION 3: GEOMETRY ================ */
function genGeoShape(){
  var zh = WCM.lang==='zh-TW';
  var shape = pick(SHAPES_2D);
  var svg = shape.svg(shape.color);
  var answer = WCM.t(shape.t);
  var pool = SHAPES_2D.filter(function(s){return s.key!==shape.key;}).map(function(s){return WCM.t(s.t);});
  pool.push(zh?'橢圓':'Oval'); pool.push(zh?'星形':'Star');
  var choices = makeTextChoices(answer, pool);
  var display = WCM.t('whatShape');
  var sides = {triangle:3,square:4,rectangle:4,circle:0,pentagon:5,hexagon:6,parallelogram:4,trapezium:4,rhombus:4};
  var ns = sides[shape.key];
  var sol = [zh ? (ns>0 ? '它有 '+ns+' 條邊，是'+answer+'。' : '它是圓的，沒有邊，是'+answer+'。')
                : (ns>0 ? 'It has '+ns+' sides, so it is a '+answer+'.' : 'It is round with no sides, a '+answer+'.')];
  return mkQ(display, answer, sol, WCM.t('geoHint_shape'), 1, 'mc', choices, svg);
}

function genGeoAngle(){
  var zh = WCM.lang==='zh-TW';
  var types = [
    {type:'acute', deg:pick([30,45,60])},
    {type:'right', deg:90},
    {type:'obtuse', deg:pick([120,135,150])}
  ];
  var ang = pick(types);
  var svg = WCM.svg.angle(ang.deg);
  var answerKey = ang.type==='right' ? 'rightAngle' : ang.type;
  var answer = WCM.t(answerKey);
  var pool = [WCM.t('acute'), WCM.t('rightAngle'), WCM.t('obtuse'), zh?'平角':'Straight'];
  pool = pool.filter(function(x){return x!==answer;});
  var choices = makeTextChoices(answer, pool);
  var display = WCM.t('whatAngle');
  var desc = ang.type==='acute' ? (zh?'小於 90°，是銳角':'Less than 90°, so acute')
           : ang.type==='right' ? (zh?'等於 90°，是直角':'Equal to 90°, so a right angle')
           : (zh?'大於 90° 小於 180°，是鈍角':'More than 90° and less than 180°, so obtuse');
  var sol = [ang.deg+'° '+desc];
  return mkQ(display, answer, sol, WCM.t('geoHint_angle'), 1, 'mc', choices, svg);
}

function genGeoPerimeter(){
  var zh = WCM.lang==='zh-TW';
  var isSquare = Math.random()<0.3;
  var w, h, ans;
  if(isSquare){ w=ri(5,20); h=w; ans=w*4; }
  else { w=ri(5,25); h=ri(3,15); while(h===w) h=ri(3,15); ans=(w+h)*2; }
  var svg = WCM.svg.rectLabeled(w, h, 'cm');
  var shapeName = isSquare ? WCM.t('square') : WCM.t('rectangle');
  var display = WCM.t('findPerimeter')+' ('+shapeName+')';
  var sol = [];
  if(isSquare){
    sol.push(zh ? '正方形周界 = 邊長 × 4' : 'Square perimeter = side × 4');
    sol.push(w+' × 4 = '+ans+' cm');
  } else {
    sol.push(zh ? '長方形周界 = (長 + 寬) × 2' : 'Rectangle perimeter = (length + width) × 2');
    sol.push('('+w+' + '+h+') × 2 = '+(w+h)+' × 2 = '+ans+' cm');
  }
  return mkQ(display, ans, sol, WCM.t('geoHint_perimeter'), 2, 'input', null, svg);
}

function genGeoArea(){
  var zh = WCM.lang==='zh-TW';
  var isSquare = Math.random()<0.3;
  var w, h, ans;
  if(isSquare){ w=ri(5,20); h=w; }
  else { w=ri(5,24); h=ri(3,15); while(h===w) h=ri(3,15); }
  ans = w*h;
  var svg = WCM.svg.rectLabeled(w, h, 'cm');
  var shapeName = isSquare ? WCM.t('square') : WCM.t('rectangle');
  var display = WCM.t('findArea')+' ('+shapeName+')';
  var sol = [
    zh ? '面積 = 長 × 寬' : 'Area = length × width',
    w+' × '+h+' = '+ans+' cm²'
  ];
  return mkQ(display, ans, sol, WCM.t('geoHint_area'), 2, 'input', null, svg);
}

function genGeoLines(){
  var zh = WCM.lang==='zh-TW';
  var types = ['parallel','perpendicular','intersecting'];
  var type = pick(types);
  var svg = WCM.svg.lines(type);
  var answer = WCM.t(type);
  var pool = types.map(function(t){return WCM.t(t);}).filter(function(x){return x!==answer;});
  pool.push(zh?'曲線':'Curved');
  var choices = makeTextChoices(answer, pool);
  var display = WCM.t('whatLines');
  var desc = type==='parallel' ? (zh?'平行線永不相交。':'Parallel lines never meet.')
           : type==='perpendicular' ? (zh?'垂直線成直角相交。':'Perpendicular lines meet at a right angle.')
           : (zh?'相交線以非直角相交。':'Intersecting lines cross at an angle.');
  var sol = [desc];
  return mkQ(display, answer, sol, WCM.t('geoHint_lines'), 2, 'mc', choices, svg);
}

function genGeoMixed(){
  return pick([genGeoShape, genGeoAngle, genGeoPerimeter, genGeoArea, genGeoLines, genGeoWord])();
}

/* ================ REGION 4: 3D & SPATIAL ================ */
function genSpShape(){
  var zh = WCM.lang==='zh-TW';
  var shape = pick(SHAPES_3D);
  var svg = shape.svg(shape.color);
  var answer = WCM.t(shape.t);
  var pool = SHAPES_3D.filter(function(s){return s.key!==shape.key;}).map(function(s){return WCM.t(s.t);});
  var choices = makeTextChoices(answer, pool);
  var display = WCM.t('whatShape3d');
  var sol = [zh ? '這是'+answer+'。' : 'This is a '+answer+'.'];
  return mkQ(display, answer, sol, WCM.t('spHint_shape'), 1, 'mc', choices, svg);
}

function genSpProps(){
  var zh = WCM.lang==='zh-TW';
  var shape = pick(SHAPES_3D);
  var svg = shape.svg(shape.color);
  var propType = pick(['faces','edges','vertices']);
  var answer = shape[propType];
  var propLabel = WCM.t(propType);
  var display = WCM.t('howMany'+cap(propType));
  var shapeName = WCM.t(shape.t);
  var sol = [zh ? shapeName+' 有 '+answer+' '+propLabel : 'A '+shapeName+' has '+answer+' '+propLabel+'.'];
  var choices = makeNumChoices(answer, [answer+1, answer-1, answer+2, answer-2]);
  return mkQ(display, answer, sol, WCM.t('spHint_props'), 2, 'mc', choices, svg);
}

function genSpNet(){
  var zh = WCM.lang==='zh-TW';
  var net = pick(NETS);
  var svg = net.svg();
  var answer = WCM.t(net.t);
  var pool = NETS.filter(function(n){return n.key!==net.key;}).map(function(n){return WCM.t(n.t);});
  pool.push(WCM.t('sphere'));
  var choices = makeTextChoices(answer, pool);
  var display = WCM.t('whichNet');
  var sol = [zh ? '這個展開圖可以做成'+answer+'。' : 'This net makes a '+answer+'.'];
  return mkQ(display, answer, sol, WCM.t('spHint_net'), 2, 'mc', choices, svg);
}

function genSpVolume(){
  var zh = WCM.lang==='zh-TW';
  var w=ri(3,10), h=ri(3,10), d=ri(3,10);
  var ans = w*h*d;
  var svg = WCM.svg.cuboidLabeled(w, h, d, 'cm');
  var display = WCM.t('findVolume');
  var sol = [
    zh ? '體積 = 長 × 寬 × 高' : 'Volume = length × width × height',
    w+' × '+h+' × '+d+' = '+ans+' cm³'
  ];
  return mkQ(display, ans, sol, WCM.t('spHint_volume'), 2, 'input', null, svg);
}

function genSpCount(){
  var zh = WCM.lang==='zh-TW';
  var w=ri(2,4), h=ri(2,3), d=ri(2,3);
  var ans = w*h*d;
  var svg = WCM.svg.cubeStack(w, h, d);
  var display = WCM.t('howManyCubes');
  var sol = [
    zh ? '每層 '+w+' × '+d+' = '+(w*d)+' 個，共 '+h+' 層' : 'Each layer: '+w+' × '+d+' = '+(w*d)+' cubes, '+h+' layers',
    w*d+' × '+h+' = '+ans
  ];
  return mkQ(display, ans, sol, WCM.t('spHint_count'), 3, 'input', null, svg);
}

function genSpMixed(){
  return pick([genSpShape, genSpProps, genSpNet, genSpVolume, genSpCount, genSpWord])();
}


function genDecWord(){
  var zh = WCM.lang==='zh-TW';
  var tpl = pick([0,1,2,3]);
  var p, ans, sol, hint;
  if(tpl===0){
    var price = fmtDec(ri(2,9)+ri(1,9)/10), len = ri(3,9);
    ans = fmtDec(price*len);
    p = zh ? ('溪邊蘆葦每米 '+decStr(price)+' 條魚。灰條要搭一個巢，需要 '+len+' 米。共要付多少條魚？')
           : ('Riverside reeds cost '+decStr(price)+' fish per metre. Graystripe needs '+len+' m to build a nest. How many fish in total?');
    sol = [ zh ? ('單價 × 長度：'+decStr(price)+' × '+len) : ('Unit price x length: '+decStr(price)+' x '+len),
            decStr(price)+' × '+len+' = '+decStr(ans) ];
    hint = zh ? '小數乘整數：先按整數乘，再點回小數點。' : 'Decimal x whole: multiply as integers, then place the decimal point.';
  } else if(tpl===1){
    var a = fmtDec(ri(2,9)+ri(1,9)/10), b = fmtDec(ri(2,9)+ri(1,9)/10);
    ans = fmtDec(a+b);
    p = zh ? ('溪流漁場上午捕得 '+decStr(a)+' 公斤魚，下午捕得 '+decStr(b)+' 公斤。今天共捕多少公斤？')
           : ('The fishery caught '+decStr(a)+' kg of fish in the morning and '+decStr(b)+' kg in the afternoon. How many kg today?');
    sol = [ zh ? '對齊小數點相加。' : 'Align the decimals and add.',
            decStr(a)+' + '+decStr(b)+' = '+decStr(ans) ];
    hint = zh ? '小數點對齊再相加。' : 'Line up the decimal points, then add.';
  } else if(tpl===2){
    var have = fmtDec(ri(10,30)+ri(1,9)/10), spend = fmtDec(ri(2,9)+ri(1,9)/10);
    while(spend>=have) spend = fmtDec(ri(2,9)+ri(1,9)/10);
    ans = fmtDec(have-spend);
    p = zh ? ('巫醫有 '+decStr(have)+' 把草藥，用了 '+decStr(spend)+' 把。還剩多少把？')
           : ('A medicine cat had '+decStr(have)+' bundles of herbs and used '+decStr(spend)+'. How many bundles remain?');
    sol = [ zh ? '相減求剩餘。' : 'Subtract to find what remains.',
            decStr(have)+' - '+decStr(spend)+' = '+decStr(ans) ];
    hint = zh ? '對齊小數點相減。' : 'Align the decimals, then subtract.';
  } else {
    var per = fmtDec(ri(1,4)+ri(1,9)/10), days = ri(4,9);
    ans = fmtDec(per*days);
    p = zh ? ('巡邏隊每天跑 '+decStr(per)+' 公里，連續巡邏 '+days+' 天。共跑了多少公里？')
           : ('A patrol runs '+decStr(per)+' km each day for '+days+' days. How far in total?');
    sol = [ zh ? ('每天距離 × 天數：'+decStr(per)+' × '+days) : ('Daily distance x days: '+decStr(per)+' x '+days),
            decStr(per)+' × '+days+' = '+decStr(ans) ];
    hint = zh ? '小數乘整數求總量。' : 'Multiply the decimal by the whole number.';
  }
  return mkQ(p, ans, sol, hint, 3, 'input', null, null);
}

function genGeoWord(){
  var zh = WCM.lang==='zh-TW';
  var tpl = pick([0,1,2,3]);
  var p, ans, sol, hint;
  if(tpl===0){
    var w=ri(6,20), h=ri(4,15); ans=(w+h)*2;
    p = zh ? ('古樹營地要圍一塊長方形空地，長 '+w+' 米、寬 '+h+' 米。圍欄共需多少米？')
           : ('The camp fences a rectangular clearing '+w+' m long and '+h+' m wide. How much fencing is needed?');
    sol = [ zh ? '長方形周界 = (長 + 寬) × 2' : 'Rectangle perimeter = (length + width) x 2',
            '('+w+' + '+h+') × 2 = '+(w+h)+' × 2 = '+ans+' m' ];
    hint = zh ? '周界 = (長+寬)×2。' : 'Perimeter = (length + width) x 2.';
  } else if(tpl===1){
    var w=ri(5,15), h=ri(4,12); ans=w*h;
    p = zh ? ('戰士巢穴地面長 '+w+' 米、寬 '+h+' 米。要鋪滿苔蘚，面積是多少平方米？')
           : ('A warrior den floor is '+w+' m by '+h+' m. How many square metres of moss are needed to cover it?');
    sol = [ zh ? '長方形面積 = 長 × 寬' : 'Rectangle area = length x width',
            w+' × '+h+' = '+ans+' m²' ];
    hint = zh ? '面積 = 長×寬。' : 'Area = length x width.';
  } else if(tpl===2){
    var w=ri(5,15), h=ri(4,12), peri=(w+h)*2, cost=ri(2,9); ans=peri*cost;
    p = zh ? ('營地圍欄每米 '+cost+' 條魚。一塊長 '+w+' 米、寬 '+h+' 米的長方形空地，圍欄共要多少條魚？')
           : ('Fencing costs '+cost+' fish per metre. A rectangular clearing '+w+' m by '+h+' m needs how many fish of fencing?');
    sol = [ zh ? '先求周界，再乘單價。' : 'Find the perimeter first, then multiply by the unit cost.',
            '('+w+' + '+h+') × 2 = '+peri+' m',
            peri+' × '+cost+' = '+ans ];
    hint = zh ? '先算周界，再算總價。' : 'Perimeter first, then total cost.';
  } else {
    var side=ri(5,15); ans=side*side;
    p = zh ? ('訓練場是邊長 '+side+' 米的正方形。它的面積是多少平方米？')
           : ('The training ground is a square with side '+side+' m. What is its area?');
    sol = [ zh ? '正方形面積 = 邊長 × 邊長' : 'Square area = side x side',
            side+' × '+side+' = '+ans+' m²' ];
    hint = zh ? '正方形面積 = 邊長²。' : 'Square area = side x side.';
  }
  return mkQ(p, ans, sol, hint, 3, 'input', null, null);
}

function genSpWord(){
  var zh = WCM.lang==='zh-TW';
  var tpl = pick([0,1,2]);
  var p, ans, sol, hint;
  if(tpl===0){
    var w=ri(3,8), h=ri(3,8), d=ri(3,8); ans=w*h*d;
    p = zh ? ('儲物箱長 '+w+' 厘米、寬 '+d+' 厘米、高 '+h+' 厘米。它的體積是多少立方厘米？')
           : ('A storage box is '+w+' cm long, '+d+' cm wide and '+h+' cm high. What is its volume?');
    sol = [ zh ? '長方體體積 = 長 × 寬 × 高' : 'Cuboid volume = length x width x height',
            w+' × '+d+' × '+h+' = '+ans+' cm³' ];
    hint = zh ? '體積 = 長×寬×高。' : 'Volume = length x width x height.';
  } else if(tpl===1){
    var w=ri(4,10), d=ri(4,10), h=ri(4,10); ans=w*d*h;
    p = zh ? ('一個長方體水槽長 '+w+' 厘米、寬 '+d+' 厘米，注水至 '+h+' 厘米高。水有多少立方厘米？')
           : ('A rectangular tank is '+w+' cm by '+d+' cm, filled to a depth of '+h+' cm. How much water is in it?');
    sol = [ zh ? '水的體積 = 長 × 寬 × 水深' : 'Water volume = length x width x depth',
            w+' × '+d+' × '+h+' = '+ans+' cm³' ];
    hint = zh ? '把水深當作高來算體積。' : 'Treat the water depth as the height.';
  } else {
    var w=ri(3,5), h=ri(2,4), d=ri(2,3); ans=w*h*d;
    p = zh ? ('築牆用了正方體石塊，每排 '+w+' 個、共 '+d+' 排、疊成 '+h+' 層。共用多少塊石塊？')
           : ('A wall is built from cube stones: '+w+' per row, '+d+' rows, stacked '+h+' layers high. How many cubes in total?');
    sol = [ zh ? '每層 '+w+' × '+d+' = '+(w*d)+' 塊，共 '+h+' 層' : 'Each layer: '+w+' x '+d+' = '+(w*d)+' cubes, over '+h+' layers',
            (w*d)+' × '+h+' = '+ans ];
    hint = zh ? '先算一層有幾塊，再乘層數。' : 'Find cubes per layer, then multiply by layers.';
  }
  return mkQ(p, ans, sol, hint, 3, 'input', null, null);
}

/* ================ MATH HELPERS ================ */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=b; b=a%b; a=t; } return a||1; }
function lcm(a,b){ return Math.abs(a*b)/gcd(a,b); }

/* ================ REGION 5: FRACTIONS (P5) ================ */
function genFracEquiv(){
  var zh=WCM.lang==='zh-TW';
  var den=ri(3,10), num=ri(1,den-1);
  var factor=ri(2,4);
  var ansNum=num*factor;
  var display = num+'/'+den+' = '+ansNum+'/?';
  var sol = [zh ? '分子和分母同乘 '+factor+'：'+num+'×'+factor+'/'+den+'×'+factor : 'Multiply both by '+factor+': '+num+'×'+factor+'/'+den+'×'+factor, '= '+ansNum+'/'+(den*factor)];
  var hint = WCM.t('fracHint_equivalent');
  return mkQ(display, den*factor, sol, hint, 1, 'input', null, WCM.svg.fractionPie(num,den));
}

function genFracSimplify(){
  var zh=WCM.lang==='zh-TW';
  var factor=ri(2,5), den=factor*ri(2,5), num=factor*ri(1,den/factor-1);
  while(num<=0) num=factor*ri(1,den/factor-1);
  var g=gcd(num,den);
  var sNum=num/g, sDen=den/g;
  var display = num+'/'+den+' = ?/'+sDen;
  var sol = [zh ? '分子分母同除以 '+g+'：'+num+'÷'+g+'/'+den+'÷'+g : 'Divide both by '+g+': '+num+'÷'+g+'/'+den+'÷'+g, '= '+sNum+'/'+sDen];
  var hint = WCM.t('fracHint_simplify');
  return mkQ(display, sNum, sol, hint, 2, 'input', null, WCM.svg.fractionPie(num,den));
}

function genFracAddSame(){
  var zh=WCM.lang==='zh-TW';
  var den=ri(5,12);
  var op=pick(['+','-']);
  var a, b, ansNum, display, sol;
  if(op==='+'){
    a=ri(1,den-2); b=ri(1,den-a-1); ansNum=a+b;
    display=a+'/'+den+' + '+b+'/'+den+' = ?';
    sol=[zh ? '分母不變，分子相加：'+a+' + '+b+' = '+ansNum : 'Keep the denominator, add numerators: '+a+' + '+b+' = '+ansNum, '= '+ansNum+'/'+den];
  } else {
    a=ri(3,den-1); b=ri(1,a-1); ansNum=a-b;
    display=a+'/'+den+' - '+b+'/'+den+' = ?';
    sol=[zh ? '分母不變，分子相減：'+a+' - '+b+' = '+ansNum : 'Keep the denominator, subtract numerators: '+a+' - '+b+' = '+ansNum, '= '+ansNum+'/'+den];
  }
  var hint = WCM.t('fracHint_add_same');
  return mkQ(display, ansNum, sol, hint, 2, 'input', null, null);
}

function genFracAddDiff(){
  var zh=WCM.lang==='zh-TW';
  var d1=ri(2,6), d2=ri(2,6);
  while(d2===d1) d2=ri(2,6);
  var a=ri(1,d1-1), b=ri(1,d2-1);
  var cd=lcm(d1,d2);
  var na=a*(cd/d1), nb=b*(cd/d2);
  var ansNum=na+nb;
  var g=gcd(ansNum,cd);
  var simpNum=ansNum/g, simpDen=cd/g;
  var display = a+'/'+d1+' + '+b+'/'+d2+' = ? (give numerator, denominator '+simpDen+')';
  var sol = [zh ? '通分：共同分母 = '+cd : 'Common denominator = '+cd,
    zh ? a+'/'+d1+' = '+na+'/'+cd+'，'+b+'/'+d2+' = '+nb+'/'+cd : a+'/'+d1+' = '+na+'/'+cd+', '+b+'/'+d2+' = '+nb+'/'+cd,
    zh ? '相加：'+na+' + '+nb+' = '+ansNum+' → '+simpNum+'/'+simpDen : 'Add: '+na+' + '+nb+' = '+ansNum+' → '+simpNum+'/'+simpDen];
  var hint = WCM.t('fracHint_add_diff');
  return mkQ(display, simpNum, sol, hint, 3, 'input', null, WCM.svg.fractionCompare(a,d1,b,d2));
}

function genFracMulDiv(){
  var zh=WCM.lang==='zh-TW';
  var den=ri(3,9), num=ri(1,den-1);
  var k=ri(2,6);
  var op=pick(['×','÷']);
  var ansNum, ansDen, display, sol;
  if(op==='×'){
    ansNum=num*k; ansDen=den;
    var g=gcd(ansNum,ansDen); ansNum/=g; ansDen/=g;
    display = num+'/'+den+' × '+k+' = ? (give numerator, denominator '+ansDen+')';
    sol=[zh ? '分子乘以 '+k+'：'+num+'×'+k+' = '+(num*k) : 'Multiply numerator by '+k+': '+num+'×'+k+' = '+(num*k), zh ? '結果：'+(num*k)+'/'+den+' = '+ansNum+'/'+ansDen : 'Result: '+(num*k)+'/'+den+' = '+ansNum+'/'+ansDen];
  } else {
    /* num/den ÷ k = num/(den*k) */
    var newDen=den*k;
    var g2=gcd(num,newDen); var sn=num/g2, sd=newDen/g2;
    ansNum=sn; ansDen=sd;
    display = num+'/'+den+' ÷ '+k+' = ? (give numerator, denominator '+ansDen+')';
    sol=[zh ? '除以 '+k+' = 乘以 1/'+k : 'Dividing by '+k+' = multiply by 1/'+k, zh ? num+'/'+den+' × 1/'+k+' = '+num+'/'+newDen+' = '+sn+'/'+sd : num+'/'+den+' × 1/'+k+' = '+num+'/'+newDen+' = '+sn+'/'+sd];
  }
  var hint = op==='×' ? WCM.t('fracHint_mul') : WCM.t('fracHint_div');
  return mkQ(display, ansNum, sol, hint, 3, 'input', null, WCM.svg.fractionPie(num,den));
}

function genFracMixed(){
  return pick([genFracEquiv, genFracSimplify, genFracAddSame, genFracAddDiff, genFracMulDiv])();
}

/* ================ REGION 6: PERCENTAGES (P5) ================ */
function genPctMeaning(){
  var zh=WCM.lang==='zh-TW';
  var pct=pick([10,20,25,50,75,80]);
  var ans=pct;
  var display = pct+'% of 100 = ?';
  var sol = [zh ? pct+'% = '+pct+'/100，即 100 中的 '+pct : pct+'% = '+pct+'/100, which is '+pct+' out of 100'];
  var hint = WCM.t('pctHint_meaning');
  return mkQ(display, ans, sol, hint, 1, 'input', null, null);
}

function genPctConvert(){
  var zh=WCM.lang==='zh-TW';
  var type=pick([0,1,2]);
  var display, ans, sol;
  if(type===0){ /* decimal to percent */
    var d=pick([0.25,0.5,0.75,0.1,0.2,0.4,0.6,0.8]);
    ans=d*100;
    display = d+' = ?%';
    sol=[zh ? '小數化百分數：× 100' : 'Decimal to percent: × 100', d+' × 100 = '+ans+'%'];
  } else if(type===1){ /* fraction to percent */
    var den=pick([2,4,5,10,20]), num=ri(1,den-1);
    ans=Math.round(num/den*100);
    while(ans*den!==num*100) { den=pick([2,4,5,10,20]); num=ri(1,den-1); ans=Math.round(num/den*100); }
    display = num+'/'+den+' = ?%';
    sol=[zh ? '分數化小數再化百分數' : 'Convert to decimal then to percent', num+'÷'+den+' = '+(num/den)+' × 100 = '+ans+'%'];
  } else { /* percent to decimal */
    var p=pick([25,50,75,10,20,30,40,60,80,90]);
    ans=p/100;
    display = p+'% = ?';
    sol=[zh ? '百分數化小數：÷ 100' : 'Percent to decimal: ÷ 100', p+' ÷ 100 = '+ans];
  }
  var hint = WCM.t('pctHint_convert');
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genPctFind(){
  var zh=WCM.lang==='zh-TW';
  var whole=pick([20,25,40,50,80,100,200]);
  var part=pick([Math.round(whole*0.25), Math.round(whole*0.5), Math.round(whole*0.1), Math.round(whole*0.2), Math.round(whole*0.75)]);
  var ans=Math.round(part/whole*100);
  display = zh ? (part+' 佔 '+whole+' 的百分之幾？%') : ('What percent is '+part+' of '+whole+'? (%)');
  var sol=[zh ? part+' ÷ '+whole+' × 100 = '+ans+'%' : part+' ÷ '+whole+' × 100 = '+ans+'%'];
  var hint = WCM.t('pctHint_find');
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genPctChange(){
  var zh=WCM.lang==='zh-TW';
  var orig=pick([50,80,100,120,200,250]);
  var rate=pick([10,20,25,50]);
  var inc=Math.random()<0.6;
  var change=Math.round(orig*rate/100);
  var ans = inc ? orig+change : orig-change;
  display = zh ? (orig+(inc?' 增加 ':' 減少 ')+rate+'% = ?') : (orig+(inc?' increased by ':' decreased by ')+rate+'% = ?');
  var sol=[zh ? orig+' × '+rate+'% = '+change : orig+' × '+rate+'% = '+change, zh ? orig+(inc?' + ':' - ')+change+' = '+ans : orig+(inc?' + ':' - ')+change+' = '+ans];
  var hint = WCM.t('pctHint_change');
  return mkQ(display, ans, sol, hint, 3, 'input', null, null);
}

function genPctDiscount(){
  var zh=WCM.lang==='zh-TW';
  var orig=pick([80,100,120,150,200,250,300]);
  var rate=pick([10,20,25,50]);
  var discount=Math.round(orig*rate/100);
  var ans=orig-discount;
  display = zh ? ('原價 $'+orig+'，打'+(100-rate)+'折（減'+rate+'%），售價 = ?') : ('Original $'+orig+', '+rate+'% off, sale price = ?');
  var sol=[zh ? '折扣 = $'+orig+' × '+rate+'% = $'+discount : 'Discount = $'+orig+' × '+rate+'% = $'+discount, zh ? '售價 = $'+orig+' - $'+discount+' = $'+ans : 'Sale price = $'+orig+' - $'+discount+' = $'+ans];
  var hint = WCM.t('pctHint_discount');
  return mkQ(display, ans, sol, hint, 3, 'input', null, null);
}

function genPctMixed(){
  return pick([genPctMeaning, genPctConvert, genPctFind, genPctChange, genPctDiscount])();
}

/* ================ REGION 7: RATIO & PROPORTION (P5) ================ */
function genRatioMeaning(){
  var zh=WCM.lang==='zh-TW';
  var a=ri(2,9), b=ri(2,9);
  while(b===a) b=ri(2,9);
  var ans=a;
  display = zh ? (a+' 隻貓和 '+b+' 隻老鼠，貓與老鼠的比 = ?:'+b) : (a+' cats and '+b+' mice, ratio of cats to mice = ?:'+b);
  var sol=[zh ? '貓:老鼠 = '+a+':'+b : 'Cats:Mice = '+a+':'+b];
  var hint = WCM.t('ratioHint_meaning');
  return mkQ(display, ans, sol, hint, 1, 'input', null, null);
}

function genRatioSimplify(){
  var zh=WCM.lang==='zh-TW';
  var g=ri(2,5), a=g*ri(2,6), b=g*ri(2,6);
  while(b===a) b=g*ri(2,6);
  var sa=a/g, sb=b/g;
  display = a+':'+b+' = ?:'+sb;
  var sol=[zh ? '兩邊同除以 '+g+'：'+a+'÷'+g+':'+b+'÷'+g : 'Divide both by '+g+': '+a+'÷'+g+':'+b+'÷'+g, '= '+sa+':'+sb];
  var hint = WCM.t('ratioHint_simplify');
  return mkQ(display, sa, sol, hint, 2, 'input', null, null);
}

function genRatioShare(){
  var zh=WCM.lang==='zh-TW';
  var a=ri(1,4), b=ri(1,4);
  while(b===a) b=ri(1,4);
  var total=a+b;
  var amount=total*ri(2,8);
  var ans=a*(amount/total);
  display = zh ? ('把 '+amount+' 按 '+a+':'+b+' 分配，較大的一份 = ?') : ('Share '+amount+' in ratio '+a+':'+b+', the larger share = ?');
  var sol=[zh ? '總份數 = '+a+' + '+b+' = '+total : 'Total parts = '+a+' + '+b+' = '+total, zh ? '每份 = '+amount+' ÷ '+total+' = '+(amount/total)+'，較大的一份 = '+a+' × '+(amount/total)+' = '+ans : 'One part = '+amount+' ÷ '+total+' = '+(amount/total)+', larger share = '+a+' × '+(amount/total)+' = '+ans];
  var hint = WCM.t('ratioHint_share');
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genRatioDirect(){
  var zh=WCM.lang==='zh-TW';
  var n1=ri(2,6), price=ri(3,15);
  var total1=n1*price;
  var n2=ri(3,8);
  while(n2===n1) n2=ri(3,8);
  var ans=n2*price;
  display = zh ? (n1+' 隻獵物值 '+total1+' 分，'+n2+' 隻值多少？') : (n1+' prey cost '+total1+' pts, how much for '+n2+'?');
  var sol=[zh ? '每隻 = '+total1+' ÷ '+n1+' = '+price : 'Each = '+total1+' ÷ '+n1+' = '+price, zh ? n2+' 隻 = '+n2+' × '+price+' = '+ans : n2+' prey = '+n2+' × '+price+' = '+ans];
  var hint = WCM.t('ratioHint_direct');
  return mkQ(display, ans, sol, hint, 3, 'input', null, null);
}

function genRatioInverse(){
  var zh=WCM.lang==='zh-TW';
  var cats=ri(3,6), days=ri(3,8);
  var totalWork=cats*days;
  var cats2=cats+ri(1,3);
  var ans=Math.round(totalWork/cats2);
  while(ans*cats2!==totalWork){ cats=ri(3,6); days=ri(2,6); totalWork=cats*days; cats2=cats+ri(1,3); ans=Math.round(totalWork/cats2); }
  display = zh ? (cats+' 隻貓 '+days+' 天完成巡邏，'+cats2+' 隻貓需幾天？') : (cats+' cats finish patrol in '+days+' days, how many days for '+cats2+' cats?');
  var sol=[zh ? '總工作量 = '+cats+' × '+days+' = '+totalWork : 'Total work = '+cats+' × '+days+' = '+totalWork, zh ? cats2+' 隻貓需 '+totalWork+' ÷ '+cats2+' = '+ans+' 天' : cats2+' cats need '+totalWork+' ÷ '+cats2+' = '+ans+' days'];
  var hint = WCM.t('ratioHint_inverse');
  return mkQ(display, ans, sol, hint, 3, 'input', null, null);
}

function genRatioMixed(){
  return pick([genRatioMeaning, genRatioSimplify, genRatioShare, genRatioDirect, genRatioInverse])();
}

/* ================ REGION 8: ADVANCED GEOMETRY (P5) ================ */
function genGeo2Triangle(){
  var zh=WCM.lang==='zh-TW';
  var base=ri(3,12), height=ri(2,10);
  var ans=base*height/2;
  var realDisplay = WCM.t('findTriangleArea');
  var sol=[zh ? '三角形面積 = 底 × 高 ÷ 2' : 'Triangle area = base × height ÷ 2', base+' × '+height+' ÷ 2 = '+(base*height)+' ÷ 2 = '+ans+' cm²'];
  var hint = WCM.t('geo2Hint_triangle');
  return mkQ(realDisplay, ans, sol, hint, 2, 'input', null, WCM.svg.triangleLabeled(base, height, 'cm'));
}

function genGeo2Parallelogram(){
  var zh=WCM.lang==='zh-TW';
  var base=ri(3,12), height=ri(2,9);
  var ans=base*height;
  var display = WCM.t('findParallelogramArea');
  var sol=[zh ? '平行四邊形面積 = 底 × 高' : 'Parallelogram area = base × height', base+' × '+height+' = '+ans+' cm²'];
  var hint = WCM.t('geo2Hint_parallelogram');
  return mkQ(display, ans, sol, hint, 2, 'input', null, WCM.svg.parallelogramLabeled(base, height, 'cm'));
}

function genGeo2Trapezium(){
  var zh=WCM.lang==='zh-TW';
  var top=ri(2,8), bottom=ri(3,12), height=ri(2,8);
  var ans=(top+bottom)*height/2;
  var display = WCM.t('findTrapeziumArea');
  var sol=[zh ? '梯形面積 = (上底 + 下底) × 高 ÷ 2' : 'Trapezium area = (top + bottom) × height ÷ 2', '('+top+' + '+bottom+') × '+height+' ÷ 2 = '+(top+bottom)+' × '+height+' ÷ 2 = '+ans+' cm²'];
  var hint = WCM.t('geo2Hint_trapezium');
  return mkQ(display, ans, sol, hint, 3, 'input', null, WCM.svg.trapeziumLabeled(top, bottom, height, 'cm'));
}

function genGeo2Angle(){
  var zh=WCM.lang==='zh-TW';
  var a1=ri(40,80), a2=ri(40,80);
  while(a1+a2>=170) a2=ri(40,80);
  var ans=180-a1-a2;
  var display = WCM.t('findMissingAngle')+' ('+a1+'°, '+a2+'°, ?)';
  var sol=[zh ? '三角形內角和 = 180°' : 'Angle sum of triangle = 180°', zh ? '第三角 = 180 - '+a1+' - '+a2+' = '+ans+'°' : 'Third angle = 180 - '+a1+' - '+a2+' = '+ans+'°'];
  var hint = WCM.t('geo2Hint_angle');
  return mkQ(display, ans, sol, hint, 2, 'input', null, null);
}

function genGeo2Composite(){
  var zh=WCM.lang==='zh-TW';
  var rw=ri(4,10), rh=ri(3,8), th=ri(2,6);
  var rectArea=rw*rh, triArea=rw*th/2;
  var ans=rectArea+triArea;
  var display = WCM.t('findCompositeArea');
  var sol=[zh ? '長方形面積 = '+rw+' × '+rh+' = '+rectArea : 'Rectangle area = '+rw+' × '+rh+' = '+rectArea, zh ? '三角形面積 = '+rw+' × '+th+' ÷ 2 = '+triArea : 'Triangle area = '+rw+' × '+th+' ÷ 2 = '+triArea, zh ? '總面積 = '+rectArea+' + '+triArea+' = '+ans+' cm²' : 'Total area = '+rectArea+' + '+triArea+' = '+ans+' cm²'];
  var hint = WCM.t('geo2Hint_composite');
  return mkQ(display, ans, sol, hint, 3, 'input', null, WCM.svg.compositeShape(rw, rh, th, 'cm'));
}

function genGeo2Mixed(){
  return pick([genGeo2Triangle, genGeo2Parallelogram, genGeo2Trapezium, genGeo2Angle, genGeo2Composite])();
}


/* ================ REGION 9: NEGATIVE NUMBERS (P6) ================ */
function genNegIntro(){
  var zh=WCM.lang==='zh-TW';
  var a=ri(-8,-1), b=ri(1,8);
  var ans=b-a;
  display = zh ? ('溫度從 '+a+'°C 升到 '+b+'°C，升了多少度？') : ('Temperature rises from '+a+'°C to '+b+'°C. How many degrees?');
  var sol=[zh ? b+' - ('+a+') = '+b+' + '+(-a)+' = '+ans+'°C' : b+' - ('+a+') = '+b+' + '+(-a)+' = '+ans+'°C'];
  var hint = WCM.t('negHint_intro');
  return mkQ(display, ans, sol, hint, 1, 'input', null, WCM.svg.numberLine(-10,10,a));
}

function genNegCompare(){
  var zh=WCM.lang==='zh-TW';
  var a=ri(-9,-1), b=ri(-9,-1);
  while(a===b) b=ri(-9,-1);
  var big=Math.max(a,b);
  display = zh ? ('在 '+a+' 和 '+b+' 中，哪個較大？') : ('Which is larger: '+a+' or '+b+'?');
  var sol=[zh ? '數線上右邊的數較大。'+big+' > '+Math.min(a,b) : 'On a number line, right is bigger. '+big+' > '+Math.min(a,b)];
  var hint = WCM.t('negHint_compare');
  var small=Math.min(a,b);
  var choices = makeTextChoices(String(big), [String(small), String(big+1), String(small-1), '0']);
  return mkQ(display, String(big), sol, hint, 2, 'mc', choices, WCM.svg.numberLine(-10,10,null));
}

function genNegAddSub(){
  var zh=WCM.lang==='zh-TW';
  var a=ri(-9,-1), b=ri(2,9);
  var op=pick(['+','-']);
  var ans;
  if(op==='+'){ ans=a+b; display=a+' + '+b+' = ?'; }
  else { ans=a-b; display=a+' - '+b+' = ?'; }
  var sol;
  if(op==='+'){
    sol=[zh ? '從 '+a+' 向右移 '+b+' 格' : 'From '+a+' move right '+b+' steps', '= '+ans];
  } else {
    sol=[zh ? a+' - '+b+' = '+a+' + ('+(-b)+')' : a+' - '+b+' = '+a+' + ('+(-b)+')', '= '+ans];
  }
  var hint = WCM.t('negHint_add');
  return mkQ(display, ans, sol, hint, 2, 'input', null, WCM.svg.numberLine(-15,15,ans));
}

function genNegWord(){
  var zh=WCM.lang==='zh-TW';
  var temp=ri(-5,-1), rise=ri(3,8);
  var ans=temp+rise;
  display = zh ? ('清晨溫度 '+temp+'°C，中午升了 '+rise+'°C，中午溫度 = ?') : ('Morning temperature '+temp+'°C, rises by '+rise+'°C at noon. Noon temperature = ?');
  var sol=[zh ? temp+' + '+rise+' = '+ans+'°C' : temp+' + '+rise+' = '+ans+'°C'];
  var hint = WCM.t('negHint_word');
  return mkQ(display, ans, sol, hint, 3, 'input', null, null);
}

function genNegMixed(){
  return pick([genNegIntro, genNegCompare, genNegAddSub, genNegWord])();
}

/* ================ REGION 10: ALGEBRA (P6) ================ */
function genAlgSubstitute(){
  var zh=WCM.lang==='zh-TW';
  var x=ri(2,12);
  var type=pick([0,1,2]);
  var expr, ans, display, sol;
  if(type===0){ var c=ri(2,9); ans=x+c; expr='x + '+c; }
  else if(type===1){ var c2=ri(2,9); ans=x*c2; expr=x>9?'x × '+c2:c2+'x'; }
  else { var c3=ri(2,6), d=ri(2,6); ans=x*c3+d; expr=c3+'x + '+d; }
  display = zh ? ('若 x = '+x+'，求 '+expr+' = ?') : ('If x = '+x+', find '+expr+' = ?');
  sol=[zh ? '代入 x = '+x : 'Substitute x = '+x, expr+' = '+ans];
  var hint = WCM.t('algHint_substitute');
  return mkQ(display, ans, sol, hint, 1, 'input', null, null);
}

function genAlgOnestep(){
  var zh=WCM.lang==='zh-TW';
  var type=pick([0,1,2,3]);
  var x, display, sol;
  if(type===0){ x=ri(3,15); var c=ri(2,9); display='x + '+c+' = '+(x+c)+' , x = ?'; sol=[zh ? '兩邊減 '+c : 'Subtract '+c+' from both sides', 'x = '+(x+c)+' - '+c+' = '+x]; }
  else if(type===1){ x=ri(3,15); var c2=ri(2,9); display='x - '+c2+' = '+(x-c2)+' , x = ?'; sol=[zh ? '兩邊加 '+c2 : 'Add '+c2+' to both sides', 'x = '+(x-c2)+' + '+c2+' = '+x]; }
  else if(type===2){ x=ri(3,12); var c3=ri(2,9); display=c3+'x = '+(c3*x)+' , x = ?'; sol=[zh ? '兩邊除以 '+c3 : 'Divide both sides by '+c3, 'x = '+(c3*x)+' ÷ '+c3+' = '+x]; }
  else { x=ri(2,9); var c4=ri(2,6); display='x ÷ '+c4+' = '+(x/c4===Math.floor(x/c4)?x/c4:(x/c4).toFixed(1))+' , x = ?'; while(x%c4!==0){ x=ri(2,9); c4=ri(2,6); } display='x ÷ '+c4+' = '+(x/c4)+' , x = ?'; sol=[zh ? '兩邊乘 '+c4 : 'Multiply both sides by '+c4, 'x = '+(x/c4)+' × '+c4+' = '+x]; }
  var hint = WCM.t('algHint_onestep');
  return mkQ(display, x, sol, hint, 2, 'input', null, null);
}

function genAlgTwostep(){
  var zh=WCM.lang==='zh-TW';
  var x=ri(2,9), a=ri(2,6), b=ri(2,9);
  var result=a*x+b;
  display = a+'x + '+b+' = '+result+' , x = ?';
  var sol=[zh ? '先兩邊減 '+b+'：'+a+'x = '+(result-b) : 'Subtract '+b+': '+a+'x = '+(result-b), zh ? '再兩邊除以 '+a+'：x = '+(result-b)+' ÷ '+a+' = '+x : 'Divide by '+a+': x = '+(result-b)+' ÷ '+a+' = '+x];
  var hint = WCM.t('algHint_twostep');
  return mkQ(display, x, sol, hint, 2, 'input', null, null);
}

function genAlgWord(){
  var zh=WCM.lang==='zh-TW';
  var type=pick([0,1]);
  var x, display, sol;
  if(type===0){
    x=ri(3,12);
    var perCat=ri(2,6), extra=ri(2,9);
    var total=x*perCat+extra;
    display = zh ? ('每隻武士獵 '+perCat+' 隻獵物，另加 '+extra+' 隻，共 '+total+' 隻。有多少隻武士？') : ('Each warrior catches '+perCat+' prey, plus '+extra+' extra, total '+total+'. How many warriors?');
    sol=[zh ? '設 x 隻武士：'+perCat+'x + '+extra+' = '+total : 'Let x warriors: '+perCat+'x + '+extra+' = '+total, zh ? perCat+'x = '+total+' - '+extra+' = '+(total-extra) : perCat+'x = '+total+' - '+extra+' = '+(total-extra), 'x = '+(total-extra)+' ÷ '+perCat+' = '+x];
  } else {
    x=ri(5,15);
    var price=ri(3,9), payment=ri(5,20);
    var change=payment-x*price;
    while(change<0){ x=ri(3,8); price=ri(3,9); payment=ri(x*price,x*price+20); change=payment-x*price; }
    display = zh ? ('買 '+x+' 條魚每條 '+price+' 分，付 '+payment+' 分，找贖 = ?') : ('Buy '+x+' fish at '+price+' pts each, pay '+payment+', change = ?');
    sol=[zh ? x+' × '+price+' = '+(x*price)+' 分' : x+' × '+price+' = '+(x*price)+' pts', payment+' - '+(x*price)+' = '+change];
    return mkQ(display, change, sol, WCM.t('algHint_word'), 3, 'input', null, null);
  }
  var hint = WCM.t('algHint_word');
  return mkQ(display, x, sol, hint, 3, 'input', null, null);
}

function genAlgFormula(){
  var zh=WCM.lang==='zh-TW';
  var type=pick([0,1]);
  if(type===0){
    /* perimeter: P = 2(l+w) */
    var l=ri(3,12), w=ri(2,9);
    var ans=2*(l+w);
    display = zh ? ('周界公式 P = 2(長+寬)，長='+l+'，寬='+w+'，P = ?') : ('Perimeter P = 2(l+w), l='+l+', w='+w+', P = ?');
    var sol=[zh ? 'P = 2('+l+' + '+w+') = 2 × '+(l+w)+' = '+ans : 'P = 2('+l+' + '+w+') = 2 × '+(l+w)+' = '+ans];
    return mkQ(display, ans, sol, WCM.t('algHint_formula'), 3, 'input', null, null);
  } else {
    /* distance: d = s × t */
    var s=ri(3,12), t=ri(2,6);
    var ans=s*t;
    display = zh ? ('路程公式 d = 速度 × 時間，速度='+s+'，時間='+t+'，d = ?') : ('Distance d = speed × time, speed='+s+', time='+t+', d = ?');
    var sol=[zh ? 'd = '+s+' × '+t+' = '+ans : 'd = '+s+' × '+t+' = '+ans];
    return mkQ(display, ans, sol, WCM.t('algHint_formula'), 3, 'input', null, null);
  }
}

function genAlgMixed(){
  return pick([genAlgSubstitute, genAlgOnestep, genAlgTwostep, genAlgWord, genAlgFormula])();
}

/* ================ REGION 11: CIRCLES (P6) ================ */
function genCircParts(){
  var zh=WCM.lang==='zh-TW';
  var type=pick([0,1]);
  if(type===0){
    var r=ri(3,9);
    var svg=WCM.svg.circleLabeled(true,false);
    var display = zh ? ('半徑 r = '+r+'，直徑 d = ?') : ('Radius r = '+r+', diameter d = ?');
    var sol=[zh ? '直徑 = 2 × 半徑 = 2 × '+r+' = '+(2*r) : 'Diameter = 2 × radius = 2 × '+r+' = '+(2*r)];
    return mkQ(display, 2*r, sol, WCM.t('circHint_parts'), 1, 'input', null, svg);
  } else {
    var d=pick([4,6,8,10,12]);
    var svg2=WCM.svg.circleLabeled(false,true);
    var display2 = zh ? ('直徑 d = '+d+'，半徑 r = ?') : ('Diameter d = '+d+', radius r = ?');
    var sol2=[zh ? '半徑 = 直徑 ÷ 2 = '+d+' ÷ 2 = '+(d/2) : 'Radius = diameter ÷ 2 = '+d+' ÷ 2 = '+(d/2)];
    return mkQ(display2, d/2, sol2, WCM.t('circHint_parts'), 1, 'input', null, svg2);
  }
}

function genCircPi(){
  var zh=WCM.lang==='zh-TW';
  var d=ri(3,10);
  /* C = pi * d, approximate */
  display = zh ? ('直徑 = '+d+'，π ≈ 3.14，圓周 ≈ ?') : ('Diameter = '+d+', π ≈ 3.14, circumference ≈ ?');
  var raw=d*3.14;
  var ans=Math.round(raw*100)/100;
  sol=[zh ? '圓周 = π × 直徑 = 3.14 × '+d+' = '+ans : 'Circumference = π × diameter = 3.14 × '+d+' = '+ans];
  return mkQ(display, ans, sol, WCM.t('circHint_pi'), 2, 'input', null, WCM.svg.circleLabeled(true,true));
}

function genCircCircum(){
  var zh=WCM.lang==='zh-TW';
  var r=ri(3,10);
  var ans=Math.round(2*3.14*r*100)/100;
  display = zh ? ('半徑 r = '+r+'，圓周 C = ?（π取3.14）') : ('Radius r = '+r+', circumference C = ? (π=3.14)');
  sol=[zh ? 'C = 2 × π × r = 2 × 3.14 × '+r+' = '+ans : 'C = 2 × π × r = 2 × 3.14 × '+r+' = '+ans];
  return mkQ(display, ans, sol, WCM.t('circHint_circumference'), 2, 'input', null, WCM.svg.circleLabeled(true,false));
}

function genCircArea(){
  var zh=WCM.lang==='zh-TW';
  var r=ri(2,8);
  var ans=Math.round(3.14*r*r*100)/100;
  display = zh ? ('半徑 r = '+r+'，圓面積 A = ?（π取3.14）') : ('Radius r = '+r+', area A = ? (π=3.14)');
  sol=[zh ? 'A = π × r² = 3.14 × '+r+'² = 3.14 × '+(r*r)+' = '+ans : 'A = π × r² = 3.14 × '+r+'² = 3.14 × '+(r*r)+' = '+ans];
  return mkQ(display, ans, sol, WCM.t('circHint_area'), 3, 'input', null, WCM.svg.circleLabeled(true,false));
}

function genCircSector(){
  var zh=WCM.lang==='zh-TW';
  /* sector: fraction of circle area */
  var r=ri(2,6), frac=pick([0.5,0.25,0.75]);
  var deg=frac*360;
  var fullArea=Math.round(3.14*r*r*100)/100;
  var ans=Math.round(fullArea*frac*100)/100;
  display = zh ? ('半徑 r = '+r+'，扇形圓心角 = '+deg+'°，面積 = ?') : ('Radius r = '+r+', sector angle = '+deg+'°, area = ?');
  sol=[zh ? '整圓面積 = 3.14 × '+r+'² = '+fullArea : 'Full circle area = 3.14 × '+r+'² = '+fullArea, zh ? '扇形 = '+fullArea+' × '+(frac)+' = '+ans : 'Sector = '+fullArea+' × '+(frac)+' = '+ans];
  return mkQ(display, ans, sol, WCM.t('circHint_sector'), 3, 'input', null, null);
}

function genCircMixed(){
  return pick([genCircParts, genCircPi, genCircCircum, genCircArea, genCircSector])();
}

/* ================ REGION 12: STATISTICS & PROBABILITY (P6) ================ */
function genStatsMean(){
  var zh=WCM.lang==='zh-TW';
  var n=ri(3,5), nums=[], sum=0;
  for(var i=0;i<n;i++){ var v=ri(2,20); nums.push(v); sum+=v; }
  var ans=sum/n;
  /* ensure integer answer */
  while(sum%n!==0){ nums=[]; sum=0; for(var j=0;j<n;j++){ var v2=ri(2,20); nums.push(v2); sum+=v2; } ans=sum/n; }
  display = zh ? ('求平均數：'+nums.join(', ')) : ('Find the mean: '+nums.join(', '));
  sol=[zh ? '總和 = '+nums.join(' + ')+' = '+sum : 'Sum = '+nums.join(' + ')+' = '+sum, zh ? '平均數 = '+sum+' ÷ '+n+' = '+ans : 'Mean = '+sum+' ÷ '+n+' = '+ans];
  return mkQ(display, ans, sol, WCM.t('statsHint_mean'), 2, 'input', null, null);
}

function genStatsMedian(){
  var zh=WCM.lang==='zh-TW';
  var n=5, nums=[];
  for(var i=0;i<n;i++) nums.push(ri(2,20));
  nums.sort(function(a,b){return a-b;});
  var ans=nums[2]; /* median of 5 is the 3rd */
  display = zh ? ('求中位數：'+nums.join(', ')) : ('Find the median: '+nums.join(', '));
  sol=[zh ? '排列後取中間的數：'+ans : 'After sorting, the middle value is: '+ans];
  /* also include mode if there is one */
  return mkQ(display, ans, sol, WCM.t('statsHint_median'), 2, 'input', null, null);
}

function genStatsLinegraph(){
  var zh=WCM.lang==='zh-TW';
  var days=[zh?'星期一':'Mon',zh?'星期二':'Tue',zh?'星期三':'Wed',zh?'星期四':'Thu'];
  var vals=[]; for(var i=0;i<4;i++) vals.push(ri(3,12));
  var dayIdx=ri(0,3);
  display = zh ? ('折線圖數據：'+days[0]+'='+vals[0]+', '+days[1]+'='+vals[1]+', '+days[2]+'='+vals[2]+', '+days[3]+'='+vals[3]+'。'+days[dayIdx]+'有多少？') : ('Line graph: '+days[0]+'='+vals[0]+', '+days[1]+'='+vals[1]+', '+days[2]+'='+vals[2]+', '+days[3]+'='+vals[3]+'. How many on '+days[dayIdx]+'?');
  sol=[zh ? days[dayIdx]+' = '+vals[dayIdx] : days[dayIdx]+' = '+vals[dayIdx]];
  return mkQ(display, vals[dayIdx], sol, WCM.t('statsHint_graph'), 2, 'input', null, null);
}

function genStatsPiechart(){
  var zh=WCM.lang==='zh-TW';
  var total=360, cat1=ri(60,180);
  var cat2=total-cat1;
  var pct=Math.round(cat1/total*100);
  display = zh ? ('圓形圖中一個扇形佔 '+cat1+'°，佔全部的百分之幾？') : ('A sector in a pie chart is '+cat1+'°. What percent of the whole?');
  sol=[zh ? cat1+' ÷ 360 × 100 = '+pct+'%' : cat1+' ÷ 360 × 100 = '+pct+'%'];
  return mkQ(display, pct, sol, WCM.t('statsHint_graph'), 3, 'input', null, null);
}

function genStatsProb(){
  var zh=WCM.lang==='zh-TW';
  var red=ri(2,6), blue=ri(2,6), green=ri(1,4);
  var total=red+blue+green;
  /* probability of red as fraction num/total, ask for num */
  display = zh ? ('袋中有 '+red+' 紅、'+blue+' 藍、'+green+' 綠球。抽中紅球的概率 = ?/'+total) : ('Bag: '+red+' red, '+blue+' blue, '+green+' green. P(red) = ?/'+total);
  sol=[zh ? '紅球 '+red+' 個，總共 '+total+' 個' : 'Red: '+red+', total: '+total, zh ? 'P(紅) = '+red+'/'+total : 'P(red) = '+red+'/'+total];
  return mkQ(display, red, sol, WCM.t('statsHint_prob'), 3, 'input', null, null);
}

function genStatsMixed(){
  return pick([genStatsMean, genStatsMedian, genStatsLinegraph, genStatsPiechart, genStatsProb])();
}

/* ================ GENERATE DISPATCHER ================ */
WCM.generate = function(level){
  switch(level.gen){
    case 'review': return genReview();
    case 'order': return genOrder();
    case 'parens': return genParens();
    case 'twostep': return genTwoStep();
    case 'word': return genWord();
    case 'mixed': return genMixed();
    case 'laws': return genLaws();
    case 'checkwork': return genCheckWork();
    case 'dec_place': return genDecPlace();
    case 'dec_compare': return genDecCompare();
    case 'dec_add': return genDecAdd();
    case 'dec_sub': return genDecSub();
    case 'dec_mul': return genDecMul();
    case 'dec_mixed': return genDecMixed();
    case 'dec_word': return genDecWord();
    case 'geo_shape': return genGeoShape();
    case 'geo_angle': return genGeoAngle();
    case 'geo_perimeter': return genGeoPerimeter();
    case 'geo_area': return genGeoArea();
    case 'geo_lines': return genGeoLines();
    case 'geo_mixed': return genGeoMixed();
    case 'geo_word': return genGeoWord();
    case 'sp_shape': return genSpShape();
    case 'sp_props': return genSpProps();
    case 'sp_net': return genSpNet();
    case 'sp_volume': return genSpVolume();
    case 'sp_count': return genSpCount();
    case 'sp_mixed': return genSpMixed();
    case 'sp_word': return genSpWord();
    /* P5: Fractions */
    case 'frac_equiv': return genFracEquiv();
    case 'frac_simplify': return genFracSimplify();
    case 'frac_add_same': return genFracAddSame();
    case 'frac_add_diff': return genFracAddDiff();
    case 'frac_mul_div': return genFracMulDiv();
    case 'frac_mixed': return genFracMixed();
    /* P5: Percentages */
    case 'pct_meaning': return genPctMeaning();
    case 'pct_convert': return genPctConvert();
    case 'pct_find': return genPctFind();
    case 'pct_change': return genPctChange();
    case 'pct_discount': return genPctDiscount();
    case 'pct_mixed': return genPctMixed();
    /* P5: Ratio */
    case 'ratio_meaning': return genRatioMeaning();
    case 'ratio_simplify': return genRatioSimplify();
    case 'ratio_share': return genRatioShare();
    case 'ratio_direct': return genRatioDirect();
    case 'ratio_inverse': return genRatioInverse();
    case 'ratio_mixed': return genRatioMixed();
    /* P5: Advanced Geometry */
    case 'geo2_triangle': return genGeo2Triangle();
    case 'geo2_parallelogram': return genGeo2Parallelogram();
    case 'geo2_trapezium': return genGeo2Trapezium();
    case 'geo2_angle': return genGeo2Angle();
    case 'geo2_composite': return genGeo2Composite();
    case 'geo2_mixed': return genGeo2Mixed();
    /* P6: Negative Numbers */
    case 'neg_intro': return genNegIntro();
    case 'neg_compare': return genNegCompare();
    case 'neg_addsub': return genNegAddSub();
    case 'neg_word': return genNegWord();
    case 'neg_mixed': return genNegMixed();
    /* P6: Algebra */
    case 'alg_substitute': return genAlgSubstitute();
    case 'alg_onestep': return genAlgOnestep();
    case 'alg_twostep': return genAlgTwostep();
    case 'alg_word': return genAlgWord();
    case 'alg_formula': return genAlgFormula();
    case 'alg_mixed': return genAlgMixed();
    /* P6: Circle */
    case 'circ_parts': return genCircParts();
    case 'circ_pi': return genCircPi();
    case 'circ_circum': return genCircCircum();
    case 'circ_area': return genCircArea();
    case 'circ_sector': return genCircSector();
    case 'circ_mixed': return genCircMixed();
    /* P6: Statistics */
    case 'stats_mean': return genStatsMean();
    case 'stats_median': return genStatsMedian();
    case 'stats_linegraph': return genStatsLinegraph();
    case 'stats_piechart': return genStatsPiechart();
    case 'stats_prob': return genStatsProb();
    case 'stats_mixed': return genStatsMixed();
    default: return genReview();
  }
};

WCM.isCorrect = function(q, val){
  if(q.type==='mc'){
    if(typeof q.answer==='string') return String(val)===q.answer;
    var n=Number(val); return !isNaN(n) && Math.abs(n-q.answer)<0.005;
  }
  var n=Number(val); return !isNaN(n) && Math.abs(n-q.answer)<0.005;
};


/* ---------- question dedup & adaptive difficulty ---------- */
WCM.qKey = function(level, q){
  return (level.gen||'q')+'|'+q.display+'|'+q.answer;
};
WCM.markMastered = function(level, q){
  var key = WCM.qKey(level, q);
  if(!WCM.state.mastered) WCM.state.mastered = {};
  WCM.state.mastered[key] = true;
  var keys = Object.keys(WCM.state.mastered);
  if(keys.length > 300){
    for(var i = 0; i < keys.length - 250; i++) delete WCM.state.mastered[keys[i]];
  }
  WCM.saveState();
};
WCM.generateUnique = function(level, extraAvoid){
  var avoid = {};
  var m = WCM.state.mastered || {};
  for(var k in m) avoid[k] = true;
  if(extraAvoid) for(var k2 in extraAvoid) avoid[k2] = true;
  var q, key, tries = 0;
  do {
    q = WCM.generate(level);
    key = WCM.qKey(level, q);
    tries++;
  } while(avoid[key] && tries < 20);
  return q;
};

/* ================ STATE & STORAGE ================ */
WCM.KEY = 'wcm_save_v1';
WCM.defaultState = function(){
  return { profile:'Yaoyao', lang:'en', sound:true, points:0, grade:0,
    prey:{mouse:0,vole:0,squirrel:0,thrush:0,fish:0,rabbit:0}, progress:{}, achievements:[], badges:[],
    daily:{date:'',tasks:[false,false,false],claimed:false,correctToday:0,huntsToday:0},
    streak:{count:0,lastDate:''},
    visited:{}, cards:[], mastered:{}, attemptsCache:[], mistakesMirror:{}, weakPoints:[] };
};
WCM.loadState = function(){
  try{ var s=JSON.parse(localStorage.getItem(WCM.KEY)); if(s){
    var d=WCM.defaultState();
    s.prey = Object.assign({}, d.prey, s.prey||{});
    s.progress = s.progress||{};
    s.achievements = s.achievements||[];
    s.badges = s.badges||[];
    s.lang = s.lang||'en'; s.sound = s.sound!==false;
    s.daily = Object.assign({}, d.daily, s.daily||{});
    s.daily.tasks = s.daily.tasks||[false,false,false];
    s.streak = Object.assign({}, d.streak, s.streak||{});
    s.visited = s.visited||{};
    s.cards = s.cards||[];
    s.mastered = s.mastered||{};
    s.attemptsCache = s.attemptsCache||[];
    s.mistakesMirror = s.mistakesMirror||{};
    s.weakPoints = s.weakPoints||[];
    s.grade = s.grade||0;
    return s;
  } }catch(e){}
  return WCM.defaultState();
};
WCM.saveState = function(){ try{ localStorage.setItem(WCM.KEY, JSON.stringify(WCM.state)); }catch(e){} };

/* ---------- Daily Tasks & Streak ---------- */
WCM.todayStr = function(){
  var d=new Date();
  return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
};
WCM.yesterdayStr = function(){
  var d=new Date(); d.setDate(d.getDate()-1);
  return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
};
WCM.checkDaily = function(){
  var today=WCM.todayStr();
  if(WCM.state.daily.date !== today){
    /* new day: reset daily tasks */
    WCM.state.daily = {date:today, tasks:[false,false,false], claimed:false, correctToday:0, huntsToday:0};
    /* streak: if last active was yesterday, keep; if today already counted, keep; else reset */
    if(WCM.state.streak.lastDate === WCM.yesterdayStr()){
      /* streak continues, will increment on first activity */
    } else if(WCM.state.streak.lastDate !== today){
      WCM.state.streak.count = 0;
    }
    WCM.saveState();
  }
};
WCM.trackCorrect = function(){
  WCM.checkDaily();
  WCM.state.daily.correctToday++;
  if(WCM.state.daily.correctToday>=10) WCM.state.daily.tasks[1]=true;
  WCM.saveState();
};
WCM.trackHuntComplete = function(){
  WCM.checkDaily();
  WCM.state.daily.huntsToday++;
  if(WCM.state.daily.huntsToday>=1) WCM.state.daily.tasks[0]=true;
  WCM.saveState();
};
WCM.trackPractice = function(){
  WCM.checkDaily();
  WCM.state.daily.tasks[2]=true;
  WCM.saveState();
};
WCM.allDailyDone = function(){
  return WCM.state.daily.tasks[0] && WCM.state.daily.tasks[1] && WCM.state.daily.tasks[2];
};
WCM.claimDailyBonus = function(){
  if(WCM.allDailyDone() && !WCM.state.daily.claimed){
    WCM.state.daily.claimed=true;
    WCM.state.points+=30;
    /* update streak */
    var today=WCM.todayStr();
    if(WCM.state.streak.lastDate !== today){
      WCM.state.streak.count++;
      WCM.state.streak.lastDate=today;
    }
    WCM.saveState();
    WCM.audio.levelup();
    return true;
  }
  return false;
};
WCM.streakActive = function(){
  var today=WCM.todayStr();
  return WCM.state.streak.lastDate===today || WCM.state.streak.lastDate===WCM.yesterdayStr();
};

/* ---------- Visited regions (story chapters) ---------- */
WCM.hasVisited = function(regionId){ return !!WCM.state.visited[regionId]; };
WCM.markVisited = function(regionId){
  if(!WCM.state.visited[regionId]){ WCM.state.visited[regionId]=true; WCM.saveState(); return true; }
  return false;
};

WCM.hasCard = function(id){ return WCM.state.cards && WCM.state.cards.indexOf(id)!==-1; };
WCM.addCard = function(id){ if(!WCM.hasCard(id)){ WCM.state.cards=WCM.state.cards||[]; WCM.state.cards.push(id); WCM.saveState(); return true; } return false; };
WCM.cardCount = function(){ return WCM.state.cards?WCM.state.cards.length:0; };
WCM.signatureCardForRank = function(idx){ for(var i=0;i<WCM.CARDS.length;i++) if(WCM.CARDS[i].earn===('r'+idx)) return WCM.CARDS[i].id; return null; };
WCM.randomUncollectedCard = function(){ var pool=[]; for(var i=0;i<WCM.CARDS.length;i++) if(!WCM.hasCard(WCM.CARDS[i].id)) pool.push(WCM.CARDS[i].id); if(!pool.length) return null; return pool[Math.floor(Math.random()*pool.length)]; };

WCM.state = WCM.loadState();
WCM.lang = WCM.state.lang;

WCM.setLang = function(l){ WCM.state.lang=l; WCM.lang=l; WCM.saveState(); };
WCM.setGrade = function(g){ WCM.state.grade=g||0; WCM.saveState(); };
WCM.setSound = function(on){ WCM.state.sound=on; WCM.saveState(); };
WCM.addReward = function(preyKey, pts){ WCM.state.prey[preyKey]=(WCM.state.prey[preyKey]||0)+1; WCM.state.points+=pts; WCM.saveState(); };
WCM.recordLevel = function(id, stars, scoreCorrect, tier){
  var p=WCM.state.progress[id]||{stars:0,best:0,attempts:0,tier:0};
  p.attempts++; if(stars>p.stars) p.stars=stars; p.best=Math.max(p.best,scoreCorrect);
  if(tier!=null && tier>(p.tier||0)) p.tier=tier;
  WCM.state.progress[id]=p; WCM.saveState();
};
WCM.getProgress = function(id){ return WCM.state.progress[id]||{stars:0,best:0,attempts:0,tier:0}; };
WCM.totalPrey = function(){ var s=0; var p=WCM.state.prey; for(var k in p) s+=p[k]; return s; };
WCM.hasBadge = function(regionId){ return WCM.state.badges.indexOf(regionId)!==-1; };
WCM.awardBadge = function(regionId){
  if(!WCM.hasBadge(regionId)){ WCM.state.badges.push(regionId); WCM.saveState(); return true; }
  return false;
};
WCM.regionStars = function(regionId){
  var levels = WCM.levelsInRegion(regionId), total=0;
  levels.forEach(function(lv){ total += WCM.getProgress(lv.id).stars; });
  return total;
};

/* ================ AUDIO ================ */
WCM.audio = (function(){
  var ctx=null;
  function ac(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(ctx && ctx.state==='suspended'){ try{ ctx.resume(); }catch(e){} } return ctx; }
  function beep(freq,dur,type,vol){ if(!WCM.state.sound) return; var c=ac(); if(!c) return; var o=c.createOscillator(),g=c.createGain(); o.type=type||'sine'; o.frequency.value=freq; o.connect(g); g.connect(c.destination); var now=c.currentTime; g.gain.setValueAtTime(vol||0.15,now); g.gain.exponentialRampToValueAtTime(0.001,now+dur); o.start(now); o.stop(now+dur); }
  return {
    resume: ac,
    correct: function(){ beep(660,0.12,'triangle',0.18); setTimeout(function(){beep(880,0.16,'triangle',0.18);},110); },
    wrong: function(){ beep(220,0.22,'sawtooth',0.12); setTimeout(function(){beep(160,0.22,'sawtooth',0.12);},120); },
    click: function(){ beep(420,0.05,'square',0.06); },
    star: function(){ beep(988,0.1,'triangle',0.14); },
    badge: function(){ [523,659,784,988,1047].forEach(function(f,i){ setTimeout(function(){beep(f,0.16,'triangle',0.18);}, i*100); }); },
    levelup: function(){ [523,659,784,1047].forEach(function(f,i){ setTimeout(function(){beep(f,0.18,'triangle',0.18);}, i*140); }); }
  };
})();
WCM.saveLocal = function(){ try{ localStorage.setItem(WCM.KEY, JSON.stringify(WCM.state)); }catch(e){} };
WCM.saveState = function(){ WCM.saveLocal(); if(WCM.cloudPush) WCM.cloudPush(); };

/* ---------- attempt recording (Phase A: mistake book + weak points) ---------- */
WCM.recordAttempt = function(level, q, correct, userAnswer, tier, durationMs){
  if(!level || !q) return;
  var region = WCM.regionOfLevel(level.id);
  var season = region ? region.season : 0;
  var rec = {
    level_id: level.id,
    region: level.region || (region?region.id:''),
    season: season,
    kp: level.gen || '',
    q_key: WCM.qKey(level, q),
    correct: correct ? 1 : 0,
    user_answer: userAnswer!=null ? String(userAnswer) : null,
    correct_answer: q.answer!=null ? String(q.answer) : null,
    tier: tier!=null ? tier : null,
    duration_ms: durationMs!=null ? durationMs : null,
    svg: q.svg || null
  };
  if(!WCM.state.attemptsCache) WCM.state.attemptsCache = [];
  WCM.state.attemptsCache.push(rec);
  if(WCM.state.attemptsCache.length > 80) WCM.state.attemptsCache.shift();
  if(!correct){
    if(!WCM.state.mistakesMirror) WCM.state.mistakesMirror = {};
    var k = rec.q_key;
    var m = WCM.state.mistakesMirror[k] || { level_id: rec.level_id, kp: rec.kp, wrong_count: 0, next_review_at: new Date(Date.now()+86400000).toISOString() };
    m.wrong_count++; m.next_review_at = new Date(Date.now()+86400000).toISOString(); m.mastered = 0;
    m.display = q.display; m.user_answer = rec.user_answer; m.correct_answer = rec.correct_answer; m.level_id = rec.level_id; m.svg = q.svg || null;
    if(WCM.rqPut) WCM.rqPut(k, q);
    WCM.state.mistakesMirror[k] = m;
  }
  WCM.saveLocal();
  if(WCM.isLoggedIn && WCM.isLoggedIn()){
    WCM.api('attempts', 'POST', rec).then(function(r){
      if(r && r.error === 'Unauthorized'){ /* session expired - keep local */ }
    }).catch(function(){ /* offline - keep local */ });
  }
};
