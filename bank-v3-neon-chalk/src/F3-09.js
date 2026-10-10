/* NOVA F3-09 Square and Cube Builders. Current, unmodified canonical F0. */
const F309_CONFIG={id:'F3-09',preset:'Y7-017',startMode:'watch',parameters:{minSide:2,maxSquareSide:5,maxCubeSide:4},
 presets:{
 'Y7-017':{label:'Year 7 · Squares, cubes and roots',n:3,power:2,lesson:'Y7-017'},
 'Y8-001':{label:'Year 8 · Repeated multiplication',n:3,power:3,lesson:'Y8-001'},
 'Y9-002':{label:'Year 9 · Powers and roots',n:4,power:3,lesson:'Y9-002'},
 'Y9-003':{label:'Year 9 · Fractional indices',n:3,power:3,lesson:'Y9-003'}},
 challenge:[{n:2,power:2},{n:2,power:3},{n:3,power:3}],
 events:{value:['preset','side','dimension','unit','fillRow','fillLayer','remove','clear','answer','proof'],types:['step','correct','hintUsed','mode']}};
window.F309_CONFIG=F309_CONFIG;
(function(){'use strict';const N=window.NOVA,H=N.h,E=N.svg.el,C=F309_CONFIG,ID=C.id;
function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared '+ID+' event: '+key);N.events.emit('value',{engine:ID,key,value});}
function total(n,p){return n**p;}
function slots(n,p){return Array.from({length:total(n,p)},(_,i)=>i);}
function indexOf(r,c,z,n){return z*n*n+r*n+c;}
function coords(idx,n){let z=Math.floor(idx/(n*n)),j=idx%(n*n);return {r:Math.floor(j/n),c:j%n,z};}
function nextIndex(occupied,n,p){return slots(n,p).find(i=>!occupied.has(i));}
function fillCount(occupied){return occupied.size;}
function allBuilt(occupied,n,p){return occupied.size===total(n,p)&&slots(n,p).every(i=>occupied.has(i));}
function misconception(n,p,v){if(!Number.isInteger(v)||v<0)return 'The total must be a whole number of units.';if(v===total(n,p))return '';
 if(p===3&&v===n*n)return `That is one square layer. A cube has ${n} layers.`;
 if(p===2&&v===n*2)return `Two rows are not always a ${n} by ${n} square. Count all ${n} rows.`;
 if(v===n*p)return 'Powers mean repeated multiplication, not multiplying the base by its index.';
 if(v!==total(n,p))return `Count ${n} ${p===3?'layers of square tiles':'rows of unit tiles'} and check your product.`;return '';
}
window.F309_MATH={total,slots,indexOf,coords,nextIndex,allBuilt,misconception};
const SAY={start:'Start with a row!',square:'Fill the square!',layer:'One whole layer!',cube:'Keep stacking!',count:'Count them all!',explore:'Build your shape!',ready:'Your turn!',right:'Nice work!',wrong:'Try again!',hint:'Count each layer!',remove:'Have another go!',win:'Brilliant!',reset:'Ready to build!'};
const POSE={start:'point',square:'count',layer:'point',cube:'cheer',count:'think',explore:'point',ready:'think',right:'cheer',wrong:'oops',hint:'think',remove:'point',win:'cheer',reset:'explain'};
function dock(st,key){N.scene.helperStrip(st,POSE[key]||'think',SAY[key]||'Your turn!');}
function chalk(p,x,y,s,size=50,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}
function button(text,fn,main=false){return H('button',{class:main?'nova-btn primary':'nova-btn',text,onclick:fn});}
const STEPS=[
{name:'Start with one row',phase:0,say:'start',narration:'Place three unit tiles side by side. One row has three units, but a square needs three equal rows.'},
{name:'Complete the square',phase:1,say:'square',narration:'Complete the three by three square. It contains nine unit tiles. Three squared means three multiplied by three.'},
{name:'See one cube layer',phase:2,say:'layer',narration:'Think of that square as one layer of a larger cube. The layer still has nine unit cubes.'},
{name:'Stack the cube',phase:3,say:'cube',narration:'Stack three square layers of unit cubes. Now there are three by three by three cubes, twenty-seven in total.'},
{name:'Connect powers and roots',phase:4,say:'count',narration:'Three cubed is twenty-seven. The cube root of twenty-seven is three, because three equal lengths build the cube.'}
];
const GEO={remove:{x:700,y:988,w:240,h:105},source:{x:196,y:1040}};
function face(g,poly,role,opacity=1){let x=N.neonPath(g,'M'+poly.map(p=>p[0]+','+p[1]).join('L')+'Z',{role,fill:true,width:2.5});x.style.opacity=opacity;return x;}
function unitCube(parent,x,y,u,v,h,role,ghost=false){let g=E('g',{class:ghost?'f309-ghost':'f309-unit', 'aria-hidden':'true'},parent);
 const top=[[x,y-h],[x+u,y-h+v],[x,y-h+2*v],[x-u,y-h+v]],left=[[x-u,y-h+v],[x,y-h+2*v],[x,y+2*v],[x-u,y+v]],right=[[x,y-h+2*v],[x+u,y-h+v],[x+u,y+v],[x,y+2*v]];
 face(g,left,'support',ghost?.16:.90);face(g,right,role,ghost?.19:1);face(g,top,ghost?'unknown':'op',ghost?.23:1);return g;
}
function stageSvg(n,p,occupied,opt={}){
 const interactive=!!opt.interactive,reveal=!!opt.reveal,active=nextIndex(occupied,n,p),targetCount=total(n,p),cube=p===3;
 const svg=N.svg.root(1000,1210,`${n} by ${n} ${cube?`by ${n} cube`:'square'} built from unit ${cube?'cubes':'squares'}. ${occupied.size} of ${targetCount} units placed.`);
 svg.classList.add('f309-svg');svg.dataset.n=n;svg.dataset.power=p;svg.dataset.filled=occupied.size;svg.dataset.target=targetCount;
 chalk(svg,500,105,cube?'Build a solid cube':'Build a complete square',73,'given');
 chalk(svg,500,181,cube?`${n} across · ${n} deep · ${n} high`:`${n} rows · ${n} tiles in every row`,53,'given');
 let cellPos=function(i){let {r,c,z}=coords(i,n);if(!cube){let s=n===2?228:n===3?183:n===4?142:112;return {x:500+(c-(n-1)/2)*s,y:555+(r-(n-1)/2)*s,s};}
   const u=n===2?158:n===3?117:87,v=n===2?66:n===3?51:39,h=n===2?145:n===3?109:80;
   return {x:500+(c-r)*u,y:590+(c+r)*v-z*h,u,v,h};};
 const order=slots(n,p).sort((a,b)=>{const A=coords(a,n),B=coords(b,n);return (A.r+A.c-A.z)-(B.r+B.c-B.z)||A.z-B.z;});
 // The EMPTY build is a recognisable whole square/cube, not a single isolated ghost unit.
 if(!cube){let s=cellPos(0).s;N.neonBox(svg,500-n*s/2,555-n*s/2,n*s,n*s,{role:'support',r:13});}
 else {
  // Outer visible surfaces of a true n×n×n lattice; internal cells are hidden mathematically.
  order.forEach(i=>{let {r,c,z}=coords(i,n);if(occupied.has(i))return;
   if(r===n-1||c===n-1||z===n-1||i===active){let o=cellPos(i),g=unitCube(svg,o.x,o.y,o.u*.87,o.v*.87,o.h*.91,'support',true);
    g.style.opacity=i===active?'.74':'.56';g.dataset.empty=i;
   }
  });
 }
 order.forEach(i=>{let o=cellPos(i),present=occupied.has(i);if(!cube){
   const z=N.neonBox(svg,o.x-o.s*.475,o.y-o.s*.475,o.s*.95,o.s*.95,{role:present?'op':'support',r:17});if(!present)z.style.opacity='.30';
   if(present){const one=chalk(svg,o.x,o.y+19,'1',50,'given');one.style.pointerEvents='none';z.dataset.cell=i;}
 }else if(present){let g=unitCube(svg,o.x,o.y,o.u*.87,o.v*.87,o.h*.91,'focus');g.dataset.cell=i;}
 });
 // Highlight the next slot (not the solution), to preserve mathematical ordering of rows and layers.
 if(interactive&&active!=null){let o=cellPos(active),cy=cube?o.y-o.h*.30:o.y;
  N.neonRing(svg,o.x,cy,{role:'result',r:cube?21:33}).style.pointerEvents='none';
  chalk(svg,500,861,`Next unit ${occupied.size+1} of ${targetCount}`,52,'focus');
 }else{chalk(svg,500,861,occupied.size===targetCount?'Every unit is in place':'Each unit has size one',51,occupied.size===targetCount?'result':'given');}
 // Side dimensions and raised index in chalk (the exponent is genuinely smaller and raised).
 if(!cube){chalk(svg,200,630,`${n}`,66,'focus');chalk(svg,500,245,`${n} across`,47,'focus');}
 else{chalk(svg,152,735,`${n} layers`,48,'focus');chalk(svg,837,735,`${n} deep`,45,'op');}
 N.neonBox(svg,234,890,530,83,{role:occupied.size===targetCount&&reveal?'result':'support',r:21});
 chalk(svg,413,950,String(n),76,'given');chalk(svg,452,915,String(p),47,'focus');chalk(svg,490,949,'=',66,'given');
 chalk(svg,637,949,reveal?String(occupied.size):'?',76,reveal?'result':'focus');
 if(interactive){
  // Source unit: drag onto the highlighted next cell, or use the accessible keyboard controls below.
  let src=E('g',{'aria-label':'Drag one unit to the next highlighted location'},svg);
  const x=GEO.source.x,y=GEO.source.y;
  if(cube)unitCube(src,x,y,53,25,52,'focus');else N.neonBox(src,x-44,y-43,88,87,{role:'focus',r:15});
  chalk(svg,358,1062,'Drag a unit',49,'focus');
  const zones=()=>active==null?[]:(()=>{let q=cellPos(active);return [{id:String(active),kind:'drop',x:q.x-(cube?Math.max(65,q.u):q.s*.51),y:q.y-(cube?q.h*.9:q.s*.51),w:cube?Math.max(130,q.u*2):q.s*1.02,h:cube?q.h+q.v*1.7:q.s*1.02}];})();
  N.ui.svgDrag(svg,src,{box:{x:x-49,y:y-53,w:98,h:106},zones,onDrop:id=>opt.place(Number(id))});
  N.neonBox(svg,GEO.remove.x,GEO.remove.y,GEO.remove.w,GEO.remove.h,{role:'error',r:19});
  chalk(svg,GEO.remove.x+GEO.remove.w/2,GEO.remove.y+67,'Remove',52,'error');
  // Completed cubes/tiles can be re-grabbed and removed, not just undone globally.
  svg.querySelectorAll('[data-cell]').forEach((g)=>{const i=Number(g.dataset.cell),o=cellPos(i);
   N.ui.svgDrag(svg,g,{box:{x:o.x-(cube?o.u*.64:o.s*.43),y:o.y-(cube?o.h*.82:o.s*.43),w:cube?o.u*1.28:o.s*.86,h:cube?o.h+o.v*1.1:o.s*.86},zones:()=>[{id:'remove',kind:'remove',...GEO.remove}],onRemove:()=>opt.remove(i)});
  });
 }
 if(opt.animate&&!N.reducedMotion()){
   const changed=[...svg.querySelectorAll('[data-cell]')].filter(g=>Number(g.dataset.cell)>=Math.max(0,occupied.size-n));changed.slice(-n).forEach((g,i)=>N.motion.arrive(g,0,40,330+i*45,N.motion.ease.out));
 }
 return svg;
}
function present(st,n,p,occ,opt={}){
 st.innerHTML='';N.cap(st,'Square and Cube Builders',opt.caption||'Build unit by unit. Explain the power.');
 const row=H('div',{class:'f309-scene'}),aside=H('aside',{class:'f309-side'}),svg=stageSvg(n,p,occ,opt),T=total(n,p);
 function card(label,value,role,extra){let kids=[H('div',{class:'f309-title',text:label}),H('p',{class:'f309-value',text:value})];if(extra)kids.push(H('p',{class:'f309-desc',text:extra}));return N.neonCard(kids,{role});}
 aside.append(card('SIDE LENGTH',String(n),'focus','Each unit has edge length one.'),card('BUILT UNITS',`${occ.size} of ${T}`,'op','Count the tiles or cubes you can see.'),card('THE POWER',`${n}${p===2?'²':'³'}`,'support',p===2?'Area = n × n':'Volume = n × n × n'),card('INVERSE OPERATION',p===2?`√${T} = ${n}`:`∛${T} = ${n}`,'result','Roots recover the side length.'));
 if(opt.fractional){let c=N.neonCard([H('div',{class:'f309-title',text:'FRACTIONAL INDEX'}),N.mt.render(`${T}^{\\frac{1}{3}}=${n}`),H('p',{class:'f309-desc',text:'The cube root is the one-third power.'})],{role:'support'});aside.append(c);}
 row.append(svg,aside);st.append(row);
 if(opt.fractional){const inverse=H('div',{class:'f309-frac'});inverse.append(N.neonTile(`${T}^{\\frac{1}{3}}=${n}`,{role:'result'}));inverse.append(H('span',{text:'Cube root = power of one-third'}));st.append(inverse);}
 dock(st,opt.say||'explore');return svg;
}
const def={id:ID,title:'Square and Cube Builders',config:C,steps:STEPS,
 alt:'Real two-dimensional square tiles build n rows of n; separate isometric glass cubes are stacked into n layers of n by n, showing the difference between n squared and n cubed.',
 staticAlt:'A three by three square contains nine unit tiles. A three by three by three cube contains three layers of nine unit cubes, or twenty-seven. The square root of nine and cube root of twenty-seven are both three.',
 render(i,stage){const s=STEPS[i],n=3,p=i<=1?2:3,count=[3,9,9,27,27][i],occ=new Set(slots(n,p).slice(0,count));present(stage,n,p,occ,{caption:s.name,say:s.say,reveal:i>=1,animate:i>0,fractional:i===4});},
 exploreIntro:'Build squares and cubes with unit tiles or unit cubes. Change dimensions; explore powers and roots.',
 explore(panel,stage){let pre=C.preset,n=C.presets[pre].n,p=C.presets[pre].power,occ=new Set(),speech='explore',feedback='Add units to complete the shape.',bad=false;
 const sel=H('select',{'aria-label':'Curriculum preset'}),side=H('input',{type:'number',min:2,max:5,value:n,'aria-label':'Side length'}),shape=H('select',{'aria-label':'Square or cube'}),status=H('p',{class:'f309-status',role:'status'});
 Object.entries(C.presets).forEach(([id,v])=>sel.add(new Option(v.label,id)));
 shape.add(new Option('Square: n²','2'));shape.add(new Option('Cube: n³','3'));
 function say(msg,key='right',isBad=false){feedback=msg;speech=isBad?'wrong':key;bad=isBad;}
 function place(i){if(!Number.isInteger(i)||i!==nextIndex(occ,n,p)){say('Put this unit into the glowing next space.','wrong',true);status.textContent=feedback;return false;}occ.add(i);emit('unit',i);say(allBuilt(occ,n,p)?'Shape complete!':'Another unit placed!');render();return true;}
 function remove(i){if(!occ.has(i))return;occ.delete(i);emit('remove',i);say('Unit removed.','remove');render();}
 function fillRow(){let start=nextIndex(occ,n,p);if(start==null)return;let end=Math.min(total(n,p),Math.floor(start/n)*n+n);for(let i=start;i<end;i++)occ.add(i);emit('fillRow',end-start);say('One row built!','square');render();}
 function fillLayer(){let start=nextIndex(occ,n,p);if(start==null)return;let end=p===2?total(n,p):Math.min(total(n,p),(Math.floor(start/(n*n))+1)*n*n);for(let i=start;i<end;i++)occ.add(i);emit('fillLayer',end-start);say('Layer complete!','layer');render();}
 function reset(){occ=new Set();say('Start a new build!','reset');emit('clear',true);render();}
 function render(){panel.innerHTML='';sel.value=pre;side.value=n;shape.value=String(p);present(stage,n,p,occ,{caption:`Explore a ${n} by ${n}${p===3?' by '+n:''} ${p===2?'square':'cube'}`,say:speech,interactive:true,reveal:allBuilt(occ,n,p),place,remove,fractional:pre==='Y9-003'});
  panel.append(H('div',{class:'f309-row'},[H('label',{},['Preset',sel]),H('label',{},['Side length',side]),H('label',{},['Shape',shape])]),
   H('p',{class:'f309-help',text:'Drag a unit onto the glowing next space. Keyboard alternative: Add unit, Fill row or Fill layer. Drag placed units to the red Remove tray.'}),
   H('div',{class:'f309-row'},[button('Add unit',()=>{let i=nextIndex(occ,n,p);if(i!=null)place(i);}),button('Fill row',fillRow),button('Fill layer',fillLayer),button('Undo',()=>remove(Math.max(...occ,-1))),button('Reset',reset)]),status);
  status.textContent=feedback;status.classList.toggle('bad',bad);}
 sel.onchange=()=>{pre=sel.value;n=C.presets[pre].n;p=C.presets[pre].power;emit('preset',pre);reset();};
 side.onchange=()=>{n=Math.max(2,Math.min(p===2?5:4,Math.round(+side.value||3)));emit('side',n);reset();};
 shape.onchange=()=>{p=Number(shape.value);n=Math.min(n,p===3?4:5);emit('dimension',p);reset();};render();},
 challenge(panel,api,stage){let task=0,occ=new Set(),guess='',speech='ready',feedback='Build the shape, then prove the total.',bad=false,won=false;const ans=H('input',{type:'number',min:0,'aria-label':'Number of unit tiles or cubes in the complete shape'}),status=H('p',{class:'f309-status',role:'status'});let cur=()=>C.challenge[task];
 function say(msg,key='right',wrong=false){feedback=msg;bad=wrong;speech=wrong?'wrong':key;}
 function place(i){let {n,power:p}=cur();if(i!==nextIndex(occ,n,p)){say('Place your unit in the glowing next space.','wrong',true);status.textContent=feedback;return false;}occ.add(i);emit('unit',i);say(allBuilt(occ,n,p)?'Your shape is complete!':'Keep building!');render();return true;}
 function remove(i){if(!occ.has(i))return;occ.delete(i);emit('remove',i);say('One unit removed.','remove');render();}
 function fillRow(){let {n,power:p}=cur(),s=nextIndex(occ,n,p);if(s==null)return;let e=Math.min(total(n,p),Math.floor(s/n)*n+n);for(let i=s;i<e;i++)occ.add(i);emit('fillRow',e-s);say('Row filled.','square');render();}
 function fillLayer(){let {n,power:p}=cur(),s=nextIndex(occ,n,p);if(s==null)return;let e=p===2?total(n,p):Math.min(total(n,p),(Math.floor(s/(n*n))+1)*n*n);for(let i=s;i<e;i++)occ.add(i);emit('fillLayer',e-s);say('Layer built.','layer');render();}
 function prove(){const {n,power:p}=cur(),v=Number(ans.value);guess=ans.value;emit('answer',v);
  if(!allBuilt(occ,n,p)){let msg=`You built ${occ.size} units, but a complete shape needs ${total(n,p)}.`;api.check(false,msg,{task});say(msg,'wrong',true);render();return false;}
  let why=misconception(n,p,v);if(why){api.check(false,why,{task});say(why,'wrong',true);render();return false;}
  api.check(true,`Correct! ${n} to the power of ${p} equals ${v}.`,{task,n,p,total:v});emit('proof',{task,n,p,total:v});
  if(task===C.challenge.length-1){won=true;say('Three powers proved!','win');render();return true;}
  task++;occ=new Set();guess='';say('Next shape!','ready');render();return true;
 }
 function render(){panel.innerHTML='';const {n,power:p}=cur();present(stage,n,p,occ,{caption:`Challenge ${task+1} of 3 · ${n}${p===2?'²':'³'}`,say:speech,interactive:!won,place,remove,reveal:won,fractional:task===2&&won});
  if(won){panel.append(H('div',{class:'f309-win',text:'Brilliant! You have built and proved all three powers.'}));return;}
  panel.append(H('p',{class:'f309-help',text:`Challenge ${task+1} of 3. Construct the complete ${n} by ${n}${p===3?' by '+n:''} ${p===2?'square':'cube'}. Then write how many unit ${p===2?'tiles':'cubes'} it contains.`}),
   H('div',{class:'f309-row'},[button('Add unit',()=>{let k=nextIndex(occ,n,p);if(k!=null)place(k);}),button('Fill row',fillRow),button('Fill layer',fillLayer),button('Undo',()=>remove(Math.max(...occ,-1))),button('Hint',()=>{api.hint(p===2?'A square has n rows of n tiles.':'A cube has n layers, each with n × n cubes.');speech='hint';render();})]),
   H('div',{class:'f309-row'},[H('label',{},['How many units?',ans]),button('Check proof',prove,true)]),status);
  ans.value=guess;ans.oninput=()=>guess=ans.value;status.textContent=feedback;status.classList.toggle('bad',bad);
 }render();},onRestore(){}
};
N.registry.add({id:ID,title:def.title,topics:['squares','cubes','indices','roots','volume'],deps:['F0-02','F0-03','F0-04','F0-07','F0-08','F3-01','F3-02']});
N.bankMount({id:ID,num:'09',title:'Square and Cube Builders · Premium Review',def,linked:['F3-01','F3-02','F3-10','F3-11'],years:'Years 7–9 · Squares, cubes, powers and roots',spec:{
 purpose:'Construct squares from unit tiles and solid cubes from stacked layers of unit cubes, to prove n squared, n cubed and inverse roots.',
 params:'Side lengths 2–5 (square) and 2–4 (cube); build progress, tile/3D representation, raised indices.',
 presets:'Y7-017 square 3²; Y8-001 cube 3³; Y9-002 cube 4³; Y9-003 fractional index and cube root of 27.',
 steps:'One row → complete square → one cube layer → stack layers → count and connect to roots.',
 interactions:'Drag a unit to the next correct slot; drag placed unit to Remove; Add unit, Fill row/layer, Undo, Reset; prove unit total in Challenge.',
 traps:'Square area ≠ cube volume; n³ ≠ n×3; one square layer ≠ the entire cube; roots reverse powers.',
 gcse:'Powers, exact roots and unit-fraction indices; connects to F3-10 and F3-11.'}});
// F3-05 onward fast pointer-capture recovery; no modification to canonical F0 files.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;
 if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA mathematics helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{subtree:true,childList:true});
})();
