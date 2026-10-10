/* NOVA F3-07 · HCF and LCM Venn — canonical F0 helper/motion/drag APIs */
const F307_CONFIG={id:'F3-07',startMode:'watch',preset:'Y7-016',parameters:{min:2,max:420},
 presets:{
  'Y7-016':{label:'Year 7 · HCF and LCM · 12 & 18',a:12,b:18,lesson:'Y7-016'},
  'Y7-032':{label:'Year 7 · Common factor bridge · 20 & 30',a:20,b:30,lesson:'Y7-032'},
  'Y8-004':{label:'Year 8 · Prime factors · 24 & 36',a:24,b:36,lesson:'Y8-004'},
  'Y8-012':{label:'Year 8 · Factorising bridge · 18 & 30',a:18,b:30,lesson:'Y8-012'},
  'Extension-60':{label:'Extension · 36 & 60',a:36,b:60,lesson:'GCSE bridge'}},
 events:{value:['preset','numberA','numberB','primeCard','placement','remove','hcfGuess','lcmGuess','proof'],types:['step','correct','hintUsed','mode']},
 challenge:[{a:12,b:18},{a:24,b:36},{a:18,b:30}]};
window.F307_CONFIG=F307_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F307_CONFIG,ID=C.id;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F3-07 event: '+key);N.events.emit('value',{engine:ID,key,value});}
function factors(n){if(!Number.isInteger(n)||n<C.parameters.min||n>C.parameters.max)throw Error('Number outside engine limits');const a=[];let t=n;for(let p=2;p*p<=t;p++)while(t%p===0){a.push(p);t/=p;}if(t>1)a.push(t);return a;}
function prod(arr){return arr.reduce((v,n)=>v*n,1);}
function gcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function tokens(a,b){const af=factors(a),bf=factors(b),counts={};for(const p of bf)counts[p]=(counts[p]||0)+1;
 const out=[],used={};af.forEach((p,i)=>{const common=(used[p]||0)<(counts[p]||0);out.push({id:'a'+i,p,origin:'A',region:common?'AB':'A'});if(common)used[p]=(used[p]||0)+1;});
 const shared={...used};bf.forEach((p,i)=>{if((shared[p]||0)>0){shared[p]--;return;}out.push({id:'b'+i,p,origin:'B',region:'B'});});
 return out;
}
function correctMap(a,b){return Object.fromEntries(tokens(a,b).map(t=>[t.id,t.region]));}
function checkMap(a,b,map){const tt=tokens(a,b);return tt.length===Object.keys(map).length&&tt.every(t=>map[t.id]===t.region);}
function results(a,b){const tt=tokens(a,b);return {hcf:prod(tt.filter(t=>t.region==='AB').map(t=>t.p)),lcm:prod(tt.map(t=>t.p)),shared:tt.filter(t=>t.region==='AB').map(t=>t.p),all:tt.map(t=>t.p)};}
window.F307_MATH={factors,gcd,tokens,correctMap,checkMap,results};
function text(g,x,y,t,size=44,role='given'){return N.chalkText(g,x,y,String(t),{size,role});}
function btn(label,on,main=false){return H('button',{class:main?'nova-btn primary':'nova-btn',text:label,onclick:on});}
const SPEECH={start:'Two numbers!',split:'Find the primes!',compare:'Compare them!',overlap:'Shared in the middle!',hcf:'Multiply the shared!',lcm:'Count them all!',explore:'Sort the primes!',ready:'Your turn!',right:'Well spotted!',wrong:'Not quite!',hint:'Look in the middle!',finish:'Both products!',win:'Brilliant!',undo:'Try another!'};
const POSE={start:'explain',split:'count',compare:'think',overlap:'point',hcf:'count',lcm:'cheer',explore:'point',ready:'think',right:'cheer',wrong:'oops',hint:'think',finish:'cheer',win:'cheer',undo:'point'};
function dock(stage,key){N.scene.helperStrip(stage,POSE[key]||'think',SPEECH[key]||'Your turn!');}
const STEPS=[
 {name:'Start with two numbers',phase:'numbers',show:0,say:'start',narration:'Find the highest common factor and lowest common multiple of twelve and eighteen. Prime-factorise both numbers first.'},
 {name:'Factorise both numbers',phase:'factors',show:0,say:'split',narration:'Twelve is two times two times three. Eighteen is two times three times three. Keep both lists of prime factors.'},
 {name:'Separate the unmatched primes',phase:'separate',show:1,say:'compare',narration:'One two belongs only to twelve, and one three belongs only to eighteen. Those primes stay in their separate circles.'},
 {name:'Move the shared primes',phase:'overlap',show:2,say:'overlap',narration:'Both numbers contain one two and one three. Move one of each shared prime factor to the overlapping centre.'},
 {name:'Multiply the shared primes',phase:'hcf',show:2,say:'hcf',narration:'For the highest common factor, multiply only the shared factors. Two times three equals six.'},
 {name:'Multiply every factor once',phase:'lcm',show:2,say:'lcm',narration:'For the lowest common multiple, multiply each factor in the whole Venn diagram once. Two times two times three times three gives thirty-six.'}
];
const ZONES={A:{x:100,y:285,w:308,h:352},AB:{x:433,y:295,w:134,h:345},B:{x:592,y:285,w:308,h:352},remove:{x:310,y:943,w:380,h:67}};
function circle(cx,cy,r){return `M ${cx-r} ${cy} a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 ${-r*2} 0`}
function centers(region,i,count){const ox=region==='A'?276:region==='B'?724:500,cy=430;
 const cols=count===1?1:2;const row=Math.floor(i/cols),col=count===1?0:i%2;const dx=region==='AB'?55:79,dy=104;
 const totalRows=Math.ceil(count/cols);return {x:ox+(cols===1?0:(col===0?-dx:dx)),y:cy+(row-(totalRows-1)/2)*dy};}
function makeStage(a,b,placement,opt={}){
 const svg=N.svg.root(1000,1110,`Two overlapping neon Venn circles for ${a} and ${b}. Shared prime factors are in the middle. Highest common factor ${gcd(a,b)}, lowest common multiple ${a*b/gcd(a,b)}.`);
 svg.classList.add('f307-svg');svg.setAttribute('data-a',a);svg.setAttribute('data-b',b);
 const all=tokens(a,b),placed=all.filter(t=>placement[t.id]),rem=all.filter(t=>!placement[t.id]);
 // F0's neonPath supplies glass fill, lift and glow, not hand-drawn circles.
 N.neonPath(svg,circle(357,443,265),{role:'op',width:5.4,fill:true});
 N.neonPath(svg,circle(643,443,265),{role:'focus',width:5.4,fill:true});
 text(svg,260,91,`A · ${a}`,57,'op');text(svg,740,91,`B · ${b}`,57,'focus');
 text(svg,260,151,factors(a).join(' × '),47,'op');text(svg,740,151,factors(b).join(' × '),47,'focus');
 text(svg,500,235,'Shared',45,'result');
 // Region underlay labels, placed outside the actual factor areas.
 const groupSizes={A:[],AB:[],B:[]};placed.forEach(t=>groupSizes[placement[t.id]].push(t));
 function tokenCard(t,x,y,placedRegion,idx){
  const g=E('g',{'aria-label':`Prime ${t.p} from ${t.origin}; ${placedRegion||'unsorted'}`, 'data-prime-id':t.id},svg);
  const width=87,height=75;
  N.neonBox(g,x-width/2,y-height/2,width,height,{role:placedRegion==='AB'?'result':placedRegion==='B'||(!placedRegion&&t.origin==='B')?'focus':'op',r:18});
  text(g,x,y+16,t.p,51,'given');
  if(opt.animate&&placedRegion&&!N.reducedMotion())N.motion.arrive(g,0,idx%2?-28:28,420+idx*70,N.motion.ease.back);
  if(opt.interactive){
   const zones=placedRegion?[ZONES.remove]:[Object.assign({id:t.region,kind:'drop'},ZONES[t.region])];
   N.ui.svgDrag(svg,g,{box:{x:x-width/2,y:y-height/2,w:width,h:height},zones:()=>zones.map(z=>({id:z.id||'remove',kind:z.kind||'remove',x:z.x,y:z.y,w:z.w,h:z.h})),
    onDrop:dest=>opt.move(t.id,dest),onRemove:()=>opt.remove(t.id)});
  }
  return g;
 }
 // Placed factors are displayed in deterministic rows, including duplicated primes.
 for(const region of ['A','AB','B']){const list=groupSizes[region];list.forEach((t,i)=>{const p=centers(region,i,list.length);tokenCard(t,p.x,p.y,region,i);});}
 const showTray=opt.interactive||!Object.keys(placement).length;
 if(showTray){text(svg,500,735,'Prime factor cards',45,'given');
  rem.forEach((t,i)=>{const n=Math.min(9,rem.length),col=i%9,row=Math.floor(i/9),x=500+(col-(Math.min(9,rem.length-row*9)-1)/2)*95,y=790+row*90;tokenCard(t,x,y,null,i);});
  N.neonBox(svg,ZONES.remove.x,ZONES.remove.y,ZONES.remove.w,ZONES.remove.h,{role:'error',r:20});text(svg,500,991,'Remove / undo',45,'error');
 }else if(opt.phase==='numbers'){text(svg,500,755,'Which primes belong to both?',47,'given');}
 else if(opt.phase==='factors'){text(svg,500,755,`${a}: ${factors(a).join(' × ')}`,46,'op');text(svg,500,825,`${b}: ${factors(b).join(' × ')}`,46,'focus');}
 else {text(svg,500,780,'Each prime is counted once',45,'given');}
 const actual=results(a,b),full=checkMap(a,b,placement),showH=!!opt.revealH&&full,showL=!!opt.revealL&&full;
 N.neonBox(svg,105,1025,380,67,{role:showH?'result':'support',r:16});
 N.neonBox(svg,515,1025,380,67,{role:showL?'result':'support',r:16});
 text(svg,295,1072,'HCF  '+(showH?actual.hcf:'?'),44,showH?'result':'given');
 text(svg,705,1072,'LCM  '+(showL?actual.lcm:'?'),44,showL?'result':'given');
 return svg;
}
function showStage(stage,a,b,placement,opt={}){
 stage.innerHTML='';N.cap(stage,'HCF and LCM Venn',opt.caption||'Place every shared prime in the overlap');
 const row=H('div',{class:'f307-scene'}),side=H('aside',{class:'f307-side'}),r=results(a,b),complete=checkMap(a,b,placement);
 const svg=makeStage(a,b,placement,opt);
 side.append(
  N.neonCard([H('span',{class:'f307-kicker',text:'PRIME FACTORS'}),H('p',{class:'f307-value',text:`${a}: ${factors(a).join(' × ')}`}),H('p',{class:'f307-value',text:`${b}: ${factors(b).join(' × ')}`})],{role:'op'}),
  N.neonCard([H('span',{class:'f307-kicker',text:'HIGHEST COMMON FACTOR'}),N.answerChip(opt.revealH&&complete?`${r.shared.join(' × ')} = ${r.hcf}`:'?',true)],{role:'result'}),
  N.neonCard([H('span',{class:'f307-kicker',text:'LOWEST COMMON MULTIPLE'}),N.answerChip(opt.revealL&&complete?`${r.all.join(' × ')} = ${r.lcm}`:'?',true)],{role:'result'}),
  N.neonCard([H('p',{class:'f307-tiny',text:'The overlap is multiplied for HCF. The entire diagram is multiplied once for LCM.'})],{role:'support'})
 );
 row.append(svg,side);stage.append(row);dock(stage,opt.say||'explore');return svg;
}
const def={id:ID,title:'HCF and LCM Venn',config:C,steps:STEPS,
 alt:'Two overlapping glass neon Venn circles containing repeated prime factors. Shared primes in the overlap give the highest common factor; the product of all circles gives the lowest common multiple.',
 staticAlt:'12 = 2 × 2 × 3; 18 = 2 × 3 × 3. A-only 2; overlap 2 and 3; B-only 3. HCF = 2 × 3 = 6. LCM = 2 × 2 × 3 × 3 = 36.',
 render(i,stage){const s=STEPS[i],tt=tokens(12,18);const placements={};
  if(s.show===1)tt.filter(t=>t.region!=='AB').forEach(t=>placements[t.id]=t.region);
  if(s.show===2)tt.forEach(t=>placements[t.id]=t.region);
  showStage(stage,12,18,placements,{caption:s.name,say:s.say,phase:s.phase,revealH:i>=4,revealL:i>=5,animate:i===2||i===3});},
 exploreIntro:'Sort primes into the Venn circles and see HCF and LCM.',
 explore(panel,stage){let preset=C.preset,a=C.presets[preset].a,b=C.presets[preset].b,map={},speech='explore',feedback='Move the prime cards to their correct regions.',error=false,reveal=false;
  const pre=H('select',{'aria-label':'Curriculum preset'}),na=H('input',{type:'number',min:2,max:420,value:a,'aria-label':'First number'}),nb=H('input',{type:'number',min:2,max:420,value:b,'aria-label':'Second number'}),cards=H('select',{'aria-label':'Choose a prime factor card'}),target=H('select',{'aria-label':'Choose destination region'}),status=H('p',{class:'f307-status',role:'status'});
  Object.entries(C.presets).forEach(([key,v])=>pre.add(new Option(v.label,key)));
  [['A','A only'],['AB','Overlap'],['B','B only']].forEach(([k,v])=>target.add(new Option(v,k)));
  function say(m,bad=false,s='right'){feedback=m;error=bad;speech=bad?'wrong':s;}
  function move(id,region){const t=tokens(a,b).find(t=>t.id===id);if(!t||map[id])return false;if(region!==t.region){say('That factor belongs in a different region.',true);render();return false;}map[id]=region;emit('primeCard',t.p);emit('placement',{id,region});reveal=false;say('Good placement!',false,checkMap(a,b,map)?'finish':'right');render();return true;}
  function remove(id){if(!map[id])return false;delete map[id];emit('remove',id);reveal=false;say('Factor returned to the tray.',false,'undo');render();return true;}
  function reset(){map={};reveal=false;say('Sort the primes!',false,'explore');render();}
  function render(){panel.innerHTML='';na.value=a;nb.value=b;pre.value=preset;
   showStage(stage,a,b,map,{caption:'Arrange the prime-factor cards',say:speech,interactive:true,move,remove,revealH:reveal,revealL:reveal});
   cards.innerHTML='';tokens(a,b).forEach(t=>{const o=new Option(`${t.p} · from ${t.origin}${map[t.id]?' (placed)':''}`,t.id);if(map[t.id])o.disabled=true;cards.add(o)});
   panel.append(H('div',{class:'f307-row'},[H('label',{},['Preset',pre]),H('label',{},['A',na]),H('label',{},['B',nb])]),H('p',{class:'f307-help',text:'Drag the individual prime cards into A only, B only or the middle. Every factor can also be placed with the controls below.'}),
    H('div',{class:'f307-row'},[H('label',{},['Prime card',cards]),H('label',{},['Region',target]),btn('Place card',()=>move(cards.value,target.value),true),btn('Undo last',()=>remove(Object.keys(map).slice(-1)[0])),btn('Reset',reset),btn('Show products',()=>{if(!checkMap(a,b,map))say('Place every prime correctly first.',true);else{reveal=true;say('Both products proved!',false,'finish');}render();})]),status);
   status.textContent=feedback;status.classList.toggle('bad',error);
  }
  pre.onchange=()=>{preset=pre.value;a=C.presets[preset].a;b=C.presets[preset].b;emit('preset',preset);emit('numberA',a);emit('numberB',b);reset();};
  na.onchange=()=>{a=Math.max(2,Math.min(420,Math.floor(+na.value||12)));emit('numberA',a);reset();};
  nb.onchange=()=>{b=Math.max(2,Math.min(420,Math.floor(+nb.value||18)));emit('numberB',b);reset();};render();},
 challenge(panel,api,stage){let task=0,map={},hg='',lg='',won=false,feedback='Place each prime factor, then prove both products.',error=false,speech='ready',wrong=0;
  const cards=H('select',{'aria-label':'Prime factor card'}),target=H('select',{'aria-label':'Target Venn region'}),status=H('p',{class:'f307-status',role:'status'}),hi=H('input',{type:'number',min:1,'aria-label':'HCF answer'}),li=H('input',{type:'number',min:1,'aria-label':'LCM answer'});
  [['A','A only'],['AB','Overlap'],['B','B only']].forEach(([k,v])=>target.add(new Option(v,k)));
  function current(){return C.challenge[task];}
  function say(msg,bad=false,pose='right'){feedback=msg;error=bad;speech=bad?'wrong':pose;}
  function fail(msg){wrong++;api.check(false,msg,{task,wrong});say(msg,true);render();return false;}
  function move(id,region){const c=current(),t=tokens(c.a,c.b).find(t=>t.id===id);if(!t||map[id])return false;if(t.region!==region)return fail(t.region==='AB'?'That prime is shared; it belongs in the overlap.':'That extra prime belongs only to '+t.region+'.');map[id]=region;emit('placement',{id,region});emit('primeCard',t.p);say('Correct region!',false,checkMap(c.a,c.b,map)?'finish':'right');render();return true;}
  function remove(id){if(!map[id])return false;delete map[id];emit('remove',id);say('Factor returned.',false,'undo');render();return true;}
  function prove(){const c=current(),r=results(c.a,c.b);hg=hi.value;lg=li.value;emit('hcfGuess',+hg);emit('lcmGuess',+lg);
   if(!checkMap(c.a,c.b,map))return fail('Place all prime factors in their correct regions first.');
   if(+hg!==r.hcf)return fail('HCF uses only the overlap. Multiply each shared prime once.');
   if(+lg!==r.lcm)return fail('LCM uses every displayed prime once, including the overlap.');
   api.check(true,'Both products proved.',{task,a:c.a,b:c.b,hcf:r.hcf,lcm:r.lcm});emit('proof',{task,hcf:r.hcf,lcm:r.lcm});
   if(task===C.challenge.length-1){won=true;say('Three proofs complete!',false,'win');render();return true;}
   task++;map={};hg='';lg='';say('Next pair of numbers!',false,'ready');render();return true;}
  function render(){const c=current();panel.innerHTML='';const done=checkMap(c.a,c.b,map);
   showStage(stage,c.a,c.b,map,{caption:`Proof ${task+1} of 3 · ${c.a} and ${c.b}`,say:speech,interactive:!won,move,remove,revealH:won,revealL:won});
   if(won){panel.append(H('div',{class:'f307-win',text:'Complete · all three Venn diagrams and HCF/LCM proofs correct.'}));return;}
   cards.innerHTML='';tokens(c.a,c.b).forEach(t=>{const o=new Option(`${t.p} · from ${t.origin}${map[t.id]?' (placed)':''}`,t.id);o.disabled=!!map[t.id];cards.add(o)});
   panel.append(H('p',{class:'f307-help',text:`Proof ${task+1} of 3. Sort the primes for ${c.a} and ${c.b}. Then enter both products. `}),
    H('div',{class:'f307-row'},[H('label',{},['Prime card',cards]),H('label',{},['Region',target]),btn('Place card',()=>move(cards.value,target.value),true),btn('Undo last',()=>remove(Object.keys(map).slice(-1)[0])),btn('Hint',()=>{api.hint('Match one prime from each number in the middle. Extra primes stay outside.');speech='hint';render();})]),
    H('div',{class:'f307-row'},[H('label',{},['HCF',hi]),H('label',{},['LCM',li]),btn('Check both products',prove,true)]),status);
   hi.value=hg;li.value=lg;hi.onchange=()=>hg=hi.value;li.onchange=()=>lg=li.value;
   status.textContent=feedback;status.classList.toggle('bad',error);if(done&&speech==='finish')status.textContent='Regions complete. Now prove both products.';
  }render();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['HCF','LCM','Venn diagrams','prime factorisation','factorising common factors'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F3-05','F3-06']});
N.bankMount({id:ID,num:'07',title:'HCF and LCM Venn · Premium Review',def,linked:['F3-04','F3-05','F3-06','F3-08'],years:'Years 7 and 8 · HCF/LCM and common factor bridges',spec:{
 purpose:'Use prime factors in two overlapping circles to distinguish shared primes for HCF from the union product for LCM.',
 params:'Number pairs from 2–420; duplicate primes are separate movable objects, one representative of each common prime occurrence in the overlap.',
 presets:'Y7-016 12/18; Y7-032 20/30; Y8-004 24/36; Y8-012 18/30; extension 36/60.',
 steps:'Factorise both numbers → separate unmatched primes → pair common primes in the overlap → multiply shared primes for HCF → multiply all distinct cards for LCM.',
 interactions:'Native F0 SVG draggable prime cards; green correct-region highlighting, return on a wrong drop, red Remove tray, selection + buttons, undo and product inputs.',
 traps:'Do not put both copies of a shared prime in the overlap. Do not multiply the shared region twice for LCM. Every repeated prime factor counts individually.',
 gcse:'Prime-factor decomposition supports algebraic common factors and GCSE HCF/LCM problems.'
 }});
// F3-05/06 pointer-capture recovery: relays missed moves/up to the approved F0 drag listener.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;
  if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
  d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));
 },true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA mathematics helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
