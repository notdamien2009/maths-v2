
/* F14-13 PATTERN MAKERS — source: approved premium NOVA/F0/F2 core */
(function(){'use strict';
var H=NOVA.h,S=NOVA.svg,E=S.el,Motion=NOVA.motion;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_13_CONFIG={startMode:'watch',preset:'frieze',events:['value','step','mode','hintUsed','correct'],presets:{
 frieze:{label:'Translation · marching arrows',name:'A marching frieze',kind:'translation',step:2.4,count:5},
 reflection:{label:'Reflection · alternating arrows',name:'Mirror alternation',kind:'reflection',step:2.4,count:5},
 rosette:{label:'Rotation · six-fold rosette',name:'Pinwheel rosette',kind:'rotation',step:60,count:6},
 glide:{label:'Glide reflection · step and flip',name:'Step-and-flip border',kind:'glide',step:2.4,count:5},
 halfturn:{label:'Half turns · rotating repeat',name:'Half-turn ribbon',kind:'halfturn',step:2.4,count:5},
 growing:{label:'Enlargement · growing sequence',name:'Growing motifs',kind:'enlargement',step:2.4,count:5}
}});
var mob={W:390,H:512,ox:195,oy:273,u:26},desk={W:680,H:532,ox:340,oy:274,u:42};
function VP(){return innerWidth<=500?mob:desk;}
function lim(x,a,b){return Math.max(a,Math.min(b,x));}
function rnd(x){return Math.round(x*100)/100;}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-13',key:k,value:v});}
function TXT(svg,x,y,t,role,sz){return NOVA.chalkText(svg,x,y,String(t),{role:role||'unknown',size:sz||20,anchor:'middle'});}
function unit(v){return [v[0],v[1]];}
function pts(path){return path.map(x=>x.slice());}
var M0=[[-.9,-.56],[.35,-.56],[.35,-.94],[1.22,0],[.35,.94],[.35,.56],[-.9,.56]];
function desc(s){return CONFIG.presets[s.key];}
function make(k){return {key:k,n:3,step:CONFIG.presets[k].step,filled:false,showGuides:true,selected:0};}
function coords(p,q){return [p.ox+q[0]*p.u,p.oy-q[1]*p.u];}
function transform(q,angle,flip,scale){var x=flip==='v'?-q[0]:q[0],y=flip==='h'?-q[1]:q[1],a=angle*Math.PI/180;return [scale*(x*Math.cos(a)-y*Math.sin(a)),scale*(x*Math.sin(a)+y*Math.cos(a))];}
function motif(s,i,row){var d=desc(s),kind=d.kind,dx=typeof s.step==='number'?s.step:2.4;var pos,ang=0,flip=false,mag=.71;
 if(kind==='rotation') {var deg=360*i/d.count,rad=deg*Math.PI/180;pos=[2.85*Math.cos(rad),2.85*Math.sin(rad)];ang=deg;mag=.84;}
 else {pos=[(i-2)*dx,row===0?1.8:-1.65];if(kind==='reflection'){flip=i%2===1?'v':false;}if(kind==='glide'){flip=i%2===1?'h':false;pos[1]+=(i%2===1?-0.28:.28);}if(kind==='halfturn'){ang=i%2===1?180:0;}if(kind==='enlargement'){mag=.46*Math.pow(1.25,i);} }
 return {pos:pos,angle:ang,flip:flip,scale:mag,poly:M0.map(function(q){var a=transform(q,ang,flip,mag);return [a[0]+pos[0],a[1]+pos[1]];})};}
function pxpoly(p,v){return v.map(function(q){return coords(p,q);});}
function path(q){return 'M'+q.map(function(z){return rnd(z[0])+','+rnd(z[1]);}).join(' L')+' Z';}
function line(svg,a,b,role,w,dash){var p=NOVA.neonPath(svg,'M'+rnd(a[0])+','+rnd(a[1])+' L'+rnd(b[0])+','+rnd(b[1]),{role:role||'unknown',width:w||2.5,dash:dash||''});p.setAttribute('pointer-events','none');return p;}
function ring(svg,c,role,r){return NOVA.neonRing(svg,c[0],c[1],{role:role||'unknown',r:r||5.5,pulse:false});}
function point(svg,event){var z=svg.createSVGPoint();z.x=event.clientX;z.y=event.clientY;var mat=svg.getScreenCTM();return mat?z.matrixTransform(mat.inverse()):z;}
function guide(svg,p,s,n){var d=desc(s),kind=d.kind,xx=p.ox,yy=p.oy;if(kind==='rotation'){ring(svg,[xx,yy],'unknown',7);var cen=coords(p,[0,0]);TXT(svg,cen[0],cen[1]+28,'O','unknown',19);for(var i=0;i<Math.min(n,6);i++){var m=motif(s,i,0),end=coords(p,m.pos);line(svg,cen,end,i===n-1?'result':'support',2,'6 7');}
 TXT(svg,p.W/2,86,'turn = 60° around O','unknown',p===mob?17:21);
 }else if(kind==='reflection'){for(var j=0;j<Math.min(n-1,4);j++){var x=(j-2)*s.step+s.step/2;var top=coords(p,[x,3.05]),bot=coords(p,[x,.52]);line(svg,top,bot,'unknown',2.2,'6 7');}
 TXT(svg,p.W/2,86,'mirror lines halfway between neighbours','unknown',p===mob?15:20);
 }else if(kind==='glide'){var top2=coords(p,[-5.9,1.8]),bot2=coords(p,[5.9,1.8]);line(svg,top2,bot2,'unknown',2.2,'7 8');TXT(svg,p.W/2,86,'slide and reflect over the middle line','unknown',p===mob?16:20);
 }else if(kind==='halfturn'){TXT(svg,p.W/2,86,'180° turns alternate the arrow direction','unknown',p===mob?16:20);
 }else if(kind==='enlargement'){TXT(svg,p.W/2,86,'each copy is 1.25 × the previous size','unknown',p===mob?16:20);
 }else{TXT(svg,p.W/2,86,'translation: equal steps, identical direction','unknown',p===mob?16:20);}
}
function describe(s){var d=desc(s);if(d.kind==='rotation')return 'ROTATE 60°';if(d.kind==='reflection')return 'REFLECT · REPEAT';if(d.kind==='glide')return 'SLIDE + REFLECT';if(d.kind==='halfturn')return 'ROTATE 180°';if(d.kind==='enlargement')return 'SCALE × 1.25';return 'SLIDE '+s.step.toFixed(1)+' UNITS';}
function addMotif(svg,p,s,i,row,opts){opts=opts||{};var m=motif(s,i,row),poly=pxpoly(p,m.poly),gp=E('g',{'data-maths':opts.data||'motif-'+i+'-'+row},svg),r=opts.role||(['given','support','result'][i%3]);
 var shape=NOVA.neonPath(gp,path(poly),{role:r,width:opts.ghost?2.1:4.2,fill:!opts.ghost,dash:opts.ghost?'5 8':''});
 gp.style.opacity=opts.ghost?'.39':opts.opacity==null?'1':String(opts.opacity);
 if(opts.ghost)gp.setAttribute('pointer-events','none');
 if(!opts.ghost){var small=m.poly.length>0?coords(p,[m.pos[0]+.22,m.pos[1]]):[0,0];ring(gp,small,'unknown',2.8);}return {g:gp,shape:shape,poly:poly,m:m};}
function keyboardAction(g,handler){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();handler('keyboard');}});}
function dragg(svg,g,target,p,s,doneCb){var start=null,last=null;
 g.setAttribute('data-drag','pattern');g.setAttribute('aria-label','Drag the next gold motif into the dashed target, or press Enter to place it.');g.setAttribute('tabindex','0');g.setAttribute('role','button');
 function onPoint(e){last=point(svg,e);}
 g.addEventListener('pointerdown',function(e){start=point(svg,e);last=start;window.addEventListener('pointerup',function(ev){last=point(svg,ev);var z=NOVA.ui._drag;if(z&&z.el===g&&typeof z.up==='function')z.up(ev);},{once:true});},true);
 g.addEventListener('pointermove',function(e){if(start)onPoint(e);},true);g.addEventListener('pointerup',function(e){if(start)onPoint(e);},true);
 function finalize(){if(!last)return false;var cen=coords(p,motif(s,target,0).pos);if(Math.hypot(last.x-cen[0],last.y-cen[1])>p.u*1.05)return false;doneCb(true);return true;}
 var cen=coords(p,motif(s,target,0).pos),zones=[{id:'next',x:cen[0]-p.u,y:cen[1]-p.u,w:2*p.u,h:2*p.u,kind:'drop'},{id:'remove',x:p.W-102,y:p.H-52,w:91,h:36,kind:'remove'}];
 NOVA.ui.svgDrag(svg,g,{zones:function(){return zones;},onDrop:function(){return finalize();},removeTo:{x:p.W-58,y:p.H-31},onRemove:function(){doneCb(false);}});
 g.addEventListener('keydown',function(e){if(['Enter',' ','ArrowRight','ArrowUp'].indexOf(e.key)>=0){e.preventDefault();doneCb(true);}else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();doneCb(false);}});
}
function dragPlaced(svg,g,p,s,onRemove){
 g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label','The placed motif. Drag to REMOVE to take it off the pattern, or press Delete.');
 g.addEventListener('pointerdown',function(){window.addEventListener('pointerup',function(ev){var z=NOVA.ui._drag;if(z&&z.el===g&&typeof z.up==='function')z.up(ev);},{once:true});},true);
 var shape=pxpoly(p,motif(s,4,0).poly);E('path',{d:path(shape),fill:'transparent',stroke:'transparent','stroke-width':9,'pointer-events':'all'},g);
 NOVA.ui.svgDrag(svg,g,{zones:function(){return [{id:'remove',x:p.W-113,y:p.H-58,w:103,h:48,kind:'remove'}];},onRemove:function(){onRemove();},removeTo:{x:p.W-63,y:p.H-32}});
 g.addEventListener('keydown',function(e){if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();onRemove();}});
}
function plot(stage,s,opt){
if(window.NovaLessonComponent?.active){[stage,s,opt]=window.NovaLessonComponent.args("plot",arguments);}
opt=opt||{};stage.innerHTML='';var p=VP(),m=p===mob,d=desc(s),isRot=d.kind==='rotation';NOVA.cap(stage,opt.cap||'Pattern Makers',opt.tag||'REPEAT · TRANSFORM');
 var svg=S.root(p.W,p.H,'NOVA pattern workshop showing asymmetric neon arrow motifs transformed by '+d.name+'. Interactive next-copy control.');svg.classList.add('f14-plot');
 var top=m?114:106,xleft=m?29:53,bw=p.W-2*xleft,bh=m?308:324;S.grid(E('g',{'aria-hidden':'true'},svg),xleft,top,bw,bh,m?26:42);
 TXT(svg,p.W/2,40,opt.heading||d.name,'unknown',m?23:27);
 var amount=lim(opt.amount==null?s.n:opt.amount,1,isRot?6:5);if(opt.guides!==false&&s.showGuides)guide(svg,p,s,amount);
 // Subtle master frame: same NOVA neonPath primitive used throughout F14.
 var edge=NOVA.neonPath(svg,'M'+xleft+','+top+' L'+(xleft+bw)+','+top+' L'+(xleft+bw)+','+(top+bh)+' L'+xleft+','+(top+bh)+' Z',{role:'unknown',width:1.9});edge.style.opacity='.21';edge.setAttribute('pointer-events','none');
 var mainCount=opt.drag?Math.min(amount,4):amount;
 // Preview the future repetition with quiet dashed outlines, retaining the same geometry.
 if(!opt.drag&&opt.preview!==false&&amount<5&&!isRot){for(var bg=amount;bg<5;bg++)addMotif(svg,p,s,bg,0,{ghost:true});}
 if(isRot){for(var i=0;i<mainCount;i++)addMotif(svg,p,s,i,0,{role:['given','support','result'][i%3]});
 if(opt.drag&&!s.filled)addMotif(svg,p,s,mainCount,0,{ghost:true});
 }else {var rows=opt.rows===false?1:2;for(var row=0;row<rows;row++){for(var ii=0;ii<mainCount;ii++)addMotif(svg,p,s,ii,row,{role:['given','support','result'][ii%3],opacity:row===1?.7:1});if(row===0&&opt.drag&&!s.filled)addMotif(svg,p,s,mainCount,0,{ghost:true});}}
 if(opt.drag){var j=mainCount;if(s.filled){var dest=addMotif(svg,p,s,j,0,{role:'result'});dragPlaced(svg,dest.g,p,s,function(){s.filled=false;emit('removed',true);if(opt.redraw)opt.redraw('removed');});}
 else{ // Gold tray motif uses exactly the same transformation as the required next copy.
 var q=motif(s,mainCount,0),tray=[m?74:91,p.H-32],vpPoly=q.poly.map(function(a){return [tray[0]+(a[0]-q.pos[0])*p.u*.52,tray[1]-(a[1]-q.pos[1])*p.u*.52];});
 var g=E('g',{'data-maths':'pattern-tray'},svg);NOVA.neonPath(g,path(vpPoly),{role:'unknown',width:3.5,fill:true});E('path',{d:path(vpPoly),fill:'transparent',stroke:'transparent','stroke-width':9,'pointer-events':'all'},g);dragg(svg,g,mainCount,p,s,function(yes){s.filled=yes;emit('placed',yes);if(opt.redraw)opt.redraw('placed');});
 TXT(svg,m?166:188,p.H-26,'DRAG NEXT','unknown',m?16:19);}
 if(s.filled){var fillPoint=coords(p,motif(s,mainCount,0).pos);ring(svg,fillPoint,'result',10).setAttribute('pointer-events','none');}
 NOVA.neonPath(svg,'M'+(p.W-112)+','+(p.H-55)+' L'+(p.W-13)+','+(p.H-55)+' L'+(p.W-13)+','+(p.H-12)+' L'+(p.W-112)+','+(p.H-12)+' Z',{role:'op',width:2,dash:'6 7'}).style.opacity='.62';
 TXT(svg,p.W-64,p.H-26,'REMOVE','unknown',m?15:18);
 }else{TXT(svg,p.W/2,p.H-25,opt.footer||describe(s),'result',m?19:22);}
 stage.appendChild(svg);
 if(opt.readout!==false){var bar=H('div',{class:'f14-readouts'});var shortRule={translation:'slide',reflection:'mirror',rotation:'rotate',glide:'glide',halfturn:'half turn',enlargement:'scale'}[d.kind];bar.appendChild(NOVA.neonTile('Rule: '+shortRule,{role:'unknown'}));bar.appendChild(NOVA.neonTile(s.filled?'Next: placed':'Copies: '+mainCount,{role:s.filled?'result':'given'}));stage.appendChild(bar);}
 NOVA.scene.helperStrip(stage,opt.pose||'explain',opt.say||'Look at the changes between copies. What transformation makes the next motif?');return svg;
}
var STEPS=[
 {name:'Study the motif',pose:'explain',narration:'A motif is one piece of a pattern. Look at the arrowhead so you can tell whether the motif turns or flips.',prompt:'Which direction does the blue arrow point?'},
 {name:'Choose the transformation',pose:'think',narration:'A pattern is made by a repeated rule. This one uses translation: each motif moves the same distance to the right.',prompt:'Does the arrow change size or direction?'},
 {name:'Move one copy',pose:'point-right',narration:'Slide an identical copy across by the same horizontal step. The shape does not flip or turn.',prompt:'How far is the second arrow from the first?'},
 {name:'Repeat the rule',pose:'count',narration:'Apply the same movement again to build the next copy. Equal steps keep the pattern regular.',prompt:'Where would the fourth motif go?'},
 {name:'Build a full pattern',pose:'compare',narration:'Repeat the motif across the row. Every copy keeps the same size, the same shape and the same direction.',prompt:'What is unchanged in each translation?'},
 {name:'Describe and generalise',pose:'celebrate',narration:'The pattern was generated by repeated translations. Other patterns can use reflections, rotations or combinations of transformations.',prompt:'What would change if every second arrow were reflected?'}
];
function watch(i,stage){i=lim(i|0,0,5);var s=make('frieze'),nums=[1,2,2,3,5,5];s.n=nums[i];s.showGuides=i>=1;var svg=plot(stage,s,{cap:'Pattern Makers',tag:'STEP '+(i+1)+' / 6',heading:STEPS[i].name,amount:nums[i],rows:i>3,readout:i>=2,pose:STEPS[i].pose,say:['The little arrow is our motif. Watch its direction.','The rule is to slide — without turning or flipping.','An equal step makes the second copy.','Carry on by exactly the same movement.','A full frieze is built from one simple rule.','Translation keeps the shape, size and direction unchanged.'][i]});
 if(i>=2&&i<=4&&!NOVA.reducedMotion()&&Motion&&Motion.tween){var g=svg.querySelector('[data-maths="motif-'+(nums[i]-1)+'-0"]');if(g){g.style.opacity='.12';Motion.tween(650,function(t){if(!g.isConnected)return;g.style.opacity=String(.12+.88*t);},Motion.ease.inOut,function(){if(g.isConnected)g.style.opacity='1';});}}
}
function btn(n,f){return H('button',{class:'nova-btn',text:n,onclick:f});}
function choice(a){return NOVA.choiceTask(a.map(function(q){return {label:q[0],value:q[1]};}),'F14-13');}
var DEF={id:'F14-13',title:'Pattern Makers',config:CONFIG,steps:STEPS,render:watch,
 alt:'A premium neon grid showing successive geometric arrow motifs made by translations, reflections, rotations, glide reflections, half turns and enlargements.',
 staticAlt:'A frieze uses equal translations. Mirror patterns flip on alternate steps. A six-fold rosette turns each next motif by 60 degrees. Glide reflection combines a translation and reflection.',
 exploreIntro:'Choose a pattern. Adjust the repeat step, inspect the mathematical rule, and drag the next motif into its outlined position. Use Enter on the gold tray as a keyboard alternative.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var s=make(CONFIG.preset),select=H('select',{class:'nova-input','aria-label':'Pattern preset'}),status=H('div',{class:'f14-status'}),step=H('input',{type:'range',min:'1.8',max:'2.7',step:'0.1',value:'2.4','aria-label':'Horizontal repeat distance'}),guide=H('input',{type:'checkbox'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){select.appendChild(H('option',{value:k,text:CONFIG.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();select.value=s.key;window.NovaLessonComponent?.applyExploreModels();guide.checked=true;
 window.NovaLessonComponent?.applyExploreModels();function paint(){var kind=desc(s).kind;plot(stage,s,{cap:'Explore patterns',tag:'BUILD · REPEAT',heading:desc(s).name,amount:4,drag:true,rows:true,readout:true,pose:s.filled?'celebrate':'point-right',say:s.filled?'That motif follows the same transformation rule.':'Look at the existing copies. Drag the gold motif to where the next copy belongs.',redraw:paint});status.textContent=s.filled?'Correct continuation! Reset or select another pattern.':kind==='rotation'?'Rotate each copy by 60° about O.':kind==='reflection'?'The arrows face in alternating directions after reflection.':kind==='glide'?'Slide and reflect across the horizontal midline.':kind==='enlargement'?'The copies become progressively larger, using a constant scale factor.':'Every copy follows the same rule.';status.className='f14-status '+(s.filled?'okay':'');step.disabled=kind==='rotation';step.value=String(kind==='rotation'?2.4:s.step);}
 window.NovaLessonComponent?.applyExploreModels();select.onchange=function(){s=make(select.value);CONFIG.preset=select.value;emit('preset',select.value);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('label',{class:'pr-row'},['Transformation family ',select]));
 window.NovaLessonComponent?.applyExploreModels();step.oninput=function(){s.step=Number(step.value);s.filled=false;emit('repeatStep',s.step);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('label',{class:'pr-row'},['Repeat step (grid units) ',step]));
 window.NovaLessonComponent?.applyExploreModels();guide.onchange=function(){s.showGuides=guide.checked;paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('label',{class:'pr-row'},[guide,' Show construction guides']));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('div',{class:'pr-row'},[btn('Add copy',function(){s.filled=true;emit('placed',true);paint();}),btn('Undo copy',function(){s.filled=false;paint();}),btn('Reset',function(){s=make(select.value);step.value='2.4';paint();})]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();window.NovaLessonComponent?.applyExploreModels();CONFIG._explore={get:function(){return s;},preset:function(k){select.value=k;select.onchange();},paint:paint};
 },
 challenge:function(panel,api,stage){var taskState=make('frieze');taskState.n=4;
 var tasks=[
 {q:'The arrow motif slides the same distance right, without turning. Which transformation generates the pattern?',build:choice([['Translation','yes'],['Reflection','ref'],['Rotation','rot']]),check:function(v){return [v==='yes',v==='yes'?'Correct. A translation moves every point by the same vector.':'The motif has not flipped or turned.'];},hint:'Check the arrow direction: has it changed?'},
 {q:'Every second arrow faces the opposite way after a mirror flip. Which transformation repeats?',build:choice([['Reflection','yes'],['Enlargement','enl'],['Translation only','trans']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Alternating copies are mirror images.':'Look for reversal of orientation rather than size change.'];},hint:'A mirror reverses the motif orientation.'},
 {q:'A six-fold rosette repeats one motif by equal turns about its centre. What is each turning angle?',build:choice([['60°','yes'],['90°','a'],['120°','b']]),check:function(v){return [v==='yes',v==='yes'?'Correct. 360° divided by 6 is 60°.':'Divide a complete 360° turn into six equal steps.'];},hint:'360° ÷ 6.'},
 {q:'The pattern slides along a line and reflects across that line. What is the combined transformation?',build:choice([['Glide reflection','yes'],['Enlargement','size'],['Rotation','turn']]),check:function(v){return [v==='yes',v==='yes'?'Correct. A glide reflection combines a translation and a reflection.':'A slide followed by a mirror flip is a glide reflection.'];},hint:'It combines a glide (slide) with a reflection.'},
 {q:'A pattern doubles the size of each successive motif. Can translation alone make that pattern?',build:choice([['No — an enlargement is needed','yes'],['Yes — translation changes sizes','no']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Translation preserves lengths. Enlargement changes lengths.':'Translations move shapes without resizing them.'];},hint:'A translation is an isometry: sizes stay equal.'},
 {q:'Drag the next gold arrow into its outlined position to continue the translation pattern.',build:function(){return function(){return taskState.filled?'placed':'missing';};},check:function(v){return [v==='placed',v==='placed'?'Correct! The next copy follows the same translation.':'Drag into the dashed target or focus the gold arrow and press Enter.'];},hint:'Continue the same horizontal repeat distance.'}
 ];
 var keys=['frieze','reflection','rosette','glide','growing','frieze'];
 function show(i){var s=i===5?taskState:make(keys[i]);s.n=i===5?4:4;s.showGuides=false;plot(stage,s,{cap:'Challenge '+(i+1),tag:'OBSERVE · DESCRIBE · CHECK',heading:i===5?'Place the next copy':'Identify the pattern rule',amount:i===5?4:4,drag:i===5,rows:i!==2,readout:false,guides:false,pose:'think',say:i===5?'Add one more matching motif without changing its direction.':'Compare the arrows. Did the motif slide, flip, turn or change size?',redraw:function(){show(i);}});}
 NOVA.challengeRun(panel,api,tasks,show,CONFIG);CONFIG._task={state:taskState};
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-13',DEF,{models:{},tables:{"M0":()=>M0,"STEPS":()=>STEPS},draws:{"plot":["stage","s","opt"]},exploreFields:{}});
NOVA.bankMount({id:'F14-13',num:'F14·13',title:'Pattern Makers',def:DEF,years:'KS3 Years 7–9 · transformations and symmetry; reusable extension into GCSE.',linked:['F0-02','F0-03','F0-04','F14-03','F14-05','F14-07','F14-08','F14-09'],spec:{
 purpose:'Generate visual patterns by repeatedly transforming an asymmetric geometric motif, then identify and construct the transformation rule.',
 params:'Motif vertices, transformation type, repeat vector, reflection axis, rotation angle, number of copies, construction guides and candidate placement.',
 presets:'Translation frieze; alternating reflections; six-fold rotation rosette; glide-reflection border; half-turn repeats; progressive enlargement.',
 steps:'Study motif → predict transformation → generate second motif → repeat rule → build full pattern → explain the rule.',
 interactions:'Watch, Guided, Explore and Challenge; drag the next copy to its position; keyboard Enter; change preset, adjust translation step, toggle guides, add/undo/reset.',
 traps:'Confusing translation with reflection, changing motif size unintentionally, reversing turn direction, moving a motif without preserving orientation, thinking a glide reflection is only a slide.',
 gcse:'Frieze symmetries, compositions, invariant properties and precisely described transformations.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();

