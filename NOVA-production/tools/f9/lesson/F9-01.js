/* Lesson scene: stage k of the joined-squares pattern is drawn; the lesson asks for a later stage, which is never drawn. */
function lessonScene(stage,p){
if(window.NovaLessonComponent?.active){[stage,p]=window.NovaLessonComponent.args("lessonScene",arguments);}
p=Object.assign({stage:3,ask:7},p||{});const k=p.stage,sm=isSmall(),W=sm?430:760;
reset(stage);const svg=stateRoot('Joined matchstick squares. Stage '+k+' uses '+answer(k)+' sticks; each new square adds three sticks.');
const s=Math.min(sm?80:114,(W-62)/Math.max(4,k)),x=W/2-k*s/2,y=sm?140:127;
N.svg.pill(svg,W/2,36,'Stage '+k,{role:'given',size:sm?24:20});
txt(svg,W/2,84,p.caption||'Each new square shares one side',sm?24:22,'support');
mainSticks(svg,x,y,s,k,k-1,sm?10:12);
txt(svg,W/2,y+s+46,answer(k)+' sticks',sm?32:31,'result');
txt(svg,W/2,sm?396:372,'Stage '+p.ask+'  →  ? sticks',sm?32:30,'focus');
const side=H('aside',{class:'f901-side'});side.appendChild(sideCard('STAGE '+k,answer(k)+' sticks'));side.appendChild(sideCard('FIND','Stage '+p.ask,'f901-card--gold'));
stage.appendChild(H('div',{class:'f901-stage'},[svg,side]));N.scene.helperStrip(stage,'think','Count how many sticks each new square adds.');
}
