/* Lesson scene: the first four terms are drawn; term five is a '?' slot and is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({operation:'add',first:4,step:3,factor:2},p||{});clear(stage);const arr=values(p);
const svg=root('Sequence '+arr.slice(0,4).join(', ')+'. Term five is unknown.');
row(svg,p,{visible:4,hop:0,showRule:false,title:'CONTINUE THE SEQUENCE'});
txt(svg,W()/2,440,'Term 5 = ?',sm()?32:30,'focus');
mount(stage,svg,[card('TERMS SHOWN','4'),card('TERM 5','?',true),note('CHECK','Find what changes from one term to the next.')],'point-right','Keep the operation the same as the pattern grows.');
}
