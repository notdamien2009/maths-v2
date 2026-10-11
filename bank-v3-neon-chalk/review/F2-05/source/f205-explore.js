 exploreIntro:'Ten beads make one. Tap tiles to build!',
 explore:function(panel,stage,api){
   var P0=C.presets[C.preset],view=P0.view,st={c:clone(P0.c||{}),g:clone(P0.g||{})},w,sp,teach,activeRod=0;
   var history=[],hpos=-1,lastBefore=null,lastAction=null,doingReplay=false,previewOnce=false;
   function snap(){return {view:view,c:clone(st.c),g:clone(st.g)};}
   function loadState(s){view=s.view;st={c:clone(s.c),g:clone(s.g)};}
   function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
   function keep(){var s=snap();if(hpos>=0&&eq(s,history[hpos]))return;history=history.slice(0,hpos+1);history.push(s);if(history.length>90)history.shift();hpos=history.length-1;sync();}
   function canWork(){return w&&!w.dead&&!(w.busy&&w.busy());}
   function pauseReset(){if(EDU.active)EDU.active.stop();EDU.paused=false;pauseBtn.textContent='Pause motion';}
   function explain(phrase,reason,before){if(!teach)return;teach.update();teach.tell(phrase);teach.justify(reason||'A bead is worth the place value of the rod it rests on.');
     if(before)teach.compare(before,'Before: '+fmt(contrib(before,view).value)+' · After: '+fmt(contrib(st,view).value));}
   function chips(){if(sp&&sp.parentNode)sp.parentNode.removeChild(sp);sp=viewChips(stage,view,st);}
   function before(type,p){lastBefore=snap();lastAction={type:type,p:p,before:snap()};}
   function changed(){chips();if(teach)teach.update();keep();sync();}
   function phase(type,p,name,message){if(!teach)return;if(name==='complete'){explain(message,type==='exchange'?mathExchange(p):mathBreak(p),lastBefore);}else{teach.tell(message);teach.justify(type==='exchange'?mathExchange(p):mathBreak(p));}sync();}
   function error(msg,p){if(teach){teach.tell(msg);teach.justify(msg);}var svg=stage.querySelector('svg');if(svg&&p!=null)M.flash(svg,rx(p),TOP+45,PC(p),26);}
   function picked(p,d,removed){var reason='In the '+placeName(p)+' row, the '+d+' tile represents '+tv(p,d)+'.';
     explain(removed?'Removed '+tv(p,d)+' from the number.':'Added the '+tv(p,d)+' tile to the number.',reason,lastBefore);
     var svg=stage.querySelector('svg'),sum=svg&&svg.querySelector('[data-sum]');if(sum){M.flash(svg,300,svg.viewBox.baseVal.height-48,'#75f5c9',28);M.pop(sum,300,svg.viewBox.baseVal.height-48);}
   }
   function build(){stage.innerHTML='';NOVA.cap(stage,'Explore · '+(view==='abacus'?'abacus':'Gattegno chart'),'live');
     var opts={interactive:true,onBefore:before,onChange:changed,onError:error,onPhase:phase,onPick:picked};
     w=view==='abacus'?new Abacus(stage,st,opts):new Gattegno(stage,st,opts);
     stage.appendChild(NOVA.placeKey(view==='abacus'?RD:RW));chips();teach=teaching(stage,st,view);
     NOVA.scene.helperStrip(stage,'explain',view==='abacus'?'One place at a time':'Tap to build');
     C._explore={get:function(){return view==='abacus'?totalA(st.c):totalG(st.g);},state:function(){return st;},view:function(){return view;},w:function(){return w;},teaching:function(){return teach.view();},motion:function(){return EDU;},history:function(){return history;},phase:function(){return stage.querySelector('[data-f205-badge]')?.textContent||'';}};
     sync();
   }
   function load(k){pauseReset();var P=C.presets[k];view=P.view;st={c:clone(P.c||{}),g:clone(P.g||{})};history=[];hpos=-1;lastBefore=null;lastAction=null;keep();build();
     teach.tell(view==='abacus'?'Each bead is worth one unit of its rod. Find the total first.':'Choose one tile in each place-value row. The selected contributions combine into one number.');
     if(P.op)teach.tell('Begin with '+fmt(totalG(st.g))+'. Predict how its tiles will move for × 10, then press the button.');
   }
   function action(fn,msg,reason){if(!canWork())return;var old=snap();lastBefore=old;var result=fn();if(result===false)return;w.redraw();chips();keep();explain(msg,reason,old);sync();NOVA.events.emit('value',{engine:'F2-05',control:'explore',value:view==='abacus'?totalA(st.c):totalG(st.g)});
     if(view==='abacus'&&C.autoExchange){var p=RD.filter(function(k){return k<2&&get(st.c,k)>=10;})[0];if(p!==undefined)hold(320,function(){if(canWork())w.exchange(p);});}
   }
   function changeView(v){if(!canWork())return;pauseReset();view=v;lastAction=null;lastBefore=null;keep();build();teach.tell(v==='abacus'?'Look at each rod; ten beads can exchange for one bead in the next rod.':'Pick a tile in each place row. Read the expanded equation as the number builds.');}
   function B(t,fn,cls){return h('button',{class:'nova-btn'+(cls?' '+cls:''),text:t,onclick:fn});}
   var pre=h('select',{class:'nova-input','aria-label':'Starting example'});Object.keys(C.presets).forEach(function(k){pre.appendChild(h('option',{value:k,text:C.presets[k].label}));});pre.value=C.preset;pre.onchange=function(){load(pre.value);};
   var ab=B('Abacus',function(){changeView('abacus');}),gb=B('Gattegno',function(){changeView('gattegno');});
   var rods=h('select',{class:'nova-input','aria-label':'Choose rod'});RD.forEach(function(p){rods.appendChild(h('option',{value:p,text:placeName(p)}));});rods.value=String(activeRod);rods.onchange=function(){activeRod=+rods.value;if(teach)teach.tell(placeName(activeRod)+' rod: one bead is '+valueAt(activeRod)+'.');sync();};
   var add=B('+ bead',function(){action(function(){if(get(st.c,activeRod)>=12){error('This rod is full. Exchange ten beads into the next rod first.',activeRod);return false;}st.c[activeRod]=get(st.c,activeRod)+1;},'Added one bead to the '+placeName(activeRod)+' rod.','That one bead increases the number by '+valueAt(activeRod)+'.');});
   var subtract=B('− bead',function(){action(function(){if(!get(st.c,activeRod)){error('There are no beads to remove from this rod.',activeRod);return false;}st.c[activeRod]--;},'Removed one '+placeName(activeRod)+' bead.','Removing one bead decreases the number by '+valueAt(activeRod)+'.');});
   var exchange=B('Exchange 10 → 1',function(){if(canWork())w.exchange(activeRod);},'primary');
   var br=B('Break 1 → 10',function(){if(canWork())w.breakOne(activeRod);});
   var rodReset=B('Reset rod',function(){action(function(){if(!get(st.c,activeRod))return false;st.c[activeRod]=0;},'Cleared the '+placeName(activeRod)+' rod.','Only this rod was reset; the other places did not change.');},'ghost');
   var auto=h('input',{type:'checkbox','aria-label':'Automatically exchange ten beads'});auto.checked=C.autoExchange;auto.onchange=function(){C.autoExchange=auto.checked;if(C.autoExchange&&canWork()){var p=RD.filter(function(k){return k<2&&get(st.c,k)>=10;})[0];if(p!==undefined)w.exchange(p);}};
   var shiftUp=B('× 10',function(){if(canWork())w.shift(1,function(ok){if(!ok)error('A chosen tile would leave the chart. Clear a top row first.');});},'primary');
   var shiftDown=B('÷ 10',function(){if(canWork())w.shift(-1,function(ok){if(!ok)error('A chosen tile would leave the chart. Clear a bottom row first.');});});
   var clear=B('Clear view',function(){action(function(){if(view==='abacus')st.c={};else st.g={};},'Cleared the '+(view==='abacus'?'abacus':'Gattegno chart')+'.','Each place is now empty, so the number represented is zero.');},'ghost');
   var undo=B('↶ Undo',function(){if(!canWork()||hpos<=0)return;pauseReset();var previous=snap();hpos--;loadState(history[hpos]);build();explain('Restored the previous arrangement. Read each contribution again.','Undo reverses the last change in bead or tile representation.',previous);},'ghost');
   var redo=B('↷ Redo',function(){if(!canWork()||hpos>=history.length-1)return;pauseReset();var previous=snap();hpos++;loadState(history[hpos]);build();explain('Restored the next arrangement. The total has been recalculated.','Redo reapplies the representation change.',previous);},'ghost');
   var pauseBtn=B('Pause motion',function(){EDU.paused=!EDU.paused;pauseBtn.textContent=EDU.paused?'Play motion':'Pause motion';},'ghost');
   var step=B('Step phase',function(){if(EDU.active){EDU.paused=true;pauseBtn.textContent='Play motion';EDU.active.skip();}else if(teach)teach.tell('Choose Exchange, Break, or × 10, then step through its phases.');},'ghost');
   var replay=B('Replay last exchange',function(){if(!lastAction||!canWork())return;var data=clone(lastAction);pauseReset();loadState(data.before);build();lastAction=null;
     if(data.type==='exchange')w.exchange(data.p);else if(data.type==='break')w.breakOne(data.p);else if(data.type==='shift')w.shift(data.p);
   },'ghost');
   var speed=h('select',{class:'nova-input','aria-label':'Animation speed'});[.5,1,2].forEach(function(v){speed.appendChild(h('option',{value:v,text:v+'×'}));});speed.value='1';speed.onchange=function(){EDU.speed=+speed.value;teach.tell('Movement speed is '+EDU.speed+'×. Pause or step to inspect the maths.');};
   function sync(){if(!w)return;ab.classList.toggle('primary',view==='abacus');gb.classList.toggle('primary',view==='gattegno');var show=view==='abacus';
     abRow.hidden=autoRow.hidden=!show;gatRow.hidden=show;
     var n=get(st.c,activeRod);exchange.disabled=!show||activeRod>=2||n<10; br.disabled=!show||activeRod<=-2||n<=0||get(st.c,activeRod-1)>2;
     add.disabled=!show||n>=12;subtract.disabled=!show||n<1;rodReset.disabled=!show||n<1;
     undo.disabled=hpos<=0;redo.disabled=hpos>=history.length-1;
   }
   var abRow=h('div',{class:'f205-actions'},[h('label',{class:'f205-select'},['Rod ',rods]),add,subtract,exchange,br,rodReset]);
   var autoRow=h('label',{class:'pr-row'},[auto,' Exchange automatically when ten beads appear']);
   var gatRow=h('div',{class:'f205-actions'},[shiftUp,shiftDown]);
   panel.appendChild(h('label',{class:'pr-row'},['Start ',pre]));panel.appendChild(h('div',{class:'f205-actions'},[ab,gb]));
   panel.appendChild(abRow);panel.appendChild(autoRow);panel.appendChild(gatRow);
   panel.appendChild(h('div',{class:'f205-actions'},[undo,redo,clear]));
   panel.appendChild(h('div',{class:'f205-actions'},[pauseBtn,step,replay,h('label',{class:'f205-select'},['Speed ',speed])]));
   panel.appendChild(h('div',{class:'f205-activenote',text:'Abacus: drag top beads, tap a rod then press +, −, E, B, or reset one rod. Gattegno: tap or drag a tile; arrows and Enter also work.'}));
   load(C.preset);
 },
