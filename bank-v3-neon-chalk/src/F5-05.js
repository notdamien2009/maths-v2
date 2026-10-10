
var NOVA_F5_05_CONFIG={startMode:'guided',preset:'quarters',events:['preset','numerator','denominator','factor','factorDrag','reset'],presets:{
 quarters:{label:'Three quarters',n:3,d:4,k:2},half:{label:'One half',n:1,d:2,k:2},thirds:{label:'Two thirds',n:2,d:3,k:3},fifths:{label:'Three fifths',n:3,d:5,k:2},sixths:{label:'Five sixths',n:5,d:6,k:3},zero:{label:'Zero of a whole',n:0,d:4,k:2},whole:{label:'One whole',n:4,d:4,k:3}}};
(function(){'use strict';
var N=NOVA,S=N.svg,E=S.el,M=N.motion,H=N.h,C=NOVA_F5_05_CONFIG,ID='F5-05',active=null;
function emit(k,v){if(C.events.indexOf(k)<0)throw Error('F5-05 undeclared event '+k);N.events.emit('value',{engine:ID,key:k,value:v});}
function txt(p,x,y,t,role,size,anchor){return N.chalkText(p,x,y,String(t),{role:role||'support',size:size||20,anchor:anchor||'middle'});}
function rect(p,x,y,w,h,fill,attrs){return E('rect',Object.assign({x:x,y:y,width:w,height:h,fill:fill},attrs||{}),p);}
function stack(p,x,y,n,d,role,size){size=size||25;var g=E('g',{'aria-label':String(n)+' over '+String(d)},p);txt(g,x,y-size*.30,n,role,size);N.neonLine(g,x-size*.63,y+2,x+size*.63,y+2,{role:role,width:2.2});txt(g,x,y+size*.9,d,role,size);return g;}
function colour(role){return S.c(role);}
function state(n,d,k){d=Math.max(2,Math.min(6,Math.round(d)));return {n:Math.max(0,Math.min(d,Math.round(n))),d:d,k:Math.max(2,Math.min(4,Math.round(k)))}};
function initial(key){var a=C.presets[key]||C.presets.quarters;return state(a.n,a.d,a.k);}
function gradients(s){var d=E('defs',{},s);function grad(id,list){var g=E('linearGradient',{id:id,x1:'1%',y1:'0%',x2:'24%',y2:'100%'},d);list.forEach(function(a){E('stop',{offset:a[0],'stop-color':a[1],'stop-opacity':a[2]===undefined?1:a[2]},g);});}
 grad('eq-frame',[['0%','#c4e5f7'],['10%','#587d9c'],['32%','#0a1b34'],['83%','#3a6584'],['100%','#aed2e6']]);
 grad('eq-face',[['0%','#22435e'],['47%','#102a45'],['100%','#07182f']]);
 grad('eq-focus',[['0%','#ffe3a5',.98],['36%',colour('focus'),.86],['100%','#96602a',.76]]);
 grad('eq-result',[['0%','#d4ffe8',.98],['34%',colour('result'),.89],['100%','#0b6659',.78]]);
 var patt=E('pattern',{id:'eq-grid',width:16,height:16,patternUnits:'userSpaceOnUse'},d);E('circle',{cx:2,cy:2,r:0.8,fill:'#aad8ff','fill-opacity':.16},patt);
}
function panelFrame(s,x,y,w,h){rect(s,x-18,y-16,w+36,h+32,'url(#eq-frame)',{rx:20,stroke:'#c4e8ff','stroke-width':1.5,'stroke-opacity':.65});rect(s,x-11,y-9,w+22,h+18,'#050f22',{rx:14,stroke:'#4f7d9b','stroke-width':2});rect(s,x-5,y-4,w+10,h+8,'url(#eq-face)',{rx:10,stroke:'#517c9d','stroke-width':1.3});for(var i=0;i<4;i++){var xx=i%2?x+w+9:x-9,yy=i<2?y-9:y+h+9;E('circle',{cx:xx,cy:yy,r:2.4,fill:'#c5e6f6',opacity:.6},s);}}
function drawStrip(s,x,y,w,h,count,fillCount,role,opt){opt=opt||{};panelFrame(s,x,y,w,h);var cuts=[],step=w/count;
 for(var j=0;j<count;j++){
  var on=j<fillCount,xp=x+j*step;
  var cell=rect(s,xp+1.4,y+2,Math.max(1,step-2.8),h-4,on?'url(#eq-'+(role==='result'?'result':'focus')+')':'#102942',{'data-part':j,rx:3,stroke:on?colour(role):'#416481','stroke-width':1.15,'stroke-opacity':on?.95:.7});
  if(on)rect(s,xp+2.6,y+2.7,Math.max(1,step-5.2),Math.min(8,h*.2),'#f0ffff',{rx:2,opacity:.25,'pointer-events':'none'});
  if(opt.split&&j%opt.factor!==0){var cut=N.neonLine(s,xp,y+2,xp,y+h-2,{role:'support',width:1.6});cuts.push(cut);}
  if(opt.click&&count===opt.d){var hit=rect(s,xp+1,y+2,Math.max(2,step-2),h-4,'transparent',{style:'cursor:pointer',role:'button',tabindex:0,'aria-label':'Shade '+(j+1)+' of '+count+' original equal parts'});
   (function(n,el){el.addEventListener('click',function(){opt.click(n);});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.click(n);}})})(j+1,hit);
  }
 }
 if(opt.animate&&cuts.length){cuts.forEach(function(c,i){c.style.opacity='0';M.delay(80+i*35,function(){if(opt.dead())return;M.tween(210,function(t){if(c.isConnected)c.style.opacity=String(t);},M.ease.inOut);});});}
 return cuts;
}
function dial(s,x,y,w,k,interactive,when,dead){N.neonBox(s,x-15,y-42,w+30,118,{role:'op',r:15});txt(s,x+w/2,y-16,'Split each part', 'support',20);var stops=[];
 for(var i=0;i<3;i++){var xx=x+35+i*(w-70)/2;N.neonRing(s,xx,y+24,{role:i+2===k?'op':'support',r:i+2===k?13:8,pulse:false});txt(s,xx,y+61,'×'+(i+2),'op',21);stops.push(xx);}
 if(!interactive)return;
 var xx=stops[k-2],g=E('g',{'data-factor-handle':'yes',class:'eq-slide',tabindex:0,role:'slider','aria-label':'Subdivision multiplier','aria-valuemin':2,'aria-valuemax':4,'aria-valuenow':k},s);
 N.neonBox(g,xx-17,y+7,34,34,{role:'op',r:10});N.neonRing(g,xx,y+24,{role:'focus',r:8,pulse:false});
 g.addEventListener('keydown',function(e){var delta=e.key==='ArrowRight'||e.key==='ArrowUp'?1:e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:0,chosen=delta?Math.max(2,Math.min(4,k+delta)):e.key==='Home'?2:e.key==='End'?4:null;
 if(chosen!==null){e.preventDefault();when(chosen,'keyboard');}});
 var zones=stops.map(function(p,i){return {id:'factor:'+String(i+2),kind:'drop',x:p-26,y:y-3,w:52,h:64};});
 N.ui.svgDrag(s,g,{box:{x:xx-17,y:y+7,w:34,h:34},canStart:function(){return !dead();},zones:function(){return zones;},onDrop:function(id){when(+id.split(':')[1],'drag');return true;}});
}
function renderScene(stage,o,opt){opt=opt||{};if(active)active.dead=true;var scene={dead:false};active=scene;var small=innerWidth<=670,W=small?420:1100,V=small?1030:667;
 stage.innerHTML='';N.cap(stage,'F5-05 · '+(opt.name||'Equivalent fraction multiplier'),'PREMIUM');
 var svg=S.root(W,V,'A fixed whole is partitioned into '+o.d+' equal original parts. Subdividing every part by the same multiplier preserves the shaded endpoint.');svg.classList.add('eq-svg');gradients(svg);
 var x=small?47:120,w=small?326:600,top=small?216:157,bottom=small?422:336,h=small?69:72,center=x+w/2,ratio=o.n/o.d,endpoint=x+w*ratio,phase=opt.phase||'result',showLower=phase!=='original',refined=phase!=='original'&&phase!=='before',hidden=!!opt.hide,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 txt(svg,small?210:432,small?43:51,'One whole · unchanged length','support',small?23:29);
 txt(svg,small?210:433,small?91:88,'Refine the partitions, not the amount','given',small?19:21);
 txt(svg,x,top-37,'Original · '+o.d+' equal parts','focus',small?19:21,'start');
 drawStrip(svg,x,top,w,h,o.d,o.n,'focus',{click:opt.click,d:o.d});
 if(showLower){txt(svg,x,bottom-37,refined?'Refined · '+(o.d*o.k)+' equal parts':'The same whole before splitting','result',small?19:21,'start');
 drawStrip(svg,x,bottom,w,h,refined?o.d*o.k:o.d,refined?o.n*o.k:o.n,refined?'result':'focus',{split:refined,factor:o.k,animate:!!opt.animate&&!reduced,dead:function(){return scene.dead;}});
 // A meaningful physical subdivision reveal: each original-sized tile gives way to k smaller tiles.
 // Reduced-motion mode displays the correctly refined result immediately.
 if(refined&&opt.animate&&!reduced){for(var t=0;t<o.d;t++)(function(part){var unit=w/o.d;
   var cover=rect(svg,x+part*unit+1.6,bottom+2,unit-3.2,h-4,part<o.n?'url(#eq-focus)':'#102942',{rx:3,stroke:'#84adcc','stroke-width':1.5,'data-original-cover':part});
   M.delay(130+part*180,function(){if(scene.dead||!cover.isConnected)return;
     M.tween(315,function(v){if(!scene.dead&&cover.isConnected)cover.style.opacity=String(1-v);},M.ease.inOut,function(){if(cover.isConnected)cover.remove();});
     M.flash(svg,x+(part+.5)*unit,bottom+h/2,'result',Math.min(34,unit*.4));
   });
 })(t);}
 // Amber and green endpoints are ALWAYS physically aligned, so the equality is visible.
 N.neonLine(svg,endpoint,top+h+15,endpoint,bottom-16,{role:'op',width:3});N.neonRing(svg,endpoint,top+h+15,{role:'focus',r:8,pulse:false});N.neonRing(svg,endpoint,bottom-16,{role:'result',r:8,pulse:false});
 }
 // The blue reference ruler is the same whole; it cannot resize when k changes.
 var ry=small?555:467;N.neonLine(svg,x,ry,x+w,ry,{role:'support',width:2});N.neonRing(svg,x,ry,{role:'support',r:5,pulse:false});N.neonRing(svg,x+w,ry,{role:'support',r:5,pulse:false});N.neonLine(svg,endpoint,ry-12,endpoint,ry+12,{role:'focus',width:2.4});
 txt(svg,x,ry+29,'0','support',20);txt(svg,x+w,ry+29,'1 whole','support',20);
 if(small){
  N.neonBox(svg,44,603,332,147,{role:'result',r:14});txt(svg,210,633,hidden?'Use the model to count':'Same shaded length','result',22);
  stack(svg,130,696,o.n,o.d,'focus',25);txt(svg,213,700,'=','support',27);
  if(hidden)txt(svg,303,699,'?', 'unknown',29);else stack(svg,300,696,o.n*o.k,o.d*o.k,'result',25);
  dial(svg,60,797,300,o.k,!!opt.interactive,opt.onFactor,function(){return scene.dead;});
  txt(svg,210,998,'The coloured endpoint stays fixed','support',19);
 }else{
  N.neonBox(svg,782,160,282,252,{role:'result',r:16});txt(svg,923,201,hidden?'Find the equivalent parts':'Matching shaded length','result',21);
  stack(svg,866,287,o.n,o.d,'focus',27);txt(svg,924,292,'=','support',29);
  if(hidden)txt(svg,990,295,'?', 'unknown',29);else stack(svg,992,287,o.n*o.k,o.d*o.k,'result',27);
  txt(svg,922,378,hidden?'Count the smaller pieces':o.k+' times as many pieces','support',18);
  dial(svg,276,529,480,o.k,!!opt.interactive,opt.onFactor,function(){return scene.dead;});
 }
 if(opt.animate&&refined){var guide=svg.querySelector('.eq-connector');M.delay(180,function(){if(scene.dead)return;M.flash(svg,endpoint,bottom+h/2,'result',Math.min(32,w/o.d));});}
 stage.appendChild(svg);N.scene.helperStrip(stage,opt.pose||'compare',opt.caption||'The shaded length is still the same.');
 return scene;
}
var steps=[
 {name:'Fix one whole',n:1,d:2,k:2,phase:'original',pose:'explain',caption:'One whole stays the same length',narration:'This entire glass strip represents one whole. The strip is divided into two equal parts, and one is shaded.',prompt:'What portion of this whole is shaded?'},
 {name:'Compare the identical whole',n:1,d:2,k:2,phase:'before',pose:'point-down',caption:'Two equal-length whole bars',narration:'We place an equally sized second bar below it. Both bars start and end at exactly the same positions.',prompt:'Are the two bars equal in length?'},
 {name:'Subdivide every piece',n:1,d:2,k:2,phase:'result',animate:true,pose:'count',caption:'Each half splits into two parts',narration:'Divide both original half pieces into two equal smaller pieces. There are four equal pieces in the whole.',prompt:'Why has the denominator doubled?'},
 {name:'Track the shaded endpoint',n:1,d:2,k:2,phase:'result',pose:'ruler',caption:'The shaded endpoint never moves',narration:'One of two shaded original pieces becomes two of four shaded smaller pieces. The green and amber endpoints are the same.',prompt:'What has changed, and what has stayed the same?'},
 {name:'Try a multiplier of three',n:2,d:3,k:3,phase:'result',animate:true,pose:'show-three',caption:'Two thirds becomes six ninths',narration:'Two thirds stays the same length if every third is split into three. There are six shaded ninths from nine equal parts.',prompt:'What must happen to both the numerator and denominator?'},
 {name:'Generalise the rule',n:3,d:4,k:4,phase:'result',animate:true,pose:'idea',caption:'Multiply both counts by the same factor',narration:'Three quarters becomes twelve sixteenths. Multiply numerator and denominator by four. This is multiplication by four over four, or by one, so the value is unchanged.',prompt:'Why is a fraction equivalent after multiplying top and bottom equally?'}
];
function guided(i,stage){var t=steps[i];renderScene(stage,t,{name:t.name,phase:t.phase,pose:t.pose,caption:t.caption,animate:t.animate});}
function explore(panel,stage){var o=initial(C.preset),status=H('div',{class:'eq-msg',role:'status','aria-live':'polite'}),preset=H('select',{class:'nova-input','aria-label':'Choose equivalent fraction preset'}),den=H('select',{class:'nova-input','aria-label':'Number of original equal parts'});
 Object.keys(C.presets).forEach(function(key){preset.appendChild(H('option',{value:key,text:C.presets[key].label}));});[2,3,4,5,6].forEach(function(d){den.appendChild(H('option',{value:d,text:String(d)}));});preset.value=C.preset;den.value=o.d;
 function update(anim){status.textContent='Original '+o.n+' of '+o.d+' parts; refined '+(o.n*o.k)+' of '+(o.d*o.k)+' parts. The shaded endpoint is '+(o.n===0?'zero':o.n===o.d?'one whole':'fixed')+'.';
 renderScene(stage,o,{name:'Explore · split the whole',phase:'result',pose:o.n===o.d?'celebrate':'compare',caption:'Both ends still align',interactive:true,animate:!!anim,onFactor:setFactor,click:shade});}
 function setFactor(k,kind){o.k=Math.max(2,Math.min(4,k));emit(kind==='drag'?'factorDrag':'factor',o.k);update(true);if(kind==='keyboard'){var grip=stage.querySelector('[data-factor-handle]');if(grip)grip.focus();}}
 function shade(n){o.n=n;emit('numerator',o.n);update();}
 preset.onchange=function(){C.preset=preset.value;o=initial(C.preset);den.value=o.d;emit('preset',C.preset);update();};den.onchange=function(){o=state(Math.min(o.n,+den.value),+den.value,o.k);emit('denominator',o.d);update();};
 var less=H('button',{class:'nova-btn',text:'−','aria-label':'Remove one shaded original part'}),more=H('button',{class:'nova-btn',text:'+','aria-label':'Shade one more original part'}),facLess=H('button',{class:'nova-btn',text:'×−','aria-label':'Decrease subdivision factor'}),facMore=H('button',{class:'nova-btn',text:'×+','aria-label':'Increase subdivision factor'});
 less.onclick=function(){shade(Math.max(0,o.n-1));};more.onclick=function(){shade(Math.min(o.d,o.n+1));};facLess.onclick=function(){setFactor(Math.max(2,o.k-1),'button');};facMore.onclick=function(){setFactor(Math.min(4,o.k+1),'button');};
 var reset=H('button',{class:'nova-btn ghost',text:'Reset',onclick:function(){o=initial(C.preset);den.value=o.d;emit('reset',true);update();}});
 panel.appendChild(H('div',{class:'eq-controls'},[H('label',{text:'Preset'}),preset,H('label',{text:'Original divisions'}),den]));
 panel.appendChild(H('div',{class:'eq-controls'},[H('label',{text:'Shade parts'}),less,more,H('label',{text:'Split factor'}),facLess,facMore,reset]));panel.appendChild(status);
 panel.appendChild(H('p',{class:'eq-msg',text:'Drag the multiplier grip to ×2, ×3 or ×4, or focus it and use arrow keys. Click an original part to change the shaded length.'}));
 C._explore={get:function(){return {...o};},set:function(n,d,k){o=state(n,d,k);den.value=o.d;update();},setFactor:setFactor,shade:shade};update();
}
function challenge(panel,api,stage){var tasks=[
 {n:1,d:2,k:3,question:'One half is refined into sixths. Choose the split factor, then enter the number of shaded sixths.',hint:'Two original equal parts must become six equal parts.'},
 {n:3,d:4,k:4,question:'Three quarters is refined into sixteenths. Choose the split factor and enter the number shaded.',hint:'Four equal parts must become sixteen equal parts.'},
 {n:2,d:5,k:2,question:'Two fifths is refined into tenths. Choose the split factor and enter the number shaded.',hint:'Each fifth needs to become two smaller equal parts.'}
 ],ix=0,wrong=0,o=state(0,2,2),question=H('p',{class:'eq-msg'}),status=H('p',{class:'eq-msg',role:'status','aria-live':'polite'}),peer=H('img',{src:N.helperImg('read-tablet','teen').src,alt:N.helperImg('read-tablet','teen').alt}),peerText=H('span',{text:'Izaac is checking the refined model.'}),answer=H('input',{class:'nova-input eq-input',type:'number',min:'0',step:'1','aria-label':'Number of shaded refined parts'}),check=H('button',{class:'nova-btn primary',text:'Check answer'}),hint=H('button',{class:'nova-btn ghost',text:'Hint'});
 function peerPose(k,msg){var art=N.helperImg(k,'teen');peer.src=art.src;peer.alt=art.alt;peerText.textContent=msg;}
 function repaint(){renderScene(stage,o,{name:'Challenge · prove equivalence',phase:'result',interactive:true,hide:true,pose:'think',caption:'Count the refined shaded pieces',onFactor:function(k,kind){o.k=k;emit(kind==='drag'?'factorDrag':'factor',k);repaint();if(kind==='keyboard'){var g=stage.querySelector('[data-factor-handle]');if(g)g.focus();}}});}
 function load(){var t=tasks[ix];o=state(t.n,t.d,2);wrong=0;question.textContent='Challenge '+(ix+1)+' of 3 · '+t.question;status.textContent='Move the multiplier handle and enter the shaded count.';answer.value='';peerPose('read-tablet','Izaac is following your model.');api.fb.textContent='';repaint();}
 check.onclick=function(){var t=tasks[ix],v=answer.value.trim(),ok=o.k===t.k&&v!==''&&Number(v)===t.n*t.k;api.check(ok,ok?'Correct. Both counts scale by '+t.k+' while the whole stays fixed.':'Not yet. Both the subdivision and shaded count must be right.',{task:ix});
 if(ok){peerPose(ix===2?'victory':'proud','You proved the fractions are equivalent.');status.textContent=ix===2?'All three challenges completed.':'Correct. Next example loading…';if(ix<2)M.delay(650,function(){ix++;load();});else check.disabled=true;}
 else {wrong++;peerPose(wrong>=2?'worried':'read-tablet','Look at the smaller equal parts.');status.textContent='Check the factor and count only the shaded lower pieces.';}};
 hint.onclick=function(){var h=tasks[ix].hint;api.hint(h);peerPose('idea','Izaac has a clue.');status.textContent=h;};
 panel.appendChild(question);panel.appendChild(H('div',{class:'eq-controls'},[H('label',{text:'Shaded pieces'}),answer,check,hint]));panel.appendChild(status);panel.appendChild(H('div',{class:'eq-peer'},[peer,peerText]));
 C._challenge={task:function(){return ix;},set:function(k,n){o.k=k;answer.value=String(n);repaint();},get:function(){return {...o,answer:answer.value};}};load();
}
var DEF={id:ID,title:'Equivalent fractions · Precision Splitter',config:C,steps:steps,render:guided,explore:explore,challenge:challenge,
 alt:'Two fixed-length premium glass fraction strips. The upper shows original equal partitions and the lower each original part split into k smaller pieces. A vertical guide proves that the shaded endpoints remain aligned.',
 staticAlt:'One half equals two quarters, two thirds equals six ninths, and three quarters equals twelve sixteenths. Numerator and denominator scale together by the same non-zero factor.',
 exploreIntro:'Choose an original fraction then move the multiplier handle. The smaller pieces multiply, but the shaded fraction of the unchanged whole does not.'};
N.registry.add({id:ID,title:DEF.title,family:'F5',topics:['equivalent fractions','fraction wall','multiply numerator denominator'],deps:['F0-02','F0-03','F0-04','F0-05','F5-01']});
N.bankMount({id:ID,num:'F5·05',title:DEF.title,def:DEF,years:'KS3 Years 7–9',linked:['F5-01','F5-02','F5-04','F5-06'],
 spec:{purpose:'Visual proof n/d = (n×k)/(d×k) by keeping the whole and shaded endpoint fixed while dividing every original part equally.',
 params:'Original numerator 0–d, denominator 2–6, split factor ×2/×3/×4. Both strips exactly share x, width and unit length.',
 presets:'One half, three quarters, two thirds, three fifths, five sixths, zero and a whole.',
 steps:'One whole → same-size second whole → divide every original part → count shaded refined parts → multiply by three → generalise multiplying numerator and denominator by k.',
 interactions:'Explore drags the factor handle through NOVA.ui.svgDrag, keyboard Arrow/Home/End, click original parts, denominator and presets; 3 Challenge tasks combine factor selection and shaded count.',
 traps:'Multiplying only numerator, changing the whole during split, taking more pieces to mean more amount, over-counting unshaded pieces.',
 gcse:'Equivalent fractions are the foundation for rational algebra, fraction operations and proportional reasoning. Native NOVA motion, geometry, helpers and stacked Chalk notation are used.'}});
var log=document.getElementById('log');function logIt(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,4000);}N.events.history().forEach(logIt);N.events.on('*',logIt);document.getElementById('clearlog').onclick=function(){log.textContent='';};
})();
