/* F10 lesson-record contracts (2026-10-17): graph and coordinate states are checked before anything is drawn.
   data.lesson.state chooses an optional native preset ("preset") and may override the engine's own model fields.
   Every override is type-checked against the native model, numbers must be finite and modest, and per-engine geometry rules are applied. */
(function(w){'use strict';
const num=x=>typeof x==='number'&&Number.isFinite(x),int=Number.isInteger,close=(a,b)=>Math.abs(a-b)<1e-9;
function walk(v,base,path,e){
 if(typeof v==='function'){e.push(path+' cannot be a function');return;}
 if(typeof v==='string'){if(/[<>]/.test(v))e.push(path+' must be plain text');if(v.length>160)e.push(path+' is too long');if(base!==undefined&&base!==null&&typeof base!=='string')e.push(path+' must be a '+typeof base);return;}
 if(typeof v==='number'){if(!num(v))e.push(path+' must be a finite number');else if(Math.abs(v)>500)e.push(path+' is out of range');if(base!==undefined&&base!==null&&typeof base!=='number')e.push(path+' must be a '+typeof base);return;}
 if(typeof v==='boolean'){if(base!==undefined&&base!==null&&typeof base!=='boolean')e.push(path+' must be a '+typeof base);return;}
 if(Array.isArray(v)){if(base!==undefined&&base!==null&&!Array.isArray(base))e.push(path+' must not be a list');if(v.length>60)e.push(path+' is too long');v.forEach((x,i)=>walk(x,Array.isArray(base)?(base[i]!==undefined?base[i]:base[0]):undefined,path+'['+i+']',e));return;}
 if(v&&typeof v==='object'){if(base!==undefined&&base!==null&&(typeof base!=='object'||Array.isArray(base)))e.push(path+' must not be an object');for(const k of Object.keys(v)){if(['__proto__','prototype','constructor'].includes(k)){e.push('unsafe key');continue;}walk(v[k],base&&typeof base==='object'?base[k]:undefined,path+'.'+k,e);}return;}
 if(v!==null&&v!==undefined)e.push(path+' has an unsupported type');}
const inGrid=(p,lo,hi)=>p&&num(p.x)&&num(p.y)&&p.x>=lo&&p.x<=hi&&p.y>=lo&&p.y<=hi;
const R=w.NovaF10Contracts={rules:{},num,int,close,inGrid,
 validate(id,r,ctx){const e=[];if(!r||typeof r!=='object')return ['record must be an object'];const d=r.data??r.nativeData??{},l=d.lesson;
  if(l===undefined||l===null)return e;if(typeof l!=='object'||Array.isArray(l))return ['data.lesson must be an object'];
  for(const k of Object.keys(l))if(!['state','phase','motion','title'].includes(k))e.push('data.lesson.'+k+' is not supported');
  if(l.phase!=null&&(!int(l.phase)||l.phase<0||l.phase>12))e.push('phase must be a whole number from 0 to 12');
  if(l.motion!=null){const m=l.motion;if(typeof m!=='object'||!int(m.from)||!int(m.to)||m.from<0||m.to>12||m.from>m.to||(m.durationMs!=null&&!(num(m.durationMs)&&m.durationMs>0&&m.durationMs<=60000)))e.push('motion must be {from,to,durationMs} with 0 ≤ from ≤ to ≤ 12');}
  if(l.title!=null&&(typeof l.title!=='string'||/[<>]/.test(l.title)))e.push('title must be plain text');
  const s=l.state||{};if(typeof s!=='object'||Array.isArray(s))return e.concat('state must be an object');
  const M=(ctx&&ctx.M)||{},P=(ctx&&ctx.presets)||{};
  if(s.preset!=null&&!Object.prototype.hasOwnProperty.call(P,s.preset))e.push('preset must be one of the native presets: '+Object.keys(P).join(', '));
  const PK=s.preset!=null?P[s.preset]:(ctx&&ctx.cur!=null?P[ctx.cur]:null);for(const k of Object.keys(s)){if(k==='preset')continue;if(k in M)walk(s[k],M[k],'state.'+k,e);else if(PK&&typeof PK==='object'&&(k in PK))walk(s[k],PK[k],'state.'+k,e);else e.push('state.'+k+' is not a field of this component');}
  if(!e.length&&R.rules[id]){try{const merged=Object.assign({},M,PK&&typeof PK==='object'?PK:{},s);merged.__preset=PK||null;for(const x of [].concat(R.rules[id](merged,s,ctx)||[]))if(x)e.push(x);}catch(err){e.push('state check failed: '+err.message);}}
  return e;}};
})(window);
/* per-engine rules (F10, 2026-10-17): ranges follow each engine's own drag, slider and drawing limits. */
(function(R){'use strict';const {num,int}=R,rng=(v,a,b)=>num(v)&&v>=a&&v<=b,step=(v,s)=>num(v)&&Math.abs(v/s-Math.round(v/s))<1e-9;
const pt=(p,lo,hi,name,e,whole=true)=>{if(!p||!rng(p.x,lo,hi)||!rng(p.y,lo,hi)||(whole&&(!int(p.x)||!int(p.y))))e.push(name+' must be a '+(whole?'whole-number ':'')+'point from '+lo+' to '+hi);};
const pair=(p,x0,x1,y0,y1,name,e)=>{if(!Array.isArray(p)||p.length!==2||!rng(p[0],x0,x1)||!rng(p[1],y0,y1))e.push(name+' must be [x, y] with x from '+x0+' to '+x1+' and y from '+y0+' to '+y1);};
const series=(pts,name,e,maxY)=>{if(!Array.isArray(pts)||pts.length<2||pts.length>12)return e.push(name+' needs 2 to 12 points');pts.forEach((p,i)=>{if(!Array.isArray(p)||p.length!==2||!rng(p[0],0,12)||!rng(p[1],-10,maxY))e.push(name+'['+i+'] must be [x, y] inside the graph');else if(i&&!(p[0]>pts[i-1][0]))e.push(name+' x values must increase');});if(pts[0]&&pts[0][0]!==0)e.push(name+' must start at x = 0');};
R.rules['F10-01']=(m,s)=>{const e=[];if(s.points){if(!Array.isArray(s.points)||s.points.length<2||s.points.length>6)return ['points needs 2 to 6 points'];const ids=new Set();s.points.forEach((p,i)=>{pt(p,-6,6,'points['+i+']',e);if(typeof p.id!=='string'||!/^[A-F]$/.test(p.id))e.push('points['+i+'].id must be a letter A to F');ids.add(p.id);});if(ids.size!==s.points.length)e.push('point ids must be different');}return e;};
R.rules['F10-02']=(m,s)=>{const e=[];if(s.dx!=null&&(!int(s.dx)||Math.abs(s.dx)>3))e.push('dx must be a whole number from −3 to 3');if(s.dy!=null&&(!int(s.dy)||Math.abs(s.dy)>3))e.push('dy must be a whole number from −3 to 3');if(s.vertices){if(!Array.isArray(s.vertices)||s.vertices.length<3||s.vertices.length>6)e.push('vertices needs 3 to 6 points');else s.vertices.forEach((p,i)=>pt(p,-5,5,'vertices['+i+']',e));}return e;};
R.rules['F10-03']=(m0,s)=>{const e=[],P=v=>Array.isArray(v)?{x:v[0],y:v[1]}:v,m={a:P(m0.a),b:P(m0.b)};pt(m.a,-5,5,'a',e,false);pt(m.b,-5,5,'b',e,false);if(!e.length){if(!step(m.a.x,.5)||!step(m.a.y,.5)||!step(m.b.x,.5)||!step(m.b.y,.5))e.push('coordinates must be whole or half numbers');if(m.a.x===m.b.x&&m.a.y===m.b.y)e.push('a and b must be different points');}return e;};
R.rules['F10-04']=(m,s)=>{const e=[];if(s.ys&&(!Array.isArray(s.ys)||s.ys.length!==5||!s.ys.every(y=>rng(y,-30,30))))e.push('ys must be five values from −30 to 30');return e;};
R.rules['F10-05']=(m,s)=>{const e=[];if(s.m!=null&&(!rng(s.m,-3,3)||!step(s.m,.25)))e.push('m must be from −3 to 3 in quarters');if(s.c!=null&&(!rng(s.c,-4,4)||!step(s.c,.25)))e.push('c must be from −4 to 4 in quarters');if(m.__preset&&m.__preset.proportion&&m.c!==0)e.push('a direct-proportion preset needs c = 0');return e;};
R.rules['F10-06']=(m,s)=>{const e=[];for(const k of ['A','B'])if(s[k]!=null)pair(s[k],-10,10,-20,20,k,e);if(!e.length&&Array.isArray(m.A)&&Array.isArray(m.B)&&m.A[0]===m.B[0])e.push('A and B need different x values');return e;};
R.rules['F10-07']=(m,s)=>{const e=[];if(s.m!=null&&(!rng(s.m,-4,4)||!step(s.m,.25)))e.push('m must be from −4 to 4 in quarters');if(s.c!=null&&(!rng(s.c,-5,5)||!step(s.c,.25)))e.push('c must be from −5 to 5 in quarters');return e;};
R.rules['F10-08']=(m,s)=>{const e=[];for(const k of ['A','B'])if(s[k]!=null&&(!Array.isArray(s[k])||s[k].length!==3||!s[k].every(v=>rng(v,-10,10))))e.push(k+' must be three coefficients from −10 to 10');return e;};
R.rules['F10-09']=(m,s)=>{const e=[];if(s.points)series(s.points,'points',e,30);return e;};
R.rules['F10-10']=(m,s)=>{const e=[];if(s.pts)series(s.pts,'pts',e,20);return e;};
R.rules['F10-11']=R.rules['F10-10'];
R.rules['F10-12']=(m,s)=>{const e=[];if(!rng(m.h,-4,4))e.push('h must be from −4 to 4');if(!rng(m.k,-6,8))e.push('k must be from −6 to 8');if(!num(m.a)||m.a===0||Math.abs(m.a)>3)e.push('a must be non-zero, from −3 to 3');return e;};
R.rules['F10-13']=(m,s)=>[];
R.rules['F10-14']=(m,s)=>{const e=[];if(!rng(m.h,-3,3)||!step(m.h,.5))e.push('h must be from −3 to 3 in halves');if(!rng(m.k,-4,6)||!step(m.k,.5))e.push('k must be from −4 to 6 in halves');if(!rng(m.a,-2,2)||m.a===0||!step(m.a,.5))e.push('a must be non-zero, from −2 to 2 in halves');return e;};
R.rules['F10-15']=(m,s)=>{const e=[];if(s.point!=null){if(!Array.isArray(s.point)||s.point.length!==2||!rng(s.point[0],-6,6)||!rng(s.point[1],-5,7))e.push('point must be [x, y] with x from −6 to 6 and y from −5 to 7');}return e;};
R.rules['F10-16']=(m,s)=>{const e=[];const c=m.centre;if(!Array.isArray(c)||c.length!==2||!c.every(v=>int(v)&&Math.abs(v)<=3))return ['centre must be whole numbers from −3 to 3'];const lim=Math.min(5.5,6-Math.abs(c[0]),6-Math.abs(c[1]));if(!rng(m.radius,1,lim)||!step(m.radius,.5))e.push('radius must be from 1 to '+lim+' in halves');return e;};
R.rules['F10-17']=(m,s)=>Object.keys(s).filter(k=>k!=='preset').map(k=>'state.'+k+' cannot be set: graph-matching lessons choose a preset only (pupil matches start empty)');
R.rules['F10-18']=(m,s)=>{const e=[];if(s.readX!=null&&(!rng(s.readX,0,8)||!step(s.readX,.5)))e.push('readX must be from 0 to 8 in halves');return e;};
R.rules['F10-19']=(m,s)=>{const e=[];if(!rng(m.angle,0,360))e.push('angle must be from 0 to 360');if(!rng(m.A,.5,1.5))e.push('A must be from 0.5 to 1.5');if(!rng(m.B,.5,2))e.push('B must be from 0.5 to 2');if(!rng(m.P,0,180))e.push('P must be from 0 to 180');if(!rng(m.D,-1,1))e.push('D must be from −1 to 1');return e;};
R.rules['F10-20']=(m,s)=>{const e=[];if(!rng(m.a,0,5)||!step(m.a,.5))e.push('a must be from 0 to 5 in halves');if(!rng(m.b,1,6)||!step(m.b,.5))e.push('b must be from 1 to 6 in halves');if(!(m.a<m.b))e.push('a must be less than b');if(!rng(m.x,0,6))e.push('x must be from 0 to 6');if(!int(m.n)||m.n<1||m.n>12)e.push('n must be a whole number from 1 to 12');return e;};
})(window.NovaF10Contracts);
