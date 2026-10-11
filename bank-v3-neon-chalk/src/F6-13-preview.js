/* NOVA F6-13 — gallery demonstrator for pending F14-11 similarity preset.
 * F0 geometry, F0 neon primitives, F0 chalk and F0 drag helper unchanged.
 */
(function(){'use strict';
const N=window.NOVA,P=window.NOVA_F613_PRESET,H=N.h,E=N.svg.el,M=N.motion,ID='F6-13';
const config={id:ID,preset:'Y7-064',previewOnly:true,parentEngine:'F14-11',presets:P.presets,requiredModes:P.requiredModes};window.F613_CONFIG=config;
const STEPS=[
{name:'Meet the two shapes',pose:'explain',caption:'Same shape, new size.',narration:'Both shapes have matching angles. We can compare the same side on each figure.'},
{name:'Match the corresponding sides',pose:'point-down',caption:'Match the side positions.',narration:'Find a side on the small shape and its matching side on the enlarged shape.'},
{name:'Notice the scale factor',pose:'count',caption:'How many times as long?',narration:'Compare one pair of matching lengths. Divide the new length by the old one to find the scale factor.'},
{name:'Apply the factor to all sides',pose:'point',caption:'Same factor. Every side.',narration:'The scale factor works for every corresponding length, not just the one we started with.'},
{name:'Predict the missing side',pose:'think',caption:'What belongs here?',narration:'Multiply the missing old length by the scale factor. Check that the larger figure stays similar.'},
{name:'Check the reasoning',pose:'checking',caption:'Prove your answer.',narration:'Make two comparisons. Both new lengths divided by old lengths must give the same scale factor.'},
{name:'Celebrate the match',pose:'celebrate',caption:'A matching transformation.',narration:'You matched the correct sides and applied the same multiplier. That is geometric similarity.'}
];
const fmt=x=>String(Number(Number(x).toFixed(5)));
const close=(a,b)=>Math.abs(a-b)<1e-7;
const expected=p=>p.small[p.querySide]*p.k;
const emit=(t,details={})=>N.events.emit(t,{engine:ID,preset:config.preset,...details});
const txt=(svg,x,y,s,role='given',size=28)=>N.chalkText(svg,x,y,String(s),{role,size});
const btn=(str,fn,cls='nova-btn')=>H('button',{text:str,class:cls,onclick:fn});
const cur=()=>P.presets[config.preset];
const shapeInfo=(p,cx,bottom,scale)=>{const a=p.small[0]*scale,b=p.small[1]*scale;
 const left=cx-a/2,top=bottom-b;
 const d=p.shape==='triangle'?`M${left},${bottom} L${left+a},${bottom} L${left},${top} Z`:`M${left},${top} H${left+a} V${bottom} H${left} Z`;
 return {a,b,left,top,bottom,d,base:[[left,bottom],[left+a,bottom]],side:[[left,top],[left,bottom]]};};
const shape=(svg,p,cx,bottom,unit,large,hide,opt={})=>{
 const scale=large?unit*p.k:unit,z=shapeInfo(p,cx,bottom,scale),caption=large?'ENLARGED FIGURE':'ORIGINAL FIGURE';
 N.neonPath(svg,z.d,{role:large?'result':'given',width:3.5,fill:true});
 // Identical face colour, clear pairing evidence shown using semantic F0 line roles.
 const base=z.base,side=z.side;
 N.neonLine(svg,base[0][0],base[0][1],base[1][0],base[1][1],{role:'focus',width:5});
 N.neonLine(svg,side[0][0],side[0][1],side[1][0],side[1][1],{role:'op',width:5});
 const visible=opt.step==null||opt.step>=1;
 if(visible){
  const a=fmt(p.small[0]*(large?p.k:1)),b=fmt(p.small[1]*(large?p.k:1));
  const hideB=large && hide;
  txt(svg,cx,bottom+44, a+' '+p.units,'focus',26);
  txt(svg,z.left-(large?46:43),z.top+z.b/2+8,hideB?'?':b+' '+p.units,hideB?'unknown':'op',25);
  if(hideB&&opt.mode==='challenge')N.neonRing(svg,z.left-22,z.top+z.b/2+4,{role:'unknown',r:20});
 }
 return z;
};
const evidence=(title,value,desc,role='given')=>N.neonCard([H('p',{class:'f613-key',text:title}),H('p',{class:'f613-figure',text:value}),H('p',{class:'f613-desc',text:desc})],{role});
function draw(stage,p,opt={}){
 const mode=opt.mode||'watch',teach=mode==='watch'||mode==='guided',step=opt.step??6,hidden=mode==='challenge'&&!opt.solved;
 const mobile=innerWidth<=980,w=mobile?520:1120,h=mobile?965:650;
 const svg=N.svg.root(w,h,'Two geometrically similar '+p.shape+'s; compare corresponding sides to find a common scale factor.');svg.classList.add('f613-svg');svg.dataset.preset=opt.id||config.preset;svg.dataset.mode=mode;
 const layout=H('div',{class:'f613-layout'}),art=H('div',{class:'f613-art'}),aside=H('aside',{class:'f613-aside'});
 stage.innerHTML='';N.cap(stage,ID,mode==='challenge'?'FIND THE MISSING LENGTH':mode==='explore'?'MATCH THE CORRESPONDING SIDES':'SIMILAR SHAPES · ONE SCALE FACTOR');
 txt(svg,w/2,58,'SAME SHAPE · DIFFERENT SIZE','given',mobile?32:45);
 txt(svg,w/2,mobile?112:118,teach?'MATCH · SCALE · REASON':'CORRESPONDING SIDES','focus',mobile?25:30);
 const unit= Math.min(mobile?165:205, (mobile?165:205))/(Math.max(...p.small)*p.k);
 let s,l;
 if(mobile){
  txt(svg,260,166,'A · ORIGINAL','focus',28);
  s=shape(svg,p,260,346,unit,false,false,{step,mode});
  if(!teach||step>=2){N.neonBox(svg,151,393,218,71,{role:'focus',r:14});txt(svg,260,436,'SCALE × '+fmt(p.k),'focus',34);}
  txt(svg,260,545,'B · ENLARGED','result',28);
  l=shape(svg,p,260,800,unit,true,hidden||((teach&&step<4)),{step,mode});
  if(!hidden && ((!teach)||step>=4))txt(svg,260,917,'Every matching side uses × '+fmt(p.k),'result',22);
 }else{
  txt(svg,288,170,'A · ORIGINAL','focus',31);txt(svg,831,170,'B · ENLARGED','result',31);
  s=shape(svg,p,290,435,unit,false,false,{step,mode});l=shape(svg,p,845,435,unit,true,hidden||(teach&&step<4),{step,mode});
  if(!teach||step>=2){N.neonBox(svg,464,266,185,80,{role:'focus',r:16});txt(svg,558,319,'× '+fmt(p.k),'focus',43);}
  if(!hidden&&(!teach||step>=4))txt(svg,559,574,'ALL SIDES SHARE THE SAME FACTOR','result',29);
 }
 // Do not disclose Challenge answer via side cards, narration, SVG accessible description or titles.
 aside.append(evidence('MATCHING BASE',fmt(p.small[0])+' → '+fmt(p.small[0]*p.k),p.units+' · same side, different size','focus'));
 aside.append(evidence('SCALE FACTOR','× '+fmt(p.k),'Find one pair of equal-position sides.','given'));
 aside.append(evidence('UNKNOWN SIDE',hidden?'?':fmt(expected(p))+' '+p.units,hidden?'Solve using the corresponding side.':'Second corresponding side on the enlarged figure.','result'));
 if(p.contextNote)aside.append(evidence('DENSITY CONNECTION','k³ = '+fmt(p.k**3),'At constant density, mass and volume scale together; not by k.','given'));
 art.append(svg);layout.append(art,aside);stage.append(layout);
 if(opt.showDock){const d=drawDock(p,opt);stage.append(d);}
 N.scene.helperStrip(stage,opt.pose||'point',opt.caption||'Match the sides before multiplying.');
 return {svg,small:s,large:l};
}
function drawDock(p,opt={}){
 const mobile=innerWidth<=980,w=mobile?520:1120,h=mobile?365:250;
 const svg=N.svg.root(w,h,'Drag the proposed side-length card to the matching side target. A red return tray removes your choice.');svg.classList.add('f613-svg','f613-dock');svg.dataset.kind='side-length-dock';
 txt(svg,w/2,43,opt.mode==='challenge'?'PLACE YOUR MISSING LENGTH':'DRAG A LENGTH TO THE MATCHING SIDE','given',mobile?24:32);
 const target=mobile?[260,121]:[541,113],red=mobile?[260,220]:[960,112];
 N.neonBox(svg,target[0]-117,target[1]-35,234,72,{role:'result',r:13});txt(svg,target[0],target[1]+10,opt.placed!=null?opt.choices[opt.placed]+' '+p.units:'MATCHING SIDE',opt.placed!=null?'result':'unknown',mobile?22:25);
 N.neonBox(svg,red[0]-90,red[1]-33,180,69,{role:'error',r:12});txt(svg,red[0],red[1]+10,'RETURN','error',24);
 const ch=opt.choices||choices(p),coord=mobile?ch.map((_,i)=>[83+i*116,305]):ch.map((_,i)=>[110+i*198,213]);
 ch.forEach((v,i)=>{
  const [x,y]=coord[i];const gr=E('g',{class:'f613-chip',role:'button',tabindex:'0','aria-label':fmt(v)+' '+p.units+'; drag to matching side or press Enter; Delete returns','data-choice':String(i)},svg);
  N.neonBox(gr,x-(mobile?49:68),y-26,mobile?98:136,53,{role:i===opt.placed?'result':i===0?'focus':'given',r:11});txt(gr,x,y+10,fmt(v),i===opt.placed?'result':'given',mobile?22:26);
  const zones=[{id:'side',kind:'drop',x:target[0]-116,y:target[1]-35,w:232,h:73},{id:'remove',kind:'remove',x:red[0]-90,y:red[1]-34,w:180,h:70}];
  N.ui.svgDrag(svg,gr,{box:{x:x-(mobile?49:68),y:y-26,w:mobile?98:136,h:53},zones:()=>zones,
   onDrop:id=>{if(id!=='side')return false;Promise.resolve().then(()=>opt.onPlace?.(i));return true;},
   onRemove:()=>Promise.resolve().then(()=>opt.onRemove?.(i))});
  gr.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onPlace?.(i);}else if(['Delete','Backspace','Escape'].includes(e.key)){e.preventDefault();opt.onRemove?.(i);}});
 });
 return svg;
}
function choices(p){const a=expected(p),raw=[a,p.small[1]+(p.small[0]*p.k-p.small[0]),p.small[1]/p.k,p.small[1]+p.k];const nums=[];for(const v of raw){if(!nums.some(x=>close(x,v)))nums.push(Number(v.toFixed(5)));}for(let n=1;nums.length<4;n++){const v=Number((a+0.7*n).toFixed(5));if(!nums.some(x=>close(v,x)))nums.push(v);}return nums.slice(0,4);}
// Limit fast-pointer-release cleanup to our own F6-13 chips, never mutate F0 core.
window.addEventListener('pointerup',ev=>{const d=N.ui._drag;if(!d||!d.el?.classList.contains('f613-chip'))return;Promise.resolve().then(()=>{if(N.ui._drag===d)d.up(ev);});},true);
function render(step,stage){const s=STEPS[step];const obj=draw(stage,cur(),{mode:'watch',step,pose:s.pose,caption:s.caption});emit('step',{index:step,name:s.name});if(step===6&&!N.reducedMotion())M.flash(obj.svg,innerWidth<=980?260:830,innerWidth<=980?710:370,'result',37);}
function explore(panel,stage){let id=config.preset,placed=null,msg='Drag the matching side length into the target. Keyboard: focus a card and press Enter.';
 const select=H('select',{'aria-label':'Lesson preset'});Object.entries(P.presets).forEach(([key,v])=>select.append(H('option',{value:key,text:v.label})));select.value=id;
 const menu=H('div',{class:'f613-menu'}),actions=H('div',{class:'f613-actions'}),fb=H('p',{class:'f613-feedback','aria-live':'polite'});
 menu.append(H('label',{},['Lesson context ',select]));actions.append(btn('Check matching side',check,'nova-btn primary'),btn('Hint',hint),btn('Reset',reset));
 panel.append(menu,H('p',{class:'f613-hint',text:'Find the scale factor from one pair of lengths. Place the correct corresponding length in the highlighted target.'}),actions,fb);
 function paint(pose='point',caption='Same factor for every matching length.'){const p=P.presets[id];draw(stage,p,{mode:'explore',id,showDock:true,choices:choices(p),placed,onPlace:place,onRemove:remove,pose,caption});fb.textContent=msg;}
 function place(i){placed=i;msg='Length '+fmt(choices(P.presets[id])[i])+' placed. Compare both corresponding sides.';emit('value',{preset:id,choice:i});paint('point','Compare the two lengths.');}
 function remove(){placed=null;msg='Length returned to the tray.';emit('value',{preset:id,removed:true});paint('explain','Try the matching length.');}
 function check(){const p=P.presets[id],ok=placed!=null&&close(choices(p)[placed],expected(p));msg=placed==null?'Place one side-length card before checking.':ok?'Correct! The enlargement uses the same multiplier for both pairs.':`Not yet. ${p.trap}. Use the corresponding side and multiply by the scale factor.`;fb.className='f613-feedback '+(ok?'good':'bad');emit('correct',{correct:ok,preset:id});paint(ok?'celebrate':'not-yet',ok?'Both sides have the same scale factor.':'Check the factor, not the difference.');}
 function hint(){msg='Compare '+fmt(P.presets[id].small[0])+' and '+fmt(P.presets[id].small[0]*P.presets[id].k)+'. Use their factor on the other side.';emit('hintUsed',{preset:id});paint('point-down','Find the shared multiplier.');}
 function reset(){placed=null;msg='Reset. Match the second pair of sides.';paint('explain','Start with one corresponding pair.');}
 select.onchange=()=>{id=select.value;config.preset=id;reset();};config._explore={get:()=>({id,placed,feedback:msg}),setPreset:x=>{select.value=x;select.onchange();},place,remove,check,hint,reset};paint();}
function challenge(panel,api,stage){const ids=Object.keys(P.presets);let index=0,placed=null,solved=false,completed=0,attempts=0,msg='';
 const prompt=H('p',{class:'f613-question'}),entry=H('input',{type:'text',inputmode:'decimal',placeholder:'Missing length','aria-label':'Missing corresponding length'}),actions=H('div',{class:'f613-actions'}),box=H('div',{class:'f613-menu'}),fb=H('p',{class:'f613-feedback','aria-live':'polite'}),progress=H('p',{class:'f613-progress'}),checkButton=btn('Check answer',check,'nova-btn primary'),nextButton=btn('Next similar shapes',next);nextButton.disabled=true;
 box.append(H('label',{},['Length (use shown units) ',entry]));actions.append(checkButton,btn('Hint',hint),nextButton);panel.append(prompt,box,actions,fb,progress);
 const p=()=>P.presets[ids[index]];
 function paint(){const v=p();prompt.textContent=(index+1)+' / '+ids.length+' · '+v.context+' Find the missing corresponding length in '+v.units+'.';progress.textContent='Correctly solved: '+completed+' / '+ids.length;draw(stage,v,{mode:'challenge',id:ids[index],solved,placed,choices:choices(v),showDock:!solved,onPlace:place,onRemove:remove,pose:solved?'celebrate':'think',caption:solved?'Matching sides proved.':'Apply the same scale factor.'});fb.textContent=msg;}
 function place(i){if(solved)return;placed=i;emit('value',{preset:ids[index],choice:i});msg='Length placed. Enter the missing value and check.';paint();}
 function remove(){if(solved)return;placed=null;msg='Length removed. Try another.';paint();}
 function check(){if(solved)return;attempts++;const v=p(),s=entry.value.trim().replace(',','.'),n=s!==''?Number(s):NaN,want=expected(v);
 let ok=false,reason='';
 if(!Number.isFinite(n))reason='Enter a number for the missing length.';
 else if(!close(n,want)){if(close(n,v.small[1]+v.k))reason='You added the factor instead of multiplying. Similarity uses multiplication.';
 else if(close(n,v.small[1]/v.k))reason='The scale factor has been reversed. This shape is enlarged, not reduced.';
 else if(v.shape==='rectangle'&&close(n,v.small[0]*v.k))reason='You used the other side. Match the corresponding side before multiplying.';
 else reason='Not yet. Find the factor from the known pair, then multiply the matching side.';}
 else if(placed==null)reason='The length is correct. Place the matching side card too.';
 else if(!close(choices(v)[placed],want))reason='Your number is correct, but the length card does not match the side. Try another card.';
 else {ok=true;reason='Correct! '+fmt(v.small[1])+' × '+fmt(v.k)+' = '+fmt(want)+' '+v.units+'.';}
 api.check(ok,reason,{preset:ids[index],expected:want,actual:Number.isFinite(n)?n:null,placed});emit('correct',{correct:ok,preset:ids[index]});msg=reason;fb.className='f613-feedback '+(ok?'good':'bad');if(ok){solved=true;completed++;checkButton.disabled=true;nextButton.disabled=false;paint();const s=stage.querySelector('svg');if(s)M.flash(s,260,300,'result',35);}else paint();}
 function hint(){msg='Corresponding sides give '+fmt(vsmall(0))+' → '+fmt(vsmall(0)*p().k)+'. Use the SAME factor for '+fmt(vsmall(1))+'.';api.hint(msg);emit('hintUsed',{preset:ids[index]});paint();}
 function vsmall(i){return p().small[i];}
 function next(){if(!solved)return;if(index===ids.length-1){prompt.textContent='All five similar-shapes challenges completed.';box.hidden=true;actions.hidden=true;stage.innerHTML='';N.cap(stage,ID,'SIMILARITY COMPLETE');N.scene.helperStrip(stage,'celebrate','You used the same factor for every matching length.');return;}
 index++;placed=null;solved=false;entry.value='';msg='';checkButton.disabled=false;nextButton.disabled=true;paint();}
 entry.addEventListener('keydown',e=>{if(e.key==='Enter')check();});config._challenge={get:()=>({index,placed,solved,completed,attempts,feedback:msg}),place,remove,setAnswer:v=>{entry.value=String(v);},check,hint,next};paint();}
const DEF={id:ID,title:'Proportion in Geometry · F14-11 Preset Preview',config,steps:STEPS,render,explore,challenge,
 alt:'Two similar neon shapes with side lengths. Match a known corresponding side, find the enlargement factor and solve the unknown matching length.',
 staticAlt:'Example: a 3 cm by 4 cm right-triangle scaled by factor 2 becomes 6 cm by 8 cm; all corresponding sides share factor 2.',
 spec:{purpose:'Understand scale factor on corresponding lengths of similar shapes, with a density extension that distinguishes linear, area and volume scaling.',params:'Shape type, corresponding lengths, linear scale factor, missing side, unit and task context.',presets:'Y7-064 scale drawings; Y8-057 similarity; Y9-021 maps and figures; Y9-023 constant-density similar tanks; Y9-029 similarity reasoning.',steps:'Meet figures → pair sides → factor → scale every side → predict length → compare ratios → consolidate.',interactions:'Drag length to matching side with SVG snap zones, keyboard Enter/Delete, red remove tray; Challenge number and placement marking.',traps:'Additive rather than multiplicative scaling, swapping correspondence, reversing k, confusing k with k² or k³.',gcse:'Area scale k², volume and mass at constant density k³; justify correspondence.'}};
N.bankMount({id:ID,num:'F6·13',title:DEF.title,spec:DEF.spec,def:DEF,years:'Years 7–9; GCSE scale-factor extension',linked:['F0-02','F4-07 (ratio bars)','F6-07','F6-09','F14-11 (host pending)']});
window.F613_PREVIEW={config,math:{expected,close,choices},steps:STEPS};
})();
