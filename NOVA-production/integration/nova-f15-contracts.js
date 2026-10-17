/* F15 Pythagoras, trigonometry and circles: domain checks for lesson records. All numbers must be finite; the native draw
   arguments of each engine are checked against the engine's own presets and Explore control ranges, so a lesson cannot draw an
   impossible figure (non-positive sides, a right-triangle angle outside 0°–90°, a triangle whose angles reach 180°, an unknown
   ratio, scene, theorem or special-triangle family). */
(function(w){'use strict';const num=v=>typeof v==='number'&&Number.isFinite(v),between=(v,a,b)=>num(v)&&v>=a&&v<=b,opt=(v,a,b)=>v===undefined||between(v,a,b),one=(v,list)=>v===undefined||list.includes(v),need=(v,list)=>list.includes(v),pos=(v,max)=>num(v)&&v>0&&v<=max,optPos=(v,max)=>v===undefined||pos(v,max);
function walk(v,path,errors){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 for(const k of Object.keys(v)){const x=v[k];if(typeof x==='number'&&!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');if(x&&typeof x==='object'&&!(x.nodeType))walk(x,path+'.'+k,errors);}}
const RAT=['sin','cos','tan'],SIDE=['o','a','h'];
const tri01=a=>{const s=a.st||{},o=a.o||{};return pos(s.a,40)&&pos(s.b,40)&&one(o.unknown,['a','b','c','none'])&&opt(o.level,0,8)||'F15-01 needs perpendicular sides a, b in 0–40, unknown a/b/c/none and level 0–8';};
const S={
 'F15-01':{board:tri01,proof:tri01},
 'F15-02':{board:a=>{const s=a.st||{};return pos(s.a,100)&&pos(s.b,100)&&need(s.unknown,['a','b','c'])&&one(s.dp,[0,1,2,3])&&one(s.scene,['geometry','ladder','ramp'])||'F15-02 board needs legs a, b in 0–100, unknown a/b/c, dp 0–3 and scene geometry/ladder/ramp';}},
 'F15-06':{scene:a=>{const s=a.st||{};return pos(s.a,100)&&pos(s.o,100)&&need(s.target,RAT)&&one(s.kind,['ratio','solve','similar','drop','remove'])&&one(s.unknown,SIDE)||'F15-06 scene needs positive a, o, target sin/cos/tan, a known kind and unknown o/a/h';}},
 'F15-07':{graph:a=>{const s=a.st||{};return between(s.theta,1,89)&&pos(s.c,100)&&one(s.ratio,RAT)||'F15-07 graph needs an acute angle 1°–89°, positive hypotenuse and ratio sin/cos/tan';}},
 'F15-08':{scene:a=>{const s=a.st||{};return between(s.theta,0,360)||'F15-08 scene needs an angle 0°–360°';}},
 'F15-09':{draw:a=>{const s=a.st||{};if(s.mode==='side')return between(s.theta,1,89)&&need(s.known,SIDE)&&need(s.unknown,SIDE)&&s.known!==s.unknown&&pos(s.given,1000)&&one(s.dp,[0,1,2,3])||'F15-09 side mode needs an acute angle, positive given, and distinct known/unknown sides';
  if(s.mode==='angle')return pos(s.a,1000)&&pos(s.o,1000)&&need(s.known,SIDE)&&need(s.second,SIDE)&&s.known!==s.second&&optPos(s.fixedHyp,1000)&&(s.fixedHyp===undefined||s.fixedHyp>Math.max(s.a,s.o)-1e-9)||'F15-09 angle mode needs positive legs, two distinct known sides and a hypotenuse longer than each leg';
  return 'F15-09 draw needs mode side or angle';}},
 'F15-10':{draw:a=>{const s=a.st||{};return (s.family==='3060'&&one(s.angle,[30,60])||s.family==='4545'&&one(s.angle,[45]))&&optPos(s.scale,10)||'F15-10 draw needs family 3060 (30°/60°) or 4545 (45°) and scale 0–10';}},
 'F15-11':{draw:a=>{const s=a.st||{};return between(s.radius,3,9)&&opt(s.theta,0,359)&&opt(s.delta,30,180)&&one(s.emphasis,['all','circumference','diameter','sector','tangent'])||'F15-11 draw needs radius 3–9, point angle 0–359 and separation 30–180';}},
 'F15-12':{draw:a=>{const s=a.st||{};return one(s.kind,['centre','segment','semicircle','cyclic','tangent','alternate','double','same','semi'])&&between(s.arc,30,180)&&opt(s.p,25,155)||'F15-12 draw needs a known theorem, arc 30°–180° and point position 25–155';}},
 'F15-13':{draw:a=>{const s=a.st||{};const angs=['A','B','C'].map(k=>s[k]).filter(v=>v!==undefined),sides=['a','b','c'].map(k=>s[k]).filter(v=>v!==undefined);
  const ok=need(s.method,['sine','cosine'])&&angs.every(v=>between(v,0.5,179.5))&&angs.reduce((x,y)=>x+y,0)<180&&sides.every(v=>pos(v,1000))&&(sides.length<3||(()=>{const[x,y,z]=sides.slice().sort((p,q)=>p-q);return x+y>z;})());
  return ok||'F15-13 draw needs method sine/cosine, angles 0°–180° summing under 180°, positive sides obeying the triangle inequality';}},
 'F15-14':{draw:a=>{const p=a.p||{};return pos(p.L,30)&&pos(p.W,30)&&pos(p.H,30)&&one(p.focus,['angle','base','both','reverse','space','vertical'])&&optPos(p.zoom,3)||'F15-14 draw needs cuboid L, W, H in 0–30, a known focus and zoom 0–3';}}};
w.NovaF15Contracts={validate(id,r){const e=[];if(!r||typeof r!=='object')return e;const sc=r.scene||{};
 const chk=S[id]&&sc.function&&S[id][sc.function];if(chk){const ok=chk(sc.arguments||{});if(ok!==true)e.push(ok);}
 for(const k of ['data','nativeData','config'])if(r[k])walk(r[k],k,e);if(sc.arguments)walk(sc.arguments,'scene',e);if(r.explore)walk(r.explore.value,'explore',e);return e;}};})(window);
