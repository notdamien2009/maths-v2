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


var NOVA_F5_06_CONFIG={startMode:'guided',preset:'sixEighths',events:['preset','numerator','denominator','factor','factorDrag','groupDrag','groupKeyboard','reset'],presets:{
 sixEighths:{label:'Six eighths',n:6,d:8,g:2},sixTwelfths:{label:'Six twelfths',n:6,d:12,g:6},twelveEighteenths:{label:'Twelve eighteenths',n:12,d:18,g:6},eighteenTwentyfourths:{label:'Eighteen twenty-fourths',n:18,d:24,g:6},nineTwelfths:{label:'Nine twelfths',n:9,d:12,g:3},alreadySimple:{label:'Five sevenths · simplest',n:5,d:7,g:1},zero:{label:'Zero tenths',n:0,d:10,g:10},whole:{label:'Eight eighths',n:8,d:8,g:8}}};
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,M=N.motion,H=N.h,C=window.NovaV2Integration.configuration(NOVA_F5_06_CONFIG),ID='F5-06',live=null;
function emit(key,val){if(C.events.indexOf(key)<0)throw Error('F5-06 undeclared value key '+key);N.events.emit('value',{engine:ID,key:key,value:val});}
function lab(p,x,y,v,role,size,anchor){return N.chalkText(p,x,y,String(v),{role:role||'support',size:size||20,anchor:anchor||'middle'});}
function rect(p,x,y,w,h,fill,attrs){return E('rect',Object.assign({x:x,y:y,width:w,height:h,fill:fill},attrs||{}),p);}
function fraction(p,x,y,n,d,role,z){z=z||27;var a=E('g',{'aria-label':n+' over '+d},p);lab(a,x,y-z*.35,n,role,z);N.neonLine(a,x-z*.65,y+1,x+z*.65,y+1,{role:role,width:2.5});lab(a,x,y+z*.9,d,role,z);return a;}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a||1;}
function divisorList(d){var a=[];for(var i=1;i<=d;i++)if(d%i===0)a.push(i);return a;}
function valid(n,d,g){return g>=1&&d%g===0&&n%g===0;}
function model(n,d,g){d=Math.max(2,Math.min(24,Math.round(d)));n=Math.max(0,Math.min(d,Math.round(n)));var candidates=divisorList(d);g=candidates.indexOf(g)>=0&&n%g===0?g:1;return {n:n,d:d,g:g,position:0};}
function starting(k){var t=C.presets[k]||C.presets.sixEighths;return model(t.n,t.d,t.g);}
function defs(s){var d=E('defs',{},s);function grad(id,stops){var g=E('linearGradient',{id:id,x1:'0%',y1:'0%',x2:'20%',y2:'100%'},d);stops.forEach(function(a){E('stop',{offset:a[0],'stop-color':a[1], 'stop-opacity':a[2]===undefined?1:a[2]},g);});}
 grad('sf-edge',[['0%','#d0eaf8'],['12%','#5b8eac'],['29%','#102740'],['84%','#37647f'],['100%','#d1eaf5']]);
 grad('sf-face',[['0%','#214963'],['42%','#102841'],['100%','#07172c']]);
 grad('sf-amber',[['0%','#ffedbd'],['30%',S.c('focus')],['100%','#a95e20']]);
 grad('sf-green',[['0%','#d7ffea'],['32%',S.c('result')],['100%','#0c5d50']]);
 grad('sf-blue',[['0%','#b5f4ff'],['40%',S.c('op')],['100%','#11527a']]);
}
function frame(s,x,y,w,h){rect(s,x-18,y-16,w+36,h+32,'url(#sf-edge)',{rx:18,stroke:'#b2ddf1','stroke-width':1.4});rect(s,x-11,y-9,w+22,h+18,'#061329',{rx:12,stroke:'#3e718f','stroke-width':2});rect(s,x-5,y-4,w+10,h+8,'url(#sf-face)',{rx:9,stroke:'#6395ae','stroke-width':1.3});}
function strip(s,x,y,w,h,count,shade,role,o){o=o||{};frame(s,x,y,w,h);var cellW=w/count,cells=[];for(var i=0;i<count;i++){
 var xp=x+i*cellW,on=i<shade,fill=on?(role==='result'?'url(#sf-green)':'url(#sf-amber)'):'#10283f';
 var cell=rect(s,xp+1.2,y+2,Math.max(.4,cellW-2.4),h-4,fill,{rx:Math.min(3,cellW*.12),stroke:on?S.c(role):'#4b6c85','stroke-width':1.0, 'data-part':i});cells.push(cell);
 if(on&&cellW>13)rect(s,xp+2.8,y+3,Math.max(.4,cellW-5.6),Math.min(7,h*.14),'#f4fffd',{rx:1,opacity:.19,'pointer-events':'none'});
 }
 return cells;
}
function groupBracket(s,a,b,y,role){var gap=b-a;if(gap<7)return;N.neonLine(s,a+2,y,b-2,y,{role:role,width:1.7});N.neonLine(s,a+2,y-7,a+2,y+4,{role:role,width:1.6});N.neonLine(s,b-2,y-7,b-2,y+4,{role:role,width:1.6});}
function rail(s,x,y,w,divs,g,interact,setFactor,dead){N.neonBox(s,x-16,y-39,w+32,112,{role:'op',r:15});lab(s,x+w/2,y-14,'Choose a group size','support',20);
 var stations=[],span=divs.length<=1?0:(w-42)/(divs.length-1);for(var i=0;i<divs.length;i++){
  var xx=x+21+i*span,z=divs[i];N.neonRing(s,xx,y+28,{role:z===g?'op':'support',r:z===g?13:8,pulse:false});lab(s,xx,y+62,'÷'+z,'op',20);stations.push(xx);
 }
 if(!interact)return;
 var idx=divs.indexOf(g),cx=stations[Math.max(0,idx)],drag=E('g',{'class':'sf-handle','data-factor-handle':'yes',tabindex:0,role:'slider','aria-label':'Common grouping factor','aria-valuemin':1,'aria-valuemax':divs[divs.length-1], 'aria-valuenow':g},s);
 N.neonBox(drag,cx-17,y+11,34,34,{role:'op',r:9});N.neonRing(drag,cx,y+28,{role:'focus',r:9,pulse:false});
 drag.addEventListener('keydown',function(e){var p=divs.indexOf(g),delta=e.key==='ArrowRight'||e.key==='ArrowUp'?1:e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:0,idx2=delta?Math.max(0,Math.min(divs.length-1,p+delta)):e.key==='Home'?0:e.key==='End'?divs.length-1:null;
  if(idx2!==null){e.preventDefault();setFactor(divs[idx2],'keyboard');}});
 N.ui.svgDrag(s,drag,{box:{x:cx-17,y:y+11,w:34,h:34},canStart:function(){return !dead();},zones:function(){return stations.map(function(a,i){return {id:'factor:'+divs[i],kind:'drop',x:a-23,y:y,w:46,h:61};});},onDrop:function(id){setFactor(+id.split(':')[1],'drag');return true;}});
}
function render(stage,o,opt){
if(window.NovaLessonComponent?.active){[stage,o,opt]=window.NovaLessonComponent.args("render",arguments);}
opt=opt||{};if(live)live.dead=true;var sc={dead:false};live=sc;var mobile=window.innerWidth<=670,W=mobile?420:1100,V=mobile?1120:680;
 stage.innerHTML='';N.cap(stage,'F5-06 · '+(opt.name||'Simplify without changing the whole'),'PREMIUM');
 var svg=S.root(W,V,'Fraction simplification. One fixed whole has '+o.d+' equal parts, of which '+o.n+' are shaded. Grouping every '+o.g+' pieces shows an equivalent fraction while preserving the endpoint.');svg.classList.add('sf-svg');defs(svg);
 var x=mobile?46:128,w=mobile?328:585,y1=mobile?234:187,y2=mobile?508:383,h=mobile?65:70,remain=o.n/o.d,edge=x+w*remain,showLower=opt.phase!=='original',hidden=!!opt.hide;
 lab(svg,mobile?210:412,mobile?42:46,'Group equal parts · same whole','support',mobile?23:29);
 lab(svg,mobile?210:412,mobile?82:84,'Combine smaller units into larger units','given',mobile?18:21);
 lab(svg,x,y1-39,o.d+' equal original parts','focus',mobile?20:21,'start');
 strip(svg,x,y1,w,h,o.d,o.n,'focus');
 // Genuine equal-part lasso: one selected group is defined by g adjacent original parts.
 var g=o.g,groups=o.d/g,selected=Math.max(0,Math.min(groups-1,o.position||0)),unit=w/o.d,
 probeX=x+selected*g*unit,probeWidth=g*unit;
 if(showLower){
  var gy=y1+h+31;
  for(var i=0;i<groups;i++)groupBracket(svg,x+i*g*unit,x+(i+1)*g*unit,gy,i<o.n/g?'focus':'support');
  lab(svg,x,y2-40,groups+' larger equal parts','result',mobile?20:21,'start');
  var refined=strip(svg,x,y2,w,h,groups,o.n/g,'result');
  // Cover strips initially represent a group of small parts, then gather into one larger tile.
  if(opt.animate&&!N.reducedMotion())for(var k=0;k<groups;k++)(function(index){var c=rect(svg,x+index*g*unit+1,y2+2,g*unit-2,h-4,index<o.n/g?'url(#sf-amber)':'#142c47',{rx:3,stroke:'#8bb9d5','stroke-width':1.2,opacity:.95});
   M.delay(130+index*145,function(){if(sc.dead||!c.isConnected)return;M.tween(350,function(t){if(c.isConnected)c.style.opacity=String(1-t);},M.ease.inOut,function(){if(c.isConnected)c.remove();});M.flash(svg,x+(index+.5)*g*unit,y2+h/2,'result',Math.min(28,g*unit*.31));});})(k);
  N.neonLine(svg,edge,y1+h+15,edge,y2-16,{role:'op',width:2.9});N.neonRing(svg,edge,y1+h+15,{role:'focus',r:8,pulse:false});N.neonRing(svg,edge,y2-16,{role:'result',r:8,pulse:false});
 }
 if(opt.interactive&&!hidden){
  var group=E('g',{'data-group-probe':'yes',class:'sf-probe',tabindex:0,role:'slider','aria-label':'Move the grouping lasso across the original fraction strip','aria-valuemin':0,'aria-valuemax':Math.max(0,groups-1),'aria-valuenow':selected},svg);
  rect(group,probeX+2,y1-5,probeWidth-4,h+10,'#6ee7e5',{rx:6,'fill-opacity':.07,stroke:S.c('op'),'stroke-width':3,'stroke-dasharray':'7 5'});
  N.neonRing(group,probeX+probeWidth/2,y1-6,{role:'op',r:6,pulse:false});
  group.addEventListener('keydown',function(e){var next=e.key==='ArrowRight'||e.key==='ArrowDown'?selected+1:e.key==='ArrowLeft'||e.key==='ArrowUp'?selected-1:e.key==='Home'?0:e.key==='End'?groups-1:null;
   if(next!==null){e.preventDefault();opt.onGroup(Math.max(0,Math.min(groups-1,next)),'keyboard');}});
  N.ui.svgDrag(svg,group,{box:{x:probeX+2,y:y1-5,w:Math.max(12,probeWidth-4),h:h+10},canStart:function(){return !sc.dead;},zones:function(){var a=[];for(var j=0;j<groups;j++)a.push({id:'group:'+j,kind:'drop',x:x+j*g*unit,y:y1-28,w:g*unit,h:h+56});return a;},onDrop:function(id){opt.onGroup(+id.split(':')[1],'drag');return true;}});
 }
 var ruler=mobile?634:518;N.neonLine(svg,x,ruler,x+w,ruler,{role:'support',width:1.9});N.neonLine(svg,edge,ruler-10,edge,ruler+11,{role:'focus',width:2.6});lab(svg,x,ruler+25,'0','support',19);lab(svg,x+w,ruler+25,'1 whole','support',19);
 var resultY=mobile?704:203,resultX=mobile?43:767,resultW=mobile?334:294,resultH=mobile?166:216;
 N.neonBox(svg,resultX,resultY,resultW,resultH,{role:'result',r:16});
 lab(svg,resultX+resultW/2,resultY+31,hidden?'Work out the simplest form':'Same shaded length','result',mobile?22:21);
 var lineY=resultY+(mobile?93:104),lx=resultX+(mobile?94:79),rx=resultX+(mobile?242:224);
 fraction(svg,lx,lineY,o.n,o.d,'focus',mobile?25:27);lab(svg,resultX+resultW/2,lineY+4,'=','support',29);
 if(hidden){lab(svg,rx,lineY+6,'?','unknown',31);}else{fraction(svg,rx,lineY,o.n/o.g,o.d/o.g,'result',mobile?25:27);}
 var rest=gcd(o.n/o.g,o.d/o.g),bottomText=hidden?'Count groups of equal parts':rest===1?'Simplest form reached':'More grouping is possible';
 lab(svg,resultX+resultW/2,resultY+resultH-16,bottomText,rest===1?'result':'support',mobile?17:19);
 if(mobile){
  rail(svg,65,934,290,divisorList(o.d),o.g,!!opt.interactive,opt.onFactor||function(){},function(){return sc.dead;});
  lab(svg,210,1094,'The whole and shaded endpoint remain fixed','support',18);
 }else{
  rail(svg,776,483,277,divisorList(o.d),o.g,!!opt.interactive,opt.onFactor||function(){},function(){return sc.dead;});
  lab(svg,916,646,'Group every '+g+' tiny pieces together','support',18);
 }
 stage.appendChild(svg);N.scene.helperStrip(stage,opt.pose||'ruler',opt.caption||'Grouping does not change the shaded amount.');return sc;
}
var steps=[
 {name:'Observe six eighths',n:6,d:8,g:1,phase:'original',pose:'explain',caption:'The whole is divided into eight equal pieces',narration:'Six eighths means six of eight equally sized parts are shaded. The fixed glass whole is our unit. We will keep that whole and the shaded endpoint unchanged.',prompt:'How many eighths are shaded?'},
 {name:'Gather equal pairs',n:6,d:8,g:2,phase:'result',animate:true,pose:'count',caption:'Pairs combine into larger equal parts',narration:'Group each pair of eighths into one larger part. Six shaded eighths become three shaded pairs, and eight eighths become four total pairs.',prompt:'How many shaded groups of two can you find?'},
 {name:'Prove the equal length',n:6,d:8,g:2,phase:'result',pose:'ruler',caption:'Three quarters reaches the same endpoint',narration:'Six divided by two is three. Eight divided by two is four. The shaded length did not change. Six eighths is the same size as three quarters.',prompt:'Why does three quarters have the same value as six eighths?'},
 {name:'Simplify in stages',n:12,d:18,g:2,phase:'result',animate:true,pose:'compare',caption:'Six ninths can simplify again',narration:'Twelve eighteenths grouped into pairs becomes six ninths. This is equivalent, but six and nine share a factor of three, so it is not simplest yet.',prompt:'What other factor do six and nine share?'},
 {name:'Use the highest common factor',n:12,d:18,g:6,phase:'result',animate:true,pose:'show-three',caption:'Groups of six give two thirds',narration:'Six is the highest common factor of twelve and eighteen. Grouping six small parts at a time gives two shaded groups out of three equal groups. Two thirds is the simplest form.',prompt:'Why does dividing both by the highest common factor finish the simplification?'},
 {name:'Recognise simplest form',n:5,d:7,g:1,phase:'result',pose:'idea',caption:'No shared factor above one',narration:'Five sevenths is already in simplest form. The highest common factor of five and seven is one. There is no larger equal group to form.',prompt:'How can you tell whether a fraction can simplify?'}
];
function guided(i,stage){var a=steps[i],o=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("guided.o",(...a)=>model(...a),[a.n,a.d,a.g]):(model(a.n,a.d,a.g)));render(stage,o,{name:a.name,phase:a.phase,animate:!!a.animate,pose:a.pose,caption:a.caption});}
function explore(panel,stage){window.NovaLessonComponent?.applyExploreModels();var o=starting(C.preset),preset=H('select',{class:'nova-input','aria-label':'Fraction to simplify'}),status=H('p',{class:'sf-msg',role:'status','aria-live':'polite'}),den=H('select',{class:'nova-input','aria-label':'Original denominator'});
 window.NovaLessonComponent?.applyExploreModels();Object.keys(C.presets).forEach(function(k){preset.appendChild(H('option',{value:k,text:C.presets[k].label}));});window.NovaLessonComponent?.applyExploreModels();[4,5,6,7,8,9,10,12,18,24].forEach(function(d){den.appendChild(H('option',{value:d,text:d+' parts'}));});window.NovaLessonComponent?.applyExploreModels();preset.value=C.preset;window.NovaLessonComponent?.applyExploreModels();den.value=o.d;
 window.NovaLessonComponent?.applyExploreModels();function paint(anim,focus){render(stage,o,{name:'Explore · group equal parts',phase:'result',animate:!!anim,pose:gcd(o.n/o.g,o.d/o.g)===1?'celebrate':'ruler',caption:'Both the numerator and denominator must divide exactly',interactive:true,onFactor:choose,onGroup:move});if(focus){var k=stage.querySelector(focus);if(k)k.focus();}}
 window.NovaLessonComponent?.applyExploreModels();function choose(g,via){if(!valid(o.n,o.d,g)){status.textContent='Not a common factor: '+g+' cannot divide both counts exactly. Try another group size.';emit(via==='drag'?'factorDrag':'factor',g);return;}o.g=g;o.position=0;emit(via==='drag'?'factorDrag':'factor',g);status.textContent='Group every '+g+' original pieces: '+(o.n/g)+' shaded groups out of '+(o.d/g)+'. '+(gcd(o.n/g,o.d/g)===1?'This is simplest form.':'More simplifying is possible.');paint(true,via==='keyboard'?'[data-factor-handle]':null);}
 window.NovaLessonComponent?.applyExploreModels();function move(pos,via){o.position=pos;emit(via==='drag'?'groupDrag':'groupKeyboard',pos);status.textContent='Grouping probe moved to group '+(pos+1)+' of '+(o.d/o.g)+'. Each group contains '+o.g+' equal original parts.';paint(false,via==='keyboard'?'[data-group-probe]':null);}
 window.NovaLessonComponent?.applyExploreModels();function setNum(n){o=model(n,o.d,o.g);emit('numerator',o.n);status.textContent='Shaded '+o.n+' of '+o.d+' original equal parts.';paint(false);}
 window.NovaLessonComponent?.applyExploreModels();preset.onchange=function(){C.preset=preset.value;o=starting(C.preset);den.value=o.d;emit('preset',C.preset);status.textContent='Choose a common factor, then count the larger equal parts.';paint(false);};
 window.NovaLessonComponent?.applyExploreModels();den.onchange=function(){o=model(Math.min(o.n,+den.value),+den.value,1);emit('denominator',o.d);paint(false);};
 window.NovaLessonComponent?.applyExploreModels();var minus=H('button',{class:'nova-btn',text:'−', 'aria-label':'Shade one fewer original part',onclick:function(){setNum(Math.max(0,o.n-1));}}),plus=H('button',{class:'nova-btn',text:'+', 'aria-label':'Shade one more original part',onclick:function(){setNum(Math.min(o.d,o.n+1));}}),auto=H('button',{class:'nova-btn',text:'Use HCF',onclick:function(){choose(gcd(o.n,o.d),'button');}}),reset=H('button',{class:'nova-btn ghost',text:'Reset',onclick:function(){o=starting(C.preset);den.value=o.d;emit('reset',true);paint(false);}});
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('div',{class:'sf-controls'},[H('label',{text:'Preset'}),preset,H('label',{text:'Total pieces'}),den]));
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('div',{class:'sf-controls'},[H('label',{text:'Shade'}),minus,plus,auto,reset]));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);
 window.NovaLessonComponent?.applyExploreModels();panel.appendChild(H('p',{class:'sf-msg',text:'Drag the factor selector to divide both counts. Move the dotted grouping lasso along the original strip, or use its arrow keys.'}));
 window.NovaLessonComponent?.applyExploreModels();C._explore={get:function(){return {...o};},set:function(n,d,g){o=model(n,d,g);den.value=o.d;paint(false);},factor:choose,move:move};window.NovaLessonComponent?.applyExploreModels();status.textContent='The shaded endpoint must remain in the same place.';window.NovaLessonComponent?.applyExploreModels();paint(false);
}
function challenge(panel,api,stage){var tasks=[
 {n:6,d:8,g:2,a:3,b:4,q:'Simplify six eighths fully. Select the common factor, then enter the new numerator and denominator.',hint:'Six and eight have highest common factor two.'},
 {n:12,d:18,g:6,a:2,b:3,q:'Simplify twelve eighteenths in one step. Choose its highest common factor.',hint:'The highest number dividing both twelve and eighteen is six.'},
 {n:9,d:12,g:3,a:3,b:4,q:'Simplify nine twelfths fully. Show the resulting shaded groups.',hint:'Nine and twelve share a greatest common factor of three.'}
 ],ix=0,wrong=0,o=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("challenge.o",(...a)=>model(...a),[6,8,1]):(model(6,8,1))),question=H('p',{class:'sf-msg'}),status=H('p',{class:'sf-msg',role:'status','aria-live':'polite'}),ansN=H('input',{class:'nova-input sf-input',type:'number',min:0,step:1,'aria-label':'Simplified numerator'}),ansD=H('input',{class:'nova-input sf-input',type:'number',min:1,step:1,'aria-label':'Simplified denominator'}),check=H('button',{class:'nova-btn primary',text:'Check answer'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'}),img=N.helperImg('read-tablet','teen'),peer=H('img',{src:img.src,alt:img.alt}),peerText=H('span',{text:'Izaac is following your reasoning.'});
 function pose(k,text){var a=N.helperImg(k,'teen');peer.src=a.src;peer.alt=a.alt;peerText.textContent=text;}
 function repaint(){render(stage,o,{name:'Challenge · find the simplest form',phase:'result',hide:true,interactive:true,pose:'think',caption:'Prove the answer using equal groups',onFactor:function(g,via){if(!valid(o.n,o.d,g)){status.textContent='That factor cannot divide both counts.';return;}o.g=g;emit(via==='drag'?'factorDrag':'factor',g);repaint();}});}
 function load(){var t=tasks[ix];o=model(t.n,t.d,1);wrong=0;question.textContent='Challenge '+(ix+1)+' of 3 · '+t.q;status.textContent='Choose a grouping factor, then enter two numbers.';ansN.value='';ansD.value='';api.fb.textContent='';pose('read-tablet','Izaac is checking the grouping.');repaint();}
 check.onclick=function(){var t=tasks[ix],ok=o.g===t.g&&ansN.value.trim()!==''&&ansD.value.trim()!==''&&Number(ansN.value)===t.a&&Number(ansD.value)===t.b;api.check(ok,ok?'Correct. Both counts were divided by the highest common factor.':'Not yet. Divide BOTH original counts by the same highest common factor.',{task:ix});if(ok){pose(ix===2?'victory':'proud','The fraction is in simplest form.');status.textContent=ix===2?'All three challenges complete.':'Correct! Next challenge…';if(ix<2)M.delay(650,function(){ix++;load();});else check.disabled=true;}else{wrong++;pose(wrong>=2?'worried':'read-tablet','Check what divides both numbers exactly.');status.textContent='Your selected factor and both simplified numbers must agree.';}};
 hint.onclick=function(){var t=tasks[ix];api.hint(t.hint);pose('idea','Izaac has a clue.');status.textContent=t.hint;};
 panel.appendChild(question);panel.appendChild(H('div',{class:'sf-controls'},[H('label',{text:'Numerator'}),ansN,H('label',{text:'Denominator'}),ansD,check,hint]));panel.appendChild(status);panel.appendChild(H('div',{class:'sf-peer'},[peer,peerText]));
 C._challenge={task:function(){return ix;},set:function(g,n,d){o.g=g;ansN.value=n;ansD.value=d;repaint();},get:function(){return {...o,a:ansN.value,b:ansD.value};}};load();
}
var DEF={id:ID,title:'Fraction Simplifier · Magnetic Group Forge',config:C,steps:steps,render:guided,explore:explore,challenge:challenge,
 alt:'Two equal-length glass fraction strips, small original pieces in amber and larger regrouped pieces in green. A common-factor magnetic selector and movable group lasso prove exact regrouping without changing the shaded endpoint.',
 staticAlt:'Six eighths is three quarters by grouping in pairs. Twelve eighteenths simplifies to two thirds by grouping six original pieces together. Five sevenths cannot simplify because five and seven have greatest common factor one.',
 exploreIntro:'Pick any fraction, choose a number that divides both counts exactly, and move the group lasso to inspect the equally sized groups. The shaded amount never changes.'};
N.registry.add({id:ID,title:DEF.title,family:'F5',topics:['simplifying fractions','common factors','HCF'],deps:['F0-02','F0-03','F0-04','F0-05','F5-06']});

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register(ID,DEF,{models:{},tables:{"steps":()=>steps},draws:{"render":["stage","o","opt"]},exploreFields:{"guided.o":{"kind":"factory","factory":"model","argCount":3},"challenge.o":{"kind":"factory","factory":"model","argCount":3}}});
N.bankMount({id:ID,num:'F5·06',title:DEF.title,def:DEF,years:'KS3 Years 7–9',linked:['F5-01','F5-06','F5-07'],spec:{purpose:'Simplify by regathering the equal partition units, dividing numerator and denominator by one shared common factor, with unchanged physical shaded length.',params:'Whole has 2–24 original equal parts and 0–d shaded parts; factor must divide both counts exactly; group positions snap and can be changed by keyboard.',presets:'Six eighths, six twelfths, twelve eighteenths, eighteen twenty-fourths, nine twelfths, already-simplest five sevenths, zero, one whole.',steps:'Fix whole → form equal pairs → prove matching endpoint → unfinished intermediate form → HCF grouping → already simplest.',interactions:'Native svgDrag factor selector plus draggable group probe with Arrow/Home/End equivalents, presets, numerator stepper, HCF helper and 3 Challenge questions.',traps:'Dividing only numerator, using a non-common factor, confusing fewer pieces with less value, treating an intermediate equivalent fraction as simplest.',gcse:'HCF and lowest terms precede operations with fractions and rational algebra; use core v3.6.2 motion, SVG, helper art and stacked NOVA Chalk fractions.'}});
var log=document.getElementById('log');function logIt(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);}N.events.history().forEach(logIt);N.events.on('*',logIt);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();
