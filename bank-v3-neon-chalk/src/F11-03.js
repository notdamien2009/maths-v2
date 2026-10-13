/* NOVA F11-03 — Angle Facts · F0/F1 foundation · scoped, additive engine. */
const F113_CONFIG=Object.freeze({id:'F11-03',family:'F11',startMode:'watch',defaultPreset:'straight',presets:{
 straight:{label:'Y7-041 · Angles on a straight line',kind:'straight',angle:123,sub:'Adjacent angles form a half turn.'},
 point:{label:'Y7-041 · Angles around a point',kind:'point',angle:78,sub:'All the turns together make one full revolution.'},
 vertical:{label:'Y7-041 · Vertically opposite angles',kind:'vertical',angle:68,sub:'Opposite sectors of two crossing straight lines are equal.'},
 parallel:{label:'Y7-042 · Angles in parallel lines',kind:'parallel',angle:63,sub:'Corresponding and alternate angles match when lines are parallel.'},
 triangle:{label:'Y7-043 · Angles in triangles',kind:'triangle',angle:58,sub:'All three interior angles add to 180°.'},
 bearing:{label:'Y8-052 / Y9-039 · Bearings',kind:'bearing',angle:125,sub:'Three-figure bearings turn clockwise from north.'},
 proof:{label:'Y9-041 · Simple geometric proof',kind:'vertical',angle:67,sub:'Use a justified chain of angle facts.'}
},events:{value:['preset','angle','apex','reason','answer','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F113_CONFIG=F113_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F113_CONFIG,ID=C.id,PI=Math.PI,rad=PI/180;
N.premium?.enable?.();
const S={preset:'straight',kind:'straight',angle:123,apex:[374,160],task:0,reason:'',wrong:0,answered:false,selected:''};
const lim=(v,l,h)=>Math.max(l,Math.min(h,v)),fmt=n=>String(Math.round(n)).replaceAll('-', '−');
function emit(k,v){if(!C.events.value.includes(k))throw Error('Undeclared value event: '+k);N.events.emit('value',{engine:ID,key:k,value:v})}
function setPreset(key){if(!C.presets[key])key='straight';S.preset=key;S.kind=C.presets[key].kind;S.angle=C.presets[key].angle;S.apex=[374,160];emit('preset',key)}
function button(t,fn,cl='nova-btn ghost'){return H('button',{type:'button',class:cl,text:t,onclick:fn})}
function card(title,big,detail){return H('section',{class:'f113-card'},[H('div',{class:'f113-eyebrow',text:title}),H('div',{class:'f113-main',text:big}),H('p',{class:'f113-sub',text:detail})])}
function chalk(svg,x,y,str,role='given',size=31,extra={}){return N.chalkText(svg,x,y,String(str),{role,size,anchor:'middle',...extra})}
function line(svg,x,y,x2,y2,role='given',width=7){return N.neonLine(svg,x,y,x2,y2,{role,width})}
function circle(svg,x,y,r,role='given'){return N.neonRing(svg,x,y,{r,role,pulse:false})}
function p(x,y,a,r){return [x+Math.cos(a*rad)*r,y-Math.sin(a*rad)*r]}
function arc(svg,cx,cy,r,start,end,role='focus',width=5){let a=start,b=end;while(b<a)b+=360;let sz=b-a;let pts=p(cx,cy,a,r),finish=p(cx,cy,b,r);let d='M '+pts.join(' ')+' A '+r+' '+r+' 0 '+(sz>180?1:0)+' 0 '+finish.join(' ');return N.neonPath(svg,d,{role,width})}
function heading(svg,text,role='op'){return chalk(svg,365,528,text,role,31)}
const STEPS=[
{name:'Two angles, one straight line',mood:'explain',narration:'A straight line makes half a turn. Its angles must add to one hundred and eighty degrees.',kind:'straight',angle:123,show:0},
{name:'Find the missing part',mood:'point-down',narration:'If one angle is one hundred and twenty-three degrees, the other is fifty-seven. Subtract from one hundred and eighty.',kind:'straight',angle:123,show:1},
{name:'Turn all the way around',mood:'count',narration:'Angles around a point make one full turn: three hundred and sixty degrees.',kind:'point',angle:78,show:0},
{name:'Complete the full turn',mood:'think',narration:'Add the known sectors, then subtract their total from three hundred and sixty to find the final angle.',kind:'point',angle:78,show:1},
{name:'Crossing lines make pairs',mood:'compare',narration:'When two straight lines cross, opposite angles are exactly equal.',kind:'vertical',angle:68,show:0},
{name:'Prove the opposite angles',mood:'point-left',narration:'Two adjacent angles add to one hundred and eighty. That lets us prove the vertically opposite pair is equal.',kind:'vertical',angle:68,show:1},
{name:'Match the parallel positions',mood:'point-right',narration:'A transversal crosses parallel lines. Corresponding angles in matching corners are equal.',kind:'parallel',angle:63,show:0},
{name:'Alternate angles make a Z',mood:'magnify',narration:'Alternate interior angles on opposite sides of the transversal are equal when the lines are parallel.',kind:'parallel',angle:63,show:1},
{name:'The three corners of a triangle',mood:'ruler',narration:'The three interior angles in every triangle add to one hundred and eighty degrees.',kind:'triangle',angle:58,show:0},
{name:'Work out a triangle angle',mood:'idea',narration:'Subtract the other two interior angles from one hundred and eighty to calculate the unknown corner.',kind:'triangle',angle:58,show:1},
{name:'Bearings go clockwise from north',mood:'explain',narration:'Start at north, measure clockwise, and give a three-figure bearing such as one hundred and twenty-five degrees.',kind:'bearing',angle:125,show:0},
{name:'Chain your facts into a proof',mood:'celebrate',narration:'State the rule, show the calculation, and explain why the unknown angle follows. A reason matters as much as the answer.',kind:'vertical',angle:67,show:2}
];
/* Fast rotary interaction: only an individual SVG group moves during pointermove; full NOVA stage does not repaint until commit. */
function dragDirect(svg,handle,opts){
 let current=null;
 handle.style.touchAction='none';
 handle.addEventListener('pointerdown',e=>{
  if(current||N.ui._drag||(e.pointerType==='mouse'&&e.button!==0))return;
  e.preventDefault();e.stopPropagation();const mat=svg.getScreenCTM();if(!mat)return;
  const inverse=mat.inverse(),id=e.pointerId,initial=opts.start(),t={id,initial,value:initial,next:null,raf:0};current=t;
  const coord=ev=>{const q=svg.createSVGPoint();q.x=ev.clientX;q.y=ev.clientY;return q.matrixTransform(inverse)};
  function flush(){t.raf=0;if(current!==t)return;if(t.next!==null){const val=t.next;t.next=null;if(JSON.stringify(val)!==JSON.stringify(t.value)){t.value=val;opts.preview(val);}}}
  function move(ev){if(current!==t||ev.pointerId!==id)return;ev.preventDefault();t.next=opts.fromPoint(coord(ev));if(!t.raf)t.raf=requestAnimationFrame(flush)}
  function clean(){if(current!==t)return;current=null;cancelAnimationFrame(t.raf);handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);window.removeEventListener('scroll',cancel,true);if(N.ui._drag===guard)N.ui._drag=null;try{if(handle.hasPointerCapture(id))handle.releasePointerCapture(id)}catch(_){}}
  function up(ev){if(current!==t||ev.pointerId!==id)return;t.next=opts.fromPoint(coord(ev));flush();const val=t.value;clean();opts.commit(val)}
  function cancel(){if(current!==t)return;clean();opts.cancel(initial)}
  function lost(){if(current===t)cancel()}
  function key(e){if(e.key==='Escape'){e.preventDefault();cancel()}}
  const guard={cancel,up};N.ui._drag=guard;
  handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);window.addEventListener('scroll',cancel,true);
  try{handle.setPointerCapture(id)}catch(_){};if(!handle.hasPointerCapture?.(id)){window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
 });
}
function renderFigure(stage,settings={}){
 const q={kind:S.kind,angle:S.angle,apex:S.apex,step:11,editable:false,challenge:false,show:0,task:null,revealed:false,pose:'think',caption:'Explain your answer with a mathematical rule.',onChange:()=>{},...settings};
 stage.replaceChildren();
 const scene=H('section',{class:'f113-theatre','data-testid':'f113-stage','data-kind':q.kind});
 scene.append(H('div',{class:'f113-top'},[H('span',{text:q.challenge?'F11 · ANGLE REASONING CHALLENGE':'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f113-tag',text:'NOVA · NEON CHALK'})]));
 const layout=H('div',{class:'f113-layout'}),plane=H('div',{class:'f113-plane'});
 const svg=N.svg.root(730,565,'An accurate geometric angle diagram with highlighted unknown, angle annotations and interactive movable rays.');svg.classList.add('nv-svg','f113-svg');svg.removeAttribute('height');svg.removeAttribute('width');svg.setAttribute('data-testid','f113-svg');
 const artwork=E('g',{},svg),unknown=(x,y)=>chalk(svg,x,y,'x','unknown',37),post=(x,y,txt,role='given',size=31)=>chalk(svg,x,y,txt,role,size);
 const read=q.challenge&&!q.revealed?'?°':q.revealed?(q.task?.answer??q.angle)+'°':q.show>=1?'KNOWN':'?°';
 let rule='',working='',cue='',handle=null,moveCfg=null;
 const actual=q.angle;
 if(q.kind==='straight'){
  const cx=360,cy=327,R=245,a=lim(actual,20,160);const end=p(cx,cy,a,R);
  line(artwork,98,cy,622,cy,'given',8);circle(artwork,cx,cy,10,'result');
  const rayGroup=E('g',{'data-live-ray':'true'},svg);line(rayGroup,cx,cy,end[0],end[1],'op',9);circle(rayGroup,end[0],end[1],9,'unknown');
  arc(svg,cx,cy,84,0,a,'focus',7);arc(svg,cx,cy,108,a,180,'given',5);
  let left=q.challenge?q.task?.known:180-a,right=q.challenge?'x':a;
  const ra=p(cx,cy,a*.5,141),rb=p(cx,cy,(a+180)*.5,161);post(ra[0],ra[1],right==='x'?'x':fmt(right)+'°','unknown',36);post(rb[0],rb[1],fmt(left)+'°','given',35);
  rule='ANGLES ON A LINE';working=q.challenge?(q.revealed?`${left}° + ${q.task.answer}° = 180°`:`${left}° + x = 180°`):q.show===0?'Two adjacent angles share a straight line.':`${a}° + ${180-a}° = 180°`;
  cue=q.challenge?'Find x from the 180° straight-line total.':'The two coloured arcs exactly fill a half turn.';
  if(q.editable){handle=makeHandle(end[0],end[1],'Rotate upper ray',0,180);moveCfg={cx,cy,min:20,max:160,kind:'angle',group:rayGroup};}
 }
 if(q.kind==='point'){
  const cx=356,cy=294,R=224,a=lim(actual,25,155),bounds=q.challenge?[0,q.task.givens[0],q.task.givens[0]+q.task.givens[1],q.task.givens[0]+q.task.givens[1]+q.task.givens[2],360]:[0,a,190,278,360],values=bounds.slice(0,4).map((b,i)=>bounds[i+1]-b);
  for(let i=0;i<4;i++){let b=bounds[i],e=bounds[i+1],mid=(b+e)/2,role=['op','given','focus','result'][i];let pts=p(cx,cy,mid,122);arc(svg,cx,cy,87+i*3,b,e,role,6);const label=q.challenge?(i===3?'x':String(q.task?.givens?.[i]??values[i])+'°'):fmt(values[i])+'°';post(pts[0],pts[1]+6,label,role,32)}
  bounds.slice(0,4).forEach((deg,j)=>{let ep=p(cx,cy,deg,R);const group=j===1?E('g',{'data-live-ray':'true'},svg):artwork;line(group,cx,cy,ep[0],ep[1],j===1?'op':'given',7);circle(group,ep[0],ep[1],7,j===1?'unknown':'result');if(j===1&&q.editable){handle=makeHandle(ep[0],ep[1],'Rotate sector boundary',0,180);moveCfg={cx,cy,min:25,max:155,kind:'angle',group};}});
  circle(svg,cx,cy,11,'result');rule='ANGLES AROUND A POINT';working=q.challenge?(q.revealed?`${q.task.givens.join('° + ')}° + ${q.task.answer}° = 360°`:`${q.task.givens.join('° + ')}° + x = 360°`):q.show===0?'A full turn goes all the way back to its start.':`${values.join('° + ')}° = 360°`;
  cue='One complete turn is 360°, whatever the individual angles.';
 }
 if(q.kind==='vertical'){
  const cx=355,cy=295,R=215,a=lim(actual,25,155),t=p(cx,cy,a,R),u=p(cx,cy,a+180,R);
  line(artwork,97,cy,613,cy,'given',8);const moving=E('g',{'data-live-ray':'true'},svg);line(moving,u[0],u[1],t[0],t[1],'op',9);circle(svg,cx,cy,11,'result');
  const data=[{st:0,en:a,v:a,role:'focus'},{st:a,en:180,v:180-a,role:'given'},{st:180,en:180+a,v:a,role:'focus'},{st:180+a,en:360,v:180-a,role:'given'}];
  for(let i=0;i<4;i++){const d=data[i];arc(svg,cx,cy,85,d.st,d.en,d.role,i===0||i===2?7:5);const o=p(cx,cy,(d.st+d.en)/2,150);let txt=q.challenge?(i===0?'x':i===2?String(q.task?.known??a)+'°':''):fmt(d.v)+'°';if(txt)post(o[0],o[1]+6,txt,d.role,34)}
  if(q.editable){handle=makeHandle(t[0],t[1],'Rotate intersecting line',0,180);moveCfg={cx,cy,min:25,max:155,kind:'angle',group:moving};}
  rule=q.step===11?'GEOMETRIC REASONS':'VERTICALLY OPPOSITE';working=q.challenge?(q.revealed?`x = ${q.task.answer}°`:'Opposite angles match. Adjacent angles total 180°.'):q.show===0?'Opposite angles are the same size.':`${a}° = ${a}°  ·  ${180-a}° + ${a}° = 180°`;
  cue='Opposite arcs are equal. Neighbouring arcs on a line total 180°.';
 }
 if(q.kind==='parallel'){
  const y1=194,y2=405,cx=352,a=lim(actual,48,132),dx=(y2-y1)/Math.tan(a*rad);const x2=cx-dx;
  line(artwork,98,y1,642,y1,'given',7);line(artwork,98,y2,642,y2,'given',7);
  // Draw continuous transversal through the two intersections in the same straight direction.
  const ux=Math.cos(a*rad),uy=-Math.sin(a*rad);
  const moving=E('g',{'data-live-ray':'true'},svg);const upper=(y1-69)/Math.sin(a*rad),lower=(507-y1)/Math.sin(a*rad);line(moving,cx+ux*upper,69,cx-ux*lower,507,'op',8);
  // Arrowheads / repeated parallel marks use standard NOVA neon strokes.
  for(let y of [y1,y2]){line(svg,220,y-12,229,y,'focus',3);line(svg,229,y,238,y-12,'focus',3)}
  circle(svg,cx,y1,8,'result');circle(svg,x2,y2,8,'result');
  // Angle between top/right direction and transversal down-right: complementary convention measured from horizontal.
  let mark=a;const arc1=arc(svg,cx,y1,64,0,mark,'focus',6);const arc2=arc(svg,x2,y2,65,0,mark,'focus',6);
  let p1=p(cx,y1,mark/2,116),p2=p(x2,y2,mark/2,112);
  post(p1[0],p1[1],q.challenge?q.task.known+'°':fmt(mark)+'°','given',30);
  post(p2[0],p2[1],q.challenge?'x':q.show===0?'?':fmt(mark)+'°','unknown',32);
  if(q.editable){const hp=[cx+ux*114,y1+uy*114];handle=makeHandle(hp[0],hp[1],'Rotate transversal',48,132);moveCfg={cx,cy:y1,min:48,max:132,kind:'parallel',group:moving};}
  rule='PARALLEL LINE FACTS';working=q.challenge?(q.revealed?`x = ${q.task.answer}°`:'Matching corners give equal corresponding angles.'):q.show===0?'Two parallel lines keep the same direction.':`Corresponding angles = ${fmt(mark)}°`;
  cue=q.show>=1?'Also test the alternate interior Z-shaped pair.':'Match the position of the angles at both crossings.';
 }
 if(q.kind==='triangle'){
  const A=[180,428],B=[572,428],Cpt=q.apex||[374,160];const tri=[A,B,Cpt],a=Math.atan2(A[1]-Cpt[1],Cpt[0]-A[0])/rad,b=Math.atan2(B[1]-Cpt[1],B[0]-Cpt[0])/rad,anB=b,anA=a,anC=180-anA-anB;
  let d=`M ${A[0]} ${A[1]} L ${B[0]} ${B[1]} L ${Cpt[0]} ${Cpt[1]} Z`;
  const shape=N.neonPath(artwork,d,{role:'given',width:8,fill:true});const area=E('path',{d,fill:'#307ad222',stroke:'none','pointer-events':'none'},artwork);
  tri.forEach((v,i)=>circle(svg,v[0],v[1],8,i===2?'unknown':'result'));
  post(155,452,'A','given',28);post(594,452,'B','given',28);post(Cpt[0],Cpt[1]-27,'C','given',28);
  const gv=q.challenge?q.task?.givens:[Math.round(anA),Math.round(anB)];
  post(226,392,String(gv?.[0]??58)+'°','given',32);post(521,392,String(gv?.[1]??54)+'°','given',32);post(Cpt[0],Cpt[1]+65,q.challenge?'x':q.show===0?'?':fmt(anC)+'°','unknown',35);
  // Small F0 angle arcs at both base vertices, geometric circle arcs not decorative motifs.
  arc(svg,A[0],A[1],54,0,anA,'focus',5);arc(svg,B[0],B[1],54,180-anB,180,'focus',5);
  if(q.editable){handle=makeHandle(Cpt[0],Cpt[1],'Drag the triangle apex',0,180);moveCfg={kind:'apex',handle,shape,area,start:Cpt,point:Cpt};}
  rule='TRIANGLE INTERIOR ANGLES';working=q.challenge?(q.revealed?`${gv.join('° + ')}° + ${q.task.answer}° = 180°`:`${gv.join('° + ')}° + x = 180°`):q.show===0?'Every triangle has three interior angles.':`The total is 180° · Drag the top corner to compare.`;
  cue='The sum remains 180° even when you change the shape.';
 }
 if(q.kind==='bearing'){
  const cx=362,cy=290,R=222,a=lim(actual,0,359),point=p(cx,cy,90-a,R);
  line(artwork,cx,cy,cx,78,'given',6);line(artwork,cx,cy,cx+R,cy,'support',3);circle(artwork,cx,cy,9,'result');
  const move=E('g',{'data-live-ray':'true'},svg);line(move,cx,cy,point[0],point[1],'op',8);circle(move,point[0],point[1],9,'unknown');
  post(cx,57,'N','given',38);post(cx+R+30,cy+11,'E','given',32);
  const steps=Math.max(1,Math.ceil(a/3));let d=`M ${cx} ${cy-92}`;for(let j=1;j<=steps;j++){let z=p(cx,cy,90-a*j/steps,92);d+=` L ${z[0]} ${z[1]}`};N.neonPath(svg,d,{role:'focus',width:7});
  if(q.challenge)post(484,398,fmt(a).padStart(3,'0')+'°','given',31);
  post(532,446,q.challenge?'x':q.show>=1?fmt(a).padStart(3,'0')+'°':'?',q.challenge?'unknown':'result',40);
  if(q.editable){handle=makeHandle(point[0],point[1],'Rotate clockwise bearing',0,359);moveCfg={cx,cy,min:0,max:359,kind:'bearing',group:move};}
  rule='BEARINGS';working=q.challenge?(q.revealed?`Reverse bearing = ${fmt(q.task.answer).padStart(3,'0')}°`:'Reverse bearings differ by a half-turn (180°).'):q.show===0?'Clockwise from north. Always use three figures.':`Bearing = ${String(a).padStart(3,'0')}° from north`;
  cue='A reverse bearing is 180° around from the original direction.';
 }
 // Local helper: clickable SVG control created only for the actual moving object.
 function makeHandle(x,y,aria,min,max){const h=E('g',{class:'f113-draggable','data-testid':'f113-angle-handle',tabindex:'0',role:'slider','aria-label':aria,'aria-valuemin':min,'aria-valuemax':max,'aria-valuenow':actual},svg);E('circle',{cx:x,cy:y,r:27,fill:'#ffc76729',stroke:'#fdd776','stroke-width':2.8},h);E('circle',{cx:x,cy:y,r:12,fill:'#ffeeb9',stroke:'#e9a344','stroke-width':3},h);return h}
 // Global arithmetic is computed from the geometry, not a canned screenshot.
 heading(svg,q.challenge?'FIND x · GIVE A REASON':q.show>=1?'RULE + EVIDENCE':'NOTICE THE ANGLES',q.challenge?'unknown':'op');
 plane.append(svg);layout.append(plane);
 let inferred=q.challenge?(q.revealed?`${q.task.answer}°`:'x = ?'):q.show===0?'DISCOVER':q.kind==='bearing'?String(actual).padStart(3,'0')+'°':q.kind==='triangle'?'180°':q.kind==='point'?'360°':q.kind==='parallel'?'EQUAL':q.kind==='vertical'?'EQUAL':'180°';
 let aside=H('aside',{class:'f113-aside'});
 aside.append(card('THE ANGLE FACT',inferred,q.challenge&&!q.revealed?'Use the given numbers and explain why.':rule),card('MATHEMATICAL REASON',q.challenge&&!q.revealed?'JUSTIFY IT':q.show===0?'LOOK FIRST':working, q.challenge&&!q.revealed?'The mathematical rule matters as much as the result.':'Be ready to say this fact aloud.'),card('WHAT TO NOTICE','LOOK AT THE ARCS',cue));
 layout.append(aside);scene.append(layout);
 if(q.challenge){let peer=N.helperImg(q.revealed?'cheer':S.wrong?'oops':'think','teen');scene.append(H('div',{class:'f113-peer'},[H('img',{src:peer.src,alt:'Izaac, NOVA challenge peer '+(q.revealed?'celebrating':'thinking')}),H('span',{text:q.revealed?'Izaac: You found the angle and gave a valid reason.':S.wrong?'Izaac: Check the rule, then try again.':'Izaac: Explain the angle fact, not just the number.'})]));}
 stage.append(scene);N.scene.helperStrip(scene,q.pose,q.caption);
 // Angle handle is attached to the exact ray / apex and uses no easing or old F0 tile drag.
 if(handle&&moveCfg){
  const cfg=moveCfg,start=cfg.kind==='apex'?[...q.apex]:actual;
  function fromPoint(pt){if(cfg.kind==='apex')return [lim(Math.round(pt.x),270,480),lim(Math.round(pt.y),110,300)];let a=(Math.atan2(cfg.cy-pt.y,pt.x-cfg.cx)/rad+360)%360;if(cfg.kind==='bearing')a=(90-a+360)%360;if(cfg.kind==='parallel')a=a%180;return lim(Math.round(a),cfg.min,cfg.max)}
  function preview(v){if(cfg.kind==='apex'){
   let [x,y]=v;handle.setAttribute('transform',`translate(${x-start[0]} ${y-start[1]})`);
   let dd=`M 180 428 L 572 428 L ${x} ${y} Z`;cfg.shape?.querySelectorAll('path').forEach(e=>e.setAttribute('d',dd));cfg.area.setAttribute('d',dd);
  }else{
   let delta=v-start;if(cfg.kind==='bearing')delta=-delta;else if(cfg.kind==='parallel')delta=-delta;else delta=-delta;
   cfg.group?.setAttribute('transform',`rotate(${delta} ${cfg.cx} ${cfg.cy})`);
   handle.setAttribute('transform',`rotate(${delta} ${cfg.cx} ${cfg.cy})`);
  }handle.setAttribute('aria-valuenow',String(v));
  }
  function commit(v){if(cfg.kind==='apex'){S.apex=v;emit('apex',v);q.onChange({apex:v,via:'pointer'})}else{S.angle=v;emit('angle',{angle:v,via:'pointer'});q.onChange({angle:v,via:'pointer'})}}
  const cancel=()=>preview(start);
  dragDirect(svg,handle,{start:()=>start,fromPoint,preview,commit,cancel});
  handle.addEventListener('keydown',ev=>{
   if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;ev.preventDefault();ev.stopPropagation();let n;
   if(cfg.kind==='apex'){n=[...S.apex];n[0]+=ev.key==='ArrowLeft'?-10:ev.key==='ArrowRight'?10:0;n[1]+=ev.key==='ArrowUp'?-10:ev.key==='ArrowDown'?10:0;n[0]=lim(n[0],270,480);n[1]=lim(n[1],110,300)}else{let delta=ev.shiftKey?5:1;n=ev.key==='Home'?cfg.min:ev.key==='End'?cfg.max:lim(S.angle+(ev.key==='ArrowDown'||ev.key==='ArrowLeft'?-delta:delta),cfg.min,cfg.max)}commit(n);setTimeout(()=>stage.querySelector('[data-testid=f113-angle-handle]')?.focus(),0)
  });
 }
 return svg;
}
function render(i,stage){const t=STEPS[i]||STEPS[STEPS.length-1];renderFigure(stage,{kind:t.kind,angle:t.angle,step:i,show:t.show,pose:t.mood,caption:t.narration,apex:[374,160]})}
function explore(panel,stage){panel.classList.add('f113-tools');
 function paint(){renderFigure(stage,{kind:S.kind,angle:S.angle,apex:S.apex,editable:true,show:1,pose:'ruler',caption:C.presets[S.preset].sub+' Drag the gold handle or use the controls.',onChange:p=>{if(p.angle!==undefined)S.angle=p.angle;if(p.apex)S.apex=p.apex;update()}})}
 function update(){panel.replaceChildren();let preset=H('select',{class:'nova-input','data-testid':'f113-preset','aria-label':'Choose angle facts scene'});Object.entries(C.presets).forEach(([k,v])=>preset.append(H('option',{value:k,text:v.label})));preset.value=S.preset;preset.onchange=()=>{setPreset(preset.value);update()};panel.append(H('label',{class:'f113-span'},['CHOOSE A MATHEMATICAL RELATIONSHIP',preset]));
 if(S.kind!=='triangle'){const out=H('output',{class:'f113-value',text:fmt(S.angle)+'°'}),slide=H('input',{type:'range',min:S.kind==='bearing'?0:S.kind==='parallel'?48:25,max:S.kind==='bearing'?359:S.kind==='parallel'?132:155,step:1,value:S.angle,'aria-label':'Change moveable angle','data-testid':'f113-angle-slider'});slide.oninput=()=>{S.angle=+slide.value;out.textContent=fmt(S.angle)+'°';emit('angle',{angle:S.angle,via:'slider'});paint()};panel.append(H('label',{},['MOVE ANGLE ARM',out,slide]));}
 else{panel.append(H('p',{class:'f113-explain',text:'Move the triangle top vertex directly with the mouse, finger or arrow keys. Both other angles recalculate as the triangle changes.'}))}
 let actions=H('div',{class:'f113-actions f113-span'});actions.append(button('Reset this diagram',()=>{setPreset(S.preset);emit('reset',S.preset);update()},'nova-btn primary'),button('Try another relationship',()=>{let ids=Object.keys(C.presets);setPreset(ids[(ids.indexOf(S.preset)+1)%ids.length]);update()}));panel.append(actions);
 panel.append(H('p',{class:'f113-explain f113-span',text:'Live F0-core diagram: neon rays, chalk labels, angle arcs and an interactive gold handle. The line/point/vertical/parallel/triangle/bearing rules remain mathematically exact.'}));paint()}
 update();
}
const REASONS={straight:'Angles on a straight line total 180°',point:'Angles around a point total 360°',vertical:'Vertically opposite angles are equal',parallel:'Corresponding angles on parallel lines are equal',triangle:'Interior angles of a triangle total 180°',bearing:'Reverse bearings differ by 180°'};
const TASKS=[
 {kind:'straight',a:57,known:123,answer:57,why:'straight',prompt:'One angle on a straight line is 123°. Find the adjacent angle x.',hint:'The two adjacent angles form 180°.',check:'180 − 123 = 57°.'},
 {kind:'point',a:60,givens:[80,95,125],answer:60,why:'point',prompt:'Three turns around a point are 80°, 95° and 125°. Find x.',hint:'Add the three given turns. Subtract the sum from 360°.',check:'80 + 95 + 125 = 300, so x = 60°.'},
 {kind:'vertical',a:68,known:68,answer:68,why:'vertical',prompt:'One angle at an intersection is 68°. Find its vertically opposite angle x.',hint:'Opposite angles are equal when two straight lines intersect.',check:'Vertically opposite angles = 68°.'},
 {kind:'vertical',a:112,known:112,answer:112,why:'vertical',prompt:'Another crossing has a 112° angle. Find its vertically opposite x.',hint:'Do not subtract from 180 unless the target is adjacent rather than opposite.',check:'The opposite angle is also 112°.'},
 {kind:'parallel',a:74,known:74,answer:74,why:'parallel',prompt:'The corresponding angle on a parallel line is 74°. Find x.',hint:'Angles in the same relative corner are equal.',check:'Corresponding angle = 74°.'},
 {kind:'triangle',a:58,givens:[48,67],answer:65,why:'triangle',prompt:'The angles in a triangle include 48° and 67°. Find x.',hint:'The total is 180°, so subtract both known interior angles.',check:'180 − 48 − 67 = 65°.'},
 {kind:'bearing',a:125,answer:305,why:'bearing',prompt:'The bearing from A to B is 125°. Find the reverse bearing B to A.',hint:'Add or subtract 180° for a reverse bearing. Write three figures.',check:'125 + 180 = 305°, so the reverse bearing is 305°.'},
 {kind:'vertical',a:67,known:67,answer:67,why:'vertical',prompt:'Prove x is 67° at an intersection. Give a mathematical reason.',hint:'Name the opposite-angle property, rather than guessing from the drawing.',check:'Vertically opposite angles are equal; therefore x = 67°.'}
];
function pointerReasonCards(panel,items,drop,chosen,onChange){
 items.forEach(([key,value])=>{const card=H('button',{type:'button',class:'f113-reason','data-reason':key,'aria-pressed':String(chosen()===key),text:value,onclick:()=>{onChange(key);items.forEach(([k])=>panel.querySelector(`[data-reason="${k}"]`)?.setAttribute('aria-pressed',String(k===key)))}});
 panel.append(card);let active=null;card.addEventListener('pointerdown',ev=>{
  if(ev.pointerType==='mouse'&&ev.button!==0)return;if(N.ui._drag)return;const id=ev.pointerId;
  // Only declare a drag after 7px movement, to preserve normal keyboard/tap selection.
  const sx=ev.clientX,sy=ev.clientY;let ghost=null,dragging=false;active={id};
  function move(e){if(e.pointerId!==id)return;if(!dragging&&Math.hypot(e.clientX-sx,e.clientY-sy)>7){dragging=true;ghost=H('div',{class:'f113-ghost',text:value});document.body.append(ghost);N.ui._drag={cancel};}if(dragging){e.preventDefault();ghost.style.left=(e.clientX+15)+'px';ghost.style.top=(e.clientY+13)+'px';const r=drop.getBoundingClientRect();drop.dataset.hover=String(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}}
  function clean(){ghost?.remove();drop.dataset.hover='false';if(N.ui._drag?.cancel===cancel)N.ui._drag=null;card.removeEventListener('pointermove',move);card.removeEventListener('pointerup',up);card.removeEventListener('pointercancel',cancel);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('keydown',esc);window.removeEventListener('blur',cancel);try{if(card.hasPointerCapture(id))card.releasePointerCapture(id)}catch(_){}active=null}
  function up(e){if(e.pointerId!==id)return;let r=drop.getBoundingClientRect(),good=dragging&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;clean();if(good){onChange(key);drop.dataset.set='true';drop.textContent=value}}
  function cancel(){clean()}function esc(e){if(e.key==='Escape'){e.preventDefault();cancel()}}
  card.addEventListener('pointermove',move);card.addEventListener('pointerup',up);card.addEventListener('pointercancel',cancel);window.addEventListener('keydown',esc);window.addEventListener('blur',cancel);
  try{card.setPointerCapture(id)}catch(_){}if(!card.hasPointerCapture?.(id)){window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
 });
 });
}
function misconception(task,answer,reason){let n=Number(answer);
 if(String(answer).trim()===''||!Number.isFinite(n))return 'Enter a number of degrees before checking.';
 if(n<0||n>=360)return 'The angle must be at least 0° and less than 360°.';
 if(task.kind==='straight'&&n===task.known)return 'You have copied the given angle. Adjacent angles on a line ADD to 180°.';
 if(task.kind==='point'&&n===300)return 'You have calculated the known total (300°), not the missing part of the full 360°.';
 if(task.kind==='vertical'&&n===180-task.answer)return 'You found the adjacent supplementary angle. The requested angle is vertically OPPOSITE.';
 if(task.kind==='parallel'&&n===180-task.answer)return 'That is the supplementary angle. Corresponding angles in matching positions are EQUAL.';
 if(task.kind==='triangle'&&n===115)return 'You have added the two given angles. Subtract that total from 180° to find x.';
 if(task.kind==='bearing'&&n===55)return 'That is 180° minus the bearing, not its reverse. Turn a half revolution (add 180°).';
 if(n!==task.answer)return `Not quite. Your ${n}° does not satisfy the relevant geometry rule. Check the given values and try again.`;
 if(reason!==task.why)return 'Your angle is correct, but your reason does not justify this particular angle. Choose the matching rule.';
 return '';
}
function challenge(panel,api,stage){let i=0;panel.classList.add('f113-tools');let taskLabel=H('div',{class:'pr-task f113-span'}),question=H('p',{class:'f113-explain f113-span'}),form=H('div',{class:'f113-span'}),reasons=H('div',{class:'f113-reasons f113-span'}),drop=H('div',{class:'f113-drop f113-span','data-testid':'f113-reason-drop',text:'Drop your mathematical reason here, or click a reason card.'}),actions=H('div',{class:'f113-actions f113-span'});panel.append(taskLabel,question,form,reasons,drop,actions);
 function load(){S.task=i;S.wrong=0;S.answered=false;S.reason='';S.selected='';let t=TASKS[i];S.kind=t.kind;S.angle=t.a;taskLabel.textContent=`TASK ${i+1} / ${TASKS.length} · FIND x`;question.textContent=t.prompt;api.fb.textContent='';api.fb.className='nova-fb';form.replaceChildren();reasons.replaceChildren();actions.replaceChildren();drop.dataset.set='false';drop.textContent='Drop your mathematical reason here, or click a reason card.';
  let answer=H('input',{type:'number',min:0,max:359,step:1,class:'nova-input','data-testid':'f113-answer','aria-label':'Unknown angle in degrees',placeholder:'Enter x in degrees'});
  form.append(H('label',{class:'f113-question'},['YOUR ANSWER (DEGREES)',answer]));
  let keys=Object.entries(REASONS);pointerReasonCards(reasons,keys,drop,()=>S.reason,key=>{S.reason=key;emit('reason',{task:i,value:key});reasons.querySelectorAll('[data-reason]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.reason===key)));drop.dataset.set='true';drop.textContent=REASONS[key]});
  function paint(done=false){renderFigure(stage,{kind:t.kind,angle:t.a,apex:t.kind==='triangle'?[446.408,132.124]:[374,160],step:11,show:0,challenge:true,task:t,revealed:done,pose:done?'celebrate':S.wrong?'not-yet':'think',caption:done?`Correct. ${t.check} Always name the reason.`:S.wrong?'Use the diagram and try the rule again.':'Look at the given values. Find x, then give your mathematical reason.'})}
  const check=()=>{let err=misconception(t,answer.value,S.reason);if(err){S.wrong++;api.check(false,err,{task:i+1});paint(false);return;}S.answered=true;api.check(true,t.check,{task:i+1,angle:t.answer,reason:S.reason});paint(true);actions.replaceChildren();if(i===TASKS.length-1)actions.append(H('p',{class:'f113-complete',text:'8 / 8 · ALL ANGLE FACTS MASTERED'}));else actions.append(button('Next angle fact →',()=>{i++;load()},'nova-btn primary'))};
  actions.append(button('Check angle + reason',check,'nova-btn primary'),button('Hint',()=>api.hint(t.hint)));
  answer.addEventListener('keydown',e=>{if(e.key==='Enter')check()});paint(false);
 }
 load();
}
const def={id:ID,title:'Angle Facts',config:C,steps:STEPS,render,explore,challenge,alt:'Six precision-drawn geometry scenes: straight line, point, crossing lines, parallel lines, triangle and bearings, with moving ray or vertex and bright NOVA Chalk labels.',staticAlt:'Angles on a straight line total 180 degrees; around a point total 360 degrees; vertically opposite and corresponding angles are equal; triangle interior angles total 180 degrees.',exploreIntro:'Rotate the gold handle, check each relationship, then explain WHY it stays true.',onRestore:()=>setPreset('straight')};
N.registry.add({id:ID,title:'Angle Facts',family:'F11',topics:['angles','straight line','vertically opposite','parallel','triangle','bearings','proof'],deps:['F0-02','F0-04','F0-07','F0-08','F11-01','F11-02']});
N.bankMount({id:ID,num:'03',title:'Angle Facts · Premium Edition',def,linked:['F11-01','F11-02','F11-04','F11-05','F11-11'],years:'Years 7–9 · Straight lines, full turns, opposite angles, parallel lines, triangles, bearings and proof',spec:{purpose:'Explore and justify angle relationships with correct geometry, interactive rays and guided reasoning.',params:'Angle, apex position, relationship type, degree precision, missing angle, reason selection.',presets:'Y7-041 straight, point and vertical; Y7-042 parallels; Y7-043 triangle; Y8-052 / Y9-039 bearings; Y9-041 proof.',steps:'Twelve graded concepts: straight-line total, point total, opposite angles, parallel lines, triangle sums, bearings and deductive proof.',interactions:'Fast captured pointer dragging; keyboard angle adjustment; six presets; draggable/clickable mathematical reason cards; eight reasoning challenges.',traps:'Confusing opposite and adjacent, subtracting from wrong total, mistaking supplements for correspondents, mixing up three-figure bearings.',gcse:'Chained geometry reasons and reverse-bearing reasoning.'}});
})();
