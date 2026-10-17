/* Lesson scene: iteration n of the fractal is drawn and the counts for iterations 0 and 1; the asked count is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({kind:'sierpinski',n:1,ask:3},p||{});const q=PRE[p.kind==='koch'?'koch-curve':'sierpinski-triangle'],sm=mobile();clear(stage);
const svg=svgRoot('Fractal iteration '+p.n+' of '+q.label+'. The count at iteration '+p.ask+' is unknown.');
drawFractal(svg,q,p.n,{title:p.title});renderCountRow(svg,q,p.n,true);
N.svg.pill(svg,W()/2,sm?694:668,'Iteration '+p.ask+'  →  ? '+(q.kind==='koch'?'segments':'triangles'),{role:'focus',size:sm?24:22});
mount(stage,svg,[card('FRACTAL',q.kind==='sierpinski'?'Sierpiński triangle':'Koch curve'),card('ITERATION',String(p.n)),card('FIND','Iteration '+p.ask,true)],q.kind==='koch'?'point-right':'count',q.kind==='koch'?'Each straight piece becomes four.':'Count only the surviving triangles.');
}
