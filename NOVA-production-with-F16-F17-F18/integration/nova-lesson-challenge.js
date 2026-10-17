/* Canonical F0-12 lesson controller; embedded verbatim in the approved template. */
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
window.NovaLessonChallenge=function(w,panel,api,stage,C,records){
 const n=w.NOVA,d=w.document,engineId=records[0].source,F0=window.NovaF012WrapperFactory(w);w.NovaGameWrapper=F0;function nativeNode(method,...args){const holder=d.createElement("div");F0[method](holder,...args);return holder.firstElementChild;}function paint(i){w.NovaNative.renderRecord({...records[i],concealAnswers:true},stage,false);}
 function buildMission(){return records.map(r=>({q:r.prompt,hint:r.hint,build:function(ctl){
   if(r.answerType==='choice')return n.choiceTask(r.choices,engineId)(ctl);
   n.entryTask('Your answer',engineId)(ctl);return ()=>{const raw=String(ctl._A.input.value).trim();return raw;};
 },check:v=>{const ok=window.NovaLessonMarkAnswer(v,r);return [ok,ok?(r.correctFeedback||'Correct. Well done.'):r.wrongFeedback];},solve:ctl=>{if(r.answerType==='choice')ctl._G.set(r.privateAnswer);else ctl._A.input.value=r.privateAnswer;}}));}
  const gameOptions={lives:0,base:10,streakBonus:5,hintCost:5,stars:[50,70,90],...(C.lessonGame||{})};
  const session=C.__lessonProgress||(C.__lessonProgress={index:0,game:F0.createGame({engine:engineId+'-'+DATA.meta.curriculumCode,...gameOptions,rounds:records.length,retryWrong:true})});const game=session.game;
  let index=session.index,locked=false,finished=false,started=false,retries=0;let tasks=buildMission();
  panel.replaceChildren();
  // F0-12 CANONICAL VISUAL STRUCTURE: HUD > QUESTION > POINTS > RESULTS.
  // The original F0-12 scoring engine controls every value and award.
  const wrap=d.createElement('div');wrap.className='f012-game-host';
  const heading=d.createElement('div');heading.className='f012-game-caption';heading.textContent='Game · '+(C.lessonChallengeTitle||'Concept challenge');
  let metrics=nativeNode('hud',game.state());
  let question=nativeNode('qcard',{p:records[index]?.prompt||''},null,null);
  const feedback=nativeNode('pts','',false);
  const control=d.createElement('div');control.className='f012-game-controls';
  const actions=d.createElement('div');actions.className='pr-row';
  const check=d.createElement('button');check.className='nova-btn primary';check.textContent='Check answer';
  const hint=d.createElement('button');hint.className='nova-btn ghost';hint.textContent='Hint (−'+gameOptions.hintCost+' points)';
  const next=d.createElement('button');next.className='nova-btn primary';next.textContent='Next round →';next.hidden=true;
  const restart=d.createElement('button');restart.className='nova-btn ghost';restart.textContent='New game';restart.hidden=true;
  let finish=nativeNode('results',game.results(),gameOptions.stars);finish.hidden=true;
  const chartArea=d.createElement('div');chartArea.className='f012-chart-area';chartArea.style.margin='20px 0';
  actions.append(check,hint,next,restart);wrap.append(heading,metrics,question,chartArea,feedback,control,actions,finish);
  panel.replaceChildren();
  let get=null;
  function renderStats(){const nextMetrics=nativeNode('hud',game.state());metrics.replaceWith(nextMetrics);metrics=nextMetrics;}
  function placeAtTop(){
    // Keep the original chart between the question and answer controls.
    // Move existing DOM nodes only: preserve the V2 drawing and event handlers.
    const visualNodes=Array.from(api.stage.childNodes).filter(node=>node!==wrap&&!(node.nodeType===1&&node.matches('.nv-dock')));
    if(visualNodes.length)chartArea.replaceChildren(...visualNodes);
    api.stage.prepend(wrap);
  }
  function draw(){
    if(index>=tasks.length)return end();
    const task=tasks[index];locked=false;next.hidden=true;check.hidden=false;hint.hidden=false;
    api.fb.className='nova-fb';api.fb.textContent='';
    feedback.textContent='';feedback.className='gw-pts';
    const nextQuestion=nativeNode('qcard',{p:task.q},null,null);nextQuestion.querySelector('small').textContent='Question '+(index+1)+' of '+tasks.length;question.replaceWith(nextQuestion);question=nextQuestion;
    control.replaceChildren();get=task.build(control);
    paint(index);placeAtTop();renderStats();
  }
  function showVictory(r){
    // Celebration is lesson UI only. Maths artwork and the F0-12 game wrapper stay canonical.
    document.querySelector('#nova-lesson-victory')?.remove();
    const overlay=document.createElement('div');overlay.id='nova-lesson-victory';overlay.className='nova-victory-overlay';
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','Congratulations, challenge complete');
    const pieces=document.createElement('div');pieces.className='nova-victory-confetti';pieces.setAttribute('aria-hidden','true');
    const colours=['#2bdcf3','#ffcc58','#4fe2a1','#ff873d','#8b6bf1','#ff6577','#367dff'];
    if(!w.matchMedia('(prefers-reduced-motion: reduce)').matches){
      for(let i=0;i<220;i++){
        const piece=document.createElement('i');piece.className='nova-confetti-piece';
        piece.style.setProperty('--left',((i*61+Math.random()*31)%100)+'%');
        piece.style.setProperty('--delay',(Math.random()*1.5)+'s');
        piece.style.setProperty('--duration',(2.8+Math.random()*2.4)+'s');
        piece.style.setProperty('--drift',(-110+Math.random()*220)+'px');
        piece.style.background=colours[i%colours.length];pieces.appendChild(piece);
      }
    }
    const sticker=document.createElement('div');sticker.className='nova-victory-sticker';
    const medal=document.createElement('div');medal.className='nova-victory-medal';medal.textContent='★';
    const label=document.createElement('div');label.className='nova-victory-heading';label.textContent='CONGRATULATIONS!';
    const title=document.createElement('div');title.className='nova-victory-title';title.textContent=C.lessonBadgeTitle||'CHALLENGE CHAMPION';
    const detail=document.createElement('p');detail.textContent=r.correct+' of '+tasks.length+' correct · '+r.score+' points · '+r.stars+' stars';
    const close=document.createElement('button');close.type='button';close.className='nova-btn primary';close.textContent='Collect my sticker ✓';
    close.onclick=()=>overlay.remove();
    sticker.append(medal,label,title,detail,close);overlay.append(pieces,sticker);document.body.append(overlay);
    close.focus();
  }
  function end(){
    finished=true;check.hidden=true;hint.hidden=true;next.hidden=true;restart.hidden=false;
    const r=game.results(),passed=r.correct===tasks.length;
    const nextFinish=nativeNode('results',r,gameOptions.stars);finish.replaceWith(nextFinish);finish=nextFinish;finish.hidden=false;
    feedback.textContent=passed?'Challenge complete! Well played.':'Game over — try again to improve your result.';
    renderStats();placeAtTop();
    if(passed){if(!session.celebrated){session.celebrated=true;n.fx.burst(api.stage);showVictory(r);}n.events.emit('value',{engine:engineId,key:'lessonChallengeComplete',value:{rounds:tasks.length,correct:r.correct,score:r.score,stars:r.stars}});}
  }
  let advanceTimer=null;
  if(typeof api.onCleanup==='function')api.onCleanup(()=>{clearTimeout(advanceTimer);finished=true;document.querySelector('#nova-lesson-victory')?.remove();});
  function proceed(){
    if(index>=tasks.length||game.state().over)end();else draw();
  }
  check.onclick=()=>{
    if(locked||finished)return;
    const t=tasks[index],result=t.check(get?get():null);
    const answerCard=question.querySelector('.a');answerCard.textContent=String(get?get():'?');answerCard.className='a '+(result[0]?'ok':'no');
    if(!result[0]){game.answer(false);retries++;feedback.textContent='Try again. '+result[1];feedback.className='gw-pts minus';api.check(false,result[1],{});renderStats();if(game.state().over)end();return;}locked=true;const x=game.answer(true);
    feedback.textContent=(result[0]?'✓ ':'✕ ')+result[1]+(result[0]?' +'+game.points(true,x.streak)+' points':' −1 life');
    feedback.className='gw-pts'+(result[0]?'':' minus');
    n.bob.say(api.bubble,result[1],{engine:engineId,mode:'challenge',correct:!!result[0]});
    index++;session.index=index;renderStats();check.hidden=true;hint.hidden=true;
    if(result[0]){
      n.fx.burst(api.stage);next.hidden=true;
      advanceTimer=setTimeout(()=>{advanceTimer=null;if(wrap.isConnected&&!finished)proceed();},800);
    }else{
      next.textContent=index>=tasks.length||x.over?'View results →':'Next question →';next.hidden=false;
    }
  };
  hint.onclick=()=>{if(locked||finished)return;game.hint();feedback.textContent=tasks[index].hint;renderStats();n.bob.say(api.bubble,tasks[index].hint,{engine:engineId,mode:'challenge',hint:true})};
  next.onclick=()=>{if(locked&&!next.hidden)proceed()};
  restart.onclick=()=>{clearTimeout(advanceTimer);advanceTimer=null;document.querySelector('#nova-lesson-victory')?.remove();tasks=buildMission();game.reset();session.celebrated=false;index=0;session.index=0;finished=false;restart.hidden=true;finish.hidden=true;draw()};
  draw();
  if(C)C._challenge={suspend:()=>{clearTimeout(advanceTimer);advanceTimer=null;},resume:()=>{if(locked&&!finished){advanceTimer=setTimeout(proceed,800);}},task:()=>index,solve:()=>{const t=tasks[index];if(t?.solve)t.solve(control);}};
  return {task:()=>index};
};
