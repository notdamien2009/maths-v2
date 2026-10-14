/* NOVA F11-08 Compass Constructions, Premium Review.
 * Geometry is calculated (not sketched): circle intersections, midpoint and
 * angle-bisector rays are functions of the same data used for the labels.
 * F0/F1 core is inherited verbatim. No private replacements for core methods. */
const F118_CONFIG=Object.freeze({id:'F11-08',family:'F11',defaultPreset:'y7_056',presets:{
 y7_056:{label:'Y7-056 · Perpendicular bisector',kind:'perpendicular'},
 y7_057:{label:'Y7-057 · Equilateral construction',kind:'equilateral'},
 y8_050:{label:'Y8-050 · Angle bisector',kind:'angle'},
 y8_051:{label:'Y8-051 · Fixed-distance locus',kind:'locus'},
 y8_056:{label:'Y8-056 · SSS construction',kind:'sss'},
 y9_027:{label:'Y9-027 · Intersecting loci',kind:'locus'},
 y9_028:{label:'Y9-028 · SSS congruence',kind:'sss'}},
 events:{value:['preset','kind','radius','angle','sideA','sideB','phase','answer','reason','task','reset'],types:['step','mode','correct','hintUsed']}});
window.F118_CONFIG=F118_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-08',TAU=Math.PI*2,CFG=F118_CONFIG;
N.premium?.enable?.();
const S={kind:'perpendicular',preset:'y7_056',radius:205,angle:70,sideA:220,sideB:260,phase:6};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rd=n=>Math.round(n*100)/100;
const fmt=n=>n==null?'?':Math.abs(n-Math.round(n))<1e-6?String(Math.round(n)):Number(n.toFixed(2)).toString();
const emit=(key,value)=>{if(!CFG.events.value.includes(key))throw Error('Unregistered '+key);N.events.emit('value',{engine:ID,key,value})};
const v=(x,y)=>({x,y});
const add=(a,b)=>v(a.x+b.x,a.y+b.y);
const sub=(a,b)=>v(a.x-b.x,a.y-b.y);
const mul=(a,k)=>v(a.x*k,a.y*k);
const len=a=>Math.hypot(a.x,a.y);
const unit=a=>mul(a,1/len(a));
const dist=(a,b)=>len(sub(a,b));
const mid=(a,b)=>mul(add(a,b),.5);
const polar=(p,angle,r)=>v(p.x+r*Math.cos(angle),p.y+r*Math.sin(angle));
const btn=(txt,fn,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text:txt,onclick:fn});
const prose=txt=>H('p',{class:'f118-explain f118-wide',text:txt});
const line=(g,a,b,role='given',width=5)=>N.neonLine(g,a.x,a.y,b.x,b.y,{role,width});
const ring=(g,p,r=8,role='given')=>N.neonRing(g,p.x,p.y,{r,role,pulse:false});
const chalk=(g,p,txt,role='given',size=28,anchor='middle')=>N.chalkText(g,p.x,p.y,String(txt),{role,size,anchor});
const circle=(g,c,r,role='given',width=3)=>N.neonPath(g,`M ${c.x-r} ${c.y} A ${r} ${r} 0 1 0 ${c.x+r} ${c.y} A ${r} ${r} 0 1 0 ${c.x-r} ${c.y}`,{role,width});
function arc(g,c,r,a,b,role='op',width=3.3){const p=polar(c,a,r),q=polar(c,b,r),dt=b-a;N.neonPath(g,`M ${p.x} ${p.y} A ${r} ${r} 0 ${Math.abs(dt)>Math.PI?1:0} ${dt>=0?1:0} ${q.x} ${q.y}`,{role,width});}
function intersect(a,ra,b,rb){const d=dist(a,b);if(!d||d>ra+rb||d<Math.abs(ra-rb))return null;const ux=unit(sub(b,a)),x=(ra*ra-rb*rb+d*d)/(2*d),h=Math.sqrt(Math.max(0,ra*ra-x*x)),m=add(a,mul(ux,x)),perp=v(-ux.y,ux.x);return [add(m,mul(perp,h)),sub(m,mul(perp,h))]}
function models(kind,st=S){if(kind==='perpendicular'){const A=v(213,293),B=v(523,293),r=clamp(st.radius,168,253),pq=intersect(A,r,B,r);return{kind,A,B,r,M:mid(A,B),P:pq[0].y<pq[1].y?pq[0]:pq[1],Q:pq[0].y<pq[1].y?pq[1]:pq[0],length:dist(A,B)}}
 if(kind==='angle'){const O=v(258,368),A=v(526,368),rad=clamp(st.angle,30,130)*Math.PI/180,B=polar(O,-rad,268),r=160,P=polar(O,0,r),Q=polar(O,-rad,r),t=170;const xx=intersect(P,t,Q,t);let angdir=polar(v(0,0),-rad/2,1);let I=xx[0],J=xx[1];if(len(I)>len(J)){/* select intersection which lies inside angle, then beyond chosen arc */} const candidates=[I,J].sort((p,q)=>len(sub(q,O))-len(sub(p,O)));I=candidates[0];return{kind,O,A,B,P,Q,I,rayEnd:polar(O,-rad/2,278),angle:clamp(st.angle,30,130),half:clamp(st.angle,30,130)/2,markRadius:r,arcRadius:t}}
 if(kind==='sss'||kind==='equilateral'){const A=v(212,370),B=v(516,370),AB=304,a=kind==='equilateral'?AB:clamp(st.sideA,180,280),b=kind==='equilateral'?AB:clamp(st.sideB,180,280),ps=intersect(A,a,B,b),C=ps[0].y<ps[1].y?ps[0]:ps[1];return{kind,A,B,C,a,b,AB}}
 if(kind==='locus'){let A=v(262,296),B=v(480,296),r=clamp(st.radius,125,245),pq=intersect(A,r,B,r);return{kind,A,B,r,P:pq[0].y<pq[1].y?pq[0]:pq[1],Q:pq[0].y<pq[1].y?pq[1]:pq[0]}}}
function card(title,value,sub){return H('section',{class:'f118-card'},[H('div',{class:'f118-eyebrow',text:title}),H('div',{class:'f118-main',text:String(value)}),H('p',{class:'f118-sub',text:sub})])}
function stageShell(stage){stage.replaceChildren();let sec=H('section',{class:'f118-theatre','data-testid':'f118-stage'});sec.append(H('div',{class:'f118-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f118-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f118-layout'}),plane=H('div',{class:'f118-plane'}),svg=N.svg.root(730,530,'Compass and straightedge geometry with circle arcs, exact intersections and highlighted construction steps');svg.classList.add('nv-svg','f118-svg');svg.dataset.testid='f118-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','123 13 490 512');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return {sec,layout,plane,svg}}
function handle(svg,g,name,p,min,max,value,label){let h=svg.querySelector(`[data-testid="f118-${name}-handle"]`);if(!h){h=E('circle',{r:27,fill:'transparent',stroke:'transparent',class:'f118-construction-handle',tabindex:0,role:'slider','data-testid':`f118-${name}-handle`,style:'touch-action:none'},svg)}h.setAttribute('cx',p.x);h.setAttribute('cy',p.y);h.setAttribute('aria-label',label);h.setAttribute('aria-valuemin',min);h.setAttribute('aria-valuemax',max);h.setAttribute('aria-valuenow',String(value));ring(g,p,12,'result');return h}
function diagram(svg,opts={}){const old=svg.querySelector('[data-testid=f118-geometry]');old?.remove();let g=E('g',{'data-testid':'f118-geometry',style:'pointer-events:none'},svg);const first=svg.querySelector('.f118-construction-handle');if(first)svg.insertBefore(g,first);
const kind=opts.kind||'perpendicular',m=models(kind,opts),phase=opts.phase??6,hide=!!opts.hide,editable=!!opts.editable;
const stroke=(a,b,role='given',w=5)=>line(g,a,b,role,w);
// All geometry is rederived for each repaint, not transformed independently of the maths.
if(kind==='perpendicular'){
 let {A,B,P,Q,M,r}=m;
 if(phase>=1){stroke(A,B,'given',7);ring(g,A,8,'given');ring(g,B,8,'given');chalk(g,add(A,v(-20,32)),'A');chalk(g,add(B,v(20,32)),'B')}
 if(phase>=2){arc(g,A,r,-1.18,1.18,'op',3.8);if(phase<=2)ring(g,A,11,'op')}
 if(phase>=3){arc(g,B,r,Math.PI-1.18,Math.PI+1.18,'focus',3.8)}
 if(phase>=4){ring(g,P,9,'result');ring(g,Q,9,'result');chalk(g,add(P,v(-24,-10)),'P','result',25);chalk(g,add(Q,v(-24,26)),'Q','result',25)}
 if(phase>=5){stroke(P,Q,'result',6);ring(g,M,10,'result');N.neonPath(g,`M${M.x+16} ${M.y} L${M.x+16} ${M.y-16} L${M.x} ${M.y-16}`,{role:'focus',width:3});chalk(g,add(M,v(-24,-14)),'M','focus',24)}
 if(phase>=6&&!hide){chalk(g,v(368,94),'90° AT M','focus',30);chalk(g,v(368,510),'AM = MB','result',29)}
 if(editable)handle(svg,g,'radius',polar(A,0,r),168,253,r,'Drag compass radius. Arrow keys adjust by five units.');
 }else if(kind==='angle'){
 let {O,A,B,P,Q,I,rayEnd,angle,half,markRadius,arcRadius}=m;
 if(phase>=1){stroke(O,A,'given',6);stroke(O,B,'given',6);ring(g,O,9,'given');chalk(g,add(O,v(-19,30)),'O');chalk(g,add(A,v(15,16)),'A');chalk(g,add(B,v(15,-15)),'B');arc(g,O,49,-angle*Math.PI/180,0,'focus',4)}
 if(phase>=2){arc(g,O,markRadius,-angle*Math.PI/180,0,'op',3.8);ring(g,P,7,'result');ring(g,Q,7,'result')}
 if(phase>=3){let t=Math.atan2(I.y-P.y,I.x-P.x);arc(g,P,arcRadius,t-.76,t+.76,'op',3.8)}
 if(phase>=4){let t=Math.atan2(I.y-Q.y,I.x-Q.x);arc(g,Q,arcRadius,t-.76,t+.76,'focus',3.8);ring(g,I,9,'result');chalk(g,add(I,v(23,-8)),'I','result',24)}
 if(phase>=5){stroke(O,rayEnd,'result',6);arc(g,O,66,-angle*Math.PI/180,-angle*Math.PI/360,'op',3);arc(g,O,76,-angle*Math.PI/360,0,'focus',3)}
 if(phase>=6&&!hide){chalk(g,v(365,96),`${fmt(angle)}° ÷ 2 = ${fmt(half)}°`,'focus',31);chalk(g,v(364,507),'TWO EQUAL ANGLES','result',27)}
 if(editable)handle(svg,g,'angle',B,30,130,angle,'Rotate the upper ray. Arrow keys change its angle by five degrees.');
 }else if(kind==='sss'||kind==='equilateral'){
 const {A,B,C,a,b,AB}=m;
 if(phase>=1){stroke(A,B,'given',7);ring(g,A,8,'given');ring(g,B,8,'given');chalk(g,add(A,v(-15,31)),'A');chalk(g,add(B,v(18,31)),'B');chalk(g,v(364,404),`${fmt(AB)} UNITS`,'given',24)}
 if(phase>=2){let t=Math.atan2(C.y-A.y,C.x-A.x);arc(g,A,a,t-.68,t+.68,'op',3.7)}
 if(phase>=3){let t=Math.atan2(C.y-B.y,C.x-B.x);arc(g,B,b,t-.68,t+.68,'focus',3.7)}
 if(phase>=4){ring(g,C,9,'result');chalk(g,add(C,v(0,-25)),'C','result',27)}
 if(phase>=5){stroke(A,C,'op',6);stroke(B,C,'focus',6)}
 if(phase>=6&&!hide){chalk(g,v(366,100),kind==='equilateral'?'THREE EQUAL SIDES':'SSS · THREE GIVEN SIDES','focus',28);chalk(g,v(365,488),kind==='equilateral'?'EACH ANGLE = 60°':`AC = ${fmt(a)} · BC = ${fmt(b)}`,'result',27)}
 if(editable&&kind==='sss'){handle(svg,g,'sideA',polar(A,0,a),180,280,a,'Change the first compass radius AC with pointer or arrow keys.');handle(svg,g,'sideB',polar(B,Math.PI,b),180,280,b,'Change the second compass radius BC with pointer or arrow keys.');}
 }else if(kind==='locus'){
 const {A,B,P,Q,r}=m;
 if(phase>=1){ring(g,A,10,'op');ring(g,B,10,'focus');chalk(g,add(A,v(-22,25)),'A','op');chalk(g,add(B,v(23,25)),'B','focus');stroke(A,B,'given',3)}
 if(phase>=2){circle(g,A,r,'op',3.2)}
 if(phase>=3){circle(g,B,r,'focus',3.2)}
 if(phase>=4){ring(g,P,9,'result');ring(g,Q,9,'result');chalk(g,add(P,v(-24,-14)),'P','result',24);chalk(g,add(Q,v(-24,25)),'Q','result',24)}
 if(phase>=5){stroke(A,P,'op',3.2);stroke(B,P,'focus',3.2);stroke(A,Q,'op',3.2);stroke(B,Q,'focus',3.2)}
 if(phase>=6&&!hide){chalk(g,v(366,74),`AP = BP = ${fmt(r)}`,'result',28);chalk(g,v(366,507),'TWO LOCI INTERSECT','focus',27)}
 if(editable)handle(svg,g,'radius',polar(A,Math.PI/2,r),125,245,r,'Change equal-distance locus radius with pointer or arrow keys.');
 }
 // Keep all hit targets at top level, above glow, to avoid pointer loss on redraw.
 for(const h of Array.from(svg.querySelectorAll('.f118-construction-handle')))if(!editable||!(kind==='sss'&&['sideA','sideB'].includes(h.dataset.testid?.split('-')[1]))&& !((kind==='perpendicular'||kind==='locus')&&h.dataset.testid==='f118-radius-handle')&& !(kind==='angle'&&h.dataset.testid==='f118-angle-handle'))h.remove();
 return m;
}
function draw(stage,opts={}){let box=stageShell(stage),kind=opts.kind||S.kind,phase=opts.phase??6,hidden=!!opts.hide;let aside=H('aside',{class:'f118-aside','data-testid':'f118-aside'}),cards=[];const details=info(kind,opts,phase,hidden);if(hidden){details.r='?';details.proof='?';details.result='?';}cards.push(card('CONSTRUCTION',details.title,details.sub),card('COMPASS OPENING',details.r,details.rText),card('GEOMETRIC EVIDENCE',details.proof,details.proofText),card('RESULT',details.result,details.resultText));aside.append(...cards);box.layout.append(aside);
function repaint(next={}){Object.assign(opts,next);let k=opts.kind||kind,p=opts.phase??phase,h=!!opts.hide;let m=diagram(box.svg,{...opts,kind:k,phase:p,hide:h});let d=info(k,opts,p,h);if(h){d.r='?';d.proof='?';d.result='?';}[[d.title,d.sub],[d.r,d.rText],[d.proof,d.proofText],[d.result,d.resultText]].forEach((x,i)=>{cards[i].querySelector('.f118-main').textContent=x[0];cards[i].querySelector('.f118-sub').textContent=x[1]});return m;}
repaint();N.scene.helperStrip(box.sec,opts.pose||'explain',opts.caption||'Use the same compass opening to make accurate construction arcs.');return {...box,repaint}}
function info(kind,opts,phase,hidden){let m=models(kind,opts),show=phase>=6&&!hidden;return{
 perpendicular:{title:'Perpendicular bisector',sub:'Keep the compass opening equal from A and B.',r:phase>=2?fmt(m.r):'?',rText:'Greater than half the given segment.',proof:phase>=5?'AB ⟂ PQ':'?',proofText:'Arc intersections define a perpendicular line.',result:show?'AM = MB':'?',resultText:'The midpoint is equally distant from A and B.'},
 angle:{title:'Angle bisector',sub:'Copy equal arcs from the first two ray marks.',r:phase>=2?fmt(m.markRadius):'?',rText:'Use equal compass settings for both arcs.',proof:phase>=5?'TWO EQUAL PARTS':'?',proofText:'The bisector divides the angle exactly in half.',result:show?`${fmt(m.half)}° + ${fmt(m.half)}°`:'?',resultText:'Each half is one half of the original angle.'},
 equilateral:{title:'Equilateral triangle',sub:'Place the compass radius equal to AB.',r:phase>=2?fmt(m.AB):'?',rText:'Same radius used from both endpoints.',proof:phase>=5?'AB = BC = CA':'?',proofText:'Two equal-radius circles meet at C.',result:show?'60° EACH':'?',resultText:'Three equal interior angles.'},
 sss:{title:'SSS triangle',sub:'Two radii determine the third vertex C.',r:phase>=2?`${fmt(m.a)}, ${fmt(m.b)}`:'?',rText:'AC and BC radii are measured separately.',proof:phase>=5?'THREE FIXED SIDES':'?',proofText:'Each side is an exact given length.',result:show?'SSS CONGRUENCE':'?',resultText:'Matching three side lengths fixes a triangle up to reflection.'},
 locus:{title:'Two distance loci',sub:'Each circle is the locus of equal distance.',r:phase>=2?fmt(m.r):'?',rText:'Every point on a circle shares its radius.',proof:phase>=5?'AP = BP':'?',proofText:'Both distances match at a crossing.',result:show?'TWO POINTS':'?',resultText:'The intersection points satisfy both conditions.'}
 }[kind]}
const STEPS=[
 {kind:'perpendicular',phase:0,name:'The construction challenge',pose:'explain',narration:'We need a line that cuts a segment exactly in half and meets it at a right angle.'},
 {kind:'perpendicular',phase:1,name:'Draw segment AB',pose:'point-down',narration:'Draw a straight segment from A to B. Its midpoint is not marked yet.'},
 {kind:'perpendicular',phase:2,name:'Keep one compass opening',pose:'ruler',narration:'Open the compass wider than half the segment and draw an arc centred at A.'},
 {kind:'perpendicular',phase:3,name:'Repeat from B',pose:'compare',narration:'Without changing the opening, draw the second arc from B.'},
 {kind:'perpendicular',phase:4,name:'Mark both crossings',pose:'show-two',narration:'The two arc crossings are equally far from A and B.'},
 {kind:'perpendicular',phase:5,name:'Join P and Q',pose:'point-down',narration:'Join the crossings. This line meets AB at ninety degrees and exactly halfway.'},
 {kind:'perpendicular',phase:6,name:'Prove the bisector',pose:'idea',narration:'The crossing line is the perpendicular bisector. Both halves of AB are equal.'},
 {kind:'angle',phase:1,name:'Start with an angle',pose:'explain',narration:'Now we will divide an angle into two exactly equal parts.'},
 {kind:'angle',phase:2,name:'Mark equal distances',pose:'ruler',narration:'Draw one arc from the vertex. It crosses both arms at equal distances.'},
 {kind:'angle',phase:3,name:'First matching arc',pose:'count',narration:'Place the compass on the first arc mark and draw inside the angle.'},
 {kind:'angle',phase:4,name:'Second matching arc',pose:'compare',narration:'Keep the opening unchanged and draw from the second mark. The arcs cross at I.'},
 {kind:'angle',phase:5,name:'Join the crossing',pose:'point-right',narration:'Draw from the original vertex through I. This creates two equal angles.'},
 {kind:'angle',phase:6,name:'Verify the angle',pose:'celebrate',narration:'Seventy degrees divides into two angles of thirty-five degrees each.'},
 {kind:'equilateral',phase:1,name:'Base of the triangle',pose:'show-one',narration:'Start with the given base AB.'},
 {kind:'equilateral',phase:2,name:'Arc from A',pose:'ruler',narration:'Use the full length AB as your compass opening. Draw an arc above the base.'},
 {kind:'equilateral',phase:3,name:'Arc from B',pose:'count',narration:'Keep the same compass opening and draw from B.'},
 {kind:'equilateral',phase:4,name:'Find C',pose:'point-down',narration:'The arcs cross at C, which is the same distance from A and B.'},
 {kind:'equilateral',phase:5,name:'Join the triangle',pose:'show-three',narration:'Join A to C and B to C with straight edges.'},
 {kind:'equilateral',phase:6,name:'Equal sides, equal angles',pose:'celebrate',narration:'All three sides match, so each interior angle is sixty degrees.'},
 {kind:'sss',phase:6,name:'SSS lengths',pose:'compare',narration:'Different compass radii from A and B locate a triangle with three specified side lengths.'},
 {kind:'locus',phase:6,name:'Intersecting loci',pose:'idea',narration:'The points where the two circles intersect meet both distance conditions at once.'}
];
function render(i,stage){let p=STEPS[i]||STEPS[0];draw(stage,{...S,...p,hide:false,caption:p.narration})}
function svgPt(svg,e){let pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;let m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):pt}
function rotaryDrag(h,svg,current,project,update){h.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;e.preventDefault();const id=e.pointerId,initial=current();let raf=0,pending=null,active=true;
 const drag={cancel:()=>finish(true),captured:true,moved:true};N.ui._drag=drag;
 function apply(){raf=0;if(pending!==null){update(pending,true);pending=null}}
 function move(ev){if(ev.pointerId!==id||!active)return;ev.preventDefault();pending=project(svgPt(svg,ev));if(!raf)raf=requestAnimationFrame(apply)}
 function finish(restore=false,ev){if(!active)return;const val=restore?initial:ev?project(svgPt(svg,ev)):pending??current();active=false;cancelAnimationFrame(raf);pending=null;h.removeEventListener('pointermove',move);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',cancel);h.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);try{h.releasePointerCapture(id)}catch(_){}if(N.ui._drag===drag)N.ui._drag=null;update(val,false)}
 function up(ev){if(ev.pointerId===id)finish(false,ev)}function cancel(){finish(true)}function lost(){if(active)finish(true)}function key(ev){if(ev.key==='Escape'){ev.preventDefault();finish(true)}}
 h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',cancel);h.addEventListener('lostpointercapture',lost);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);try{h.setPointerCapture(id)}catch(_){finish(true)}
 });h.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(e.key))return;e.preventDefault();update(clamp(current()+(['ArrowRight','ArrowUp'].includes(e.key)?5:-5),+h.getAttribute('aria-valuemin'),+h.getAttribute('aria-valuemax')),false)})}
function explore(panel,stage){panel.classList.add('f118-tools');let state={...S};let names={perpendicular:'Perpendicular bisector',angle:'Angle bisector',equilateral:'Equilateral triangle',sss:'SSS triangle',locus:'Intersecting loci'};
let preset=H('select',{class:'nova-input','data-testid':'f118-preset','aria-label':'Choose lesson preset'});Object.entries(CFG.presets).forEach(([k,q])=>preset.append(H('option',{value:k,text:q.label})));preset.value='y7_056';
let kind=H('select',{class:'nova-input','data-testid':'f118-kind'});Object.entries(names).forEach(([k,t])=>kind.append(H('option',{value:k,text:t})));
const makeRange=(field,label,min,max,step=5)=>{let input=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(state[field]),'data-testid':`f118-${field}`}),out=H('span',{class:'f118-value',text:String(state[field])});panel.append(H('label',{class:'f118-control'},[label,H('div',{class:'f118-explorebar'},[input,out])]));return{input,out}};
panel.append(H('label',{},['Lesson preset',preset]),H('label',{},['Construction',kind]));const rad=makeRange('radius','Compass radius',125,253),ang=makeRange('angle','Given angle',30,130),sa=makeRange('sideA','Side AC',180,280),sb=makeRange('sideB','Side BC',180,280),ph=makeRange('phase','Construction step',1,6,1);
const tip=prose('Watch the compass arcs meet at exact intersections. Move the gold handle to change a radius or angle; press Escape to cancel.');panel.append(tip);let actions=H('div',{class:'f118-actions f118-wide'});panel.append(actions);let box;
function updateFields(){for(const [name,ctl] of Object.entries({radius:rad,angle:ang,sideA:sa,sideB:sb,phase:ph})){ctl.input.value=state[name];ctl.out.textContent=name==='angle'?state[name]+'°':state[name];ctl.input.parentElement.parentElement.style.display=name==='phase'||name==='radius'&&['perpendicular','locus'].includes(state.kind)||name==='angle'&&state.kind==='angle'||['sideA','sideB'].includes(name)&&state.kind==='sss'?'grid':'none';}kind.value=state.kind}
function repaint(){updateFields();if(!box){box=draw(stage,{...state,phase:state.phase,editable:true,hide:false,caption:'Every compass mark is calculated from the chosen distances. Drag a gold handle to explore.'});}else box.repaint({...state,editable:true,hide:false});const svg=box.svg;
 for(const name of ['radius','angle','sideA','sideB']){let h=svg.querySelector(`[data-testid=f118-${name}-handle]`);if(!h||h.dataset.bound)continue;h.dataset.bound='true';const src=()=>state[name],project=p=>{let m=models(state.kind,state);if(name==='angle')return clamp(Math.round(-Math.atan2(p.y-m.O.y,p.x-m.O.x)*180/Math.PI/5)*5,30,130);if(name==='radius')return clamp(Math.round((state.kind==='locus'?dist(m.A,p):dist(m.A,p))/5)*5,state.kind==='perpendicular'?168:125,state.kind==='perpendicular'?253:245);return clamp(Math.round(dist(p,name==='sideA'?m.A:m.B)/5)*5,180,280)},apply=value=>{state[name]=value;rad.input.value=state.radius;ang.input.value=state.angle;sa.input.value=state.sideA;sb.input.value=state.sideB;updateFields();box.repaint({...state,editable:true,hide:false});emit(name,value)};rotaryDrag(h,svg,src,project,apply);}
}
preset.onchange=()=>{state.preset=preset.value;state.kind=CFG.presets[state.preset].kind;state.phase=6;emit('preset',state.preset);repaint()};kind.onchange=()=>{state.kind=kind.value;state.phase=6;emit('kind',state.kind);repaint()};for(const [name,ctrl] of Object.entries({radius:rad,angle:ang,sideA:sa,sideB:sb,phase:ph}))ctrl.input.oninput=()=>{state[name]=Number(ctrl.input.value);emit(name,state[name]);repaint()};actions.append(btn('Show final construction',()=>{state.phase=6;emit('phase',6);repaint()},'nova-btn primary'),btn('Restart arcs',()=>{state.phase=1;emit('phase',1);repaint()}),btn('Restore defaults',()=>{Object.assign(state,{...S});preset.value='y7_056';emit('reset','y7_056');repaint()}));repaint()}
const REASONS={perpendicular:'Equal-radius intersecting arcs form a perpendicular bisector',midpoint:'The perpendicular bisector divides AB into two equal lengths',bisect:'An angle bisector makes two equal angles',equilateral:'Three equal side lengths make three 60° angles',sss:'Three given side lengths determine a triangle up to reflection',locus:'Every point on a circle is one radius from its centre',perimeter:'The perimeter is the sum of the three side lengths',sum:'The interior angles of a triangle sum to 180°'};
const TASKS=[
 {kind:'perpendicular',answer:90,reason:'perpendicular',q:'A compass-constructed perpendicular bisector meets AB at what angle?',hint:'Perpendicular lines meet at a right angle.'},
 {kind:'perpendicular',answer:155,reason:'midpoint',q:'AB measures 310 units. How long is AM if M is its midpoint?',hint:'The midpoint divides a line segment into two equal halves.'},
 {kind:'angle',angle:70,answer:35,reason:'bisect',q:'An angle is 70°. What is each angle after a compass bisector?',hint:'Two equal parts share the given angle.'},
 {kind:'equilateral',answer:60,reason:'equilateral',q:'What is one interior angle of a compass-constructed equilateral triangle?',hint:'All three angles are equal and total 180°.'},
 {kind:'sss',answer:784,reason:'perimeter',q:'The SSS construction has AB = 304, AC = 220 and BC = 260 units. What is the perimeter?',hint:'Add the three constructed side lengths.'},
 {kind:'locus',radius:180,answer:180,reason:'locus',q:'Point P lies on a circle of radius 180 centred at A. What is AP?',hint:'Every point on the circle is the radius from its centre.'},
 {kind:'angle',angle:110,answer:55,reason:'bisect',q:'An angle measures 110°. Find the size of one half after bisecting.',hint:'One half of 110° is required.'},
 {kind:'sss',answer:180,reason:'sum',q:'Find the sum of the three interior angles in the constructed triangle.',hint:'The angle sum of any Euclidean triangle is 180°.'}
];
function reasonDrag(el,label,target,onDrop){el.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;const id=e.pointerId,x=e.clientX,y=e.clientY;let ghost=null,drag={cancel:()=>clear(),moved:true,captured:true};function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-x,ev.clientY-y)>7){ghost=H('div',{class:'f118-ghost',text:label});document.body.append(ghost);N.ui._drag=drag;}if(ghost){ghost.style.left=ev.clientX+12+'px';ghost.style.top=ev.clientY+12+'px';let b=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom);ev.preventDefault()}}function clear(){ghost?.remove();target.dataset.hover='false';if(N.ui._drag===drag)N.ui._drag=null;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',clear);el.removeEventListener('lostpointercapture',clear);window.removeEventListener('blur',clear);window.removeEventListener('keydown',key);try{el.releasePointerCapture(id)}catch(_){}}function up(ev){if(ev.pointerId!==id)return;let b=target.getBoundingClientRect(),hit=ghost&&ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom;clear();if(hit)onDrop()}function key(ev){if(ev.key==='Escape'){ev.preventDefault();clear()}}el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',clear);el.addEventListener('lostpointercapture',clear);window.addEventListener('blur',clear);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(_){}})}
function challenge(panel,api,stage){panel.classList.add('f118-tools');let index=0;function show(){const t=TASKS[index];panel.replaceChildren();panel.append(H('div',{class:'pr-task f118-wide',text:`CHALLENGE ${index+1} / ${TASKS.length}`}),prose(t.q));let answer=H('input',{class:'nova-input',type:'number',step:'any',placeholder:'Your numerical answer','data-testid':'f118-answer','aria-label':'Construction answer'});panel.append(H('label',{class:'f118-wide'},['YOUR ANSWER',answer]));let choices=H('div',{class:'f118-reasons f118-wide'}),target=H('div',{class:'f118-drop f118-wide','data-testid':'f118-reason-drop',text:'Choose or drag a mathematical reason here'}),chosen=null;function choose(k){chosen=k;target.textContent=REASONS[k];target.dataset.set='true';emit('reason',k);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))}for(const [k,s] of Object.entries(REASONS)){let b=H('button',{type:'button',class:'f118-reason','data-reason':k,'aria-pressed':'false',text:s,onclick:()=>choose(k)});choices.append(b);reasonDrag(b,s,target,()=>choose(k))}panel.append(choices,target);let buttons=H('div',{class:'f118-actions f118-wide'});panel.append(buttons);const opts={...S,...t,phase:6,hide:true,pose:'think',caption:'Use the construction markings to work out your answer; choose the reason that proves it.'};const picture=()=>draw(stage,opts);picture();let check=btn('Check answer + reason',()=>{let a=Number(answer.value),msg='';if(!answer.value.trim()||!Number.isFinite(a))msg='Enter a number.';else if(Math.abs(a-t.answer)>1e-7){if(Math.abs(a-(180-t.answer))<1e-7)msg='You used the supplement instead of the required angle.';else if(t.kind==='angle')msg='A bisector divides the given angle into two equal parts.';else if(t.kind==='perpendicular')msg='A perpendicular line meets at 90°; a midpoint halves AB.';else if(t.kind==='locus')msg='The distance from the centre of a circle is its radius.';else msg='Recheck the equal radii or the angle sum.'}else if(chosen!==t.reason)msg='Correct number, but that reason does not justify it.';if(msg){api.check(false,msg,{task:index+1});return}api.check(true,`${fmt(t.answer)}. ${REASONS[t.reason]}.`,{task:index+1,reason:chosen,answer:t.answer});emit('answer',{task:index+1,answer:a,reason:chosen});draw(stage,{...opts,hide:false,pose:'celebrate',caption:'Correct construction reasoning—well done.'});buttons.replaceChildren();if(index===TASKS.length-1)buttons.append(H('strong',{class:'f118-finish',text:'8 / 8 · CONSTRUCTION MASTERY'}));else buttons.append(btn('Next challenge →',()=>{index++;emit('task',index+1);show()},'nova-btn primary'))},'nova-btn primary');buttons.append(check,btn('Hint',()=>api.hint(t.hint)));answer.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()})}show()}
const def={id:ID,title:'Compass Constructions',config:CFG,steps:STEPS,render,explore,challenge,alt:'Precision compass and straightedge construction: perpendicular bisector, angle bisector, SSS and equilateral triangles, and the intersection of distance loci.',staticAlt:'Compass constructions preserve a single radius per circle. Arc intersections establish perpendicular bisectors, angle bisectors, SSS triangle vertices and locus intersections.',exploreIntro:'Change compass openings, construction phases, or the given angle; drag handles to construct exact arcs and intersection points.',onRestore:()=>{Object.assign(S,{kind:'perpendicular',preset:'y7_056',radius:205,angle:70,sideA:220,sideB:260,phase:6});emit('reset','y7_056')}};
N.registry.add({id:ID,title:'Compass Constructions',family:'F11',topics:['ruler and compass','perpendicular bisector','angle bisector','congruence','loci'],deps:['F0-02','F0-04','F0-07','F11-07']});
N.bankMount({id:ID,num:'08',title:'Compass Constructions · Premium Edition',def,linked:['F11-07','F11-09','F11-13'],years:'Year 7–9 · Geometric constructions, loci and congruence',spec:{purpose:'Teach rigorous geometric constructions with equal-radius compass arcs and derived intersections.',params:'Compass radius, given angle, SSS side lengths, construction phase, preset.',presets:'Y7-056, Y7-057, Y8-050, Y8-051, Y8-056, Y9-027, Y9-028.',steps:'Twenty construction and proof states across five scenes.',interactions:'Live draggable compass/ray handles, keyboard and range equivalents; drag-and-drop reasons.',traps:'Changing compass width between matched arcs, assuming an arc is a line segment, confusing bisection and perpendicularity.',gcse:'Construct loci intersections; establish congruence by SSS.'}});
window.__F118_MATH__={models,intersect,dist,TAU};
})();
