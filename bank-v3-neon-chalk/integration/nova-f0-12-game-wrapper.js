window.NovaF012WrapperFactory=function(w){const NOVA=w.NOVA,h=NOVA.h;
function hud(stage,s,o){o=o||{};var hd=h('div',{class:'gw-hud'});var lv=h('span',{class:'gw-lives'});if(s.maxLives){for(var i=0;i<s.maxLives;i++)lv.appendChild(h('span',{class:i<s.lives?'on':'off',text:i<s.lives?'\u2665':'\u2661'}));}else lv.textContent='\u221E';
  [['Round',Math.min(s.round,s.rounds)+'/'+s.rounds,'round'],['Score',String(s.score),'score'],['Lives',lv,'lives'],['Streak',(s.streak>=2?'\u26A1':'')+s.streak,'streak']].forEach(function(c){hd.appendChild(h('div',{class:o.hl===c[2]?'hl':'','data-maths':o.hl===c[2]?c[2]:null},[h('small',{text:c[0]}),c[1]]));});stage.appendChild(hd);}
function qcard(stage,q,ans,state){stage.appendChild(h('div',{class:'gw-q'},[h('div',{class:'p'},[h('small',{text:'Question'}),q?q.p:'—']),h('div',{class:'a'+(state?' '+state:''),'data-maths':state?'ans':null,text:ans!=null?String(ans):'?'})]));}
function pts(stage,t,minus){stage.appendChild(h('div',{class:'gw-pts'+(minus?' minus':''),'aria-live':'polite',text:t||''}));}
function results(stage,r,stars){var st=h('span',{class:'gw-stars','aria-label':r.stars+' of 3 stars'});for(var i=0;i<3;i++)st.appendChild(h('span',{class:i<r.stars?'on':'off',text:i<r.stars?'\u2605':'\u2606'}));
  stage.appendChild(h('div',{class:'gw-res','data-maths':'res'},[h('div',{},[h('b',{text:String(r.score)}),'score']),h('div',{},[h('b',{text:r.correct+'/'+r.played}),r.pct+'% correct']),h('div',{},[st,h('div',{text:'stars at '+stars.join(' / ')+'%'})]),h('div',{},[h('b',{text:String(r.best)}),'best streak'])]));}

return {id:"F0-12",hud,qcard,pts,results};};
