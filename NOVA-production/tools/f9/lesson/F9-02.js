/* Lesson scene: the first terms and their hops are drawn; the next term is a '?' ring and is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({type:'arith',a1:4,step:3,ratio:2,visible:4},p||{});const k=p.visible,sm=isSmall();
reset(stage);const svg=stateRoot('A sequence with '+k+' visible terms joined by term-to-term hops. The next term is unknown.');
drawSequence(svg,p,{title:p.title||'FIND THE NEXT TERM',subtitle:p.hideRule?'Work out the rule from the hops':'Use the same rule on the next hop',visible:k,count:k+1,showRule:!p.hideRule,hideLast:true});
const side=H('aside',{class:'f902-side'},[sideCard('TYPE',p.type==='arith'?'Arithmetic':'Geometric','f902-card--gold'),sideCard('RULE',p.hideRule?'?':ruleLabel(p)),sideCard('NEXT TERM','?')]);
stage.appendChild(H('div',{class:'f902-stage'},[svg,side]));N.scene.helperStrip(stage,'point-right','A term-to-term rule is the same for every hop.');
}
