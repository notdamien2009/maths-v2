/* NOVA F8-12 · Quadratic Solve Routes: one exact maths kernel for factorisation,
   quadratic formula, graph and Challenge. No new shared-core geometry or mascots. */
window.F812_CONFIG=Object.freeze({id:'F8-12',title:'Quadratic Solve Routes',family:'F8',startMode:'guided',preset:'Y8-031-A',parameters:{x:[-5,5],y:[-7,7],snap:0.5},events:{value:['preset','route','root','remove','undo','reset','check','hint'],system:['correct','step','mode','hintUsed']},references:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08','F0-14','F3-02','F7-04','F8-10']});
(function(){'use strict';
const N=window.NOVA,C=window.F812_CONFIG,H=N.h,E=N.svg.el,ID=C.id;
const P={
 'Y8-031-A':{label:'Y8 · Symmetric roots',lesson:'Y8-031',a:1,b:0,c:-4,desc:'Two roots either side of the origin.',bob:['The roots are the x-values where the graph reaches zero.','Factorise the expression into two bracket factors.','Set either bracket equal to zero to find both roots.','The quadratic formula provides an independent algebraic route.','The discriminant confirms that two real roots exist.','The graph meets the x-axis at the same two values.','Substitute both roots to prove the answer.']},
 'Y8-031-B':{label:'Y8 · Two positive roots',lesson:'Y8-031',a:1,b:-4,c:3,desc:'The turning point sits between two positive roots.',bob:['We need both crossings, not just the turning point.','Find two values that multiply to three and add to negative four.','Each factor equals zero at a different point.','Identify a, b and c before using the formula.','Check the discriminant under the square root.','The roots appear at each x-axis intersection.','Test both values in the original expression.']},
 'Y9-011-A':{label:'Y9 · Downward parabola',lesson:'Y9-011',a:-1,b:2,c:3,desc:'A downward-opening graph with two roots.',bob:['A negative x-squared coefficient turns the parabola downwards.','Factor out the negative sign carefully first.','Both roots still make the original expression equal zero.','The quadratic formula works when a is negative.','Square b carefully; do not lose its sign.','Read both crossings and distinguish them from the maximum.','Verify each result in the original downward-opening equation.']},
 'Y9-011-B':{label:'Y9 · Negative and positive',lesson:'Y9-011',a:1,b:2,c:-3,desc:'The two roots have different signs.',bob:['One crossing is negative, the other positive.','Use factor pairs whose product is negative three.','A product equals zero if either factor equals zero.','The formula confirms the negative and positive answers.','The discriminant is positive, so two distinct real roots exist.','The graph agrees with the factorised expression.','Substitute each signed root to check.']},
 'Y9-011-C':{label:'Y9 · Leading coefficient two',lesson:'Y9-011',a:2,b:-2,c:-4,desc:'A quadratic with a non-unit leading coefficient.',bob:['The squared coefficient is two this time.','Factor out two and then factorise the smaller quadratic.','Never forget the common factor when presenting the working.','Use the full coefficient a in the denominator of the formula.','The discriminant is positive, giving two real roots.','Check the intercepts against the coordinate axes.','Verify both roots in the original rule.']}
};
const ORDER=Object.keys(P),STEPS=['Meet the quadratic','Build the factor pairs','Apply the zero-product rule','Read the formula','Evaluate the discriminant','Locate the graph roots','Verify both solutions'];
const MODE={mode:'guided',preset:ORDER[0],step:0};
function solution(p){const d=p.b*p.b-4*p.a*p.c;if(p.a===0||d<0)throw Error('Preset must have two real roots.');const s=Math.sqrt(d);return {discriminant:d,roots:[(-p.b-s)/(2*p.a),(-p.b+s)/(2*p.a)].sort((a,b)=>a-b),vertex:{x:-p.b/(2*p.a),y:p.c-p.b*p.b/(4*p.a)},s}};
function fn(p,x){return p.a*x*x+p.b*x+p.c}
function clean(n){let x=Math.round(n*1000)/1000;if(Object.is(x,-0))x=0;return x<0?'−'+Math.abs(x):''+x}
function mag(n){return Math.abs(n)===1?'':String(Math.abs(n))}
function equation(p){let a=(p.a<0?'−':'')+mag(p.a)+'x²',b=p.b===0?'':(p.b<0?' − ':' + ')+mag(p.b)+'x',c=p.c===0?'':(p.c<0?' − ':' + ')+Math.abs(p.c);return a+b+c+' = 0'}
function factor(p){const r=solution(p).roots;const f=r.map(x=>'('+(x===0?'x':x>0?'x − '+clean(x):'x + '+clean(-x))+')').join('');return (p.a===1?'':p.a===-1?'−':clean(p.a))+f}
function simpleFactors(p){return solution(p).roots.map(r=>'x '+(r>0?'− '+clean(r):r<0?'+ '+clean(-r):'= 0'))}
function state(){return {rings:[null,null],history:[],route:null,wrong:false,solved:false,message:'',tries:0,hint:false}}
function snap(x){return Math.max(-5,Math.min(5,Math.round(x*2)/2))}
function push(s){s.history.push({rings:s.rings.slice(),route:s.route});if(s.history.length>45)s.history.shift()}
function put(s,i,x){if(s.solved||![0,1].includes(i)||!Number.isFinite(x))return false;push(s);s.rings[i]=snap(x);s.wrong=false;s.message='Root ring positioned. Check where y equals zero.';emit('root',{ring:i,value:s.rings[i]});return true}
function remove(s,i){if(s.solved||s.rings[i]===null)return false;push(s);s.rings[i]=null;s.wrong=false;s.message='Root ring returned to the tray.';emit('remove',i);return true}
function choose(s,route){if(s.solved||!['factor','formula','graph'].includes(route))return false;push(s);s.route=route;s.message='Route chosen. Every route must give the same two roots.';emit('route',route);return true}
function undo(s){if(s.solved||!s.history.length)return false;const h=s.history.pop();s.rings=h.rings;s.route=h.route;s.wrong=false;s.message='Previous stage restored.';return true}
function verify(p,s,v1,v2){s.tries++;s.wrong=true;s.solved=false;const trueR=solution(p).roots,arr=s.rings.slice().sort((a,b)=>a-b),answers=[v1,v2].sort((a,b)=>a-b),close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<.0001;
 if(!s.route)s.message='Select factorising, the quadratic formula or the graph as your chosen route.';
 else if(s.rings.some(v=>v===null))s.message='Place both root rings on the x-axis.';
 else if(!arr.every((v,i)=>close(v,trueR[i])))s.message='At least one ring is not on a true x-axis crossing. The turning point is NOT a root.';
 else if(!Number.isFinite(v1)||!Number.isFinite(v2))s.message='Enter both roots. Give the two x-values, not the turning-point coordinates.';
 else if(!answers.every((v,i)=>close(v,trueR[i])))s.message='Recheck the sign in one factor, or use −b ± √(b² − 4ac) over 2a.';
 else if(!trueR.every(r=>Math.abs(fn(p,r))<.0001))s.message='The proposed roots do not both make y zero.';
 else{s.wrong=false;s.solved=true;s.message='Correct: both rings, both values and both substitutions agree.';}
 emit('check',{correct:s.solved,preset:MODE.preset,tries:s.tries});N.events.emit('correct',{engine:ID,correct:s.solved});return s.solved;}
function emit(key,value){if(!C.events.value.includes(key))throw Error('Unregistered event '+key);N.events.emit('value',{engine:ID,key,value})}
function txt(svg,x,y,t,role='support',size=24,anchor='middle'){const q=N.chalkText(svg,x,y,String(t),{role,size,anchor});q.setAttribute('text-anchor',anchor);return q}
function box(svg,x,y,w,h,role='focus',r=16){return N.neonBox(svg,x,y,w,h,{role,r})}
function line(svg,x,y,xx,yy,role='given',width=3){return N.neonLine(svg,x,y,xx,yy,{role,width})}
function layout(mob){return mob?{w:460,h:1390,panels:{factor:{x:24,y:119,w:412,h:159},formula:{x:24,y:294,w:412,h:190},graph:{x:24,y:498,w:412,h:622}},plot:{x0:60,y0:600,w:343,h:397},tray:{x:27,y:1133,w:406,h:132},status:1338}: {w:1120,h:785,panels:{factor:{x:23,y:125,w:278,h:393},formula:{x:311,y:125,w:278,h:393},graph:{x:599,y:125,w:493,h:508}},plot:{x0:636,y0:204,w:421,h:354},tray:{x:23,y:552,w:562,h:179},status:762}}
function draw(stage,o={}){const mode=o.mode||MODE.mode,step=o.step??6,interactive=mode==='explore'||mode==='challenge',challenge=mode==='challenge',s=o.state||state(),p=P[o.preset||MODE.preset],sol=solution(p),mob=innerWidth<=760,D=layout(mob),progress=interactive?6:step,visible=(!interactive&&progress>=5)||s.solved,fin=(!interactive&&progress>=6)||s.solved;
 stage.innerHTML='';N.cap(stage,ID,'QUADRATIC SOLVE ROUTES',challenge?'FIND BOTH ROOTS':interactive?'THREE ROUTES · ONE ANSWER':STEPS[progress].toUpperCase());
 const svg=N.svg.root(D.w,D.h,'Three algebraic routes: factorising, quadratic formula and a NOVA Cartesian parabola with draggable root markers.');svg.classList.add('f812-svg');svg.setAttribute('data-mode',mode);svg.setAttribute('data-preset',o.preset||MODE.preset);svg.setAttribute('data-step',String(step));
 txt(svg,D.w/2,59,equation(p),'given',mob?28:36);txt(svg,D.w/2,98,'SAME EQUATION · THREE WAYS TO SOLVE','support',mob?17:19);
 const f=D.panels.factor,q=D.panels.formula,g=D.panels.graph;
 for(const [k,r,heading,colour] of [['factor',f,'01 · FACTORISE','given'],['formula',q,'02 · QUADRATIC FORMULA','op'],['graph',g,'03 · GRAPH ROOTS','focus']]){box(svg,r.x,r.y,r.w,r.h,colour,18);txt(svg,r.x+r.w/2,r.y+36,heading,colour,mob?20:21);line(svg,r.x+17,r.y+54,r.x+r.w-17,r.y+54,colour,2)}
 const factorY=f.y+83;
 if(interactive&&!s.solved){txt(svg,f.x+f.w/2,factorY,'Build the matching factors','support',mob?21:22)}else if(progress<1){txt(svg,f.x+f.w/2,factorY,'Which factors make zero?','support',mob?21:22)}else {txt(svg,f.x+f.w/2,factorY,factor(p),'given',mob?29:26)}
 if(!interactive&&progress>=2||s.solved){const rr=sol.roots;txt(svg,f.x+f.w/2,factorY+(mob?43:61),'Either bracket = 0','focus',mob?20:21);txt(svg,f.x+f.w/2,factorY+(mob?72:113),'x = '+clean(rr[0])+'   or   '+clean(rr[1]),'result',mob?25:24)}
 else if(interactive){txt(svg,f.x+f.w/2,factorY+(mob?43:65),'Zero-product rule','focus',mob?19:21)}
 if(!mob){
  if(interactive&&!s.solved){
    box(svg,f.x+19,f.y+217,f.w-38,77,'given',12);
    txt(svg,f.x+f.w/2,f.y+244,'FIND THE FACTOR PAIR','given',18);
    txt(svg,f.x+f.w/2,f.y+273,'(x  …  ?)(x  …  ?)','focus',22);
  }else if(progress>=1){box(svg,f.x+19,f.y+218,f.w-38,77,'given',12);txt(svg,f.x+f.w/2,f.y+262,factor(p),'given',23)}
  txt(svg,f.x+f.w/2,f.y+323,'EITHER FACTOR = 0','support',18);
  txt(svg,f.x+f.w/2,f.y+355,interactive&&!s.solved?'Compare the factor signs':'Check both solutions','focus',18)
 }
 // Formula: stacked mathematical fraction using NOVA Chalk text and core neonLine.
 const mid=q.x+q.w/2,top=q.y+90;
 const subst=(!interactive&&progress>=4)||s.solved;
 txt(svg,mid,top,subst?(clean(-p.b)+' ± √'+clean(sol.discriminant)):'−b ± √(b² − 4ac)','op',mob?24:23);
 line(svg,mid-(mob?122:109),top+10,mid+(mob?122:109),top+10,'op',3);
 txt(svg,mid,top+42,subst?('2 × '+clean(p.a)):'2a','op',mob?24:23);
 if((!interactive&&progress>=3)||s.solved||(interactive&&mob)){txt(svg,mid,top+(mob?84:110),'a = '+clean(p.a)+' · b = '+clean(p.b)+' · c = '+clean(p.c),'given',mob?19:19)}
 if(!interactive&&progress>=4||s.solved){txt(svg,mid,top+(mob?115:175),'b² − 4ac = '+clean(sol.discriminant),'focus',mob?22:20)}
 if(!mob){
  if(interactive&&!s.solved){
   box(svg,q.x+19,q.y+212,q.w-38,93,'op',12);
   txt(svg,mid,q.y+239,'SUBSTITUTE INTO','support',17);
   txt(svg,mid,q.y+274,'a = '+clean(p.a)+'    b = '+clean(p.b)+'    c = '+clean(p.c),'given',19);
  }
  txt(svg,mid,q.y+333,(!interactive&&progress>=4||s.solved)?'Two real x-axis crossings':'THE DISCRIMINANT','support',17);
  txt(svg,mid,q.y+366,fin?'ROOTS VERIFIED':'Check the ± pair','focus',19)
 }
 // Canonical F0 Cartesian axes and neon curve.
 const A=N.neonPlot(svg,{...D.plot,x:[-5,5],y:[-7,7],xStep:1,yStep:2,xLabel:'x',yLabel:'y'});
 if(interactive||progress>=5){let segments=[],start=null;const pts=[];for(let k=0;k<=240;k++){const x=-5+10*k/240,y=fn(p,x);if(y>=-7&&y<=7){if(!start)start=true;pts.push([A.X(x),A.Y(y)])}else if(pts.length){segments.push(pts.splice(0));start=null;}}if(pts.length)segments.push(pts);for(const part of segments){if(part.length<2)continue;const dd=part.map((t,i)=>(i?'L':'M')+t[0].toFixed(2)+','+t[1].toFixed(2)).join(' ');N.neonPath(svg,dd,{role:'op',width:3.7})}}
 const vx=A.X(sol.vertex.x),vy=A.Y(sol.vertex.y);if(interactive||progress>=5){N.neonRing(svg,vx,vy,{role:'given',r:6});if(fin){txt(svg,Math.min(D.plot.x0+D.plot.w-75,Math.max(D.plot.x0+85,vx+64)),Math.max(D.plot.y0+50,vy-23),'TURNING POINT','support',mob?14:17)}}
 if(interactive){box(svg,D.tray.x,D.tray.y,D.tray.w,D.tray.h,'error',14);txt(svg,D.tray.x+D.tray.w/2,D.tray.y+32,'ROOT RING TRAY · RETURN ZONE','error',mob?18:19);if(!mob)txt(svg,D.tray.x+D.tray.w/2,D.tray.y+139,'Drag the rings to the two x-axis crossings','support',19)}
 else {box(svg,D.tray.x,D.tray.y,D.tray.w,D.tray.h,'support',14);txt(svg,D.tray.x+D.tray.w/2,D.tray.y+45,'VERIFY EACH ROOT IN THE ORIGINAL RULE','focus',mob?18:23);txt(svg,D.tray.x+D.tray.w/2,D.tray.y+(mob?95:108),fin?'Both substitutions give zero':'Roots make y equal zero','result',mob?20:22)}

 const axisY=A.Y(0),rin=s.rings,defaultX=[mob?D.plot.x0+76:D.plot.x0+98,mob?D.plot.x0+D.plot.w-60:D.plot.x0+D.plot.w-60];
 for(let i=0;i<2;i++){const placed=rin[i]!==null,show=placed||visible;let x=placed?A.X(rin[i]):visible?A.X(sol.roots[i]):defaultX[i],y=placed||visible?axisY:D.tray.y+72;
 if(show){N.neonRing(svg,x,y,{role:(s.solved||!interactive)?'result':'unknown',r:12,pulse:s.solved});if(s.solved||!interactive&&progress>=6){txt(svg,x,axisY-31,'x = '+clean(sol.roots[i]),'result',mob?19:20)}}
 if(interactive&&!s.solved){const ring=E('g',{class:'f812-drag','data-ring':String(i),tabindex:0,role:'button','aria-label':'Root ring '+(i+1)+'. Drag onto the x axis or press arrow keys to move by one half unit.'},svg);N.neonRing(ring,x,y,{role:'unknown',r:16});let pointerUp={x,y};ring.addEventListener('pointerup',ev=>{const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const m=svg.getScreenCTM();if(m){const z=pt.matrixTransform(m.inverse());pointerUp={x:z.x,y:z.y}}},true);
 ring.addEventListener('pointerdown',ev=>{try{ring.releasePointerCapture(ev.pointerId)}catch(_){}});
 ring.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();o.onPut?.(i,(rin[i]??0)+(ev.key==='ArrowRight'?.5:-.5))}else if(['Delete','Backspace','Escape'].includes(ev.key)){ev.preventDefault();o.onRemove?.(i)}else if(ev.key==='Enter'){ev.preventDefault();o.onPut?.(i,rin[i]??0)}});
 N.ui.svgDrag(svg,ring,{box:{x:x-24,y:y-24,w:48,h:48},zones:()=>[{id:'axis',kind:'drop',x:D.plot.x0,y:axisY-41,w:D.plot.w,h:83},{id:'return',kind:'remove',x:D.tray.x,y:D.tray.y,w:D.tray.w,h:D.tray.h}],onDrop:()=>{let t=window.__f812PointerUp||pointerUp;const pt=svg.createSVGPoint();pt.x=t.x;pt.y=t.y;const m=svg.getScreenCTM();if(!m)return false;const z=pt.matrixTransform(m.inverse());const xx=A.toData(z.x,axisY)[0];return !!o.onPut?.(i,xx)},onRemove:()=>!!o.onRemove?.(i)});
 }
 }
 const status=s.solved?'TWO ROOTS VERIFIED':interactive?'SELECT A ROUTE · PLACE TWO RINGS':STEPS[progress].toUpperCase();txt(svg,D.w/2,D.status,status,s.solved?'result':'focus',mob?19:21);
 stage.append(svg);
 const reaction=s.solved?'celebrate':s.wrong?'not-yet':interactive?'think':['explain','point-down','count','magnify','think','point-right','celebrate'][progress];const caption=s.solved?'Both roots checked!':s.wrong?'Recheck the crossings.':interactive?'Zero is on the x-axis.':['Start with the curve.','Build the bracket pairs.','Either factor may be zero.','Use a, b and c.','Check the discriminant.','Find both crossings.','Substitute to verify!'][progress];N.scene.helperStrip(stage,reaction,caption);
 const teach=H('div',{class:'f812-teach'});teach.append(H('b',{text:interactive?'Mathematical evidence':'Sir Bob explains'}),H('span',{text:interactive?(s.solved?'Both substituted values give zero. Graph, factorisation and formula agree.':p.desc+' Identify the two graph roots, not the vertex.'):p.bob[progress]}));stage.append(teach);
 if(challenge&&N.helperImg){const peer=N.helperImg(s.solved?'victory':'think','teen'),row=H('div',{class:'f812-peer'});row.append(H('img',{src:peer.src,alt:peer.alt,width:60,height:60}),H('span',{text:s.solved?'Izaac · Both solutions verified.':'Izaac · Check y is zero at each root.'}));stage.append(row)}
 if(s.solved&&!N.reducedMotion()&&N.motion?.flash)N.motion.flash(svg,A.X(sol.roots[0]),axisY,'result',27);
 return {svg,plot:A,layout:D};}
const BEATS=STEPS.map((name,i)=>({name,caption:name,get narration(){return P[MODE.preset].bob[i]},prompt:'Explain the mathematical reason for the next step.'}));
function spec(){return {purpose:'Connect factorising, the quadratic formula and graphical roots for quadratic equations.',params:'Signed integer a,b,c with two real roots, x range −5…5, vertex, discriminant and half-unit snap.',presets:ORDER.join(' · '),steps:STEPS,interactions:'Drag and keyboard-position two root rings; choose a solve route; remove/undo/reset, verify two typed solutions.',traps:'Confusing the turning point with a root; wrong factor sign; forgetting b² or 2a; missing a negative root; one root instead of two.',gcse:'Negative leading coefficient, non-monic quadratic, discriminant and formula corroboration.',linked:C.references}}
function ctrl(panel,on,withPreset){const bar=H('div',{class:'f812-controls'}),sel=H('select',{class:'f812-select','aria-label':'Choose quadratic example'});ORDER.forEach(id=>sel.append(H('option',{value:id,text:P[id].label})));sel.value=MODE.preset;sel.hidden=!withPreset;sel.onchange=()=>on('preset',sel.value);
 const undoB=H('button',{class:'nova-btn',text:'Undo',onclick:()=>on('undo')}),resetB=H('button',{class:'nova-btn ghost',text:'Reset',onclick:()=>on('reset')}),hintB=H('button',{class:'nova-btn',text:'Hint',onclick:()=>on('hint')}),checkB=H('button',{class:'nova-btn primary',text:'Check roots',onclick:()=>on('check')});bar.append(sel,undoB,resetB,hintB,checkB);panel.append(bar);
 const routes=H('div',{class:'f812-route',role:'group','aria-label':'Choose a quadratic solving route'}),routeB={};for(const [value,label] of [['factor','Factorise'],['formula','Quadratic formula'],['graph','Graph']]){const b=H('button',{class:'nova-btn ghost',text:label,'aria-pressed':'false',onclick:()=>on('route',value)});routes.append(b);routeB[value]=b}panel.append(routes);
 const fields=H('div',{class:'f812-fields'}),in1=H('input',{type:'number',step:'0.5',placeholder:'First root','aria-label':'First root'}),in2=H('input',{type:'number',step:'0.5',placeholder:'Second root','aria-label':'Second root'});fields.append(H('label',{},['Root 1',in1]),H('label',{},['Root 2',in2]));panel.append(fields);return {sel,undoB,resetB,hintB,checkB,routeB,in1,in2};}
function interactive(mode,panel,api,stage){let index=0,id=mode==='challenge'?ORDER[0]:MODE.preset,s=state();const head=H('div',{class:'f812-task'}),fb=H('div',{class:'f812-feedback','aria-live':'polite'}),c=ctrl(panel,on,mode==='explore');const next=H('button',{class:'nova-btn primary',text:'Next quadratic',onclick:()=>{if(!s.solved)return;if(index<ORDER.length-1){index++;id=ORDER[index];s=state();c.in1.value=c.in2.value='';redraw()}else{next.hidden=true;fb.textContent='All five quadratic challenges complete.'}}});if(mode==='challenge')panel.append(head);panel.append(fb);if(mode==='challenge')panel.append(next);
 function redraw(){MODE.preset=id;head.textContent='Challenge '+(index+1)+' of '+ORDER.length+' · '+P[id].label;c.sel.value=id;for(const k of Object.keys(c.routeB)){c.routeB[k].setAttribute('aria-pressed',String(s.route===k));c.routeB[k].disabled=s.solved}draw(stage,{mode,preset:id,state:s,onPut:(i,x)=>{const ok=put(s,i,x);if(ok)redraw();return ok},onRemove:i=>{const ok=remove(s,i);if(ok)redraw();return ok}});fb.textContent=s.message||'Choose a method, place both rings on the crossings, then enter both roots.';fb.dataset.status=s.solved?'correct':s.wrong?'wrong':'neutral';next.hidden=!s.solved;c.undoB.disabled=!s.history.length||s.solved;c.checkB.disabled=s.solved;c.in1.disabled=c.in2.disabled=s.solved;}
 function on(type,value){if(type==='preset'){id=value;s=state();c.in1.value=c.in2.value='';emit('preset',id)}else if(type==='reset'){s=state();c.in1.value=c.in2.value='';emit('reset',id)}else if(type==='undo')undo(s);else if(type==='route')choose(s,value);else if(type==='hint'){s.hint=true;s.message='A root is an x-value where y = 0. Use the bracket factors, the discriminant or x-axis crossings to check.';emit('hint',id);N.events.emit('hintUsed',{engine:ID,preset:id})}else if(type==='check'){const v1=c.in1.value.trim()===''?NaN:Number(c.in1.value),v2=c.in2.value.trim()===''?NaN:Number(c.in2.value);verify(P[id],s,v1,v2)}redraw();}
 redraw();}
const DEF={id:ID,title:C.title,config:{startMode:'guided',preset:ORDER[0]},steps:BEATS,alt:'Three distinct routes show a factorised quadratic, a stacked quadratic formula and a neon parabola with two draggable x-axis rings.',staticAlt:'The roots are the x-values at which a quadratic graph intersects the x-axis. Check by substitution into the original equation.',render(i,stage){MODE.step=i;draw(stage,{mode:MODE.mode,preset:MODE.preset,step:i})},exploreIntro:'Compare the three algebra and graph routes; move each root ring onto an x-axis crossing.',explore(panel,stage,api){MODE.mode='explore';interactive('explore',panel,api,stage)},challengeIntro:'Choose a method, place both roots on the graph and enter both x-values.',challenge(panel,api,stage){MODE.mode='challenge';interactive('challenge',panel,api,stage)}};
if(N.registry)N.registry.add({id:ID,title:C.title,kind:'engine',topics:['quadratics','graphs','factorising'],deps:C.references,events:['value','correct','step','hintUsed']});
N.events.on('mode',ev=>{const x=ev.detail||{};if(x.engine===ID)MODE.mode=x.mode});
window.addEventListener('pointerup',ev=>{window.__f812PointerUp={x:ev.clientX,y:ev.clientY};const d=N.ui._drag;if(d&&d.el?.classList?.contains('f812-drag'))queueMicrotask(()=>{if(N.ui._drag===d)d.up(ev)})},true);
const eng=N.bankMount({id:ID,num:'12',title:C.title,spec:spec(),years:'KS3 Years 8–9 · GCSE extension',linked:C.references,def:DEF});
window.F812_TEST={config:C,presets:P,order:ORDER,solution,fn,equation,factor,simpleFactors,clean,state,put,remove,choose,undo,verify,draw,setMode:eng.setMode,stateMode:()=>({...MODE})};
})();
