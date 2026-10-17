/* Lesson scene: the first bars and the ratio hops are drawn; the next term is a ghost ring and is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({a:3,r:2,shown:4},p||{});const q={...p,rule:p.r<1?'÷'+Math.round(1/p.r):'×'+p.r};clear(stage);
const svg=root('Glowing bars for a geometric sequence: '+[1,2,3,4].slice(0,p.shown).map(n=>term(q,n)).join(', ')+'. The next term is unknown.');
text(svg,WIDTH()/2,47,p.title||'FIND THE NEXT TERM',small()?28:31,'support');
text(svg,WIDTH()/2,90,'Use the same multiplier again',small()?24:21,'support');
drawBars(svg,q,p.shown,{hops:true,ghost:true,hideRule:!!p.hideRule});
text(svg,WIDTH()/2,700,'Term '+(p.shown+1)+' = ?',small()?30:28,'focus');
mount(stage,svg,[card('FIRST TERM',q.a),card('COMMON RATIO',p.hideRule?'?':q.rule,true),card('NEXT TERM','?')],'think','Multiply by the same factor each time.');
}
