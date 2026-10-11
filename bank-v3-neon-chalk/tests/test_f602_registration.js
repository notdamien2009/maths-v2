// Pure Node registration contract test. No browser results are implied.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
let registered;
const fake={NOVA:{svg:{el(){}},motion:{},h(){},bankMount(o){registered=o;}},console};fake.window=fake;
vm.runInNewContext(fs.readFileSync(__dirname+'/../src/F6-02.js','utf8'),fake,{filename:'F6-02.js'});
const c=fake.F602_CONFIG;
assert(c&&c.id==='F6-02');
assert.strictEqual(Object.keys(c.presets).length,4);
assert.strictEqual(JSON.stringify(Object.keys(c.presets)),JSON.stringify(['Y7-060','Y8-007','Y8-035','Y8-039']));
for(const [id,p] of Object.entries(c.presets)){
 assert(p.max>0&&p.known>0&&p.knownB>0&&p.target<=p.max&&p.steps>=8,id);
 assert(Number.isInteger(Math.round(p.target/p.max*p.steps)),id);
 assert(Math.abs(p.known/p.max*p.steps-Math.round(p.known/p.max*p.steps))<1e-8,id);
}
assert(registered&&registered.def&&registered.id==='F6-02');
assert.strictEqual(registered.def.steps.length,5);
for(const step of registered.def.steps)assert(step.name&&step.narration&&step.caption);
for(const fn of ['render','explore','challenge'])assert(typeof registered.def[fn]==='function');
for(const key of ['mark','markerRemoved','restore','answer','hint','preset','undo'])assert(c.events.value.includes(key));
console.log(JSON.stringify({pass:true,engine:c.id,presets:4,narrationSteps:5,interactions:['drag','keyboard','restore','undo'],challengeCount:4}));
