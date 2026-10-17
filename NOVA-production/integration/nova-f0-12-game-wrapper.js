window.NovaF012WrapperFactory=function(w){const NOVA=w.NOVA,h=NOVA.h;
function hud(stage,s,o){o=o||{};var hd=h('div',{class:'gw-hud'});var lv=h('span',{class:'gw-lives'});if(s.maxLives){for(var i=0;i<s.maxLives;i++)lv.appendChild(h('span',{class:i<s.lives?'on':'off',text:i<s.lives?'\u2665':'\u2661'}));}else lv.textContent='\u221E';
  [['Round',Math.min(s.round,s.rounds)+'/'+s.rounds,'round'],['Score',String(s.score),'score'],['Lives',lv,'lives'],['Streak',(s.streak>=2?'\u26A1':'')+s.streak,'streak']].forEach(function(c){hd.appendChild(h('div',{class:o.hl===c[2]?'hl':'','data-maths':o.hl===c[2]?c[2]:null},[h('small',{text:c[0]}),c[1]]));});stage.appendChild(hd);}
function qcard(stage,q,ans,state){stage.appendChild(h('div',{class:'gw-q'},[h('div',{class:'p'},[h('small',{text:'Question'}),q?q.p:'—']),h('div',{class:'a'+(state?' '+state:''),'data-maths':state?'ans':null,text:ans!=null?String(ans):'?'})]));}
function pts(stage,t,minus){stage.appendChild(h('div',{class:'gw-pts'+(minus?' minus':''),'aria-live':'polite',text:t||''}));}
function results(stage,r,stars){var st=h('span',{class:'gw-stars','aria-label':r.stars+' of 3 stars'});for(var i=0;i<3;i++)st.appendChild(h('span',{class:i<r.stars?'on':'off',text:i<r.stars?'\u2605':'\u2606'}));
  stage.appendChild(h('div',{class:'gw-res','data-maths':'res'},[h('div',{},[h('b',{text:String(r.score)}),'score']),h('div',{},[h('b',{text:r.correct+'/'+r.played}),r.pct+'% correct']),h('div',{},[st,h('div',{text:'stars at '+stars.join(' / ')+'%'})]),h('div',{},[h('b',{text:String(r.best)}),'best streak'])]));}

function createGame(o){o=Object.assign({engine:'game',rounds:5,lives:3,base:10,streakBonus:5,hintCost:5,stars:[50,70,90]},o||{});if(!Number.isInteger(o.rounds)||o.rounds<1||o.rounds>1000)throw Error('Game rounds must be an integer 1 to 1000');if(!Number.isInteger(o.lives)||o.lives<0||o.lives>99)throw Error('Game lives must be an integer 0 to 99');['base','streakBonus','hintCost'].forEach(function(k){if(!Number.isFinite(o[k])||o[k]<0)throw Error('Game '+k+' must be finite and non-negative');});if(!Array.isArray(o.stars)||o.stars.length!==3||o.stars.some(function(v,i){return !Number.isFinite(v)||v<0||v>100||(i&&v<=o.stars[i-1]);}))throw Error('Game star thresholds must increase from 0 to 100');
  var s;function reset(){s={round:1,score:0,lives:o.lives,streak:0,best:0,correct:0,hints:0,over:false,log:[]};return s;}reset();
  function emit(k){NOVA.events.emit('value',{engine:o.engine,key:'game',action:k,value:{round:s.round,score:s.score,lives:s.lives,streak:s.streak,over:s.over}});}
  function end(){if(s.round>o.rounds||(o.lives&&s.lives<=0))s.over=true;}
  var g={opts:o,reset:function(){reset();emit('reset');return g;},state:function(){return Object.assign({},s,{rounds:o.rounds,maxLives:o.lives});},
    points:function(ok,streak){return ok?o.base+(streak>=2?o.streakBonus:0):0;},
    answer:function(ok){if(s.over)return g.state();if(ok){s.streak++;s.best=Math.max(s.best,s.streak);s.correct++;var p=g.points(true,s.streak);s.score+=p;s.log.push({round:s.round,ok:true,points:p});}
      else{s.streak=0;if(o.lives)s.lives--;s.log.push({round:s.round,ok:false,points:0});}if(ok||!o.retryWrong)s.round++;end();emit(ok?'right':'wrong');return g.state();},
    hint:function(){if(s.over)return g.state();s.hints++;s.score=Math.max(0,s.score-o.hintCost);emit('hint');return g.state();},
    results:function(){var pct=Math.round(s.correct/Math.max(1,Math.min(o.rounds,s.log.length||1))*100),st=o.stars.filter(function(t){return pct>=t;}).length;return {score:s.score,correct:s.correct,played:s.log.length,pct:pct,stars:st,best:s.best,hints:s.hints,livesLeft:s.lives};}};
  return g;}
return {id:"F0-12",hud,qcard,pts,results,createGame};};
