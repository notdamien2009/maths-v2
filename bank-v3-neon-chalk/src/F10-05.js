/* NOVA F10-05 · y = mx + c explorer · authentic NOVA F0 graph renderer & F6-08 preset adapter */
const F105_CONFIG={id:'F10-05',family:'F10',startMode:'watch',defaultPreset:'Y8-023',
 presets:{
 'Y7-039':{label:'Y7-039 · Tables into straight lines',m:1,c:2,context:'From table to equation'},
 'Y7-060':{label:'Y7-060 · Direct proportion: tickets',m:2,c:0,context:'Tickets → cost (£)',xLabel:'Tickets',yLabel:'Cost (£)',proportion:true,xMax:6,yMax:12,stepY:2,knownX:2,queryX:5},
 'Y8-022':{label:'Y8-022 · Understanding gradient',m:2,c:1,context:'Rise for every one step right'},
 'Y8-023':{label:'Y8-023 · Gradient and y-intercept',m:-1,c:3,context:'Negative gradient, positive intercept'},
 'Y8-024':{label:'Y8-024 · Plotting straight lines',m:1.5,c:-1,context:'Plot y = 1.5x − 1'},
 'Y8-025':{label:'Y8-025 · Parallel-line gradients',m:2,c:-2,context:'Compare slopes',parallel:{m:2,c:2}},
 'Y8-029':{label:'Y8-029 · Graphical simultaneous equations',m:-1,c:3,context:'Meet another straight line',compare:{m:1,c:-1}},
 'Y8-032':{label:'Y8-032 · Compare graph relationships',m:.5,c:1,context:'Compare linear and curved behaviour',quadratic:true},
 'Y8-035':{label:'F6-08 · Sticker packs (direct proportion)',m:3,c:0,context:'Packs → stickers',xLabel:'Packs',yLabel:'Stickers',proportion:true,xMax:6,yMax:18,stepY:3,knownX:2,queryX:4},
 'Y8-036':{label:'F6-08 · Distance and time (direct proportion)',m:1.5,c:0,context:'Time (h) → distance (km)',xLabel:'Time (h)',yLabel:'Distance (km)',proportion:true,xMax:8,yMax:12,stepY:1.5,knownX:2,queryX:6},
 'Y9-020':{label:'F6-08 · Proportion signatures (GCSE bridge)',m:.75,c:0,context:'A constant multiplier',xLabel:'x',yLabel:'y',proportion:true,xMax:8,yMax:6,stepY:.75,knownX:4,queryX:6,gcse:true}
 },
 events:{value:['preset','gradient','intercept','point','reset','show','challengeValue','proportion'],types:['mode','step','correct','hintUsed']},
 challenge:{tasks:['read-intercept','match-gradient','direct-proportion'],maxAttemptsPerTask:0}};
window.F105_CONFIG=F105_CONFIG;
(function(){'use strict';
 const N=window.NOVA,H=N.h,E=N.svg.el,C=F105_CONFIG,ID=C.id;
 if(N.premium&&N.premium.enable)N.premium.enable();
 const BOX={w:640,h:548,left:90,top:52,width:453,height:435};
 const STEPS=[
 {name:'Meet the axes',view:0,pose:'explain',caption:'A line is a set of matching x and y values.',prompt:'Which axis shows the input x?'},
 {name:'Locate zero',view:1,pose:'point',caption:'At x equals zero, the line crosses the vertical axis.',prompt:'Where does this line meet the y-axis?'},
 {name:'Find the intercept',view:2,pose:'magnify',caption:'The c is the value of y when x equals zero.',prompt:'Could c be below zero as well?'},
 {name:'Measure one step',view:3,pose:'count',caption:'Move one to the right and notice the rise or fall.',prompt:'Does this line go up or down?'},
 {name:'Reveal the gradient',view:4,pose:'point',caption:'The m is the vertical change for each one step right.',prompt:'If m is negative, what happens to y?'},
 {name:'Change the gradient',view:5,pose:'think',caption:'Change m and the line tilts about its fixed intercept.',prompt:'What stays fixed when m changes?'},
 {name:'Change the intercept',view:6,pose:'point',caption:'Change c and the line shifts without changing its gradient.',prompt:'Is the line still parallel to its earlier position?'},
 {name:'Generalise the rule',view:7,pose:'cheer',caption:'m controls the steepness and direction; c marks the crossing on the y-axis.',prompt:'How would you sketch a brand-new line?'}
 ];
 const TASKS=[
  {preset:'Y8-023',kind:'number',question:'Look at the graph y = −x + c. What is the y-intercept c?',answer:3,hint:'An intercept is the point where x is zero. Find the crossing on the vertical axis.',explanation:'The line meets the y-axis at (0, 3), so c = 3.'},
  {preset:'Y8-022',kind:'slider',question:'Set the green gradient handle so the line has gradient −1 but keeps y-intercept 1.',m:-1,c:1,hint:'Keep the amber intercept at (0, 1). From there move one right, then one down.',explanation:'One right and one down means m = −1, with c remaining 1.'},
  {preset:'Y7-060',kind:'number',question:'A ticket costs £2. The graph goes through the origin. What is the cost of 5 tickets?',answer:10,hint:'Direct proportion has c = 0. Multiply the number of tickets by the cost of one ticket.',explanation:'5 × £2 = £10. The line is y = 2x and crosses the origin.'}
 ];
 const S={preset:'Y8-023',m:-1,c:3,show:'all',wrong:0,task:0,entry:'',solved:false};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const round=(x,step=.5)=>Math.round(x/step)*step;
 const fmt=n=>{if(!Number.isFinite(n))return '—';const v=Math.round(n*100)/100;return (v<0?'−':'')+String(Math.abs(v));};
 const sign=(v)=>v<0?' − '+fmt(-v):' + '+fmt(v);
 function formula(m,c,proportion=false){const a=m===1?'x':m===-1?'−x':fmt(m)+'x';if(proportion)return 'y = '+a;return 'y = '+a+(c===0?'':sign(c));}
 function emit(key,value){if(!C.events.value.includes(key))throw Error('Undeclared F10-05 event '+key);N.events.emit('value',{engine:ID,key,value});}
 function pData(id=S.preset){return C.presets[id]}
 function domain(p){if(p.proportion)return {xmin:0,xmax:p.xMax,ymin:0,ymax:p.yMax,stepX:1,stepY:p.stepY||1};return {xmin:-5,xmax:5,ymin:-8,ymax:8,stepX:1,stepY:2};}
 function pos(x,y,d){return [BOX.left+(x-d.xmin)/(d.xmax-d.xmin)*BOX.width,BOX.top+(d.ymax-y)/(d.ymax-d.ymin)*BOX.height]}
 function txt(svg,x,y,value,size=28,role='given',opt={}){const mobile=window.matchMedia('(max-width:760px)').matches;return N.chalkText(svg,x,y,String(value),Object.assign({size:mobile?Math.max(30,size):size,role},opt))}
 function line(svg,x1,y1,x2,y2,role='result',width=4,extra={}){return N.neonLine(svg,x1,y1,x2,y2,{role,width,...extra})}
 function mathLine(svg,m,c,d,role='result',width=5.3){
  const pt=[];const add=(x,y)=>{if(x>=d.xmin-1e-7&&x<=d.xmax+1e-7&&y>=d.ymin-1e-7&&y<=d.ymax+1e-7&&!pt.some(z=>Math.abs(z[0]-x)<1e-5&&Math.abs(z[1]-y)<1e-5))pt.push([x,y])};
  add(d.xmin,m*d.xmin+c);add(d.xmax,m*d.xmax+c);
  if(Math.abs(m)>1e-9){add((d.ymin-c)/m,d.ymin);add((d.ymax-c)/m,d.ymax)}
  if(pt.length<2)return null;let best=[pt[0],pt[1]],len=-1;
  for(let i=0;i<pt.length;i++)for(let j=i+1;j<pt.length;j++){const n=(pt[i][0]-pt[j][0])**2+(pt[i][1]-pt[j][1])**2;if(n>len){len=n;best=[pt[i],pt[j]]}}
  const a=pos(...best[0],d),b=pos(...best[1],d);line(svg,...a,...b,role,width);return [a,b];
 }
 function grid(svg,d){
  const plot=N.neonPlot(svg,{x0:BOX.left,y0:BOX.top,w:BOX.width,h:BOX.height,x:[d.xmin,d.xmax],y:[d.ymin,d.ymax],xStep:d.stepX,yStep:d.stepY});plot.g.classList.add('f105-grid');plot.g.querySelectorAll('text').forEach(n=>n.remove());
  const ax=N.svg.axes(svg,{x:BOX.left,y:BOX.top,w:BOX.width,h:BOX.height,xmin:d.xmin,xmax:d.xmax,ymin:d.ymin,ymax:d.ymax,ticks:1});ax.g.classList.add('f105-grid');ax.g.querySelectorAll('text').forEach(n=>n.remove());
  const [zx,zy]=pos(0,0,d);for(let x=d.xmin;x<=d.xmax+.001;x+=d.stepX){if(x===0)continue;if(window.matchMedia('(max-width:760px)').matches&&d.xmin<0&&x%2!==0)continue;txt(svg,pos(x,0,d)[0],zy+29,fmt(x),27,'support',{anchor:'middle'});}for(let y=d.ymin;y<=d.ymax+.001;y+=d.stepY){if(y===0)continue;txt(svg,zx-19,pos(0,y,d)[1]+9,fmt(y),27,'support',{anchor:'end'});}
  txt(svg,zx-17,zy+34,'0',27,'support',{anchor:'end'});
  txt(svg,BOX.left+BOX.width+20,zy-8,'x',32,'op');
  txt(svg,zx+18,BOX.top-17,'y',32,'op');
 }
 function glowingMark(svg,x,y,role='focus',r=12){N.neonRing(svg,x,y,{role,r,pulse:false});E('circle',{cx:x,cy:y,r:3.5,fill:'#eefeff'},svg)}
 function dragHandle(svg,d,kind,m,c,onChange){
  const val=kind==='c'?0:1;const vv=kind==='c'?c:(c+m);const [x,y]=pos(val,vv,d);
  if(y<BOX.top-2||y>BOX.top+BOX.height+2)return;
  const group=E('g',{class:'f105-handle',role:'slider',tabindex:'0','aria-label':kind==='c'?'Amber intercept c = '+fmt(c):'Green gradient m = '+fmt(m),'aria-valuemin':kind==='c'?'-4':'-3','aria-valuemax':kind==='c'?'4':'3','aria-valuenow':String(kind==='c'?c:m),'aria-description':kind==='c'?'Drag the amber handle on x equals zero; or use Up and Down arrows.':'Drag the green handle at x equals one; or use Up and Down arrows.','data-testid':kind==='c'?'f105-intercept-handle':'f105-gradient-handle'},svg);
  E('circle',{cx:x,cy:y,r:25,fill:'rgba(35,122,218,.12)','data-drag':'1'},group);N.neonRing(group,x,y,{role:kind==='c'?'focus':'result',r:13,pulse:false});E('circle',{cx:x,cy:y,r:23,class:'f105-focus'},group);
  txt(svg,x+22,y<BOX.top+42?y+42:y-17,kind==='c'?'c':'m',29,kind==='c'?'focus':'result');
  const limits=kind==='c'?[-4,4]:[-3,3];
  group.addEventListener('keydown',e=>{let z=e.key==='ArrowUp'?.5:e.key==='ArrowDown'?-.5:e.key==='ArrowRight'?.5:e.key==='ArrowLeft'?-.5:0;if(!z)return;e.preventDefault();e.stopPropagation();onChange(kind,clamp(round((kind==='c'?c:m)+z),...limits),'keyboard');queueMicrotask(()=>{const n=document.querySelector('#'+ID+' [data-testid="'+(kind==='c'?'f105-intercept-handle':'f105-gradient-handle')+'"]');n?.focus()})});
  const allowed=[];for(let t=limits[0];t<=limits[1]+.001;t+=.5){const cy=kind==='c'?t:c+t;const [xx,yy]=pos(kind==='c'?0:1,cy,d);if(yy>=BOX.top-2&&yy<=BOX.top+BOX.height+2)allowed.push({id:String(t),kind:'drop',x:xx-23,y:yy-5.5,w:46,h:11})}
  N.ui.svgDrag(svg,group,{box:{x:x-18,y:y-18,w:36,h:36},zones:()=>allowed,onDrop:id=>{onChange(kind,Number(id),'pointer');return true}});
 }
 function scene(stage,opts={}){
  stage.innerHTML='';const o={preset:S.preset,mode:'all',step:7,editable:false,challenge:false,task:0,correct:false,pose:'explain',caption:'Compare the line with its gradient and intercept.',...opts};
  const preset=pData(o.preset),proportion=!!preset.proportion;
  const m=o.challenge? (o.task===1?(o.correct?-1:S.m):preset.m):S.m;
  const c=o.challenge?(o.task===1?1:preset.c):proportion?0:S.c;
  const d=domain(preset),z=pos(0,0,d);
  const frame=H('section',{class:'f105-theatre','data-topic':'geometry','data-correct':String(o.correct),'data-testid':'f105-premium-theatre'});
  frame.appendChild(H('div',{class:'f105-topline'},[H('span',{text:'F10 · STRAIGHT-LINE EQUATION STUDIO'}),H('span',{class:'f105-tag',text:o.challenge?'CHALLENGE · PROVE THE RULE':proportion?'F6-08 · DIRECT PROPORTION':'F0 NEON + NOVA CHALK'})]));
  const layout=H('div',{class:'f105-layout'}),left=H('div',{class:'f105-plane'}),svg=N.svg.root(BOX.w,BOX.h,'A neon coordinate graph demonstrating the gradient and vertical intercept of a straight line.');svg.classList.add('nv-svg','f105-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.dataset.testid='f105-coordinate-board';
  if(window.matchMedia('(max-width:760px)').matches)svg.setAttribute('viewBox',proportion?'0 18 602 510':'40 18 562 510');
  grid(svg,d);
  const step=o.challenge?7:o.step;
  if(step>=1){const point=pos(0,c,d);glowingMark(svg,...point,'focus',step>1?13:9);if(step>=2&&(!o.challenge||o.correct)){const mobile=window.matchMedia('(max-width:760px)').matches;if(!mobile){txt(svg,point[0]+24,point[1]<BOX.top+65?point[1]+43:point[1]-23,'(0, '+fmt(c)+')',26,'focus')}else if(proportion){txt(svg,point[0]+22,point[1]-28,'origin',25,'focus')}else{txt(svg,point[0]-26,point[1]+31,'(0, '+fmt(c)+')',26,'focus',{anchor:'end'})}}}
  if(step>=3){const y1=c+m;const p0=pos(0,c,d),p1=pos(1,c,d),p2=pos(1,y1,d);if(y1>=d.ymin&&y1<=d.ymax){line(svg,...p0,...p1,'op',3,{dash:'7 5'});line(svg,...p1,...p2,'focus',3.6,{dash:'7 5'});if(step>=4&&!o.challenge&&!window.matchMedia('(max-width:760px)').matches){txt(svg,(p0[0]+p1[0])/2,p0[1]+36,'run 1',23,'op',{anchor:'middle'});txt(svg,p2[0]+20,(p1[1]+p2[1])/2,'rise '+fmt(m),23,'focus')}}}
  if(step>=1)mathLine(svg,m,c,d,'result',5.4);
  if(!o.challenge&&preset.parallel)mathLine(svg,preset.parallel.m,preset.parallel.c,d,'op',2.6);
  if(!o.challenge&&preset.compare)mathLine(svg,preset.compare.m,preset.compare.c,d,'focus',2.7);
  if(!o.challenge&&preset.quadratic){let path='';for(let k=-4;k<=4;k+=.08){const y=.24*k*k-2;if(y<d.ymin||y>d.ymax)continue;const p=pos(k,y,d);path+=(path?' L':'M')+p[0].toFixed(2)+','+p[1].toFixed(2)}if(path)N.neonPath(svg,path,{role:'op',width:2.5})}
  if(!o.challenge&&step>=4||o.challenge&&o.task!==1){glowingMark(svg,...pos(1,m+c,d),'result',8)}
  if(o.editable){
   const change=(kind,value,how)=>{if(kind==='c'){S.c=value;emit('intercept',{value,how})}else{S.m=value;emit('gradient',{value,how})}scene(stage,{...o});window.NOVA_F105_CONTROLS?.();};
   if(!proportion)dragHandle(svg,d,'c',m,c,change);dragHandle(svg,d,'m',m,c,change);
  }
  if(o.challenge&&o.task===1&&!o.correct){dragHandle(svg,d,'m',S.m,1,(kind,value,how)=>{S.m=value;emit('gradient',{value,how,challenge:true});scene(stage,{...o})})}
  if(o.challenge&&o.correct){N.neonRing(svg,...pos(0,c,d),{role:'result',r:23,pulse:true});}
  const pills=H('div',{class:'f105-pills'},[N.neonTile('m · GRADIENT',{role:'result'}),N.neonTile(proportion?'c = 0 · ORIGIN':'c · INTERCEPT',{role:'focus'})]);left.append(svg,pills);layout.appendChild(left);
  const side=H('aside',{class:'f105-info','aria-label':'Equation, gradient and coordinate evidence'});
  const card=(label,content,kind)=>{const el=H('div',{class:'f105-card'},[H('div',{class:'f105-eyebrow',text:label}),content]);side.appendChild(el);return el};
  const f=H('div',{class:'f105-formula','data-testid':'f105-rule',text:o.challenge&&!o.correct?(o.task===0?'y = −x + c':o.task===1?'Find the line with m = −1':'y = kx'):formula(m,c,proportion)});
  card('THE RULE',f);if(proportion&&!o.challenge)side.appendChild(H('div',{class:'f105-small',text:'AXES · '+(preset.xLabel||'x')+' → '+(preset.yLabel||'y')}));
  const showDetails=!o.challenge||o.correct;
  const evidence=H('div',{class:'f105-coords'},[
   H('div',{},[H('span',{text:'GRADIENT · m'}),H('strong',{'data-testid':'f105-gradient-value',text:showDetails?fmt(m):'Find it'})]),
   H('div',{},[H('span',{text:'Y-INTERCEPT · c'}),H('strong',{'data-testid':'f105-intercept-value',text:showDetails?fmt(c):'Find it'})])]);
  card(o.challenge?'LOOK FOR EVIDENCE':'SEE THE MATHEMATICS',evidence);if(!o.challenge&&o.step>=4){side.appendChild(H('div',{class:'f105-small',text:'For one step to the right: run = 1; rise = '+fmt(m)+'.'}));}
  const expl=o.challenge&&!o.correct?(o.task===0?'Where does the line touch the vertical axis?':o.task===1?'Use the green handle. Keep the amber crossing fixed.':'The relationship is proportional: y = kx.'):
    o.step<=1?'The y-axis is where x is zero.':o.step===2?'The crossing (0, c) reveals the intercept.':o.step<=4?'One unit right gives a vertical change of m.':proportion?'Through the origin means c = 0.':'Changing m tilts the line. Changing c slides it.';
  card(o.challenge?'YOUR JOB':'WHY THIS WORKS',H('div',{class:'f105-detail',text:expl}));
  layout.appendChild(side);frame.appendChild(layout);
  frame.appendChild(H('div',{class:'f105-takeaway',html:o.challenge?'Read the drawing. <em>Explain the mathematical evidence.</em>':proportion?'A direct-proportion graph is a straight line through <em>(0, 0)</em>. Its gradient is the unit multiplier.':'The <em>gradient m</em> controls rise/run; <em>c</em> controls the y-axis crossing.'}));
  if(o.challenge){const src=N.helperImg(o.correct?'cheer':S.wrong>=2?'oops':'think','teen');frame.appendChild(H('div',{class:'f105-izaac'},[H('img',{src:src.src,alt:o.correct?'Izaac celebrates the solution':'Izaac reads the graph on his tablet'}),H('span',{text:o.correct?'Izaac: exactly. The graph and the equation agree.':S.wrong>=2?'Izaac: trace from the origin, then compare one step of change.':'Izaac: find the evidence on the axes, not by guessing.'})]));}
  stage.appendChild(frame);N.scene.helperStrip(stage,o.pose,o.caption);return svg;
 }
 function render(i,stage){const t=STEPS[i];const svg=scene(stage,{mode:t.view,step:t.view,pose:t.pose,caption:t.caption});if(!N.reducedMotion()&&i>0){const p=pData(),d=domain(p),a=pos(0,S.c,d);N.motion.flash(svg,...a,'focus',19);if(i===4){const b=pos(1,S.c+S.m,d);N.motion.trail(svg,`M${a[0]},${a[1]} L${b[0]},${b[1]}`,'result',450)}}}
 function syncPreset(key){S.preset=key;const p=pData(key);S.m=p.m;S.c=p.c;emit('preset',key);}
 function controls(panel,stage){
  panel.innerHTML='';panel.classList.add('f105-controls');
  const rebuild=()=>{
   panel.innerHTML='';const p=pData();
   const preset=H('select',{class:'nova-input','aria-label':'Lesson preset'});Object.entries(C.presets).forEach(([key,p])=>preset.appendChild(H('option',{value:key,text:p.label})));preset.value=S.preset;preset.onchange=()=>{syncPreset(preset.value);rebuild();scene(stage,{editable:true,pose:'point',caption:'Adjust the graph and explain exactly what changed.'})};panel.appendChild(H('label',{class:'f105-span'},['Lesson preset',preset]));
   const createSlider=(kind,name,val,min,max)=>{const wrapper=H('label',{}),head=H('div',{class:'f105-ctl-head'},[H('span',{text:name}),H('span',{class:'f105-slider-value',text:fmt(val)})]);const slider=H('input',{type:'range',min:String(min),max:String(max),step:'0.5',value:String(val),'aria-label':kind==='m'?'Gradient m':'Y-intercept c'});slider.oninput=()=>{const v=Number(slider.value);if(kind==='m'){S.m=v;emit('gradient',{value:v,how:'slider'})}else{S.c=v;emit('intercept',{value:v,how:'slider'})}head.lastChild.textContent=fmt(v);scene(stage,{editable:true,pose:'point',caption:'Watch how the equation changes the whole line.'})};wrapper.append(head,slider);return wrapper};
   panel.appendChild(createSlider('m','Gradient m',S.m,p.proportion?0:-3,3));
   if(p.proportion){panel.appendChild(H('label',{},['Intercept is locked at zero',H('div',{class:'nova-input',text:'c = 0 · DIRECT PROPORTION','aria-label':'Intercept locked at zero'})]));}
   else panel.appendChild(createSlider('c','Y-intercept c',S.c,-4,4));
   panel.appendChild(H('div',{class:'f105-actions f105-span'},[H('button',{class:'nova-btn ghost',text:'Restore lesson rule',onclick:()=>{syncPreset(S.preset);emit('reset',S.preset);rebuild();scene(stage,{editable:true,pose:'point',caption:'The exact lesson rule is restored.'})}}),H('button',{class:'nova-btn ghost',text:'Zero gradient',onclick:()=>{S.m=0;emit('gradient',{value:0,how:'button'});rebuild();scene(stage,{editable:true,pose:'point',caption:'A zero gradient creates a horizontal line.'})}})]));
   panel.appendChild(H('div',{class:'f105-note f105-span',text:p.proportion?'For direct proportion, c stays at zero. Try changing the unit multiplier. Keyboard: focus the green handle and use arrow keys.':'Drag the amber y-axis intercept and the green slope handle, or use the sliders and arrow keys. Slope changes tilt; intercept changes slide the line.'}));
  };
  window.NOVA_F105_CONTROLS=rebuild;rebuild();scene(stage,{editable:true,pose:'point',caption:'Adjust m and c. Predict what moves and what stays fixed.'});
 }
 function challenge(panel,api,stage){
  const tasks=TASKS.map((q,index)=>({q:q.question,build:ctl=>{
    S.task=index;S.wrong=0;S.solved=false;S.entry='';S.m=index===1?2:C.presets[q.preset].m;S.c=C.presets[q.preset].c;
    if(q.kind==='slider'){ctl.appendChild(H('p',{class:'f105-note',text:'Move the green gradient marker (drag or arrow keys), then press Check. The amber crossing is fixed at y = 1.'}));return ()=>({m:S.m,c:S.c})}
    const row=H('div',{class:'f105-ans'}),input=H('input',{class:'nova-input','inputmode':'decimal','aria-label':'Enter the mathematical answer',placeholder:'Enter a number'});input.addEventListener('input',()=>{S.entry=input.value;emit('challengeValue',{task:index,value:S.entry})});row.appendChild(input);ctl.appendChild(row);return ()=>S.entry;
  },check:value=>{
   let ok,why;
   if(q.kind==='slider'){ok=Math.abs(value.m-q.m)<.001&&Math.abs(value.c-q.c)<.001;why=ok?q.explanation:Math.abs(value.c-q.c)>.001?'Keep c fixed at 1: changing c moves the whole line, not just its tilt.':'Gradient −1 means one right and one down. Positive 1 slopes up, not down.'}
   else{const raw=String(value??'').trim().replace(/−/g,'-');const n=Number(raw);ok=raw!==''&&Number.isFinite(n)&&Math.abs(n-q.answer)<.001;why=ok?q.explanation:raw===''?'Enter a number first.':index===0?'An intercept is not the x-coordinate. Find the crossing on the y-axis.':'Do not add a starting fee: direct proportion passes through (0, 0). Multiply the cost of one ticket by five.'}
   if(!ok)S.wrong++;else{S.solved=true;scene(stage,{preset:q.preset,challenge:true,task:index,correct:true,pose:'cheer',caption:'That is correct. The mathematical evidence is visible.'})}
   return [ok,why];
  },hint:q.hint,solve:()=>{S.solved=true;S.m=q.kind==='slider'?q.m:C.presets[q.preset].m;S.c=q.kind==='slider'?q.c:C.presets[q.preset].c;scene(stage,{preset:q.preset,challenge:true,task:index,correct:true,pose:'cheer',caption:q.explanation})}}));
  N.challengeRun(panel,api,tasks,index=>{S.task=index;S.wrong=0;S.solved=false;S.entry='';S.m=index===1?2:C.presets[TASKS[index].preset].m;S.c=C.presets[TASKS[index].preset].c;scene(stage,{preset:TASKS[index].preset,challenge:true,task:index,correct:false,pose:'think',caption:'Find the relationship from the graphical evidence.'})},C);
 }
 const def={id:ID,title:'y = mx + c explorer',config:C,steps:STEPS.map(t=>({name:t.name,narration:t.caption,prompt:t.prompt,mood:t.pose})),render,explore:controls,challenge,
 alt:'Premium neon Cartesian studio with a straight line, gradient rise/run triangle, an amber y-intercept and a green draggable gradient handle.',
 staticAlt:'y = mx + c: m is the vertical change per unit horizontal change and c is y when x = 0. Direct proportion is the special case c = 0.',
 exploreIntro:'Choose a lesson preset. Drag the gradient and intercept, or use sliders and arrow keys. Compare the graph to its equation.',
 onRestore:()=>{syncPreset('Y8-023');S.show='all';S.task=0;S.wrong=0;S.solved=false;S.entry='';}};
 N.registry.add({id:ID,title:'y = mx + c explorer',family:'F10',topics:['linear graphs','gradient','y intercept','parallel','simultaneous equations','direct proportion'],deps:['F0-02','F0-14','F10-04','F6-08']});
 N.bankMount({id:ID,num:'05',title:'y = mx + c Explorer · Premium Edition',def,linked:['F0-14','F10-04','F10-06','F10-07','F10-08','F6-08'],years:'Y7 and Y8 gradient/straight-line equations; F6-08 direct proportion; Y9 bridge',spec:{
  purpose:'Show exactly how the straight-line rule y = mx + c controls the slope and y-intercept, and how direct proportion is the special case c = 0.',
  params:'m from −3 to 3, c from −4 to 4 in half steps; true scaled positive axes for proportion; companion lines for parallel and intersection contexts.',
  presets:'Y7-039 · Y7-060 · Y8-022, 023, 024, 025, 029, 032 · F6-08: Y8-035, Y8-036, Y9-020.',
  steps:'Axes → origin → intercept → rise/run → read m → change m → change c → generalise. Eight concept-specific stages.',
  interactions:'Watch/Guided/Explore/Challenge; native draggable gradient and intercept handles, keyboard arrows and sliders; restore and direct proportion c lock.',
  traps:'Confusing m and c, thinking c is an x intercept, reversing rise/run, treating a descending line as positive, adding a nonzero fixed fee to direct proportion.',
  gcse:'Y9-020 GCSE bridge is explicitly marked; later line intersection/parallel and quadratic comparisons link to F10-07, F10-08 and F10-12.'}});
 const card=document.getElementById(ID);if(card){const h=card.querySelector('h3');if(h)h.textContent='Interactive graph and equation studio';card.querySelectorAll('.face img').forEach(im=>{if(!im.alt)im.alt='Sir Bob, maths tutor'})}
 // Faithful F6-08 CONFIG-ONLY host adapter: preserves the existing repo contract and registration shape.
 const f608Presets=Object.freeze({
  'Y7-060':Object.freeze({label:'Y7-060 · Direct proportion',context:'Tickets',xLabel:'Tickets',yLabel:'Cost (£)',slope:2,intercept:0,xMax:6,yMax:12,xStep:1,yStep:2,knownX:2,queryX:5,gcse:false}),
  'Y8-035':Object.freeze({label:'Y8-035 · Table & equation',context:'Stickers',xLabel:'Packs',yLabel:'Stickers',slope:3,intercept:0,xMax:6,yMax:18,xStep:1,yStep:3,knownX:2,queryX:4,gcse:false}),
  'Y8-036':Object.freeze({label:'Y8-036 · Through origin',context:'Distance',xLabel:'Time (h)',yLabel:'Distance (km)',slope:1.5,intercept:0,xMax:8,yMax:12,xStep:1,yStep:1.5,knownX:2,queryX:6,gcse:false}),
  'Y9-020':Object.freeze({label:'Y9-020 · Proportion signatures',context:'Rate',xLabel:'x',yLabel:'y',slope:.75,intercept:0,xMax:8,yMax:6,xStep:1,yStep:.75,knownX:4,queryX:6,gcse:true})
 });
 const f608={id:'F6-08',kind:'preset',parentEngine:ID,hostTitle:'y = mx + c explorer',family:'F6',name:'Direct proportion graph',
  constraints:{interceptMustEqualZero:true,rule:'y=kx',throughOrigin:true},presets:f608Presets,
  steps:[{id:'plot-points',narration:'Plot matched values from the ratio table.'},{id:'draw-line',narration:'Join the points with a line through the origin.'},{id:'read-value',narration:'Read another point and show the multiplier.'}],
  interactions:['point-along-y=kx','table-value-to-graph-point'],challenge:['determine-k','read-coordinate']};
 f608.prepareForHost=function(host){if(!host||host.id!==ID)throw Error('F6-08 requires actual F10-05 host');return {hostId:host.id,registrationId:f608.id,presets:f608Presets,rendererConstraints:f608.constraints,requiredModes:['watch','guided','explore','challenge']}};
 window.NOVA_F608_PRESET=f608;
})();
