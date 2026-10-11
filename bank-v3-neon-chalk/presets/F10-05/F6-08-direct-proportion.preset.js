/* F6-08 CONFIG-ONLY preset for the future F10-05 'y=mx+c explorer'.
   Does NOT create/register a duplicate plotting engine or patch shared F0 files.
   Host integration requires mapping `slope/intercept` to the final F10-05 schema. */
(function (global) {
'use strict';
const presets = Object.freeze({
  'Y7-060':Object.freeze({label:'Y7-060 · Direct proportion',context:'Tickets',xLabel:'Tickets',yLabel:'Cost (£)',slope:2,intercept:0,xMax:6,yMax:12,xStep:1,yStep:2,knownX:2,queryX:5, gcse:false}),
  'Y8-035':Object.freeze({label:'Y8-035 · Table & equation',context:'Stickers',xLabel:'Packs',yLabel:'Stickers',slope:3,intercept:0,xMax:6,yMax:18,xStep:1,yStep:3,knownX:2,queryX:4, gcse:false}),
  'Y8-036':Object.freeze({label:'Y8-036 · Through origin',context:'Distance',xLabel:'Time (h)',yLabel:'Distance (km)',slope:1.5,intercept:0,xMax:8,yMax:12,xStep:1,yStep:1.5,knownX:2,queryX:6, gcse:false}),
  'Y9-020':Object.freeze({label:'Y9-020 · Proportion signatures',context:'Rate',xLabel:'x',yLabel:'y',slope:.75,intercept:0,xMax:8,yMax:6,xStep:1,yStep:.75,knownX:4,queryX:6, gcse:true})
});
const preset={id:'F6-08',kind:'preset',parentEngine:'F10-05',hostTitle:'y = mx + c explorer',family:'F6',name:'Direct proportion graph',constraints:{interceptMustEqualZero:true,rule:'y=kx',throughOrigin:true},presets:presets,
 steps:[{id:'plot-points',narration:'Plot matched values from the ratio table.'},{id:'draw-line',narration:'Join the points with a line through the origin.'},{id:'read-value',narration:'Read another point and show the multiplier.'}],
 interactions:['point-along-y=kx','table-value-to-graph-point'],challenge:['determine-k','read-coordinate']};
/* Explicit adapter only; return data, do not assume an unknown host extension API. */
preset.prepareForHost=function(host){if(!host||host.id!=='F10-05')throw Error('F6-08 requires actual F10-05 host');return {hostId:host.id,registrationId:preset.id,presets:presets,rendererConstraints:preset.constraints,requiredModes:['watch','guided','explore','challenge']};};
global.NOVA_F608_PRESET=preset;
})(window);
