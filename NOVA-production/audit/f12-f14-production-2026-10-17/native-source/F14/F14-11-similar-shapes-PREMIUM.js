/* NOVA F14-11 SIMILAR SHAPES — canonical F0/F2 premium core */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
var P={tri:[[-1.65,-1.35],[1.6,-1.35],[-.9,1.35]],right:[[-1.75,-1.32],[1.75,-1.32],[-1.75,1.32]],rect:[[-1.75,-.88],[1.75,-.88],[1.75,.88],[-1.75,.88]],kite:[[0,1.6],[1.15,.15],[0,-1.6],[-1.15,.15]],trap:[[-1.75,-1.05],[1.75,-1.05],[1.0,1.05],[-.65,1.05]]};
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_11_CONFIG={startMode:'watch',preset:'y8_similarity',events:['value','correct','step','hintUsed','mode'],presets:{
 y7_enlarge:{label:'Y7 · enlargement',shape:'tri',k:2,rotation:0,flip:false,unit:'cm',caption:'Double every matching side.'},
 y7_maps:{label:'Y7 · scale drawings and maps',shape:'rect',k:1.5,rotation:0,flip:false,unit:'cm',caption:'A scale drawing keeps every length in one ratio.'},
 y8_enlarge:{label:'Y8 · reduction',shape:'kite',k:.5,rotation:0,flip:false,unit:'cm',caption:'A reduction is still similar: k is positive and below one.'},
 y8_similarity:{label:'Y8 · similarity',shape:'tri',k:1.5,rotation:35,flip:false,unit:'cm',caption:'A turn does not change corresponding side ratios.'},
 y9_maps:{label:'Y9 · scale-factor maps',shape:'trap',k:2,rotation:0,flip:false,unit:'m',caption:'Every corresponding length must use one scale factor.'},
 y9_density:{label:'Y9 · scale and 3D solids',shape:'rect',k:2,rotation:0,flip:false,unit:'cm',caption:'For similar solids: length x k, area x k squared, volume x k cubed.'},
 y9_reasoning:{label:'Y9 · similarity reasoning',shape:'tri',k:2.5,rotation:-35,flip:true,unit:'cm',caption:'A reflection can reverse orientation without changing similarity.'},
 y9_trig:{label:'Y9 · trig ratios and right triangles',shape:'right',k:1.5,rotation:0,flip:false,unit:'cm',caption:'Right triangles with equal acute angles have the same side ratios.'},
 y9_extension:{label:'Y9 · compare unequal ratios',shape:'rect',k:1.5,rotation:0,flip:false,distort:true,unit:'cm',caption:'If one side uses a different ratio, the shapes are NOT similar.'},
 f6_13:{label:'F6-13 · proportion in geometry',shape:'trap',k:1.5,rotation:0,flip:false,unit:'cm',caption:'Find the single multiplier between matching lengths.'},
 f15_05:{label:'F15-05 · similar triangles',shape:'right',k:2,rotation:0,flip:false,unit:'cm',caption:'Match corresponding right-triangle sides before solving.'}
 }});
var D={W:670,H:535,box:{x:25,y:88,w:620,h:358},left:[192,271],right:[477,271],maxWidth:197},B={W:390,H:535,box:{x:13,y:88,w:364,h:358},left:[105,274],right:[283,274],maxWidth:140};
function view(){return innerWidth<=500?B:D}function round(a,n){return +(+a).toFixed(n==null?2:n)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function emit(key,value){NOVA.events.emit('value',{engine:'F14-11',key:key,value:value})}
function centre(v){var s=v.reduce(function(x,q){return [x[0]+q[0],x[1]+q[1]]},[0,0]);return [s[0]/v.length,s[1]/v.length]}
function span(v){return Math.max.apply(null,v.map(q=>q[0]))-Math.min.apply(null,v.map(q=>q[0]))}
function sideLengths(v){return v.map((q,i)=>Math.hypot(q[0]-v[(i+1)%v.length][0],q[1]-v[(i+1)%v.length][1]))}
function cornerCos(v,i){var n=v.length,p=v[(i+n-1)%n],q=v[i],r=v[(i+1)%n],u=[p[0]-q[0],p[1]-q[1]],w=[r[0]-q[0],r[1]-q[1]];return (u[0]*w[0]+u[1]*w[1])/(Math.hypot(...u)*Math.hypot(...w))}
function similar(a,b){if(a.length!==b.length)return false;var sa=sideLengths(a),sb=sideLengths(b),ratio=sb[0]/sa[0];return sa.every((x,i)=>Math.abs(sb[i]/x-ratio)<.003&&Math.abs(cornerCos(a,i)-cornerCos(b,i))<.003)}
function transform(poly,k,angle,flip,distort){var r=angle*Math.PI/180,co=Math.cos(r),si=Math.sin(r),c=centre(poly);return poly.map(q=>{var x=(q[0]-c[0])*k*(flip?-1:1)*(distort?1.3:1),y=(q[1]-c[1])*k*(distort?.76:1);return [x*co-y*si,x*si+y*co]})}
function scaleScene(p,shape,k,angle,flip,distort){var poly=P[shape],wide=Math.max(span(poly),span(transform(poly,k,angle,flip,distort)));var limit=p.maxWidth;return Math.min(p===B?39:50,limit/wide)}
function points(poly,ctr,sp,shift){return poly.map(q=>[round(ctr[0]+q[0]*sp+(shift?shift[0]:0)),round(ctr[1]-q[1]*sp+(shift?shift[1]:0))])}
function path(a){return 'M'+a.map(q=>round(q[0])+','+round(q[1])).join(' L')+' Z'}
function chalk(svg,x,y,txt,role,size){return NOVA.chalkText(svg,x,y,String(txt),{role:role||'unknown',size:size||19,anchor:'middle'})}
function line(svg,a,b,role,w,dash){var n=NOVA.neonPath(svg,'M'+a.join(',')+' L'+b.join(','),{role:role||'unknown',width:w||2,dash:dash||''});n.setAttribute('pointer-events','none');return n}
function pt(svg,e){var q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(svg.getScreenCTM().inverse())}
function st0(key){return {key:key,k:CONFIG.presets[key].k,turn:0,flip:false,shift:[0,0],showRatios:false,showGuides:true,feedback:'',reveal:false}}
function dims(s){return CONFIG.presets[s.key]}
function shapeCoords(st){var d=dims(st),a=P[d.shape],b=transform(a,st.k,d.rotation+st.turn,d.flip!==st.flip,!!d.distort);return {a:a,b:b,d:d,isSimilar:similar(a,b)}}
function registerDrag(svg,g,name,z,st,paint){var a,b;
 g.setAttribute('data-maths',name);g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',name==='image-drag'?'Drag the green similar shape across the grid. Arrow keys move one grid position.':'Drag the gold scale control to change enlargement. Arrow keys change the scale factor.');
 g.addEventListener('pointerdown',e=>{a=pt(svg,e);b=a;window.addEventListener('pointerup',function(end){b=pt(svg,end);var active=NOVA.ui._drag;if(active&&active.el===g&&active.up)active.up(end)},{once:true})},true);g.addEventListener('pointermove',e=>{if(a)b=pt(svg,e)},true);g.addEventListener('pointerup',e=>{if(a)b=pt(svg,e)},true);
 function update(){if(!a||!b)return false;var diff=[b.x-a.x,b.y-a.y];if(Math.hypot(diff[0],diff[1])<7)return false;
 if(name==='image-drag'){var step=view()===B?23:32;st.shift=[clamp(st.shift[0]+Math.round(diff[0]/step)*step,-65,65),clamp(st.shift[1]+Math.round(diff[1]/step)*step,-65,65)];emit('shift',st.shift.slice())}
 else{st.k=clamp(round(st.k+Math.round(diff[0]/24)*.25,2),.5,3);emit('scaleFactor',st.k)}
 paint(name);a=null;b=null;return true;}
 NOVA.ui.svgDrag(svg,g,{zones:function(){return [{id:'board',x:z.x,y:z.y,w:z.w,h:z.h,kind:'drop'}]},onDrop:function(){return update()}});
 g.addEventListener('keydown',function(e){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();var move=e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:1;if(name==='image-drag'){var sp=view()===B?23:32;if(e.key==='Home')st.shift=[0,0];else st.shift=[clamp(st.shift[0]+(e.key==='ArrowLeft'||e.key==='ArrowRight'?move*sp:0),-65,65),clamp(st.shift[1]+(e.key==='ArrowUp'||e.key==='ArrowDown'?-move*sp:0),-65,65)];emit('shift',st.shift.slice())}else{st.k=e.key==='Home'?1:e.key==='End'?3:clamp(round(st.k+move*.25,2),.5,3);emit('scaleFactor',st.k)}paint(name)});
}
function labels(svg,pol,letters,role,p){var m=centre(pol);pol.forEach((q,i)=>{var vx=q[0]-m[0],vy=q[1]-m[1],len=Math.hypot(vx,vy)||1,x=clamp(q[0]+vx/len*(p===B?14:17),14,p.W-14),y=clamp(q[1]+vy/len*15+6,111,447);NOVA.neonRing(svg,q[0],q[1],{role:role,r:3});chalk(svg,x,y,letters[i]||(i+1),role,p===B?15:18)})}
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};stage.innerHTML='';var p=view(),m=p===B,c=shapeCoords(st),d=c.d,sp=scaleScene(p,d.shape,st.k,d.rotation+st.turn,d.flip!==st.flip,d.distort);NOVA.cap(stage,o.cap||'Similar shapes',o.tag||'COMPARE · SCALE · JUSTIFY');
 var svg=S.root(p.W,p.H,'Two luminous polygons on a grid. Compare matching sides to decide similarity and scale factor.');svg.classList.add('f14-plot');var bg=E('g',{'aria-hidden':'true'},svg);S.grid(bg,p.box.x,p.box.y,p.box.w,p.box.h,m?32:42);
 chalk(svg,p.W/2,39,o.headline||'Same shape · different size', 'unknown',m?20:25);
 chalk(svg,p.left[0],116,'ORIGINAL','given',m?16:19);chalk(svg,p.right[0],116,'IMAGE','result',m?16:19);
 var aa=points(c.a,p.left,sp),bb=points(c.b,p.right,sp,st.shift),bnd=p.box;
 var frame=NOVA.neonPath(svg,'M'+bnd.x+','+bnd.y+' L'+(bnd.x+bnd.w)+','+bnd.y+' L'+(bnd.x+bnd.w)+','+(bnd.y+bnd.h)+' L'+bnd.x+','+(bnd.y+bnd.h)+' Z',{role:'unknown',width:1.5});frame.style.opacity='.19';frame.setAttribute('pointer-events','none');
 var img=NOVA.neonPath(svg,path(aa),{role:'given',width:4.4,fill:true});img.setAttribute('pointer-events','none');
 // Corresponding-vertex rays remain behind both shapes and never intercept pointer hits.
 if(o.guides||st.showGuides){for(var i=0;i<Math.min(c.a.length,6);i++){var l=line(svg,aa[i],bb[i],'unknown',1.6,'5 8');l.style.opacity='.34';}}
 var candidate=E('g',{},svg);NOVA.neonPath(candidate,path(bb),{role:'result',width:4.5,fill:true});
 if(o.animation&&M&&M.tween&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var center=p.right;candidate.setAttribute('transform','translate('+round(center[0])+','+round(center[1])+') scale(.62) translate('+(-round(center[0]))+','+(-round(center[1]))+')');M.tween(650,t=>{var q=.62+.38*t;candidate.setAttribute('transform','translate('+round(center[0])+','+round(center[1])+') scale('+round(q,3)+') translate('+(-round(center[0]))+','+(-round(center[1]))+')')},M.ease&&M.ease.inOut?M.ease.inOut:null)}
 if(o.drag){E('path',{d:path(bb),fill:'transparent',stroke:'transparent','stroke-width':12,'pointer-events':'all'},candidate);registerDrag(svg,candidate,'image-drag',p.box,st,o.redraw)}else candidate.setAttribute('pointer-events','none');
 labels(svg,aa,['A','B','C','D','E'],'given',p);labels(candidate,bb,['P','Q','R','S','T'],'result',p);
 var ctrl=[p.right[0]+(p===B?29:Math.min(88,sp*st.k*1.45)),p.right[1]-(p===B?94:Math.min(91,sp*st.k*1.42))];
 if(o.drag){var go=E('g',{},svg),l=line(go,p.right,ctrl,'op',2.8);l.style.opacity='.7';NOVA.neonRing(go,ctrl[0],ctrl[1],{role:'op',r:10,pulse:false});E('circle',{cx:ctrl[0],cy:ctrl[1],r:18,fill:'transparent','pointer-events':'all'},go);registerDrag(svg,go,'scale-handle',p.box,st,o.redraw)}
 if(o.ratios||st.showRatios){var sides=sideLengths(c.a),s2=sideLengths(c.b),scale=round(s2[0]/sides[0]);chalk(svg,p.W/2,461,'matching ratios: '+sides.slice(0,3).map((x,i)=>round(s2[i]/x)).join(' · '),c.isSimilar?'result':'op',m?17:20);chalk(svg,p.W/2,488,c.isSimilar?'same multiplier: k = '+round(st.k):'NOT similar · ratios disagree',c.isSimilar?'result':'op',m?18:21)}
 else{chalk(svg,p.W/2,471,o.foot||'Compare corresponding side lengths','unknown',m?18:21)}
 stage.appendChild(svg);
 if(o.readout){var chip=h('div',{class:'f14-sim-readout'});chip.appendChild(NOVA.neonTile('k = '+round(st.k),{role:'op'}));chip.appendChild(NOVA.neonTile(c.isSimilar?'SIMILAR':'NOT SIMILAR',{role:c.isSimilar?'result':'op'}));stage.appendChild(chip)}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||d.caption);
}
var STEPS=[
 {label:'See both shapes',say:'The blue shape is the original. Look at the green image.',pose:'explain'},
 {label:'Match vertices',say:'Match each corner with its partner. Size can change.',pose:'point-down'},
 {label:'Trace corresponding sides',say:'The dashed lines help us compare corresponding points.',pose:'compare'},
 {label:'Find the multiplier',say:'Divide one image side by its matching original side.',pose:'count'},
 {label:'Check every side',say:'Every matching side must use the same multiplier.',pose:'think'},
 {label:'Generalise',say:'Equal matching angles and one common side ratio mean similar shapes.',pose:'celebrate'}
];
function watch(i,stage){var j=clamp(i|0,0,5),st=st0('y8_similarity');st.showGuides=j>=2;draw(stage,st,{cap:'Discover similar shapes',tag:'STEP '+(j+1)+' / 6',headline:['Same shape · new size','Which vertices match?','Follow every matching side','The scale factor','Check ALL side ratios','Similarity keeps angles equal'][j],guides:j>=2,ratios:j>=3,animation:j===2,readout:true,pose:STEPS[j].pose,say:STEPS[j].say})}
function button(label,click){return h('button',{class:'nova-btn',text:label,onclick:click})}
var DEF={id:'F14-11',title:'Similar shapes',config:CONFIG,steps:STEPS,render:watch,
 alt:'Two neon polygons demonstrate similarity: every corresponding side uses the same scale factor and every corresponding angle is equal.',
 staticAlt:'Similar polygons have equal corresponding angles and proportional corresponding sides. Length ratio k, area ratio k squared, volume ratio k cubed for similar solids.',
 exploreIntro:'Choose a KS3 lesson preset. Adjust the scale factor, drag the green image and inspect whether matching ratios agree.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=st0(CONFIG.preset),sel=h('select',{class:'nova-input','aria-label':'Select similarity lesson preset'}),status=h('div',{class:'f14-sim-status'}),rng=h('input',{type:'range',min:'.5',max:'3',step:'.25',value:String(st.k),'aria-label':'Scale factor'}),val=h('span',{text:'k = '+st.k});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(k=>sel.appendChild(h('option',{value:k,text:CONFIG.presets[k].label})));window.NovaLessonComponent?.applyExploreModels();sel.value=st.key;
 window.NovaLessonComponent?.applyExploreModels();function paint(focus){var c=shapeCoords(st);draw(stage,st,{cap:'Explore similarity',tag:'DRAG · SCALE · COMPARE',headline:'What stays the same when size changes?',drag:true,ratios:st.showRatios,readout:true,pose:c.isSimilar?'compare':'not-yet',say:c.isSimilar?'All corresponding lengths change by one multiplier. Try a smaller scale factor too.':'Look closely: these ratios do not all agree.',redraw:paint});rng.value=String(st.k);val.textContent='k = '+round(st.k);status.textContent=c.isSimilar?'Similar: '+dims(st).caption:'Not similar: the width and height use different multipliers.';if(focus){var el=stage.querySelector('[data-maths="'+focus+'"]');if(el)el.focus({preventScroll:true})}}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){st=st0(sel.value);CONFIG.preset=sel.value;emit('preset',sel.value);paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Lesson preset ',sel]));window.NovaLessonComponent?.applyExploreModels();rng.oninput=function(){st.k=+rng.value;emit('scaleFactor',st.k);paint()};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Scale factor ',rng,val]));
 window.NovaLessonComponent?.applyExploreModels();var actions=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Smaller · −0.25',()=>{st.k=clamp(round(st.k-.25),.5,3);emit('scaleFactor',st.k);paint()}));window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Larger · +0.25',()=>{st.k=clamp(round(st.k+.25),.5,3);emit('scaleFactor',st.k);paint()}));window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Compare ratios',()=>{st.showRatios=!st.showRatios;paint()}));window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Turn image 90°',()=>{st.turn=(st.turn+90)%360;emit('turn',st.turn);paint()}));window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Flip image',()=>{st.flip=!st.flip;emit('flip',st.flip);paint()}));window.NovaLessonComponent?.applyExploreModels();actions.appendChild(button('Reset',()=>{st=st0(sel.value);paint()}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(actions);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:()=>st,preset:k=>{sel.value=k;sel.onchange()},paint:paint,setScale:k=>{st.k=k;paint()},ratios:()=>shapeCoords(st).isSimilar};
 },
 challenge:function(panel,api,stage){var cst=st0('y8_similarity'),pick=function(choices){return NOVA.choiceTask(choices.map(x=>({label:x[0],value:x[1]})),'F14-11')},numeric=function(){return NOVA.numberTask?NOVA.numberTask('F14-11'):NOVA.numTask?NOVA.numTask('F14-11'):function(ctl){var f=NOVA.ui.number?NOVA.ui.number(ctl,{}):null;if(f)return ()=>f.get();var i=h('input',{type:'number',class:'nova-input','aria-label':'Your number'});ctl.appendChild(i);return ()=>Number(i.value)}};
 var tasks=[
 {q:'A side measuring 3 cm is enlarged by scale factor 2. What is its image length?',build:NOVA.numberTask?NOVA.numberTask('F14-11'):NOVA.numTask?NOVA.numTask('F14-11'):numeric(),check:v=>[Number(v)===6,Number(v)===6?'Yes. 3 × 2 = 6 cm.':'Multiply the ORIGINAL length by the scale factor, not add it.'],hint:'Original side × 2.'},
 {q:'A 4 cm side becomes 12 cm. Find the scale factor.',build:numeric(),check:v=>[Number(v)===3,Number(v)===3?'Correct. 12 ÷ 4 = 3.':'Divide image length by original length.'],hint:'k = image ÷ original.'},
 {q:'Which pair of rectangles is similar?',build:pick([['3 × 5 and 6 × 10','yes'],['3 × 5 and 6 × 8','no'],['3 × 5 and 5 × 7','n2']]),check:v=>[v==='yes',v==='yes'?'Correct. Both side ratios are 2.':'Both dimensions must be multiplied by the same factor.'],hint:'Divide the longer pair of sides, then check the shorter pair.'},
 {q:'A length of 8 cm is reduced by scale factor 0.5. What is the new length?',build:numeric(),check:v=>[Number(v)===4,Number(v)===4?'Correct. Half of 8 cm is 4 cm.':'A reduction uses a multiplier smaller than one.'],hint:'Multiply by 0.5.'},
 {q:'For scale factor 3, what is the AREA scale factor?',build:numeric(),check:v=>[Number(v)===9,Number(v)===9?'Correct. Area scales by k squared: 3² = 9.':'Area needs two length multipliers, so square the factor.'],hint:'3 × 3.'},
 {q:'For similar solids of length scale factor 2, what is the VOLUME scale factor?',build:numeric(),check:v=>[Number(v)===8,Number(v)===8?'Correct. Volume scales by k cubed: 2³ = 8.':'Volume has three dimensions: cube the length factor.'],hint:'2 × 2 × 2.'},
 {q:'Two triangles have matching angles and a corresponding side ratio of 3:5. Are they similar?',build:pick([['Yes, their angles are equal and sides are in one ratio','yes'],['No, different sizes can never be similar','no'],['Only if they are facing the same direction','rotate']]),check:v=>[v==='yes',v==='yes'?'Correct. Similar shapes can differ in size and orientation.':'Similarity requires equal corresponding angles, not equal sizes or orientations.'],hint:'Congruence needs identical size, similarity does not.'},
 {q:'Two rectangles are 3 × 5 and 6 × 8. Are they similar?',build:pick([['No, the matching side ratios disagree','yes'],['Yes, both got bigger','bigger'],['Yes, both have right angles','right']]),check:v=>[v==='yes',v==='yes'?'Correct. The length ratios are 2 and 1.6: not similar.':'Equal angles are necessary but not sufficient; side ratios must also agree.'],hint:'Calculate 6 ÷ 3 and 8 ÷ 5.'},
 {q:'Use the gold scale control or the slider to set the green triangle to k = 2.',build:function(){return function(){return cst.k}},check:v=>[Math.abs(Number(v)-2)<.001,Math.abs(Number(v)-2)<.001?'Correct. The image side lengths are twice the originals.':'Set the scale factor to exactly 2. You can move the gold handle with the keyboard.'],hint:'Use the gold scale handle or the +0.25 controls.'}
 ];
 function show(i){var key=['y7_enlarge','y8_similarity','y7_maps','y8_enlarge','y9_reasoning','y9_density','f15_05','y9_extension','f15_05'][i];if(i===8){draw(stage,cst,{cap:'Challenge 9',tag:'FIND THE SCALE',headline:'Set scale factor 2',drag:true,ratios:true,readout:true,pose:'think',say:'Change the gold scale control until the image is twice as large.',redraw:function(f){show(8)}})}else{var st=st0(key);draw(stage,st,{cap:'Challenge '+(i+1),tag:'SIMILAR OR NOT?',headline:i===7?'Which ratios disagree?':'Compare the corresponding sides',guides:i===0||i===1,readout:false,pose:'think',say:i===7?'The rectangles have equal angles but not equal side ratios.':'Find one multiplier that works for every matching side.'})}}
 NOVA.challengeRun(panel,api,tasks,show,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-11',DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-11',num:'F14·11',title:'Similar shapes',def:DEF,years:'KS3 Years 7–9 · Y7-054/064, Y8-055/057, Y9-021/023/029/031; F6-13 and F15-05 included as presets.',linked:['F0-02','F0-03','F0-04','F14-04','F14-10','F6-13','F15-05'],spec:{
 purpose:'Recognise similar shapes through equal corresponding angles and proportional side lengths; find linear, area and volume scale factors.',
 params:'Original polygon, image polygon, shape type, rotation, reflection, positive scale factor, optional distorted counterexample, matching ratios and image shift.',
 presets:'Y7 enlargement and scale drawings; Y8 reduction and similarity; Y9 maps, similar solids, reasoning, trigonometric ratios, a non-similar counterexample; F6-13 proportion in geometry and F15-05 similar triangles.',
 steps:'See both shapes → match vertices → connect corresponding sides → find scale factor → check all side ratios → generalise similarity.',
 interactions:'Watch, Guided, Explore and Challenge. Drag image, drag scale control, compare ratios, rotate, flip, change scale factor using slider/buttons/keyboard.',
 traps:'Confusing similar with congruent; adding instead of multiplying; using only one matching side; assuming equal angles alone makes rectangles similar; using k for area rather than k squared or volume rather than k cubed.',
 gcse:'Includes positive and fractional linear scale factors, proportional proofs, similar right triangles and the length²/length³ relationships for area/volume.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000)};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent=''}}
})();
