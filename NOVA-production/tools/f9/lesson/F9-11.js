/* Lesson scene: four mystery terms are drawn with the rule hidden; the rule amount is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({kind:'add',first:5,k:7},p||{});clear(stage);const arr=values(p);
const svg=root('Mystery sequence '+arr.slice(0,4).join(', ')+'. The hidden rule is unknown.');
sequence(svg,p,{visible:4,showRule:false,title:'SPOT THE RULE'});
txt(svg,W()/2,460,'Each term changes by ?',small()?30:28,'focus');
mount(stage,svg,[card('TERMS SHOWN','4'),card('RULE','?',true),note('TEST IT','The same change must work on every jump.')],'question','What is added each time?');
}
