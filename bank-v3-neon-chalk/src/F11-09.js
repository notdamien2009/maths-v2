/* NOVA F11-09 · Locus Builder · Premium Review
   Self-contained new mathematical scenes on the actual F0/F1 NOVA core.
   All marked endpoints, perpendiculars, angle arcs and locus intersections
   are calculated from the same geometric model as answer validation. */
const F119_CONFIG=Object.freeze({id:'F11-09',family:'F11',defaultPreset:'y8_051',presets:{
 y8_050:{label:'Y8-050 · Bisector constructions',kind:'perp'},
 y8_051:{label:'Y8-051 · Distance loci',kind:'point'},
 y9_027:{label:'Y9-027 · Intersecting loci',kind:'circles'},
 y9_028:{label:'Y9-028 · Equidistant points',kind:'perp'},
 y9_041:{label:'Y9-041 · Angle-bisector proof',kind:'angle'},
 y8_line:{label:'Line locus · Equal offsets',kind:'line'},
 y9_region:{label:'Compound regions · Overlap',kind:'region'}},
 events:{value:['kind','preset','radius','radiusB','distance','angle','phase','task','answer','reason','reset'],types:['step','mode','correct','hintUsed']}});
window.F119_CONFIG=F119_CONFIG;
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,ID='F11-09',CFG=F119_CONFIG,PI=Math.PI;
N.premium?.enable?.();
const DEF={kind:'point',preset:'y8_051',radius:165,radiusB:145,distance:180,angle:80,phase:6};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const fmt=v=>Number(v.toFixed(1)).toString();
const v=(x,y)=>({x,y}),add=(a,b)=>v(a.x+b.x,a.y+b.y),sub=(a,b)=>v(a.x-b.x,a.y-b.y),mul=(a,k)=>v(a.x*k,a.y*k),len=p=>Math.hypot(p.x,p.y),dist=(a,b)=>len(sub(a,b)),polar=(p,a,r)=>v(p.x+r*Math.cos(a),p.y+r*Math.sin(a));
const emit=(key,val)=>{if(!CFG.events.value.includes(key))throw Error('Unregistered value event '+key);N.events.emit('value',{engine:ID,key,value:val})};
const btn=(text,onclick,cls='nova-btn ghost')=>H('button',{type:'button',class:cls,text,onclick});
const prose=text=>H('p',{class:'f119-explain f119-wide',text});
const line=(g,a,b,role='given',width=4)=>N.neonLine(g,a.x,a.y,b.x,b.y,{role,width});
const ring=(g,p,r=8,role='result')=>N.neonRing(g,p.x,p.y,{r,role,pulse:false});
const chalk=(g,p,txt,role='given',size=27,anchor='middle')=>N.chalkText(g,p.x,p.y,String(txt),{role,size,anchor});
function circle(g,c,r,role='op',width=3){return N.neonPath(g,`M${c.x-r} ${c.y} A${r} ${r} 0 1 0 ${c.x+r} ${c.y} A${r} ${r} 0 1 0 ${c.x-r} ${c.y}`,{role,width})}
function arc(g,c,r,a,b,role='focus',width=3){const p=polar(c,a,r),q=polar(c,b,r),dt=b-a;N.neonPath(g,`M${p.x} ${p.y} A${r} ${r} 0 ${Math.abs(dt)>PI?1:0} ${dt>=0?1:0} ${q.x} ${q.y}`,{role,width})}
function intersections(a,ra,b,rb){const d=dist(a,b);if(!(d>1e-8)||d>ra+rb||d<Math.abs(ra-rb))return [];let u=mul(sub(b,a),1/d),h2=(ra*ra-((ra*ra-rb*rb+d*d)/(2*d))**2);if(h2< -1e-7)return [];let x=(ra*ra-rb*rb+d*d)/(2*d),h=Math.sqrt(Math.max(0,h2)),foot=add(a,mul(u,x)),n=v(-u.y,u.x);return [add(foot,mul(n,h)),add(foot,mul(n,-h))]}
function model(kind,st=DEF){const r=clamp(Number(st.radius)||165,90,215),rb=clamp(Number(st.radiusB)||145,85,210),distance=clamp(Number(st.distance)||180,100,240),angle=clamp(Number(st.angle)||80,35,115);
if(kind==='point')return {kind,A:v(369,280),r};
if(kind==='line')return {kind,A:v(184,275),B:v(551,275),offset:clamp(r,90,165)-35};
if(kind==='perp'){const A=v(365-distance/2,303),B=v(365+distance/2,303),rr=Math.max(distance/2+16,r);return {kind,A,B,M:v(365,303),r:rr,P:v(365,303-Math.sqrt(rr*rr-distance*distance/4)),Q:v(365,303+Math.sqrt(rr*rr-distance*distance/4)),distance}}
if(kind==='angle'){const O=v(235,405),alpha=angle*PI/180,upper=polar(O,-alpha,290),lower=polar(O,0,290),bis=polar(O,-alpha/2,277);return {kind,O,upper,lower,bis,angle,alpha}}
if(kind==='circles'||kind==='region'){const A=v(365-distance/2,286),B=v(365+distance/2,286),ra=Math.max(r,112),rbb=Math.max(rb,112),int=intersections(A,ra,B,rbb);return {kind,A,B,ra,rb:rbb,int,distance}}
throw Error('Unknown kind '+kind)}
const card=(heading,value,detail)=>H('section',{class:'f119-card'},[H('div',{class:'f119-eyebrow',text:heading}),H('div',{class:'f119-main',text:String(value)}),H('p',{class:'f119-sub',text:detail})]);
function stageShell(stage){stage.replaceChildren();let sec=H('section',{class:'f119-theatre','data-testid':'f119-stage'});sec.append(H('div',{class:'f119-top'},[H('span',{text:'F11 · ANGLES AND CONSTRUCTIONS'}),H('span',{class:'f119-tag',text:'NOVA · NEON CHALK'})]));let layout=H('div',{class:'f119-layout'}),plane=H('div',{class:'f119-plane'}),svg=N.svg.root(730,530,'Interactive locus geometry with equidistant points, construction circles, regions, and angle bisectors');svg.classList.add('nv-svg','f119-svg');svg.dataset.testid='f119-svg';svg.removeAttribute('width');svg.removeAttribute('height');if(matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox','111 12 508 506');plane.append(svg);layout.append(plane);sec.append(layout);stage.append(sec);return{sec,layout,plane,svg}}
function handle(svg,g,id,p,min,max,now,label){let h=svg.querySelector(`[data-testid="f119-${id}-handle"]`);if(!h)h=E('circle',{r:31,fill:'transparent',stroke:'transparent',class:'f119-locus-handle',tabindex:0,role:'slider',style:'touch-action:none','data-testid':`f119-${id}-handle`},svg);h.setAttribute('cx',p.x);h.setAttribute('cy',p.y);h.setAttribute('aria-label',label);h.setAttribute('aria-valuemin',min);h.setAttribute('aria-valuemax',max);h.setAttribute('aria-valuenow',now);ring(g,p,12,'result');return h}
function tint(g,c,r,cls='f119-region-fill'){E('circle',{cx:c.x,cy:c.y,r,class:cls},g)}
function drawGeometry(svg,st){const kind=st.kind||'point',phase=st.phase??6,hide=!!st.hide,editable=!!st.editable,m=model(kind,st);svg.querySelector('[data-testid=f119-geometry]')?.remove();const g=E('g',{'data-testid':'f119-geometry',style:'pointer-events:none'},svg);let first=svg.querySelector('.f119-locus-handle');if(first)svg.insertBefore(g,first);
const show=phase>=6&&!hide;
if(kind==='point'){
 const{A,r}=m;if(phase>=1){ring(g,A,11,'op');chalk(g,add(A,v(-18,29)),'A','op')}
 if(phase>=2){tint(g,A,r);circle(g,A,r,'op',4.5)}
 if(phase>=3){let B=polar(A,-PI/3,r);line(g,A,B,'focus',3);ring(g,B,9,'result');chalk(g,add(B,v(25,0)),'P','result',24)}
 if(phase>=4){for(let i=0;i<8;i++){let p=polar(A,(i/4)*PI,r);ring(g,p,4,'focus')}}
 if(show)chalk(g,v(367,75),`AP = ${fmt(r)} UNITS`,'result',28);
 if(editable)handle(svg,g,'radius',polar(A,-PI/3,r),90,215,r,'Move P to change the radius. Arrow keys adjust the distance.');
 } else if(kind==='line'){
 let{A,B,offset}=m;if(phase>=1){line(g,A,B,'given',6);chalk(g,v(185,303),'l','given')}
 if(phase>=2){E('rect',{x:A.x,y:A.y-offset,width:B.x-A.x,height:offset*2,fill:'#37cce2','fill-opacity':'.09'},g);line(g,v(A.x,A.y-offset),v(B.x,B.y-offset),'op',4);line(g,v(A.x,A.y+offset),v(B.x,B.y+offset),'op',4)}
 if(phase>=3){let X=v(393,275-offset);line(g,v(X.x,275),X,'focus',3);ring(g,X,9,'result');chalk(g,add(X,v(25,-6)),'P','result',23)}
 if(show){chalk(g,v(370,108),'TWO PARALLEL LOCI','focus',29);chalk(g,v(376,479),`DISTANCE = ${fmt(offset)}`,'result',27)}
 if(editable)handle(svg,g,'radius',v(500,275-offset),90,165,m.offset+35,'Move the distance marker; arrow keys adjust the perpendicular offset.');
 }else if(kind==='perp'){
 let{A,B,M,P,Q,r}=m;if(phase>=1){line(g,A,B,'given',7);ring(g,A,9,'op');ring(g,B,9,'focus');chalk(g,add(A,v(-18,36)),'A','op');chalk(g,add(B,v(20,36)),'B','focus')}
 if(phase>=2){arc(g,A,r,-1.46,1.46,'op',3.6);arc(g,B,r,PI-1.46,PI+1.46,'focus',3.6)}
 if(phase>=3){ring(g,P,9,'result');ring(g,Q,9,'result');chalk(g,add(P,v(-27,0)),'P','result',24);chalk(g,add(Q,v(-27,24)),'Q','result',24)}
 if(phase>=4){E('path',{d:'M365 70 L365 478',stroke:'#49ffc7','stroke-width':1.5,'stroke-dasharray':'7 6',opacity:'.65'},g);line(g,v(365,74),v(365,470),'result',4)}
 if(phase>=5){ring(g,M,9,'result');N.neonPath(g,'M 365 286 L 382 286 L 382 303',{role:'focus',width:3});chalk(g,v(349,337),'M','focus',25)}
 if(show)chalk(g,v(266,91),'PA = PB','result',30);
 if(editable)handle(svg,g,'distance',B,100,240,m.distance,'Drag B to change the separation; arrow keys adjust.');
 }else if(kind==='angle'){
 let{O,upper,lower,bis,alpha,angle}=m;if(phase>=1){line(g,O,lower,'given',6);line(g,O,upper,'given',6);ring(g,O,9,'op');chalk(g,add(O,v(-21,27)),'O','op')}
 if(phase>=2){arc(g,O,68,-alpha,0,'focus',4);chalk(g,polar(O,-alpha/2,102),`${fmt(angle)}°`,'focus',27)}
 if(phase>=3){let P=polar(O,-alpha/2,177);line(g,O,P,'result',4);ring(g,P,7,'result')}
 if(phase>=4){let P=polar(O,-alpha/2,175),foot1=v(P.x, O.y),d=mul(sub(upper,O),1/290),t=(P.x-O.x)*d.x+(P.y-O.y)*d.y,foot2=add(O,mul(d,t));line(g,P,foot1,'op',2.8);line(g,P,foot2,'focus',2.8);ring(g,foot1,5,'op');ring(g,foot2,5,'focus')}
 if(show)chalk(g,v(371,69),`EACH HALF = ${fmt(angle/2)}°`,'result',28);
 if(editable)handle(svg,g,'angle',upper,35,115,m.angle,'Rotate angle arm; use arrow keys to adjust angle.');
 }else if(kind==='circles'||kind==='region'){
 let{A,B,ra,rb,int}=m;if(phase>=1){ring(g,A,10,'op');ring(g,B,10,'focus');chalk(g,add(A,v(-24,26)),'A','op');chalk(g,add(B,v(23,26)),'B','focus')}
 if(phase>=2){tint(g,A,ra);circle(g,A,ra,'op',3.8)}
 if(phase>=3){if(kind==='region'&&phase>=4){let cid='f119-clipping-region';let defs=svg.querySelector('defs')||E('defs',{},svg);defs.querySelector('#'+cid)?.remove();let clip=E('clipPath',{id:cid},defs);E('circle',{cx:A.x,cy:A.y,r:ra},clip);E('circle',{cx:B.x,cy:B.y,r:rb,fill:'#70f3ae','fill-opacity':'.3','clip-path':`url(#${cid})`},g);}else tint(g,B,rb,'f119-secondary-fill');circle(g,B,rb,'focus',3.8)}
 if(phase>=4){int.forEach((p,i)=>{ring(g,p,9,'result');chalk(g,add(p,v(i?26:-26,i?16:-10)),i?'Q':'P','result',25)})}
 if(phase>=5&&int.length){line(g,A,int[0],'op',2.6);line(g,B,int[0],'focus',2.6)}
 if(show){chalk(g,v(363,85),kind==='region'?'BOTH CONDITIONS MUST HOLD':'TWO LOCI INTERSECT','result',25);if(kind==='region')chalk(g,v(370,483),'OVERLAP = VALID REGION','focus',24)}
 if(editable){handle(svg,g,'radius',polar(A,-PI*3/4,ra),90,215,ra,'Change the radius of circle A');handle(svg,g,'radiusB',polar(B,PI/4,rb),85,210,rb,'Change the radius of circle B');}
 }
 const valid=kind==='point'||kind==='line'||kind==='perp'||kind==='angle'?{radius:kind==='point'||kind==='line',distance:kind==='perp',angle:kind==='angle'}:{radius:true,radiusB:true};
 svg.querySelectorAll('.f119-locus-handle').forEach(h=>{const id=h.dataset.testid.slice(5,-7);if(!valid[id])h.remove()});
 return m;
}
function info(kind,st,phase,hidden){const m=model(kind,st),full=phase>=6&&!hidden;
 switch(kind){
 case 'point':return ['Fixed distance from A',phase>=2?'A CIRCLE':'?',full?fmt(m.r)+' units':'?','Every point on the circle is the same distance from A.'];
 case 'line':return ['Fixed distance from a line',phase>=2?'TWO PARALLELS':'?',full?fmt(m.offset)+' units':'?','The shortest distance to a line is measured perpendicularly.'];
 case 'perp':return ['Equidistant from A and B',phase>=4?'PERPENDICULAR BISECTOR':'?',full?'PA = PB':'?','The bisector is the locus of points equally far from A and B.'];
 case 'angle':return ['Equidistant from two rays',phase>=3?'ANGLE BISECTOR':'?',full?fmt(m.angle/2)+'°':'?','Inside an angle, the bisector has equal perpendicular distances to the arms.'];
 case 'circles':return ['Two simultaneous distances',phase>=3?'TWO CIRCLES':'?',full?m.int.length+' intersections':'?','Both fixed distances must be satisfied at the same point.'];
 case 'region':return ['Compound distance region',phase>=3?'OVERLAPPING DISCS':'?',full?'COMMON REGION':'?','A point is valid only if it meets both inside-the-circle conditions.'];
 default:throw Error('Unknown locus '+kind);
 }
}
function draw(stage,opts={}){let box=stageShell(stage),cards=[],aside=H('aside',{class:'f119-aside','data-testid':'f119-aside'});for(let i=0;i<3;i++){let c=card('','', '');cards.push(c);aside.append(c)}box.layout.append(aside);
function repaint(next={}){Object.assign(opts,next);let m=drawGeometry(box.svg,opts),s=info(opts.kind||'point',opts,opts.phase??6,!!opts.hide),vals=[['CONSTRUCTION',s[0],s[3]],['LOCUS RULE',s[1], 'The highlighted points follow the stated condition.'],['MEASURE OR RESULT',s[2],'Values stay hidden until the evidence is ready.']];if(opts.hide)vals[2][1]='?';vals.forEach((a,i)=>{cards[i].querySelector('.f119-eyebrow').textContent=a[0];cards[i].querySelector('.f119-main').textContent=a[1];cards[i].querySelector('.f119-sub').textContent=a[2]});return m}
repaint();N.scene.helperStrip(box.sec,opts.pose||'explain',opts.caption||'A locus is every point meeting one mathematical condition.');return {...box,repaint}}
const STEPS=[
 {kind:'point',phase:0,name:'What is a locus?',pose:'explain',narration:'A locus is every position that follows one rule. We can draw all of those positions.'},
 {kind:'point',phase:1,name:'Choose the fixed point',pose:'point-down',narration:'Start at the given point A. A single point is our reference.'},
 {kind:'point',phase:2,name:'Keep the radius fixed',pose:'ruler',narration:'Every point on this circle stays the same distance from A.'},
 {kind:'point',phase:3,name:'Mark another point',pose:'point-right',narration:'P can be anywhere on the circle. Its distance from A is unchanged.'},
 {kind:'point',phase:4,name:'Test many positions',pose:'count',narration:'All these locations follow the rule. Points inside and outside the circumference do not.'},
 {kind:'point',phase:6,name:'State the complete locus',pose:'idea',narration:'The circle is the complete locus of points at the given distance from A.'},
 {kind:'line',phase:1,name:'Start with a straight line',pose:'ruler',narration:'Now the rule is a fixed shortest distance from a straight line.'},
 {kind:'line',phase:2,name:'Draw both offset paths',pose:'show-two',narration:'There are two parallel loci, one on each side of the line.'},
 {kind:'line',phase:3,name:'Measure perpendicularly',pose:'point-down',narration:'Use the perpendicular distance, not an oblique sloping distance.'},
 {kind:'line',phase:6,name:'Name the pair of parallels',pose:'celebrate',narration:'Every point on either parallel line has the same shortest distance from the original line.'},
 {kind:'perp',phase:1,name:'Two fixed points',pose:'show-two',narration:'We want all points equally far from A and B.'},
 {kind:'perp',phase:2,name:'Equal-radius arcs',pose:'compare',narration:'Using the same compass opening from each end gives crossing arcs.'},
 {kind:'perp',phase:3,name:'Locate the crossings',pose:'point-down',narration:'The crossings have equal distances to both endpoints.'},
 {kind:'perp',phase:4,name:'Join the crossings',pose:'ruler',narration:'Join the crossing points. The line is the perpendicular bisector.'},
 {kind:'perp',phase:6,name:'Prove equal distances',pose:'idea',narration:'Every point on the perpendicular bisector is equally far from A and B.'},
 {kind:'angle',phase:1,name:'Start with two rays',pose:'explain',narration:'Inside an angle, we want equal perpendicular distances from each arm.'},
 {kind:'angle',phase:2,name:'Identify the included angle',pose:'count',narration:'The angle between the rays gives the region where the inside bisector lies.'},
 {kind:'angle',phase:3,name:'Construct the bisector',pose:'ruler',narration:'Divide the angle into two equal parts using the angle bisector.'},
 {kind:'angle',phase:4,name:'Test the perpendiculars',pose:'point-down',narration:'Perpendicular distances from a point on the bisector to both rays are equal.'},
 {kind:'angle',phase:6,name:'Explain the equal distances',pose:'idea',narration:'That equality explains why the angle bisector is a locus.'},
 {kind:'circles',phase:1,name:'Two distance conditions',pose:'show-two',narration:'Now a point must be a specified distance from A and another distance from B.'},
 {kind:'circles',phase:2,name:'First circle',pose:'ruler',narration:'The first rule makes a circle around A.'},
 {kind:'circles',phase:3,name:'Second circle',pose:'compare',narration:'The second rule makes a circle around B.'},
 {kind:'circles',phase:4,name:'Locate both crossings',pose:'point-down',narration:'Where the circles cross, both distance rules are true.'},
 {kind:'circles',phase:6,name:'Justify the intersections',pose:'celebrate',narration:'The intersection points satisfy both distance conditions at once.'},
 {kind:'region',phase:1,name:'Inside, not just on',pose:'explain',narration:'Inside a circle means a distance no greater than its radius.'},
 {kind:'region',phase:2,name:'First possible region',pose:'point-left',narration:'Shade every position within the first distance of A.'},
 {kind:'region',phase:3,name:'Second possible region',pose:'point-right',narration:'Shade the points within the second distance of B.'},
 {kind:'region',phase:4,name:'Keep the shared area',pose:'compare',narration:'Only the overlapping region satisfies BOTH inequalities.'},
 {kind:'region',phase:6,name:'Generalise the overlap',pose:'celebrate',narration:'The common region is the entire solution, including the valid boundary points.'}
];
function render(i,stage){const p=STEPS[i]||STEPS[0];draw(stage,{...DEF,...p,caption:p.narration})}
function svgPt(svg,e){let p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;let m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):p}
function dragHandle(h,svg,get,project,set){h.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;e.preventDefault();const id=e.pointerId,initial=get();let pending=null,raf=0,active=true;const drag={cancel:()=>finish(true),captured:true,moved:true};N.ui._drag=drag;
function frame(){raf=0;if(pending!==null){set(pending,true);pending=null}}
function move(ev){if(ev.pointerId!==id||!active)return;ev.preventDefault();pending=project(svgPt(svg,ev));if(!raf)raf=requestAnimationFrame(frame)}
function finish(cancel=false,ev){if(!active)return;const val=cancel?initial:ev?project(svgPt(svg,ev)):pending??get();active=false;cancelAnimationFrame(raf);pending=null;h.removeEventListener('pointermove',move);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',abort);h.removeEventListener('lostpointercapture',lost);window.removeEventListener('blur',abort);window.removeEventListener('keydown',key);try{h.releasePointerCapture(id)}catch(_){}if(N.ui._drag===drag)N.ui._drag=null;set(val,false)}
function up(ev){if(ev.pointerId===id)finish(false,ev)}function abort(){finish(true)}function lost(){if(active)finish(true)}function key(ev){if(ev.key==='Escape'){ev.preventDefault();finish(true)}}
h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',abort);h.addEventListener('lostpointercapture',lost);window.addEventListener('blur',abort);window.addEventListener('keydown',key);try{h.setPointerCapture(id)}catch(_){finish(true)}
});h.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();set(clamp(get()+(['ArrowRight','ArrowUp'].includes(e.key)?5:-5),+h.getAttribute('aria-valuemin'),+h.getAttribute('aria-valuemax')),false)})}
function explore(panel,stage){panel.classList.add('f119-tools');let st={...DEF},box;const titles={point:'Fixed distance from point',line:'Fixed distance from line',perp:'Perpendicular bisector',angle:'Angle bisector locus',circles:'Two distance circles',region:'Compound region'};
const preset=H('select',{class:'nova-input f119-preset-select','data-testid':'f119-preset','aria-label':'Choose lesson preset'});Object.entries(CFG.presets).forEach(([k,p])=>preset.append(H('option',{value:k,text:p.label})));preset.value=st.preset;
const kind=H('select',{class:'nova-input','data-testid':'f119-kind','aria-label':'Choose locus construction'});Object.entries(titles).forEach(([k,t])=>kind.append(H('option',{value:k,text:t})));
panel.append(H('label',{class:'f119-wide'},['Lesson preset',preset]),H('label',{class:'f119-wide'},['Locus construction',kind]));
const range=(id,title,min,max,step=5)=>{const input=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(st[id]),'data-testid':`f119-${id}`}),out=H('span',{class:'f119-value',text:String(st[id])});let parent=H('label',{class:'f119-control'},[title,H('div',{class:'f119-explorebar'},[input,out])]);panel.append(parent);return {parent,input,out}};
let fields={radius:range('radius','Radius / offset',90,215),radiusB:range('radiusB','Second radius',85,210),distance:range('distance','Distance AB',100,240),angle:range('angle','Included angle',35,115),phase:range('phase','Reveal stage',1,6,1)};
panel.append(prose('Drag the gold handles to change the locus while keeping its construction mathematically exact. Press Escape to cancel a drag.'));
let actions=H('div',{class:'f119-actions f119-wide'});panel.append(actions);
function updateControls(){kind.value=st.kind;let active={point:['radius'],line:['radius'],perp:['distance','radius'],angle:['angle'],circles:['radius','radiusB','distance'],region:['radius','radiusB','distance']}[st.kind];for(const [id,o]of Object.entries(fields)){o.parent.style.display=active.includes(id)||id==='phase'?'grid':'none';o.input.value=String(st[id]);o.out.textContent=id==='angle'?st[id]+'°':st[id]}};
function repaint(){updateControls();if(!box)box=draw(stage,{...st,editable:true,caption:'Drag a locus handle to see the mathematics update immediately.'});else box.repaint({...st,editable:true,hide:false});for(let id of ['radius','radiusB','distance','angle']){let h=box.svg.querySelector(`[data-testid=f119-${id}-handle]`);if(!h||h.dataset.bound)continue;h.dataset.bound='1';let get=()=>st[id],project=p=>{const m=model(st.kind,st);if(id==='angle')return clamp(Math.round(-Math.atan2(p.y-m.O.y,p.x-m.O.x)*180/PI/5)*5,35,115);if(id==='distance')return clamp(Math.round((p.x-(365-st.distance/2))/5)*5,100,240);if(id==='radiusB')return clamp(Math.round(dist(p,m.B)/5)*5,85,210);if(st.kind==='line')return clamp(Math.round((275-p.y+35)/5)*5,90,215);return clamp(Math.round(dist(p,m.A)/5)*5,90,215)},set=(value)=>{st[id]=value;emit(id,value);box.repaint({...st,editable:true,hide:false});updateControls()};dragHandle(h,box.svg,get,project,set)}}
preset.onchange=()=>{st.preset=preset.value;st.kind=CFG.presets[st.preset].kind;st.phase=6;emit('preset',st.preset);repaint()};kind.onchange=()=>{st.kind=kind.value;st.phase=6;emit('kind',st.kind);repaint()};Object.entries(fields).forEach(([id,f])=>f.input.oninput=()=>{st[id]=+f.input.value;emit(id,st[id]);repaint()});
actions.append(btn('Complete construction',()=>{st.phase=6;emit('phase',6);repaint()},'nova-btn primary'),btn('Start again',()=>{st.phase=1;emit('phase',1);repaint()}),btn('Restore defaults',()=>{Object.assign(st,DEF);preset.value=st.preset;emit('reset',st.preset);repaint()}));repaint()}
const REASONS={radius:'Every point on the circle has the same distance from its centre.',perpendicular:'Shortest distance to a line is measured at right angles.',bisector:'Points on a perpendicular bisector are equidistant from both endpoints.',midpoint:'A midpoint divides a segment into two equal parts.',angle:'The internal angle bisector creates two equal angles and equal perpendicular distances.',intersection:'Both circle-distance conditions hold at the circle intersections.',inside:'The common shaded area satisfies both distance inequalities.',circumference:'An equal-distance locus from one point is a circle, not a filled disc.'};
const TASKS=[
{kind:'point',answer:165,reason:'radius',q:'P lies on a circle centred at A with radius 165. What is AP?',hint:'A radius joins the centre to a point on its circle.'},
{kind:'line',answer:105,reason:'perpendicular',q:'Each offset line is 105 units away from the central line. What is the shortest distance?',hint:'Think about the perpendicular between parallel lines.'},
{kind:'perp',answer:0,reason:'bisector',q:'P is on the perpendicular bisector of AB. What is PA minus PB?',hint:'Points on a perpendicular bisector are equally far from A and B.'},
{kind:'perp',distance:240,answer:120,reason:'midpoint',q:'AB measures 240 units. What is AM at its midpoint M?',hint:'Divide AB equally into two lengths.'},
{kind:'angle',angle:80,answer:40,reason:'angle',q:'The included angle is 80°. What angle lies on either side of its internal bisector?',hint:'The line halves the angle.'},
{kind:'circles',radius:165,radiusB:145,answer:165,reason:'intersection',q:'P lies where a circle of radius 165 centred on A crosses another circle. What is AP?',hint:'P lies on the circle centred at A.'},
{kind:'circles',answer:2,reason:'intersection',q:'The two drawn circles cross twice. How many distinct locations satisfy both exact distances?',hint:'Look for the simultaneous crossings of both circles.'},
{kind:'region',answer:2,reason:'inside',q:'To be inside BOTH distance regions, how many conditions must a point satisfy?',hint:'Both restrictions must hold at the same time.'}
];
function dragReason(el,label,target,onDrop){el.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||N.ui._drag)return;let id=e.pointerId,x=e.clientX,y=e.clientY,ghost=null;const drag={cancel:clear,moved:true,captured:true};function move(ev){if(ev.pointerId!==id)return;if(!ghost&&Math.hypot(ev.clientX-x,ev.clientY-y)>6){ghost=H('div',{class:'f119-ghost',text:label});document.body.append(ghost);N.ui._drag=drag}if(ghost){ghost.style.left=ev.clientX+10+'px';ghost.style.top=ev.clientY+10+'px';let b=target.getBoundingClientRect();target.dataset.hover=String(ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom);ev.preventDefault()}}function clear(){ghost?.remove();target.dataset.hover='false';if(N.ui._drag===drag)N.ui._drag=null;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',clear);el.removeEventListener('lostpointercapture',clear);window.removeEventListener('blur',clear);window.removeEventListener('keydown',key);try{el.releasePointerCapture(id)}catch(_){}}function up(ev){if(ev.pointerId!==id)return;let b=target.getBoundingClientRect(),ok=ghost&&ev.clientX>=b.left&&ev.clientX<=b.right&&ev.clientY>=b.top&&ev.clientY<=b.bottom;clear();if(ok)onDrop()}function key(ev){if(ev.key==='Escape'){ev.preventDefault();clear()}}el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',clear);el.addEventListener('lostpointercapture',clear);window.addEventListener('blur',clear);window.addEventListener('keydown',key);try{el.setPointerCapture(id)}catch(_){} })}
function challenge(panel,api,stage){panel.classList.add('f119-tools');let index=0;function show(){let t=TASKS[index];panel.replaceChildren();panel.append(H('div',{class:'pr-task f119-wide',text:`CHALLENGE ${index+1} / ${TASKS.length}`}),prose(t.q));let input=H('input',{class:'nova-input',type:'number',step:'any',placeholder:'Enter your answer','data-testid':'f119-answer'});panel.append(H('label',{class:'f119-wide'},['YOUR ANSWER',input]));let choices=H('div',{class:'f119-reasons f119-wide'}),drop=H('div',{class:'f119-drop f119-wide','data-testid':'f119-reason-drop',text:'Choose or drag a mathematical reason here'}),selected=null;
function choose(k){selected=k;drop.textContent=REASONS[k];drop.dataset.set='true';emit('reason',k);choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reason===k)))}Object.entries(REASONS).forEach(([k,s])=>{let b=H('button',{type:'button',class:'f119-reason','data-reason':k,'aria-pressed':'false',text:s,onclick:()=>choose(k)});choices.append(b);dragReason(b,s,drop,()=>choose(k))});panel.append(choices,drop);let actions=H('div',{class:'f119-actions f119-wide'});panel.append(actions);
const params={...DEF,...t,phase:6,hide:true,pose:'think',caption:'Use the exact geometric condition to decide. Both the answer and the reason matter.'};draw(stage,params);
let check=btn('Check answer + reason',()=>{let val=Number(input.value),err='';if(!input.value.trim()||!Number.isFinite(val))err='Enter a numerical answer.';else if(Math.abs(val-t.answer)>1e-7){err=t.kind==='point'||t.kind==='circles'?'A point on a circle is exactly its radius from the centre.':t.kind==='line'?'Measure the shortest perpendicular distance.':t.kind==='angle'?'Find half the angle.':'Use both locus conditions and count carefully.';}else if(selected!==t.reason)err='Your number is correct. Select the mathematical reason that proves it.';if(err){api.check(false,err,{task:index+1});return}api.check(true,`${t.answer}. ${REASONS[t.reason]}`,{task:index+1,reason:selected,answer:t.answer});emit('answer',{task:index+1,answer:val,reason:selected});draw(stage,{...params,hide:false,pose:'celebrate',caption:'Correct. You used the mathematical condition, not a visual guess.'});actions.replaceChildren();if(index===TASKS.length-1)actions.append(H('strong',{class:'f119-finish',text:'8 / 8 · LOCI MASTERY'}));else actions.append(btn('Next challenge →',()=>{index++;emit('task',index+1);show()},'nova-btn primary'))},'nova-btn primary');actions.append(check,btn('Hint',()=>api.hint(t.hint)));input.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()})}show()}
const def={id:ID,title:'Locus Builder',config:CFG,steps:STEPS,render,explore,challenge,alt:'NOVA locus studio with circular loci, parallel offsets, perpendicular and angle bisectors, intersecting distances and shaded solution regions.',staticAlt:'Points at fixed distance from A form a circle; points at a fixed distance from a line form two parallel lines. Perpendicular and angle bisectors are equal-distance loci. Intersections satisfy simultaneous constraints.',exploreIntro:'Choose a geometric condition and drag the construction points; values and intersections update mathematically.',onRestore:()=>emit('reset',DEF.preset)};
N.registry.add({id:ID,title:'Locus Builder',family:'F11',topics:['loci','perpendicular bisector','angle bisector','fixed distances','intersection of loci','compound regions'],deps:['F0-02','F0-04','F0-16','F11-08']});
N.bankMount({id:ID,num:'09',title:'Locus Builder · Premium Edition',def,linked:['F11-08','F11-10','F11-11'],years:'Year 8–9 · Loci, constructions, regions and proofs',spec:{purpose:'Construct and reason about exact loci around points, lines and angle rays.',params:'Radius, second radius, fixed-centre separation, angle and construction phase.',presets:'Y8-050, Y8-051, Y9-027, Y9-028, Y9-041, fixed distance from line and compound shaded region.',steps:'Thirty progressive states across six mathematically distinct scenes.',interactions:'Live handles, keyboard equivalents, reason-card drag, reveal and eight assessed tasks.',traps:'Mixing circumference and disc, sloping instead of perpendicular distances, assuming a condition applies over an entire region when only its boundary qualifies.',gcse:'Intersecting loci and multi-condition feasible regions.'}});
window.__F119_MATH__={model,intersections,TASKS,STEPS};
})();
