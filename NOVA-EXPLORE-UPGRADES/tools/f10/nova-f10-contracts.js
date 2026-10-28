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
