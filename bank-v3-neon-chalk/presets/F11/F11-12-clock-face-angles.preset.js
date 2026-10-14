/* NOVA Maths F11-12 — CLOCK-FACE ANGLES.
   This is a PRESET for F18-03 Analogue Clock, never a standalone engine.
   Immutable maths, teaching and contract definitions. No shared core changes. */
(function(global){'use strict';
const EPS=1e-9;
const norm=x=>((x%360)+360)%360;
const within=(a,b,tolerance=0.5)=>Math.abs(a-b)<=tolerance;
function checkTime(hour, minute){
 if(!Number.isInteger(hour)||hour<0||hour>12||!Number.isInteger(minute)||minute<0||minute>59)throw new RangeError('Clock time requires hour 0–12 and minute 0–59');
}
function handAngles(hour,minute){
 checkTime(hour,minute);
 return Object.freeze({hour:norm((hour%12)*30+minute*0.5),minute:minute*6});
}
function clockAngle(hour,minute){
 const hands=handAngles(hour,minute);
 const clockwise=norm(hands.minute-hands.hour);
 const minor=Math.min(clockwise,360-clockwise);
 return Object.freeze({hour,minute,...hands,clockwise,minor,reflex:minor< EPS?360:360-minor,
    isStraight:within(minor,180),isRight:within(minor,90),coincident:minor<EPS});
}
function clockPoint(angle,radius,centreX=320,centreY=275){
 const radians=(angle*Math.PI)/180;
 return Object.freeze({x:centreX+radius*Math.sin(radians),y:centreY-radius*Math.cos(radians)});
}
function clockwiseArc(start,sweep,radius=96,cx=320,cy=275){
 if(sweep<=EPS||sweep>=360-EPS)return '';
 const a=clockPoint(start,radius,cx,cy),b=clockPoint(start+sweep,radius,cx,cy);
 return `M ${a.x.toFixed(3)} ${a.y.toFixed(3)} A ${radius} ${radius} 0 ${sweep>180?1:0} 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}
function angleArc(hour,minute,kind='minor',radius=96,cx=320,cy=275){
 const v=clockAngle(hour,minute);if(!['minor','reflex','clockwise'].includes(kind))throw Error('Unknown angle kind');
 if(kind==='clockwise')return clockwiseArc(v.hour,v.clockwise,radius,cx,cy);
 const s=v.clockwise<=180?v.hour:v.minute;
 return clockwiseArc(kind==='minor'?s:norm(s+v.minor),kind==='minor'?v.minor:360-v.minor,radius,cx,cy);
}
const challenges=Object.freeze([
 Object.freeze({id:'C1',hour:3,minute:0,kind:'minor',answer:90,reason:'time-hands',trap:'Remember the hands are one quarter-turn apart.'}),
 Object.freeze({id:'C2',hour:2,minute:30,kind:'minor',answer:105,reason:'hour-hand-moves',trap:'At half past two the hour hand is halfway between 2 and 3.'}),
 Object.freeze({id:'C3',hour:6,minute:0,kind:'minor',answer:180,reason:'straight-angle',trap:'Opposite hands make a straight angle, not a full turn.'}),
 Object.freeze({id:'C4',hour:9,minute:0,kind:'reflex',answer:270,reason:'reflex-complement',trap:'A reflex angle is the remainder of the full 360° turn.'}),
 Object.freeze({id:'C5',hour:10,minute:10,kind:'minor',answer:115,reason:'hour-hand-moves',trap:'The hour hand moves another 5° during ten minutes.'}),
 Object.freeze({id:'C6',hour:8,minute:20,kind:'minor',answer:130,reason:'hour-hand-moves',trap:'Measure from the actual hour hand, not exactly from the numeral 8.'}),
 Object.freeze({id:'C7',hour:12,minute:0,kind:'minor',answer:0,reason:'coincident-hands',trap:'Coincident hands form zero degrees for the smaller angle.'}),
 Object.freeze({id:'C8',hour:5,minute:40,kind:'reflex',answer:290,reason:'reflex-complement',trap:'Find the 70° smaller angle first, then subtract from 360°.'})
]);
const presets=Object.freeze({
 'Y7-040':Object.freeze({label:'Y7-040 · Measuring and drawing angles',context:'Measure angles between clock hands using a clockwise circle and degree landmarks.',hour:3,minute:0,kind:'minor',lesson:'Measuring and drawing angles',minAngle:0,maxAngle:360,step:1}),
 'Y7-040-reflex':Object.freeze({label:'Y7-040 · Reflex angle extension',context:'Use the remaining turn of a full circle to describe a reflex angle.',hour:9,minute:0,kind:'reflex',lesson:'Measuring and drawing angles',minAngle:180,maxAngle:360,step:1})
});
const steps=Object.freeze([
 Object.freeze({id:'clock',narration:'Read the clock. Both hands start at the same centre; twelve is directly upwards.',show:['face']}),
 Object.freeze({id:'minute',narration:'Follow the minute hand. Every one-minute space represents six degrees.',show:['face','minute']}),
 Object.freeze({id:'hour',narration:'Find the hour hand. It also moves gradually between the numbers.',show:['face','minute','hour']}),
 Object.freeze({id:'arc',narration:'Mark the smaller angle between the two hands with an arc.',show:['face','minute','hour','arc']}),
 Object.freeze({id:'reason',narration:'Use a right angle or a half turn as a benchmark before calculating.',show:['face','minute','hour','arc','reason']}),
 Object.freeze({id:'solve',narration:'Now combine the actual positions of both hands to obtain the angle.',show:['face','minute','hour','arc','reason','value']}),
 Object.freeze({id:'vary',narration:'Move the hands and notice that the hour hand moves by half a degree per minute.',show:['face','minute','hour','arc','value']}),
 Object.freeze({id:'reflex',narration:'The reflex angle is the rest of one full turn. Subtract the smaller angle from three hundred and sixty degrees.',show:['face','minute','hour','arc','value']})
]);
function mark(question,answer,reason){
 const q=typeof question==='string'?challenges.find(x=>x.id===question):question;
 if(!q)throw Error('Unknown clock-angle question');
 const value=typeof answer==='string'&&!answer.trim()?NaN:Number(answer);
 const angleOk=Number.isFinite(value)&&Math.abs(value-q.answer)<EPS;
 const reasonOk=reason===q.reason;
 let feedback;
 if(angleOk&&reasonOk)feedback='Correct angle and reason.';
 else if(angleOk)feedback='The angle is correct. Now choose the mathematical reason.';
 else if(Number.isFinite(value)&&Math.abs(value-(360-q.answer))<EPS)feedback='You measured the complementary sweep around the full circle.';
 else feedback=q.trap||'Check the hour and minute hands separately.';
 return Object.freeze({correct:angleOk&&reasonOk,angleOk,reasonOk,feedback,marks:(angleOk?1:0)+(reasonOk?1:0),maxMarks:2});
}
const preset={id:'F11-12',family:'F11',kind:'preset',title:'Clock-face angles',parentEngine:'F18-03',hostName:'Analogue clock',
 separateEngineForbidden:true,readyForHost:false,independentEngine:false,
 requiredModes:['Watch','Guided','Explore','Challenge'],requiredEvents:['step','correct','hintUsed','mode','value'],
 sharedCoreRequired:true,requiredHostFeatures:['clock face','hour and minute hands','fast pointer drag','keyboard adjustment','narration','in-stage mascot'],
 presets,steps,challenges,handAngles,clockAngle,clockPoint,clockwiseArc,angleArc,mark,
 registerInto:function(host){
   if(!host||host.id!=='F18-03'||typeof host.registerPreset!=='function')throw new Error('F11-12 requires an implemented F18-03 host with registerPreset');
   if(typeof host.getHandState!=='function'||typeof host.setHandState!=='function'||typeof host.registerOverlay!=='function')throw new Error('F18-03 must expose hand-state and overlay registration contracts');
   host.registerPreset('F11-12',{id:'F11-12',label:'Clock-face angles',kind:'clock-angle',presets,steps,challenges,mark});
   host.registerOverlay('F11-12',{clockAngle,angleArc,clockPoint,handAngles,mark});
   return {id:'F11-12',host:'F18-03',integrated:true};
 }
};
global.NOVA_F1112_PRESET=Object.freeze(preset);
})(typeof window!=='undefined'?window:globalThis);
