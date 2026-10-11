/* NOVA F3-14 · Multiplication Table Explorer. F0 canonical primitives only. */
const F314_CONFIG={id:'F3-14',startMode:'watch',preset:'Y7-012-PosNeg',parameters:{min:1,max:12,rows:12,columns:12},
 presets:{
  'Y7-012-PosNeg':{label:'Positive × negative',rowSign:1,colSign:-1,row:3,col:4},
  'Y7-012-NegPos':{label:'Negative × positive',rowSign:-1,colSign:1,row:6,col:5},
  'Y7-012-NegNeg':{label:'Negative × negative',rowSign:-1,colSign:-1,row:7,col:8},
  'Y7-012-PosPos':{label:'Positive × positive',rowSign:1,colSign:1,row:9,col:6}},
 challenge:[
  {row:3,col:4,rowSign:-1,colSign:1,options:[12,-12,-7]},
  {row:6,col:5,rowSign:-1,colSign:-1,options:[-30,30,11]},
  {row:7,col:8,rowSign:1,colSign:-1,options:[-15,56,-56]},
  {row:9,col:6,rowSign:1,colSign:1,options:[15,-54,54]}],
 events:{value:['preset','row','column','rowSign','colSign','select','place','remove','reset','hint','proof'],types:['mode','correct','hintUsed','step']}};
window.F314_CONFIG=F314_CONFIG;
(function(){'use strict';const N=window.NOVA,H=N.h,E=N.svg.el,C=F314_CONFIG,ID=C.id;
const GW=1120,GH=1240,X=229,Y=247,CELL=65,LABELS=12,REMOVE={id:'remove',kind:'remove',x:837,y:1102,w:210,h:85};
const TEXT={start:'Look closely!',row:'Follow the row!',column:'Now the column!',cross:'Spot the cross!',array:'Count the array!',done:'You got it!',explore:'Your turn!',ready:'Have a go!',wrong:'Try again!',hint:'Spot the signs!',right:'Nice one!',win:'Brilliant!',remove:'Try again!'};
const POSE={start:'point',row:'point',column:'point',cross:'think',array:'count',done:'cheer',explore:'point',ready:'think',wrong:'oops',hint:'think',right:'cheer',win:'cheer',remove:'point'};
const STEPS=[
 {name:'Select a row',phase:0,say:'row',narration:'A row shows one factor. Choose row three. The row and its label glow so we can follow it accurately.',prompt:'Which factor is the row?'},
 {name:'Select a column',phase:1,say:'column',narration:'Choose column four. Every cell in the selected column represents a multiple of four.',prompt:'Which factor is the column?'},
 {name:'Find the crossing',phase:2,say:'cross',narration:'The selected row and column meet at one cell. Their intersection identifies the product.',prompt:'Where do the row and column meet?'},
 {name:'Build the sub-array',phase:3,say:'array',narration:'The rectangle is three units by four units. There are twelve equal unit cells. The magnitude of the product is twelve.',prompt:'How many equal unit cells can you count?'},
 {name:'Decide the sign',phase:4,say:'done',narration:'Here the row factor is positive and the column factor is negative. Unlike signs give a negative product. Three multiplied by negative four is negative twelve.',prompt:'How do the signs change the product?'}
];
function product(r,c,rs,cs){return r*c*rs*cs;}
function signExplain(rs,cs){return rs===cs?'Matching signs give a positive product.':'Unlike signs give a negative product.';}
function wrongMessage(value,task){const correct=product(task.row,task.col,task.rowSign,task.colSign),v=+value;
 if(v===-correct)return'Check the signs. '+signExplain(task.rowSign,task.colSign);
 if(v===task.row*task.rowSign+task.col*task.colSign)return'Multiplication is not addition. Count the rows and columns in the sub-array.';
 if(Math.abs(v)===task.row+task.col)return'You added the magnitudes. A multiplication grid shows equal rows, not a sum of two factors.';
 if(Math.abs(v)===Math.abs(task.row-task.col))return'Find the intersection. Subtracting the factors does not give their product.';
 return`Follow row ${task.row*task.rowSign} and column ${task.col*task.colSign}. ${signExplain(task.rowSign,task.colSign)}`;
}
window.F314_MATH={product,signExplain,wrongMessage};
function evt(key,value){if(!C.events.value.includes(key))throw Error('F3-14 undeclared event key '+key);N.events.emit('value',{engine:ID,key,value});}
function btn(title,fn,primary=false){return H('button',{class:'nova-btn'+(primary?' primary':''),text:title,onclick:fn});}
function ch(p,x,y,t,size=47,role='given'){return N.chalkText(p,x,y,String(t),{size,role});}
function bx(p,x,y,w,h,role='support',rad=13){return N.neonBox(p,x,y,w,h,{role,r:rad});}
function mark(p,x,y,role='focus',r=16){return N.neonRing(p,x,y,{role,r,pulse:false});}
function capFactor(n,sign){return(sign===-1?'−':'')+n;}
function clamp(n){return Math.max(1,Math.min(12,Math.floor(+n||1)));}
function taskAsPreset(s){return {row:clamp(s.row),col:clamp(s.col),rowSign:s.rowSign===-1?-1:1,colSign:s.colSign===-1?-1:1};}
function create(s,o={}){s=taskAsPreset(s);const challenge=!!o.challenge,phase=o.phase??4,reveal=!!o.reveal,filled=phase>=3;
 const svg=N.svg.root(GW,GH,'Twelve by twelve times table; current row '+capFactor(s.row,s.rowSign)+' column '+capFactor(s.col,s.colSign)+'.');svg.classList.add('f314-svg');svg.dataset.selected=`${s.row},${s.col}`;svg.dataset.product=String(product(s.row,s.col,s.rowSign,s.colSign));
 bx(svg,55,20,1009,138,'support',24);
 ch(svg,560,81,`${capFactor(s.row,s.rowSign)} × ${capFactor(s.col,s.colSign)} = ${reveal?product(s.row,s.col,s.rowSign,s.colSign):'?'}`,65,'given');
 ch(svg,560,131,challenge?'Place the correct product on the glowing cell':s.rowSign===s.colSign?'Same signs · positive product':'Different signs · negative product',46,'focus');
 // A filled mathematical sub-array rectangle, not a cosmetic pulse or colour-only view.
 if(filled&&!challenge)bx(svg,X+2,Y+2,CELL*s.col-4,CELL*s.row-4,'focus',18);
 bx(svg,X-9,Y-11,CELL*12+17,CELL*12+22,'support',19);
 ch(svg,132,208,s.rowSign===-1?'− rows':'+ rows',50,s.rowSign===-1?'focus':'given');
 // Every grid cell is a neon-glass tile; the grid has one roving-tabindex keyboard focus.
 for(let r=1;r<=12;r++){
  ch(svg,174,Y+(r-.5)*CELL+13,r,49,phase>=0&&r===s.row?'focus':'given');
  for(let c=1;c<=12;c++){
   if(r===1)ch(svg,X+(c-.5)*CELL,Y-22,c,49,phase>=1&&c===s.col?'focus':'given');
   let rowActive=phase>=0&&r===s.row,colActive=phase>=1&&c===s.col,inArray=filled&&r<=s.row&&c<=s.col,selected=r===s.row&&c===s.col;
   const g=E('g',{role:'gridcell',tabindex:selected?'0':'-1','aria-label':challenge?`Row ${capFactor(r,s.rowSign)}, column ${capFactor(c,s.colSign)}; answer not yet checked`:`Row ${capFactor(r,s.rowSign)}, column ${capFactor(c,s.colSign)}, product ${product(r,c,s.rowSign,s.colSign)}`,'data-cell':`${r},${c}`},svg);
   g.dataset.r=String(r);g.dataset.c=String(c);
   const role=selected&&phase>=2?'focus':inArray?'op':rowActive||colActive?'given':'support';
   bx(g,X+(c-1)*CELL+3,Y+(r-1)*CELL+3,CELL-6,CELL-6,role,9);
   if(selected&&phase>=2){mark(g,X+(c-.5)*CELL,Y+(r-.5)*CELL,'focus',16);}
   if(o.onSelect){g.addEventListener('click',()=>o.onSelect(r,c));g.addEventListener('keydown',e=>{
    let rr=r,cc=c;if(e.key==='ArrowUp')rr=Math.max(1,r-1);else if(e.key==='ArrowDown')rr=Math.min(12,r+1);else if(e.key==='ArrowLeft')cc=Math.max(1,c-1);else if(e.key==='ArrowRight')cc=Math.min(12,c+1);else if(['Enter',' '].includes(e.key)){}else return;
    e.preventDefault();o.onSelect(rr,cc,true);
   });}
  }
 }
 // Chosen intersection is a real draggable target. In Challenge, it is the requested placement zone.
 const tx=X+(s.col-.5)*CELL,ty=Y+(s.row-.5)*CELL;
 if(challenge){bx(svg,tx-CELL/2+2,ty-CELL/2+2,CELL-4,CELL-4,'focus',10);mark(svg,tx,ty,'focus',20);}
 else if(phase>=2){const handle=E('g',{'data-handle':'crosshair','aria-label':'Drag the crosshair to select another row and column'},svg);mark(handle,tx,ty,'result',23);
  if(o.onSelect){const zones=[];for(let r=1;r<=12;r++)for(let c=1;c<=12;c++)zones.push({kind:'drop',id:`cell-${r}-${c}`,x:X+(c-1)*CELL,y:Y+(r-1)*CELL,w:CELL,h:CELL});
   N.ui.svgDrag(svg,handle,{box:{x:tx-26,y:ty-26,w:52,h:52},zones:()=>zones,onDrop:id=>{const m=id.match(/^cell-(\d+)-(\d+)$/);if(!m)return false;o.onSelect(+m[1],+m[2]);return true;}});
  }
 }
 // Keep all chalk within the F0 userSpaceOnUse filter region (ends at y=1200).
 bx(svg,55,1040,1008,63,challenge?'support':phase===4?'result':'op',17);
 const evidence=challenge?'Match a signed product to the highlighted cell':phase<3?'Follow the row and column':`${s.row} × ${s.col} = ${s.row*s.col} equal cells`;
 ch(svg,559,1083,evidence,48,phase===4&&!challenge?'result':'given');
 if(challenge){
  const opts=o.options||[],coords=[{x:78,y:1102},{x:331,y:1102},{x:584,y:1102}];
  opts.forEach((v,i)=>{if(o.selectedProduct!==undefined&&o.selectedProduct!==null)return;const pt=coords[i],card=E('g',{'data-product-card':String(v)},svg);bx(card,pt.x,pt.y,220,85,'op',16);ch(card,pt.x+110,pt.y+63,String(v),65,'given');
   if(o.onPlace){const dst={id:`cell-${s.row}-${s.col}`,kind:'drop',x:X+(s.col-1)*CELL,y:Y+(s.row-1)*CELL,w:CELL,h:CELL};N.ui.svgDrag(svg,card,{box:{x:pt.x,y:pt.y,w:220,h:85},zones:()=>[dst,REMOVE],onDrop:()=>o.onPlace(v),onRemove:()=>o.onRemove?.()});}
  });
  if(o.selectedProduct!==undefined&&o.selectedProduct!==null){
   const placed=E('g',{'data-placed-card':String(o.selectedProduct)},svg);
   bx(placed,tx-55,ty-37,110,74,'result',14);ch(placed,tx,ty+18,o.selectedProduct,56,'result');
   if(o.onRemove)N.ui.svgDrag(svg,placed,{box:{x:tx-55,y:ty-37,w:110,h:74},zones:()=>[REMOVE],onRemove:()=>o.onRemove()});
  }
  bx(svg,REMOVE.x,REMOVE.y,REMOVE.w,85,'error',15);ch(svg,REMOVE.x+REMOVE.w/2,1165,'Remove',53,'error');
 }else{
  bx(svg,55,1111,1008,82,'support',18);
  ch(svg,560,1168,phase>=4?`${capFactor(s.row,s.rowSign)} × ${capFactor(s.col,s.colSign)} = ${product(s.row,s.col,s.rowSign,s.colSign)} · ${s.rowSign===s.colSign?'positive':'negative'}`:'Array magnitudes first · sign second',50,phase>=4?'result':'given');
 }
 if(o.animate&&!N.reducedMotion()){N.motion.flash(svg,tx,ty,'focus',40);}
 return svg;
}
function show(stage,s,o={}){stage.innerHTML='';N.cap(stage,'Multiplication-Table Explorer',o.caption||'Follow the crosshair. Prove the product.');const scene=H('div',{class:'f314-scene'}),svg=create(s,o),side=H('aside',{class:'f314-side'});
 side.append(N.neonCard([H('strong',{text:'A 12 × 12 array'}),H('p',{text:'Each cell marks a row-column product. The highlighted rectangle contains row × column unit squares.'})],{role:'op'}),N.neonCard([H('strong',{text:'Signs are separate'}),H('p',{text:signExplain(s.rowSign,s.colSign)+' The size comes from the array; the sign comes from the factors.'})],{role:'focus'}));
 scene.append(svg,side);stage.append(scene);N.scene.helperStrip(stage,POSE[o.say||'explore']||'think',TEXT[o.say||'explore']);return svg;}
function controls(panel,stage,initial){let s=taskAsPreset(initial),message='Move the crosshair, or use arrow keys on the grid.',said='explore',selectedCell=false;const preset=H('select',{'aria-label':'Choose multiplication preset'}),row=H('input',{type:'number',min:1,max:12,'aria-label':'Row magnitude'}),col=H('input',{type:'number',min:1,max:12,'aria-label':'Column magnitude'}),rowSign=H('select',{'aria-label':'Row sign'}),colSign=H('select',{'aria-label':'Column sign'}),status=H('p',{class:'f314-status',role:'status'});
 Object.entries(C.presets).forEach(([k,v])=>preset.add(new Option(v.label,k)));
 [[1,'Positive'],[-1,'Negative']].forEach(([k,v])=>{rowSign.add(new Option(v,k));colSign.add(new Option(v,k));});
 function select(r,c,keyboard=false){s.row=clamp(r);s.col=clamp(c);selectedCell=true;evt('select',{row:s.row,col:s.col});message=`${capFactor(s.row,s.rowSign)} × ${capFactor(s.col,s.colSign)} = ${product(s.row,s.col,s.rowSign,s.colSign)}. ${signExplain(s.rowSign,s.colSign)}`;said='right';render();if(keyboard)stage.querySelector(`.f314-svg [data-cell="${s.row},${s.col}"]`)?.focus();}
 function render(){show(stage,s,{phase:4,reveal:true,caption:'Explore the table',say:said,onSelect:select});panel.innerHTML='';const matches=Object.entries(C.presets).find(([k,v])=>v.row===s.row&&v.col===s.col&&v.rowSign===s.rowSign&&v.colSign===s.colSign);preset.value=matches?.[0]||C.preset;
 row.value=s.row;col.value=s.col;rowSign.value=s.rowSign;colSign.value=s.colSign;
 panel.append(H('div',{class:'f314-toolbar'},[H('label',{},['Preset',preset]),H('label',{},['Row',row]),H('label',{},['Row sign',rowSign]),H('label',{},['Column',col]),H('label',{},['Column sign',colSign])]),
 H('div',{class:'f314-toolbar'},[btn('Row −',()=>select(s.row-1,s.col)),btn('Row +',()=>select(s.row+1,s.col)),btn('Column −',()=>select(s.row,s.col-1)),btn('Column +',()=>select(s.row,s.col+1)),btn('Reset',()=>{s=taskAsPreset(C.presets[C.preset]);evt('reset',true);message='Start again. Follow the row!';said='start';render();})]),
 H('p',{class:'f314-info',text:'Drag the neon crosshair to a cell, click a cell, or use arrow keys on the selected gridcell. The shaded rectangle counts the unit squares.'}),
 H('div',{class:'f314-readout'},[N.answerChip(`${capFactor(s.row,s.rowSign)} × ${capFactor(s.col,s.colSign)} = ${product(s.row,s.col,s.rowSign,s.colSign)}`,true)]),status);
 status.textContent=message;
 preset.onchange=()=>{s=taskAsPreset(C.presets[preset.value]);evt('preset',preset.value);said='explore';render();};
 row.onchange=()=>select(+row.value,s.col);col.onchange=()=>select(s.row,+col.value);
 rowSign.onchange=()=>{s.rowSign=+rowSign.value;evt('rowSign',s.rowSign);select(s.row,s.col);};colSign.onchange=()=>{s.colSign=+colSign.value;evt('colSign',s.colSign);select(s.row,s.col);};
 }
 render();}
function challenge(panel,api,stage){let idx=0,correct=0,bad=false,message='Place the signed product on the glowing cell.';let timer=null;api.onCleanup(()=>{if(timer)clearTimeout(timer);});
 function finish(){show(stage,{row:3,col:4,rowSign:-1,colSign:1},{phase:4,reveal:true,say:'win',caption:'Four sign patterns proved'});panel.innerHTML='';panel.append(H('div',{class:'f314-win',text:'Four proofs complete! You have shown the product and sign in all four sign patterns.'}));evt('proof',{rounds:correct,complete:true});}
 function next(){if(idx>=C.challenge.length){finish();return;}let task=C.challenge[idx],chosen=null;
  function renderScene(){show(stage,task,{phase:4,challenge:true,selectedProduct:chosen,options:task.options,say:chosen===null?'ready':'right',caption:`Proof ${idx+1} of ${C.challenge.length}`,onPlace:place,onRemove:remove});}
  function place(v){if(chosen!==null)return false;const want=product(task.row,task.col,task.rowSign,task.colSign);evt('place',{round:idx,row:task.row,col:task.col,card:v});if(v!==want){message=wrongMessage(v,task);bad=true;api.check(false,message,{round:idx});update();return false;}
   chosen=v;bad=false;message='Correct placement! You can drag the card to Remove or confirm your proof.';renderScene();update();return true;}
  function remove(){if(chosen===null)return false;chosen=null;message='Card removed. Try another placement.';evt('remove',{round:idx});renderScene();update();return true;}
  function confirm(){if(chosen===null){bad=true;message='First place a product card on the selected cell.';update();return false;}
   const want=product(task.row,task.col,task.rowSign,task.colSign);if(chosen!==want){bad=true;message='Check the product sign and try again.';update();return false;}
   correct++;bad=false;message=`Proved: ${capFactor(task.row,task.rowSign)} × ${capFactor(task.col,task.colSign)} = ${want}.`;api.check(true,message,{round:idx});evt('proof',{round:idx,value:chosen});
   show(stage,task,{phase:4,reveal:true,say:'right',caption:'Product verified'});panel.innerHTML='';panel.append(N.answerChip(message,true));timer=setTimeout(()=>{idx++;next();},850);return true;}
  function update(){panel.innerHTML='';panel.append(H('p',{class:'f314-info',text:`Proof ${idx+1} of ${C.challenge.length} · Row ${capFactor(task.row,task.rowSign)} · Column ${capFactor(task.col,task.colSign)}. Drop a signed product card on their intersection.`}),
   H('div',{class:'f314-toolbar'},[...task.options.map(v=>btn(`Place ${v}`,()=>place(v))),btn('Remove card',remove),btn('Check proof',confirm,true),btn('Hint',()=>{const hint=`${task.row} groups of ${task.col} make ${task.row*task.col}. ${signExplain(task.rowSign,task.colSign)}`;evt('hint',hint);api.hint(hint);message=hint;bad=false;update();}),btn('Reset proof',()=>{chosen=null;evt('reset',idx);message='Start again. Follow the row!';bad=false;renderScene();update();})]));
   panel.append(H('p',{class:'f314-status'+(bad?' bad':''),role:'status',text:message}));if(chosen!==null)panel.append(N.answerChip('Product placed · ready to check',true));}
  renderScene();update();}
 next();}
const def={id:ID,title:'Multiplication-Table Explorer',config:C,steps:STEPS,
 alt:'Twelve by twelve glass multiplication table with a highlighted row-column crosshair, sub-array and product chip. Negative and positive factor signs are shown separately.',
 staticAlt:'The selected row multiplied by the selected column gives the magnitude of a product. Equal signs give positive; unequal signs give negative.',
 render(i,stage){const s=C.presets[C.preset];show(stage,s,{phase:i,reveal:i===4,say:STEPS[i].say,caption:STEPS[i].name,animate:i>=2});},
 exploreIntro:'Pick a row and column. Count the array and check the signs.',explore(panel,stage){controls(panel,stage,C.presets[C.preset]);},challenge,onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['multiplication table','positive and negative products','sign patterns','arrays'],deps:['F0-02','F0-03','F0-04','F0-08','F3-01']});
N.bankMount({id:ID,num:'14',title:'Multiplication-Table Explorer · Premium Review',def,linked:['F3-01','F3-02','F3-13'],years:'Year 7 · Signed multiplication and division',spec:{
 purpose:'Use a 12×12 multiplication table as a visual array: identify row/column crossing, count an exact sub-array and reason about multiplication sign.',
 params:'Rows and columns 1–12 independently signed; selected cell, sign pairing and four named presets.',
 presets:'Y7-012: positive × negative, negative × positive, negative × negative and positive × positive.',
 steps:'Select row → select column → crosshair glows → rectangular sub-array fills → signed product chip.',
 interactions:'Drag row-column handle; use one roving keyboard gridcell, arrow keys, click and row/column steppers; drag signed product cards onto required target cell.',
 traps:'Adding factors, sign reversal, ignoring negative signs or confusing a grid intersection with a sum.',
 gcse:'The same signed multiplication structure underpins algebraic products and index rules.'}});
// F3-local pointer-capture recovery. The approved F0 source remains unchanged.
(function recoverFastDrag(){const host=document.getElementById(ID);let pointer=null;
 window.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-drag="1"]');if(hit&&host.contains(hit))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;
 d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);
 window.addEventListener('blur',()=>{pointer=null;});})();
const card=document.getElementById(ID),dev=H('details',{class:'nv-dev'});dev.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>dev.append(x));card.append(dev);
function alt(){card.querySelectorAll('img').forEach(im=>{if(!im.hasAttribute('alt'))im.setAttribute('alt','NOVA maths helper');});}alt();new MutationObserver(alt).observe(card,{subtree:true,childList:true});
})();
