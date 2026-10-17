/* NOVA F14-10 CONGRUENCE TESTER — canonical F0/F2 premium core */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var BASE=[[-1.7,-1.25],[1.65,-1.25],[-.55,1.7]],RIGHT=[[-1.8,-1.55],[1.7,-1.55],[-1.8,1.12]];
var rad=Math.PI/180;
var ssaT1=6*Math.cos(Math.PI/6)-Math.sqrt(36*Math.cos(Math.PI/6)**2-20),ssaT2=6*Math.cos(Math.PI/6)+Math.sqrt(36*Math.cos(Math.PI/6)**2-20);
function ssa(t){return [[-1.8,-1.4],[1.8,-1.4],[-1.8+.6*t*Math.cos(Math.PI/6),-1.4+.6*t*Math.sin(Math.PI/6)]];}
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_10_CONFIG={startMode:'watch',preset:'y7_intro',events:['value','correct','step','hintUsed','mode'],presets:{
 y7_construction:{label:'Y7 · construction / SSS',name:'Ruler and compass · SSS',base:BASE,rule:'SSS',angle:-65,flip:false,scale:1,congruent:true,why:'Three corresponding side lengths are equal.'},
 y7_intro:{label:'Y7 · identical triangles',name:'Same shape and same size',base:BASE,rule:'RIGID',angle:110,flip:true,scale:1,congruent:true,why:'Rotation, reflection and translation keep every length and angle.'},
 y8_bisector:{label:'Y8 · construction / SAS',name:'Side–angle–side · SAS',base:BASE,rule:'SAS',angle:-95,flip:false,scale:1,congruent:true,why:'Two sides and their included angle match.'},
 y8_enlargement:{label:'Y8 · enlarged but not congruent',name:'Equal angles, different size · AAA trap',base:BASE,rule:'AAA',angle:0,flip:false,scale:1.32,congruent:false,why:'Equal angles alone prove similarity, not congruence.'},
 y8_triangles:{label:'Y8 · right triangle / RHS',name:'Right angle–hypotenuse–side · RHS',base:RIGHT,rule:'RHS',angle:90,flip:true,scale:1,congruent:true,why:'A right angle, equal hypotenuse and one matching side prove congruence.'},
 y9_reasoning:{label:'Y9 · reasoning / ASA',name:'Angle–side–angle · ASA',base:BASE,rule:'ASA',angle:145,flip:false,scale:1,congruent:true,why:'Two corresponding angles and the included side match.'},
 y9_proof:{label:'Y9 · proof / SSA warning',name:'Two sides and a non-included angle · SSA',base:ssa(ssaT1),other:ssa(ssaT2),rule:'SSA',angle:0,flip:false,scale:1,congruent:false,why:'SSA can describe two different triangles. It is not a general congruence test.'}
 }});
var D={W:670,H:515,box:{x:38,y:91,w:594,h:336},left:[205,251],right:[475,251],sp:48},B={W:390,H:520,box:{x:22,y:91,w:346,h:338},left:[108,265],right:[282,265],sp:37};
function V(){return innerWidth<=500?B:D;}
function round(v,n){return +v.toFixed(n==null?3:n)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function copy(v){return JSON.parse(JSON.stringify(v))}
function emit(key,value){NOVA.events.emit('value',{engine:'F14-10',key:key,value:value})}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1])}
function center(v){return v.reduce(function(s,x){return [s[0]+x[0]/v.length,s[1]+x[1]/v.length]},[0,0])}
function bounds(v){return [Math.min.apply(null,v.map(x=>x[0])),Math.max.apply(null,v.map(x=>x[0])),Math.min.apply(null,v.map(x=>x[1])),Math.max.apply(null,v.map(x=>x[1]))]}
function triangleSides(v){return [dist(v[1],v[2]),dist(v[0],v[2]),dist(v[0],v[1])]}
function equalSides(a,b){var aa=triangleSides(a).slice().sort((u,v)=>u-v),bb=triangleSides(b).slice().sort((u,v)=>u-v);return aa.every((x,i)=>Math.abs(x-bb[i])<.002)}
function transform(v,a,flip,sc){var t=a*rad,c=Math.cos(t),s=Math.sin(t),k=center(v);return v.map(function(q){var x=(q[0]-k[0])*sc*(flip?-1:1),y=(q[1]-k[1])*sc;return [c*x-s*y,c*y+s*x]})}
function geom(st){var d=CONFIG.presets[st.key],raw=d.base,alt=d.other||d.base;return {d:d,base:raw,candidate:transform(alt,d.angle+st.turn,d.flip!==st.flip,d.scale),pure:alt}}
function sceneXY(p,v,orig,scale){return [orig[0]+v[0]*scale,orig[1]-v[1]*scale]}
function path(v){return 'M'+v.map(q=>round(q[0],2)+','+round(q[1],2)).join(' L')+' Z'}
function chalk(svg,x,y,txt,role,size,anchor){return NOVA.chalkText(svg,x,y,String(txt),{role:role||'unknown',size:size||20,anchor:anchor||'middle'})}
function arrowLine(svg,a,b,role,width,dash){return NOVA.neonPath(svg,'M'+a.join(',')+' L'+b.join(','),{role:role||'unknown',width:width||2,dash:dash||''})}
function svgPt(svg,e){var q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(svg.getScreenCTM().inverse())}
function vertexLabels(svg,poly,prefix,role,p){var ctr=center(poly);poly.forEach(function(q,i){var dx=q[0]-ctr[0],dy=q[1]-ctr[1],len=Math.hypot(dx,dy)||1;var x=clamp(q[0]+dx/len*(p===B?20:24),22,p.W-22),y=clamp(q[1]+dy/len*21+5,103,419);chalk(svg,x,y,prefix[i],role,p===B?16:19);NOVA.neonRing(svg,q[0],q[1],{role:role,r:3.3,pulse:false})})}
function state(key){return {key:key,turn:0,flip:false,shift:[0,0],overlay:false,showLengths:false,highlight:false,correct:null}}
function dragCandidate(svg,p,st,g,redraw){var start=null,last=null,curr=false;g.setAttribute('data-maths','candidate-drag');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label','Drag the green triangle onto the blue one to compare exact size and shape. Press Enter to attempt an overlay, Escape to cancel.');
 g.addEventListener('pointerdown',function(ev){start=svgPt(svg,ev);last=start;window.addEventListener('pointerup',function(e){var x=NOVA.ui._drag;if(x&&x.el===g&&x.up)x.up(e)},{once:true})},true);
 g.addEventListener('pointermove',function(ev){if(start)last=svgPt(svg,ev)},true);g.addEventListener('pointerup',function(ev){if(start)last=svgPt(svg,ev)},true);
 function test(){st.overlay=true;st.shift=[0,0];emit('overlay',true);redraw('candidate-drag');return true;}
 var hitZone={id:'compare',x:p.left[0]-98,y:p.left[1]-110,w:196,h:220,kind:'drop'};
 NOVA.ui.svgDrag(svg,g,{zones:function(){return [hitZone]},onDrop:function(z){if(z==='compare')return test();if(last&&Math.abs(last.x-p.left[0])<95&&Math.abs(last.y-p.left[1])<110)return test();return false;}});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();test()}else if(e.key.indexOf('Arrow')===0){e.preventDefault();var x=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,y=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;st.shift=[clamp(st.shift[0]+x*10,-220,80),clamp(st.shift[1]+y*10,-120,120)];st.overlay=false;emit('shift',st.shift.slice());redraw('candidate-drag')}})
}
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};stage.innerHTML='';var p=V(),mobile=p===B,z=geom(st),d=z.d,eq=equalSides(z.base,z.pure.map(x=>[x[0]*d.scale,x[1]*d.scale])),scale=p.sp;
 NOVA.cap(stage,o.cap||'Congruence tester',o.tag||'MATCH · MEASURE · PROVE');
 var svg=S.root(p.W,p.H,'Two glowing triangles on a coordinate grid, with labelled vertices and a test overlay.');svg.classList.add('f14-plot');
 var bg=E('g',{'aria-hidden':'true'},svg);S.grid(bg,p.box.x,p.box.y,p.box.w,p.box.h,mobile?34:45);
 chalk(svg,p.W/2,39,o.headline||'Same shape AND same size?', 'unknown',mobile?20:25);
 var b=p.box;NOVA.neonPath(svg,'M'+b.x+','+b.y+' L'+(b.x+b.w)+','+b.y+' L'+(b.x+b.w)+','+(b.y+b.h)+' L'+b.x+','+(b.y+b.h)+' Z',{role:'unknown',width:1.7}).style.opacity='.24';
 chalk(svg,p.left[0],112,'ORIGINAL','given',mobile?16:19);
 chalk(svg,p.right[0],112,'CANDIDATE','result',mobile?16:19);
 var m0=center(z.base), src=z.base.map(v=>sceneXY(p,[v[0]-m0[0],v[1]-m0[1]],p.left,scale));
 // A ghost target: original location remains visible while pupils drag the image across.
 if(o.overlayGuide||o.drag||st.overlay){var target=NOVA.neonPath(svg,path(src),{role:'given',width:2,dash:'5 8'});target.style.opacity='.45';target.setAttribute('pointer-events','none')}
 var main=NOVA.neonPath(svg,path(src),{role:'given',width:4.6,fill:true});main.setAttribute('pointer-events','none');
 vertexLabels(svg,src,['A','B','C'],'given',p);
 var altCenter=center(z.candidate),rightCtr=st.overlay?p.left:p.right;
 var displayed=st.overlay?z.pure.map(function(v){var c=center(z.pure);return sceneXY(p,[v[0]-c[0],v[1]-c[1]],p.left,scale*d.scale)}):z.candidate.map(function(v){return sceneXY(p,[v[0]-altCenter[0],v[1]-altCenter[1]],[p.right[0]+st.shift[0],p.right[1]+st.shift[1]],scale)});
 if(o.guide&&o.step>=2){for(var k=0;k<3;k++){var aa=src[k],bb=displayed[k];var ln=arrowLine(svg,aa,bb,'unknown',1.8,'6 7');ln.style.opacity='.5';ln.setAttribute('pointer-events','none')}}
 var holder=E('g',{'data-maths':'candidate-shape'},svg);var outline=NOVA.neonPath(holder,path(displayed),{role:'result',width:4.6,fill:true});
 if(o.drag){E('path',{d:path(displayed),fill:'transparent',stroke:'transparent','stroke-width':12,'pointer-events':'all'},holder);dragCandidate(svg,p,st,holder,o.redraw);}else holder.setAttribute('pointer-events','none');
 if(st.overlay||o.overlay){var same=equalSides(z.base,z.pure.map(x=>[x[0]*d.scale,x[1]*d.scale]));var banner=st.overlay?(same?'EXACT MATCH · CONGRUENT':'DIFFERENT SIZE OR SHAPE'):'';
 if(banner)chalk(svg,p.W/2,459,banner,same?'result':'op',mobile?17:20);
 }else{vertexLabels(svg,displayed,['D','E','F'],'result',p)}
 // A clean premium construction guide: corresponding side measures and a single indicator.
 if(o.showEvidence||st.showLengths){var lengths=triangleSides(z.base),other=triangleSides(z.pure).map(x=>x*d.scale),ok=equalSides(z.base,z.pure.map(x=>[x[0]*d.scale,x[1]*d.scale]));
 chalk(svg,p.W/2,465,'SIDES: '+lengths.map(x=>round(x,1)).join(' · '),'given',mobile?16:19);
 chalk(svg,p.W/2,490,'PAIR: '+other.map(x=>round(x,1)).join(' · '),ok?'result':'op',mobile?16:19);
 }else if(!st.overlay&&!o.overlay){chalk(svg,p.W/2,465,o.foot||'Move · turn · flip · compare','unknown',mobile?18:20)}
 if(o.overlay&&!st.overlay){holder.setAttribute('transform','translate('+(p.right[0]-p.left[0])+',0)');M.tween(850,function(t){holder.setAttribute('transform','translate('+round((1-t)*(p.right[0]-p.left[0]),2)+',0)')},M.ease.inOut)}
 stage.appendChild(svg);
 if(o.readout){var row=h('div',{class:'f14-measure'});row.appendChild(NOVA.neonTile(d.rule,{role:'given'}));row.appendChild(NOVA.neonTile(st.overlay||o.overlay?(eq?'CONGRUENT':'DIFFERENT'):'OVERLAY?',{role:eq?'result':'unknown'}));stage.appendChild(row)}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'If both triangles have identical lengths and angles, they are congruent.');return svg;
}
var STEPS=[
 {name:'Study the first triangle',pose:'explain',prompt:'Which features could we measure?',narration:'Look closely at the original triangle. We can measure all three of its sides and its angles.'},
 {name:'Meet the candidate',pose:'compare',prompt:'The second triangle is turned. Is it still the same size?',narration:'The green triangle may be turned, flipped or moved. That alone does not change its side lengths.'},
 {name:'Compare corresponding sides',pose:'count',prompt:'Do all three corresponding sides agree?',narration:'Compare corresponding lengths. All three matching sides are sufficient to show triangle congruence.'},
 {name:'Check the angles',pose:'point-down',prompt:'Can a rotation or reflection change an angle?',narration:'A rotation, reflection or translation preserves every angle. The candidate can be turned back to compare.'},
 {name:'Lay one triangle on the other',pose:'point-left',prompt:'Does it fit exactly when we align it?',narration:'Overlay the triangles. If they match exactly, with no overhang, they are congruent.'},
 {name:'State the proof',pose:'celebrate',prompt:'Which facts justify congruence?',narration:'If the corresponding sides all match, we can justify congruence using S S S. Equal angles alone are not enough.'}
];
function watch(i,stage){var k=clamp(i|0,0,5),st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("watch.st",(...a)=>state(...a),['y7_intro']):(state('y7_intro')));if(k>=4)st.overlay=true;draw(stage,st,{cap:'Discover triangle congruence',tag:'STEP '+(k+1)+' / 6',headline:['How do we know triangles match?','Turned does not mean resized','Compare all three lengths','Rigid moves preserve angles','Overlay: exact same size','SSS proves these match'][k],guide:k>=2,step:k,overlay:k===4,showEvidence:k===2||k===5,readout:true,pose:STEPS[k].pose,say:['Start by studying the blue triangle.','The green triangle might look different because it is turned.','Equal corresponding sides are strong evidence.','Turns and flips preserve the shape.','Do the outlines fit with no overhang?','Yes! Three equal corresponding sides prove congruence.'][k]});}
function button(t,f){return h('button',{class:'nova-btn',text:t,onclick:f})}
var DEF={id:'F14-10',title:'Congruence tester',config:CONFIG,steps:STEPS,render:watch,
 alt:'Two neon triangles can be compared side by side or precisely overlaid, even when a candidate is rotated or reflected.',
 staticAlt:'Congruent triangles have identical corresponding side lengths and angles. SSS, SAS, ASA and RHS are sufficient triangle congruence conditions.',
 exploreIntro:'Select a real KS3 lesson preset. Drag the candidate onto the original, rotate or flip it, compare lengths, or run the automatic exact overlay test.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("st",(...a)=>state(...a),[CONFIG.preset]):(state(CONFIG.preset))),sel=h('select',{class:'nova-input','aria-label':'Congruence preset'}),status=h('div',{class:'f14-congr-status'}),angle=h('input',{type:'range',min:'-180',max:'180',step:'5',value:'0','aria-label':'Rotate candidate triangle'}),lbl=h('span',{text:'0°'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(k=>sel.appendChild(h('option',{value:k,text:CONFIG.presets[k].label})));window.NovaLessonComponent?.applyExploreModels();sel.value=st.key;
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){var d=CONFIG.presets[st.key];draw(stage,st,{cap:'Explore congruence',tag:'TURN · FLIP · COMPARE',headline:'Can the triangles fit exactly?',drag:!st.overlay,overlayGuide:true,showEvidence:st.showLengths,readout:true,pose:st.overlay?(d.congruent?'celebrate':'not-yet'):'compare',say:st.overlay?d.why:'Try dragging the green triangle onto the blue one. Rotations and flips keep sizes unchanged.',redraw:paint});angle.value=String(st.turn);lbl.textContent=st.turn+'°';status.className='f14-congr-status'+(st.overlay?(d.congruent?' good':' bad'):'');status.textContent=st.overlay?d.congruent?'Congruent! '+d.why:'Not congruent. '+d.why:d.name+': rotate, reflect or overlay to decide.';if(focus){var el=stage.querySelector('[data-maths="'+focus+'"]');if(el)el.focus({preventScroll:true});}}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){st=state(sel.value);CONFIG.preset=sel.value;emit('preset',sel.value);paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',sel]));
 window.NovaLessonComponent?.applyExploreModels();angle.oninput=function(){st.turn=+angle.value;st.overlay=false;emit('rotation',st.turn);paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Turn candidate ',angle,lbl]));
 window.NovaLessonComponent?.applyExploreModels();var row=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();row.appendChild(button('Flip candidate',function(){st.flip=!st.flip;st.overlay=false;emit('flip',st.flip);paint()}));window.NovaLessonComponent?.applyExploreModels();row.appendChild(button('Rotate +90°',function(){st.turn=(st.turn+90)%360;st.overlay=false;emit('rotation',st.turn);paint()}));window.NovaLessonComponent?.applyExploreModels();row.appendChild(button('Overlay test',function(){st.overlay=true;emit('overlay',true);paint()}));window.NovaLessonComponent?.applyExploreModels();row.appendChild(button('Show matching sides',function(){st.showLengths=!st.showLengths;paint()}));window.NovaLessonComponent?.applyExploreModels();row.appendChild(button('Reset',function(){st=state(sel.value);paint()}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:()=>st,preset:function(k){sel.value=k;sel.onchange()},test:function(){st.overlay=true;paint()},paint:paint};
 },
 challenge:function(panel,api,stage){var overlay=state('y7_intro'),choose=function(items){return NOVA.choiceTask(items.map(function(x){return {label:x[0],value:x[1]}}),'F14-10')};
 var tasks=[
 {q:'Two triangles have all three corresponding sides equal. Which congruence rule proves they match?',build:choose([['SSS','yes'],['AAA','aaa'],['SSA','ssa'],['A single equal side','one']]),check:v=>[v==='yes',v==='yes'?'Correct. SSS proves the triangle is fixed by three sides.':'Equal angles (AAA) or two sides with a non-included angle (SSA) do not generally prove congruence.'],hint:'The question gives three side lengths.'},
 {q:'Two triangles have two equal sides and the included angle equal. Which rule applies?',build:choose([['SAS','yes'],['SSA','ssa'],['AAA','aaa'],['RHS','rhs']]),check:v=>[v==='yes',v==='yes'?'Correct. SAS uses the angle between the two known sides.':'The word included is vital: SSA can leave more than one possible triangle.'],hint:'The angle lies between the two matching sides.'},
 {q:'Two equal angles and the side between them match. Which rule applies?',build:choose([['ASA','yes'],['AAA','aaa'],['SAS','sas'],['Two angles only','two']]),check:v=>[v==='yes',v==='yes'?'Correct. ASA fixes the triangle size and shape.':'Angles alone fix shape but do not fix size. You also need a matching side.'],hint:'Two angles + included side.'},
 {q:'Which condition proves two RIGHT-ANGLED triangles congruent?',build:choose([['Equal hypotenuse and one corresponding side','yes'],['Only one matching acute angle','angle'],['Same area','area'],['Only equal hypotenuse','hyp']]),check:v=>[v==='yes',v==='yes'?'Correct. RHS also requires both triangles to be right-angled.':'A single angle, a matching hypotenuse alone or equal area is not enough.'],hint:'RHS means right angle, hypotenuse and side.'},
 {q:'The green triangle is an enlargement by scale factor 1.32. Is it congruent to the blue one?',build:choose([['No, it is similar but larger','yes'],['Yes, matching angles are enough','angles'],['Yes, enlargement preserves size','size']]),check:v=>[v==='yes',v==='yes'?'Correct. Congruence requires identical size as well as shape.':'Enlargement changes lengths even though it keeps angles.'],hint:'Ask whether each corresponding side length is equal.'},
 {q:'Is SSA always a sufficient triangle congruence test?',build:choose([['No: two different triangles may fit SSA','yes'],['Yes: SSA always fixes the third corner','always'],['Yes: it is the same as SAS','sas']]),check:v=>[v==='yes',v==='yes'?'Correct. The non-included angle can allow two possible positions for the third vertex.':'SSA is not the same as SAS: the angle is not between the two measured sides.'],hint:'Try drawing the third vertex along a ray to meet a fixed distance.'},
 {q:'Drag the green triangle onto the blue triangle to perform the overlay test.',build:function(){return function(){return overlay.overlay}},check:v=>[v===true,v===true?'Correct. They fit perfectly after a rigid move.':'Drag the green triangle onto the blue original or use Enter while the green triangle is focused.'],hint:'Both triangles have equal sides. Drag the entire green figure across.'},
 {q:'A triangle is reflected and then rotated, but never resized. Is it congruent to its starting shape?',build:choose([['Yes, both moves preserve lengths and angles','yes'],['No, reflected shapes are different sizes','no'],['Only if the shape ends upright','up']]),check:v=>[v==='yes',v==='yes'?'Correct. Reflection and rotation are both rigid transformations.':'Orientation and position do not determine congruence. Side lengths and angles do.'],hint:'Does either transformation stretch the figure?'}
 ];
 function show(i){var keys=['y7_construction','y8_bisector','y9_reasoning','y8_triangles','y8_enlargement','y9_proof','y7_intro','y7_intro'];var st=i===6?overlay:state(keys[i]);draw(stage,st,{cap:'Challenge '+(i+1),tag:'CONGRUENT OR NOT?',headline:i===6?'Slide onto the original':i===4?'Same angles — different size':i===5?'Is SSA enough evidence?':'Check the matching evidence',drag:i===6&&!st.overlay,overlayGuide:i===6,showEvidence:false,readout:false,pose:'think',say:i===6?'Drag the green triangle directly onto the blue one.':i===4?'Matching angles alone cannot prove identical size.':'Think about the evidence. Is the triangle completely fixed?',redraw:function(){show(i)}})}
 NOVA.challengeRun(panel,api,tasks,show,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-10',DEF,{models:{},tables:{"BASE":()=>BASE,"RIGHT":()=>RIGHT,"STEPS":()=>STEPS},draws:{"draw":["stage","st","o"]},exploreFields:{"st":{"kind":"factory","factory":"state","argCount":1},"watch.st":{"kind":"factory","factory":"state","argCount":1}}});
NOVA.bankMount({id:'F14-10',num:'F14·10',title:'Congruence tester',def:DEF,years:'KS3 Years 7–9, Y7-056/057, Y8-050/055/056 and Y9-028/041.',linked:['F0-02','F0-03','F0-04','F14-01','F14-02','F14-04','F14-11'],spec:{
 purpose:'Verify identical size and shape by rigid alignment or corresponding side/angle evidence, then apply valid triangle congruence conditions.',
 params:'Three original vertices, three candidate vertices, angle, reflection, scale factor, overlay state, edge distances and exact match tolerance.',
 presets:'Y7 constructions (SSS); Y7 introduction; Y8 angle-bisector constructions (SAS); Y8 enlargement versus congruence (AAA trap); Y8 right triangles (RHS); Y9 reasoning (ASA); Y9 SSA counterexample.',
 steps:'Study original → inspect candidate → compare sides → check angles → rigid overlay → justify with a named congruence rule.',
 interactions:'Watch, Guided, Explore and Challenge. Drag candidate into overlay target, rotate/flip it, inspect side lengths; use keyboard Enter for overlay.',
 traps:'Mistaking a rotation or reflection for a new size, mistaking similar triangles for congruent, using AAA or SSA as general proofs, confusing included/non-included angles and forgetting the right angle in RHS.',
 gcse:'Extend to proof with SSS, SAS, ASA, RHS; explicitly distinguish insufficient SSA/AAA evidence and reason about corresponding vertices.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000)};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent=''}}
})();
