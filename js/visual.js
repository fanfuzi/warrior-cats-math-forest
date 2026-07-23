/* Warrior Cats Math Forest - SVG visual generators for geometry & 3D shapes */
window.WCM = window.WCM || {};
WCM.svg = {};

var SV = 200; /* viewBox size */
var STROKE = '#2a1a0a';
var SW = 2.5;

/* wrap raw svg body in an svg element string */
function wrap(body, vb){
  return '<svg viewBox="0 0 '+(vb||SV)+' '+(vb||SV)+'" xmlns="http://www.w3.org/2000/svg" class="shape-svg">'+body+'</svg>';
}
function poly(points, fill, stroke){
  return '<polygon points="'+points+'" fill="'+fill+'" stroke="'+(stroke||STROKE)+'" stroke-width="'+SW+'" stroke-linejoin="round"/>';
}
/* text label helper replaced by label() */
/* label with background pill */
function label(x, y, text, size, color){
  size = size||15;
  var w = text.length * size * 0.62 + 8;
  return '<rect x="'+(x-w/2)+'" y="'+(y-size*0.72)+'" width="'+w+'" height="'+(size*1.15)+'" rx="'+(size*0.3)+'" fill="rgba(0,0,0,.55)" stroke="'+(color||'#ffd56b')+'" stroke-width="1"/>'+
         '<text x="'+x+'" y="'+(y+size*0.35)+'" font-size="'+size+'" fill="'+(color||'#ffd56b')+'" font-weight="800" text-anchor="middle" font-family="Nunito,sans-serif">'+text+'</text>';
}

/* ---- color palette per shape ---- */
var C = {
  red:'#e0654a', redL:'#f4947e', redD:'#b84a35',
  blue:'#5b9bd5', blueL:'#8fc1e8', blueD:'#3d7ab5',
  green:'#5cb85c', greenL:'#8fd68f', greenD:'#3e9e3e',
  orange:'#f4a738', orangeL:'#ffc870', orangeD:'#d4881a',
  purple:'#9b59b6', purpleL:'#c39bd3', purpleD:'#7d3c98',
  teal:'#2bb8a7', tealL:'#5fd9ca', tealD:'#1d9082',
  pink:'#e9688b', pinkL:'#f49bb4', pinkD:'#c94569'
};
function shade(c){ return {fill:c, light:c+'L', dark:c+'D'}; }

/* ============ 2D SHAPES ============ */

WCM.svg.triangle = function(fill){
  var c = fill||C.orange;
  return wrap(poly('100,35 160,145 40,145', fillShade(c,0)));
};
WCM.svg.square = function(fill){
  var c = fill||C.blue;
  return wrap(poly('40,40 160,40 160,160 40,160', fillShade(c,0)));
};
WCM.svg.rectangle = function(fill){
  var c = fill||C.green;
  return wrap(poly('25,55 175,55 175,145 25,145', fillShade(c,0)));
};
WCM.svg.circle = function(fill){
  var c = fill||C.red;
  return wrap('<circle cx="100" cy="100" r="62" fill="'+fillShade(c,0)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>');
};
WCM.svg.pentagon = function(fill){
  var c = fill||C.purple;
  return wrap(poly('100,35 160,78 137,150 63,150 40,78', fillShade(c,0)));
};
WCM.svg.hexagon = function(fill){
  var c = fill||C.teal;
  return wrap(poly('100,35 158,68 158,132 100,165 42,132 42,68', fillShade(c,0)));
};
WCM.svg.parallelogram = function(fill){
  var c = fill||C.pink;
  return wrap(poly('55,150 95,50 175,50 135,150', fillShade(c,0)));
};
WCM.svg.trapezium = function(fill){
  var c = fill||C.orange;
  return wrap(poly('35,155 165,155 135,55 65,55', fillShade(c,0)));
};
WCM.svg.rhombus = function(fill){
  var c = fill||C.purple;
  return wrap(poly('100,35 165,100 100,165 35,100', fillShade(c,0)));
};

/* helper to get a shade variant */
function fillShade(c, idx){
  if(typeof c==='string' && c[0]==='#'){
    var r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);
    if(idx===1){r=Math.min(255,Math.round(r+(255-r)*0.3));g=Math.min(255,Math.round(g+(255-g)*0.3));b=Math.min(255,Math.round(b+(255-b)*0.3));}
    else if(idx===2){r=Math.round(r*0.72);g=Math.round(g*0.72);b=Math.round(b*0.72);}
    return '#'+('0'+r.toString(16)).slice(-2)+('0'+g.toString(16)).slice(-2)+('0'+b.toString(16)).slice(-2);
  }
  if(idx===1) return C[c+'L']||C[c]||c;
  if(idx===2) return C[c+'D']||C[c]||c;
  return C[c]||c;
}

/* ============ LABELED RECTANGLE (perimeter / area) ============ */
WCM.svg.rectLabeled = function(w, h, unit){
  unit = unit||'cm';
  var pad = 30, maxW = 140, maxH = 110;
  var scale = Math.min(maxW/w, maxH/h);
  var dw = w*scale, dh = h*scale;
  var x0 = (SV-dw)/2, y0 = (SV-dh)/2;
  var body = '<rect x="'+x0+'" y="'+y0+'" width="'+dw+'" height="'+dh+'" fill="'+fillShade(C.blue,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  /* grid lines for area visualization (if small enough) */
  if(w<=12 && h<=12){
    var glines='';
    for(var i=1;i<w;i++) glines+='<line x1="'+(x0+i*scale)+'" y1="'+y0+'" x2="'+(x0+i*scale)+'" y2="'+(y0+dh)+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
    for(var j=1;j<h;j++) glines+='<line x1="'+x0+'" y1="'+(y0+j*scale)+'" x2="'+(x0+dw)+'" y2="'+(y0+j*scale)+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
    body = glines + body;
  }
  body += label(x0+dw/2, y0-6, w+unit, 14);
  body += label(x0-6, y0+dh/2, h+unit, 14, '#f5f0e1');
  /* rewrite labels with rotation for the height */
  return wrap(body);
};

/* ============ ANGLES ============ */
WCM.svg.angle = function(deg){
  var vx=100, vy=145, r=80, ar=32;
  var rad = deg*Math.PI/180;
  var x2 = vx + r*Math.cos(rad);
  var y2 = vy - r*Math.sin(rad);
  var ax2 = vx + ar*Math.cos(rad);
  var ay2 = vy - ar*Math.sin(rad);
  var largeArc = deg>180?1:0;
  var body = '';
  /* rays */
  body += '<line x1="'+vx+'" y1="'+vy+'" x2="'+(vx+r)+'" y2="'+vy+'" stroke="#f5f0e1" stroke-width="3.5" stroke-linecap="round"/>';
  body += '<line x1="'+vx+'" y1="'+vy+'" x2="'+x2+'" y2="'+y2+'" stroke="#f5f0e1" stroke-width="3.5" stroke-linecap="round"/>';
  /* arc */
  body += '<path d="M'+(vx+ar)+','+vy+' A'+ar+','+ar+' 0 '+largeArc+' 0 '+ax2+','+ay2+'" fill="none" stroke="#ffd56b" stroke-width="2.5"/>';
  /* vertex dot */
  body += '<circle cx="'+vx+'" cy="'+vy+'" r="4" fill="#f5f0e1"/>';
  /* right angle square */
  if(deg===90){
    body += '<rect x="'+vx+'" y="'+(vy-22)+'" width="22" height="22" fill="none" stroke="#ffd56b" stroke-width="2"/>';
  }
  return wrap(body);
};

/* ============ LINES (parallel / perpendicular / intersecting) ============ */
WCM.svg.lines = function(type){
  var body='';
  if(type==='parallel'){
    body += '<line x1="25" y1="65" x2="175" y2="65" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<line x1="25" y1="135" x2="175" y2="135" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<text x="100" y="185" font-size="13" fill="#c9c0a8" text-anchor="middle" font-family="Nunito,sans-serif">↔</text>';
  } else if(type==='perpendicular'){
    body += '<line x1="20" y1="100" x2="180" y2="100" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<line x1="100" y1="20" x2="100" y2="180" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<rect x="100" y="100" width="20" height="20" fill="none" stroke="#ffd56b" stroke-width="2"/>';
    body += '<circle cx="100" cy="100" r="3" fill="#ffd56b"/>';
  } else { /* intersecting */
    body += '<line x1="25" y1="35" x2="175" y2="165" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<line x1="25" y1="165" x2="175" y2="35" stroke="#f5f0e1" stroke-width="4" stroke-linecap="round"/>';
    body += '<circle cx="100" cy="100" r="4" fill="#ffd56b"/>';
  }
  return wrap(body);
};

/* ============ 3D SHAPES (oblique projection) ============ */

WCM.svg.cube3d = function(fill){
  var c = fill||C.blue;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  var x=55, y=55, s=90, dx=35, dy=-22;
  var body='';
  /* top face */
  body += poly(x+','+y+' '+(x+s)+','+y+' '+(x+s+dx)+','+(y+dy)+' '+(x+dx)+','+(y+dy), l);
  /* right face */
  body += poly((x+s)+','+y+' '+(x+s+dx)+','+(y+dy)+' '+(x+s+dx)+','+(y+s+dy)+' '+(x+s)+','+(y+s), d);
  /* front face */
  body += poly(x+','+y+' '+(x+s)+','+y+' '+(x+s)+','+(y+s)+' '+x+','+(y+s), f);
  return wrap(body);
};

WCM.svg.cuboid3d = function(fill){
  var c = fill||C.green;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  var x=40, y=65, w=100, h=80, dx=40, dy=-25;
  var body='';
  body += poly(x+','+y+' '+(x+w)+','+y+' '+(x+w+dx)+','+(y+dy)+' '+(x+dx)+','+(y+dy), l);
  body += poly((x+w)+','+y+' '+(x+w+dx)+','+(y+dy)+' '+(x+w+dx)+','+(y+h+dy)+' '+(x+w)+','+(y+h), d);
  body += poly(x+','+y+' '+(x+w)+','+y+' '+(x+w)+','+(y+h)+' '+x+','+(y+h), f);
  return wrap(body);
};

WCM.svg.cylinder3d = function(fill){
  var c = fill||C.teal;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  var cx=100, ry=14, rx=48, top=50, bot=150;
  var body='';
  /* side */
  body += '<path d="M'+(cx-rx)+','+top+' L'+(cx-rx)+','+bot+' A'+rx+','+ry+' 0 0 0 '+(cx+rx)+','+bot+' L'+(cx+rx)+','+top+'" fill="'+f+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  /* bottom front arc */
  body += '<path d="M'+(cx-rx)+','+bot+' A'+rx+','+ry+' 0 0 0 '+(cx+rx)+','+bot+'" fill="'+d+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  /* top ellipse */
  body += '<ellipse cx="'+cx+'" cy="'+top+'" rx="'+rx+'" ry="'+ry+'" fill="'+l+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  return wrap(body);
};

WCM.svg.cone3d = function(fill){
  var c = fill||C.orange;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  var cx=100, rx=52, ry=14, baseY=155, apexY=35;
  var body='';
  body += '<path d="M'+(cx-rx)+','+baseY+' L'+cx+','+apexY+' L'+(cx+rx)+','+baseY+'" fill="'+l+'" stroke="'+STROKE+'" stroke-width="'+SW+'" stroke-linejoin="round"/>';
  body += '<path d="M'+(cx-rx)+','+baseY+' A'+rx+','+ry+' 0 0 0 '+(cx+rx)+','+baseY+'" fill="'+d+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  return wrap(body);
};

WCM.svg.sphere3d = function(fill){
  var c = fill||C.red;
  var f = fillShade(c,0), l = fillShade(c,1);
  var cx=100, cy=100, r=62;
  var body='';
  body += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+f+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  body += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="20" fill="none" stroke="'+l+'" stroke-width="1.5" opacity="0.5"/>';
  body += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="20" ry="'+r+'" fill="none" stroke="'+l+'" stroke-width="1.5" opacity="0.5"/>';
  body += '<ellipse cx="'+(cx-20)+'" cy="'+(cy-20)+'" rx="16" ry="12" fill="'+l+'" opacity="0.35"/>';
  return wrap(body);
};

WCM.svg.prism3d = function(fill){
  var c = fill||C.purple;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  /* front triangle: bottom-left, top, bottom-right */
  var ax=55, bx=100, cx=145, by=145, ty=50;
  var dx=35, dy=-22;
  var body='';
  /* right rectangular face */
  body += poly(cx+','+by+' '+(cx+dx)+','+(by+dy)+' '+(bx+dx)+','+(ty+dy)+' '+bx+','+ty, d);
  /* top rectangular face */
  body += poly(bx+','+ty+' '+(bx+dx)+','+(ty+dy)+' '+(ax+dx)+','+(by+dy)+' '+ax+','+by, l);
  /* front triangle */
  body += poly(ax+','+by+' '+bx+','+ty+' '+cx+','+by, f);
  return wrap(body);
};

WCM.svg.pyramid3d = function(fill){
  var c = fill||C.pink;
  var f = fillShade(c,0), l = fillShade(c,1), d = fillShade(c,2);
  var apexX=100, apexY=35;
  var frontX=100, frontY=158;
  var rightX=158, rightY=128;
  var backX=100, backY=98;
  var leftX=42, leftY=128;
  var body='';
  /* base (visible front half) */
  body += poly(leftX+','+leftY+' '+frontX+','+frontY+' '+rightX+','+rightY+' '+backX+','+backY+' '+leftX+','+leftY, d);
  /* left front face */
  body += poly(leftX+','+leftY+' '+frontX+','+frontY+' '+apexX+','+apexY, f);
  /* right front face */
  body += poly(frontX+','+frontY+' '+rightX+','+rightY+' '+apexX+','+apexY, l);
  return wrap(body);
};

/* ============ CUBOID WITH DIMENSIONS (volume) ============ */
WCM.svg.cuboidLabeled = function(w, h, d, unit){
  unit = unit||'cm';
  var c = C.blue;
  var f = fillShade(c,0), l = fillShade(c,1), dc = fillShade(c,2);
  var x=45, y=70, dw=90, dh=70, dx=38, dy=-24;
  var body='';
  body += poly(x+','+y+' '+(x+dw)+','+y+' '+(x+dw+dx)+','+(y+dy)+' '+(x+dx)+','+(y+dy), l);
  body += poly((x+dw)+','+y+' '+(x+dw+dx)+','+(y+dy)+' '+(x+dw+dx)+','+(y+dh+dy)+' '+(x+dw)+','+(y+dh), dc);
  body += poly(x+','+y+' '+(x+dw)+','+y+' '+(x+dw)+','+(y+dh)+' '+x+','+(y+dh), f);
  /* labels */
  body += label(x+dw/2, y+dh+18, w+unit, 13);
  body += label(x-8, y+dh/2, h+unit, 13, '#f5f0e1');
  body += label(x+dw+dx+12, y+dy+dh/2, d+unit, 12, '#8fc1e8');
  return wrap(body);
};

/* ============ CUBE STACK (counting cubes) ============ */
WCM.svg.cubeStack = function(w, h, d){
  /* renders a w×h×d arrangement of small cubes in oblique projection */
  var s = Math.min(80/w, 80/h, 60/d); /* cube size */
  s = Math.max(s, 14);
  var dx = s*0.4, dy = -s*0.25;
  var ox = (SV - (w*s + d*dx))/2;
  var oy = (SV - (h*s + d*(-dy)))/2 + 10;
  var cubes = [];
  /* iterate back-to-front, bottom-to-top for correct z-order */
  for(var dd=d-1; dd>=0; dd--){
    for(var hh=0; hh<h; hh++){
      for(var ww=0; ww<w; ww++){
        var bx = ox + ww*s + dd*dx;
        var by = oy + hh*s + dd*dy;
        cubes.push({x:bx, y:by, s:s, dx:dx, dy:dy});
      }
    }
  }
  var body='';
  cubes.forEach(function(c){
    var x=c.x, y=c.y, cs=c.s, cdx=c.dx, cdy=c.dy;
    /* only draw visible faces (front, top, right) - for edge cubes only */
    body += poly((x+cdx)+','+(y+cdy)+' '+(x+cs+cdx)+','+(y+cdy)+' '+(x+cs+cdx+cdx)+','+(y+cdy+cdy)+' '+(x+cs+cdx*2)+','+(y+cdy+cdy), fillShade(C.orange,1));
  });
  /* simpler: draw front, top, right faces of the whole block, plus grid lines */
  body='';
  var bx0=ox, by0=oy;
  var bx1=ox+w*s, by1=oy+h*s;
  var bx2=bx1+d*dx, by2=by1+d*dy;
  var bx3=ox+d*dx, by3=oy+d*dy;
  /* top face */
  body += poly(bx0+','+by0+' '+bx1+','+by0+' '+bx2+','+by3+' '+bx3+','+by3, fillShade(C.blue,1));
  /* right face */
  body += poly(bx1+','+by0+' '+bx2+','+by3+' '+bx2+','+(by1+d*dy)+' '+bx1+','+by1, fillShade(C.blue,2));
  /* front face */
  body += poly(bx0+','+by0+' '+bx1+','+by0+' '+bx1+','+by1+' '+bx0+','+by1, fillShade(C.blue,0));
  /* grid lines on front face */
  for(var i=1;i<w;i++){
    body += '<line x1="'+(bx0+i*s)+'" y1="'+by0+'" x2="'+(bx0+i*s)+'" y2="'+by1+'" stroke="rgba(255,255,255,.3)" stroke-width="1"/>';
  }
  for(var j=1;j<h;j++){
    body += '<line x1="'+bx0+'" y1="'+(by0+j*s)+'" x2="'+bx1+'" y2="'+(by0+j*s)+'" stroke="rgba(255,255,255,.3)" stroke-width="1"/>';
  }
  /* grid lines on top face */
  for(var i2=1;i2<w;i2++){
    body += '<line x1="'+(bx0+i2*s)+'" y1="'+by0+'" x2="'+(bx3+i2*s)+'" y2="'+by3+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
  }
  for(var j2=1;j2<d;j2++){
    body += '<line x1="'+(bx0+j2*dx)+'" y1="'+(by0+j2*dy)+'" x2="'+(bx1+j2*dx)+'" y2="'+(by0+j2*dy)+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
  }
  /* grid lines on right face */
  for(var k=1;k<h;k++){
    body += '<line x1="'+bx1+'" y1="'+(by0+k*s)+'" x2="'+bx2+'" y2="'+(by3+k*s)+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
  }
  for(var m=1;m<d;m++){
    body += '<line x1="'+(bx1+m*dx)+'" y1="'+(by0+m*dy)+'" x2="'+(bx1+m*dx)+'" y2="'+(by1+m*dy)+'" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
  }
  return wrap(body);
};

/* ============ NETS ============ */
WCM.svg.netCube = function(){
  var s=32, x0=84, y0=52;
  var r = function(x,y,f){ return '<rect x="'+x+'" y="'+y+'" width="'+s+'" height="'+s+'" fill="'+f+'" stroke="'+STROKE+'" stroke-width="2" rx="2"/>'; };
  var fl = fillShade(C.blue,0), lt = fillShade(C.blue,1);
  var body = r(x0,y0-s,lt)+r(x0-s,y0,lt)+r(x0,y0,fl)+r(x0+s,y0,lt)+r(x0+2*s,y0,lt)+r(x0,y0+s,lt);
  return wrap(body);
};

WCM.svg.netCylinder = function(){
  var rx=42, ry=13, rt=55, rb=145;
  var rectTop=80, rectBot=120;
  var f = fillShade(C.teal,0), l = fillShade(C.teal,1);
  var body = '<ellipse cx="100" cy="'+rt+'" rx="'+rx+'" ry="'+ry+'" fill="'+l+'" stroke="'+STROKE+'" stroke-width="2"/>';
  body += '<rect x="'+(100-rx)+'" y="'+rectTop+'" width="'+(rx*2)+'" height="'+(rectBot-rectTop)+'" fill="'+f+'" stroke="'+STROKE+'" stroke-width="2"/>';
  body += '<ellipse cx="100" cy="'+rb+'" rx="'+rx+'" ry="'+ry+'" fill="'+l+'" stroke="'+STROKE+'" stroke-width="2"/>';
  return wrap(body);
};

WCM.svg.netCone = function(){
  var cx=100, cy=65, r=58;
  var a1 = 130*Math.PI/180, a2 = 410*Math.PI/180;
  var x1 = cx+r*Math.cos(a1), y1 = cy+r*Math.sin(a1);
  var x2 = cx+r*Math.cos(a2), y2 = cy+r*Math.sin(a2);
  var f = fillShade(C.orange,0), l = fillShade(C.orange,1);
  var body = '<path d="M'+cx+','+cy+' L'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 1 1 '+x2.toFixed(1)+','+y2.toFixed(1)+' Z" fill="'+l+'" stroke="'+STROKE+'" stroke-width="2"/>';
  body += '<circle cx="100" cy="155" r="18" fill="'+f+'" stroke="'+STROKE+'" stroke-width="2"/>';
  return wrap(body);
};

WCM.svg.netPrism = function(){
  var s=34;
  var fl = fillShade(C.purple,0), lt = fillShade(C.purple,1);
  var x0=66, y0=58;
  var body = '';
  /* three rectangles */
  body += '<rect x="'+x0+'" y="'+y0+'" width="'+s+'" height="'+(s*2)+'" fill="'+lt+'" stroke="'+STROKE+'" stroke-width="2" rx="2"/>';
  body += '<rect x="'+(x0+s)+'" y="'+y0+'" width="'+s+'" height="'+(s*2)+'" fill="'+fl+'" stroke="'+STROKE+'" stroke-width="2" rx="2"/>';
  body += '<rect x="'+(x0+2*s)+'" y="'+y0+'" width="'+s+'" height="'+(s*2)+'" fill="'+lt+'" stroke="'+STROKE+'" stroke-width="2" rx="2"/>';
  /* top triangle */
  body += poly((x0)+','+y0+' '+(x0+s)+','+(y0-s*0.8)+' '+(x0+s)+','+y0, lt);
  /* bottom triangle */
  body += poly((x0)+','+(y0+s*2)+' '+(x0+s)+','+(y0+s*2)+' '+(x0+s)+','+(y0+s*2+s*0.8), lt);
  return wrap(body);
};

WCM.svg.netPyramid = function(){
  var s=46, x0=77, y0=77;
  var fl = fillShade(C.pink,0), lt = fillShade(C.pink,1);
  var body = '<rect x="'+x0+'" y="'+y0+'" width="'+s+'" height="'+s+'" fill="'+fl+'" stroke="'+STROKE+'" stroke-width="2" rx="2"/>';
  /* 4 triangles */
  body += poly(x0+','+y0+' '+(x0+s)+','+y0+' '+(x0+s/2)+','+(y0-s*0.85), lt);
  body += poly((x0+s)+','+y0+' '+(x0+s)+','+(y0+s)+' '+(x0+s+s*0.85)+','+(y0+s/2), lt);
  body += poly(x0+','+(y0+s)+' '+(x0+s)+','+(y0+s)+' '+(x0+s/2)+','+(y0+s+s*0.85), lt);
  body += poly(x0+','+y0+' '+x0+','+(y0+s)+' '+(x0-s*0.85)+','+(y0+s/2), lt);
  return wrap(body);
};

/* ============ P5-P6 NEW SVG GENERATORS ============ */

/* ---- Fraction pie chart: num/den shaded ---- */
WCM.svg.fractionPie = function(num, den){
  if(den<=0) den=1; if(num>den) num=den; if(num<0) num=0;
  var cx=100, cy=100, r=70;
  var body = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fillShade(C.teal,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  if(num>0 && num<den){
    var startAngle = -90*Math.PI/180;
    var sliceAngle = (num/den)*2*Math.PI;
    var endAngle = startAngle + sliceAngle;
    var x1 = cx + r*Math.cos(startAngle), y1 = cy + r*Math.sin(startAngle);
    var x2 = cx + r*Math.cos(endAngle), y2 = cy + r*Math.sin(endAngle);
    var largeArc = sliceAngle > Math.PI ? 1 : 0;
    body += '<path d="M'+cx+','+cy+' L'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 '+largeArc+' 1 '+x2.toFixed(1)+','+y2.toFixed(1)+' Z" fill="'+fillShade(C.orange,0)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
    /* dividing lines for visual clarity */
    for(var i=1;i<den;i++){
      if(den<=12){
        var a = startAngle + (i/den)*2*Math.PI;
        var ex = cx + r*Math.cos(a), ey = cy + r*Math.sin(a);
        body += '<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="rgba(0,0,0,.2)" stroke-width="1"/>';
      }
    }
  } else if(num===den){
    body = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fillShade(C.orange,0)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
    for(var j=1;j<den && den<=12;j++){
      var a2 = -90*Math.PI/180 + (j/den)*2*Math.PI;
      var ex2 = cx + r*Math.cos(a2), ey2 = cy + r*Math.sin(a2);
      body += '<line x1="'+cx+'" y1="'+cy+'" x2="'+ex2.toFixed(1)+'" y2="'+ey2.toFixed(1)+'" stroke="rgba(0,0,0,.2)" stroke-width="1"/>';
    }
  }
  body += label(cx, cy-r-18, num+' / '+den, 16);
  return wrap(body);
};

/* ---- Triangle with base & height labels ---- */
WCM.svg.triangleLabeled = function(base, height, unit){
  unit = unit||'cm';
  var maxW=130, maxH=100;
  var scale = Math.min(maxW/base, maxH/height);
  var dw=base*scale, dh=height*scale;
  var bx0=(SV-dw)/2, by1=150;
  var bx1=bx0+dw, by0=by1-dh;
  var apexX=bx0+dw*0.4;
  var body = '<polygon points="'+bx0+','+by1+' '+bx1+','+by1+' '+apexX+','+by0+'" fill="'+fillShade(C.orange,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'" stroke-linejoin="round"/>';
  /* height dashed line */
  body += '<line x1="'+apexX+'" y1="'+by1+'" x2="'+apexX+'" y2="'+by0+'" stroke="'+C.red+'" stroke-width="1.5" stroke-dasharray="4,3"/>';
  body += '<rect x="'+apexX+'" y="'+by1+'" width="6" height="6" fill="none" stroke="'+C.red+'" stroke-width="1"/>';
  body += label(bx0+dw/2, by1+12, base+unit, 13);
  body += label(apexX+20, (by0+by1)/2, height+unit, 12, '#f5f0e1');
  return wrap(body);
};

/* ---- Parallelogram with base & height labels ---- */
WCM.svg.parallelogramLabeled = function(base, height, unit){
  unit = unit||'cm';
  var maxW=130, maxH=80;
  var scale = Math.min(maxW/base, maxH/height);
  var dw=base*scale, dh=height*scale;
  var skew=20;
  var x0=(SV-dw)/2, y1=145, y0=y1-dh;
  var body = '<polygon points="'+x0+','+y1+' '+(x0+dw)+','+y1+' '+(x0+dw-skew)+','+y0+' '+(x0-skew)+','+y0+'" fill="'+fillShade(C.pink,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  body += '<line x1="'+(x0+dw-skew)+'" y1="'+y0+'" x2="'+(x0+dw-skew)+'" y2="'+y1+'" stroke="'+C.red+'" stroke-width="1.5" stroke-dasharray="4,3"/>';
  body += '<rect x="'+(x0+dw-skew)+'" y="'+y1+'" width="6" height="6" fill="none" stroke="'+C.red+'" stroke-width="1"/>';
  body += label(x0+dw/2, y1+12, base+unit, 13);
  body += label(x0+dw-skew+20, (y0+y1)/2, height+unit, 12, '#f5f0e1');
  return wrap(body);
};

/* ---- Trapezium with top & bottom & height labels ---- */
WCM.svg.trapeziumLabeled = function(top, bottom, height, unit){
  unit = unit||'cm';
  var maxW=140, maxH=80;
  var scale = Math.min(maxW/bottom, maxH/height);
  var dt=top*scale, db=bottom*scale, dh=height*scale;
  var x0=(SV-db)/2, y1=145, y0=y1-dh;
  var xt0=x0+(db-dt)/2, xt1=xt0+dt;
  var body = '<polygon points="'+x0+','+y1+' '+(x0+db)+','+y1+' '+xt1+','+y0+' '+xt0+','+y0+'" fill="'+fillShade(C.purple,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  body += '<line x1="'+xt0+'" y1="'+y0+'" x2="'+xt0+'" y2="'+y1+'" stroke="'+C.red+'" stroke-width="1.5" stroke-dasharray="4,3"/>';
  body += '<rect x="'+xt0+'" y="'+y1+'" width="6" height="6" fill="none" stroke="'+C.red+'" stroke-width="1"/>';
  body += label(x0+db/2, y1+12, bottom+unit, 13);
  body += label((xt0+xt1)/2, y0-12, top+unit, 12, '#f5f0e1');
  body += label(xt0-18, (y0+y1)/2, height+unit, 12, '#f5f0e1');
  return wrap(body);
};

/* ---- Circle with radius/diameter labels ---- */
WCM.svg.circleLabeled = function(showR, showD){
  var cx=100, cy=100, r=65;
  var body = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fillShade(C.blue,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  /* center dot */
  body += '<circle cx="'+cx+'" cy="'+cy+'" r="3" fill="'+STROKE+'"/>';
  if(showR){
    body += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r)+'" y2="'+cy+'" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="0"/>';
    body += label(cx+r/2, cy-10, 'r', 14, '#ffd56b');
  }
  if(showD){
    body += '<line x1="'+(cx-r)+'" y1="'+cy+'" x2="'+(cx+r)+'" y2="'+cy+'" stroke="'+C.gold+'" stroke-width="2"/>';
    body += label(cx, cy+18, 'd', 14, '#f5f0e1');
  }
  return wrap(body);
};

/* ---- Number line from min to max with optional marker ---- */
WCM.svg.numberLine = function(min, max, marker){
  var pad=24, w=SV-2*pad, h=40;
  var y=100;
  var range = max-min;
  if(range<=0) range=1;
  var step = w/range;
  var xOf = function(v){ return pad + (v-min)*step; };
  var body = '<line x1="'+pad+'" y1="'+y+'" x2="'+(SV-pad)+'" y2="'+y+'" stroke="'+STROKE+'" stroke-width="2.5"/>';
  /* ticks */
  var tickStep = range<=10 ? 1 : (range<=20 ? 2 : 5);
  for(var v=min; v<=max; v+=tickStep){
    var tx=xOf(v);
    body += '<line x1="'+tx+'" y1="'+(y-6)+'" x2="'+tx+'" y2="'+(y+6)+'" stroke="'+STROKE+'" stroke-width="1.5"/>';
    body += '<text x="'+tx+'" y="'+(y+22)+'" font-size="11" fill="'+C.gold+'" text-anchor="middle" font-family="sans-serif">'+v+'</text>';
  }
  /* zero emphasis */
  if(min<=0 && max>=0){
    var zx=xOf(0);
    body += '<circle cx="'+zx+'" cy="'+y+'" r="4" fill="'+C.gold+'"/>';
  }
  /* marker */
  if(marker!==undefined && marker!==null){
    var mx=xOf(marker);
    body += '<circle cx="'+mx+'" cy="'+y+'" r="7" fill="'+C.red+'" stroke="#fff" stroke-width="2"/>';
    body += '<text x="'+mx+'" y="'+(y-14)+'" font-size="13" fill="'+C.red+'" text-anchor="middle" font-weight="800" font-family="sans-serif">'+marker+'</text>';
  }
  return wrap(body);
};

/* ---- Composite shape: rectangle + triangle on top ---- */
WCM.svg.compositeShape = function(rw, rh, th, unit){
  unit = unit||'cm';
  var scale = Math.min(120/(rw), 90/(rh+th));
  var dw=rw*scale, dh=rh*scale, dth=th*scale;
  var x0=(SV-dw)/2, yRect0=120, yRect1=yRect0+dh;
  var apexX=x0+dw/2, apexY=yRect0-dth;
  var body = '<polygon points="'+x0+','+yRect0+' '+(x0+dw)+','+yRect0+' '+apexX+','+apexY+'" fill="'+fillShade(C.orange,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  body += '<rect x="'+x0+'" y="'+yRect0+'" width="'+dw+'" height="'+dh+'" fill="'+fillShade(C.blue,1)+'" stroke="'+STROKE+'" stroke-width="'+SW+'"/>';
  body += label(x0+dw/2, yRect1+12, rw+unit, 12);
  body += label(x0-16, (yRect0+yRect1)/2, rh+unit, 11, '#f5f0e1');
  body += label(apexX+24, (apexY+yRect0)/2, th+unit, 11, '#ffd56b');
  return wrap(body);
};

/* ---- Two fraction pies side by side for comparison ---- */
WCM.svg.fractionCompare = function(n1,d1,n2,d2){
  function halfPie(cx, num, den){
    var r=48, cy=100;
    var b = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fillShade(C.teal,1)+'" stroke="'+STROKE+'" stroke-width="2"/>';
    if(num>0 && num<den){
      var sa=-90*Math.PI/180, ea=sa+(num/den)*2*Math.PI;
      var x1=cx+r*Math.cos(sa), y1=cy+r*Math.sin(sa);
      var x2=cx+r*Math.cos(ea), y2=cy+r*Math.sin(ea);
      var la=(num/den)>0.5?1:0;
      b+='<path d="M'+cx+','+cy+' L'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 '+la+' 1 '+x2.toFixed(1)+','+y2.toFixed(1)+' Z" fill="'+fillShade(C.orange,0)+'" stroke="'+STROKE+'" stroke-width="1.5"/>';
    } else if(num===den){ b=b.replace(fillShade(C.teal,1), fillShade(C.orange,0)); }
    b+=label(cx, cy+r+18, num+'/'+den, 13);
    return b;
  }
  return wrap(halfPie(65,n1,d1)+halfPie(135,n2,d2));
};

/* ============ CHARACTER CARDS ============ */
WCM.svg.catPortrait = function(c){
  var coat=c.coat, eye=c.eye, mark=c.mark||'solid', coat2=c.coat2||'#3a2a1a', ST='#241408';
  var role=(c.role&&c.role.en)||'', clan=c.clan||'';
  var g='<g class="cat-portrait">';
  g+='<path d="M150,186 Q190,172 180,142 Q175,128 158,138" fill="none" stroke="'+coat+'" stroke-width="14" stroke-linecap="round"/>';
  g+='<path d="M54,196 Q46,132 100,130 Q154,132 146,196 Z" fill="'+coat+'" stroke="'+ST+'" stroke-width="3" stroke-linejoin="round"/>';
  g+='<path d="M84,196 Q86,152 100,152 Q114,152 116,196 Z" fill="#ffffff" opacity=".13"/>';
  g+='<ellipse cx="84" cy="194" rx="12" ry="8" fill="'+coat+'" stroke="'+ST+'" stroke-width="2.5"/>';
  g+='<ellipse cx="116" cy="194" rx="12" ry="8" fill="'+coat+'" stroke="'+ST+'" stroke-width="2.5"/>';
  g+='<circle cx="100" cy="96" r="44" fill="'+coat+'" stroke="'+ST+'" stroke-width="3"/>';
  g+='<path d="M62,76 L56,36 L92,62 Z" fill="'+coat+'" stroke="'+ST+'" stroke-width="3" stroke-linejoin="round"/>';
  g+='<path d="M138,76 L144,36 L108,62 Z" fill="'+coat+'" stroke="'+ST+'" stroke-width="3" stroke-linejoin="round"/>';
  g+='<path d="M66,70 L62,46 L84,62 Z" fill="#f7a8b8"/>';
  g+='<path d="M134,70 L138,46 L116,62 Z" fill="#f7a8b8"/>';
  g+='<path d="M100,116 Q84,120 80,104 Q92,132 100,132 Q108,132 120,104 Q116,120 100,116 Z" fill="#ffffff" opacity=".12"/>';
  if(mark==='tabby'){
    g+='<g fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" opacity=".18">'+
      '<path d="M100,56 Q94,64 88,58"/><path d="M100,56 Q106,64 112,58"/><path d="M100,62 L100,72"/>'+
      '<path d="M70,88 L56,86"/><path d="M70,98 L56,100"/><path d="M70,108 L58,110"/>'+
      '<path d="M130,88 L144,86"/><path d="M130,98 L144,100"/><path d="M130,108 L142,110"/></g>';
  } else if(mark==='tortie'){
    g+='<path d="M70,72 Q58,96 74,116 Q88,100 82,76 Z" fill="'+coat2+'" opacity=".92"/>';
    g+='<path d="M124,70 Q140,86 132,108 Q120,96 120,78 Z" fill="'+coat2+'" opacity=".92"/>';
    g+='<path d="M108,150 Q126,156 122,176 Q112,168 108,156 Z" fill="'+coat2+'" opacity=".85"/>';
  } else if(mark==='tuxedo'){
    g+='<path d="M84,196 Q86,150 100,150 Q114,150 116,196 Z" fill="#f4f1ea"/>';
    g+='<path d="M100,116 Q88,122 82,110 Q94,134 100,134 Q106,134 118,110 Q112,122 100,116 Z" fill="#f4f1ea"/>';
    g+='<ellipse cx="84" cy="194" rx="6" ry="5" fill="#f4f1ea"/>';
    g+='<ellipse cx="116" cy="194" rx="6" ry="5" fill="#f4f1ea"/>';
  }
  g+='<ellipse cx="82" cy="98" rx="9.5" ry="12" fill="'+eye+'" stroke="'+ST+'" stroke-width="2"/>';
  g+='<ellipse cx="118" cy="98" rx="9.5" ry="12" fill="'+eye+'" stroke="'+ST+'" stroke-width="2"/>';
  g+='<ellipse cx="82" cy="99" rx="2.6" ry="10" fill="#0e0a04"/>';
  g+='<ellipse cx="118" cy="99" rx="2.6" ry="10" fill="#0e0a04"/>';
  g+='<circle cx="85" cy="93" r="2.4" fill="#fff" opacity=".92"/>';
  g+='<circle cx="121" cy="93" r="2.4" fill="#fff" opacity=".92"/>';
  g+='<path d="M94,110 L106,110 L100,117 Z" fill="#e08aa0" stroke="'+ST+'" stroke-width="1.4"/>';
  g+='<path d="M100,117 Q95,123 90,121 M100,117 Q105,123 110,121" fill="none" stroke="'+ST+'" stroke-width="1.6" stroke-linecap="round"/>';
  g+='<g stroke="#ffffff" stroke-width="1.2" opacity=".8">'+
    '<line x1="74" y1="112" x2="44" y2="108"/>'+
    '<line x1="74" y1="117" x2="44" y2="120"/>'+
    '<line x1="126" y1="112" x2="156" y2="108"/>'+
    '<line x1="126" y1="117" x2="156" y2="120"/></g>';
  /* ear tufts */
  g+='<path d="M58,40 L53,27 L67,38 Z" fill="'+coat+'" opacity=".85"/>';
  g+='<path d="M142,40 L147,27 L133,38 Z" fill="'+coat+'" opacity=".85"/>';
  /* role & clan accessories (hidden cards pass a stripped object, so these skip) */
  if(role==='Clan Leader'){ g+='<text x="100" y="74" font-size="13" text-anchor="middle" fill="#ffd56b" stroke="#6a4a10" stroke-width="0.4">✦</text>'; }
  if(role==='Medicine Cat'){ g+='<g transform="translate(130,156)"><path d="M0,0 Q-6,-9 0,-15 Q6,-9 0,0 Z" fill="#6fcf6f" stroke="#2f5a26" stroke-width="0.8"/><path d="M0,-1 L0,-14" stroke="#2f5a26" stroke-width="0.8"/></g>'; }
  if(clan==='BloodClan'){ g+='<rect x="80" y="135" width="40" height="6" rx="3" fill="#6a2a6a" opacity=".92"/>'; g+='<g fill="#f0ece4"><path d="M84,141 l2.4,5 l2.4,-5z"/><path d="M94,141 l2.4,5 l2.4,-5z"/><path d="M104,141 l2.4,5 l2.4,-5z"/><path d="M114,141 l2.4,5 l2.4,-5z"/></g>'; }
  return g+'</g>';
};

WCM.svg.card = function(c, opts){
  opts=opts||{};
  var zh=WCM.lang==='zh-TW', hidden=opts.hidden;
  var RAR={1:{b:'#a9762e',g:'#d99a3e'},2:{b:'#3f7a3a',g:'#6fcf6f'},3:{b:'#2f6fa8',g:'#5bb0e8'},4:{b:'#5b3294',g:'#b07ce0'},5:{b:'#b9862a',g:'#ffd56b'}};
  var CLAN={ThunderClan:['#4a7c2e','#16300a','#f4a738','⚡'],RiverClan:['#226a86','#0e2c3a','#5fd9ca','💧'],WindClan:['#8a7a4a','#332c18','#d4b56a','💨'],ShadowClan:['#46356b','#140d22','#b07ce0','🌑'],StarClan:['#3a4a8a','#0c1428','#b0c4ff','✦'],BloodClan:['#7a2a2a','#2a0a0a','#e05a5a','🩸']};
  var cl=CLAN[c.clan]||CLAN.ThunderClan, r=RAR[c.rarity]||RAR[1], gid='cg_'+c.id;
  var clan=c.clan||'ThunderClan';
  var portrait=WCM.svg.catPortrait(hidden?{coat:'#1b2a1d',eye:'#1b2a1d',mark:'solid'}:c);
  var gems=''; for(var i=0;i<5;i++){ gems+='<text x="'+(98+i*11)+'" y="33" font-size="12" text-anchor="middle" fill="'+(hidden?'#2a3a2c':(i<c.rarity?r.g:'#22301c'))+'">◆</text>'; }
  var clanTxt=hidden?'???':(cl[3]+' '+WCM.clanName(c.clan));
  var nameTxt=hidden?'???':WCM.cardName(c);
  var roleTxt=hidden?(zh?'未發現':'Undiscovered'):WCM.cardRole(c);
  /* clan-themed background motif (faint, sits behind the portrait) */
  var motif='';
  if(clan==='ThunderClan'){ motif='<g opacity="0.16" fill="none" stroke="'+cl[2]+'" stroke-width="2" stroke-linecap="round"><path d="M28,250 L28,196"/><path d="M24,210 L17,204 M32,210 L39,204"/><path d="M212,250 L212,196"/><path d="M208,210 L201,204 M216,210 L223,204"/><path d="M182,66 L176,86 L186,84 L178,104" fill="'+cl[2]+'" opacity=".55"/></g>'; }
  else if(clan==='RiverClan'){ motif='<g opacity="0.2" fill="none" stroke="'+cl[2]+'" stroke-width="2" stroke-linecap="round"><path d="M18,86 Q38,80 58,86 Q78,92 98,86"/><path d="M142,86 Q162,80 182,86 Q202,92 222,86"/><path d="M28,238 Q48,232 68,238 Q88,244 108,238"/><path d="M148,238 Q168,232 188,238 Q208,244 222,238"/></g>'; }
  else if(clan==='WindClan'){ motif='<g opacity="0.2" fill="none" stroke="'+cl[2]+'" stroke-width="2" stroke-linecap="round"><path d="M18,78 Q58,68 98,80 Q138,90 178,76 Q208,68 225,78"/><path d="M22,244 L44,238 M54,246 L78,240 M150,246 L174,240"/></g>'; }
  else if(clan==='ShadowClan'){ motif='<g opacity="0.22"><path d="M200,58 A14,14 0 0 1 200,86 A10,10 0 0 0 200,58 Z" fill="'+cl[2]+'"/><circle cx="32" cy="78" r="1.6" fill="'+cl[2]+'"/><circle cx="52" cy="58" r="1.6" fill="'+cl[2]+'"/><circle cx="200" cy="128" r="1.6" fill="'+cl[2]+'"/><circle cx="40" cy="240" r="1.6" fill="'+cl[2]+'"/><circle cx="208" cy="232" r="1.6" fill="'+cl[2]+'"/></g>'; }
  else if(clan==='StarClan'){ motif='<g opacity="0.3" fill="'+cl[2]+'"><text x="30" y="82" font-size="11">✦</text><text x="202" y="72" font-size="13">✦</text><text x="42" y="242" font-size="10">✦</text><text x="206" y="232" font-size="12">✦</text><text x="120" y="48" font-size="10">✦</text></g>'; }
  else if(clan==='BloodClan'){ motif='<g opacity="0.22" fill="'+cl[2]+'"><path d="M30,80 c-2,5 2,7 0,11"/><path d="M210,90 c-2,5 2,7 0,11"/><circle cx="30" cy="238" r="2.6"/><circle cx="210" cy="238" r="2.6"/><circle cx="24" cy="150" r="2"/><circle cx="216" cy="160" r="2"/></g>'; }
  /* rarity-5 cards get a soft golden halo behind the cat */
  var haloDef = (c.rarity>=5) ? '<radialGradient id="'+gid+'_h" cx="0.5" cy="0.5" r="0.55"><stop offset="0" stop-color="'+r.g+'" stop-opacity="0.55"/><stop offset="1" stop-color="'+r.g+'" stop-opacity="0"/></radialGradient>' : '';
  var halo = (c.rarity>=5 && !hidden) ? '<circle cx="120" cy="150" r="88" fill="url(#'+gid+'_h)" opacity="0.6"/>' : '';
  return '<svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" class="char-card'+(opts.big?' big':'')+'">'+
    '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0.4" y2="1">'+
      '<stop offset="0" stop-color="'+cl[0]+'"/><stop offset="1" stop-color="'+cl[1]+'"/></linearGradient>'+
    '<radialGradient id="'+gid+'_g" cx="0.5" cy="0.34" r="0.75">'+
      '<stop offset="0" stop-color="'+cl[0]+'" stop-opacity="0.95"/><stop offset="1" stop-color="'+cl[1]+'"/></radialGradient>'+haloDef+'</defs>'+
    '<rect x="5" y="5" width="230" height="310" rx="20" fill="url(#'+gid+'_g)" stroke="'+r.b+'" stroke-width="6"/>'+
    '<rect x="15" y="15" width="210" height="290" rx="14" fill="none" stroke="'+r.g+'" stroke-width="1.4" opacity=".55"/>'+
    motif+halo+
    '<text x="20" y="33" font-size="13" font-weight="800" fill="'+cl[2]+'">'+clanTxt+'</text>'+gems+
    '<g transform="translate(20,50)">'+portrait+'</g>'+
    (hidden?'<text x="120" y="178" font-size="42" text-anchor="middle" fill="#3a4a3c" opacity=".8">?</text>':'')+
    '<rect x="15" y="256" width="210" height="44" rx="12" fill="rgba(0,0,0,.5)" stroke="'+r.g+'" stroke-width="1.2"/>'+
    '<text x="120" y="278" font-size="17" font-weight="800" fill="#fff" text-anchor="middle" font-family="Nunito,sans-serif">'+nameTxt+'</text>'+
    '<text x="120" y="293" font-size="11" fill="'+cl[2]+'" text-anchor="middle">'+roleTxt+'</text>'+
    '</svg>';
};
