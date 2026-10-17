/* Lesson scene: rows of Pascal's triangle are drawn with either the centre cell of the bottom row hidden, or the
   question asking for the total of the next row (never drawn). */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({rows:5,ask:'centre'},p||{});const r=p.rows-1;clear(stage);
const svg=root('Pascal triangle with '+p.rows+' rows'+(p.ask==='centre'?'; the centre of the bottom row is hidden.':'; the total of the next row is unknown.'));
txt(svg,W()/2,45,p.ask==='centre'?'FIND THE MISSING NUMBER':'TOTAL OF THE NEXT ROW',small()?27:26,'support');
txt(svg,W()/2,86,p.ask==='centre'?'Each inside cell adds the two above':'Each row total follows a pattern',small()?22:20,'support');
tri(svg,p.rows,{hide:p.ask==='centre'?[r,r/2]:null,pattern:'addition'});
txt(svg,W()/2,small()?760:740,p.ask==='centre'?'Missing number = ?':'Row '+(r+1)+' total = ?',small()?30:28,'focus');
mount(stage,svg,[card('ROWS SHOWN',p.rows),card(p.ask==='centre'?'MISSING CELL':'NEXT ROW TOTAL','?',true)],'think',p.ask==='centre'?'Add the two numbers directly above.':'Add up each row and look for the pattern.');
}
