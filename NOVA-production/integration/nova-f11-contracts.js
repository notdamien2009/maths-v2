/* F11 angles and constructions: domain checks for lesson records. All numbers must be finite; the native draw arguments
   of each engine are range-checked (angles, bearings, polygon sides, lengths) so a lesson cannot draw an impossible figure. */
(function(w){'use strict';const I=Number.isInteger,num=v=>typeof v==='number'&&Number.isFinite(v),between=(v,a,b)=>num(v)&&v>=a&&v<=b,opt=(v,a,b)=>v===undefined||between(v,a,b),side=b=>b===undefined||b==='right'||b==='left';
function walk(v,path,errors){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 for(const k of Object.keys(v)){const x=v[k];if(typeof x==='number'&&!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');if(x&&typeof x==='object'&&!(x.nodeType))walk(x,path+'.'+k,errors);}}
const K3=['straight','point','vertical','parallel','triangle','bearing'],K5=['corresponding','alternate','cointerior','vertically','bearings'],K8=['perpendicular','angle','equilateral','sss','locus'],K9=['point','line','perp','angle','circles','region'],K10=['single','reverse','route','intersection'],K11=['line','point','opposite','parallel','triangle','isosceles','polygon'];
const S={
 'F11-01':{drawing:a=>{const o=a.o||{};return opt(o.angle,0,180)&&side(o.base)||'F11-01 drawing needs angle 0–180° and base right/left';}},
 'F11-02':{geom:a=>{const o=a.opts||{};return opt(o.angle,1,359)&&side(o.base)&&opt(o.estimate,0,360)||'F11-02 geom needs angle 1–359° and base right/left';}},
 'F11-03':{renderFigure:a=>{const o=a.settings||{},t=o.task;return (o.kind===undefined||K3.includes(o.kind))&&opt(o.angle,1,359)&&(!t||((t.known===undefined||between(t.known,1,359))&&(!t.givens||t.givens.every(g=>between(g,1,359))&&t.givens.reduce((x,y)=>x+y,0)<360)))||'F11-03 renderFigure needs a known kind, angles 1–359° and givens totalling under 360°';}},
 'F11-04':{drawTriangle:a=>{const o=a.o||{},t=o.task;return (!t||t.type!=='missing'||(Array.isArray(t.given)&&t.given.length===2&&t.given.every(g=>between(g,1,178))&&t.given[0]+t.given[1]<180))||'F11-04 drawTriangle needs two given angles with a sum below 180°';}},
 'F11-05':{draw:a=>{const o=a.o||{};return (o.kind===undefined||K5.includes(o.kind))&&opt(o.theta,15,165)||'F11-05 draw needs a known angle relation and theta 15–165°';}},
 'F11-06':{draw:a=>{const o=a.opt||{};return (o.n===undefined||(I(o.n)&&o.n>=3&&o.n<=12))||'F11-06 draw needs n 3–12 sides';}},
 'F11-07':{draw:a=>{const o=a.opt||{};return (o.n===undefined||(I(o.n)&&o.n>=3&&o.n<=12))&&opt(o.radius,80,200)||'F11-07 draw needs n 3–12 sides and radius 80–200';}},
 'F11-08':{draw:a=>{const o=a.opts||{};return (o.kind===undefined||K8.includes(o.kind))&&opt(o.angle,20,160)&&opt(o.radius,60,220)||'F11-08 draw needs a known construction and angle 20–160°';}},
 'F11-09':{draw:a=>{const o=a.opts||{};return (o.kind===undefined||K9.includes(o.kind))&&opt(o.radius,60,200)&&opt(o.radiusB,60,200)&&opt(o.distance,80,320)&&opt(o.angle,20,160)||'F11-09 draw needs a known locus, radius 60–200, distance 80–320 and angle 20–160°';}},
 'F11-10':{draw:a=>{const o=a.opts||{};return (o.kind===undefined||K10.includes(o.kind))&&opt(o.bearing,0,359)&&opt(o.second,0,359)||'F11-10 draw needs a known bearing kind and bearings 0–359°';}},
 'F11-11':{draw:a=>{const o=a.opts||{};return (o.kind===undefined||K11.includes(o.kind))&&opt(o.angle,10,170)&&(o.sides===undefined||(I(o.sides)&&o.sides>=3&&o.sides<=12))||'F11-11 draw needs a known figure, angle 10–170° and 3–12 sides';}}};
w.NovaF11Contracts={validate(id,r){const e=[];if(!r||typeof r!=='object')return e;const sc=r.scene||{};
 const chk=S[id]&&sc.function&&S[id][sc.function];if(chk){const ok=chk(sc.arguments||{});if(ok!==true)e.push(ok);}
 for(const k of ['data','nativeData','config'])if(r[k])walk(r[k],k,e);if(sc.arguments)walk(sc.arguments,'scene',e);if(r.explore)walk(r.explore.value,'explore',e);return e;}};})(window);
