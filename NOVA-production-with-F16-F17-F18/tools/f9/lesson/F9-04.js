/* Lesson scene: the first terms are plotted as (n, T(n)) points; the next point is not plotted. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({kind:'linear',a:2,b:1,c:0,visible:4},p||{});const k=p.visible,vals=[1,2,3,4,5].map(n=>term(p,n));
const top=Math.max(...vals,1),stepY=top<=16?2:top<=40?5:10,q={...p,yMax:Math.ceil(top/stepY)*stepY,yStep:stepY};
reset(stage);const svg=svgRoot('Sequence points plotted on a graph: '+vals.slice(0,k).map((v,i)=>'('+(i+1)+', '+v+')').join(', ')+'. The next point is unknown.');
plotScene(svg,q,{title:p.title||'POSITION n  →  TERM T(n)',subtitle:'Read the plotted terms',visible:k,bottomText:'Position '+(k+1)+'  →  T('+(k+1)+') = ?'});
wrap(stage,svg,[card('POINTS PLOTTED',String(k)),card('NEXT TERM','?',true),note('READ THE GRAPH',p.kind==='linear'?'Equal steps up or down mean a constant difference.':'Growing gaps mean the differences themselves change.')],'point-right','Every plotted point is a position and a term.');
}
