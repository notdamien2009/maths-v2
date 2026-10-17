/* Lesson scene: positions, terms, the difference and the dn row are drawn; the constant c of T(n) = dn + c is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({a:3,c:2},p||{});reset(stage);const svg=svgRoot('Linear sequence table: terms '+[1,2,3,4,5].map(n=>term(p,n)).join(', ')+', common difference and the d n row. The adjustment c is unknown.');
drawTable(svg,p,{step:2,title:'FIND THE nth TERM',subtitle:'T(n) = dn + c  ·  find c',noMotion:true});
txt(svg,W()/2,640,'T(n) − dn = ?',sm()?30:28,'focus');
mountScene(stage,svg,[card('COMMON DIFFERENCE d',fmt(p.a,true),true),card('ADJUSTMENT c','?'),note('METHOD','Compare each term with d × n.')],'think','Subtract the dn row from the term row.');
}
