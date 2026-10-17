/* F5 mathematical domain checks for lesson records (fractions, decimals, percentages). */
(function(w){'use strict';
const isInt=Number.isInteger;
function walk(v,path,errors){if(!v||typeof v!=='object')return;
 if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 if('n' in v&&'d' in v&&typeof v.d!=='object'){
  if(!isInt(v.d)||v.d<1||v.d>1000)errors.push(path+'.d must be an integer denominator 1–1000');
  if(!isInt(v.n)||Math.abs(v.n)>100000)errors.push(path+'.n must be an integer numerator');}
 for(const k of Object.keys(v)){const x=v[k];
  if(typeof x==='number'&&!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');
  if(/^(den|denominator)$/i.test(k)&&typeof x==='number'&&(!isInt(x)||x<1))errors.push(path+'.'+k+' must be a positive integer denominator');
  if(/^(percent|percentage)$/i.test(k)&&typeof x==='number'&&(x<0||x>1000))errors.push(path+'.'+k+' must be 0–1000%');
  if(/^count$/i.test(k)&&typeof x==='number'&&(!isInt(x)||x<0||x>100))errors.push(path+'.'+k+' must be an integer 0–100');
  if(x&&typeof x==='object')walk(x,path+'.'+k,errors);}}
w.NovaF5Contracts={validate(id,r){const errors=[];if(!r||typeof r!=='object')return errors;
 if(r.data)walk(r.data,'data',errors);const D=r.data||{};if(id==='F5-10'&&D.n!==undefined&&D.d!==undefined){if(!isInt(D.n)||!isInt(D.d)||D.n<0||D.n>48||D.d<2||D.d>12||Math.ceil(D.n/D.d)>4)errors.push('F5-10 supports 0–4 wholes (ceil(n/d)≤4), denominator 2–12');}if(r.nativeData)walk(r.nativeData,'nativeData',errors);
 if(r.config)walk(r.config,'config',errors);if(r.explore)walk(r.explore.value,'explore',errors);
 if(r.scene&&r.scene.arguments)walk(r.scene.arguments,'scene',errors);return errors;}};
})(window);
