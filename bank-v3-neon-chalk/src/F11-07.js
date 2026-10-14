/* F11-07 Regular Polygon Builder — canonical F0/F1 neon/chalk core, isolated geometry.
   Exact vertices on a circumcircle: centre angle = 360/n; each exterior angle = 360/n,
   each interior angle = 180 - 360/n. All draggable vertices remain ON the circle. */
const F117_CONFIG=Object.freeze({id:'F11-07',family:'F11',defaultPreset:'y7',presets:{
 y7:{label:'Y7-044 · Regular pentagon',n:5},
 y8:{label:'Y8-049 · Polygon angle facts',n:6},
 y9:{label:'Y9-026 · Polygon reasoning',n:8},
 triangle:{label:'Equilateral triangle',n:3},square:{label:'Square',n:4},decagon:{label:'Regular decagon',n:10}
},events:{value:['preset','sides','radius','rotation','show','reason','answer','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F117_CONFIG=F117_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-07',TAU=Math.PI*2,CFG=F117_CONFIG;
N.premium?.enable?.();
const S={n:5,radius:188,rotation:-90,preset:'y7',show:'all'};
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('Unregistered event '+key);N.events.emit('value',{engine:ID,key,value})};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round=v=>Math.round(v*100)/100;
const num=v=>Math.abs(v-Math.round(v))<.001?String(Math.round(v)):Number(v.toFixed(2)).toString();
const deg=v=>num(v)+'°';
const shapeName=n=>({3:'TRIANGLE',4:'SQUARE',5:'PENTAGON',6:'HEXAGON',7:'HEPTAGON',8:'OCTAGON',9:'NONAGON',10:'DECAGON',11:'HENDECAGON',12:'DODECAGON'})[n]||`${n}-GON`;
const btn=(txt,fn,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:txt,onclick:fn});
const prose=txt=>H('p',{class:'f117-explain f117-wide',text:txt});
const chalk=(g,x,y,txt,role='given',size=26,anchor='middle')=>N.chalkText(g,x,y,String(txt),{role,size,anchor});
const line=(g,x1,y1,x2,y2,role='given',width=5)=>N.neonLine(g,x1,y1,x2,y2,{role,width});
const ring=(g,x,y,r=8,role='given')=>N.neonRing(g,x,y,{r,role,pulse:false});
const point=(x,y,a,r)=>[x+r*Math.cos(a),y+r*Math.sin(a)];
const C=[366,257];
function vertices(n,r,rotation){return Array.from({length:n},(_,i)=>point(...C,(rotation+i*360/n)*Math.PI/180,r))}
function calc(n){return {central:360/n,exterior:360/n,interior:180-360/n,total:180*(n-2),triangles:n-2};}
function circle(g,r,role='given',w=4){let [cx,cy]=C,d=`M ${cx-r} ${cy} A ${r} ${r} 0 1 0 ${cx+r} ${cy} A ${r} ${r} 0 1 0 ${cx-r} ${cy}`;N.neonPath(g,d,{role,width:w});}
function arc(g,origin,r,a,span,role='focus',fill=false){let end=a+span,from=point(...origin,a,r),to=point(...origin,end,r),large=span>Math.PI?1:0,d=`M ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]}`;if(fill)d=`M ${origin[0]} ${origin[1]} L ${from[0]} ${from[1]} A ${r} ${r} 0 ${large} 1 ${to[0]} ${to[1]} Z`;N.neonPath(g,d,{role,width:fill?2.3:4,fill});}
function card(title,value,sub){return H('section',{class:'f117-card'},[H('div',{class:'f117-eyebrow',text:title}),H('div',{class:'f117-main',text:String(value)}),H('p',{class:'f117-sub',text:sub})]);}
function shell(stage){stage.replaceChildren();let sec=H('section',{class:'f117-theatre','data-testid':'f117-stage'});sec.append(H('div',{class:'f117-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f117-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f117-layout'}),plane=H('div',{class:'f117-plane'}),svg=N.svg.root(730,530,'Regular polygon inscribed in a neon circle, with equal central angles and chord edges');svg.classList.add('nv-svg','f117-svg');svg.dataset.testid='f117-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','100 4 530 514');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return{sec,layout,plane,svg};}
function geometry(svg,opt={}){
 let prior=svg.querySelector('[data-testid="f117-geometry"]');prior?.remove();let g=E('g',{'data-testid':'f117-geometry'},svg);let grip=svg.querySelector('[data-testid="f117-rotation-handle"]');if(grip)svg.insertBefore(g,grip);let n=opt.n||5,r=opt.radius||188,rotation=opt.rotation??-90,phase=opt.phase??6,view=opt.show||'all',hide=!!opt.hide,interactive=!!opt.interactive;
 let p=vertices(n,r,rotation),f=calc(n),θ=TAU/n,angle=(rotation*Math.PI/180),verts=Math.min(n,phase<=1?0:phase===2?1:phase===3?Math.min(n,3):n);
 // Layer 1: precision circumcircle, diameter axes and glow without inventing a separate primitive.
 circle(g,r,'given',4);
 if(phase>=1){line(g,C[0]-r-18,C[1],C[0]+r+18,C[1],'given',2);line(g,C[0],C[1]-r-18,C[0],C[1]+r+18,'given',2);ring(g,...C,9,'result');}
 if(phase>=2){
  if(phase>=4){let d='M '+p.map((q,i)=>(i?'L ':'')+q.map(v=>v.toFixed(3)).join(' ')).join(' ')+' Z';N.neonPath(g,d,{role:'given',width:5.5,fill:true});}
  let visibleCount=(phase===2?1:phase===3?Math.min(n,3):n);
  for(let i=0;i<visibleCount;i++){
   let a=p[i],beta=angle+i*θ;
   if(view==='all'||view==='central'||phase<=4)line(g,...C,...a,i<=1?'op':'given',i<=1?4:2.5);
   ring(g,...a,8,i===0?'result':'given');
   let label=point(...C,beta,Math.min(r+27,226));chalk(g,label[0],label[1]+7,String.fromCharCode(65+i),'given',21);
   if(i>0&&phase===3)line(g,...p[i-1],...a,'result',6);
  }
  if(phase===3&&visibleCount===n)line(g,...p[n-1],...p[0],'result',6);
 }
 // The sector really is 360/n of a full revolution.
 if(phase>=5&&(view==='all'||view==='central')){
  arc(g,C,67,angle,θ,'op',true);arc(g,C,73,angle,θ,'op');
  if(!hide){let v=point(...C,angle+θ/2,119);chalk(g,v[0],v[1]+6,deg(f.central),'op',27);}
  chalk(g,C[0],C[1]-17,'O','result',23);
 }
 if(phase>=6&&(view==='all'||view==='interior'||view==='exterior')){
  let v=p[1%n],prev=p[0],next=p[2%n],start=Math.atan2(next[1]-v[1],next[0]-v[0]),end=Math.atan2(prev[1]-v[1],prev[0]-v[0]);
  let span=(end-start+TAU)%TAU;
  // At a convex regular polygon, the smaller sector must be interior.
  if(span>Math.PI){let temp=start;start=end;end=temp;span=TAU-span;}
  if(view!=='exterior'){arc(g,v,35,start,span,'focus',true);arc(g,v,42,start,span,'focus');if(!hide){let lab=point(...v,start+span/2,69);chalk(g,lab[0],lab[1]+5,deg(f.interior),'focus',24)}}
  if(view==='exterior'||view==='all'){
   let incoming=Math.atan2(v[1]-prev[1],v[0]-prev[0]),outgoing=Math.atan2(next[1]-v[1],next[0]-v[0]),ext=(outgoing-incoming+TAU)%TAU;
   let x=point(...v,incoming,75);line(g,...v,...x,'op',3.2);arc(g,v,54,incoming,ext,'op');
   if(!hide){let label=point(...v,incoming+ext/2,94);chalk(g,label[0],label[1]+7,deg(f.exterior),'op',22);}
  }
 }
 if(phase>=7){chalk(g,C[0],45,hide?'BUILD THE POLYGON':`REGULAR ${shapeName(n)}`,'focus',29);}
 if(phase>=8&&!hide){chalk(g,C[0],487,view==='central'?`${n} × ${deg(f.central)} = 360°`:view==='interior'?`INTERIOR = 180° − ${deg(f.exterior)}`:view==='exterior'?`${n} EXTERIOR TURNS = 360°`:`${n} EQUAL SIDES · ${n} EQUAL ANGLES`,'result',25);}
 if(phase<=1)chalk(g,C[0],478,'START WITH ONE CIRCLE','focus',28);
 // Transparent high-priority handles live outside the disposable geometric layer.
 for(const type of ['rotation','radius']){
  let el=svg.querySelector(`[data-testid="f117-${type}-handle"]`);
  if(!interactive){el?.remove();continue;}
  if(!el){el=E('circle',{r:27,fill:'transparent',stroke:'transparent',class:`f117-${type}-handle`,tabindex:0,role:'slider','data-testid':`f117-${type}-handle`,style:'touch-action:none'},svg)}
  let a=type==='rotation'?p[0]:point(...C,0,r);el.setAttribute('cx',a[0]);el.setAttribute('cy',a[1]);el.setAttribute('aria-label',type==='rotation'?'Rotate polygon on the circle. Arrow keys rotate by five degrees.':'Resize the circumcircle. Arrow keys adjust radius.');el.setAttribute('aria-valuemin',type==='rotation'?-180:120);el.setAttribute('aria-valuemax',type==='rotation'?180:200);el.setAttribute('aria-valuenow',String(type==='rotation'?rotation:r));
  // High-contrast ring makes interactive grip discoverable at desktop and mobile.
  ring(g,...a,12,type==='rotation'?'result':'op');
  // Grips remain stationary DOM nodes above the replaced geometry; capture survives each frame.
 }
 return{p,f};
}
function draw(stage,opt={}){let box=shell(stage),n=opt.n||S.n,r=opt.radius||S.radius,rotation=opt.rotation??S.rotation,phase=opt.phase??8,view=opt.show||'all';
 let aside=H('aside',{class:'f117-aside','data-testid':'f117-aside'});let cards=[card('EQUAL SIDES',String(n),`All ${n} vertices lie on the same circle.`),card('CENTRE ANGLE',!opt.hide&&phase>=5?deg(360/n):'?',`One complete turn is shared equally.`),card('INTERIOR ANGLE',!opt.hide&&phase>=6?deg(180-360/n):'?',`Interior plus exterior is 180°.`),card('EXTERIOR ANGLE',!opt.hide&&phase>=6?deg(360/n):'?',`Equal turns total 360°.`)];aside.append(...cards);box.layout.append(aside);
 const repaint=(next={})=>{Object.assign(opt,next);let f=geometry(box.svg,{...opt,n:opt.n||n,radius:opt.radius||r,rotation:opt.rotation??rotation,phase:opt.phase??phase,show:opt.show||view});for(let i=1;i<=3;i++)cards[i].querySelector('.f117-main').textContent=opt.hide?'?':i===1?(opt.phase??phase)>=5?deg(f.f.central):'?':(opt.phase??phase)>=6?deg(i===2?f.f.interior:f.f.exterior):'?';return f;};
 repaint();N.scene.helperStrip(box.sec,opt.pose||'explain',opt.caption||'Every regular polygon can be built from equally spaced points on a circle.');return{...box,repaint};}
const STEPS=[
 {name:'Begin with a circle',n:5,phase:0,pose:'explain',narration:'Start with one circle. Every point on its edge is the same distance from the centre.'},
 {name:'Locate the centre',n:5,phase:1,pose:'point-down',narration:'Mark the centre and see two diameters cross. The entire turn around the centre is three hundred and sixty degrees.'},
 {name:'Place the first vertex',n:5,phase:2,pose:'show-one',narration:'Place the first vertex on the circumference. Its distance from the centre is the radius.'},
 {name:'Place equal steps',n:5,phase:3,pose:'count',narration:'Space the vertices equally around the circle, then join neighbouring points with straight segments.'},
 {name:'Join every neighbour',n:5,phase:4,pose:'ruler',narration:'Five equal chord lengths make a regular pentagon. Each corner has the same interior angle.'},
 {name:'Reveal one centre sector',n:5,phase:5,pose:'magnify',narration:'Five identical centre sectors share one complete revolution. Each centre angle is seventy-two degrees.'},
 {name:'Five equal sectors',n:5,phase:6,pose:'show-three',narration:'Each sector contains two equal radii. Every centre angle is the same, so every chord is equal.'},
 {name:'Interior angles',n:5,phase:7,pose:'think',narration:'The inside angle of a regular pentagon is one hundred and eight degrees.'},
 {name:'Exterior angles',n:5,phase:8,show:'exterior',pose:'point-right',narration:'Each exterior turn is seventy-two degrees. Five identical turns make three hundred and sixty degrees.'},
 {name:'Build a triangle',n:3,phase:8,show:'central',pose:'compare',narration:'Three equal centre sectors measure one hundred and twenty degrees each, making an equilateral triangle.'},
 {name:'Build a square',n:4,phase:8,show:'interior',pose:'count',narration:'A square has four equal right angles, each ninety degrees.'},
 {name:'Build a hexagon',n:6,phase:8,show:'all',pose:'idea',narration:'Six equal centre angles are sixty degrees each. The inside angles are each one hundred and twenty degrees.'},
 {name:'Generalise for n sides',n:8,phase:8,show:'all',pose:'ruler',narration:'For any regular polygon, divide three hundred and sixty by the number of sides for its centre and exterior angles.'},
 {name:'Prove the interior angle',n:10,phase:8,show:'interior',pose:'celebrate',narration:'An interior angle is one hundred and eighty minus the exterior angle. That works for every regular polygon.'}
];
function render(i,stage){let s=STEPS[i]||STEPS[0];draw(stage,{...s,radius:188,rotation:-90,hide:false,caption:s.narration});}
function svgPt(svg,ev){let p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;let m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):p;}
function fastDrag(handle,svg,getState,project,update){let active=null;
 handle.addEventListener('pointerdown',ev=>{if((ev.pointerType==='mouse'&&ev.button!==0)||N.ui._drag)return;ev.preventDefault();let id=ev.pointerId,start=getState(),pending=null,raf=0,drag={cancel:()=>cancel(),captured:true,moved:true};active=drag;N.ui._drag=drag;
 const apply=()=>{raf=0;if(pending!==null){update(pending,true);pending=null}};
 const move=e=>{if(e.pointerId!==id)return;e.preventDefault();pending=project(svgPt(svg,e));if(!raf)raf=requestAnimationFrame(apply)};
 const clear=()=>{cancelAnimationFrame(raf);active=null;if(N.ui._drag===drag)N.ui._drag=null;handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',cancel);handle.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);try{handle.releasePointerCapture(id)}catch(_){}};
 const up=e=>{if(e.pointerId!==id)return;let last=project(svgPt(svg,e));clear();update(last,false)};
 const cancel=()=>{clear();update(start,false)};const lost=()=>{if(active)cancel()};const key=e=>{if(e.key==='Escape'){e.preventDefault();cancel()}};
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',cancel);handle.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);handle.setPointerCapture(id);
 });
 handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const delta=['ArrowLeft','ArrowDown'].includes(e.key)?-1:1;update(getState()+delta*(handle.dataset.testid==='f117-radius-handle'?5:5),false)});
}
function explore(panel,stage){panel.classList.add('f117-tools');let state={...S};
 let preset=H('select',{class:'nova-input','data-testid':'f117-preset','aria-label':'Choose lesson or polygon preset'});
 for(const [key,p] of Object.entries(CFG.presets))preset.append(H('option',{value:key,text:p.label}));preset.value=state.preset;
 let count=H('input',{type:'range',min:'3',max:'12',step:'1',value:String(state.n),'data-testid':'f117-sides'}),countRead=H('span',{class:'f117-value',text:String(state.n)});
 let radius=H('input',{type:'range',min:'120',max:'200',step:'1',value:String(state.radius),'data-testid':'f117-radius'}),radiusRead=H('span',{class:'f117-value',text:String(state.radius)});
 let rotation=H('input',{type:'range',min:'-180',max:'180',step:'5',value:String(state.rotation),'data-testid':'f117-rotation'}),rotationRead=H('span',{class:'f117-value',text:deg(state.rotation)});
 let view=H('select',{class:'nova-input','data-testid':'f117-view'},['all','central','interior','exterior'].map(k=>H('option',{value:k,text:k==='all'?'Show all angles':k==='central'?'Centre sector only':k==='interior'?'Interior angle only':'Exterior turn only'})));
 let choices=H('div',{class:'f117-actions f117-wide'});
 const wrap=(txt,control)=>H('label',{},[txt,control]);
 panel.append(wrap('Lesson preset',preset),wrap('Sides (n)',H('div',{class:'f117-explorebar'},[count,countRead])),wrap('Circle radius',H('div',{class:'f117-explorebar'},[radius,radiusRead])),wrap('Polygon rotation',H('div',{class:'f117-explorebar'},[rotation,rotationRead])),wrap('Angle highlight',view),choices,prose('Drag the gold vertex to rotate the whole polygon, or the orange radius grip to resize the circle. Every vertex remains equally spaced on the circumference. Arrow keys work on both grips.'));
 let box;function repaint(){countRead.textContent=state.n;radiusRead.textContent=state.radius;rotationRead.textContent=deg(state.rotation);let p=calc(state.n);if(!box){box=draw(stage,{...state,phase:8,interactive:true,free:true,caption:'The circle divides into equal sectors; change the number of sides or drag a vertex.'});}else box.repaint({...state,n:state.n,phase:8,interactive:true,free:true,hide:false});
 box.sec.querySelector('.f117-card .f117-main').textContent=state.n;box.sec.querySelector('.f117-card .f117-sub').textContent=`All ${state.n} vertices lie on the same circle.`;
 const rotHandle=box.svg.querySelector('[data-testid="f117-rotation-handle"]'),radiusHandle=box.svg.querySelector('[data-testid="f117-radius-handle"]');
 if(rotHandle&&!rotHandle.dataset.ready){rotHandle.dataset.ready='true';fastDrag(rotHandle,box.svg,()=>state.rotation,p=>{let a=Math.atan2(p.y-C[1],p.x-C[0])*180/Math.PI;return clamp(Math.round(a/5)*5,-180,180)},v=>{state.rotation=v;rotation.value=v;rotationRead.textContent=deg(v);box.repaint({...state,n:state.n,phase:8,interactive:true});emit('rotation',v)});}
 if(radiusHandle&&!radiusHandle.dataset.ready){radiusHandle.dataset.ready='true';fastDrag(radiusHandle,box.svg,()=>state.radius,p=>clamp(Math.round(Math.hypot(p.x-C[0],p.y-C[1])),120,200),v=>{state.radius=v;radius.value=v;radiusRead.textContent=v;box.repaint({...state,n:state.n,phase:8,interactive:true});emit('radius',v)});}
 }
 preset.onchange=()=>{state.preset=preset.value;state.n=CFG.presets[state.preset].n;count.value=state.n;emit('preset',state.preset);repaint()};
 count.oninput=()=>{state.n=Number(count.value);emit('sides',state.n);repaint()};radius.oninput=()=>{state.radius=Number(radius.value);emit('radius',state.radius);repaint()};rotation.oninput=()=>{state.rotation=Number(rotation.value);emit('rotation',state.rotation);repaint()};view.onchange=()=>{state.show=view.value;emit('show',state.show);repaint()};
 choices.append(btn('Triangle',()=>{count.value=3;count.oninput()},'nova-btn ghost'),btn('Hexagon',()=>{count.value=6;count.oninput()},'nova-btn ghost'),btn('Decagon',()=>{count.value=10;count.oninput()},'nova-btn ghost'),btn('Restore circle',()=>{state={n:5,radius:188,rotation:-90,show:'all',preset:'y7'};preset.value='y7';count.value=5;radius.value=188;rotation.value=-90;view.value='all';emit('reset','y7');repaint()},'nova-btn primary'));
 repaint();}
const REASONS={centre:'A full 360° revolution is divided equally among n centre sectors',straight:'Interior and exterior angles form a straight angle of 180°',turn:'The n equal exterior turns of a regular polygon total 360°',triangles:'An n-sided polygon can be divided into n − 2 triangles'};
const TASKS=[
 {n:3,kind:'central',answer:120,reason:'centre',q:'A regular triangle is made from three equal sectors. What is the angle at the centre?',hint:'Share 360° among three sectors.'},
 {n:5,kind:'central',answer:72,reason:'centre',q:'Find one central angle in a regular pentagon.',hint:'360° divided by five.'},
 {n:6,kind:'interior',answer:120,reason:'straight',q:'A regular hexagon has an exterior angle of 60°. Find the interior angle.',hint:'Subtract the exterior from 180°.'},
 {n:8,kind:'exterior',answer:45,reason:'turn',q:'Find one exterior angle of a regular octagon.',hint:'Eight equal turns make 360°.'},
 {n:10,kind:'central',answer:36,reason:'centre',q:'Ten equally spaced vertices make a decagon. What is the central angle?',hint:'Divide 360° by ten.'},
 {n:7,kind:'total',answer:900,reason:'triangles',q:'What is the sum of all interior angles in a heptagon?',hint:'Divide it into n − 2 triangles.'},
 {n:9,kind:'interior',answer:140,reason:'straight',q:'A regular nonagon has an exterior turn of 40°. What is its interior angle?',hint:'An inside angle and its exterior turn add to 180°.'},
 {n:12,kind:'exterior',answer:30,reason:'turn',q:'Find one exterior turn of a regular 12-sided polygon.',hint:'Twelve identical exterior turns total 360°.'}
];
function cardDrag(el,txt,target,choose){el.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;const id=e.pointerId,x=e.clientX,y=e.clientY;let ghost=null,drag={cancel:()=>cancel(),captured:true,moved:true};
 function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-x,ev.clientY-y)>7){ghost=H('div',{class:'f117-ghost',text:txt});document.body.append(ghost);N.ui._drag=drag;}if(ghost){ghost.style.left=ev.clientX+12+'px';ghost.style.top=ev.clientY+12+'px';const b=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom);ev.preventDefault();}}
 function clear(){ghost?.remove();target.dataset.hover='false';if(N.ui._drag===drag)N.ui._drag=null;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',cancel);el.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);try{el.releasePointerCapture(id)}catch(_){}}
 function up(ev){if(ev.pointerId!==id)return;const b=target.getBoundingClientRect(),hit=ghost&&ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom;clear();if(hit)choose()}
 function cancel(){clear()};function lost(){clear()};function key(ev){if(ev.key==='Escape'){ev.preventDefault();cancel()}}
 el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',cancel);el.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(_){}
 });}
function challenge(panel,api,stage){panel.classList.add('f117-tools');let index=0;
 function show(){let t=TASKS[index];panel.replaceChildren();panel.append(H('div',{class:'pr-task f117-wide',text:`CHALLENGE ${index+1} / ${TASKS.length}`}),prose(t.q));
 let answer=H('input',{class:'nova-input','data-testid':'f117-answer',type:'number',step:'any',placeholder:'Degrees','aria-label':'Answer in degrees'});panel.append(H('label',{class:'f117-wide'},['ANGLE / TOTAL (°)',answer]));
 let choices=H('div',{class:'f117-reasons f117-wide'}),drop=H('div',{class:'f117-drop f117-wide','data-testid':'f117-reason-drop',text:'Choose or drag the correct mathematical reason here'}),chosen=null;
 let pick=k=>{chosen=k;drop.textContent=REASONS[k];drop.dataset.set='true';emit('reason',k);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))};
 for(const [k,s] of Object.entries(REASONS)){let b=H('button',{class:'f117-reason',type:'button','data-reason':k,'aria-pressed':'false',text:s,onclick:()=>pick(k)});choices.append(b);cardDrag(b,s,drop,()=>pick(k));}
 panel.append(choices,drop);let buttons=H('div',{class:'f117-actions f117-wide'});panel.append(buttons);
 function diagram(reveal=false){draw(stage,{n:t.n,radius:188,rotation:-90,phase:8,show:t.kind==='total'?'all':t.kind==='central'?'central':t.kind==='interior'?'interior':'exterior',hide:!reveal,pose:reveal?'celebrate':'think',caption:reveal?'Your value and mathematical reason are correct.':'Count the equal sectors or angles; give both your answer and its reason.'})}
 let check=btn('Check angle + reason',()=>{let a=Number(answer.value),msg='';if(!answer.value.trim()||!Number.isFinite(a))msg='Enter a numerical angle in degrees.';else if(Math.abs(a-t.answer)>.01){if(Math.abs(a-(180-t.answer))<.01)msg='You found the supplementary angle instead. Check the question.';else if(a===360&&t.kind!=='total')msg='360° is one complete revolution; you need one equal angle.';else if(a===180*t.n)msg='For an interior-angle total, use n minus two triangles.';else msg=t.kind==='total'?'Split into n minus two triangles; each adds 180°.':'Check whether to divide 360° or subtract the exterior from 180°.'}else if(chosen!==t.reason)msg='That value is correct, but the chosen reason does not prove it.';
 if(msg){api.check(false,msg,{task:index+1});return;}api.check(true,`${deg(t.answer)}. ${REASONS[t.reason]}.`,{task:index+1,answer:t.answer,reason:chosen});emit('answer',{task:index+1,answer:a,reason:chosen});diagram(true);buttons.replaceChildren();if(index===TASKS.length-1)buttons.append(H('strong',{class:'f117-complete',text:'8 / 8 · REGULAR POLYGONS MASTERED'}));else buttons.append(btn('Next challenge →',()=>{index++;emit('task',index+1);show()},'nova-btn primary'))},'nova-btn primary');
 buttons.append(check,btn('Hint',()=>api.hint(t.hint)));answer.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()});diagram(false);
 }show();}
const def={id:ID,title:'Regular Polygon Builder',config:CFG,steps:STEPS,render,explore,challenge,alt:'Regular polygon from equal points on a circumscribed circle, with accurate central, interior and exterior angle relationships.',staticAlt:'A regular n-gon has equal central and exterior angles 360 divided by n degrees. Each interior angle is 180 degrees minus 360 divided by n.',exploreIntro:'Change the number of sides, rotate or resize the regular polygon, and highlight central, interior and exterior angles.',onRestore:()=>{Object.assign(S,{n:5,radius:188,rotation:-90,preset:'y7',show:'all'});emit('reset','y7')}};
N.registry.add({id:ID,title:'Regular Polygon Builder',family:'F11',topics:['regular polygon','central angles','exterior angles','interior angles','circle','construction'],deps:['F0-02','F0-04','F0-07','F0-08','F11-06']});
N.bankMount({id:ID,num:'07',title:'Regular Polygon Builder · Premium Edition',def,linked:['F11-06','F11-11','F12-01'],years:'Year 7–9 · Regular polygons and angular reasoning',spec:{purpose:'Build exact regular polygons by equally spaced points on a circle and derive the centre, interior and exterior angles.',params:'Side count 3–12, circumradius 120–200, rotation, centre/interior/exterior view.',presets:'Y7-044 regular pentagon; Y8-049 hexagon; Y9-026 octagon; triangle; square; decagon.',steps:'14 sequential construction and proof states.',interactions:'Pointer-captured rotation and radius handles, keyboard and slider equivalents, answer-and-reason challenges.',traps:'Confusing central and interior angles, using 360° without division, forgetting n−2 triangles.',gcse:'Generalising for arbitrary n and multi-step polygon problems.'}});
})();
