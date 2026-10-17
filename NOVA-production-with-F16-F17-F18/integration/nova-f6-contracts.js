/* F6 lesson-record contracts: ratio, proportion and rate states are checked before anything is drawn. */
(function(w){'use strict';
let ZERO=new Set();const num=x=>typeof x==='number'&&Number.isFinite(x),isInt=Number.isInteger;
function walk(v,base,path,e){
 if(Array.isArray(v)){if(base!==undefined&&!Array.isArray(base))e.push(path+' must not be a list');v.forEach((x,i)=>walk(x,Array.isArray(base)?base[0]:undefined,path+'['+i+']',e));return;}
 if(v&&typeof v==='object'){for(const k of Object.keys(v)){if(base&&typeof base==='object'&&!Array.isArray(base)&&!(k in base))e.push(path+'.'+k+' is not a field of this component');walk(v[k],base&&typeof base==='object'?base[k]:undefined,path+'.'+k,e);}return;}
 if(typeof v==='number'){if(!num(v))e.push(path+' must be a finite number');else if(v<0||(v===0&&base!==0&&!ZERO.has(path.split('.').pop())))e.push(path+' must be greater than zero');else if(v>1e6)e.push(path+' is too large');}
 else if(base!==undefined&&base!==null&&typeof base!==typeof v)e.push(path+' must be a '+typeof base);}
const rules={
 'F6-01':s=>[s.type&&!['direct','inverse'].includes(s.type)&&'type must be direct or inverse',s.f!=null&&(s.f<.25||s.f>6)&&'factor f must be between 0.25 and 6'],
 'F6-02':s=>[s.known!=null&&s.max!=null&&s.known>s.max&&'known must lie on the line',s.target!=null&&s.max!=null&&s.target>s.max&&'target must lie on the line'],
 'F6-03':s=>[(s.a!=null&&!isInt(s.a))&&'a must be a whole number',(s.b!=null&&!isInt(s.b))&&'b must be a whole number',(s.total!=null&&s.a&&s.b&&s.total%(s.a+s.b)!==0)&&'total must divide into a+b equal parts'],
 'F6-04':s=>[s.whole&&s.whole.some(x=>!isInt(x))&&'whole must be whole numbers',s.raw&&s.whole&&s.clear&&s.raw.some((x,i)=>Math.abs(x*s.clear-s.whole[i])>1e-9)&&'raw x clear must equal whole'],
 'F6-05':s=>[s.base!=null&&!isInt(s.base)&&'base servings must be whole',s.target!=null&&(!isInt(s.target)||s.target>12)&&'target servings must be a whole number up to 12'],
 'F6-06':s=>[s.items&&s.items.length!==2&&'exactly two packs'],
 'F6-07':s=>[s.route&&!['straight','diagonal'].includes(s.route)&&'route must be straight or diagonal'],
 'F6-09':s=>[s.xs&&s.initial!=null&&!s.xs.includes(s.initial)&&'initial width must be one of xs',s.xs&&s.k&&s.xs.some(x=>s.k%x!==0)&&'every width must divide the area'],
 'F6-10':s=>[s.target&&!['speed','distance','time'].includes(s.target)&&'target must be speed, distance or time',s.legs&&s.distance&&Math.abs(s.legs.reduce((a,l)=>a+l.d,0)-s.distance)>1e-9&&'legs must add to the distance',s.legs&&s.time&&Math.abs(s.legs.reduce((a,l)=>a+l.t,0)-s.time)>1e-9&&'leg times must add to the time'],
 'F6-11':s=>[s.kind&&!['flow','journey','density'].includes(s.kind)&&'unknown context kind'],
 'F6-14':s=>[(s.a!=null&&!isInt(s.a))&&'a must be a whole number',(s.b!=null&&!isInt(s.b))&&'b must be a whole number',s.a&&s.b&&s.a+s.b>20&&'at most 20 equal parts']};
w.NovaF6Contracts={validate(id,r,C){const e=[],l=(r&&(r.data||r.nativeData)||{}).lesson;if(l==null)return e;
 if(typeof l!=='object')return ['lesson must be an object'];const base=C&&C.presets&&(C.presets[C.preset]||{});ZERO=new Set();for(const p of Object.values((C&&C.presets)||{}))for(const k in p||{})if(p[k]===0)ZERO.add(k);
 if(l.state==null||typeof l.state!=='object'||Array.isArray(l.state))e.push('lesson.state must be an object');else walk(l.state,base,'lesson.state',e);
 if(l.phase!=null&&(!isInt(l.phase)||l.phase<0||l.phase>12))e.push('lesson.phase must be a whole number 0-12');
 if(l.motion&&(!isInt(l.motion.from)||!isInt(l.motion.to)||l.motion.from<0||l.motion.to<l.motion.from))e.push('lesson.motion must run forwards between whole phases');
 if(l.state&&typeof l.state==='object'&&!e.length){const s={...base,...l.state};for(const m of (rules[id]||(()=>[]))(s))if(m)e.push(m);}
 return e;}};
})(window);
