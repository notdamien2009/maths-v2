/* F11-01 · Protractor · F0/F1 NOVA shared core; additive component, no core overrides. */
const F111_CONFIG=Object.freeze({id:'F11-01',family:'F11',startMode:'watch',defaultPreset:'Y7-040',presets:{
 'Y7-040':{label:'Y7-040 · Measure and draw',angle:58,base:'right',fact:'Measure from the zero on the baseline.',why:'Place the centre on the vertex; line up zero with the starting ray.'},
 'Y7-041':{label:'Y7-041 · Lines and angles',angle:125,base:'right',fact:'Obtuse angles are greater than 90° and less than 180°.',why:'This is 125°, not its complementary reading of 55°.'},
 'Y7-067':{label:'Y7-067 · Pie-chart sectors',angle:72,base:'right',fact:'20% of a whole turn is 72°.',why:'One complete turn is 360°: 0.2 × 360° = 72°.'},
 'EXT-LEFT':{label:'Extension · Left-starting angle',angle:135,base:'left',fact:'Read the scale that begins at the LEFT-hand zero.',why:'The starting ray points left. The matching degree scale must start at 0° on the left.'},
 'EXT-REFLEX':{label:'Extension · Reflex angle',angle:120,base:'right',reflex:true,fact:'The outside turn is 240°.',why:'A semicircular protractor gives the smaller 120°: 360° − 120° = 240°.'}
},events:{value:['preset','angle','base','snap','question','reason','reset'],types:['step','mode','correct','hintUsed']}});
window.F111_CONFIG=F111_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F111_CONFIG,ID=C.id;
if(N.premium?.enable)N.premium.enable();
const S={preset:C.defaultPreset,angle:58,base:'right',snap:1,wrong:0,task:0,challenge:null,answered:false};
const RAD=Math.PI/180, X=380,Y=445,R=248, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>String(Math.round(n*10)/10).replaceAll('-','−');
const pref=()=>C.presets[S.preset];
function emit(k,v){if(!C.events.value.includes(k))throw new Error('Undeclared F11 event '+k);N.events.emit('value',{engine:ID,key:k,value:v})}
function setPreset(id){if(!C.presets[id])id=C.defaultPreset;S.preset=id;S.angle=C.presets[id].angle;S.base=C.presets[id].base;S.wrong=0;S.answered=false;emit('preset',id)}
function ring(deg,r=R){const a=deg*RAD;return[X+Math.cos(a)*r,Y-Math.sin(a)*r]}
function polar(deg,r=R){return ring(S.base==='right'?deg:180-deg,r)}
function arcPath(r,start,end){let da=clamp(end-start,0,359.999);const sp=polar(start,r),ep=polar(end,r);return 'M'+sp[0].toFixed(2)+' '+sp[1].toFixed(2)+' A'+r+' '+r+' 0 '+(da>180?'1':'0')+' '+(S.base==='right'?'0':'1')+' '+ep[0].toFixed(2)+' '+ep[1].toFixed(2)}
function pieSector(a){const p0=polar(0,134),p1=polar(a,134);return 'M'+X+' '+Y+' L'+p0.join(' ')+' '+arcPath(134,0,a).replace(/^M[^A]+/,'')+' L'+X+' '+Y+' Z'}
function chalk(svg,x,y,t,role='support',size=37,o={}){return N.chalkText(svg,x,y,String(t),{role,size,anchor:'middle',...o})}
function card(title,main,explain){return H('section',{class:'f111-card'},[H('div',{class:'f111-eyebrow',text:title}),H('div',{class:'f111-big',text:main}),H('div',{class:'f111-hint',text:explain})])}
const STEPS=[
 {name:'An angle is a turn',mood:'explain',narration:'Two rays meet at the vertex. The angle tells us how far one ray turns from the other.'},
 {name:'Find the centre',mood:'point-down',narration:'Put the little centre mark directly on the vertex. A protractor measures from that exact point.'},
 {name:'Align with zero',mood:'ruler',narration:'Line up the straight edge with the starting ray. Read the zero on the same side as that ray.'},
 {name:'Notice both scales',mood:'magnify',narration:'There are two scales. One starts at zero on the right; the other starts at zero on the left.'},
 {name:'Follow the correct scale',mood:'point-right',narration:'Start from zero on the right and count to where the second ray meets the scale.'},
 {name:'Check obtuse angles',mood:'think',narration:'For an obtuse angle, go past ninety degrees. Check the opening before choosing which scale to read.'},
 {name:'Draw a target angle',mood:'ruler',narration:'To draw an angle, align the baseline, mark the chosen degree, then draw a second ray through the mark.'},
 {name:'Pie chart sectors',mood:'count',narration:'A complete turn is three hundred and sixty degrees. Twenty percent makes a seventy-two degree sector.'},
 {name:'Reason and measure',mood:'cheer',narration:'Vertex, zero, correct scale and degree mark. Use these four checks every time you measure or draw.'}
];

/* F11 rotary-angle interaction: an additive F0/F1 pointer adapter, not a shared-core replacement.
   The shared F0 tile-drag intentionally eases by .38; that delay is inappropriate for a
   radial degree handle. This adapter previews geometry via one rAF / frame, retains the
   SVG and pointer capture, and commits state once on release. No whole-stage repaint on move. */
function f11RotaryDrag(svg,handle,o){
 let active=null;
 handle.style.touchAction='none';handle.style.cursor='grab';
 handle.addEventListener('pointerdown',e=>{
  if(active||N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;
  e.preventDefault();e.stopPropagation();
  const matrix=svg.getScreenCTM();if(!matrix)return;
  const inv=matrix.inverse(),id=e.pointerId,initial=o.start();
  const state={id,initial,angle:initial,raf:0,point:null,captured:false};active=state;
  function angleOf(ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const pt=p.matrixTransform(inv);return o.fromPoint(pt.x,pt.y)}
  function flush(){state.raf=0;if(active!==state)return;if(state.point!=null){const n=state.point;state.point=null;if(n!==state.angle){state.angle=n;o.preview(n);handle.setAttribute('aria-valuenow',String(n));}}}
  function move(ev){if(active!==state||ev.pointerId!==id)return;ev.preventDefault();state.point=angleOf(ev);if(!state.raf)state.raf=requestAnimationFrame(flush)}
  function clean(){if(active!==state)return;active=null;cancelAnimationFrame(state.raf);state.raf=0;
   handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);
   handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);
   window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);
   window.removeEventListener('scroll',cancel,true);
   if(N.ui._drag===guard)N.ui._drag=null;
   try{if(handle.hasPointerCapture(id))handle.releasePointerCapture(id)}catch(_){}
   handle.style.cursor='grab';}
  function up(ev){if(active!==state||ev.pointerId!==id)return;ev.preventDefault();
   state.point=angleOf(ev);flush();const angle=state.angle;clean();o.commit(angle);}
  function cancel(){if(active!==state)return;clean();o.cancel(state.initial);}
  function lost(){if(active===state)cancel()}
  function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
  const guard={cancel,up,get captured(){return state.captured},get moved(){return state.angle!==initial}};
  N.ui._drag=guard;
  handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);
  handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);
  window.addEventListener('blur',cancel);window.addEventListener('keydown',key);
  window.addEventListener('scroll',cancel,true);
  try{handle.setPointerCapture(id);state.captured=handle.hasPointerCapture(id)}catch(_){}
  if(!state.captured){window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
  handle.style.cursor='grabbing';
 });
}

function drawing(stage,o={}){
 const q={step:8,editable:false,challenge:false,correct:false,pose:'explain',caption:'Use the zero on the starting ray.',...o},angle=q.angle??S.angle,base=q.base??S.base;
 const saved=[S.angle,S.base];S.angle=angle;S.base=base;
 stage.replaceChildren();
 const p=pref(),isPie=S.preset==='Y7-067'||q.step===7,isReflex=p.reflex&&!q.challenge,showTool=q.step>=1||q.editable||q.challenge,showScales=q.step>=3||q.editable||q.challenge,showRay=q.step!==1;
 const theatre=H('section',{class:'f111-theatre','data-challenge':String(!!q.challenge),'data-correct':String(!!q.correct),'data-testid':'f111-stage'});
 theatre.append(H('div',{class:'f111-top'},[H('span',{text:q.challenge?'PROTRACTOR CHALLENGE · MEASURE / CONSTRUCT':'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'pill',text:'NEON + NOVA CHALK'})]));
 const layout=H('div',{class:'f111-layout'}),plane=H('div',{class:'f111-plane'});
 const svg=N.svg.root(760,555,'Semicircular protractor with two degree scales, centred over an angle. The highlighted ray can be moved in Explore mode.');
 svg.classList.add('nv-svg','f111-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f111-protractor';
 const outer=E('g',{'aria-hidden':'true'},svg);
 // Grounded geometric construction. All mathematical edges are drawn by the NOVA F0 helpers.
 if(isPie){N.neonPath(outer,pieSector(angle),{role:'op',width:3,fill:true});}
 // Left/right alignment is mathematical, not a visual recolour: starting ray follows the selected zero.
 const start=polar(0,283),end=polar(angle,285);
 if(showTool){
  const startP=polar(180,R),endP=polar(0,R);
  N.neonPath(outer,arcPath(R,0,180),{role:'given',width:9});
  N.neonLine(outer,startP[0],Y,endP[0],Y,{role:'given',width:8});
  // Translucent premium glass body, with the canonical neon outline above it.
  E('path',{d:'M '+(X-R)+' '+Y+' A '+R+' '+R+' 0 0 1 '+(X+R)+' '+Y+' Z',fill:'url(#nv-fill-given)',opacity:'.18','pointer-events':'none'},outer);
  for(let d=0;d<=180;d+=1){
   const major=d%10===0,mid=d%5===0;
   const a=ring(d,major?R-32:mid?R-23:R-13),b=ring(d,R-2);
   N.neonLine(outer,a[0],a[1],b[0],b[1],{role:major?'given':'support',width:major?2.9:mid?1.9:.8});
  }
  if(showScales){for(let d=0;d<=180;d+=30){
   const v=ring(d,R-66),u=ring(d,R-121);
   chalk(svg,v[0],v[1]+(d===0||d===180?-20:13),d,'given',d===0||d===180?39:36);
   chalk(svg,u[0],u[1]+(d===0||d===180?-20:12),180-d,'focus',d===0||d===180?37:34);
  }}
  // The two zeroes are deliberately different colours; only one agrees with the starting ray.
  N.neonRing(svg,X,Y,{r:11,role:'result',pulse:false});
  N.neonLine(outer,X-R,Y,X+R,Y,{role:'given',width:3});
 }
 N.neonLine(svg,X,Y,start[0],start[1],{role:'given',width:8});
 const movingRay=showRay?E('g',{'data-live-ray':'true'},svg):null;
 if(showRay){N.neonLine(movingRay,X,Y,end[0],end[1],{role:'op',width:9});N.neonRing(movingRay,end[0],end[1],{r:10,role:'unknown',pulse:false});}
 const wedge=clamp(angle,0,180);
 const wedgeGroup=showRay&&q.step>=4?N.neonPath(svg,arcPath(81,0,wedge),{role:'focus',width:7}):null;
 N.neonRing(svg,X,Y,{r:11,role:'result',pulse:false});
 const readAngle=isReflex?360-angle:angle;
 const canReveal=q.correct||(!q.challenge&&q.step>=4&&q.step!==6)||q.editable;
 const central=isReflex?'360° − '+angle+'° = '+readAngle+'°':canReveal?fmt(angle)+'°':'?';
 const centralText=chalk(svg,X,529,central,canReveal?'result':'unknown',43);
 if(q.step===2)chalk(svg,X,80,'START AT THE RIGHT ZERO','given',31);
 if(q.step===3)chalk(svg,X,80,'OUTER 0° →   ·   ← 0° INNER','focus',30);
 if(q.step===5)chalk(svg,X,80,'125° ≠ 55°','op',36);
 if(isPie)chalk(svg,X,85,'20% × 360° = 72°','result',33);
 if(q.editable||q.construction){
  const handle=E('g',{class:'f111-handle',role:'slider',tabindex:'0','aria-label':'Angle arm. Use the arrow keys to move in degrees.','aria-valuemin':0,'aria-valuemax':180,'aria-valuenow':angle,'data-testid':'f111-arm-handle'},svg);
  E('circle',{cx:end[0],cy:end[1],r:23,fill:'#61e6d522',stroke:'#73e8db','stroke-width':3},handle);
  E('circle',{cx:end[0],cy:end[1],r:32,class:'f111-focus'},handle);
  const update=(v,source)=>{const a=clamp(Math.round(v/S.snap)*S.snap,0,180);S.angle=a;emit('angle',{value:a,source});const slider=document.querySelector('#F11-01 [data-testid="f111-angle-slider"]');if(slider){slider.value=String(a);const read=slider.closest('label')?.querySelector('.f111-value');if(read)read.textContent=a+'°';}const challengeSlider=document.querySelector('#F11-01 [data-testid="f111-challenge-slider"]');if(challengeSlider){challengeSlider.value=String(a);const label=challengeSlider.closest('label')?.querySelector('output');if(label)label.textContent=a+'°';}drawing(stage,{...q,angle:a});const t=stage.querySelector('[data-testid="f111-arm-handle"]');if(source==='keyboard'&&t)t.focus();};
  handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const shift=e.shiftKey?5:1;update(e.key==='Home'?0:e.key==='End'?180:angle+(e.key==='ArrowRight'||e.key==='ArrowUp'?shift:-shift)*S.snap,'keyboard')});
  // Rotary degrees must follow the pointer immediately, including rapid movement.
  // Keep the same F0 SVG primitives and scene; only move the live ray/arc/handle.
  const initial=angle;
  const preview=n=>{
   const rotation=(S.base==='right'?-1:1)*(n-initial);
   movingRay.setAttribute('transform',`rotate(${rotation} ${X} ${Y})`);
   handle.setAttribute('transform',`rotate(${rotation} ${X} ${Y})`);
   if(wedgeGroup){const d=arcPath(81,0,n);wedgeGroup.querySelectorAll('path').forEach(path=>path.setAttribute('d',d))}
   if(canReveal)centralText.textContent=fmt(n)+'°';
   const box=theatre.querySelector('.f111-info .f111-big');if(box&&(!q.challenge||q.construction))box.textContent=fmt(n)+'°';
  };
  f11RotaryDrag(svg,handle,{
   start:()=>initial,
   fromPoint:(x,y)=>{let raw=Math.atan2(Y-y,x-X)/RAD;raw=(raw+360)%360;
    const value=S.base==='right'?raw:180-raw;return clamp(Math.round(value/S.snap)*S.snap,0,180)},
   preview,
   commit:n=>update(n,'pointer'),
   cancel:()=>preview(initial)
  });
 }
 plane.append(svg);layout.append(plane);
 const measured=q.challenge&&!q.correct&&!q.construction?'Hidden until marked':fmt(readAngle)+'°';
 const aside=H('aside',{class:'f111-info','aria-label':'Angle measurement evidence'});
 aside.append(card(q.step===3?'CHOOSING A SCALE':'ANGLE READING',measured,q.challenge?'Check both the opening and the starting zero.':isReflex?'Measure the smaller angle, then subtract from a full turn.':'Start at zero on the ray, and read the other ray.'));
 aside.append(H('section',{class:'f111-card'},[H('div',{class:'f111-eyebrow',text:'MATHEMATICAL CHECK'}),H('div',{class:'f111-proof',text:q.challenge&&!q.correct?'Which zero matches the starting ray?':q.step===5?'An obtuse angle must exceed 90°.':q.step===7?'72° = 20% of 360°':S.base==='right'?'Read the outer scale from the right-hand zero.':'Read the inner scale from the left-hand zero.'})]));
 aside.append(H('section',{class:'f111-card'},[H('div',{class:'f111-eyebrow',text:'REASONING'}),H('div',{class:'f111-proof',text:q.step===0?'A turn is measured around its vertex.':p.why})]));
 layout.append(aside);theatre.append(layout);
 if(q.challenge){const im=N.helperImg(q.correct?'cheer':S.wrong?'oops':'think','teen');theatre.append(H('div',{class:'f111-izaac'},[H('img',{src:im.src,alt:'Izaac, NOVA teen helper '+(q.correct?'celebrating':'checking the protractor')}),H('span',{text:q.correct?'Izaac: Brilliant. The angle and your reasoning match.':S.wrong?'Izaac: Check where zero starts and whether the opening is acute or obtuse.':'Izaac: Find the vertex, the starting zero and the correct degree mark.'})]));}
 stage.append(theatre);N.scene.helperStrip(theatre,q.pose,q.caption);
 S.angle=saved[0];S.base=saved[1];return svg;
}
function render(i,stage){const rows=[['Y7-040',58,'right'],['Y7-040',58,'right'],['Y7-040',58,'right'],['Y7-040',58,'right'],['Y7-040',58,'right'],['Y7-041',125,'right'],['Y7-041',110,'right'],['Y7-067',72,'right'],['Y7-040',58,'right']];const [id,angle,base]=rows[i];const old={...S};S.preset=id;S.angle=angle;S.base=base;drawing(stage,{step:i,angle,base,pose:STEPS[i].mood,caption:STEPS[i].narration});Object.assign(S,old);}
function btn(label,fn,cls='nova-btn ghost'){return H('button',{type:'button',class:cls,text:label,onclick:fn})}
function explore(panel,stage){panel.classList.add('f111-tools');function draw(){panel.replaceChildren();const sel=H('select',{class:'nova-input','aria-label':'Choose a lesson preset','data-testid':'f111-preset'});Object.entries(C.presets).forEach(([k,p])=>sel.append(H('option',{value:k,text:p.label})));sel.value=S.preset;sel.onchange=()=>{setPreset(sel.value);draw();paint()};panel.append(H('label',{class:'f111-span'},['CHOOSE LESSON / ANGLE CONTEXT',sel]));
 const number=H('span',{class:'f111-value',text:S.angle+'°'}),slider=H('input',{type:'range',min:0,max:180,step:S.snap,value:S.angle,'data-testid':'f111-angle-slider','aria-label':'Set angle in degrees'});
 slider.oninput=()=>{S.angle=+slider.value;number.textContent=S.angle+'°';emit('angle',{value:S.angle,source:'slider'});paint()};panel.append(H('label',{class:'f111-span'},[H('span',{},['MOVE THE SECOND RAY  ',number]),slider]));
 const base=H('select',{class:'nova-input','aria-label':'Starting-ray direction'});[['right','Right-hand zero'],['left','Left-hand zero']].forEach(([v,t])=>base.append(H('option',{value:v,text:t})));base.value=S.base;base.onchange=()=>{S.base=base.value;emit('base',S.base);paint()};panel.append(H('label',{},['BASELINE / ZERO',base]));
 const snap=H('select',{class:'nova-input','aria-label':'Snap angle by degrees'});[[1,'1° precision'],[5,'5° intervals']].forEach(([v,t])=>snap.append(H('option',{value:String(v),text:t})));snap.value=String(S.snap);snap.onchange=()=>{S.snap=+snap.value;emit('snap',S.snap);draw();paint()};panel.append(H('label',{},['SNAP SETTING',snap]));
 panel.append(H('div',{class:'f111-actions f111-span'},[btn('− 1°',()=>{S.angle=clamp(S.angle-1,0,180);draw();paint()}),btn('+ 1°',()=>{S.angle=clamp(S.angle+1,0,180);draw();paint()}),btn('Reset',()=>{setPreset(S.preset);draw();paint();emit('reset',S.preset)})]));
 panel.append(H('p',{class:'f111-explain f111-span',text:'Drag the gold arm handle around the protractor and release it on a degree mark, or use arrow keys while the handle is focused. The slider provides the same access without dragging.'}));}
 function paint(){drawing(stage,{editable:true,pose:'ruler',caption:'Move the arm and follow the scale from the starting zero. The opposite scale reads 180° minus your angle.'})}
 draw();paint();}
const TASKS=[
 {kind:'measure',angle:58,base:'right',question:'Measure the angle. Read from the zero on the right-hand baseline.',correct:58,reason:'right',hint:'This is an acute angle: count from zero at the right-hand end.',solution:'Start at the right-hand zero. The ray reaches 58°.',trap:122},
 {kind:'measure',angle:125,base:'right',question:'Measure the obtuse angle. Do not use the wrong protractor scale.',correct:125,reason:'obtuse',hint:'It opens wider than 90°. The smaller reading is from the wrong zero.',solution:'The opening exceeds 90°, so use 125°, not 55°.',trap:55},
 {kind:'measure',angle:135,base:'left',question:'The starting ray points LEFT. Measure the angle using its own zero.',correct:135,reason:'left',hint:'This time zero begins on the left-hand side.',solution:'Start at the left zero and follow its scale to 135°.',trap:45},
 {kind:'measure',angle:72,base:'right',question:'A pie-chart slice represents 20% of the whole circle. Measure its angle.',correct:72,reason:'whole',hint:'20% of 360° is 72°.',solution:'0.2 × 360° = 72°.',trap:108},
 {kind:'draw',angle:110,base:'right',question:'CONSTRUCT 110°. Drag the movable arm or adjust its angle using the slider in the task.',correct:110,reason:'construct',hint:'Line up zero on the baseline, then move the second arm to the 110° degree mark.',solution:'The two rays now enclose 110° from the right-hand starting ray.'},
 {kind:'measure',angle:38,base:'right',question:'Final independent check: give the angle AND the scale reason.',correct:38,reason:'right',hint:'This is acute and the baseline points to the right.',solution:'38° measured counterclockwise from the right-hand zero.',trap:142}
];
function wrongMessage(task,angle,reason){if(!Number.isFinite(angle))return 'Enter the measured angle in degrees.';if(task.kind==='draw'&&Math.abs(angle-task.correct)>0.5)return 'The constructed ray is at '+fmt(angle)+'°. Move it to '+task.correct+'°.';if(task.trap===angle||angle===180-task.correct)return 'That is the opposite protractor scale. Start at the ZERO on the starting ray.';if(angle!==task.correct)return angle>90&&task.correct<90?'That answer is obtuse, but the drawing is acute. Check the opening.':angle<90&&task.correct>90?'That answer is acute, but the drawing is obtuse. Check the opening.':'Your angle does not meet the ray. Align centre, zero, then degree mark.';if(reason!==task.reason)return 'The number is right. Now select the correct reason to prove it.';return ''}
function challenge(panel,api,stage){let index=0;S.wrong=0;S.task=0;const header=H('div',{class:'pr-task'}),sub=H('p',{class:'f111-explain'}),entry=H('div',{class:'f111-challenge-tools'}),actions=H('div',{class:'f111-actions'});panel.append(header,sub,entry,actions);
 function load(){const t=TASKS[index];S.challenge=t;S.angle=t.kind==='draw'?45:t.angle;S.base=t.base;S.answered=false;S.task=index;entry.replaceChildren();actions.replaceChildren();api.fb.textContent='';api.fb.className='nova-fb';header.textContent='Task '+(index+1)+' of '+TASKS.length+' · '+t.question;sub.textContent=t.kind==='draw'?'Construct first, then choose the reason.':'Read the angle, then justify your choice of degree scale.';let numeric=null;
 if(t.kind==='draw'){
 const angleOut=H('output',{class:'f111-value',text:S.angle+'°'});
 const range=H('input',{type:'range',min:0,max:180,step:1,value:S.angle,'data-testid':'f111-challenge-slider','aria-label':'Construct angle to 110 degrees'});
 range.oninput=()=>{S.angle=+range.value;angleOut.textContent=S.angle+'°';emit('angle',{value:S.angle,source:'construction-slider'});paint()};
 entry.append(H('label',{class:'f111-question'},['MOVE THE ARM TO 110°',angleOut,range]));
 }else {numeric=H('input',{type:'number',min:0,max:180,step:1,placeholder:'Degrees',class:'nova-input','aria-label':'Measured angle in degrees','data-testid':'f111-answer'});numeric.oninput=()=>emit('question',{task:index,value:numeric.value});entry.append(H('label',{class:'f111-question'},['ANGLE (°)',numeric]));}
 const why=H('select',{class:'nova-input','aria-label':'Reason for angle measurement','data-testid':'f111-reason'});
 [['','Choose your reasoning'],['right','I started at the right-hand 0° scale.'],['left','I started at the left-hand 0° scale.'],['obtuse','The angle is over 90° and I used the correct zero.'],['whole','A complete turn is 360°, and 20% is 72°.'],['construct','I aligned zero and drew the ray to the degree mark.']].forEach(([v,l])=>why.append(H('option',{value:v,text:l})));
 why.onchange=()=>emit('reason',{task:index,value:why.value});entry.append(H('label',{class:'f111-question'},['WHY IS THIS CORRECT?',why]));
 const success=()=>{S.answered=true;api.check(true,t.solution,{task:index});paint(true);if(index===TASKS.length-1){actions.replaceChildren(H('p',{class:'f111-value',text:'6 / 6 · PROTRACTOR MASTERED'}));}else actions.replaceChildren(btn('Continue to task '+(index+2),()=>{index++;load()},'nova-btn primary'));};
 actions.append(btn('Check angle + reason',()=>{let a=numeric?Number(numeric.value):S.angle;if(numeric&&!numeric.value.trim())a=NaN;const error=wrongMessage(t,a,why.value);if(error){S.wrong++;api.check(false,error,{task:index});paint();return;}success()},'nova-btn primary'),btn('Hint',()=>api.hint(t.hint)));
 if(numeric)numeric.addEventListener('keydown',e=>{if(e.key==='Enter')actions.querySelector('.nova-btn.primary')?.click()});
 paint();}
 function paint(correct=S.answered){const t=TASKS[index];drawing(stage,{challenge:true,construction:t.kind==='draw',editable:t.kind==='draw',correct,angle:t.kind==='draw'?S.angle:t.angle,base:t.base,pose:correct?'cheer':S.wrong?'oops':'think',caption:correct?t.solution:t.kind==='draw'?'Construct the angle with the movable arm, then explain.':'Find the matching zero and avoid the opposite scale.'})}
 load();}
const def={id:ID,title:'Protractor',config:C,steps:STEPS,render,explore,challenge,alt:'Premium neon semicircular protractor with accurately graded inner and outer degree scales, an angle, and a manipulable arm.',staticAlt:'A protractor measures an angle from the degree-zero mark on the starting ray, with its centre exactly on the vertex.',exploreIntro:'Choose a lesson context and construct angles using the degree slider or drag handle.',onRestore:()=>setPreset()};
N.registry.add({id:ID,title:'Protractor',family:'F11',topics:['protractor','angle measurement','construction','pie chart angle','obtuse'],deps:['F0-02','F0-04','F0-07','F0-08','F0-16']});
N.bankMount({id:ID,num:'01',title:'Protractor · Premium Edition',def,linked:['F11-02','F11-03','F11-11','F0-16'],years:'Year 7 · Measuring and drawing angles, angle facts, pie charts; GCSE extension',spec:{purpose:'Align, measure and construct angles accurately with a semicircular protractor and justify the correct scale.',params:'Angle 0–180°, right/left starting ray, degree snap 1° or 5°, reflex relationship.',presets:'Y7-040 measuring and drawing; Y7-041 obtuse and line facts; Y7-067 pie charts; left-origin and reflex extensions.',steps:'Nine progressive teaching steps from the vertex to correct-scale reading, obtuse errors, construction and pie charts.',interactions:'Four canonical NOVA modes, 1°/5° movable arm via low-latency F11 rotary pointer adapter (F0 drawing primitives preserved), slider and keyboard, 6 graded challenge tasks with mathematical reasons.',traps:'Wrong opposite degree scale, centre not on the vertex, confusing acute/obtuse, using 180° rather than 360° for pie charts.',gcse:'Left-starting readings and an explicit 240° reflex-angle reasoning preset.'}});
const tweak=()=>document.querySelectorAll('#F11-01 .face img').forEach(x=>{if(!x.alt)x.alt='Sir Bob, NOVA mathematics tutor'});tweak();window.addEventListener('load',tweak,{once:true});
})();
