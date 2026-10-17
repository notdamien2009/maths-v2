# Per-engine lesson renderers: lesson state -> original present()/render() of the same engine.
M="window.NovaV2Integration.mutable"
def mk(id_, default, body, steps='STEPS'):
    return ("/* F4 lesson records drive the approved native apparatus (audit 2026-10-16). */\n"
     "function f4State(l){const base="+M+"(C.presets['"+default+"']||{});return {...base,..."+M+"(l.state)};}\n"
     "function renderLesson(l,stage){return window.NovaF4Runtime.run(C,stage,l,(l,p,hidden)=>{const s=f4State(l),last="+steps+".length-1;let q=Math.min(p,last);"+body+"});}\n"
     "for(const step of "+steps+")step.lesson=null;\n"
     "const f4NativeRender=def.render;def.render=function(i,stage){const a=window.NovaLessonComponent?.active,l=(a?.data||a?.nativeData)?.lesson;return l?renderLesson(l,stage):f4NativeRender.call(def,i,stage);};\n")
H={
'F4-01':mk('F4-01','Y7-035',"if(hidden)q=Math.min(q,3);s.known=[...s.known];present(stage,s,{step:q,selected:null,pose:['notice','split','known','predict','subtract','prove'][q],subtitle:l.title||STEPS[q].name,animate:false});"),
'F4-02':mk('F4-02','Y7-007',"if(hidden)q=Math.min(q,3);present(stage,s,{step:q,selected:null,pose:['align','b','pair','gap','minus','check'][q],subtitle:l.title||STEPS[q].name,animate:false});"),
'F4-03':mk('F4-03','Y7-019',"if(hidden)q=1;present(stage,{a:asTrain(q>=1?s.a:[]),b:asTrain(hidden?[]:q>=4?s.b:s.b.slice(0,Math.max(0,q-1)))},{step:q,interactive:false,subtitle:l.title||STEPS[q].name,pose:watchPose[q],animated:false});"),
'F4-04':mk('F4-04','Y8-038',"if(hidden)q=Math.min(q,1);present(stage,s,{step:q,subtitle:l.title||STEPS[q].name,pose:['base','split','grow','carry','change','final','prove','prove'][q],animated:false});"),
'F4-06':mk('F4-06','Y7-026',"if(hidden){present(stage,s,{step:2,heading:l.title||STEPS[2].name,pose:'ready',interactive:true,task:true,won:false,maskScale:true,onPercent(){},onPlace(){}});return;}present(stage,s,{step:q,maskAmount:q<5,heading:l.title||STEPS[q].name,pose:['begin','split','unit','one','shade','amount','link','check'][q]});"),
'F4-07':mk('F4-07','Y7-059',"if(hidden)q=Math.min(q,2);const r=totals(s);present(stage,s,{countA:q>=1?r.a:0,countB:q>=2?r.b:0,step:q,pose:['start','a','b','total','unit','shares','compare','done'][q],heading:l.title||STEPS[q].name});"),
'F4-08':mk('F4-08','Y7-035',"const seq=s.mode==='bar-equation'?F711_STEPS:STEPS,pose=['start','parts','known','balance','remove','divide','answer','proof'];if(s.mode==='translator'||l.overlay==='equation'){const t=Math.min(p,3);const slots=hidden?[]:terms(s).slice(0,t);present(stage,{...s,mode:'translator'},{step:2,count:s.n,known:true,slots,connect:slots.length,maskTerms:hidden||t<3,pose:['start','parts','known','proof'][hidden?0:t],title:l.title||['Read the bar','Map the x-parts','Map the known part','Assemble the equation'][hidden?0:t]});return;}if(hidden)q=Math.min(q,3);present(stage,s,{step:q,count:q>=1?s.n:0,known:q>=2,pose:pose[q],title:l.title||seq[q].name});"),
'F4-09':mk('F4-09','Y8-008',"if(hidden)q=Math.min(q,3);present(stage,s,{step:q,pose:['start','whole','after','change','work','solve','solve','proof'][q],heading:l.title||STEPS[q].name});"),
'F4-11':mk('F4-11','Y7-034',"if(hidden)q=0;present(stage,s,{step:q,pose:['read','part','whole','map','difference','proof'][q],heading:l.title||STEPS[q].name});"),
'F4-12':mk('F4-12','Y8-041',"if(hidden)q=Math.min(q,3);present(stage,s,{step:q,pose:['start','time','time','rate','fill','total','proof'][q],heading:l.title||STEPS[q].name});"),
}
# F4-05 uses var/ES5 names: DEF, steps, render, model.
H['F4-05']=("/* F4 lesson records drive the approved native apparatus (audit 2026-10-16). */\n"
 "function renderLesson(l,stage){return window.NovaF4Runtime.run(C,stage,l,function(l,p,hidden){var base="+M+"(C.presets[C.preset]||C.presets.threeQuarter24),s=Object.assign({},base,"+M+"(l.state)),q=Math.min(p,steps.length-1);if(hidden)q=Math.min(q,3);var t=steps[q],sel=q>=3?Array.from({length:s.n},function(_,i){return i;}):[];render(stage,model(s.a,s.n,s.d,sel),{heading:l.title||t.name,stage:t.stage,animate:false,pose:t.pose,caption:t.caption,isComplete:!hidden&&q>=4,hidden:hidden});});}\n"
 "steps.forEach(function(step){step.lesson=null;});\n"
 "var f4NativeRender=DEF.render;DEF.render=function(i,stage){var a=window.NovaLessonComponent&&window.NovaLessonComponent.active,d=a&&(a.data||a.nativeData),l=d&&d.lesson;return l?renderLesson(l,stage):f4NativeRender.call(DEF,i,stage);};\n")
