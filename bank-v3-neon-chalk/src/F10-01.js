/* NOVA V2 native lesson API 1.0.0. Original renderers, artwork and core are authoritative. */
(function(w){'use strict';
const copy=x=>clone(x,new WeakMap());
function clone(x,seen){if(x===null||typeof x!=='object'||x.nodeType)return x;if(seen.has(x))return seen.get(x);let out;if(x instanceof Set){out=new Set();seen.set(x,out);for(const v of x)out.add(clone(v,seen));return out;}if(x instanceof Map){out=new Map();seen.set(x,out);for(const[k,v]of x)out.set(clone(k,seen),clone(v,seen));return out;}if(x instanceof Date)return new Date(x);if(ArrayBuffer.isView(x))return x.slice?x.slice():x;if(x instanceof ArrayBuffer)return x.slice(0);out=Array.isArray(x)?[]:Object.create(Object.getPrototypeOf(x));seen.set(x,out);for(const[k,v]of Object.entries(x))out[k]=clone(v,seen);return out;}

function hydrate(original,value){if(typeof original==='function'&&value!==original)throw Error('Native functions cannot be replaced by lesson data');if(original instanceof Set){if(!(value instanceof Set)&&!Array.isArray(value))throw Error('A native set expects an array of values');return new Set([...value].map(copy));}if(original instanceof Map){if(!(value instanceof Map)&&!Array.isArray(value))throw Error('A native map expects entries');return new Map([...value]);}if(Array.isArray(value))return value.map((v,i)=>hydrate(Array.isArray(original)?original[i]:undefined,v));if(value&&typeof value==='object'&&!value.nodeType){const out=original&&typeof original==='object'?copy(original):{};for(const[k,v]of Object.entries(value)){if(!['__proto__','prototype','constructor'].includes(k))out[k]=hydrate(original?.[k],v);else throw Error('Unsafe state key');}return out;}return copy(value);}
const safe=k=>!['__proto__','prototype','constructor'].includes(k);
function patch(t,v,path='state',extra=false){if(!v||typeof v!=='object'||Array.isArray(v))throw Error(path+' must be an object');for(const[k,x]of Object.entries(v)){if(!safe(k)||(!extra&&!(k in t)))throw Error('Unsupported '+path+'.'+k);const descriptor=Object.getOwnPropertyDescriptor(t,k);if(descriptor?.get&&!descriptor.set){if(extra)continue;throw Error('Read-only '+path+'.'+k);}if(x&&typeof x==='object'&&!Array.isArray(x)&&!(x instanceof Set)&&!(x instanceof Map)&&t[k]&&typeof t[k]==='object'&&!Array.isArray(t[k])&&!(t[k] instanceof Set)&&!(t[k] instanceof Map))patch(t[k],x,path+'.'+k,extra);else t[k]=hydrate(t[k],x);}return t;}
const registry={};w.NovaV2Integration={version:'1.0.0',mutable:copy,configuration:x=>Object.isFrozen(x)||!Object.isExtensible(x)?{...x}:x,registry,register(id,def,scope){
 const steps=def.steps,draw=def.render,explore=def.explore,config=def.config||{},models=scope.models||{},tables=scope.tables||{},draws=scope.draws||{};let active=null,clock=null,disposed=false,pendingRestore=null,exploring=false,exploreBinding={};const exploreInitials={};const scenes={},events=[];
 const getModels=()=>Object.fromEntries(Object.entries(models).map(([k,get])=>[k,copy(get())]).filter(([,v])=>v&&typeof v==='object'&&!Array.isArray(v)));
 function applyModels(){for(const[k,v]of Object.entries(active?.models||{})){if(!models[k])throw Error(id+': unsupported model '+k);patch(models[k](),v,'models.'+k);}}
 function args(name,a){a=Array.from(a);if(!scenes[name])scenes[name]={parameters:draws[name],sample:a.map((v,i)=>i===0&&v?.nodeType?'[native stage]':copy(v))};applyModels();if(active?.scene&&(!active.scene.function||active.scene.function===name))for(const[k,v]of Object.entries(active.scene.arguments||{})){const i=draws[name]?.indexOf(k);if(i==null||i<1)throw Error(id+': unsupported scene argument '+k);a[i]=hydrate(a[i],v);}return a;}
 function validate(r){let errors=[],i=r.nativeIndex??r.nativeStep??0,d=r.data??r.nativeData??{};if(!Number.isInteger(i)||i<0||i>=steps.length)errors.push('Invalid native index '+i);if(!d||typeof d!=='object'||Array.isArray(d))errors.push('Native data must be an object');else for(const k of Object.keys(d))if(!safe(k)||!(k in(steps[i]||{})))errors.push('Unsupported native field '+k);if(d?.name!==undefined&&d.name!==steps[i]?.name)errors.push('Native step names are renderer keys; use the lesson title for teaching text');for(const k of Object.keys(r.models||{}))if(!models[k])errors.push('Unsupported model '+k);for(const k of Object.keys(r.tables||{}))if(!tables[k])errors.push('Unsupported table '+k);if(r.scene){const f=r.scene.function;if(!draws[f])errors.push('Declare a supported scene function');else for(const k of Object.keys(r.scene.arguments||{}))if(draws[f].indexOf(k)<1)errors.push('Unsupported scene argument '+k);}if(r.config&&Object.keys(r.config).some(k=>k.startsWith('_')))errors.push('Private runtime fields are not lesson configuration');
if(id==='F2-01'&&d.v!==undefined&&d.v!==''&&(!/^\d{1,4}(?:\.\d{0,3})?$/.test(String(d.v))))errors.push('This chart supports non-negative values up to thousands and thousandths');
if(id==='F1-07'&&d.st){const st=d.st;if(st.min!==undefined&&st.max!==undefined&&!(st.min<st.max))errors.push('Card-line minimum must be below maximum');if(st.labelStep!==undefined&&!(st.labelStep>0))errors.push('Card-line steps must be positive');if(st.cards&&(!Array.isArray(st.cards)||st.cards.some(x=>!Number.isFinite(Number(x)))))errors.push('Cards must contain numerical values');if(st.labels&&(!Array.isArray(st.labels)||st.labels.length!==st.cards?.length||st.labels.some((x,i)=>String(x).trim()===''||Number(x)!==Number(st.cards[i]))))errors.push('Card labels must represent their actual numerical positions');}
if(r.parameters){if(id!=='F3-04'||Object.keys(r.parameters).some(k=>k!=='n')||!Number.isInteger(r.parameters.n)||r.parameters.n<2||r.parameters.n>36)errors.push('Unsupported mathematical parameters');}return{valid:!errors.length,errors};}
 function configure(v){if(v&&Object.keys(v).length)patch(config,v,'config');}
 function configureExplore(binding={}){for(const k of Object.keys(binding.variables||{}))if(!(k in(scope.exploreFields||{})))throw Error(id+': unsupported Explore variable '+k);for(const k of Object.keys(binding.tables||{}))if(!tables[k])throw Error(id+': unsupported Explore table '+k);for(const k of Object.keys(binding.models||{}))if(!models[k])throw Error(id+': unsupported Explore model '+k);exploreBinding=copy(binding);}
 function applyExploreModels(){if(exploring)for(const[k,v]of Object.entries(exploreBinding.models||{}))patch(models[k](),v,'explore.models.'+k);}
 function exploreInit(name,factory,args){const binding=exploring?exploreBinding.variables?.[name]:null;if(binding?.factoryArgs&&!args)throw Error(id+': '+name+' is not a native state factory');const value=args?factory(...(binding?.factoryArgs||args)):factory();if(!(name in exploreInitials))exploreInitials[name]=copy(value);applyExploreModels();return binding&&Object.prototype.hasOwnProperty.call(binding,'value')?hydrate(value,binding.value):value;}
 function runExplore(args){api.cancel();exploring=true;try{for(const[k,v]of Object.entries(exploreBinding.tables||{})){const table=tables[k]();if(Array.isArray(table)){if(!Array.isArray(v))throw Error(k+' expects an array');table.splice(0,table.length,...copy(v));}else patch(table,v,'explore.tables.'+k,true);}applyExploreModels();return explore?.apply(def,args);}finally{exploring=false;}}
 function render(r,stage,animate=true){if(disposed)throw Error(id+': disposed');const check=validate(r);if(!check.valid)throw Error(id+': '+check.errors.join('; '));api.cancel();let i=r.nativeIndex??r.nativeStep??0,d=r.data??r.nativeData??{},saved=copy(steps[i]),oldSteps=def.steps,oldModels=getModels(),oldTables={},oldConfig={},rm=w.NOVA.reducedMotion;active=r;let restored=false;const restore=()=>{if(restored)return;restored=true;steps[i]=saved;patch(config,oldConfig,'config restore',true);for(const[k,v]of Object.entries(oldTables)){let t=tables[k]();if(Array.isArray(t))t.splice(0,t.length,...v);else patch(t,v,'restore',true);}for(const[k,v]of Object.entries(oldModels))patch(models[k](),v,'restore',true);};pendingRestore=restore;
 try{for(const k of Object.keys(r.config||{}))if(k in config)oldConfig[k]=copy(config[k]);configure(r.config);for(const[k,v]of Object.entries(r.tables||{})){const t=tables[k]();oldTables[k]=copy(t);if(Array.isArray(t)){if(!Array.isArray(v))throw Error(k+' expects array');t.splice(0,t.length,...copy(v));}else patch(t,v,'tables.'+k);}
 steps[i]={...saved,...copy(d)};def.steps=steps;applyModels();if(!animate)w.NOVA.reducedMotion=()=>true;draw.call(def,i,stage);
 const text=stage.textContent;for(const value of r.assertions?.contains||[])if(!text.includes(String(value)))throw Error(id+': visual missing '+value);for(const value of r.assertions?.excludes||[])if(text.includes(String(value)))throw Error(id+': visual unexpectedly reveals '+value);
 events.push({index:i,text,at:Date.now()});if(events.length>16)events.shift();
 }catch(error){restore();pendingRestore=null;active=null;throw error;}finally{def.steps=oldSteps;w.NOVA.reducedMotion=rm;}if(!animate){restore();pendingRestore=null;}
 return(clock?.idle()||Promise.resolve()).finally(()=>{if(pendingRestore===restore){restore();pendingRestore=null;}if(active===r)active=null;});}
 const api={id,version:'1.0.0',nativeSteps:steps,nativeRender:draw,config,args,applyModels,validate,configure,configureExplore,applyExploreModels,exploreInit,render,models:getModels,scenes,events,get active(){return active;},get clock(){return clock;},set clock(v){clock=v;},describe(){return{id,version:this.version,stepCount:steps.length,steps:copy(steps),config:copy(config),models:getModels(),tables:Object.fromEntries(Object.entries(tables).map(([k,get])=>[k,copy(get())])),draws,exploreFields:scope.exploreFields||{},exploreInitials:copy(exploreInitials)};},cancel(){clock?.cancel();const restore=pendingRestore;pendingRestore=null;restore?.();active=null;w.NOVA.ui?.cancelDrag?.();},dispose(){api.cancel();disposed=true;},explore(...a){return runExplore(a);}};
 def.explore=function(...a){return runExplore(a);};const onRestore=def.onRestore;def.onRestore=function(...a){api.cancel();return onRestore?.apply(def,a);};registry[id]=api;def.lesson=api;w.NovaLessonComponent=api;if(w.parent!==w&&typeof w.parent.NovaLessonNativeSetup==='function')w.parent.NovaLessonNativeSetup(w,def,config,steps);return api;
}};
})(window);


/* F10-01 Premium Edition | Four-quadrant coordinate grid.
 * Exact current F0 core only: NOVA.svg.axes, NOVA.neonPlot, neonLine/Path/Ring/Box,
 * chalkText, motion, svgDrag, events, NOVA.scene.helperStrip, NOVA.bankMount.
 */
const F101_CONFIG={
  id:'F10-01',family:'F10',startMode:'watch',preset:'Y7-038',
  bounds:{min:-5,max:5,step:1},selected:'A',
  presets:{
    'Y7-038':{label:'Y7 · Coordinates and shapes',range:5,kind:'points',points:[{id:'A',x:3,y:2},{id:'B',x:-4,y:3},{id:'C',x:-2,y:-3},{id:'D',x:4,y:-2}]},
    'Y8-024':{label:'Y8 · Plotting straight lines',range:5,kind:'line',formula:{m:1,c:1},points:[{id:'A',x:-3,y:-2},{id:'B',x:-1,y:0},{id:'C',x:1,y:2},{id:'D',x:3,y:4}]},
    'Y8-066':{label:'Y8 · Scatter graph and trend',range:5,kind:'scatter',points:[{id:'A',x:-4,y:-3},{id:'B',x:-2,y:-1},{id:'C',x:1,y:1},{id:'D',x:3,y:4}],additional:[[-3,-2],[0,1],[2,3]],formula:{m:.8,c:.5}},
    'Y9-009':{label:'Y9 · Coordinates and algebra',range:5,kind:'line',formula:{m:-1,c:2},points:[{id:'A',x:-2,y:4},{id:'B',x:0,y:2},{id:'C',x:2,y:0},{id:'D',x:4,y:-2}]}
  },
  events:{value:['point','selected','preset','quadrant','coordinates','pointCount','challengePoint','reset'],types:['step','correct','hintUsed','mode']},
  challenge:{targets:[[-3,2],[4,-2],[-2,-4]],maxAttemptsPerTask:0,gridTolerance:0}
};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=window.NovaV2Integration.configuration(F101_CONFIG),ID=C.id;
const V={W:508,H:510,x:63,y:64,w:382,h:382,min:-5,max:5};
const ST={preset:C.preset,selected:'A',points:clone(C.presets[C.preset].points),challengePoint:{x:0,y:0},task:0,step:0,wrongCount:0,correctCount:0,peerPose:'think'};
const modeSpeech={
  'axes':{pose:'explain',text:'The axes cross at zero. Across is x. Up and down is y.'},
  'quarters':{pose:'point',text:'Four quarters, four quadrants. Signs tell you which one.'},
  'first':{pose:'point',text:'Start at zero. Three right, then two up. That is A.'},
  'second':{pose:'think',text:'For B, move four left and three up. Read x first.'},
  'third':{pose:'point',text:'Two left and three down puts C in quadrant three.'},
  'fourth':{pose:'explain',text:'Four right and two down takes D into quadrant four.'},
  'reading':{pose:'cheer',text:'Read across first, then up or down. Always x, then y.'}
};
const steps=[
  {name:'axes',narration:'The horizontal axis is x and the vertical axis is y. They cross at the origin: zero, zero.',prompt:'Which axis runs left to right?',mood:'neutral'},
  {name:'quarters',narration:'The two axes divide the grid into four quadrants. Watch the positive and negative directions.',prompt:'Where are both coordinates positive?',mood:'think'},
  {name:'first',narration:'Plot A at three, two. Begin at the origin, move three right, then two up.',prompt:'What does the first coordinate tell us?',mood:'focus'},
  {name:'second',narration:'Plot B at negative four, three. Go four spaces left first and then three up.',prompt:'Why is the x-coordinate negative?',mood:'focus'},
  {name:'third',narration:'Plot C at negative two, negative three. Move left two and down three.',prompt:'Which quadrant contains two negative coordinates?',mood:'focus'},
  {name:'fourth',narration:'Plot D at four, negative two. Right four, then down two.',prompt:'Which coordinate is negative?',mood:'focus'},
  {name:'reading',narration:'To read any plotted point, follow x first, then y. We write the ordered pair inside brackets.',prompt:'Can you read the coordinates of all four points?',mood:'cheer'}
];
const challengeTargets=C.challenge.targets.map((a,i)=>({x:a[0],y:a[1],q:[
  'Plot (−3, 2): three left and two up.',
  'Plot (4, −2): four right and two down.',
  'Plot (−2, −4): two left and four down.'
][i],hint:[
  'Negative x moves left. Positive y moves up.',
  'Positive x moves right. Negative y moves down.',
  'Both negative: left first, then down.'
][i]}));
function clone(a){return JSON.parse(JSON.stringify(a));}
function emit(k,v){if(!C.events.value.includes(k))throw Error('Unregistered F10-01 event key '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function num(x){return x<0?'−'+Math.abs(x):String(x);}
function ordered(p){return '('+num(p.x)+', '+num(p.y)+')';}
function quad(x,y){if(x===0||y===0)return 'On an axis';return x>0?(y>0?'Quadrant I':'Quadrant IV'):(y>0?'Quadrant II':'Quadrant III');}
function safe(n){return Math.max(V.min,Math.min(V.max,Math.round(n)));}
function config(){return C.presets[ST.preset]||C.presets[C.preset];}
function mapX(x){return V.x+(x-V.min)*V.w/(V.max-V.min);}
function mapY(y){return V.y+(V.max-y)*V.h/(V.max-V.min);}
function label(s,x,y,str,size,role,extra){return N.chalkText(s,x,y,str,Object.assign({size:size||22,role:role||'given'},extra||{}));}
function chip(k,v,role){return N.neonCard([H('span',{class:'f101-eyebrow',text:k}),H('span',{class:'f101-value',text:v})],{role:role||'given'});}
function viewState(opts){return Object.assign({show:4,showQuadrants:true,read:true,drag:false,active:'A',challenge:false,trail:false,curve:true,brief:''},opts||{});}
function frame(svg,preset,opts){
  // Use F0-14 plot core as grid layer; its tiny default labels are hidden and replaced
  // by the canonical NOVA chalk labels, sized for 380px viewing.
  const P=N.neonPlot(svg,{x0:V.x,y0:V.y,w:V.w,h:V.h,x:[V.min,V.max],y:[V.min,V.max],xStep:1,yStep:1});
  P.g.setAttribute('class','nv-plot f101-grid-layer');
  P.g.querySelectorAll('text').forEach(t=>t.remove());
  // Core axes drawn in their own plot layer; only labels are substituted.
  const ax=N.svg.axes(svg,{x:V.x,y:V.y,w:V.w,h:V.h,xmin:V.min,xmax:V.max,ymin:V.min,ymax:V.max,ticks:1});
  ax.g.querySelectorAll('text').forEach(t=>t.remove());
  // Viewport-safe chalk scale numerals; show -5, -4 ... +5 at an honest 1-unit interval.
  for(let n=-5;n<=5;n++){
    if(n===0)continue;
    label(svg,mapX(n),mapY(0)+28,num(n),22,'support');
    label(svg,mapX(0)-17,mapY(n)+7,num(n),22,'support',{anchor:'end'});
  }
  label(svg,mapX(0)-15,mapY(0)+28,'0',22,'support',{anchor:'end'});
  label(svg,V.x+V.w+14,mapY(0)-15,'x',29,'op');
  label(svg,mapX(0)+18,V.y-15,'y',29,'op');
  if(opts.showQuadrants){
    const ii=[[-3.25,4.3,'II'],[3.25,4.3,'I'],[-3.5,-4.35,'III'],[3.25,-4.35,'IV']];
    ii.forEach(z=>{const t=label(svg,mapX(z[0]),mapY(z[1]),z[2],29,'support');t.setAttribute('opacity','.47');});
  }
  return P;
}
function drawGuide(svg,p,stage,i,active){
  if(!p||p.x===0&&p.y===0)return;
  const x=mapX(p.x),y=mapY(p.y),xx=mapX(0),yy=mapY(0);
  const left='M'+xx+','+yy+' L'+x+','+yy;
  const up='M'+x+','+yy+' L'+x+','+y;
  if(i>=0){
    const h=N.neonPath(svg,left,{role:'op',width:2.2,dash:'8 6'});h.style.opacity='.85';
    if(i>0){const v=N.neonPath(svg,up,{role:'focus',width:2.2,dash:'8 6'});v.style.opacity='.87';}
    if(i>1){const rr=N.neonRing(svg,x,y,{role:'focus',r:12,pulse:false});rr.style.opacity='.8';}
  }
  // Directional numbers are explained in the side card; avoid text on axis ticks.
}
function plotLine(svg,P,preset){
  const xmin=V.min,xmax=V.max,yymin=V.min,yymax=V.max;
  const m=preset.formula.m,c=preset.formula.c,clip=[];
  for(let i=0;i<=100;i++){const x=xmin+(xmax-xmin)*i/100,y=m*x+c;if(y>=yymin&&y<=yymax)clip.push([x,y]);}
  if(clip.length>1){const d=clip.map((p,i)=>(i?'L':'M')+mapX(p[0]).toFixed(2)+','+mapY(p[1]).toFixed(2)).join(' ');const ln=N.neonPath(svg,d,{role:'op',width:4});ln.classList.add('f101-graph-layer');}
}
function plottedPoint(svg,p,options){
  const px=mapX(p.x),py=mapY(p.y),sel=!!options.selected,kind=options.kind||'given';
  const g=E('g',{class:'f101-point',role:options.interactive?'slider':undefined,'aria-label':p.id+' at '+ordered(p)+', '+quad(p.x,p.y),'data-testid':'point-'+p.id},svg);
  const glow=N.neonRing(g,px,py,{role:sel?'focus':kind,r:sel?13:10,pulse:false});
  if(!sel)glow.setAttribute('opacity','.93');
  E('circle',{class:'f101-focus',cx:px,cy:py,r:22},g);
  if(options.showLabel!==false){
    const side=p.x>=4?-1:1;
    const lx=px+(side===1?25:-25),ly=py+(p.y>=4?29:-19);
    label(svg,lx,ly,p.id,27,sel?'focus':'given',{anchor:side===1?'start':'end'});
    if(options.read)label(svg,lx,ly+24,ordered(p),22,'support',{anchor:side===1?'start':'end'});
  }
  if(options.interactive){
    g.tabIndex=0;g.setAttribute('aria-valuetext',ordered(p));g.setAttribute('aria-valuemin','-5');g.setAttribute('aria-valuemax','5');g.setAttribute('aria-valuenow',String(p.x));
    g.setAttribute('aria-description','Drag on the grid, or use arrow keys to move by one unit. X moves across and Y moves vertically.');
    g.addEventListener('keydown',e=>{
      const d={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];
      if(d){e.preventDefault();e.stopPropagation();options.change(safe(p.x+d[0]),safe(p.y+d[1]),'keyboard');queueMicrotask(()=>{document.querySelector('#'+ID+' [data-testid="point-'+p.id+'"]').focus();});}
      if(e.key==='Home'){e.preventDefault();options.change(0,0,'keyboard');queueMicrotask(()=>{document.querySelector('#'+ID+' [data-testid="point-'+p.id+'"]').focus();});}
    });
    N.ui.svgDrag(svg,g,{box:{x:px-17,y:py-17,w:34,h:34},zones:()=>{
      const z=[],w=V.w/10,h=V.h/10;
      for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)z.push({id:x+','+y,kind:'drop',x:mapX(x)-w/2,y:mapY(y)-h/2,w:w,h:h});
      return z;
    },onDrop:id=>{const a=id.split(',').map(Number);options.change(a[0],a[1],'pointer');return true;}});
  }
  return g;
}
function aside(scene,preset,opts,chosen){
  const right=H('aside',{class:'f101-side','aria-label':'Coordinate reading cards'});
  const cp=chosen||{id:'A',x:3,y:2};
  right.appendChild(chip('Ordered pair · x then y',ordered(cp),'given'));
  right.appendChild(chip('Where is it?',quad(cp.x,cp.y),'op'));
  const stepCard=N.neonCard([H('span',{class:'f101-eyebrow',text:'The method'}),H('div',{class:'f101-readout',html:'<em>1</em> Read the x value.<br><em>2</em> Read the y value.<br><em>3</em> Check the quadrant.'})],{role:'support'});
  right.appendChild(stepCard);
  if(opts.challenge){
    const peer=N.helperImg(ST.peerPose,'teen');
    right.appendChild(H('div',{class:'f101-peer'},[
      H('img',{src:peer.src,alt:'Izaac, your challenge partner, thinking about the coordinates',width:67,height:76}),
      H('span',{text:ST.peerPose==='celebrate'?'Izaac · Three out of three. Brilliant!':ST.peerPose==='oops'?'Izaac · Check the signs.':ST.peerPose==='idea'?'Izaac · Read the hint carefully.':'Izaac · Check x first, then y.'})
    ]));
  }
  scene.appendChild(right);
}
function renderBoard(stage,spec){
if(window.NovaLessonComponent?.active){[stage,spec]=window.NovaLessonComponent.args("renderBoard",arguments);}

  spec=viewState(spec);stage.innerHTML='';
  const ps=spec.challenge?null:config(),live=spec.challenge?[{id:'T',...ST.challengePoint}]:ST.points.slice(0,spec.show);
  const scene=H('div',{class:'f101-scene'}),board=H('div',{class:'f101-board'});
  const title=H('div',{class:'f101-boardhead'},[H('b',{text:spec.challenge?'PLOT THE TARGET':(ps?ps.label.replace(/^Y[789] · /,''):'Four quadrants')}),H('span',{class:'f101-micro',text:'SCALE · 1 SQUARE = 1'})]);board.appendChild(title);
  const svg=N.svg.root(V.W,V.H,'Interactive four-quadrant coordinate grid from minus five to five on both axes. '+(spec.challenge?'Move target T with arrow keys or pointer.':'Shown points: '+live.map(p=>p.id+' '+ordered(p)).join(', ')));
  svg.setAttribute('class','nv-svg f101-svg');svg.setAttribute('data-testid','coordinate-grid');svg.removeAttribute('width');svg.removeAttribute('height');
  const P=frame(svg,ps,spec);
  if(ps&&spec.curve&&ps.formula&&spec.show>=2){plotLine(svg,P,ps);}
  if(ps&&ps.kind==='scatter'&&ps.additional&&spec.show>=2){ps.additional.forEach((p,i)=>{N.neonRing(svg,mapX(p[0]),mapY(p[1]),{role:'support',r:7,pulse:false});});}
  const point=spec.challenge?ST.challengePoint:(live.find(p=>p.id===spec.active)||live[live.length-1]);
  if(point&&spec.show>0&&!spec.challenge){drawGuide(svg,point,stage,spec.read?2:1,spec.read);}
  // Draw final markers after projections, so their visual presence has priority.
  live.forEach((p,i)=>plottedPoint(svg,p,{selected:spec.challenge||p.id===spec.active,kind:i%2?'op':'given',read:spec.read,interactive:spec.drag&&(spec.challenge||p.id===ST.selected),showLabel:spec.challenge?false:true,
    change:(x,y,how)=>{
      if(spec.challenge){ST.challengePoint={x,y};emit('challengePoint',{task:ST.task,x,y,how});}
      else {let q=ST.points.find(x=>x.id===p.id);if(q){q.x=x;q.y=y;emit('point',{id:q.id,x,y,how});}}
      renderBoard(stage,spec);
    }}));
  if(spec.challenge){
    const cp=ST.challengePoint;
    label(svg,mapX(cp.x)+(cp.x>=4?-26:26),mapY(cp.y)-20,'T '+ordered(cp),23,'focus',{anchor:cp.x>=4?'end':'start'});
  }
  board.appendChild(svg);
  const row=H('div',{class:'f101-chiprow'});
  if(spec.challenge)row.append(N.neonTile('Target '+(ST.task+1)+' / 3',{role:'focus'}),N.neonTile('Current '+ordered(ST.challengePoint),{role:'given'}));
  else {row.appendChild(N.neonTile('x first → y second',{role:'op'}));if(point)row.appendChild(N.answerChip(point.id+' '+ordered(point),true));}
  board.appendChild(row);scene.appendChild(board);
  aside(scene,ps,spec,point||{x:0,y:0});stage.appendChild(scene);
  const s=spec.challenge?{pose:'think',text:'Move T to the ordered pair in the question, then press Check.'}:modeSpeech[spec.stepName||'reading']||modeSpeech.reading;
  N.scene.helperStrip(stage,spec.challenge?(spec.success?'cheer':'think'):s.pose,spec.helper||s.text);
  return svg;
}
function render(i,stage){ST.step=i;const s=steps[i];let active= i<2?'A':i===2?'A':i===3?'B':i===4?'C':i===5?'D':'A';
  // Teaching is the default point set, regardless of lesson preset selected in Explore.
  if(i<7){ST.preset='Y7-038';ST.points=clone(C.presets['Y7-038'].points);}
  const show=i<2?0:Math.max(0,Math.min(4,i-1));
  const svg=renderBoard(stage,{show,showQuadrants:i>=1,read:i>=6,active,stepName:s.name,curve:false});
  if(i===0){const axes=svg.querySelector('.f101-grid-layer');if(axes&&!N.reducedMotion())N.motion.arrive(axes,0,18,420,N.motion.ease.out);}
  if(i>=2&&i<=5&&!N.reducedMotion()){
    const p=ST.points[i-2];if(p)N.motion.flash(svg,mapX(p.x),mapY(p.y),'focus',23);
  }
  if(i===6&&!N.reducedMotion()){N.motion.flash(svg,mapX(3),mapY(2),'result',34);}
}
function uiBtn(txt,fn,kind){return H('button',{class:'nova-btn '+(kind||''),text:txt,onclick:fn});}
function tools(panel,stage){window.NovaLessonComponent?.applyExploreModels();panel.innerHTML='';window.NovaLessonComponent?.applyExploreModels();panel.classList.add('f101-controls');
  window.NovaLessonComponent?.applyExploreModels();const select=H('select',{class:'f101-select','aria-label':'Choose the lesson preset'});
  window.NovaLessonComponent?.applyExploreModels();Object.entries(C.presets).forEach(([k,p])=>select.appendChild(H('option',{value:k,text:p.label})));
  window.NovaLessonComponent?.applyExploreModels();select.value=ST.preset;
  window.NovaLessonComponent?.applyExploreModels();select.onchange=()=>{ST.preset=select.value;ST.points=clone(config().points);ST.selected='A';emit('preset',ST.preset);repaint();};
  window.NovaLessonComponent?.applyExploreModels();const presetWrap=H('div',{},[H('label',{text:'Choose a lesson view'}),select]);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(presetWrap);
  window.NovaLessonComponent?.applyExploreModels();const pointSel=H('select',{class:'f101-select','aria-label':'Select a point to move'});
  window.NovaLessonComponent?.applyExploreModels();ST.points.forEach(p=>pointSel.appendChild(H('option',{value:p.id,text:'Point '+p.id+' · '+ordered(p)})));
  window.NovaLessonComponent?.applyExploreModels();pointSel.value=ST.selected;window.NovaLessonComponent?.applyExploreModels();pointSel.onchange=()=>{ST.selected=pointSel.value;emit('selected',ST.selected);repaint();};
  window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('div',{},[H('label',{text:'Pick a point · drag or use the arrow keys'}),pointSel]));
  window.NovaLessonComponent?.applyExploreModels();const controls=H('div',{class:'f101-edit'});
  window.NovaLessonComponent?.applyExploreModels();function setAxis(axis,delta){let q=ST.points.find(p=>p.id===ST.selected);if(!q)return;q[axis]=safe(q[axis]+delta);emit('point',{id:q.id,x:q.x,y:q.y,how:'button'});repaint();}
  window.NovaLessonComponent?.applyExploreModels();function counter(axis){const c=H('div',{class:'f101-counter'}),lbl=H('label',{text:axis==='x'?'x · across':'y · up/down'}),row=H('div',{}),v=H('b',{text:'0'});
    row.append(uiBtn('−',()=>setAxis(axis,-1),'ghost'),v,uiBtn('+',()=>setAxis(axis,1),'ghost'));c.append(lbl,row);controls.appendChild(c);return v;}
  window.NovaLessonComponent?.applyExploreModels();const xval=counter('x'),yval=counter('y');window.NovaLessonComponent?.applyExploreModels();panel.appendChild(controls);
  window.NovaLessonComponent?.applyExploreModels();const actions=H('div',{class:'f101-toolbar'});
  window.NovaLessonComponent?.applyExploreModels();const moveOrigin=uiBtn('Back to origin',()=>{const p=ST.points.find(p=>p.id===ST.selected);if(p){p.x=0;p.y=0;emit('point',{id:p.id,x:0,y:0,how:'reset'});repaint();}},'ghost');
  window.NovaLessonComponent?.applyExploreModels();const reset=uiBtn('Reset example',()=>{ST.points=clone(config().points);emit('reset',ST.preset);repaint();},'ghost');
  window.NovaLessonComponent?.applyExploreModels();actions.append(moveOrigin,reset);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(actions);
  window.NovaLessonComponent?.applyExploreModels();const live=H('p',{class:'f101-taskline','aria-live':'polite'});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(live);
  window.NovaLessonComponent?.applyExploreModels();function repaint(){const q=ST.points.find(p=>p.id===ST.selected)||ST.points[0];if(!q)return;
    pointSel.innerHTML='';ST.points.forEach(p=>pointSel.appendChild(H('option',{value:p.id,text:'Point '+p.id+' · '+ordered(p)})));pointSel.value=ST.selected;
    xval.textContent=num(q.x);yval.textContent=num(q.y);live.textContent='Selected '+q.id+': '+ordered(q)+' · '+quad(q.x,q.y);
    renderBoard(stage,{show:4,showQuadrants:true,read:true,drag:true,active:ST.selected,curve:true});
  }window.NovaLessonComponent?.applyExploreModels();repaint();
}
function challenge(panel,api,stage){
  const tasks=challengeTargets.map((t,i)=>({
    q:t.q,
    build:ctl=>{const note=H('p',{class:'f101-smallnote',text:'Move the orange ring T onto the grid. You can also focus T and use arrow keys.'});ctl.appendChild(note);ST.task=i;ST.challengePoint={x:0,y:0};return ()=>[ST.challengePoint.x,ST.challengePoint.y];},
    check:p=>{
      const ok=Array.isArray(p)&&p[0]===t.x&&p[1]===t.y;
      let msg=ok?'Exactly right: '+ordered(t)+' is in '+quad(t.x,t.y)+'.':
        !p?'First place the marker T on the grid.':
        p[0]!==t.x&&p[1]===t.y?'Your y is correct, but check left and right: the first coordinate is '+num(t.x)+'.':
        p[0]===t.x&&p[1]!==t.y?'Your x is correct. Now move '+(t.y<0?'down':'up')+' to y = '+num(t.y)+'.':
        'Check both signs. Move across first, then up or down. Try again.';
      if(ok)N.events.emit('value',{engine:ID,key:'coordinates',value:{task:i,point:[t.x,t.y]}});
      return [ok,msg];
    },hint:t.hint,solve:()=>{ST.challengePoint={x:t.x,y:t.y};renderBoard(stage,{show:1,challenge:true,drag:true,active:'T'});}
  }));
  // The common F0 assessment controller owns checking and hint events.
  N.challengeRun(panel,api,tasks,(i)=>{ST.task=i;renderBoard(stage,{show:1,challenge:true,drag:true,active:'T'});},C);
}
const def={
  id:ID,title:'Four-quadrant grid',config:C,steps,
  alt:'Four-quadrant grid from negative five to five with correctly labelled x and y axes; ordered-pair plotting using x first, then y.',
  staticAlt:'Quadrant I (3,2); Quadrant II (−4,3); Quadrant III (−2,−3); Quadrant IV (4,−2). Coordinates are written (x, y).',
  render,explore:tools,challenge,
  exploreIntro:'Pick a point. Change its x and y values, or drag it to a new grid intersection.',
  onRestore:()=>{ST.preset='Y7-038';ST.selected='A';ST.points=clone(C.presets['Y7-038'].points);ST.challengePoint={x:0,y:0};}
};
N.registry.add({id:ID,title:'Four-quadrant grid',family:'F10',topics:['coordinates','quadrants','plotting','straight-line graphs'],deps:['F0-01','F0-02','F0-03','F0-04','F0-07','F0-08','F0-11','F0-14']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,def,{models:{"ST":()=>ST},tables:{"steps":()=>steps},draws:{"renderBoard":["stage","spec"]},exploreFields:{}});
N.bankMount({id:ID,num:'01',title:'Four-quadrant grid · Premium Edition',def,years:'KS3 Years 7–9, with graph plotting extensions',linked:['F0-14','F10-02','F10-04','F10-05'],spec:{
  purpose:'Plot and read ordered pairs in four quadrants with a snap-to-intersection coordinate plane and clear evidence of x-first then y.',
  params:'Range −5 to 5 on both axes; 1-square scale; named lesson presets; four draggable labelled points.',
  presets:'Y7-038 coordinates · Y8-024 lines · Y8-066 scatter and line of best fit · Y9-009 algebra and coordinates.',
  steps:'Axes → Quadrants → (3,2) → (−4,3) → (−2,−3) → (4,−2) → Read ordered pairs.',
  interactions:'Watch, Guided, Explore, Challenge. Snap-to-grid pointer dragging, re-grab, Escape/pointercancel recovery, keyboard arrow movement, x/y steppers, three exact challenge tasks.',
  traps:'Reversing x/y · wrong sign for left/down · assuming all coordinates are positive · reading across from the wrong axis.',
  gcse:'The core grid supports GCSE coordinate geometry; advanced gradient, midpoint and transformations stay in linked components.'
}});
const card=document.getElementById(ID);if(card){const dev=H('details',{class:'nv-dev'});dev.appendChild(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec, p.purpose').forEach(e=>dev.appendChild(e));card.appendChild(dev);const h3=card.querySelector('h3');if(h3)h3.textContent='Interactive coordinates workshop';}
// Keep actual F0 mascot artwork; ensure Sir Bob artwork has a screen-reader name.
const fix=()=>document.querySelectorAll('#'+ID+' .face img').forEach(im=>{if(!im.getAttribute('alt'))im.setAttribute('alt','Sir Bob, maths tutor');});fix();new MutationObserver(fix).observe(card,{subtree:true,childList:true});
// Use genuine Izaac pose variants for challenge events without changing global helper selection.
function refreshIzaac(){
 const el=card&&card.querySelector('.f101-peer');if(!el)return;
 const im=el.querySelector('img'),caption=el.querySelector('span'),art=N.helperImg(ST.peerPose,'teen');
 im.src=art.src;im.alt='Izaac, challenge partner, '+ST.peerPose;
 caption.textContent=ST.peerPose==='celebrate'?'Izaac · Three out of three. Brilliant!':
   ST.peerPose==='oops'?'Izaac · Check the signs.':
   ST.peerPose==='idea'?'Izaac · Read the hint carefully.':'Izaac · Check x first, then y.';
}
N.events.onEngine(ID,'mode',e=>{
 if(e.detail.mode==='challenge'){ST.wrongCount=0;ST.correctCount=0;ST.peerPose='think';refreshIzaac();}
});
N.events.onEngine(ID,'hintUsed',()=>{ST.peerPose='idea';refreshIzaac();});
N.events.onEngine(ID,'correct',e=>{
 if(e.detail.correct){ST.correctCount++;ST.peerPose=ST.correctCount>=3?'celebrate':'cheer';}
 else {ST.wrongCount++;ST.peerPose=ST.wrongCount>=2?'oops':'think';}
 refreshIzaac();
});
// F0 v3.6.2 pointer-capture recovery: moving an SVG handle into the top-level SVG
// can release native capture in Chromium. Resolve the common pointerup through
// the EXISTING core drag state rather than inventing a second drag renderer.
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(d&&d.el&&card&&card.contains(d.el))d.up(e);});
window.addEventListener('pointercancel',()=>{const d=N.ui._drag;if(d&&d.el&&card&&card.contains(d.el))N.ui.cancelDrag();});
window.F101_ENGINE=N.engines[ID];
})();

