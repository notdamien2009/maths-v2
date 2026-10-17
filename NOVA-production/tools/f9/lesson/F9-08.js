/* Lesson scene: the triangle for stage n is drawn; the asked later triangular number is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({n:4,ask:6},p||{});const w=W();clear(stage);
const svg=root('Triangular dot pattern: stage '+p.n+' has '+T(p.n)+' dots in rows of 1 to '+p.n+'. Stage '+p.ask+' is unknown.');
txt(svg,w/2,51,'GROW BY ADDING ROWS',small()?28:27,'support');txt(svg,w/2,94,'Each new row has one more dot',small()?24:19,'support');
evidence(svg,p.n,'triangle');
mount(stage,svg,[card('STAGE · n',p.n),card('DOTS',T(p.n),true),card('FIND','Stage '+p.ask)],'point-down','Every new row contains one more dot than before.');
}
