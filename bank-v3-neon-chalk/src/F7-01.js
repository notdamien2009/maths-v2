/* NOVA F7-01 · Algebra Tiles · PREMIUM REVIEW · actual bank F0 Neon + Chalk APIs. */
const F701_CONFIG={id:'F7-01',startMode:'watch',preset:'Y7-029',parameters:{maxTiles:18,minCoefficient:-9,maxCoefficient:9,types:['x2','x','one']},
 presets:{
  'Y7-029':{label:'Year 7 · Collecting like terms',title:'Collect like terms',start:[['x',1],['one',1],['x',1],['one',1],['one',1]],expression:'x + 1 + x + 1 + 1',proof:'2x + 3',narration:'Two x tiles and three unit tiles make two x plus three.'},
  'Y7-031':{label:'Year 7 · Expanding one bracket',title:'Three groups of x plus two',start:[['x',1],['one',1],['one',1],['x',1],['one',1],['one',1],['x',1],['one',1],['one',1]],expression:'3(x + 2)',proof:'3x + 6',narration:'Three lots of x plus two each contribute one x tile and two unit tiles.'},
  'SIGNED':{label:'Signed coefficients · extension',title:'Combine opposite terms',start:[['x',1],['x',1],['x',-1],['one',1],['one',-1],['one',1]],expression:'2x − x + 1 − 1 + 1',proof:'x + 1',narration:'Opposite tiles cancel by adding to zero. The remaining tiles show x plus one.'},
  'GCSE':{label:'GCSE bridge · x-squared',title:'Three tile families',start:[['x2',1],['x2',1],['x',-1],['x',-1],['one',1]],expression:'2x² − 2x + 1',proof:'2x² − 2x + 1',narration:'An x squared tile is an area tile. It is not interchangeable with an x tile or a unit.'}
 },
 challenge:[
  {label:'Collect like terms',instruction:'Build the simplified expression x + x + 1 + 1 + 1.',expect:{x2:0,x:2,one:3},expression:'2x + 3'},
  {label:'Watch the sign',instruction:'Build the simplified expression 3x − x + 2.',expect:{x2:0,x:2,one:2},expression:'2x + 2'},
  {label:'Expand the bracket',instruction:'Build the result of 3(x + 2).',expect:{x2:0,x:3,one:6},expression:'3x + 6'},
  {label:'Keep x-squared distinct',instruction:'Build x² + x² − x + 1.',expect:{x2:2,x:-1,one:1},expression:'2x² − x + 1'}
 ],
 events:{value:['preset','tile','remove','flip','reset','answer','undo','keyboard','challenge','proof'],types:['step','correct','hintUsed','mode']}};
window.F701_CONFIG=F701_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F701_CONFIG,ID=C.id;
const SPEECH={intro:'Each tile has a size!',enter:'See them arrive!',sort:'Match their shapes!',read:'Count what you see!',finish:'That is the expression!',explore:'Build your own!',place:'Good placement!',flip:'The sign changed!',remove:'Try another!',wrong:'Look again!',right:'You got it!',hint:'Check the tile types!',ready:'Make the expression!',win:'Excellent work!',undo:'One step back!'};
const POSE={intro:'explain',enter:'point',sort:'count',read:'think',finish:'cheer',explore:'explain',place:'point',flip:'think',remove:'point',wrong:'oops',right:'cheer',hint:'think',ready:'think',win:'cheer',undo:'point'};
function dock(stage,key){N.scene.helperStrip(stage,POSE[key]||'think',SPEECH[key]||'Keep going!');}
function emit(key,value){if(!C.events.value.includes(key))throw Error('F7-01 undeclared value key '+key);N.events.emit('value',{engine:ID,key,value});}
let serial=0;const tile=(type,sign)=>({id:'t'+(++serial),type,sign});
const clone=tiles=>tiles.map(x=>({...x}));
function fromPairs(pairs){return pairs.map(([t,s])=>tile(t,s));}
function coefficients(arr){let c={x2:0,x:0,one:0};for(const a of arr){if(!Object.hasOwn(c,a.type)||![1,-1].includes(a.sign))throw Error('Invalid tile');c[a.type]+=a.sign;}return c;}
function expression(c){const a=[];for(const t of ['x2','x','one']){const n=c[t];if(!n)continue;const base=t==='x2'?'x²':t==='x'?'x':'';const abs=Math.abs(n),term=t==='one'?String(abs):(abs===1?'':abs)+base;a.push({sign:Math.sign(n),term});}if(!a.length)return '0';return a.map((k,i)=>(i===0?(k.sign<0?'−':''):(k.sign<0?' − ':' + '))+k.term).join('');}
function sumText(tiles){return expression(coefficients(tiles));}
function mistake(arr,goal){const have=coefficients(arr);if(arr.length===0)return'Your mat is empty. Add tiles from the tray.';
 const match=['x2','x','one'].every(k=>have[k]===goal[k]);if(match)return'';
 if(arr.length>18)return'Too many tiles. Remove unnecessary tiles before checking.';
 if(have.x2!==goal.x2)return`x² is an area tile. ${goal.x2===0?'This expression has no x² terms.':'Count the x² squares separately from x rods.'}`;
 if(have.x!==goal.x)return`The x rods total ${have.x}x, but the target needs ${goal.x}x. Check both the number and the signs.`;
 return `Your unit squares total ${have.one}; the target needs ${goal.one}. Unit tiles are not x tiles.`;
}
function button(t,fn,main){return H('button',{class:'nova-btn'+(main?' primary':''),text:t,onclick:fn});}
function chalk(g,x,y,text,role='given',size=46,anchor='middle'){return N.chalkText(g,x,y,String(text),{size,role,anchor});}
function glass(g,x,y,w,h,role='given',r=17){return N.neonBox(g,x,y,w,h,{role,r});}
// Exact proportions of the algebra-tile system: x² is an L×L square; x is L×u; 1 is u×u.
// It is a symbolic model with x represented by length L/u. This is not a numerical substitution for x.
const L=144,u=45;
const lanes={x2:{y:145,h:200,label:'Area · x²',baseX:39,dx:177,dy:0,cols:5},x:{y:355,h:155,label:'Length · x',baseX:39,dx:183,dy:50,cols:5},one:{y:520,h:160,label:'Unit · 1',baseX:39,dx:112,dy:52,cols:8}};
const trayY=731,flipZone={id:'flip',kind:'drop',x:769,y:48,w:207,h:87},removeZone={id:'remove',kind:'remove',x:768,y:944,w:207,h:62};
function tilePos(t,i){const lane=lanes[t];const col=i%lane.cols,row=Math.floor(i/lane.cols);return{x:lane.baseX+col*lane.dx+24,y:lane.y+(t==='x2'?52:t==='x'?56:52)+row*lane.dy};}
function dim(t){return t==='x2'?{w:L,h:L}:t==='x'?{w:L,h:u}:{w:u,h:u};}
function tileArt(g,t,sign,x,y,large=false){const {w,h}=dim(t),role=sign===1?'result':'error';
 glass(g,x,y,w,h,role,t==='one'?11:15);
 // The sign is redundantly encoded by stroke and a diagonal cross-hatch; no colour-only interpretation.
 if(sign<0){for(let k=12;k<w+h-10;k+=24){const xa=Math.min(w-7,k),ya=7+Math.max(0,k-w+7),xb=7+Math.max(0,k-h+7),yb=Math.min(h-7,k);if(xa>xb&&yb>=ya)N.neonLine(g,x+xb,y+yb,x+xa,y+ya,{role:'error',width:1.5,opacity:.36});}}
 N.neonLine(g,x+12,y+11,x+w-12,y+11,{role:sign===1?'result':'error',width:3,opacity:.65});
 const cx=x+w/2,cy=y+h/2;
 if(t==='x2') {chalk(g,cx-(sign<0?10:0),cy+21,(sign<0?'−':'')+'x',role,67);chalk(g,cx+47,cy-16,'2',role,37);}
 else if(t==='x')chalk(g,cx,cy+17,(sign<0?'−':'')+'x',role,48);
 else chalk(g,cx,cy+13,sign===1?'1':'−1',role,33);
 if(large){N.neonRing(g,x+w-14,y+h-14,{role:sign===1?'result':'error',r:8,pulse:false});}
 return {x,y,w,h};}
function svgScene(tiles,o={}){
 const s=N.svg.root(1000,o.interactive?1030:690,'Three algebra tile lanes: x squared area tiles, x rods, and unit squares. Positive green glass or red diagonally hatched negative tiles. Signed tiles can be dragged from the six-tile tray and flipped or removed.');s.classList.add('f701-svg');s.dataset.count=String(tiles.length);
 // Visual legend: form defines the tile type, colour+pattern defines sign.
 chalk(s,45,67,'Algebra tile workshop','given',57,'start');
 chalk(s,48,121,o.headline||'Each shape represents a different term.','given',48,'start');
 if(o.interactive){glass(s,769,45,207,94,'op',16);chalk(s,873,82,'Flip sign','given',49);chalk(s,873,124,'+ ↔ −','op',49);}
 for(const [type,lane] of Object.entries(lanes)){
   // Semantic classification work area, not a decorative frame behind the entire diagram.
   glass(s,22,lane.y,953,lane.h,'given',19);
   chalk(s,50,lane.y+41,lane.label,'given',53,'start');
   const n=tiles.filter(a=>a.type===type).length;
   if(!n)chalk(s,500,lane.y+lane.h/2+20,o.interactive?'Drop '+(type==='x2'?'squares':type==='x'?'rods':'unit tiles')+' here':type==='x2'?'Square tiles represent x²':type==='x'?'Rods represent x':'Small squares represent 1','support',52);
 }
 const counts={x2:0,x:0,one:0};
 for(const a of tiles){const {x,y}=tilePos(a.type,counts[a.type]++),g=E('g',{'data-tile-id':a.id,tabindex:o.interactive?0:-1,role:'button','aria-label':(a.sign<0?'negative ':'positive ')+(a.type==='x2'?'x squared':a.type==='x'?'x':'one')+' tile. Press Delete to remove, F to flip.'},s);
  const bounds=tileArt(g,a.type,a.sign,x,y,false);
  if(o.animate&&!N.reducedMotion())N.motion.arrive(g,0,-38);
  if(o.interactive){g.addEventListener('keydown',ev=>{if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();o.onRemove?.(a.id);}if(ev.key.toLowerCase()==='f'){ev.preventDefault();o.onFlip?.(a.id);}});
   N.ui.svgDrag(s,g,{box:bounds,zones:()=>[flipZone,removeZone,{id:'keep',kind:'drop',x:22,y:lanes[a.type].y,w:953,h:lanes[a.type].h}],onDrop:id=>id==='flip'?o.onFlip?.(a.id):true,onRemove:()=>o.onRemove?.(a.id)});
  }
 }
 if(o.interactive){
 chalk(s,46,720,'Add tiles · drag to place','given',53,'start');
 const types=['x2','x','one'];
 const items=[];
 for(let a=0;a<6;a++){
  const sign=a<3?1:-1,t=types[a%3],x=21+(a%3)*320+(a<3?0:0),y=trayY+(a<3?0:101);
  // Three purpose-built trays per sign, not extra background frames.
  const g=E('g',{'data-tray':(sign>0?'+':'-')+t,role:'button',tabindex:o.interactive?0:-1,'aria-label':'Add '+(sign===1?'positive ':'negative ')+(t==='x2'?'x squared':t==='x'?'x':'one')+' tile'},s);
  glass(g,x,y,306,88,sign>0?'result':'error',17);
  chalk(g,x+37,y+60,sign>0?'+':'−',sign>0?'result':'error',52);
  // Miniature sample built from canonical core; scaled geometry preserves the algebra tile ratios.
  const preview=E('g',{transform:`translate(${x+112},${y+22}) scale(.30)`},g);tileArt(preview,t,sign,0,0,false);
  chalk(g,x+251,y+60,t==='x2'?'x²':t==='x'?'x':'1',sign>0?'result':'error',55);
  items.push({g,t,sign,x,y});
  if(o.interactive){g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();o.onAdd?.(t,sign);}});
   N.ui.svgDrag(s,g,{box:{x,y,w:306,h:88},zones:()=>[{id:t,kind:'drop',x:22,y:lanes[t].y,w:953,h:lanes[t].h},removeZone],onDrop:id=>id===t?o.onAdd?.(t,sign):false,onRemove:()=>false});
  }
 }
 glass(s,768,944,207,62,'error',17);chalk(s,873,987,'Remove','error',51);
 }
 if(o.celebrate&&!N.reducedMotion())N.motion.flash(s,500,460,'result',50);
 return s;
}
function view(stage,tiles,opt={}){
 stage.textContent='';N.cap(stage,'Algebra Tiles',opt.caption||'Shape shows the term; sign shows its direction.');
 const layout=H('div',{class:'f701-layout'}),side=H('aside',{class:'f701-aside'}),svg=svgScene(tiles,opt);
 side.append(N.neonCard([H('strong',{text:'The size matters'}),H('p',{text:'An x² square, an x rod and a unit tile have different algebraic values. Only tiles of the same type can be combined.'})],{role:'focus'}),N.neonCard([H('strong',{text:'Signs matter too'}),H('p',{text:'Positive tiles glow green. Negative tiles glow red with diagonal hatching. A positive and negative tile of the same type add to zero.'})],{role:'op'}));
 layout.append(svg,side);stage.append(layout);
 const f=H('div',{class:'f701-formula'+(opt.correct?' correct':'')});
 if(opt.hideResult){f.append(H('span',{class:'f701-caption',text:'Read the expression from your mat, then Check.'}));}
 else{f.append(H('span',{class:'f701-caption',text:opt.formulaTitle||'On the mat'}),N.mt.render(opt.formula||sumText(tiles)));}
 stage.append(f);dock(stage,opt.say||'explore');return svg;
}
const STEPS=[
 {name:'Meet three algebra tiles',phase:'introduce',say:'intro',narration:'A large square stands for x squared, a long rectangular rod stands for x, and a small square stands for one. These are different algebraic terms. Only like terms can combine.'},
 {name:'Place the tiles',phase:'enter',say:'enter',narration:'Place one x rod, three unit squares and then another x rod. Notice that there are two x rods and three unit tiles altogether.'},
 {name:'Sort by tile type',phase:'arrange',say:'sort',narration:'Put the x rods together, and the unit squares together. We cannot turn an x rod into one unit, and we cannot turn an x squared area square into a rod.'},
 {name:'Count the like terms',phase:'read',say:'read',narration:'There are two x rods and three unit tiles. So x plus x plus one plus one plus one is two x plus three.'},
 {name:'Read the expression',phase:'finish',say:'finish',narration:'The simplified expression is two x plus three. The tile layout proves why the coefficients are two and three.'}
];
function watchTiles(i){const p=C.presets[C.preset],arr=fromPairs(p.start);if(i===0)return fromPairs([['x2',1],['x',1],['one',1]]);if(i===1)return arr.slice(0,Math.max(2,Math.floor(arr.length*.6)));return arr;}
function watch(i,stage){const p=C.presets[C.preset];const tiles=watchTiles(i);const text=i===0?'Square · rod · unit':i===1?'Place equal shapes':'Read each family separately';view(stage,tiles,{caption:STEPS[i].name,headline:text,say:STEPS[i].say,formula:i>=3?p.proof:(i===2?p.expression:'?'),formulaTitle:i>=3?'Simplified result':'Expression in progress',animate:true,celebrate:i===4});}
function explore(panel,stage){let tiles=fromPairs(C.presets[C.preset].start),history=[],message='Drag tiles from the tray to their matching lanes.',saying='explore',bad=false,presetId=C.preset;
 function remember(){history.push(clone(tiles));if(history.length>35)history.shift();}
 function add(t,sgn){if(tiles.length>=C.parameters.maxTiles){message='The mat holds at most 18 tiles. Remove some first.';bad=true;saying='wrong';render();return false;}if(tiles.filter(x=>x.type===t).length>= (t==='one'?16:t==='x2'?5:10)){message='This tile lane is full. Remove some tiles.';bad=true;saying='wrong';render();return false;}remember();tiles.push(tile(t,sgn));bad=false;saying='place';message=(sgn===1?'Positive':'Negative')+' tile placed in the '+(t==='x2'?'x²':t==='x'?'x':'unit')+' lane.';emit('tile',{type:t,sign:sgn,total:tiles.length});render();return true;}
 function remove(id){if(!tiles.some(a=>a.id===id))return false;remember();tiles=tiles.filter(a=>a.id!==id);emit('remove',id);message='Tile removed. Count the remaining terms.';bad=false;saying='remove';render();return true;}
 function flip(id){const target=tiles.find(a=>a.id===id);if(!target)return false;remember();target.sign*=-1;emit('flip',{id,sign:target.sign});message='This tile changed sign; its type has not changed.';bad=false;saying='flip';render();return true;}
 function undo(){if(!history.length)return;tiles=history.pop();message='The last change was undone.';bad=false;saying='undo';emit('undo',tiles.length);render();}
 function reset(){history=[];tiles=[];message='Empty mat. Build an expression.';bad=false;saying='explore';emit('reset',true);render();}
 function render(){view(stage,tiles,{interactive:true,headline:'Match shapes, then read the sum.',say:saying,caption:'Explore · '+C.presets[presetId].title,onAdd:add,onRemove:remove,onFlip:flip});
 panel.textContent='';let select=H('select',{'aria-label':'Choose algebra-tile preset'});Object.entries(C.presets).forEach(([k,v])=>select.add(new Option(v.label,k)));select.value=presetId;
 panel.append(H('div',{class:'f701-controls'},[H('label',{},['Teaching preset',select]),button('Undo',undo),button('Clear mat',reset)]));
 panel.append(H('p',{class:'f701-small',text:'Drag from the tray into the correct lane. Move any placed tile to Flip sign, or to Remove. Keyboard: focus a tray tile and press Enter to add; focus a placed tile and press F to flip or Delete to remove.'}));
 const buttons=[];for(const t of ['x2','x','one'])for(const sg of [1,-1])buttons.push(button('Add '+(sg<0?'−':'+')+(t==='x2'?'x²':t==='one'?'1':'x'),()=>{emit('keyboard',{action:'add',t,sg});add(t,sg);}));
 panel.append(H('div',{class:'f701-action-row'},buttons),H('p',{class:'f701-status'+(bad?' bad':''),role:'status',text:message}));
 select.onchange=()=>{presetId=select.value;C.preset=presetId;tiles=fromPairs(C.presets[presetId].start);history=[];bad=false;saying='explore';message='Loaded '+C.presets[presetId].title+'. Rearrange or change the tiles.';emit('preset',presetId);render();};
 }render();}
function challenge(panel,api,stage){let idx=0,tiles=[],message='Make the target expression by placing tiles on the mat.',saying='ready',bad=false,finished=false;
 function add(t,sg){if(tiles.length>=18||tiles.filter(x=>x.type===t).length>=(t==='one'?16:t==='x2'?5:10)){message='Too many tiles. Remove tiles before adding more.';bad=true;saying='wrong';update();return false;}tiles.push(tile(t,sg));emit('tile',{type:t,sign:sg,round:idx});saying='place';bad=false;message='Tile placed. Check your coefficients.';render();return true;}
 function remove(id){let n=tiles.length;tiles=tiles.filter(a=>a.id!==id);if(tiles.length===n)return false;emit('remove',{id,round:idx});saying='remove';bad=false;message='Tile removed.';render();return true;}
 function flip(id){let t=tiles.find(a=>a.id===id);if(!t)return false;t.sign*=-1;emit('flip',{id,round:idx});saying='flip';message='Sign changed.';bad=false;render();return true;}
 function clear(){tiles=[];message='Mat cleared. Try again.';saying='ready';bad=false;emit('reset',{round:idx});render();}
 function check(){let task=C.challenge[idx],error=mistake(tiles,task.expect);emit('answer',{round:idx,value:coefficients(tiles)});if(error){bad=true;saying='wrong';message=error;api.check(false,error,{round:idx});render();return;}bad=false;saying='right';message='Correct. Each term has the right type and sign.';api.check(true,message,{round:idx});emit('proof',{round:idx,expression:task.expression});idx++;tiles=[];
 if(idx>=C.challenge.length){finished=true;saying='win';message='All four algebra proofs complete!';render();return;}
 message='Correct. Now build the next expression.';render();}
 function hint(){let task=C.challenge[idx],c=coefficients(tiles),g=task.expect;const key=['x2','x','one'].find(k=>c[k]!==g[k]);let note=key?`Look at the ${key==='one'?'unit':key==='x2'?'x²':'x'} lane. It currently totals ${c[key]}; check the target.`:'Your coefficients match. Press Check expression.';emit('proof',{round:idx,hint:true});api.hint(note);saying='hint';bad=false;message=note;render();}
 function update(){panel.textContent='';if(finished){panel.append(H('p',{class:'f701-win',text:'Four proof challenges completed. Like terms, signs, distribution and x² are now distinct.'}));return;}
 const task=C.challenge[idx];panel.append(H('p',{class:'f701-small',text:'Challenge '+(idx+1)+' of '+C.challenge.length+' · '+task.instruction}));
 const actions=[];for(const t of ['x2','x','one'])for(const sg of [1,-1])actions.push(button((sg<0?'−':'+')+(t==='x2'?'x²':t==='x'?'x':'1'),()=>{emit('keyboard',{round:idx,t,sg});add(t,sg);}));
 panel.append(H('div',{class:'f701-action-row'},actions));panel.append(H('div',{class:'f701-controls'},[button('Check expression',check,true),button('Clear mat',clear),button('Hint',hint)]));panel.append(H('p',{class:'f701-status'+(bad?' bad':''),role:'status',text:message}));}
 function render(){let task=C.challenge[Math.min(idx,C.challenge.length-1)];view(stage,tiles,{interactive:!finished,hideResult:!finished,correct:finished,say:saying,caption:finished?'Algebra proof complete':'Challenge '+(idx+1)+' · '+task.label,headline:finished?'Excellent mathematical proof':'Make: '+task.instruction.replace(/^Build (the simplified expression |the result of )?/,'').replace(/\.$/,''),formula:finished?'Correct — all four':undefined,onAdd:add,onRemove:remove,onFlip:flip,celebrate:finished});update();}
 render();}
const def={id:ID,title:'Algebra Tiles',config:C,steps:STEPS,alt:'Large positive and hatched negative glass algebra tiles: square x squared, rectangular x, and square unit tokens grouped into three mathematical lanes.',staticAlt:'An x squared square, x rod and unit square represent different terms. Two x rods plus three unit tiles show the expression 2x + 3.',render:watch,exploreIntro:'Move, flip and remove algebra tiles to make expressions.',explore,challenge,onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['algebra','like terms','distributive law','signed tiles'],deps:['F0-02','F0-03','F0-04','F0-05','F0-08','F3-02']});
N.bankMount({id:ID,num:'01',title:'Algebra Tiles · Premium Review',def,linked:['F3-02','F7-02','F7-03'],years:'Year 7 collecting like terms and expanding a bracket; GCSE extension',spec:{purpose:'Represent x², x and one with exact geometrically distinct signed tiles and combine like terms only.',params:'Three tile types, ± signs, maximum 18 displayed tiles. Positive/negative signs encoded with colour plus hatching.',presets:'Y7-029: x+x+3. Y7-031: three groups of x+2. Signed extension and GCSE x² extension.',steps:'Identify tile dimensions → place tiles → group by type → count coefficients → read simplified expression.',interactions:'Six tray tile types drag to labelled lanes, placed tiles drag to Flip or Remove, keyboard Enter/F/Delete and clickable add buttons.',traps:'Combining x and x²; combining x with constants; dropping the negative sign; assuming tiles of different area are interchangeable.',gcse:'GCSE extensions: signed coefficients, zero pairs and quadratic terms. F7-02 handles cancellation in depth, F3-02 handles bracket area proofs.'}});
// Reuse bank core's drag transaction. On platforms losing pointer capture during SVG reparenting,
// forward pointer changes back into the same canonical core transaction, rather than inventing a drag API.
(function(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>pointer=null);
})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('alt'))img.setAttribute('alt','NOVA maths helper');});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{childList:true,subtree:true});
window.F701_MATH={coefficients,expression,sumText,mistake,fromPairs};
})();
