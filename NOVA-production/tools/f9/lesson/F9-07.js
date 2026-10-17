/* Lesson scene: stage n of a special sequence and stages 1–4 are drawn; the asked later stage is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({kind:'square',n:3,ask:5},p||{});const w=W();clear(stage);
const svg=root(names[p.kind]+': stage '+p.n+' has '+val(p.kind,p.n)+' dots. The count at stage '+p.ask+' is unknown.');
text(svg,w/2,45,names[p.kind],small()?28:29,'support');text(svg,w/2,86,'How do the dots grow?',small()?24:20,'support');
scenePattern(svg,p.kind,p.n,{});
N.svg.pill(svg,w/2,739,'Stage '+p.ask+'  →  ? dots',{role:'focus',size:small()?26:22});
mount(stage,svg,[card('STAGE',p.n),card('DOTS',val(p.kind,p.n),true),note('RULE',p.kind==='fibonacci'?'Add the previous two counts.':'Look at how each stage is built.')],'point-right','Find the rule from how the dots grow.');
}
