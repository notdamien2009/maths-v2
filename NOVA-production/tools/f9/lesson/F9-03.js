/* Lesson scene: positions 1–5 map to their terms with the rule shown; the asked position's term is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({a:2,b:3,ask:10},p||{});reset(stage);
const svg=svgRoot('Position to term table with rule '+rule(p.a,p.b)+'. The term for position '+p.ask+' is unknown.');
putGraphic(svg,{a:p.a,b:p.b,mapping:'all',visible:5,title:'POSITION  →  TERM',subtitle:'Use the rule for any position'});
txt(svg,W()/2,small()?568:556,'Position '+p.ask+'  →  T('+p.ask+') = ?',small()?26:26,'focus');
wrap(stage,svg,[side('RULE',rule(p.a,p.b),'focus'),side('POSITION',p.ask),side('TERM','?')],'point-down','Substitute the position into the rule.');
}
