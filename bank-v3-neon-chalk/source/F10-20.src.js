/* NOVA F10-20 — Tangent and Area-under-curve Estimator · F0 core · single-board F10 */
const F120_CONFIG=Object.freeze({
 id:'F10-20',family:'F10',startMode:'watch',defaultPreset:'GCSE-QUADRATIC',
 presets:{
  'GCSE-QUADRATIC':{label:'GCSE · Quadratic curve',kind:'quadratic',x:3,a:0,b:4,n:4,context:'Gradient changes along a curved graph.'},
  'GCSE-LINEAR':{label:'GCSE · Straight line control',kind:'linear',x:3,a:0,b:4,n:4,context:'Every tangent has the same gradient on a straight line.'},
  'GCSE-CONCAVE':{label:'GCSE · Concave-down curve',kind:'concave',x:2,a:0,b:4,n:4,context:'The trapezia can underestimate a concave-down region.'},
  'GCSE-CUBIC':{label:'GCSE · Changing curvature',kind:'cubic',x:2,a:0,b:6,n:6,context:'Tangent gradient may rise and fall across a cubic curve.'},
  'GCSE-TRAPEZIA-2':{label:'GCSE · Two trapezia',kind:'quadratic',x:3,a:0,b:4,n:2,context:'Start with a rough area approximation.'},
  'GCSE-TRAPEZIA-8':{label:'GCSE · Eight trapezia',kind:'quadratic',x:3,a:0,b:4,n:8,context:'More narrower trapezia improve the estimate on this convex curve.'},
  'GCSE-SPEED':{label:'GCSE · Speed–time distance',kind:'speed',x:2,a:0,b:4,n:4,context:'Area under a speed–time graph estimates distance travelled.'}
 },
 events:{value:['preset','tangentX','areaStart','areaEnd','strips','reset','point','challengeValue'],types:['mode','step','correct','hintUsed']}
});
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F120_CONFIG,ID=C.id;
N.premium?.enable?.();
const S={preset:C.defaultPreset,kind:'quadratic',x:3,a:0,b:4,n:4,mode:'watch',correct:false};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),snap=(v,step=.25)=>Math.round(v/step)*step;
const fmt=(v,dp=3)=>{let n=Number(v.toFixed(dp));return String(Object.is(n,-0)?0:n).replace(/-/g,'−')};
const emit=(key,value)=>N.events.emit('value',{engine:ID,key,value});
const FUN={
 quadratic:{f:x=>1+.25*x*x,d:x=>.5*x,F:x=>x+Math.pow(x,3)/12,label:'y = 1 + 0.25x²',context:'Curved graph · rising gradient'},
 linear:{f:x=>1+x,d:x=>1,F:x=>x+x*x/2,label:'y = x + 1',context:'Straight line · constant gradient'},
 concave:{f:x=>10-.25*(x-4)**2,d:x=>-.5*(x-4),F:x=>6*x+x*x-x**3/12,label:'y = 10 − 0.25(x − 4)²',context:'Concave-down curve · decreasing gradient'},
 cubic:{f:x=>5+.075*(x-1)*(x-3)*(x-5),d:x=>.075*(3*x*x-18*x+23),F:x=>5*x+.075*(x**4/4-3*x**3+23*x*x/2-15*x),label:'y = 5 + 0.075(x − 1)(x − 3)(x − 5)',context:'Cubic curve · slope changes sign'},
 speed:{f:x=>1+.25*x*x,d:x=>.5*x,F:x=>x+Math.pow(x,3)/12,label:'v = 1 + 0.25t²',context:'Speed against time · area estimates distance'}
};
const fun=()=>FUN[S.kind];
function applyPreset(id=C.defaultPreset,notify=true){const p=C.presets[id]||C.presets[C.defaultPreset];S.preset=C.presets[id]?id:C.defaultPreset;for(const k of ['kind','x','a','b','n'])S[k]=p[k];S.correct=false;if(notify)emit('preset',S.preset)}
applyPreset(C.defaultPreset,false);
function trapezia(){const f=fun().f,dx=(S.b-S.a)/S.n;let sum=0;for(let i=0;i<S.n;i++){let l=S.a+i*dx,r=l+dx;sum+=(f(l)+f(r))*dx/2;}return sum}
function areaExact(){const F=fun().F;return F(S.b)-F(S.a)}
function slope(){return fun().d(S.x)}
const G={w:850,h:660,x0:109,y0:77,wPlot:630,hPlot:470,xmin:0,xmax:6,ymin:0,ymax:12};
const X=x=>G.x0+(x-G.xmin)*G.wPlot/(G.xmax-G.xmin),Y=y=>G.y0+(G.ymax-y)*G.hPlot/(G.ymax-G.ymin);
const chalk=(svg,x,y,t,role='support',size=31,anchor='start')=>N.chalkText(svg,x,y,String(t),{role,size,anchor});
const line=(svg,d,role='focus',width=4,dash)=>N.neonPath(svg,d,{role,width,dash});
function poly(x1,y1,x2,y2,x3,y3,x4,y4){return `M${x1},${y1}L${x2},${y2}L${x3},${y3}L${x4},${y4}Z`}
let refreshExplore=null;
function graph({phase=15,interactive=false,challenge=false,correct=false}={}){
 const svg=N.svg.root(G.w,G.h,'Curve and tangent on coordinate axes. Shaded trapezia approximate the area between two x-values; the tangent touches the curve at a movable point.');
 svg.classList.add('nv-svg','f120-svg');svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('viewBox','18 2 806 648');svg.dataset.testid='f120-graph';
 const plotFrame={x0:G.x0,y0:G.y0,w:G.wPlot,h:G.hPlot,x:[0,6],y:[0,12],xStep:1,yStep:2};
 const grid=N.neonPlot(svg,plotFrame);grid?.g?.classList.add('f120-grid');grid?.g?.querySelectorAll('text').forEach(t=>t.remove());
 let ax=N.svg.axes(svg,{x:G.x0,y:G.y0,w:G.wPlot,h:G.hPlot,xmin:0,xmax:6,ymin:0,ymax:12,ticks:1});ax?.g?.classList.add('f120-core-axes');ax?.g?.querySelectorAll('text').forEach(t=>t.remove());
 for(let i=0;i<=6;i++){chalk(svg,X(i),G.y0+G.hPlot+38,i,'support',30,'middle')}
 for(let j=0;j<=12;j+=2){chalk(svg,G.x0-18,Y(j)+9,j,'support',30,'end')}
 chalk(svg,G.x0,G.y0-30,'OUTPUT · y','op',37);
 chalk(svg,G.x0+G.wPlot/2,G.y0+G.hPlot+88,S.kind==='speed'?'TIME · t':'INPUT · x','op',37,'middle');
 const defs=E('defs',{},svg),cp=E('clipPath',{id:'f120-clip'},defs);E('rect',{x:G.x0,y:G.y0,width:G.wPlot,height:G.hPlot},cp);
 const ink=E('g',{'clip-path':'url(#f120-clip)'},svg);
 const f=fun().f,showCurve=phase>=1||interactive||challenge,showTangent=phase>=3||interactive||challenge,showArea=phase>=6||interactive||challenge;
 if(showArea){const dx=(S.b-S.a)/S.n;
  for(let i=0;i<S.n;i++){
   let l=S.a+i*dx,r=l+dx,y1=f(l),y2=f(r);
   const d=poly(X(l),Y(0),X(l),Y(y1),X(r),Y(y2),X(r),Y(0));
   const shade=E('path',{d,fill:i%2?'rgba(61,182,235,.20)':'rgba(86,238,180,.22)',stroke:'none',class:'f120-glass'},ink);
   const p=line(ink,d,i%2?'support':'result',2.5,i%2?'5 4':undefined);p.classList.add('f120-strip');
  }
  line(ink,`M${X(S.a)},${Y(0)}L${X(S.a)},${Y(f(S.a))}`,'result',3,'5 4');
  line(ink,`M${X(S.b)},${Y(0)}L${X(S.b)},${Y(f(S.b))}`,'result',3,'5 4');
  chalk(svg,X(S.a),G.y0+G.hPlot+65,'a','result',25,'middle');
  chalk(svg,X(S.b),G.y0+G.hPlot+65,'b','result',25,'middle');
 }
 if(showCurve){let d='';for(let x=0;x<=6.0001;x+=.04){d+=(d?'L':'M')+X(x).toFixed(2)+','+Y(f(x)).toFixed(2)}
  const curve=line(ink,d,'focus',5.5);curve.classList.add('f120-curve');
  if(phase===2 && !N.reducedMotion())try{N.motion.trail(ink,d,'focus',480)}catch(_e){}
 }
 let py=f(S.x),grad=slope(),xx=X(S.x),yy=Y(py);
 if(showTangent){
   // True derivative controls tangent direction; clip prevents drawing beyond the axes.
   let left=0,right=6;
   const d=`M${X(left)},${Y(py+grad*(left-S.x))}L${X(right)},${Y(py+grad*(right-S.x))}`;
   line(ink,d,'op',4,'9 5');
   line(ink,`M${xx},${Y(0)}L${xx},${yy}`,'support',2,'5 6');
   N.neonRing(ink,xx,yy,{r:13,role:correct?'result':'op',pulse:correct});
   if(phase>=5||interactive||challenge){
    const run=1,rise=grad*run;
    if(Math.abs(rise)>0.05&&Math.abs(rise)<6){let x2=clamp(S.x+(S.x>4.6?-1:1),.2,5.8),ystart=py,yend=py+grad*(x2-S.x);
      line(ink,`M${xx},${yy}H${X(x2)}V${Y(yend)}`,'unknown',3,'5 5');
    }
   }
 }
 if(interactive){let h=E('g',{class:'f120-handle',tabindex:'0',role:'slider','aria-label':'Tangent x-coordinate','aria-valuemin':'0','aria-valuemax':'6','aria-valuenow':String(S.x),'data-testid':'f120-handle'},svg);
  N.neonRing(h,xx,yy,{r:17,role:'result'});E('circle',{cx:xx,cy:yy,r:28,fill:'transparent','data-drag':'1'},h);
  h.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();S.x=clamp(e.key==='Home'?0:e.key==='End'?6:S.x+(['ArrowRight','ArrowUp'].includes(e.key)?.25:-.25),0,6);emit('tangentX',{value:S.x,source:'keyboard'});refreshExplore?.()});
  if(N.ui.svgDrag){const rect={x:xx-27,y:yy-27,w:54,h:54};N.ui.svgDrag(svg,h,{box:rect,zones:()=>[{id:'curve',kind:'drop',x:G.x0-14,y:G.y0-20,w:G.wPlot+28,h:G.hPlot+40},{id:'remove',kind:'remove',x:G.x0+70,y:G.y0+G.hPlot+90,w:G.wPlot-140,h:36}],onDrop:()=>{const tr=h.getAttribute('transform')||'',match=tr.match(/translate\(\s*([-\d.]+)/);let xx2=xx+(match?Number(match[1]):0);S.x=clamp(snap((xx2-G.x0)*6/G.wPlot),0,6);emit('tangentX',{value:S.x,source:'drag'});refreshExplore?.();return true},onRemove:()=>{applyPreset(S.preset);refreshExplore?.()},removeTo:{x:G.x0+G.wPlot/2,y:G.y0+G.hPlot+105}})}
 }
 return svg;
}
function evidence(label,val,note,type=''){return H('div',{class:'f120-stat',...(type?{'data-role':type}:{})},[H('div',{class:'f120-stat-label',text:label}),H('div',{class:'f120-stat-value',text:val}),H('div',{class:'f120-stat-note',text:note})])}
function scene(stage,{phase=15,interactive=false,challenge=false,correct=false,pose='explain',caption='A tangent estimates gradient at a point on the curve.'}={}){
 stage.replaceChildren();const theatre=H('section',{class:'f120-theatre','data-testid':'f120-theatre'});
 theatre.append(H('div',{class:'f120-topline'},[H('span',{text:'F10 · TANGENT & AREA STUDIO'}),H('span',{class:'f120-brand',text:'NOVA · NEON CHALK · GCSE'})]));
 let layout=H('div',{class:'f120-layout'}),plane=H('div',{class:'f120-plane'});
 plane.append(graph({phase,interactive,challenge,correct}));
 const title=interactive?'Move the tangent · refine the area':challenge?'Read the diagram before you decide':phase<=1?'A curve has a changing gradient':phase<6?'A tangent estimates gradient at one point':phase<11?'Trapezia build an area estimate':'A better approximation uses narrower strips';
 plane.append(H('h3',{class:'f120-title',text:title}));
 let subtitle=phase<3?'First trace the curve. Where does it rise fastest?':phase<6?'The gradient is the slope of the touching line, not the curve height.':'Count the trapezia. Their combined area approximates the region under the curve.';
 if(interactive)subtitle='Drag the glowing point, or adjust x and the number of strips below.';
 if(challenge)subtitle='Use the gradient and area evidence only after you have tried the question.';
 plane.append(H('p',{class:'f120-subtitle',text:subtitle}));layout.append(plane);
 const aside=H('aside',{class:'f120-info','aria-label':'Tangent and trapezium mathematical evidence'});
 const hide=challenge&&!correct;
 if(phase>=1||interactive||challenge)aside.append(evidence(S.kind==='speed'?'SPEED RULE':'CURVE RULE',fun().label,fun().context));
 if(phase>=3||interactive||challenge)aside.append(evidence('TANGENT AT x = '+fmt(S.x),hide?'Estimate the slope':fmt(slope())+' gradient','The tangent line touches at ('+fmt(S.x)+', '+fmt(fun().f(S.x))+').','op'));
 if(phase>=6||interactive||challenge)aside.append(evidence('TRAPEZIUM ESTIMATE',hide?'Estimate the region':fmt(trapezia())+(S.kind==='speed'?' distance units':' square units'),S.n+' strips between '+fmt(S.a)+' and '+fmt(S.b)+'.','result'));
 if(phase>=9||interactive||challenge)aside.append(evidence('TRUE AREA (ROUNDED)',hide?'Is it above or below?':fmt(areaExact())+(S.kind==='speed'?' distance units':' square units'),S.kind==='concave'?'For this concave-down example, straight tops lie below the curve.':S.kind==='linear'?'For a straight line, the trapezium rule is exact.':'For a convex quadratic, straight tops lie above the curve; the reference value is rounded.'));
 if(phase>=12||interactive||challenge)aside.append(evidence('ABSOLUTE DIFFERENCE',hide?'Check the size of the error':fmt(Math.abs(trapezia()-areaExact())),S.n+' strips · width '+fmt((S.b-S.a)/S.n)));
 layout.append(aside);theatre.append(layout);stage.append(theatre);
 N.scene.helperStrip(stage,correct?'cheer':pose,caption);return stage;
}
const STORY=[
 ['See a curved graph','explain','Watch this curve. Its height increases, but its steepness also changes.','GCSE-QUADRATIC',0,'Does every part of a curve have the same gradient?'],
 ['Draw the curve','point','First trace the changing curve across the coordinate grid.','GCSE-QUADRATIC',1,'Is this a straight line?'],
 ['Compare positions','count','Look carefully. The right-hand end grows steeper than the left.','GCSE-QUADRATIC',2,'Which part appears steepest?'],
 ['Touch with a tangent','point','A tangent is a straight line touching the curve locally at the selected point.','GCSE-QUADRATIC',3,'Is the tangent a curve or a straight line?'],
 ['Move the tangent','magnify','The gradient of the tangent estimates how quickly the curve changes at this point.','GCSE-QUADRATIC',4,'What does tangent gradient represent?'],
 ['Compare gradients','count','At x equals three, this tangent rises one and a half for each one across.','GCSE-QUADRATIC',5,'What is the tangent gradient at x equals three?'],
 ['Start an area','point','We want the area between x equals zero and four, under this curve.','GCSE-TRAPEZIA-2',6,'What do the vertical boundary lines show?'],
 ['Two trapezia','count','Two trapezia approximate the curved region using straight upper edges.','GCSE-TRAPEZIA-2',7,'Is this an exact area or an estimate?'],
 ['Four trapezia','magnify','Four narrower trapezia follow the curve more closely than two wide ones.','GCSE-QUADRATIC',8,'What happens when strips become narrower?'],
 ['Overestimate','point','On this curve, the straight edges sit just above the true curve, so the area estimate is too high.','GCSE-QUADRATIC',9,'Is the estimate an overestimate?'],
 ['Compare the error','count','Compare the trapezium estimate with the exact area. They are not identical.','GCSE-QUADRATIC',10,'Which figure is the estimate?'],
 ['Eight trapezia','magnify','Now use eight strips. The estimated area moves closer to the exact result.','GCSE-TRAPEZIA-8',11,'Which has less error, two or eight strips?'],
 ['Understand strip width','point','Width equals the full interval divided by the number of strips.','GCSE-TRAPEZIA-8',12,'What is each strip width for eight strips across four units?'],
 ['Check a straight line','magnify','For a straight line, every trapezium top matches the graph. The area is exact.','GCSE-LINEAR',13,'Can trapezia be exact for a straight line?'],
 ['Curve bent down','count','On a concave-down curve, the straight tops lie below the curve. Here we underestimate.','GCSE-CONCAVE',14,'Does bending the other way change the direction of error?'],
 ['Speed and distance','point','On a speed-time graph, area means distance. More strips refine the distance estimate.','GCSE-SPEED',15,'What does area represent on a speed-time graph?'],
 ['Investigate a cubic','magnify','A cubic can change its curvature. Compare the tangent gradients and errors at different positions.','GCSE-CUBIC',16,'Can a gradient be negative on a curved graph?'],
 ['Explore it yourself','cheer','Now move the tangent and change the strip count. Use Explore to predict and test.','GCSE-QUADRATIC',17,'How can you check whether an approximation improves?']
];
const STEPS=STORY.map(([name,mood,narration,,,prompt])=>({name,mood,narration,prompt}));
function render(i,stage){let t=STORY[i];applyPreset(t[3],false);scene(stage,{phase:t[4],pose:t[1],caption:t[2]})}
function explore(panel,stage){S.mode='explore';panel.classList.add('f120-controls');
 function redraw(){panel.replaceChildren();let pre=H('select',{class:'nova-input','aria-label':'Select graph preset','data-testid':'f120-preset'});
  for(let [id,p] of Object.entries(C.presets))pre.append(H('option',{value:id,text:p.label}));pre.value=S.preset;
  pre.onchange=()=>{applyPreset(pre.value);redraw()};panel.append(H('label',{class:'f120-wide f120-control'},[H('strong',{text:'CHOOSE YOUR CURVE'}),pre]));
  function slider(name,key,min,max,step,suffix=''){let display=H('strong',{text:fmt(S[key])+suffix}),r=H('input',{type:'range',min:String(min),max:String(max),step:String(step),value:String(S[key]),'aria-label':name,'data-testid':'f120-'+key});
    r.oninput=()=>{S[key]=Number(r.value);if(S.b<=S.a){if(key==='a')S.b=Math.min(6,S.a+1);else if(key==='b')S.a=Math.max(0,S.b-1)}emit(key==='x'?'tangentX':key==='a'?'areaStart':key==='b'?'areaEnd':'strips',{value:S[key],source:'slider'});redraw()};
    return H('label',{class:'f120-control'},[H('span',{class:'f120-control-head'},[H('span',{text:name}),display]),r])}
  panel.append(slider('TANGENT x','x',0,6,.25),slider('TRAPEZIUM STRIPS','n',1,12,1));
  panel.append(slider('AREA START · a','a',0,5,.5),slider('AREA END · b','b',1,6,.5));
  let row=H('div',{class:'f120-actions f120-wide'});
  for(let [label,delta] of [['−0.25',-.25],['+0.25',.25]])row.append(H('button',{class:'nova-btn',type:'button',text:label,onclick:()=>{S.x=clamp(snap(S.x+delta),0,6);emit('tangentX',{value:S.x,source:'button'});redraw()}}));
  row.append(H('button',{class:'nova-btn',type:'button','data-testid':'f120-reset',text:'↶ Restore preset',onclick:()=>{applyPreset(S.preset);emit('reset',true);redraw()}}));panel.append(row);
  panel.append(H('p',{class:'f120-help f120-wide',text:'Drag the tangent point, use arrow keys on it, or change x below. The tangent slope is a rate of change; the trapezia estimate the accumulated area.'}));
  scene(stage,{interactive:true,pose:'point',caption:'At x equals '+fmt(S.x)+', the tangent gradient is '+fmt(slope())+'. With '+S.n+' strips the area estimate is '+fmt(trapezia())+'.'})
 }
 refreshExplore=redraw;redraw();
}
const TASKS=[
 {preset:'GCSE-QUADRATIC',answer:1.5,q:'At x = 3 on the quadratic curve, what is the tangent gradient?',hint:'Differentiate 1 + 0.25x², or read the touching straight line.',wrong:'The gradient is not the curve height. At x = 3 the tangent slope is 1.5.'},
 {preset:'GCSE-QUADRATIC',answer:0,q:'At x = 0 on the quadratic, what is the tangent gradient?',hint:'The curve begins flat at its lowest shown point.',wrong:'At the origin-side turning point, the tangent is horizontal.',x:0},
 {preset:'GCSE-LINEAR',answer:1,q:'What is the gradient of y = x + 1?',hint:'A line rising 1 for every 1 across has gradient 1.',wrong:'Do not confuse the y-intercept with the gradient.'},
 {preset:'GCSE-TRAPEZIA-2',answer:10,q:'Estimate the area from 0 to 4 using two trapezia (quadratic preset).',hint:'Width 2; heights are 1, 2 and 5. Use half-width times adjacent height sums.',wrong:'The trapezium estimate is 10 square units; the true area is smaller.'},
 {preset:'GCSE-QUADRATIC',answer:9.5,q:'Estimate the area from 0 to 4 using four trapezia.',hint:'Width 1; add half the first and last heights, plus all middle heights.',wrong:'Four strips give 9.5, not the exact area.'},
 {preset:'GCSE-TRAPEZIA-8',answer:9.375,q:'Estimate the area from 0 to 4 using eight trapezia.',hint:'The width is 0.5 units. Add trapezium areas, not just heights.',wrong:'Eight strips give 9.375 square units.'},
 {preset:'GCSE-TRAPEZIA-8',answer:.5,q:'What is each trapezium width when the interval is 4 and n = 8?',hint:'Divide interval length by the number of strips.',wrong:'The strip width is 4 divided by 8, giving one half.'},
 {preset:'GCSE-LINEAR',answer:12,q:'Find the trapezium area from 0 to 4 under y = x + 1.',hint:'A trapezium of parallel heights 1 and 5, width 4.',wrong:'Average the end heights then multiply by width: 12.'},
 {preset:'GCSE-QUADRATIC',answer:'over',q:'For this convex quadratic, is the four-strip estimate over or under the true area? Type “over”.',hint:'Straight tops of trapezia sit just above this bending-up curve.',wrong:'Here the trapezium rule overestimates because the chord is above the curve.'},
 {preset:'GCSE-CONCAVE',answer:'under',q:'For the concave-down graph, is the estimate over or under? Type “under”.',hint:'Look at how the line segments sit beneath the curve.',wrong:'Concave-down graphs give an underestimate here.'},
 {preset:'GCSE-SPEED',answer:'distance',q:'Area under a speed–time graph represents what? Type “distance”.',hint:'Speed multiplied by time produces distance.',wrong:'The area measures distance travelled, not acceleration.'},
 {preset:'GCSE-QUADRATIC',answer:4,q:'The interval from 0 to 4 has four strips. What is the total interval length?',hint:'Subtract the start from the end.',wrong:'Four minus zero equals four units.'},
 {preset:'GCSE-QUADRATIC',answer:9.333,q:'To three decimals, what is the exact area from 0 to 4 under 1 + 0.25x²?',hint:'This GCSE extension uses the antiderivative x + x³/12.',wrong:'The exact area is 9.333 to three decimals. It differs from 9.5.'}
];
function challenge(panel,api,stage){S.mode='challenge';let qs=TASKS.map((t,i)=>({q:t.q,build:controls=>{applyPreset(t.preset,false);if(t.x!==undefined)S.x=t.x;let inp=H('input',{class:'nova-input',type:'text','data-testid':'f120-answer','aria-label':'Answer tangent or area challenge',placeholder:'Enter number or word'});controls.append(H('label',{class:'f120-task'},[H('span',{text:'YOUR ANSWER'}),inp]));inp.oninput=()=>emit('challengeValue',{task:i,value:inp.value});return()=>inp.value},check:val=>{let v=String(val||'').trim().toLowerCase().replace('−','-'),target=t.answer,ok=typeof target==='number'?v!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v)-target)<=.001:((target==='over'&&['over','overestimate','overestimates'].includes(v))||(target==='under'&&['under','underestimate','underestimates'].includes(v))||(target==='distance'&&['distance','distance travelled'].includes(v)));
  if(ok){S.correct=true;N.events.emit('correct',{engine:ID,key:'challenge',value:{task:i,answer:val}});scene(stage,{challenge:true,correct:true,pose:'cheer',caption:'Correct. The graph and your mathematical reasoning agree.'})}
  return[ok,ok?'Correct. '+t.q+' Answer: '+target+'.':v===''?'Enter an answer before checking.':t.wrong]},hint:t.hint,solve:()=>{S.correct=true;scene(stage,{challenge:true,correct:true,pose:'explain',caption:'The answer is '+t.answer+'. Recheck the graph and units.'})}}));
 N.challengeRun(panel,api,qs,i=>{const t=TASKS[i];applyPreset(t.preset,false);if(t.x!==undefined)S.x=t.x;S.correct=false;scene(stage,{challenge:true,pose:'think',caption:'Make a prediction first. Estimate from the graph and check the axes carefully.'})},C)
}
const def={id:ID,title:'Tangent and Area-under-Curve Estimator',config:C,steps:STEPS,render,explore,challenge,
 alt:'On neon coordinate axes a curved graph is touched by a glowing dashed tangent line at an adjustable point; coloured translucent trapezia estimate the area below the curve.',
 staticAlt:'For y = 1 + 0.25x², the tangent gradient is x/2. At x=3 it is 1.5. From x=0 to x=4 the exact area is 9.333… square units. The trapezium estimates with 2, 4, and 8 strips are 10, 9.5 and 9.375 square units.',
 exploreIntro:'Choose a curve. Drag or use arrow keys on the glowing tangent point, then adjust strip count and interval. Compare slope, area estimate and exact area.',onRestore:()=>applyPreset(C.defaultPreset)};
 N.registry.add({id:ID,title:'Tangent and Area-under-Curve Estimator',family:'F10',topics:['tangent','gradient at point','trapezium rule','area under curve','speed time area','GCSE extension'],deps:['F0-02','F0-14','F10-12','F10-18']});
 N.bankMount({id:ID,num:'20',title:'Tangent and Area-under-Curve Estimator · Premium Edition',def,linked:['F0-14','F10-12','F10-18'],years:'GCSE EXTENSION · tangent and trapezium estimator',spec:{purpose:'Read tangent gradients as instantaneous rates of change, and estimate area beneath a curve with strips. GCSE extension outside the core KS3 sequence.',params:'Curve model, tangent position x, interval [a,b] and trapezium strip count n (1–12).',presets:'Seven named examples: quadratic, linear, concave-down, cubic, coarse/fine trapezia and speed–time.',steps:'18 distinct narrated teaching stages, Explore and 13 independent Challenge questions.',interactions:'Watch, Guided, Explore and Challenge; graph handle drag and keyboard, interval and strip controls, reset, hints and checking.',traps:'Gradient is not y-height; chord area is an estimate for curves; convex versus concave effects; speed-time area represents distance.',gcse:'The F10 master explicitly labels this component as an optional GCSE extension, not a KS3 lesson.'}});
 window.addEventListener('load',()=>document.querySelectorAll('#F10-20 img').forEach(img=>{if(!img.alt)img.alt='NOVA maths tutor mascot'}),{once:true});
})();
