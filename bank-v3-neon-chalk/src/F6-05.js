/* NOVA F6-05 · Recipe Scaler · F0 core untouched. */
const F605_CONFIG={
 id:'F6-05',startMode:'watch',preset:'Y7-060',parameters:{minServings:2,maxServings:10,step:1,positive:true,exactUnits:true},
 presets:{
  'Y7-060':{label:'Y7-060 · Pancake batch (4 → 6)',title:'PANCAKE KITCHEN',context:'Scale a pancake recipe from four servings to six.',base:4,target:6,ingredients:[{name:'FLOUR',base:200,unit:'g',icon:'flour'},{name:'MILK',base:320,unit:'ml',icon:'milk'},{name:'EGGS',base:4,unit:'eggs',icon:'egg'},{name:'BERRIES',base:120,unit:'g',icon:'berry'}]},
  'Y7-060-double':{label:'Y7-060 · Fruit bowl (4 → 8)',title:'FRUIT BOWL',context:'Double a fruit bowl recipe.',base:4,target:8,ingredients:[{name:'STRAWBERRIES',base:200,unit:'g',icon:'berry'},{name:'YOGURT',base:240,unit:'g',icon:'milk'},{name:'OATS',base:80,unit:'g',icon:'flour'},{name:'BANANAS',base:4,unit:'bananas',icon:'egg'}]},
  'Y7-060-half':{label:'Y7-060 · Oat bars (6 → 3)',title:'OAT BAR WORKSHOP',context:'Halve the quantities in a six-serving batch.',base:6,target:3,ingredients:[{name:'OATS',base:240,unit:'g',icon:'flour'},{name:'MILK',base:300,unit:'ml',icon:'milk'},{name:'BANANAS',base:6,unit:'bananas',icon:'egg'},{name:'HONEY',base:30,unit:'g',icon:'berry'}]},
  'Y7-060-triple':{label:'Y7-060 · Smoothies (3 → 9)',title:'SMOOTHIE LAB',context:'Triple a three-serving smoothie recipe.',base:3,target:9,ingredients:[{name:'MANGO',base:90,unit:'g',icon:'berry'},{name:'MILK',base:150,unit:'ml',icon:'milk'},{name:'YOGURT',base:180,unit:'g',icon:'flour'},{name:'BANANAS',base:3,unit:'bananas',icon:'egg'}]}
 },
 events:{types:['value','step','correct','hintUsed'],names:['preset','servings','amount','removed','check','reset','hint']}
};window.F605_CONFIG=F605_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,M=N.motion,C=F605_CONFIG,ID=C.id;
// Recover from very fast pointer-up after release outside SVG. No F0 shared changes.
window.addEventListener('pointerup',event=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f605-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(event);});},true);
const STEPS=[
 {name:'Read the original recipe',caption:'How many people does this serve?',pose:'explain',narration:'The recipe is written for a starting number of servings. Every ingredient belongs to that same batch.'},
 {name:'Change the serving count',caption:'The number of servings changes.',pose:'point',narration:'The servings change, but the recipe needs to keep the same flavour balance.'},
 {name:'Find the scale factor',caption:'Find the scale factor first.',pose:'idea',narration:'Divide the new number of servings by the original servings. The result is the multiplier for every ingredient.'},
 {name:'Scale the first ingredient',caption:'Multiply, do not add.',pose:'count',narration:'Multiply the first ingredient by the scale factor. We use that same multiplier throughout the recipe.'},
 {name:'Scale every ingredient',caption:'Every ingredient uses one factor.',pose:'point',narration:'Now scale the milk, fruit, and every remaining ingredient the same way. Check the units for each row.'},
 {name:'Prove the recipe is proportional',caption:'Same amount per serving.',pose:'celebrate',narration:'Dividing any scaled amount by the new servings gives the same amount per person as before. That proves the recipe stayed proportional.'}
];
function outValue(v){return Number.isInteger(v)?String(v):String(Math.round(v*10000)/10000);}
function scaled(p,t,i){return p.ingredients[i].base*t/p.base;}
function factor(p,t){return t/p.base;}
function fmtFactor(p,t){const k=factor(p,t);return Number.isInteger(k)?String(k):outValue(k);}
function measure(v,unit){return outValue(v)+(unit==='eggs'||unit==='bananas'?' '+unit:' '+unit);}
function emit(k,v){N.events.emit('value',{engine:ID,key:k,value:v});}
function chalk(parent,x,y,txt,role='given',size=25){return N.chalkText(parent,x,y,String(txt),{role,size});}
function card(title,value,description,role){return N.neonCard([H('p',{class:'f605-card-title',text:title}),H('p',{class:'f605-card-value',text:value}),H('p',{class:'f605-card-description',text:description})],{role});}
function geom(m){return m?{w:480,h:1220,svgHead:55,controlY:138,trackY:218,factorY:298,rowYs:[405,525,645,765],rowHeight:100,chipYs:[932,1020],chipXs:[56,188,320],chipW:110,chipH:67,tray:{x:292,y:1118,w:150,h:65},sourceX:132,targetX:356,slotX:282,slotW:150,unitX:200}:
{w:1120,h:1045,svgHead:53,controlY:143,trackY:220,factorY:295,rowYs:[404,530,656,782],rowHeight:110,chipYs:[942],chipXs:[95,254,413,572,731,890],chipW:140,chipH:70,tray:{x:895,y:941,w:180,h:70},sourceX:300,targetX:914,slotX:784,slotW:256,unitX:495};}
function icon(svg,type,x,y,role){const g=E('g',{class:'f605-ingredient-icon','aria-hidden':'true'},svg);
 if(type==='egg'){N.neonPath(g,`M${x} ${y-19} C${x-15} ${y-18} ${x-22} ${y-4} ${x-20} ${y+7} C${x-18} ${y+26} ${x+18} ${y+26} ${x+20} ${y+7} C${x+22} ${y-4} ${x+15} ${y-18} ${x} ${y-19} Z`,{role,width:3});}
 else if(type==='milk'){N.neonBox(g,x-15,y-22,30,45,{role,r:8});N.neonLine(g,x-9,y-29,x+9,y-29,{role,width:3});N.neonLine(g,x-9,y-22,x-9,y-29,{role,width:3});N.neonLine(g,x+9,y-22,x+9,y-29,{role,width:3});}
 else if(type==='berry'){N.neonRing(g,x-9,y+3,{role,r:12,pulse:false});N.neonRing(g,x+9,y+3,{role,r:12,pulse:false});N.neonRing(g,x,y-12,{role,r:11,pulse:false});N.neonPath(g,`M${x} ${y-18}Q${x+8} ${y-32} ${x+17} ${y-23}`,{role,width:2});}
 else{N.neonPath(g,`M${x-19} ${y-18} Q${x} ${y-28} ${x+19} ${y-18} L${x+15} ${y+22} L${x-15} ${y+22} Z`,{role,width:2.8});N.neonLine(g,x-12,y+6,x+13,y+6,{role,width:2});}
 return g;}
function svgButton(svg,x,y,w,h,label,role){const g=E('g',{},svg);N.neonBox(g,x,y,w,h,{role,r:13});chalk(g,x+w/2,y+h/2+9,label,role,23);return g;}
function coord(svg,x,y){const pt=svg.createSVGPoint();pt.x=x;pt.y=y;const s=pt.matrixTransform(svg.getScreenCTM());return {x:s.x,y:s.y};}
function scene(stage,p,o={}){
 const mobile=innerWidth<=760,G=geom(mobile),mode=o.mode||'watch',step=o.step??5,t=o.target??p.target,placements=o.placements||{},solved=o.solved||{},isExplore=mode==='explore',isChallenge=mode==='challenge';
 if(!isExplore)G.h=mobile?959:982;
 stage.innerHTML='';N.cap(stage,ID,p.title,mode==='challenge'?'YOUR TURN':mode==='explore'?'SCALE THE INGREDIENTS':'DIRECT PROPORTION');
 const layout=H('div',{class:'f605-layout'}),art=H('div',{class:'f605-art'}),aside=H('aside',{class:'f605-cards','aria-label':'Scale factor evidence'});
 const svg=N.svg.root(G.w,G.h,'Recipe scaling studio with four neon ingredient rows, a servings slider, proportional factor and draggable ingredient amounts.');svg.classList.add('f605-svg');svg.dataset.mode=mode;svg.dataset.preset=o.id||C.preset;svg.dataset.servings=String(t);svg.dataset.stage=String(step);
 const firstY=G.svgHead;if(mobile){chalk(svg,G.w/2,firstY-7,'THE SAME RECIPE','given',27);chalk(svg,G.w/2,firstY+28,'MORE OR FEWER SERVINGS','given',22);}else chalk(svg,G.w/2,firstY,'THE SAME RECIPE · MORE OR FEWER SERVINGS','given',39);
 svgButton(svg,mobile?22:88,G.controlY-34,mobile?170:238,80,'START   '+p.base,'given');
 svgButton(svg,mobile?292:790,G.controlY-34,mobile?166:238,80,'NEW   '+(step>=1||isExplore||isChallenge?t:'?'),'result');
 chalk(svg,G.w/2,G.controlY+12,'→','focus',mobile?37:47);
 const min=C.parameters.minServings,max=C.parameters.maxServings;const trackStart=mobile?68:190,trackEnd=mobile?412:905,trackY=G.trackY,dx=(trackEnd-trackStart)/(max-min),knobX=trackStart+(t-min)*dx;
 chalk(svg,G.w/2,G.trackY-27,'SERVINGS','given',mobile?20:26);
 N.neonLine(svg,trackStart,trackY,trackEnd,trackY,{role:'focus',width:3.5});
 const handle=E('g',{class:isExplore?'f605-drag f605-servings-knob':'f605-servings-knob',tabindex:isExplore?0:-1,role:isExplore?'slider':'img','aria-label':'Servings control: '+t+' servings. Drag or use arrow keys to adjust.', 'aria-valuemin':min,'aria-valuemax':max,'aria-valuenow':t,'data-servings-handle':String(t)},svg);
 N.neonRing(handle,knobX,trackY,{role:'result',r:19,pulse:false});N.neonRing(handle,knobX,trackY,{role:'focus',r:8,pulse:false});
 if(isExplore){handle.addEventListener('keydown',e=>{if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(e.key)){e.preventDefault();o.onTarget(Math.max(min,Math.min(max,t+(e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1))));}});
 N.ui.svgDrag(svg,handle,{box:{x:knobX-25,y:trackY-25,w:50,h:50},zones:()=>Array.from({length:max-min+1},(_,i)=>({id:'s'+(min+i),kind:'drop',x:trackStart+i*dx-dx*.55,y:trackY-65,w:dx*1.1,h:130})),onDrop:id=>{if(/^s\d+$/.test(id)){Promise.resolve().then(()=>o.onTarget(Number(id.slice(1))));return true;}return false;}});}
 chalk(svg,G.w/2,G.factorY,step>=2||isExplore||isChallenge?'SCALE FACTOR   × '+fmtFactor(p,t):'FIND THE MULTIPLIER','focus',mobile?29:43);
 chalk(svg,G.w/2,G.factorY+39,step>=2||isExplore||isChallenge?t+' ÷ '+p.base+' = '+fmtFactor(p,t):'new servings ÷ original servings','op',mobile?22:29);
 const tileW=G.slotW;
 p.ingredients.forEach((a,i)=>{
 const yy=G.rowYs[i],role=i%2?'op':'given',isShown=(isExplore&&placements[i]!=null)||(!isExplore&&!isChallenge&&step>=4)||(!isExplore&&!isChallenge&&step===3&&i===0)||(isChallenge&&solved[i]);
 const rowX=mobile?18:75,rowW=mobile?444:970;
 N.neonBox(svg,rowX,yy-56,rowW,G.rowHeight,{role:i%2?'op':'given',r:15});
 icon(svg,a.icon,rowX+(mobile?35:53),yy,role);
 chalk(svg,rowX+(mobile?124:140),yy-18,a.name,role,mobile?20:27);
 chalk(svg,G.sourceX,yy+19,measure(a.base,a.unit),'given',mobile?22:29);
 chalk(svg,mobile?239:625,yy+11,'× '+(step>=2||isExplore||isChallenge?fmtFactor(p,t):'?'),'focus',mobile?23:34);
 const targetVal=isShown?measure(isExplore?placements[i]:scaled(p,t,i),a.unit):'? '+a.unit;
 N.neonBox(svg,G.slotX,yy-39,tileW,80,{role:isShown?'result':'unknown',r:11});
 const numberLabel=chalk(svg,G.slotX+tileW/2,yy+14,targetVal,isShown?'result':'unknown',mobile?25:34);
 if(!isExplore&&!isChallenge&&step>=3&&(step>=4||i===0)&&!N.reducedMotion()){
   const from=a.base,to=scaled(p,t,i);numberLabel.textContent=measure(from,a.unit);
   M.delay(i*145,()=>M.tween(710,q=>{if(numberLabel.isConnected)numberLabel.textContent=measure(Math.round(from+(to-from)*q),a.unit);},M.ease.out));
 }
 if(isExplore&&placements[i]!=null){const placed=E('g',{class:'f605-drag','data-placed':String(i),role:'button',tabindex:0,'aria-label':'Placed '+a.name+' amount. Press Delete to remove.'},svg);
 N.neonRing(placed,G.slotX+tileW-17,yy-22,{role:'result',r:13,pulse:false});
 placed.addEventListener('keydown',e=>{if(['Delete','Backspace','Escape'].includes(e.key)){e.preventDefault();o.onRemove(i);}});
 N.ui.svgDrag(svg,placed,{box:{x:G.slotX+tileW-37,y:yy-42,w:40,h:43},zones:()=>[{id:'return',kind:'remove',...G.tray}],onRemove:()=>o.onRemove(i),onDrop:()=>false});}
 });
 if(isExplore){const pool=o.pool||[];
 pool.forEach((item,j)=>{
 const row=Math.floor(j/G.chipXs.length),col=j%G.chipXs.length,x=G.chipXs[col],y=G.chipYs[row];
 const token=E('g',{class:'f605-drag','data-chip':item.label,role:'button',tabindex:0,'aria-label':'Amount '+item.label+'. Press 1 to 4 to place against ingredient row.'},svg);
 N.neonBox(token,x,y,G.chipW,G.chipH,{role:item.correct?'result':'unknown',r:10});
 chalk(token,x+G.chipW/2,y+43,item.label,item.correct?'result':'unknown',mobile?21:27);
 token.addEventListener('keydown',e=>{if(/^[1-4]$/.test(e.key)){e.preventDefault();o.onPlace(Number(e.key)-1,item.value);}});
 N.ui.svgDrag(svg,token,{box:{x,y,w:G.chipW,h:G.chipH},zones:()=>[...G.rowYs.map((yy,i)=>({id:'r'+i,kind:'drop',x:G.slotX,y:yy-41,w:G.slotW,h:86})),{id:'return',kind:'remove',...G.tray}],onDrop:id=>{if(/^r[0-3]$/.test(id)){Promise.resolve().then(()=>o.onPlace(Number(id.slice(1)),item.value));return true;}return false;},onRemove:()=>{} });
 });
 N.neonBox(svg,G.tray.x,G.tray.y,G.tray.w,G.tray.h,{role:'error',r:13});chalk(svg,G.tray.x+G.tray.w/2,G.tray.y+42,'RETURN','error',mobile?22:26);
 chalk(svg,mobile?240:520,mobile?914:924,'DRAG AMOUNTS TO THE RECIPE ROWS','focus',mobile?17:25);
 }
 if(mode==='watch'||mode==='guided'){
 chalk(svg,G.w/2,mobile?908:943,step>=5?'SAME QUANTITY PER SERVING  ·  RECIPE PROVED':'ALL FOUR ROWS USE ONE MULTIPLIER','result',mobile?19:28);
 }
 art.append(svg);
 const visibleFactor=step>=2||isExplore||isChallenge;
 aside.append(card('STARTING BATCH',p.base+' servings','All original ingredient amounts refer to one batch.','given'),
  card('NEW SERVINGS',(step>=1||isExplore||isChallenge)?t+' servings':'? servings','The whole recipe changes together.','op'),
  card('SCALE FACTOR',visibleFactor?'× '+fmtFactor(p,t):'× ?',visibleFactor?t+' ÷ '+p.base:'New servings divided by original.','focus'),
  card('PER-SERVING CHECK',step>=5&&!isExplore&&!isChallenge?outValue(p.ingredients[0].base/p.base)+' '+p.ingredients[0].unit:'?', 'Equal per-person quantities prove proportion.','result'));
 layout.append(art,aside);stage.append(layout);N.scene.helperStrip(stage,o.pose||'explain',o.caption||'Find the scale factor first.');return svg;
}
function teach(i,stage){const p=C.presets[C.preset],t=p.target,k=fmtFactor(p,t);
 const speak=[
 'This '+p.title.toLowerCase()+' recipe serves '+p.base+' people. We will keep every ingredient in balance.',
 'Now plan for '+t+' people. All the ingredients must change by the same amount per person.',
 'Find the scale factor first. Divide '+t+' by '+p.base+'. The factor is '+k+'.',
 'The first ingredient changes from '+p.ingredients[0].base+' '+p.ingredients[0].unit+' to '+scaled(p,t,0)+' '+p.ingredients[0].unit+'. Multiply by the scale factor.',
 'Apply exactly the same factor to every other row. We do not add the number of new servings to the ingredients.',
 'Check per-serving quantities: '+p.ingredients[0].base+' divided by '+p.base+' equals '+scaled(p,t,0)+' divided by '+t+'. Both work out to the same amount per person.'
 ];STEPS[i].narration=speak[i];emit('stage',{index:i,preset:C.preset});scene(stage,p,{mode:'watch',step:i,pose:STEPS[i].pose,caption:STEPS[i].caption});
}
function btn(t,cb,cls='nova-btn'){return H('button',{text:t,class:cls,onclick:cb});}
function candidatePool(p,t){const expected=p.ingredients.map((_,i)=>scaled(p,t,i)),values=[...new Set([...expected,Math.round(expected[0]+(t-p.base)*10),Math.max(1,Math.round(expected[1]*p.base/t))])];
 return values.slice(0,5).map(v=>({label:outValue(v),value:v,correct:expected.includes(v)}));}
function explore(panel,stage){let id=C.preset,t=C.presets[id].target,placements={},verified={},message='Drag the servings marker. Then drag scaled amounts onto the ingredient rows.';
 const presets=H('select',{'aria-label':'Recipe scenario'});Object.entries(C.presets).forEach(([k,p])=>presets.append(H('option',{value:k,text:p.label})));presets.value=id;
 const servings=H('input',{type:'range',min:2,max:10,step:1,value:t,'aria-label':'New number of servings'}),servingsRead=H('strong',{class:'f605-range-read',text:t+' servings'});
 const ctl=H('div',{class:'f605-controls'}),feedback=H('p',{class:'f605-feedback','aria-live':'polite'}),acts=H('div',{class:'f605-controls'});
 ctl.append(H('label',{class:'f605-field'},['Recipe',presets]),H('label',{class:'f605-field'},['Servings (keyboard alternative)',servings]),servingsRead);
 acts.append(btn('Check recipe',()=>check(),'nova-btn primary'),btn('Hint',()=>hint()),btn('Return all',()=>resetPlaced()),btn('Reset',()=>reset()));panel.append(ctl,acts,H('p',{class:'f605-instructions',text:'Drag the neon servings ring or adjust the slider. Drag the amount tiles onto the correct rows (keyboard: focus a tile and press 1–4). Regrab a placed ring and drop it in the red return tray, or press Delete.'}),feedback);
 function p(){return C.presets[id];}function draw(pose='point',caption='Every row uses one factor.'){servings.value=t;servingsRead.textContent=t+' servings';scene(stage,p(),{mode:'explore',id,target:t,placements,verified,pool:candidatePool(p(),t),onTarget,onPlace,onRemove,pose,caption});feedback.textContent=message;}
 function onTarget(v){t=v;placements={};verified={};message='New target: '+t+' servings. All ingredient amounts must change using × '+fmtFactor(p(),t)+'.';emit('servings',{preset:id,servings:t});draw('point','Change all ingredient quantities.');}
 function onPlace(i,v){placements[i]=v;delete verified[i];message='Placed '+v+' on '+p().ingredients[i].name+'. Now check that the scale factor was applied correctly.';emit('amount',{row:i,value:v,target:t});draw('count','Same scale factor for every row.');}
 function onRemove(i){if(i==null){placements={};}else delete placements[i];message='Amount returned. Choose the correct scaled quantity.';emit('removed',i);draw('not-yet','Try a different amount.');}
 function hint(){const q=p(),missing=q.ingredients.findIndex((_,i)=>placements[i]==null);message=missing<0?'Check each amount against its original quantity multiplied by '+fmtFactor(q,t)+'.':'Calculate '+q.ingredients[missing].name+': '+q.ingredients[missing].base+' × '+fmtFactor(q,t)+', then find the matching tile.';emit('hint',{preset:id,row:missing});N.events.emit('hintUsed',{engine:ID,preset:id});draw('idea','Find the scale factor first.');}
 function check(){let good=true,correct=0;const wrong=[];p().ingredients.forEach((a,i)=>{const expect=scaled(p(),t,i),got=placements[i];if(got!=null&&Math.abs(got-expect)<1e-9){correct++;verified[i]=true;}else{good=false;wrong.push(a.name);}});
 message=good?'Correct! Every ingredient uses the same scale factor. Per-serving quantities stay constant.':correct+' of 4 amounts correct. Recheck '+wrong.join(', ')+'. Multiply each original amount by '+fmtFactor(p(),t)+'.';emit('check',{correct:good,correctRows:correct,servings:t});N.events.emit('correct',{engine:ID,correct:good,mode:'explore'});draw(good?'celebrate':'not-yet',good?'Brilliant scaling!':'Check the same factor.');feedback.classList.toggle('good',good);feedback.classList.toggle('bad',!good);if(good){const svg=stage.querySelector('svg');if(svg)M.flash(svg,geom(innerWidth<=760).w/2,geom(innerWidth<=760).factorY,'result',58);}}
 function resetPlaced(){placements={};verified={};message='All tiles returned; choose amounts for the current servings.';draw('explain','Choose the scaled quantities.');}
 function reset(){t=p().target;resetPlaced();emit('reset',id);}
 presets.onchange=()=>{id=presets.value;C.preset=id;t=p().target;placements={};verified={};message=p().context;emit('preset',id);draw('explain','Find the new serving count.');};
 servings.oninput=()=>onTarget(Number(servings.value));
 C._explore={get:()=>({id,target:t,placements:{...placements},message}),setPreset:k=>{presets.value=k;presets.onchange();},setTarget:onTarget,place:onPlace,remove:onRemove,check,hint,reset};draw();
}
function challenge(panel,api,stage){let ix=0,done=0,ok=false,attempts=0;const ids=Object.keys(C.presets);
 const question=H('p',{class:'f605-question'}),fields=H('div',{class:'f605-fields'}),feedback=H('p',{class:'f605-feedback','aria-live':'polite'}),progress=H('p',{class:'f605-progress'}),actions=H('div',{class:'f605-controls'});
 const inp=[];for(let i=0;i<4;i++){const item=H('input',{type:'text',inputmode:'decimal',placeholder:'Amount','aria-label':'Scaled amount for ingredient '+(i+1)}),unit=H('span',{class:'f605-unit'}),label=H('label',{class:'f605-answer-field'},[H('span',{text:'INGREDIENT '+(i+1)}),item,unit]);fields.append(label);inp.push({item,unit,label});}
 const checkBtn=btn('Check quantities',verify,'nova-btn primary'),hintBtn=btn('Hint',hint),nextBtn=btn('Next recipe',advance);nextBtn.disabled=true;actions.append(checkBtn,hintBtn,nextBtn);panel.append(question,fields,actions,feedback,progress);
 function p(){return C.presets[ids[ix]];}function answers(){return inp.map(x=>Number(x.item.value.trim()));}
 function draw(){const q=p();question.textContent='Recipe '+(ix+1)+' / '+ids.length+' · '+q.context+' Find all four scaled quantities.';progress.textContent='Recipes solved: '+done+' / '+ids.length;inp.forEach((v,i)=>{v.label.querySelector('span').textContent=q.ingredients[i].name;v.unit.textContent=q.ingredients[i].unit;});scene(stage,q,{mode:'challenge',id:ids[ix],target:q.target,solved:ok?{0:true,1:true,2:true,3:true}:{},step:ok?5:2,pose:ok?'celebrate':'think',caption:ok?'Recipe proportions preserved!':'Multiply every ingredient by one factor.'});}
 function verify(){if(ok)return;const q=p(),bad=[],values=[];inp.forEach(({item},i)=>{const txt=item.value.trim().replace(',','.');const val=txt!==''&&Number.isFinite(Number(txt))?Number(txt):null;values.push(val);if(val==null||Math.abs(val-scaled(q,q.target,i))>1e-9)bad.push(i);});attempts++;const good=bad.length===0;
 const first=bad[0],a=q.ingredients[first];const v=values[first];let msg;
 if(good)msg='Correct! All four amounts were multiplied by '+fmtFactor(q,q.target)+'. The quantity per person stays unchanged.';
 else if(v==null)msg='Enter a number for '+a.name+'. The unit is shown beside the field.';
 else if(Math.abs(v-a.base)<1e-9)msg=a.name+' is unchanged. The servings changed, so multiply the original amount by the scale factor.';
 else if(Math.abs(v-(a.base+(q.target-q.base)))<1e-9)msg='You added servings to '+a.name+'. This is a MULTIPLICATIVE relationship, not addition.';
 else if(Math.abs(v-(a.base*q.base/q.target))<1e-9)msg='That used the reciprocal scale factor. Use NEW servings divided by ORIGINAL servings.';
 else msg='Recheck '+a.name+': use the same factor '+q.target+' ÷ '+q.base+' for every ingredient, and keep the given unit.';
 api.check(good,msg,{preset:ids[ix],values,expected:q.ingredients.map((_,i)=>scaled(q,q.target,i))});emit('check',{preset:ids[ix],correct:good,answers:values});feedback.textContent=msg;feedback.classList.toggle('good',good);feedback.classList.toggle('bad',!good);if(good){ok=true;done++;checkBtn.disabled=true;nextBtn.disabled=false;draw();}}
 function hint(){const q=p(),msg='Calculate the scale factor: '+q.target+' ÷ '+q.base+'. Multiply EACH original ingredient by that factor. Units do not change.';api.hint(msg);emit('hint',ids[ix]);N.events.emit('hintUsed',{engine:ID,preset:ids[ix]});feedback.textContent=msg;}
 function advance(){if(!ok)return;if(ix===ids.length-1){question.textContent='All four recipes scaled successfully.';fields.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'FOUR RECIPES COMPLETED');N.scene.helperStrip(stage,'celebrate','Well done! The recipe still tastes balanced.');feedback.textContent='You have shown that ratios stay constant when servings change.';return;}
 ix++;ok=false;inp.forEach(x=>x.item.value='');feedback.textContent='';checkBtn.disabled=false;nextBtn.disabled=true;draw();}
 inp.forEach(x=>x.item.addEventListener('keydown',e=>{if(e.key==='Enter')verify();}));C._challenge={get:()=>({index:ix,done,ok,attempts,feedback:feedback.textContent}),setAnswers:vals=>vals.forEach((v,i)=>{inp[i].item.value=v;}),check:verify,hint,next:advance};draw();
}
const DEF={id:ID,title:'Recipe Scaler · Direct Proportion',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'NOVA neon-glass recipe studio with starting servings, draggable servings marker, highlighted multiplier and four aligned ingredient rows; Explore lets pupils drag scaled values onto each row.',
 staticAlt:'For any recipe, scaled ingredient amount = original amount × (new servings ÷ original servings). Example: four-servings recipe with 200 g flour becomes 300 g for six servings.',
 spec:{purpose:'Teach direct proportion through a practical recipe: changing a batch size without changing amount per person.',params:'Starting servings, target servings, four named ingredients and units, integer quantities, named lesson presets and 2–10-servings explore domain.',presets:'Year 7 lesson Y7-060: pancakes 4→6, fruit bowl 4→8, oat bars 6→3 and smoothies 3→9.',steps:'Read starting recipe → change servings → find factor → scale first ingredient → scale all rows → confirm same amount per serving.',interactions:'SVG servings slider with drag-to-snap and arrow keys; HTML input range alternative; SVG draggable ingredient amount tiles; red remove tray; re-grab; keyboard 1–4/Delete; interactive checks and hints.',traps:'Adding the serving difference rather than multiplying, mixing different factors between ingredients, inverting the multiplier, not scaling every ingredient or dropping units.',gcse:'Extend to rational or fractional scale factors, unit conversion, batch mass and cost constraints.'}};
N.bankMount({id:ID,num:'F6·05',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Year 7; Year 8 extension; GCSE scaling',linked:['F0-02','F0-04','F0-05','F0-08','F2-01','F6-01','F6-02','F6-03','F6-04']});
})();
