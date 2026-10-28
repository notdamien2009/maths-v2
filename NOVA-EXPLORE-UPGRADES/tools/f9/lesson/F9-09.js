/* Lesson scene: positions 1–5 and terms 1–4 are drawn (differences left blank); term 5 is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({a:1,b:2,c:1},p||{});const w=W();clear(stage);
const svg=root('Quadratic sequence table with terms '+[1,2,3,4].map(n=>val(p,n)).join(', ')+'. The fifth term is unknown.');
txt(svg,w/2,43,'FIND THE FIFTH TERM',small()?28:25,'support');txt(svg,w/2,77,'Work out the first and second differences',small()?22:19,'support');
table(svg,p,0,4);
txt(svg,w/2,small()?560:500,'T(5) = ?',small()?32:30,'focus');
mount(stage,svg,[card('TERMS GIVEN','4'),card('FIFTH TERM','?',true),note('METHOD','The second difference of a quadratic sequence is constant.')],'think','Find the differences, then continue the pattern.');
}
