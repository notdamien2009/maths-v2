/* F6-07 — Map and Scale Drawing. Inherits UNMODIFIED NOVA F0 core. */
const F607_CONFIG={id:'F6-07',startMode:'watch',preset:'Y7-064',parameters:{precisionKm:3,measurementUnit:'cm',realUnit:'km',useNOVAcore:true},presets:{
 'Y7-064':{label:'Y7-064 · School to park',title:'SCHOOL TO PARK',context:'Use the map scale to find the real distance between the school and park.',from:'SCHOOL',to:'PARK',dx:4,dy:0,scale:0.5,route:'straight'},
 'Y7-064-library':{label:'Y7-064 · Library route',title:'LIBRARY WALK',context:'A diagonal route is longer than just its horizontal part.',from:'LIBRARY',to:'SPORTS',dx:3,dy:4,scale:0.4,route:'diagonal'},
 'Y9-021':{label:'Y9-021 · Country trail',title:'COUNTRY TRAIL',context:'Apply a scale factor and justify the distance from the scale bar.',from:'STATION',to:'LAKE',dx:6,dy:8,scale:1.25,route:'diagonal'},
 'Y9-021-urban':{label:'Y9-021 · City survey',title:'CITY SURVEY',context:'A scale drawing represents a route accurately when measured in centimetres.',from:'MUSEUM',to:'BRIDGE',dx:5,dy:0,scale:0.75,route:'straight'}
},events:['value','correct','step','hintUsed']};window.F607_CONFIG=F607_CONFIG;
(function(){'use strict';
const N=window.NOVA, H=N.h, E=N.svg.el, M=N.motion, C=F607_CONFIG, ID=C.id;
// Local fast-pointer release defence used by the approved F6 interaction pattern; no F0 edits.
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f607-drag'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);

const STEPS=[
 {name:'Read the map',pose:'explain',caption:'Two landmarks, one journey.',narration:'A map is a smaller drawing of a real place. First, find the two points we want to measure.'},
 {name:'Connect the points',pose:'point',caption:'Measure between the centres.',narration:'Measure the straight line between the points, from the centre of the first marker to the centre of the second.'},
 {name:'Read the map length',pose:'ruler',caption:'Count the map centimetres.',narration:'The ruler shows how many centimetres separate the landmarks on the drawing.'},
 {name:'Read the scale bar',pose:'checking',caption:'One centimetre stands for more.',narration:'Check the scale. Every one centimetre on this map represents a fixed real distance, shown on the scale bar.'},
 {name:'Multiply by the scale',pose:'count',caption:'Distance equals map length times scale.',narration:'Multiply the measured centimetres by the kilometres each centimetre represents. Keep the units clear.'},
 {name:'Prove the distance',pose:'celebrate',caption:'Match the drawing to real life.',narration:'The same scale works everywhere on this map. We can explain the real distance using the map length and the scale factor.'}
];
function mapCm(p){return Math.hypot(p.dx,p.dy);}function km(p){return mapCm(p)*p.scale;}function fmt(v){return Number(v.toFixed(3)).toString();}
function emit(key,value){N.events.emit('value',{engine:ID,key,value});}
function chalk(svg,x,y,t,role='given',size=26){return N.chalkText(svg,x,y,String(t),{role,size});}
function pill(title,value,desc,role){return N.neonCard([H('p',{class:'f607-lbl',text:title}),H('p',{class:'f607-num',text:value}),H('p',{class:'f607-desc',text:desc})],{role});}
function dims(mob,p){const large=Math.max(p.dx,p.dy);const base=mob?Math.min(43,240/large):Math.min(63,390/large);const px=p.dy>0?Math.min(base,(mob?220:250)/p.dy):base;
 return mob?{w:480,h:1138,px,ax:104,ay:245,mapX:20,mapY:145,mapW:440,mapH:505,scaleY:816,scaleX:76,scaleW:330,rulerY:690,toolY:1005,insY:1101,returnX:287,returnY:970}:
 {w:1120,h:1138,px,ax:235,ay:245,mapX:44,mapY:150,mapW:1035,mapH:525,scaleY:819,scaleX:140,scaleW:690,rulerY:695,toolY:1006,insY:1103,returnX:820,returnY:969};}
function pt(p,g){return {A:{x:g.ax,y:g.ay},B:{x:g.ax+p.dx*g.px,y:g.ay+p.dy*g.px}};}
// A colour-safe map: labelled places, repeated distance grid, compass and explicit route endpoints.
function mapBackdrop(svg,p,g,loc){N.neonBox(svg,g.mapX,g.mapY,g.mapW,g.mapH,{role:'given',r:18});
 const x0=g.mapX+30,y0=g.mapY+62,gridW=g.mapW-60,gridH=g.mapH-86;
 N.svg.grid(svg,x0,y0,gridW,gridH,g.w===480?56:90);
 // Two faint real-map features sit behind the measured route, never mistaken for a scaled axis.
 N.neonPath(svg,`M${g.mapX+g.mapW*.15} ${g.mapY+g.mapH*.83} Q${g.mapX+g.mapW*.27} ${g.mapY+g.mapH*.66} ${g.mapX+g.mapW*.34} ${g.mapY+g.mapH*.80}`,{role:'unknown',width:2,dash:'6 12'});
 N.neonPath(svg,`M${g.mapX+g.mapW*.72} ${g.mapY+g.mapH*.22} Q${g.mapX+g.mapW*.83} ${g.mapY+g.mapH*.34} ${g.mapX+g.mapW*.9} ${g.mapY+g.mapH*.19}`,{role:'given',width:1.9,dash:'5 12'});
 chalk(svg,g.mapX+30,g.mapY+40,'N', 'focus',29);N.neonLine(svg,g.mapX+30,g.mapY+80,g.mapX+30,g.mapY+54,{role:'focus',width:3});
}
function landmark(svg,x,y,label,role,mob){N.neonRing(svg,x,y,{role,r:15,pulse:false});
 const labX=x,labY=y-41; // places are labelled above the measured points
 chalk(svg,labX,labY,label,role,mob?22:29);
}
function measure(svg,p,g,loc,step,mode,solved){const show=mode==='explore'||(mode!=='challenge'&&step>=1)||solved;
 if(show){N.neonLine(svg,loc.A.x,loc.A.y,loc.B.x,loc.B.y,{role:'focus',width:4});
 const mx=(loc.A.x+loc.B.x)/2,my=(loc.A.y+loc.B.y)/2;
 const diag=p.dy>0,away=g.w===480?65:95,ln=mapCm(p);
 const chipX=diag?mx+p.dy/ln*away:mx,chipY=diag?my-p.dx/ln*away:my+59;
 N.neonBox(svg,chipX-(g.w===480?55:75),chipY-24,g.w===480?110:150,50,{role:'focus',r:12});
 chalk(svg,chipX,chipY+11,fmt(mapCm(p))+' cm','focus',g.w===480?25:31);}
 else N.neonPath(svg,`M${loc.A.x} ${loc.A.y} L${loc.B.x} ${loc.B.y}`,{role:'unknown',width:3,dash:'8 9'});
}
function draw(stage,p,o={}){const mob=innerWidth<=760,g=dims(mob,p),loc=pt(p,g),step=o.step??5,mode=o.mode||'watch',solved=!!o.solved,explore=mode==='explore',challenge=mode==='challenge';
 stage.innerHTML='';N.cap(stage,ID,p.title,challenge?'FIND THE REAL DISTANCE':explore?'MEASURE THE MAP':'READ THE DRAWING · APPLY THE SCALE');
 const layout=H('div',{class:'f607-layout'}),art=H('div',{class:'f607-art'}),aside=H('aside',{class:'f607-aside','aria-label':'Map-scale evidence'});
 const svg=N.svg.root(g.w,g.h,'Mathematical route map showing '+p.from+' and '+p.to+', ruler and core NOVA scale number line.');svg.classList.add('f607-svg');svg.dataset.mode=mode;svg.dataset.step=String(step);svg.dataset.preset=o.id||C.preset;
 chalk(svg,g.w/2,49,challenge?'HOW FAR IN REAL LIFE?':'MAP AND SCALE DRAWING','given',mob?32:45);
 chalk(svg,g.w/2,96,'FROM '+p.from+' TO '+p.to,'focus',mob?20:27);
 mapBackdrop(svg,p,g,loc);landmark(svg,loc.A.x,loc.A.y,p.from,'given',mob);landmark(svg,loc.B.x,loc.B.y,p.to,'op',mob);measure(svg,p,g,loc,step,mode,solved);
 // Physical measuring ruler: its length is exactly the endpoint separation at this map scale.
 // Every digit/tick is delegated to the approved F0 NOVA.numberLine, never hand-drawn.
 const mapLength=mapCm(p), rulerWidth=mapLength*g.px,rulerX=(g.w-rulerWidth)/2;
 chalk(svg,g.w/2,g.mapY+g.mapH-120,'MAP RULER · centimetres','focus',mob?20:27);
 N.numberLine(svg,{x:rulerX,y:g.mapY+g.mapH-80,w:rulerWidth,min:0,max:mapLength,major:1,minor:.5,label:v=>mob&&mapLength>=8&&(Math.round(v)%2)?"":fmt(v),labelSize:mob?16:22,arrows:true});
 const showRuler=explore||(step>=2&&!challenge)||solved;
 if(showRuler){chalk(svg,g.w/2,g.rulerY,`MAP LENGTH  ${fmt(mapCm(p))} cm`,'focus',mob?22:31);}
 else chalk(svg,g.w/2,g.rulerY,challenge?'MEASURE THE CENTRES':'READ THE MAP LENGTH','focus',mob?22:29);
 chalk(svg,g.w/2,g.scaleY-69,'SCALE BAR · REAL DISTANCE','given',mob?22:30);
 const sl=N.numberLine(svg,{x:g.scaleX,y:g.scaleY,w:g.scaleW,min:0,max:4,major:1,minor:0.5,label:i=>fmt(i*p.scale),labelSize:mob?18:26,arrows:true});
 chalk(svg,g.w/2,g.scaleY+94,'1 cm ON MAP = '+fmt(p.scale)+' km IN REAL LIFE','focus',mob?21:32);
 if(explore){
  const chosen=o.placed||{};
  const zones=[{id:'A',kind:'drop',x:loc.A.x-27,y:loc.A.y-27,w:54,h:54},{id:'B',kind:'drop',x:loc.B.x-27,y:loc.B.y-27,w:54,h:54},{id:'return',kind:'remove',x:g.returnX,y:g.returnY,w:mob?158:220,h:73}];
  ['A','B'].forEach((name,i)=>{
    // ruler end handles begin at a clearly separate tool row, then snap to endpoint positions.
    const home={x:mob?105+i*91:246+i*111,y:g.toolY};const where=chosen[name]?loc[chosen[name]]:home;
    const handle=E('g',{class:'f607-drag','data-handle':name,tabindex:0,role:'button','aria-label':'Ruler end '+name+'. Drag to a route endpoint; keyboard 1 for '+p.from+', 2 for '+p.to+', Delete to return.'},svg);
    N.neonRing(handle,where.x,where.y,{role:name==='A'?'given':'op',r:21,pulse:false});chalk(handle,where.x,where.y+8,name,name==='A'?'given':'op',23);
    handle.addEventListener('keydown',ev=>{if(ev.key==='1'||ev.key==='2'){ev.preventDefault();o.onPlace(name,ev.key==='1'?'A':'B');}else if(['Delete','Backspace','Escape'].includes(ev.key)){ev.preventDefault();o.onRemove(name);}});
    N.ui.svgDrag(svg,handle,{box:{x:where.x-26,y:where.y-26,w:52,h:52},zones:()=>zones,onDrop:target=>{if(target==='A'||target==='B'){Promise.resolve().then(()=>o.onPlace(name,target));return true;}return false;},onRemove:()=>o.onRemove(name)});
  });
  // Scale bar copy is an actual draggable tool, not an illustration. It compares one map cm with a bar interval.
  const tpos=chosen.scale?{x:g.scaleX+g.scaleW*.25,y:g.scaleY-37}:{x:mob?259:483,y:g.toolY};
  const token=E('g',{class:'f607-drag','data-scale-copy':'1',tabindex:0,role:'button','aria-label':'Drag one-centimetre scale copy to the first scale-bar segment. Press S to place or Delete to return.'},svg);
  N.neonBox(token,tpos.x-27,tpos.y-23,55,47,{role:'focus',r:11});chalk(token,tpos.x,tpos.y+8,'1 cm','focus',mob?19:21);
  token.addEventListener('keydown',ev=>{if(ev.key.toLowerCase()==='s'){ev.preventDefault();o.onPlace('scale','scale');}else if(['Delete','Backspace','Escape'].includes(ev.key)){ev.preventDefault();o.onRemove('scale');}});
  N.ui.svgDrag(svg,token,{box:{x:tpos.x-31,y:tpos.y-29,w:64,h:60},zones:()=>[{id:'scale',kind:'drop',x:g.scaleX,y:g.scaleY-55,w:g.scaleW/4,h:95},zones[2]],onDrop:id=>{if(id==='scale'){Promise.resolve().then(()=>o.onPlace('scale','scale'));return true;}return false;},onRemove:()=>o.onRemove('scale')});
  N.neonBox(svg,g.returnX,g.returnY,mob?158:220,73,{role:'error',r:15});chalk(svg,g.returnX+(mob?79:110),g.returnY+45,'RETURN','error',mob?23:31);
  chalk(svg,g.w/2,g.insY,'MOVE THE ENDS · MATCH THE SCALE','focus',mob?21:29);
 }else{chalk(svg,g.w/2,g.insY,challenge&&!solved?'MAP LENGTH × SCALE = ?':step>=5||solved?'REAL DISTANCE  '+fmt(km(p))+' km':'MEASURE · SCALE · CALCULATE',solved||step>=5?'result':'focus',mob?24:34);}
 art.append(svg);
 const all=explore||solved||(!challenge&&step>=5),lengthVisible=explore||solved||(!challenge&&step>=2);
 aside.append(pill('MAP MEASUREMENT',lengthVisible?fmt(mapCm(p))+' cm':'? cm','Distance between the landmark centres.','given'),
  pill('SCALE FACTOR',fmt(p.scale)+' km/cm','Read the same scale from the bar.','focus'),
  pill('REAL DISTANCE',all?fmt(km(p))+' km':'? km','Multiply map cm by km per cm.','result'),
  pill('THE EVIDENCE',`${p.from} → ${p.to}`,'Straight-line distance, not the length of a road.','op'));
 layout.append(art,aside);stage.append(layout);
 N.scene.helperStrip(stage,o.pose||'ruler',o.caption||'Measure first, then scale.');
 return {svg,loc,g};
}
function teach(i,stage){const p=C.presets[C.preset];STEPS[1].narration=`Connect ${p.from} to ${p.to} with a ruler. Measure the straight line from the centre of one marker to the centre of the other.`;
 STEPS[2].narration=`Our two points are ${fmt(mapCm(p))} centimetres apart on this map. The drawing is smaller than the real route.`;
 STEPS[3].narration=`Read the scale bar. One centimetre on the map stands for ${fmt(p.scale)} kilometres in real life.`;
 STEPS[4].narration=`Multiply ${fmt(mapCm(p))} centimetres by ${fmt(p.scale)} kilometres per centimetre. The result is ${fmt(km(p))} kilometres.`;
 STEPS[5].narration=`We can now prove the distance from ${p.from} to ${p.to} is ${fmt(km(p))} kilometres because each map centimetre is worth ${fmt(p.scale)} kilometres.`;
 emit('step',{preset:C.preset,index:i});const r=draw(stage,p,{mode:'watch',step:i,pose:STEPS[i].pose,caption:STEPS[i].caption});
 if(i===1&&!N.reducedMotion()){const line=r.svg.querySelector('.nv-numberline');if(line)M.arrive(line,0,10,400);}
 if(i===5)M.flash(r.svg,(r.loc.A.x+r.loc.B.x)/2,(r.loc.A.y+r.loc.B.y)/2,'result',50);
}
function btn(label,fn,cl='nova-btn'){return H('button',{text:label,class:cl,onclick:fn});}
function explore(panel,stage){let id=C.preset,placed={},message='Move both ruler ends onto the route points, then place a copy of 1 cm on the scale bar.';
 const select=H('select',{'aria-label':'Map and scale scenario'});Object.entries(C.presets).forEach(([k,v])=>select.append(H('option',{value:k,text:v.label})));select.value=id;
 const control=H('div',{class:'f607-controls'}),actions=H('div',{class:'f607-controls'}),fb=H('p',{class:'f607-fb','aria-live':'polite'});
 control.append(H('label',{class:'f607-field'},['Map scenario',select]));actions.append(btn('Check placement',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));
 panel.append(control,actions,H('p',{class:'f607-info',text:'Drag ruler ends A and B to the map markers. Drag the 1 cm scale copy onto the first scale-bar segment. Keyboard: focus each handle and press 1 or 2, or S for the scale. Delete returns a tool.'}),fb);
 function paint(pose='ruler',caption='Measure from point to point.'){draw(stage,C.presets[id],{mode:'explore',id,placed,onPlace:place,onRemove:remove,pose,caption});fb.textContent=message;}
 function place(which,target){placed[which]=target;message=which==='scale'?'Your 1 cm copy is on the scale bar.':'Ruler end '+which+' snapped to '+C.presets[id][target==='A'?'from':'to']+'.';emit('value',{which,target,preset:id});paint('checking','Check both ends against the route.');}
 function remove(which){delete placed[which];message='Returned '+(which==='scale'?'scale copy':'ruler end '+which)+' to the tools row.';emit('value',{removed:which});paint('ruler','Try another position.');}
 function check(){const ok=placed.A==='A'&&placed.B==='B'&&placed.scale==='scale';let msg=ok?'All three placements correct. '+fmt(mapCm(C.presets[id]))+' cm × '+fmt(C.presets[id].scale)+' km/cm = '+fmt(km(C.presets[id]))+' km.':'Put ruler end A on '+C.presets[id].from+', ruler end B on '+C.presets[id].to+', then place 1 cm on the scale bar.';
 message=msg;fb.classList.toggle('good',ok);fb.classList.toggle('bad',!ok);emit('correct',{preset:id,correct:ok});N.events.emit('correct',{engine:ID,correct:ok,mode:'explore'});paint(ok?'celebrate':'not-yet',ok?'Measured brilliantly!':'Use the labelled points.');if(ok){const svg=stage.querySelector('svg');if(svg)M.flash(svg,240,750,'result',55);}}
 function hint(){message='Two route endpoints give the map length. The first segment of the scale bar tells what ONE centimetre represents. Multiply map centimetres by kilometres per centimetre.';N.events.emit('hintUsed',{engine:ID,preset:id});paint('point','Follow the ruler and the scale.');}
 function reset(){placed={};message='Tools returned. Start by matching ruler A to the first landmark.';paint('ruler','Start at the first route point.');}
 select.onchange=()=>{id=select.value;C.preset=id;placed={};message=C.presets[id].context;emit('preset',id);paint('ruler','Measure the new route.');};
 C._explore={get:()=>({id,placed:{...placed},message}),place,remove,check,hint,reset,setPreset:k=>{select.value=k;select.onchange();}};paint();}
function challenge(panel,api,stage){const keys=Object.keys(C.presets);let ix=0,solved=0,ok=false,attempts=0;
 const question=H('p',{class:'f607-question'}),fields=H('div',{class:'f607-fields'}),a=H('input',{type:'text',inputmode:'decimal',placeholder:'Map centimetres','aria-label':'Measured map distance in centimetres'}),b=H('input',{type:'text',inputmode:'decimal',placeholder:'Real kilometres','aria-label':'Real distance in kilometres'});
 fields.append(H('label',{class:'f607-answer'},[H('span',{text:'MAP LENGTH · cm'}),a]),H('label',{class:'f607-answer'},[H('span',{text:'REAL DISTANCE · km'}),b]));
 const feedback=H('p',{class:'f607-fb','aria-live':'polite'}),progress=H('p',{class:'f607-progress'}),actions=H('div',{class:'f607-controls'});
 const checkBtn=btn('Check distance',verify,'nova-btn primary'),hintBtn=btn('Hint',hint),nextBtn=btn('Next map',next);nextBtn.disabled=true;actions.append(checkBtn,hintBtn,nextBtn);panel.append(question,fields,actions,feedback,progress);
 function current(){return C.presets[keys[ix]];}function display(){let p=current();question.textContent='Map '+(ix+1)+' of '+keys.length+': '+p.context;progress.textContent='Routes solved: '+solved+' / '+keys.length;
  draw(stage,p,{mode:'challenge',id:keys[ix],solved:ok,step:ok?5:1,pose:ok?'celebrate':'ruler',caption:ok?'Distance proven from the scale.':'Use the map centimetres and scale bar.'});}
 function n(el){const s=el.value.trim().replace(',','.');return s&&Number.isFinite(+s)?+s:null;}
 function verify(){if(ok)return;attempts++;const p=current(),mc=n(a),real=n(b),c=mapCm(p),k=km(p);let msg='',good=false;
 if(mc===null||real===null)msg='Enter both map centimetres and real kilometres, with units kept separate.';
 else if(Math.abs(mc-c)>.009)msg=Math.abs(mc-p.dx)<.009&&p.dy>0?'You counted only the horizontal distance. Measure directly between the two points.':'The map measurement is incorrect. Read between marker centres using the map grid and ruler.';
 else if(Math.abs(real-k)>.009){if(Math.abs(real-c)<.009)msg='That is the map length in centimetres, not the real distance in kilometres. Multiply by the scale.';
 else if(Math.abs(real-c/p.scale)<.009)msg='You divided by the scale. Here every map centimetre stands for kilometres: multiply instead.';
 else if(Math.abs(real-k*1000)<.01)msg='You converted to metres, but the answer needs kilometres.';
 else msg='Check the scale multiplication: map centimetres × km per centimetre gives real kilometres.';}
 else {good=true;msg='Correct! '+fmt(c)+' cm × '+fmt(p.scale)+' km/cm = '+fmt(k)+' km. Both the length and units agree.';}
 api.check(good,msg,{preset:keys[ix],answers:{cm:mc,km:real},expected:{cm:c,km:k}});feedback.textContent=msg;feedback.classList.toggle('good',good);feedback.classList.toggle('bad',!good);emit('correct',{preset:keys[ix],correct:good});if(good){ok=true;solved++;checkBtn.disabled=true;nextBtn.disabled=false;display();}}
 function hint(){const p=current(),msg='The scale says 1 cm on the drawing is '+fmt(p.scale)+' km in real life. First find the straight-line map length, then multiply by this rate.';api.hint(msg);feedback.textContent=msg;N.events.emit('hintUsed',{engine:ID,preset:keys[ix]});}
 function next(){if(!ok)return;if(ix===keys.length-1){question.textContent='All map-scale routes completed!';fields.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'MAP-SCALE EXPERT');N.scene.helperStrip(stage,'celebrate','Brilliant measuring and scaling.');feedback.textContent='You used the scale to convert drawings into real distances.';return;}
 ix++;ok=false;a.value='';b.value='';checkBtn.disabled=false;nextBtn.disabled=true;feedback.textContent='';display();}
 [a,b].forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter')verify();}));C._challenge={get:()=>({index:ix,solved,ok,attempts,feedback:feedback.textContent}),setAnswers:(cm,real)=>{a.value=cm;b.value=real;},check:verify,hint,next};display();}
const DEF={id:ID,title:'Map and Scale Drawing',config:C,steps:STEPS,render:teach,explore,challenge,
 alt:'A mathematical neon map with labelled landmarks, a straight-line distance and a standard NOVA.numberLine scale bar with draggable ruler endpoints and scale-copy tile.',
 staticAlt:'Measure straight-line map centimetres between landmark centres; multiply by kilometres per centimetre from the scale bar to obtain actual kilometres.',
 spec:{purpose:'Convert map/drawing measurements to actual distance with proportional scaling and mathematical units.',params:'Map points, route geometry (horizontal or diagonal), scale in km per map centimetre, measured cm, labelled landmarks.',presets:'Y7-064 School–Park and Library–Sports; Y9-021 Country Trail and City Survey.',steps:'Locate points → connect centres → read centimetres → read NOVA scale bar → multiply → justify in kilometres.',interactions:'Drag both ruler ends to map markers, drag a one-centimetre scale copy onto the first number-line interval; snap/regrab/red remove tray; accessible keyboard 1/2/S/Delete; numeric Challenge.',traps:'Confusing centimetres with kilometres, using only horizontal distance on diagonal routes, division instead of multiplication, missing unit conversion.',gcse:'Extend to 1:n ratio scales, unit conversions, similar shapes and scale drawing construction.'}};
N.bankMount({id:ID,num:'F6·07',title:DEF.title,spec:DEF.spec,def:DEF,years:'KS3 Years 7 and 9; GCSE scaling extension',linked:['F0-02','F0-03','F0-04','F1-01','F4-07','F6-02','F6-03']});
})();
