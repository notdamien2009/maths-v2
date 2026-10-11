/* NOVA F6-13: CONFIGURATION PRESET for future F14-11 Similar Shapes engine.
 * Not a separate production engine. Preview adapter runs only within F0 gallery.
 */
(function(global){'use strict';
const presets=Object.freeze({
 'Y7-064':Object.freeze({label:'Y7-064 · Scale drawings',shape:'triangle',context:'A right-triangle plan is enlarged without changing its angles.',small:[3,4],k:2,units:'cm',querySide:1,teaching:'A scale drawing multiplies every matching length by the same factor.',trap:'adding instead of multiplying',gcse:false}),
 'Y8-057':Object.freeze({label:'Y8-057 · Similarity',shape:'rectangle',context:'Two rectangular frames are similar, so every corresponding side changes by one factor.',small:[4,6],k:1.5,units:'cm',querySide:1,teaching:'Compare matching sides; a factor of 1.5 applies to both.',trap:'using different factors on each side',gcse:false}),
 'Y9-021':Object.freeze({label:'Y9-021 · Scale figures',shape:'triangle',context:'An engineering plan is enlarged to make a similar triangle.',small:[2.4,3.6],k:2.5,units:'m',querySide:1,teaching:'Identify corresponding sides first, then apply the same scale factor.',trap:'inverting the scale factor',gcse:true}),
 'Y9-023':Object.freeze({label:'Y9-023 · Similar tanks and density',shape:'rectangle',context:'Similar tanks are enlarged by a linear factor of 1.5. Density remains mass per unit volume; the linear factor is not the volume factor.',small:[4,6],k:1.5,units:'cm',querySide:1,teaching:'Linear lengths scale by 1.5, area by 1.5², volume by 1.5³; at constant density mass scales with volume.',trap:'using a linear scale factor as a volume factor',gcse:true,contextNote:'Density connection: constant density is not the scale factor; mass and volume both scale by k³.'}),
 'Y9-029':Object.freeze({label:'Y9-029 · Similarity reasoning',shape:'triangle',context:'Two similar triangles have proportional corresponding lengths.',small:[2,3],k:2.5,units:'cm',querySide:1,teaching:'Matching sides preserve their multiplicative relationship, even when the factor is a decimal.',trap:'assuming an additive difference',gcse:true})
});
const preset={id:'F6-13',name:'Proportion in Geometry',kind:'preset',family:'F6',parentEngine:'F14-11',parentName:'Similar shapes',separateEngineForbidden:true,readyForHost:false,presets,
steps:[{id:'overlay',narration:'Notice two shapes with the same angles and matching sides.'},{id:'scale',narration:'Find one matching pair and name the scale factor.'},{id:'matching-sides',narration:'All corresponding lengths scale together.'},{id:'missing-side',narration:'Multiply the missing side by that same factor.'}],
requiredModes:['watch','guided','explore','challenge'],interactions:['length-card-to-matching-side','return-to-red-zone','keyboard-assignment']};
preset.prepareForHost=function(host){if(!host||host.id!=='F14-11')throw Error('F6-13 must register inside actual F14-11 Similar Shapes');return {hostId:'F14-11',registrationId:'F6-13',presets,steps:preset.steps,requiredModes:preset.requiredModes,requiredInteractions:preset.interactions,integrationStatus:'pending actual parent host'};};
global.NOVA_F613_PRESET=preset;
})(window);
