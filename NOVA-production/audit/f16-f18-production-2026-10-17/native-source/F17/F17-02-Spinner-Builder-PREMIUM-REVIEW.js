/* F17-02 SPINNER BUILDER — bank v3.6.2 NOVA core; one reusable engine, three named lesson presets. */
(function(){'use strict';
const h=NOVA.h,S=NOVA.svg,E=S.el,M=NOVA.motion;
const CFG=window.NovaV2Integration.configuration(window.NOVA_F17_02_CONFIG={
 startMode:'watch',preset:'y7',events:['value','step','mode','hintUsed','correct'],valueKeys:['preset','favourable','sectors','probability','spinOutcome','trialCount','relativeFrequency','secondaryFavourable','combinedProbability'],
 presets:{
  y7:{label:'Year 7 · Combined events',year:7,context:'TWO INDEPENDENT SPINNERS',primary:{n:4,wins:[0,2],name:'Spinner A'},secondary:{n:3,wins:[1],name:'Spinner B'},goal:'A win AND B win'},
  y8:{label:'Year 8 · Experimental vs theoretical',year:8,context:'EXPERIMENT AND THEORY',primary:{n:6,wins:[0,3],name:'Spinner'},secondary:null,goal:'A winning sector'},
  y9:{label:'Year 9 · Probability models',year:9,context:'EQUALLY LIKELY SECTORS',primary:{n:8,wins:[0,2,5],name:'Spinner'},secondary:null,goal:'A winning sector'}
 }
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mobile=()=>window.innerWidth<=500;
const layout=()=>mobile()?{W:390,H:604,cx:195,cy:207,r:143,smx:280,smy:475,sr:66,px:79,py:464,ry:530,foot:581,small:true}:{W:710,H:493,cx:251,cy:226,r:165,smx:557,smy:238,sr:80,px:558,py:410,ry:421,foot:479,small:false};
const preset=()=>CFG.presets[CFG.preset]||CFG.presets.y7;
const copy=x=>JSON.parse(JSON.stringify(x));
const rng=NOVA.rng.create('F17-02');
let model=makeState(preset()),dragTestHooks=[];
function makeState(p){return {primary:Array.from({length:p.primary.n},(_,i)=>p.primary.wins.includes(i)),secondary:p.secondary?Array.from({length:p.secondary.n},(_,i)=>p.secondary.wins.includes(i)):null,history:[],last:null,spinning:false,angle:0,angleB:0};}
function count(a){return a.filter(Boolean).length;}
function prob(a){return count(a)/a.length;}
function combined(p,m){return m.secondary?prob(m.primary)*prob(m.secondary):prob(m.primary);}
function rounded(x){return String(+x.toFixed(4));}
function gcd(a,b){while(b){const q=a%b;a=b;b=q;}return a||1;}
function frac(n,d){let g=gcd(n,d);return [n/g,d/g];}
function emit(k,v){if(!CFG.valueKeys.includes(k))throw Error('undeclared event value key '+k);NOVA.events.emit('value',{engine:'F17-02',key:k,value:v});}
function say(p,x,y,t,role='op',size=20,anchor='middle'){return NOVA.chalkText(p,x,y,String(t),{role,size,anchor});}
function wedge(cx,cy,r,a0,a1){const pt=(a,rad)=>[cx+rad*Math.cos(a*Math.PI/180),cy+rad*Math.sin(a*Math.PI/180)];let [sx,sy]=pt(a0,r),[ex,ey]=pt(a1,r);return 'M'+cx+','+cy+' L'+sx.toFixed(2)+','+sy.toFixed(2)+' A'+r+','+r+' 0 '+(a1-a0>180?1:0)+' 1 '+ex.toFixed(2)+','+ey.toFixed(2)+' Z';}
function slot(x,y,n,i,r){const a=-90+(i+.5)*360/n;return {x:x+Math.cos(a*Math.PI/180)*r*.71,y:y+Math.sin(a*Math.PI/180)*r*.71,a};}
function diskPath(cx,cy,r){return 'M'+(cx-r)+','+cy+' A'+r+','+r+' 0 1 0 '+(cx+r)+','+cy+' A'+r+','+r+' 0 1 0 '+(cx-r)+','+cy+' Z';}
function fractionEl(n,d){const f=frac(n,d),div=h('span',{class:'f172-frac','aria-label':f[0]+' out of '+f[1]});div.appendChild(h('b',{text:String(f[0])}));div.appendChild(h('i',{'aria-hidden':'true'}));div.appendChild(h('b',{text:String(f[1])}));return div;}
function metric(t,n,d,role,decimal){const card=h('div',{class:'f172-card','data-role':role||'given'});card.appendChild(h('span',{class:'lab',text:t}));if(d!=null)card.appendChild(fractionEl(n,d));else card.appendChild(h('span',{class:'val',text:String(n)}));if(decimal!=null)card.setAttribute('title','Decimal probability: '+rounded(decimal));return card;}
function outcomes(svg,L,p,m,o){const cx=L.cx, top=L.small?378:388,y=L.small?567:468;
 if(o.showMath!==false){
   const a=count(m.primary),n=m.primary.length;
   if(p.secondary){say(svg,L.small?109:548,L.small?377:344,'A then B','given',L.small?18:22);}
   else{say(svg,L.small?195:547,L.small?383:354,'Favourable '+a+' of '+n,'result',L.small?18:21);}
   if(m.last!=null&&o.showTrial){say(svg,L.small?193:549,L.small?580:483,'Last spin: '+(m.last?'WIN':'OTHER'),m.last?'result':'unknown',L.small?17:17);}
 }
}
function spinner(svg,cx,cy,r,wins,o){const n=wins.length,grp=E('g',{'data-spinner':o.id},svg),wheel=E('g',{'data-wheel':o.id},grp);let zoneList=[],markers=[];
 // The 3D/spinner face is composed solely from approved NOVA neonPath/neonRing, not raw filled SVG sectors.
 NOVA.neonPath(wheel,diskPath(cx,cy,r+6),{role:'focus',width:3.5,fill:true});
 for(let i=0;i<n;i++){
   let a0=-90+i*360/n,a1=-90+(i+1)*360/n,role=wins[i]?'result':i%2?'focus':'given';
   const sec=NOVA.neonPath(wheel,wedge(cx,cy,r,a0,a1),{role,width:3.5,fill:true});sec.setAttribute('data-sector',o.id+'-'+i);
   let sc=slot(cx,cy,n,i,r),dist=r*.36;
   say(wheel,cx+Math.cos(sc.a*Math.PI/180)*dist,cy+Math.sin(sc.a*Math.PI/180)*dist+7,''+(i+1),'op',r<90?15:19);
   const rr=r<90?17:24;
   if(wins[i]){
     let token=E('g',{'data-placed':o.id+':'+i,tabindex:o.interact?'0':'-1',role:o.interact?'button':'img','aria-label':'Winning event on sector '+(i+1)+'. Drag to another sector, drag to remove zone, or press Delete.'},wheel);
     NOVA.neonBox(token,sc.x-rr,sc.y-rr*.65,rr*2,rr*1.35,{role:'result',r:12,text:'WIN',size:r<90?13:17});
     if(o.interact)markers.push({el:token,i,sc});
   }else NOVA.neonRing(wheel,sc.x,sc.y,{role:'given',r:r<90?6:8,pulse:false});
   zoneList.push({x:sc.x-(r<90?22:30),y:sc.y-(r<90?22:28),w:r<90?44:60,h:r<90?44:56,id:o.id+':'+i,kind:'drop'});
 }
 NOVA.neonRing(wheel,cx,cy,{role:'unknown',r:r<90?12:17,pulse:false});
 const needle=E('g',{'data-pointer':o.id,transform:'rotate('+(o.angle||0)+' '+cx+' '+cy+')'},grp);
 NOVA.neonPath(needle,'M'+cx+','+(cy-r-18)+' L'+(cx-15)+','+(cy-r-43)+' L'+(cx+15)+','+(cy-r-43)+' Z',{role:'unknown',fill:true,width:3});
 if(o.interact){
   markers.forEach(mark=>{NOVA.ui.svgDrag(svg,mark.el,{box:{x:mark.sc.x-(r<90?22:30),y:mark.sc.y-(r<90?19:26),w:r<90?44:60,h:r<90?38:52},zones:()=>zoneList.concat([o.tray]),removeTo:o.removeTo,
       onDrop:id=>{if(!id.startsWith(o.id+':'))return false;const dest=Number(id.split(':')[1]);o.change(mark.i,dest);return true;},
       onRemove:()=>o.remove(mark.i)});
     mark.el.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();o.remove(mark.i);}});
   });
 }
 return {wheel,zoneList};
}
function palette(svg,L,o){const px=L.px,py=L.py;const g=E('g',{'data-palette':'1',tabindex:'0',role:'button','aria-label':'New winning event token. Drag it onto a spinner sector, or use the sector buttons below.'},svg);
 NOVA.neonBox(g,px-50,py-19,100,38,{role:'result',r:14,text:'+ WIN',size:19});
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const empty=o.primary.findIndex(v=>!v);if(empty>=0)o.add('a',empty);}});
 NOVA.ui.svgDrag(svg,g,{box:{x:px-52,y:py-22,w:104,h:44},zones:()=>o.zones.concat([o.tray]),removeTo:o.removeTo,onDrop:id=>{
   const [key,idx]=id.split(':');if(!['a','b'].includes(key))return false;o.add(key,Number(idx));return true;
 },onRemove:()=>{}});
 return g;
}
function present(stage,p,m,o={}){
if(window.NovaLessonComponent?.active){[stage,p,m,o]=window.NovaLessonComponent.args("present",arguments);}
stage.innerHTML='';const L=layout(),isY7=!!p.secondary;
 NOVA.cap(stage,'Spinner Builder · '+(o.subtitle||'outcome models'),o.tag||'LIVE');
 const svg=S.root(L.W,L.H,'Two-dimensional premium neon probability spinner with '+m.primary.length+' equally likely sectors and '+count(m.primary)+' winning sectors'+(m.secondary?', plus second independent spinner':'')+'.');svg.classList.add('f172-plot');svg.setAttribute('data-engine-plot','F17-02');
 /* Stage caption above the canvas is the sole title: no second heading above the pointer. */
 // Sector artwork and ring geometry stays in the NOVA shared path library.
 let z=[],tray={x:L.px-53,y:L.py+22,w:106,h:37,id:'remove',kind:'remove'},removeTo={x:L.px,y:L.py+38};
 const interact=!!o.interact;
 const A=spinner(svg,L.cx,L.cy,L.r,m.primary,{id:'a',angle:m.angle,interact,change:(i,j)=>{if(!interact)return;const s=m.primary;if(i!==j){s[i]=false;s[j]=true;}o.onChange?.('primary');},remove:i=>{m.primary[i]=false;o.onChange?.('primary');},tray,removeTo});z.push(...A.zoneList);
 let B=null;
 if(isY7){
   B=spinner(svg,L.smx,L.smy,L.sr,m.secondary,{id:'b',angle:m.angleB,interact,change:(i,j)=>{if(i!==j){m.secondary[i]=false;m.secondary[j]=true;}o.onChange?.('secondary');},remove:i=>{m.secondary[i]=false;o.onChange?.('secondary');},tray,removeTo});z.push(...B.zoneList);
   say(svg,L.smx,L.smy+L.sr+24,'SPINNER B','op',L.small?17:19);
 }else{
   const bx=L.small?L.W/2:555;
   say(svg,bx,L.small?386:210,'Win if pointer','op',L.small?17:19);
   say(svg,bx,L.small?411:245,'lands on GREEN','result',L.small?20:23);
   if(o.showOutcomes!==false){
     say(svg,bx,L.small?438:293,count(m.primary)+' winning sectors','result',L.small?18:20);
     say(svg,bx,L.small?460:322,(m.primary.length-count(m.primary))+' other sectors','given',L.small?18:20);
   }
 }
 if(o.showOutcome===true&&m.last!=null){
   const bx=L.small?195:550,by=L.small?570:371;
   say(svg,bx,by,'Last: '+(m.last?'WIN':'OTHER'),m.last?'result':'unknown',L.small?16:19);
 }
 if(interact){
   palette(svg,L,{zones:z,tray,removeTo,primary:m.primary,add:(id,i)=>{const target=id==='a'?m.primary:m.secondary;if(!target)return;target[i]=true;o.onChange?.(id==='a'?'primary':'secondary');}});
   NOVA.neonBox(svg,tray.x,tray.y,tray.w,tray.h,{role:'error',r:10,text:'REMOVE',size:16});
   say(svg,L.px,L.py-32,'DRAG TO PLACE','given',L.small?16:17);
 }else if(o.showAnimation){ // highlight one outcome without changing the chosen random result
   const idx=clamp(o.focusIndex||0,0,m.primary.length-1),pt=slot(L.cx,L.cy,m.primary.length,idx,L.r);
   NOVA.neonRing(svg,pt.x,pt.y,{role:'unknown',r:32,pulse:true});
 }
 if(o.winFlash)M.flash(svg,L.cx,L.cy,'result',55);
 stage.appendChild(svg);
 const rd=h('div',{class:'f172-readouts'}),a=count(m.primary),n=m.primary.length;
 rd.appendChild(metric('WINNING',a,n,'result',prob(m.primary)));
 rd.appendChild(metric('THEORETICAL',rounded(prob(m.primary)),null,'unknown'));
 if(isY7){const b=count(m.secondary),den=n*m.secondary.length;rd.appendChild(metric('A AND B',a*b,den,'focus',combined(p,m)));}
 else{const empirical=m.history.length?rounded(m.history.filter(Boolean).length/m.history.length):'—';rd.appendChild(metric('EXPERIMENTAL',empirical,null,'focus'));}
 stage.appendChild(rd);
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Each equal sector has the same chance. Count the green sectors to find your probability.');
 return {svg,A,B,L};
}
const steps=[
 {name:'Meet the spinner',pose:'explain',mood:'neutral',narration:'A fair spinner stops equally often in each equal-sized sector. Every sector represents one equally likely outcome.',prompt:'What tells us that the sectors are equally likely?'},
 {name:'Read the sectors',pose:'point-down',mood:'focus',narration:'Find the green winning sectors. Count the total sectors as well as the winners.',prompt:'If there are four sectors, what should the denominator be?'},
 {name:'Build an event',pose:'count',mood:'focus',narration:'The chance of a win is the number of winning sectors divided by the number of equally likely sectors.',prompt:'Why would counting just the winning sectors be incomplete?'},
 {name:'Spin and observe',pose:'think',mood:'focus',narration:'A single spin is uncertain. A spinner can stop in a winning sector or in another sector.',prompt:'Does one result tell us the exact chance of winning?'},
 {name:'Collect outcomes',pose:'compare',mood:'focus',narration:'Repeated spins give experimental relative frequency. The theoretical probability comes from the sector sizes.',prompt:'Why need not the experimental and theoretical values match after only a few spins?'},
 {name:'Predict a result',pose:'celebrate',mood:'cheer',narration:'For two independent spinners, multiply the chances for both events to happen. Explore the model and test your prediction.',prompt:'How would you find the chance of two independent winning results?'}
];
function drawStep(i,stage){const p=preset();let m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("drawStep.m",(...a)=>makeState(...a),[p]):(makeState(p)));const n=clamp(i,0,steps.length-1),text=[
 'The pointer selects one equally likely sector.',
 'Count all sectors before finding a chance.',
 'Green sectors are the favourable outcomes.',
 'We cannot predict an individual fair spin.',
 'Experimental results can vary from the model.',
 p.secondary?'For independent spinners, multiply the two chances.':'Use the model to predict the long-run results.'
 ];
 if(n===0){m.primary.fill(false);if(m.secondary)m.secondary.fill(false);}
 if(n===1){m.primary=m.primary.map((v,j)=>j<p.primary.wins.length);}
 if(n===2){m.primary=p.primary.wins.map(()=>true).concat(Array(p.primary.n-p.primary.wins.length).fill(false));}
 if(n===3){m.last=true;}
 if(n===4){m.history=[true,false,false,true,false,true,false,false,true,false,false,true];m.last=true;}
 if(n===5){m.history=[true,false,true,false,false,true,false,true,false,false,true,false];}
 const out=present(stage,p,m,{subtitle:steps[n].name,tag:'STEP '+(n+1)+'/'+steps.length,pose:steps[n].pose,say:text[n],showOutcome:n===3||n===4,showAnimation:n===3,focusIndex:n===3?0:undefined});
 if(n===3)M.flash(out.svg,out.L.cx,out.L.cy-out.L.r*.65,'unknown',38);
}
function buildControls(panel,stage,api,p,m,o={}){
 const status=h('div',{class:'f172-status',role:'status','aria-live':'polite'});
 let r=null,spinStop=null;
 const sel=h('select',{class:'nova-input','aria-label':'Lesson preset'});
 Object.entries(CFG.presets).forEach(([key,value])=>sel.appendChild(h('option',{value:key,text:value.label})));
 sel.value=CFG.preset;
 const btn=(txt,fn)=>h('button',{class:'nova-btn',text:txt,onclick:fn});
 const modelRow=h('div',{class:'f172-box'});
 const nSelect=h('select',{class:'nova-input','aria-label':'Number of equal sectors'});
 [3,4,5,6,8,10].forEach(n=>nSelect.appendChild(h('option',{value:String(n),text:n+' equal sectors'})));
 const idxSel=h('select',{class:'nova-input','aria-label':'Choose sector'});
 const wheelSel=h('select',{class:'nova-input','aria-label':'Choose spinner'});
 const add=h('button',{class:'nova-btn',text:'Mark WIN',onclick:()=>changeSlot(true)});
 const rem=h('button',{class:'nova-btn',text:'Remove WIN',onclick:()=>changeSlot(false)});
 function changeSlot(v){const which=wheelSel.value==='b'?'secondary':'primary',arr=m[which];if(!arr)return;const i=+idxSel.value;if(i<0||i>=arr.length)return;arr[i]=v;repaint();updateEmit(which);}
 function updateEmit(which){emit(which==='secondary'?'secondaryFavourable':'favourable',count(m[which]));emit('probability',prob(m.primary));emit('combinedProbability',combined(p,m));}
 function updateOptions(){
   const keepWheel=wheelSel.value,keepIndex=idxSel.value;
   nSelect.value=String(m.primary.length);wheelSel.innerHTML='';wheelSel.appendChild(h('option',{value:'a',text:'Spinner A'}));if(m.secondary)wheelSel.appendChild(h('option',{value:'b',text:'Spinner B'}));
   if(keepWheel==='b'&&m.secondary)wheelSel.value='b';
   idxSel.innerHTML='';(wheelSel.value==='b'?m.secondary:m.primary).forEach((v,i)=>idxSel.appendChild(h('option',{value:i,text:'Sector '+(i+1)+(v?' — WIN':' — other')})));
   if(keepIndex!==''&&+keepIndex<idxSel.options.length)idxSel.value=keepIndex;
 }
 function repaint(focusSelector){
   updateOptions();const o2=present(stage,p,m,{subtitle:'editable equal-sector probability models',tag:'DRAG + SNAP',interact:true,showOutcome:m.history.length>0,pose:m.last===true?'celebrate':'compare',say:m.last===true?'That spin landed on a winning sector. Can you predict the next one?':p.secondary?'Use both spinners to work out the chance of two winning results.':'Add a WIN chip to any sector, then spin and compare your results.',onChange:key=>{updateEmit(key);repaint();}});
   status.textContent='Theory '+rounded(prob(m.primary))+(m.secondary?' · Together '+rounded(combined(p,m)):'')+' · Spins '+m.history.length+(m.history.length?' · Wins '+m.history.filter(Boolean).length:'');
   status.className='f172-status'+(m.last===true?' good':'');
   if(focusSelector){const item=stage.querySelector(focusSelector);if(item)item.focus({preventScroll:true});}
   return o2;
 }
 function pickSpin(which){const arr=m[which];return Math.floor(rng.next()*arr.length);}
 function spin(times){if(m.spinning)return;
   const outcomes=[];for(let t=0;t<times;t++){let a=pickSpin('primary'),b=m.secondary?pickSpin('secondary'):-1;outcomes.push({a,b,win:m.primary[a]&&(b<0||m.secondary[b])});}
   const last=outcomes.at(-1);m.spinning=true;const ds=stage.querySelector('[data-spinner="a"] [data-pointer]');const db=stage.querySelector('[data-spinner="b"] [data-pointer]');const startAngle=m.angle,startAngleB=m.angleB;
   const destination=startAngle+1080+(((last.a+.5)*360/m.primary.length - startAngle%360+360)%360);
   const destinationB=last.b<0?0:startAngleB+1080+(((last.b+.5)*360/m.secondary.length - startAngleB%360+360)%360);
   if(ds){spinStop=M.tween(times===1?1250:720,(e)=>{const L=layout();ds.setAttribute('transform','rotate('+((startAngle+(destination-startAngle)*e).toFixed(2))+' '+L.cx+' '+L.cy+')');if(db)db.setAttribute('transform','rotate('+(startAngleB+(destinationB-startAngleB)*e).toFixed(2)+' '+L.smx+' '+L.smy+')');},M.ease.inOut,()=>{
     m.angle=destination%360;m.angleB=destinationB%360;m.spinning=false;outcomes.forEach(x=>m.history.push(x.win));m.last=last.win;emit('spinOutcome',{a:last.a+1,b:last.b<0?null:last.b+1,win:last.win});emit('trialCount',m.history.length);emit('relativeFrequency',m.history.filter(Boolean).length/m.history.length);const rr=repaint();M.flash(rr.svg,rr.L.cx,rr.L.cy,m.last?'result':'unknown',53);
   });}else{m.spinning=false;}
 }
 function restorePreset(){p=preset();m=makeState(p);emit('preset',CFG.preset);emit('sectors',m.primary.length);repaint();}
 sel.onchange=()=>{CFG.preset=sel.value;restorePreset();};
 nSelect.onchange=()=>{const n=+nSelect.value,old=m.primary.slice();m.primary=Array.from({length:n},(_,i)=>old[i]||false);m.history=[];m.last=null;emit('sectors',n);repaint();};
 wheelSel.onchange=updateOptions;
 panel.appendChild(h('label',{class:'f172-panel-label'},['Lesson preset ',sel]));
 modelRow.appendChild(nSelect);modelRow.appendChild(wheelSel);modelRow.appendChild(idxSel);modelRow.appendChild(add);modelRow.appendChild(rem);panel.appendChild(modelRow);
 panel.appendChild(h('p',{class:'f172-panel-note',text:'Drag the green + WIN chip onto any sector. Move placed WIN chips between sectors, or drag them into REMOVE. All actions also work with the sector controls.'}));
 const spins=h('div',{class:'f172-box'},[btn('Spin once',()=>spin(1)),btn('Run 20 trials',()=>spin(20)),btn('Run 100 trials',()=>spin(100)),btn('Clear trials',()=>{m.history=[];m.last=null;repaint();}),btn('Reset spinner',restorePreset)]);
 panel.appendChild(spins);panel.appendChild(status);
 CFG._explore={get:()=>({model:copy(m),preset:CFG.preset}),setPreset:k=>{sel.value=k;sel.onchange();},add:(which,i)=>{m[which][i]=true;updateEmit(which);repaint();},remove:(which,i)=>{m[which][i]=false;updateEmit(which);repaint();},spin,update:repaint};
 api.onCleanup(()=>{if(spinStop&&spinStop.stop)spinStop.stop();m.spinning=false;NOVA.ui.cancelDrag();});
 repaint();
}
function challenge(panel,api,stage){let active=0,phase=null,m=(window.NovaLessonComponent?window.NovaLessonComponent.exploreInit("challenge.m",(...a)=>makeState(...a),[CFG.presets.y7]):(makeState(CFG.presets.y7))),lastEventHandler=null;
 m.primary=[false,false,false,false];
 const tasks=[
  {q:'Make exactly TWO winning sectors on a FOUR-sector spinner. Drag WIN chips onto the wheel or use the sector controls below.',
    build:ctl=>{phase='build';ctl.appendChild(h('span',{class:'f172-equation',text:'2 winning sectors · 4 equal sectors'}));return ()=>count(m.primary);},
    check:v=>[v===2,v===2?'Correct. Two equally likely winning sectors out of four gives one half.':v<2?'There are fewer than two WIN sectors. Add another favourable outcome.':'Too many sectors are winning. Remove extra WIN chips.'],
    hint:'There should be two green sectors, and two other sectors.',solve:()=>{m.primary=[true,false,true,false];draw(0);}},
  {q:'Year 8 experiment: the spinner has 6 equal sectors, with 2 winning sectors. In 20 spins, 7 were wins. Enter the EXPERIMENTAL relative frequency as a decimal.',
    build:NOVA.entryTask('Experimental frequency as a decimal','F17-02'),
    check:v=>{const ok=typeof v==='number'&&Math.abs(v-.35)<.000001;return [ok,ok?'Correct. Seven wins from twenty spins gives 0.35; theory is two sixths, or one third.':v!=null&&Math.abs(v-1/3)<.001?'That is the theoretical probability. The question asks for the seven observed wins out of twenty spins.':v!=null&&(v>1||v<0)?'Relative frequencies must be between zero and one.':'Divide observed wins, seven, by the number of trials, twenty.'];},
    hint:'Experimental frequency = wins ÷ total actual trials = 7 ÷ 20.',solve:ctl=>{const i=ctl.querySelector('input');if(i){i.value='0.35';i.dispatchEvent(new Event('input',{bubbles:true}));}}},
  {q:'Year 7 independent spinners: A has 2 winning sectors out of 4. B has 1 winning sector out of 3. How many winning outcome PAIRS exist out of 12?',
    build:NOVA.choiceTask([{label:'2 favourable pairs',value:'2'},{label:'3 favourable pairs',value:'3'},{label:'6 favourable pairs',value:'6'},{label:'7 favourable pairs',value:'7'}],'F17-02'),
    check:v=>[v==='2',v==='2'?'Correct. Two choices on A and one on B make 2 × 1 = 2 favourable pairs. There are 4 × 3 = 12 pairs, so the probability is one sixth.':v==='6'?'That counts too many pairs. Multiply favourable choices on A by favourable choices on B: two times one.':v==='3'?'There are three sectors on B, but only one is favourable.':'Use favourable outcomes on BOTH spinners, not the total sector counts.'],
    hint:'Pair every winning sector on A with each winning sector on B: 2 × 1.',solve:ctl=>{const b=ctl.querySelector('button');if(b)b.click();}}
 ];
 const pane=h('div',{class:'f172-box'});
 const idx=h('select',{class:'nova-input','aria-label':'Select spinner sector'}),add=h('button',{class:'nova-btn',text:'Mark WIN',onclick:()=>{m.primary[+idx.value]=true;draw(active);}}),rem=h('button',{class:'nova-btn',text:'Remove WIN',onclick:()=>{m.primary[+idx.value]=false;draw(active);}});
 pane.appendChild(idx);pane.appendChild(add);pane.appendChild(rem);panel.appendChild(pane);
 function draw(i){active=i;const p=i===1?CFG.presets.y8:CFG.presets.y7;
   if(i===0){if(m.primary.length!==4)m.primary=[false,false,false,false];}
   else if(i===1){m=makeState(p);m.history=[true,false,false,true,false,false,true,true,false,false,true,false,false,false,true,false,false,true,false,false];}
   else{m=makeState(p);}
   idx.innerHTML='';m.primary.forEach((s,j)=>idx.appendChild(h('option',{value:j,text:'Sector '+(j+1)+(s?' — WIN':'')})));
   const out=present(stage,p,m,{subtitle:'challenge '+(i+1)+' · count and check',tag:'TASK '+(i+1)+'/3',interact:i===0,pose:'think',say:i===0?'Make two green winning sectors. Then check the total.':i===1?'Do not confuse your observed results with the mathematical model.':'Independent events create pairs. Count the favourable pairs.',onChange:()=>{if(i===0){emit('favourable',count(m.primary));draw(0);}}});
 }
 NOVA.challengeRun(panel,api,tasks,draw,CFG);
 CFG._challengeValue=()=>({task:active,wins:count(m.primary)});
 api.onCleanup(()=>NOVA.ui.cancelDrag());
 // Core events are global. This listener is removed when mode changes to avoid accumulating helpers.
 lastEventHandler=e=>{const d=e.detail||{};if(d.engine!=='F17-02')return;const happy=d.correct;const dock=stage.querySelector('.nv-dock');if(dock)dock.remove();NOVA.scene.helperStrip(stage,happy?'celebrate':'not-yet',happy?'Exactly right. That outcome model is sound.':'Check the counting rule, then try again.');if(happy){const svg=stage.querySelector('.f172-plot');if(svg){const L=layout();M.flash(svg,L.cx,L.cy,'result',45);}}};
 const off=NOVA.events.on('correct',lastEventHandler);api.onCleanup(off);
}
const DEF={id:'F17-02',title:'Spinner Builder',config:CFG,steps,render:drawStep,
 alt:'Interactive premium neon spinner with mathematically equal sectors, draggable WIN event markers, a visible outcome pointer, and an independent second spinner when required.',
 staticAlt:'Year 7: two winning sectors out of four and one winning sector out of three give two favourable pairs in twelve equally likely pairs, a probability of one sixth. Year 8: two out of six gives one third. Year 9: three out of eight gives three eighths.',
 exploreIntro:'Build the spinner by placing WIN tokens on sectors. Run trials and compare what happens with the theoretical chance.',
 explore:(panel,stage,api)=>buildControls(panel,stage,api,preset(),model),
 challenge};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F17-02',DEF,{models:{"model":()=>model},tables:{"dragTestHooks":()=>dragTestHooks,"steps":()=>steps},draws:{"present":["stage","p","m","o"]},exploreFields:{"drawStep.m":{"kind":"factory","factory":"makeState","argCount":1},"challenge.m":{"kind":"factory","factory":"makeState","argCount":1}}});
NOVA.bankMount({id:'F17-02',num:'F17·02',title:'Spinner Builder',def:DEF,
 years:'KS3 Years 7, 8 and 9; GCSE probability, relative frequency, compound independent events.',linked:['F0-02','F0-03','F0-04','F0-06','F17-01','F17-03','F17-05','F17-07'],
 spec:{purpose:'Construct fair spinners with equal sectors. Change favourable outcomes, simulate independent trials, compare theoretical and experimental probability, and combine two independent spinners.',
 params:'3, 4, 5, 6, 8 or 10 equal sectors; WIN set; spinner A and optional B; trial count; seed; theoretical and experimental frequency.',
 presets:'Y7-075 Combined events: 2 of 4 AND 1 of 3. Y8-073 Experimental and theoretical: 2 of 6. Y9-042 Probability models: 3 of 8.',
 steps:'Meet spinner → read sectors → build an event → animate a trial → collect outcomes → predict independently combined results. Named timeline with narration slots.',
 interactions:'Watch and Guided timeline; Explore drag event chips to sector targets, move and remove placed chips, keyboard sector buttons, change equal-sector count, run spins; Challenge sector count, relative frequency, independent pairs. Emit fixed-key events.',
 traps:'Confusing winning with total sectors, counting favourable instead of observed frequency, assuming experimental equals theoretical in small samples, adding instead of multiplying independent chances.',
 gcse:'Compound independent event probabilities, conditional extensions and experimental convergence.'}});
const log=document.getElementById('log');if(log){const add=e=>{log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,5500);};NOVA.events.history().forEach(add);NOVA.events.on('*',add);const b=document.getElementById('clearlog');if(b)b.onclick=()=>{log.textContent='';};}
})();
