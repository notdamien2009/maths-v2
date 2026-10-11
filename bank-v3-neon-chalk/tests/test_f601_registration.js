/* F6-01 JS registration smoke check without browser. Never claims rendered QA. */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dir=path.resolve(__dirname,'..');let registered=null,meta=null;
const N={h(){},svg:{el(){}},registry:{add(d){meta=d;}},bankMount(o){registered=o;}};
const sandbox={window:{NOVA:N},console,Promise};vm.runInNewContext(fs.readFileSync(path.join(dir,'src/F6-01.js'),'utf8'),sandbox,{filename:'F6-01.js'});
assert(registered,'Engine registration');assert.equal(registered.id,'F6-01');assert.equal(registered.def.steps.length,6);
assert.equal(Object.keys(sandbox.window.F601_CONFIG.presets).length,7);
for(const mode of ['render','explore','challenge'])assert.equal(typeof registered.def[mode],'function',mode);
assert.equal(meta.family,'F6');assert(meta.topics.includes('proportion'));
for(const [id,p] of Object.entries(sandbox.window.F601_CONFIG.presets)){
 assert(p.a0>0&&p.b0>0&&p.f>0,`${id} finite positive values`);
 if(p.type==='direct')assert.equal((p.b0*p.f)/(p.a0*p.f),p.b0/p.a0);
 else assert.equal((p.b0/p.f)*(p.a0*p.f),p.b0*p.a0);
}
console.log(JSON.stringify({pass:true,engine:registered.id,teachingSteps:registered.def.steps.length,presets:7,modeImplementations:4,scope:'registration and preset algebra; not rendered QA'},null,2));
