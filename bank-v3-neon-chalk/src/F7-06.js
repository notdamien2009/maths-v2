/* NOVA F7-06 · Factorising with Tiles · Incremental canonical-core F7 production. */
const F706_CONFIG={id:'F7-06',startMode:'watch',preset:'Y7-032',parameters:{maxTiles:18,source:'positive rectangular tiles',coefficientRange:[2,12]},presets:{
 'Y7-032':{label:'Year 7 · Common factor',title:'3x + 6',k:3,a:1,b:2,lesson:'Y7-032',context:'A rectangle made of three identical rows.'},
 'Y7-032-alt':{label:'Year 7 · Four groups',title:'4x + 8',k:4,a:1,b:2,lesson:'Y7-032',context:'Four equal rows reveal four as a common factor.'},
 'Y8-012':{label:'Year 8 · Two different counts',title:'6x + 9',k:3,a:2,b:3,lesson:'Y8-012',context:'Three identical rows, each containing two x rods and three units.'},
 'Y8-012-alt':{label:'Year 8 · Greatest common factor',title:'6x + 8',k:2,a:3,b:4,lesson:'Y8-012',context:'Two equal rows; both coefficients are divisible by two.'}
},challenge:[
 {label:'Spot the shared groups',k:3,a:1,b:2},
 {label:'Four equal rows',k:4,a:1,b:2},
 {label:'Two-term inner bracket',k:3,a:2,b:3},
 {label:'Greatest common factor',k:2,a:3,b:4}
],events:{value:['preset','tile','place','return','undo','reset','keyboard','answer','proof','hint','round'],types:['step','correct','hintUsed','mode']}};
window.F706_CONFIG=F706_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F706_CONFIG,ID=C.id;
const TALKS={scatter:['think','How many equal rows?'],rods:['point','Keep each x rod!'],units:['count','Count the unit squares!'],rectangle:['idea','No gaps, no extras!'],edge:['point','Read the row factor!'],proof:['cheer','You found the brackets!'],explore:['think','Build equal rows!'],place:['point','That fits the shape!'],remove:['point','Back to the tray!'],wrong:['oops','Check the row widths!'],hint:['think','Find the repeated group!'],correct:['cheer','Factorised perfectly!'],win:['cheer','All four proofs done!'],undo:['think','Try that move again!']};
function dock(stage,cue){const [pose,text]=TALKS[cue]||TALKS.scatter;N.scene.helperStrip(stage,pose,text);}
function emit(key,value){if(!C.events.value.includes(key))throw Error('F7-06 undeclared event '+key);N.events.emit('value',{engine:ID,key,value});}
const text=(g,x,y,v,role='given',size=42,anchor='middle')=>N.chalkText(g,x,y,String(v),{role,size,anchor});
const glass=(g,x,y,w,h,role='given',r=12)=>N.neonBox(g,x,y,w,h,{role,r});
const button=(name,fn,primary=false)=>H('button',{class:'nova-btn'+(primary?' primary':''),text:name,onclick:fn});
function validate(p){for(const v of [p.k,p.a,p.b])if(!Number.isInteger(v)||v<=0)throw Error('Factor geometry needs positive whole-number lengths.');if(p.k*(p.a+p.b)>C.parameters.maxTiles||p.k>4||p.a>3||p.b>4)throw Error('Preset geometry exceeds validated board.');return p;}
function math(p){validate(p);return {x:p.k*p.a,units:p.k*p.b,k:p.k,a:p.a,b:p.b,expanded:`${p.k*p.a}x + ${p.k*p.b}`,factorised:`${p.k}(${p.a===1?'':p.a}x + ${p.b})`,gcd:gcd(p.k*p.a,p.k*p.b)};}
function gcd(a,b){return b?gcd(b,a%b):a;}
function parse(v){const s=String(v||'').replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/\*/g,'');if(!s)return {error:'Write the factorised expression first.'};const m=s.match(/^(\d+)\((\d*)x\+(\d+)\)$/i);if(!m)return{error:'Use outside factor times a bracket, for example 3(x + 2).'};const [k,a,b]=[+m[1],m[2]?+m[2]:1,+m[3]];if(![k,a,b].every(Number.isSafeInteger)||!k||!a||!b)return{error:'Use positive whole-number factors.'};return{k,a,b};}
function explainWrong(v,p){const m=math(p),parsed=parse(v);if(parsed.error)return parsed.error;const {k,a,b}=parsed;if(k===m.k&&a===m.a&&b===m.b)return'';
 if(k===m.k&&a===m.a&&b===m.units)return`You have put all ${m.units} units inside one bracket. Share them across ${m.k} rows: ${m.units} ÷ ${m.k} = ${m.b}.`;
 if(k===m.k&&a===m.x&&b===m.b)return`You must divide the x coefficient by ${m.k} too. Each row has ${m.a} x ${m.a===1?'rod':'rods'}.`;
 if(k!==m.k){if(k*a===m.x&&k*b===m.units)return`That expansion is equivalent, but the greatest common factor is ${m.k}. Build ${m.k} equal rows for the fully factorised form.`;return`The outside factor counts identical rows. There are ${m.k} rows, not ${k}.`;}if(a!==m.a)return`Count x rods in one row. Every row contains ${m.a}, not ${a}.`;return`Count small squares in ONE row. Each row contains ${m.b}, not ${b}.`;}
function plan(p){validate(p);const slots=[],tiles=[];for(let r=0;r<p.k;r++)for(let j=0;j<p.a+p.b;j++){let type=j<p.a?'x':'one',id=`s${r}-${j}`;slots.push({id,type,row:r,col:j});tiles.push({id:`t${r}-${j}`,type,slot:null});} // Deterministic interleave keeps the original totals fully visible in the tray.
 // Preserve source expression order: x rods interleaved with their matching unit squares.
 return{slots,tiles};}
function frame(p,m){
 const W=m?500:1000,baseX=m?72:128,baseU=m?32:56,target=m?385:690;
 const factor=Math.min(2.8,target/(p.a*baseX+p.b*baseU));
 const xW=baseX*factor,uW=baseU*factor,h=uW,step=h;
 const width=p.a*xW+p.b*uW,rows=Math.ceil(p.k*(p.a+p.b)/(m?4:8));
 const x=(W-width)/2,y=m?264:255,ht=p.k*h,hEnd=ht;
 const trayY=y+ht+(m?68:76),chipStep=m?59:64;
 const V=trayY+43+rows*chipStep+(m?134:145);
 return{W,V,xW,uW,h,step,x,y,width,ht,hEnd,sourceY:trayY,cols:m?4:8,chipW:m?105:108,chipH:m?48:54,chipGap:8,chipStep,trayX:m?27:30,trayY};}
function geomSlots(p,F){const slots=plan(p).slots;let out=[];for(const v of slots){const x=F.x+Math.min(v.col,p.a)*F.xW+Math.max(0,v.col-p.a)*F.uW;out.push({...v,x,y:F.y+v.row*F.step,w:v.type==='x'?F.xW:F.uW,h:F.h});}return out;}
function tileArt(root,type,x,y,w,h,{ghost=false,small=false}={}){const role=ghost?'support':type==='x'?'focus':'result';const g=E('g',{},root);
 glass(g,x,y,w,h,role,Math.min(11,h*.20));
 if(ghost){text(g,x+w/2,y+h/2+Math.min(10,h*.20),'?',role,Math.max(24,Math.min(34,h*.56)));return g;}
 // Shape + repeated internal markings are second cues; an x rod is long, units are squares.
 if(type==='x'){N.neonLine(g,x+9,y+11,x+w-9,y+11,{role:'focus',width:3,opacity:.8});N.neonLine(g,x+11,y+h-12,x+w-11,y+h-12,{role:'focus',width:2,opacity:.55});}
 else{N.neonLine(g,x+8,y+8,x+w-8,y+h-8,{role:'result',width:2.2,opacity:.55});}
 text(g,x+w/2,y+h/2+Math.min(h*.20,11),type==='x'?'x':'1',role,small?Math.min(35,h*.62):Math.min(46,h*.70));return g;}
function stageSvg(p,tiles,o={}){const m=innerWidth<=720,F=frame(p,m),slots=geomSlots(p,F),remainingCount=tiles.filter(t=>!t.slot).length,showSource=o.interactive||remainingCount>0,s=N.svg.root(F.W,showSource?F.V:(F.y+F.hEnd+85),'Factorising tile proof: identical rows of long x rods and unit squares make one rectangle. The number of rows is the common factor and each row describes the bracket.');
 s.classList.add('f706-svg');s.dataset.placed=String(tiles.filter(t=>t.slot).length);s.dataset.total=String(tiles.length);s.dataset.factor=String(p.k);s.dataset.mode=o.mode||'watch';s.dataset.rows=String(p.k);s.dataset.bracket=`${p.a}x+${p.b}`;
 text(s,m?22:36,m?52:61,'FACTORISE WITH TILES','given',m?39:58,'start');text(s,m?23:36,m?104:115,m?'Same rows, shared factor.':'Find the equal rows inside the total.','support',m?34:45,'start');
 // Original form is a single visibly coherent mathematical statement.
 const val=math(p);text(s,m?F.W/2:500,m?168:174,val.expanded,'given',m?49:61);
 const outlineX=F.x-5,outlineY=F.y-4;
 glass(s,outlineX,outlineY,F.width+10,F.hEnd+9,'op',16);
 // Braces reveal dimensions only when the row grouping is mathematically demonstrated.
 if(o.showEdges){N.svg.brace(s,F.x,F.y-19,F.x+F.width,F.y-19,{role:'focus',depth:8});text(s,F.x+F.width/2,F.y-28,`${p.a===1?'x':p.a+'x'} + ${p.b}`,'focus',m?33:41);N.svg.brace(s,F.x-18,F.y,F.x-18,F.y+F.hEnd,{role:'result',depth:9});text(s,F.x-38,F.y+F.hEnd/2+11,p.k,'result',m?45:55);}
 for(let r=0;r<p.k;r++){const yy=F.y+r*F.step;
  if(r>0)N.neonLine(s,F.x-6,yy-9,F.x+F.width+6,yy-9,{role:'op',width:3.3,opacity:.75});
  if(o.rowNumbers)text(s,F.x-17,yy+F.h/2+9,String(r+1),'op',m?29:35,'end');
 }
 const keyed=new Map(slots.map(v=>[v.id,v]));
 for(const loc of slots){const tile=tiles.find(t=>t.slot===loc.id);if(!tile)tileArt(s,loc.type,loc.x+2,loc.y+3,loc.w-4,F.h-6,{ghost:true});}
 for(const tile of tiles.filter(t=>t.slot)){const loc=keyed.get(tile.slot),g=E('g',{'data-f706-id':tile.id,'data-f706-slot':tile.slot,'data-f706-type':tile.type,role:'button',tabindex:o.interactive?0:-1,'aria-label':`Placed ${tile.type==='x'?'x rod':'unit square'} in row ${loc.row+1}. Press R to return it.`},s);
  const x=loc.x+2,y=loc.y+3,w=loc.w-4,h=F.h-6;tileArt(g,tile.type,x,y,w,h);
  if(o.animate&&!N.reducedMotion())N.motion.arrive(g,0,-18,170);
  if(o.interactive){g.addEventListener('keydown',e=>{if(['r','Backspace','Delete'].includes(e.key)){e.preventDefault();o.move?.(tile.id,null,'keyboard');}});
   N.ui.svgDrag(s,g,{box:{x,y,w,h},zones:()=>[{id:'return',kind:'remove',...o.trayBox(F)},...slots.filter(loc=>loc.type===tile.type&&loc.id!==tile.slot&&!tiles.some(t=>t.slot===loc.id)).map(loc=>({id:loc.id,kind:'drop',x:loc.x,y:loc.y,w:loc.w,h:loc.h}))],onDrop:id=>o.move?.(tile.id,id,'drag')===true,onRemove:()=>o.move?.(tile.id,null,'drag')===true});}
 }
 const remain=tiles.filter(t=>!t.slot);
 if(!showSource)return s;
 // Tile tray is a mathematical inventory and red return area, not a picture frame around the whole board.
 const chipColumns=F.cols;const rows=Math.ceil(remain.length/F.cols);
 const trayBox={x:F.trayX-7,y:F.trayY-12,w:F.W-2*F.trayX+14,h:Math.max(100,rows*F.chipStep+66)};
 glass(s,trayBox.x,trayBox.y,trayBox.w,trayBox.h,'given',20);
 text(s,F.trayX+10,F.trayY+30,remain.length?(m?'GIVEN TILES · PLACE ON MAT':o.interactive?'GIVEN TILES · DRAG TO THE MAT':'GIVEN TILES · ORIGINAL TERMS'):'ALL TILES PLACED','given',m?27:37,'start');
 text(s,F.W-F.trayX-8,F.trayY-24,`${remain.length} left`,'support',m?28:35,'end');
 for(const [i,t] of remain.entries()){let x=F.trayX+(i%chipColumns)*(F.chipW+F.chipGap),y=F.trayY+43+Math.floor(i/chipColumns)*F.chipStep;
  const g=E('g',{'data-f706-id':t.id,'data-f706-slot':'tray','data-f706-type':t.type,tabindex:o.interactive?0:-1,role:'button','aria-label':`Given ${t.type==='x'?'x rod':'unit square'}. Press Enter to place it in the next correct slot.`},s);
  glass(g,x,y,F.chipW,F.chipH,t.type==='x'?'focus':'result',12);
  // Small scaled versions reuse the same neon-tube tile primitives and shape cues.
  const sw=t.type==='x'?F.chipW*.57:F.chipH*.54,sh=F.chipH*.45;
  tileArt(g,t.type,x+9,y+(F.chipH-sh)/2,sw,sh,{small:true});
  text(g,x+F.chipW-15,y+F.chipH/2+11,t.type==='x'?'x':'1',t.type==='x'?'focus':'result',m?30:33,'end');
  if(o.interactive){g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.auto?.(t.id,'keyboard');}});
    N.ui.svgDrag(s,g,{box:{x,y,w:F.chipW,h:F.chipH},zones:()=>slots.filter(loc=>loc.type===t.type&&!tiles.some(item=>item.slot===loc.id)).map(loc=>({id:loc.id,kind:'drop',x:loc.x,y:loc.y,w:loc.w,h:loc.h})),onDrop:id=>o.move?.(t.id,id,'drag')===true});}
 }
 if(o.interactive){const yy=F.trayY+43+rows*F.chipStep+4;const box={x:F.W-(m?183:234),y:yy,w:m?162:209,h:m?60:66};glass(s,box.x,box.y,box.w,box.h,'error',14);text(s,box.x+box.w/2,box.y+box.h/2+10,'RETURN','error',m?35:40);s.dataset.removeY=String(yy);
  // A placed tile is removed when dragged into the red return zone.
  o.trayBox=()=>box;
 }
 if(o.correct)N.motion.flash(s,F.x+F.width/2,F.y+F.hEnd/2,'result',62);
 // Provide a public diagnostic surface for production QA, not a pupil label.
 s.dataset.rows=String(p.k);s.dataset.bracket=`${p.a}x+${p.b}`;return s;}
const STEPS=[
 {name:'See the given tiles',cue:'scatter',narration:'Three x rods and six unit squares form three x plus six. We want to find a repeated group which builds exactly the same expression.'},
 {name:'Group the x rods',cue:'rods',narration:'Arrange the x rods in equal rows. There is one x rod in each of the three rows. None are lost or added.'},
 {name:'Share the units equally',cue:'units',narration:'Now share six units across the three rows. That gives two small squares in every row.'},
 {name:'Make the rectangle',cue:'rectangle',narration:'Each row has exactly x plus two, and every tile fits inside the same rectangular arrangement.'},
 {name:'Read both edges',cue:'edge',narration:'The height counts three equal rows. The width of one row is x plus two. Both dimensions are factors.'},
 {name:'Write the factorised form',cue:'proof',narration:'Three x plus six equals three multiplied by the bracket x plus two. Expand again to check that each original term returns.'}
];
function show(stage,p,tiles,opt={}){stage.textContent='';N.cap(stage,'A rectangle made from equal groups',opt.caption||'Arrange every original tile, then read the common factor and the bracket.');
 const layout=H('div',{class:'f706-layout'}),side=H('aside',{class:'f706-side'}),box=o=>N.neonCard(o,{role:'focus'});
 side.append(box([H('strong',{text:'The shared factor'}),H('p',{text:'The number of identical rows is the greatest common factor. Every original tile must appear exactly once.'})]),N.neonCard([H('strong',{text:'Inside the brackets'}),H('p',{text:'Read one whole row: x rods and unit squares. That is the expression multiplied by the row count.'})],{role:'op'}));
 const svg=stageSvg(p,tiles,opt);layout.append(svg,side);stage.append(layout);
 const proof=H('div',{class:'f706-proof'+(opt.correct?' correct':'')}),expr=math(p);
 proof.append(H('span',{class:'f706-proof-label',text:opt.hideProof?'Your factorisation':'Equal area, two forms'}),H('span',{class:'f706-proof-equation',text:opt.hideProof?'Build the rectangle, then write both factors.':opt.showProof?`${expr.expanded} = ${expr.factorised}`:expr.expanded}));stage.append(proof);dock(stage,opt.cue||'scatter');return svg;}
function watch(i,stage){const p=C.presets['Y7-032'],state=plan(p),tiles=state.tiles;const ordered=state.slots;
 if(i>=1){const wanted=i===1?ordered.filter(s=>s.type==='x'):i===2?ordered.filter(s=>s.row===0||s.type==='x'):ordered;for(const loc of wanted){const t=tiles.find(t=>t.type===loc.type&&!t.slot);if(t)t.slot=loc.id;}}
 show(stage,p,tiles,{mode:'watch',cue:STEPS[i].cue,caption:STEPS[i].name,showEdges:i>=4,rowNumbers:false,showProof:i>=5,animate:i===1||i===2||i===3,correct:i===5});}
function workspace(panel,stage,mode,api){let round=0,preset=C.preset,p=C.presets[preset],tiles=[],slots=[],history=[],msg='',bad=false,cue=mode==='challenge'?'scatter':'explore',finished=false;
 function load(){p=mode==='challenge'?C.challenge[round]:C.presets[preset];const q=plan(p);slots=q.slots;tiles=q.tiles;history=[];msg='Place matching tiles into the empty rectangle. Each row must have the same width.';bad=false;cue=mode==='challenge'?'scatter':'explore';}
 function checkpoint(){history.push(tiles.map(t=>({...t})));if(history.length>40)history.shift();}
 function move(id,dest,method='drag'){const t=tiles.find(t=>t.id===id);if(!t||finished)return false;
  if(dest==='return'||dest==='tray')dest=null;
  const target=slots.find(s=>s.id===dest);
  if(dest!==null&&(!target||target.type!==t.type||tiles.some(v=>v.id!==id&&v.slot===dest))){bad=true;cue='wrong';msg=t.type==='x'?'An x rod only fits an x-sized space.':'A unit square only fits one unit space.';let status=panel.querySelector('.f706-status');if(status){status.textContent=msg;status.classList.add('bad');}return false;}
  if(t.slot===dest)return true;checkpoint();t.slot=dest;emit(method==='keyboard'?'keyboard':dest?'place':'return',{id,type:t.type,slot:dest});bad=false;cue=dest?'place':'remove';msg=dest?'Tile placed. The length and width still match.':'Tile returned to the given pile.';render();return true;}
 function auto(id,method='keyboard'){const t=tiles.find(t=>t.id===id&&!t.slot);if(!t)return false;const target=slots.find(s=>s.type===t.type&&!tiles.some(item=>item.slot===s.id));return target?move(id,target.id,method):false;}
 function next(type){const t=tiles.find(t=>!t.slot&&t.type===type);if(t)auto(t.id,'keyboard');else{bad=true;msg='No more of that kind is waiting in the tray.';render();}}
 function undo(){if(history.length){tiles=history.pop();bad=false;cue='undo';msg='Last tile move undone.';emit('undo',{count:tiles.filter(t=>t.slot).length});render();}}
 function reset(){load();emit('reset',{mode,round});render();}
 function hint(){const t=tiles.find(t=>!t.slot),factor=math(p);msg=t?`Look for an empty ${t.type==='x'?'x-length':'unit-width'} space. Each row needs ${factor.a} x ${factor.a===1?'rod':'rods'} and ${factor.b} small units.`:`Now read the edges: ${factor.k} rows, each containing ${factor.a===1?'x':factor.a+'x'} plus ${factor.b}.`;bad=false;cue='hint';api?.hint(msg);emit('hint',{round,tip:t?.type||'edge'});render();}
 function check(){if(finished)return;const placed=tiles.filter(t=>t.slot).length;
  if(placed!==tiles.length){msg=`Complete the rectangle first. ${tiles.length-placed} of ${tiles.length} tiles remain in the tray.`;bad=true;cue='wrong';api?.check(false,msg,{round});render(panel.querySelector('input#f706-answer')?.value||'');return;}
  const raw=panel.querySelector('#f706-answer')?.value||'';emit('answer',{round,value:raw});const why=explainWrong(raw,p);
  if(why){msg=why;bad=true;cue='wrong';api?.check(false,why,{round});render(raw);return;}
  const fact=math(p);api?.check(true,`${fact.expanded} equals ${fact.factorised}`,{round});emit('proof',{round,expression:fact.factorised});bad=false;cue='correct';msg=`Correct! ${fact.expanded} = ${fact.factorised}.`;
  round++;emit('round',{round,complete:round===C.challenge.length});if(round===C.challenge.length){finished=true;cue='win';render();}else{load();render();}}
 function controls(saved=''){panel.textContent='';if(finished){panel.append(H('p',{class:'f706-win',text:'Four correct rectangle factorisations! You have found the greatest common factor every time.'}));return;}
  if(mode==='explore'){const sel=H('select',{'aria-label':'Choose factorising preset'});Object.entries(C.presets).forEach(([id,v])=>sel.add(new Option(v.label,id)));sel.value=preset;
   sel.onchange=()=>{preset=sel.value;C.preset=preset;emit('preset',preset);load();render();};panel.append(H('div',{class:'f706-controls'},[H('label',{},['Teaching preset',sel]),button('Undo',undo),button('Reset tiles',reset),button('Hint',hint)]));}
  else{const v=math(p);panel.append(H('p',{class:'f706-instruction',text:`Challenge ${round+1} of ${C.challenge.length}: factorise ${v.expanded}. Fill the rectangle, then write the two factors.`}));
   const inp=H('input',{id:'f706-answer',type:'text',class:'nova-input',placeholder:'e.g. 3(x + 2)','aria-label':'Factorised expression',value:saved});inp.autocomplete='off';inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});
   panel.append(H('div',{class:'f706-controls'},[H('label',{},['Factorised expression',inp]),button('Check factors',check,true),button('Hint',hint),button('Reset round',reset),button('Undo',undo)]));}
  panel.append(H('div',{class:'f706-controls'},[button('Place next x rod',()=>next('x')),button('Place next unit',()=>next('one'))]));
  panel.append(H('p',{class:'f706-instruction',text:'Drag a source tile into a matching empty space, or press Enter on a focused source tile. On a placed tile, press R to return it. Red RETURN zone removes a tile. Use Undo to reverse a move.'}));
  panel.append(H('p',{class:'f706-status'+(bad?' bad':''),role:'status',text:msg}));}
 function render(saved=''){show(stage,p,tiles,{mode,interactive:!finished,hideProof:mode==='challenge'&&!finished,showProof:(mode==='explore'&&tiles.every(t=>t.slot))||finished,showEdges:tiles.every(t=>t.slot)||finished,cue,caption:mode==='challenge'?`Challenge ${round+1} · rectangle factorisation`:`Explore · ${C.presets[preset].label}`,move,auto,trayBox(F){const rows=Math.ceil(tiles.filter(t=>!t.slot).length/F.cols);return{x:F.W-(F.W===500?183:234),y:F.trayY+43+rows*F.chipStep+4,w:F.W===500?162:209,h:F.W===500?60:66}},correct:finished});controls(saved);}
 load();render();}
const def={id:ID,title:'Factorising with Tiles',config:C,steps:STEPS,alt:'Neon chalk x rods and square unit tiles are rearranged into identical rectangle rows; top brace reads x plus units while side brace counts the common factor.',staticAlt:'Nine tiles, three x rods and six unit squares, arranged into three rows of x and two units, prove that 3x + 6 equals 3(x + 2).',render:watch,exploreIntro:'Arrange the original algebra tiles into equal rows; read the factors.',explore(panel,stage){workspace(panel,stage,'explore');},challenge(panel,api,stage){workspace(panel,stage,'challenge',api);},onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['factorising','common factors','algebra tiles','distributive law'],deps:['F0-02','F0-03','F0-04','F0-08','F7-01','F7-03','F3-02']});
N.bankMount({id:ID,num:'06',title:'Factorising with Tiles · Premium Review',def,linked:['F7-01','F7-03','F3-02','F7-04'],years:'Y7-032 factorising a common factor; Y8-012 greatest common factor',spec:{purpose:'Show an expanded linear expression physically rearranged into a rectangle with k identical rows. Outside factor is row count, bracket is the content of one row.',params:'Rows k 2–4, x rods a 1–3 per row, unit squares b 1–4 per row, at most 18 tiles.',presets:'Y7-032 3x+6, Y7-032-alt 4x+8, Y8-012 6x+9, Y8-012-alt 6x+8.',steps:'Scatter given tiles → place x rods equally → share units → complete rectangle → read edges → write factorised expression.',interactions:'Drag to shape-matched slots, return tray, re-grab, undo, reset, keyboard Enter/R and next-type buttons, answer checking in Challenge.',traps:'Leaving coefficients undivided, distributing only x rods, treating the inside constant as all units, wrong common factor, incomplete rectangle.',gcse:'Extension ready for quadratic common factors via F7-07 or F3-02; current version is positive linear tiles only.'}});
// Core F2 drag pointer re-targeting: preserve the single canonical transaction when the SVG tree is reparented.
(function(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const el=e.target.closest?.('[data-drag="1"]');if(el&&host.contains(el))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>pointer=null);
})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function ensureAlt(){card.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('alt'))img.alt='NOVA mathematics helper';});}ensureAlt();new MutationObserver(ensureAlt).observe(card,{childList:true,subtree:true});
window.F706_MATH={validate,math,parse,explainWrong,plan,geomSlots};
})();
