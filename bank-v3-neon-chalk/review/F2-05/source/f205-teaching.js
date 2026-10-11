/* F2-05 premium: teaching orchestration; no external dependencies or artwork changes. */
var EDU={speed:1,paused:false,active:null};
function paced(ms,frame,ease,done){
  ease=ease||M.ease.inOut;
  if(NOVA.reducedMotion()){frame(1,1);EDU.active=null;if(done)done();return;}
  var t0=null,p=0,closed=false,raf=0;
  var task={skip:function(){if(closed)return;p=1;frame(1,1);finish();},stop:function(){if(closed)return;closed=true;cancelAnimationFrame(raf);if(EDU.active===task)EDU.active=null;}};
  function finish(){if(closed)return;task.stop();if(done)done();}
  function tick(t){if(closed)return;if(t0===null)t0=t;var delta=Math.min(100,t-t0);t0=t;
    if(!EDU.paused){p=Math.min(1,p+delta*EDU.speed/Math.max(ms,1));frame(ease(p),p);}
    if(p>=1)finish();else raf=requestAnimationFrame(tick);
  }
  EDU.active=task;raf=requestAnimationFrame(tick);return task;
}
function hold(ms,done){return paced(ms,function(){},function(t){return t;},done);}
function placeName(p){return NOVA.place[p]?NOVA.place[p].name:('10^'+p);}
function valueAt(p){return fmt(Math.pow(10,p));}
function beadWorth(p,n){return fmt(n*Math.pow(10,p));}
function contrib(st,view){var table=view==='abacus'?st.c:st.g,places=view==='abacus'?RD:RW;
  var parts=places.filter(function(p){return get(table,p)>0;}).map(function(p){return {p:+p,n:get(table,p),value:beadWorth(p,get(table,p)),text:view==='abacus'?get(table,p)+' × '+valueAt(p):beadWorth(p,get(table,p))};});
  return {parts:parts,value:view==='abacus'?totalA(table):totalG(table),eq:parts.length?parts.map(function(q){return q.text;}).join(' + ')+' = '+fmt(view==='abacus'?totalA(table):totalG(table)):'0 = 0'};
}
function mathExchange(p){return '10 × '+valueAt(p)+' = 1 × '+valueAt(p+1)+' = '+beadWorth(p,10);}
function mathBreak(p){return '1 × '+valueAt(p)+' = 10 × '+valueAt(p-1)+' = '+valueAt(p);}
function phaseBadge(sv,p,label){
  if(!sv)return;[].slice.call(sv.querySelectorAll('[data-f205-badge]')).forEach(function(x){x.remove();});
  if(!label)return;var b=S.el('g',{'data-f205-badge':1},sv);S.pill(b,300,23,label,{role:'focus',size:13});return b;
}
function teaching(stage,st,view){
  var root=h('section',{class:'f205-teaching','aria-label':'Explanation of place values'}),head=h('div',{class:'f205-head'});
  var name=h('span',{class:'f205-eyebrow',text:'READ THE RODS · PROVE THE VALUE'});
  var numeric=h('span',{class:'f205-total','data-f205-total':1,text:'0'}),totalLabel=h('div',{class:'f205-value-label',text:'Value of this representation'});
  var line=h('div',{class:'f205-equation','data-f205-equation':1}),contributions=h('div',{class:'f205-contributions','data-f205-contrib':1});
  var caption=h('p',{class:'f205-caption',role:'status','aria-live':'polite',text:'Look at each place. Each bead has that rod’s value.'});
  var tools=h('div',{class:'f205-teachtools'}),why=h('div',{class:'f205-detail',hidden:true}),compare=h('div',{class:'f205-comparison',hidden:true});
  var explain='Each place is ten times the value of the place to its right.';
  var show=true,guided=true,progress=0;
  function btn(label,fn){return h('button',{class:'nova-btn ghost',text:label,onclick:fn});}
  var valBtn=btn('Show value: on',function(){show=!show;valBtn.textContent='Show value: '+(show?'on':'off');valBtn.setAttribute('aria-pressed',String(show));numeric.hidden=!show;totalLabel.hidden=!show;});
  var whyBtn=btn('Why?',function(){why.hidden=!why.hidden;whyBtn.setAttribute('aria-expanded',String(!why.hidden));});
  var cmpBtn=btn('Before / after',function(){compare.hidden=!compare.hidden;cmpBtn.setAttribute('aria-expanded',String(!compare.hidden));});
  var guideBtn=btn('Guidance: on',function(){guided=!guided;caption.hidden=!guided;guideBtn.textContent='Guidance: '+(guided?'on':'off');guideBtn.setAttribute('aria-pressed',String(guided));});
  whyBtn.setAttribute('aria-expanded','false');cmpBtn.setAttribute('aria-expanded','false');valBtn.setAttribute('aria-pressed','true');guideBtn.setAttribute('aria-pressed','true');
  head.appendChild(name);head.appendChild(h('div',{class:'f205-value-wrap'},[totalLabel,numeric]));root.appendChild(head);
  root.appendChild(contributions);root.appendChild(line);root.appendChild(caption);
  [valBtn,whyBtn,cmpBtn,guideBtn].forEach(function(b){tools.appendChild(b);});root.appendChild(tools);root.appendChild(why);root.appendChild(compare);stage.appendChild(root);
  function setView(v){view=v;name.textContent=v==='abacus'?'ABACUS · VALUE OF EACH ROD':'GATTEGNO · VALUE OF EACH TILE';update();}
  function update(){var e=contrib(st,view);numeric.textContent=fmt(e.value);line.textContent=e.eq;contributions.textContent=e.parts.length?e.parts.map(function(q){return placeName(q.p)+': '+(view==='abacus'?q.n+' bead'+(q.n===1?'':'s')+' → ':'')+q.value;}).join('   ·   '):'No beads or tiles selected yet';}
  function tell(message){caption.textContent=message;progress++;if(progress>=5&&guided){caption.textContent=message;}}
  function justify(message){explain=message;why.textContent=message;}
  function showCompare(before,reason){if(!before)return;var a=contrib(before,view),b=contrib(st,view);compare.innerHTML='';compare.appendChild(h('div',{class:'f205-comparecol'},[h('strong',{text:'BEFORE'}),h('div',{text:a.eq})]));compare.appendChild(h('div',{class:'f205-comparecol'},[h('strong',{text:'AFTER'}),h('div',{text:b.eq})]));compare.appendChild(h('div',{class:'f205-same',text:reason||('Value: '+fmt(a.value)+' → '+fmt(b.value))}));}
  setView(view);justify(explain);return {update:update,tell:tell,justify:justify,compare:showCompare,setView:setView,view:function(){return {value:numeric.textContent,expression:line.textContent,caption:caption.textContent,why:why.textContent};}};
}
