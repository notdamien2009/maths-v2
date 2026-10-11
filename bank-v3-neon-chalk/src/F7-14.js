/* NOVA F7-14 · Identity Visualiser. F0 authoritative neon/chalk core; F2 SVG drag. Review candidate. */
const F714_CONFIG={id:'F7-14',startMode:'watch',preset:'Y9-006-algebraic-identity',
 parameters:{powers:['x2','x','one'],maxTokens:18,sampleX:2},
 presets:{
 'Y9-006-algebraic-identity':{label:'Year 9 · Distributive identity',left:'2(x + 1)',right:'2x + 2',A:{x2:0,x:2,one:2},B:{x2:0,x:2,one:2},context:'Distributing a number does not change the expression.'},
 'Y9-006-quadratic':{label:'Year 9 · Quadratic identity',left:'(x + 2)(x + 1)',right:'x² + 3x + 2',A:{x2:1,x:3,one:2},B:{x2:1,x:3,one:2},context:'Four area products collected into three tile families.'},
 'Y9-006-cancellation':{label:'Year 9 · Difference of squares',left:'(x + 1)(x − 1)',right:'x² − 1',A:{x2:1,x:0,one:-1},B:{x2:1,x:0,one:-1},context:'Two x terms cancel while the constant is negative.'},
 'Y9-006-false':{label:'Watch the missed term',left:'(x + 1)²',right:'x² + 1',A:{x2:1,x:2,one:1},B:{x2:1,x:0,one:1},context:'Squaring a bracket also creates two x terms.'},
 'Y9-006-single-value':{label:'One equal value is not an identity',left:'x² + x',right:'x²',A:{x2:1,x:1,one:0},B:{x2:1,x:0,one:0},context:'These are equal when x is zero but not for every x.'},
 'Y9-006-signed':{label:'Signed coefficients',left:'3x − 2x − 1',right:'x − 1',A:{x2:0,x:1,one:-1},B:{x2:0,x:1,one:-1},context:'Combine signed terms before comparing.'}
 },
 challenge:[
 {left:'2(x + 1)',right:'2x + 2',A:{x2:0,x:2,one:2},B:{x2:0,x:2,one:2}},
 {left:'2(x + 2)',right:'2x + 2',A:{x2:0,x:2,one:4},B:{x2:0,x:2,one:2}},
 {left:'(x + 1)(x − 1)',right:'x² − 1',A:{x2:1,x:0,one:-1},B:{x2:1,x:0,one:-1}},
 {left:'(x + 1)²',right:'x² + 1',A:{x2:1,x:2,one:1},B:{x2:1,x:0,one:1}}
 ],
 events:{value:['preset','place','return','undo','reset','compare','answer','round','hint','keyboard','complete'],types:['step','correct','hintUsed','mode']}};
window.F714_CONFIG=F714_CONFIG;
(function(){'use strict';
const N=window.NOVA,E=N.svg.el,H=N.h,C=F714_CONFIG,ID=C.id;
const EMOTIONS={notice:['think','Do both sides mean the same?'],expand:['point','Show what each expression contains!'],left:['count','Build the left-hand tiles!'],right:['point','Now build the right-hand side!'],compare:['think','Compare each signed tile family!'],proof:['cheer','Same tiles means a true identity!'],explore:['point','Place each tile on its own mat!'],placed:['count','Good! Keep each tile on its side.'],wrong:['oops','Check the coefficients, not the order!'],hint:['think','x², x and units count separately!'],return:['point','That tile is back in the tray!'],win:['cheer','Four identity decisions proved!'],correct:['cheer','That comparison is correct!']};
const STEPS=[
 {name:'Notice the two expressions',cue:'notice',narration:'Two expressions can look different. We must find out whether their values agree for every possible x, not just one number.',prompt:'What does the equals sign claim?'},
 {name:'Reveal their algebra tiles',cue:'expand',narration:'Expand each expression into x rods and small unit squares. The tile families show which powers of x we have.',prompt:'Which tiles represent an x and which represent one?'},
 {name:'Build the left-hand mat',cue:'left',narration:'The first expression, two lots of x plus one, becomes two x rods and two unit squares.',prompt:'What does each bracket contribute?'},
 {name:'Build the right-hand mat',cue:'right',narration:'The second expression, two x plus two, contains the same two x rods and two unit squares.',prompt:'Have we kept the values and signs?'},
 {name:'Compare each tile family',cue:'compare',narration:'Both sides have zero x squared tiles, two positive x rods and two positive unit squares. Every corresponding coefficient matches.',prompt:'Which three coefficients must match for an identity?'},
 {name:'Prove the identity',cue:'proof',narration:'These expressions are identical for every x. Rearrangement has changed their appearance but never their value.',prompt:'Would choosing a different value of x change this conclusion?'}
];
const emit=(key,value)=>{if(!C.events.value.includes(key))throw Error('F7-14 undeclared event '+key);N.events.emit('value',{engine:ID,key,value});};
const text=(p,x,y,s,role='given',size=32,anchor='middle')=>N.chalkText(p,x,y,String(s),{role,size,anchor});
const frame=(p,x,y,w,h,role='given',radius=14)=>N.neonBox(p,x,y,w,h,{role,r:radius});
const line=(p,x,y,X,Y,role='op',width=2.4)=>N.neonLine(p,x,y,X,Y,{role,width});
const btn=(label,callback,primary=false)=>H('button',{class:'nova-btn'+(primary?' primary':''),text:label,onclick:callback});
const keys=['x2','x','one'];
function assertTask(p){for(const side of ['A','B'])for(const k of keys){if(!Number.isInteger(p?.[side]?.[k])||Math.abs(p[side][k])>8)throw Error('Invalid polynomial '+side+'.'+k);}return p;}
function same(p){assertTask(p);return keys.every(k=>p.A[k]===p.B[k]);}
function evaluate(c,x){return c.x2*x*x+c.x*x+c.one;}
function symbolic(c){let result='';for(const [k,v] of [['x2','x²'],['x','x'],['one','']]){const a=c[k];if(!a)continue;const body=k==='one'?String(Math.abs(a)):(Math.abs(a)===1?'':Math.abs(a))+v;result+=(result?(a<0?' − ':' + '):(a<0?'−':''))+body;}return result||'0';}
function describeDifference(p){const k=keys.find(key=>p.A[key]!==p.B[key]);if(!k)return 'The x², x and unit coefficients match on both sides.';const name=k==='x2'?'x²':k==='x'?'x':'unit';return `The ${name} coefficients differ: ${p.A[k]} on the left, ${p.B[k]} on the right. Equality at one x value is not enough.`;}
function tokensFor(p){assertTask(p);let id=0,t=[];for(const side of ['left','right'])for(const k of keys){let n=p[side==='left'?'A':'B'][k];for(let j=0;j<Math.abs(n);j++)t.push({id:'p'+(++id),side,type:k,sign:n<0?-1:1,home:'tray'});}if(t.length>C.parameters.maxTokens)throw Error('Too many drawn tokens');return t;}
function counts(tiles,side){const c={x2:0,x:0,one:0};for(const t of tiles)if(t.home===side)c[t.type]+=t.sign;return c;}
function geometry(mobile){return mobile?{W:640,H:1120,left:{x:17,y:105,w:606,h:292},right:{x:17,y:429,w:606,h:292},tray:{x:18,y:765,w:605,h:233},return:{x:388,y:1021,w:234,h:78},tile:{x2:[61,61],x:[75,43],one:[50,50]},cols:4,dx:138,dy:67,header:53}:{W:1200,H:768,left:{x:23,y:116,w:556,h:392},right:{x:619,y:116,w:556,h:392},tray:{x:26,y:562,w:935,h:171},return:{x:981,y:582,w:196,h:91},tile:{x2:[77,77],x:[91,50],one:[60,60]},cols:5,dx:101,dy:86,header:57};}
function homePositions(ts,g,mobile){const pos={};for(const side of ['left','right']){const arr=ts.filter(t=>t.home===side);arr.forEach((t,i)=>{const z=g[side],col=i%g.cols,row=Math.floor(i/g.cols);pos[t.id]={x:z.x+27+col*g.dx,y:z.y+91+row*g.dy};});}
 const rest=ts.filter(t=>t.home==='tray');const cols=mobile?6:10;rest.forEach((t,i)=>{const col=i%cols,row=Math.floor(i/cols);pos[t.id]={x:g.tray.x+18+col*(mobile?98:89),y:g.tray.y+(mobile?66:50)+row*(mobile?57:58)};});return pos;}
function piece(s,t,x,y,g,mini){const d=g.tile[t.type],w=mini?Math.round(d[0]*.77):d[0],h=mini?Math.round(d[1]*.77):d[1],role=t.sign<0?'error':t.type==='x2'?'focus':t.type==='x'?'given':'result';
 frame(s,x,y,w,h,role,8);line(s,x+7,y+9,x+w-7,y+9,role,2.2);
 if(t.sign<0){for(let i=12;i<w-7;i+=16)line(s,x+i,y+h-8,x+i+6,y+h-17,'error',2.5);}
 let label=t.type==='x2'?'x²':t.type==='x'?'x':'1';text(s,x+w/2,y+h/2+(mini?9:13),(t.sign<0?'−':'')+label,role,mini?29:36);
 return {x,y,w,h};}
function matSvg(p,tiles,options={}){const mobile=window.innerWidth<=700,g=geometry(mobile),revealed=!!options.reveal,interactive=!!options.interactive,done=tiles.every(t=>t.home!=='tray');
 const graphic=N.svg.root(g.W,g.H,`Identity visualiser. Left expression ${p.left}; right expression ${p.right}. Compare signed x-squared, x and unit tiles to decide whether coefficients agree for every x.`);
 graphic.classList.add('f714-svg');if(!interactive&&done)graphic.setAttribute('viewBox',`0 0 ${g.W} ${mobile?794:575}`);graphic.dataset.identity=String(same(p));graphic.dataset.placed=String(tiles.filter(t=>t.home!=='tray').length);graphic.dataset.total=String(tiles.length);graphic.dataset.revealed=String(revealed);graphic.dataset.mode=options.mode||'watch';
 text(graphic,32,52,'Compare the two expressions','given',mobile?41:53,'start');
 for(const side of ['left','right']){const z=g[side],role=side==='left'?'focus':'op',c=side==='left'?p.A:p.B;
 frame(graphic,z.x,z.y,z.w,z.h,revealed&&done&&same(p)?'result':role,17);
 text(graphic,z.x+24,z.y+40,side==='left'?'Left expression':'Right expression',role, mobile?36:38,'start');
 text(graphic,z.x+z.w-21,z.y+39,side==='left'?'L':'R','support',30,'end');
 text(graphic,z.x+z.w/2,z.y+77,side==='left'?p.left:p.right,'given',mobile?35:37);
 if(revealed){text(graphic,z.x+z.w/2,z.y+z.h-26,symbolic(c),same(p)?'result':'error',mobile?35:41);}
 if(done&&revealed&&same(p)){N.neonRing(graphic,z.x+z.w-42,z.y+z.h-34,{role:'result',r:13,pulse:false});}
 }
 if(interactive){frame(graphic,g.return.x,g.return.y,g.return.w,g.return.h,'error',12);text(graphic,g.return.x+g.return.w/2,g.return.y+g.return.h/2+12,'Return tiles','error',mobile?36:34);}
 if(interactive||!done){frame(graphic,g.tray.x,g.tray.y,g.tray.w,g.tray.h,'support',14);
 text(graphic,g.tray.x+20,g.tray.y+37,interactive?'Tile tray — drag or press L / R':'Same signed tiles · build both mats','support',mobile?30:32,'start');}
 const pos=homePositions(tiles,g,mobile);
 for(const t of tiles){const o=pos[t.id],part=E('g',{'data-f714-id':t.id,'data-side':t.side,'data-home':t.home,'data-type':t.type,'data-sign':t.sign,role:'button',tabindex:interactive?0:-1,'aria-label':`${t.sign<0?'Negative ':'Positive '}${t.type==='x2'?'x squared':t.type==='x'?'x':'unit'} tile belonging to the ${t.side} expression. Press Enter or ${t.side==='left'?'L':'R'} to place; Delete returns to tray.`},graphic);
 const bounds=piece(part,t,o.x,o.y,g,t.home==='tray');
 if(interactive){part.addEventListener('keydown',event=>{const code=event.code;let dest=null;if(['Enter','Space'].includes(code)||code===(t.side==='left'?'KeyL':'KeyR'))dest=t.side;else if(['Backspace','Delete','KeyT'].includes(code))dest='tray';else if(code==='KeyL'||code==='KeyR')dest=code==='KeyL'?'left':'right';if(dest){event.preventDefault();options.move(t.id,dest,'keyboard');}});
 N.ui.svgDrag(graphic,part,{box:bounds,zones:()=>[{id:'left',kind:'drop',...g.left},{id:'right',kind:'drop',...g.right},{id:'tray',kind:'drop',...g.tray},{id:'return',kind:'remove',...g.return}],onDrop:dest=>options.move(t.id,dest,'drag'),onRemove:()=>options.move(t.id,'tray','drag'),canStart:()=>!options.finished});}
 else if(options.animate&&!N.reducedMotion()&&t.home!=='tray')N.motion.arrive(part,0,-22,240,N.motion.ease.back);
 }
 if(revealed&&done){text(graphic,g.W/2,mobile?746:545,same(p)?'Same coefficients · identity':'Different coefficients · not an identity',same(p)?'result':'error',mobile?35:35);if(same(p)&&options.celebrate)N.motion.flash(graphic,g.W/2,mobile?735:545,'result',68);}
 return graphic;
}
function helper(stage,cue){const [pose,msg]=EMOTIONS[cue]||EMOTIONS.notice;N.scene.helperStrip(stage,pose,msg);}
function renderStage(stage,p,ts,o={}){stage.textContent='';N.cap(stage,'Identity workshop',o.caption||'Compare each matching kind of signed algebra tile.');const layout=H('div',{class:'f714-layout'}),aside=H('aside',{class:'f714-side'});
 aside.append(N.neonCard([H('strong',{text:'What makes an identity?'}),H('p',{text:'Both expressions have the same coefficient of x², of x and of 1. Then they agree for every possible x.'})],{role:'focus'}),N.neonCard([H('strong',{text:'One matching value is not enough'}),H('p',{text:'Two different polynomials might be equal for one x. Compare every coefficient, or find a counterexample.'})],{role:'op'}));
 layout.append(matSvg(p,ts,o),aside);stage.append(layout);
 const status=H('div',{class:'f714-proof'+(o.reveal?' revealed':'')});status.append(H('span',{class:'f714-kicker',text:o.reveal?'PROOF':'COMPARE'}),H('strong',{text:o.reveal?(same(p)?'Identical for every x.':'Not identical for every x.'):'Build both tile mats to compare.'}));stage.append(status);helper(stage,o.cue||'notice');}
function watch(i,stage){const p=C.presets['Y9-006-algebraic-identity'];const ts=tokensFor(p);if(i>=2){ts.filter(t=>t.side==='left').forEach(t=>t.home='left');}if(i>=3){ts.filter(t=>t.side==='right').forEach(t=>t.home='right');}renderStage(stage,p,ts,{caption:STEPS[i].name,mode:'watch',reveal:i>=4,celebrate:i===5,animate:i===2||i===3,cue:['notice','expand','left','right','compare','proof'][i]});}
function workspace(panel,stage,mode,api){let preset=C.preset,round=0,ts=[],history=[],bad=false,message='',cue=mode==='challenge'?'notice':'explore',revealed=false,finished=false;
 const p=()=>mode==='challenge'?C.challenge[Math.min(round,C.challenge.length-1)]:C.presets[preset];
 function start(){ts=tokensFor(p());history=[];bad=false;revealed=false;cue=mode==='challenge'?'notice':'explore';message='Build both mats, then compare x², x and unit coefficients.';}
 function save(){history.push(ts.map(t=>({...t})));if(history.length>50)history.shift();}
 function move(id,dest,method='drag'){if(finished)return false;if(dest==='return')dest='tray';const t=ts.find(t=>t.id===id);if(!t||!['left','right','tray'].includes(dest))return false;
 if(dest!=='tray'&&t.side!==dest){bad=true;cue='wrong';message='This tile belongs to the '+t.side+' expression. Keep the terms on their original sides.';update();return false;}
 if(t.home===dest)return true;save();t.home=dest;revealed=false;bad=false;cue=dest==='tray'?'return':'placed';message=dest==='tray'?'Tile returned safely to the tray.':`Placed a ${t.sign<0?'negative ':'positive '}${t.type==='x2'?'x²':t.type==='x'?'x':'unit'} tile on the ${dest} mat.`;
 emit(method==='keyboard'?'keyboard':dest==='tray'?'return':'place',{id,type:t.type,sign:t.sign,side:dest,count:ts.filter(v=>v.home!=='tray').length});draw();return true;}
 function undo(){if(!history.length)return;ts=history.pop();bad=false;revealed=false;cue='return';message='The last placement was undone.';emit('undo',{mode,round});draw();}
 function reset(){start();emit('reset',{mode,round});draw();}
 function hint(){const t=ts.find(x=>x.home==='tray');message=t?`Look for the ${t.side} mat: it needs this ${t.sign<0?'negative':'positive'} ${t.type==='x2'?'x-squared':t.type==='x'?'x':'unit'} tile.`:'The mats are complete. Compare signed coefficients for x², x and units.';cue='hint';bad=false;api?.hint(message);emit('hint',{round,mode});draw();}
 function auto(){if(finished)return;save();ts.forEach(t=>t.home=t.side);revealed=false;bad=false;cue='compare';message='Both expressions are built. Now compare the corresponding tile families.';emit('place',{method:'build-all',count:ts.length});draw();}
 function compare(){if(ts.some(t=>t.home==='tray')){bad=true;cue='wrong';message='Finish both mats before checking the coefficients.';draw();return;}revealed=true;bad=false;cue=same(p())?'proof':'compare';message=same(p())?'The signed coefficients match. These expressions are identical for every x.':`${describeDifference(p())} For x = 2: left ${evaluate(p().A,2)}, right ${evaluate(p().B,2)}.`;emit('compare',{identity:same(p()),coefficients:[p().A,p().B]});draw();}
 function answer(choice){if(finished)return;if(ts.some(t=>t.home==='tray')){bad=true;cue='wrong';message='Place all tiles before deciding. Or use Build both mats.';api?.check(false,message,{round});draw();return;}
 const expected=same(p()),correct=choice===expected;emit('answer',{round,choice,expected});if(!correct){bad=true;cue='wrong';message=expected?'The signed x², x and unit coefficients match. A rearrangement does not change their value.':describeDifference(p());api?.check(false,message,{round});draw();return;}
 api?.check(true,'Correct. You compared the signed coefficients.',{round});emit('round',{round:round+1,identity:expected});round++;if(round>=C.challenge.length){finished=true;revealed=true;cue='win';message='All four identities and non-identities identified correctly.';emit('complete',{rounds:4});draw();return;}start();message='Correct! Now compare the next pair.';cue='correct';draw();}
 function update(){const st=panel.querySelector('#f714-status');if(st){st.textContent=message;st.classList.toggle('bad',bad);} }
 function controls(){panel.replaceChildren();if(finished){panel.append(H('p',{class:'f714-win',text:'Four comparisons complete — you know when an equation is an identity.'}),btn('Try again',()=>{round=0;finished=false;start();draw();},true));return;}
 if(mode==='explore'){const sel=H('select',{'aria-label':'Choose identity teaching preset'});for(const [key,p] of Object.entries(C.presets))sel.add(new Option(p.label,key));sel.value=preset;sel.onchange=()=>{preset=sel.value;C.preset=preset;emit('preset',preset);start();draw();};panel.append(H('div',{class:'f714-toolbar'},[H('label',{},['Choose an identity',sel]),btn('Build both mats',auto),btn('Compare',compare,true),btn('Hint',hint),btn('Undo',undo),btn('Reset',reset)]));}
 else panel.append(H('div',{class:'f714-toolbar'},[H('span',{class:'f714-task',text:`Challenge ${round+1} of ${C.challenge.length}: ${p().left}   ?=   ${p().right}`}),btn('Build both mats',auto),btn('Identity',()=>answer(true),true),btn('Not identity',()=>answer(false),true),btn('Hint',hint),btn('Undo',undo),btn('Reset',reset)]));
 panel.append(H('p',{class:'f714-direction',text:'Drag each signed tile from the tray to its own expression mat. Keyboard: focus a tile, press Enter or L/R to place it; Delete returns it. Escape cancels a drag.'}),H('p',{id:'f714-status',class:'f714-status'+(bad?' bad':''),role:'status',text:message}));}
 function draw(){renderStage(stage,p(),ts,{caption:mode==='challenge'?`Challenge ${round+1} of 4`:'Build and compare expressions',mode,interactive:!finished,reveal:revealed||finished,cue,finished,celebrate:finished,move});controls();}
 start();draw();}
const def={id:ID,title:'Identity Visualiser',config:C,steps:STEPS,alt:'Two neon algebra tile mats show x-squared squares, x rods and unit squares for two expressions; signed tiles are hatched red. Compare all three coefficients.',staticAlt:'Two algebraic expressions are identities if their signed x-squared, x and unit coefficients agree. Test by rearranging and comparing equivalent tile mats.',render:watch,exploreIntro:'Place signed terms on their original sides and compare coefficient by coefficient.',explore(panel,stage){workspace(panel,stage,'explore');},challenge(panel,api,stage){workspace(panel,stage,'challenge',api);},onRestore(){}};
N.registry.add({id:ID,title:def.title,topics:['algebra','identities','equivalence','tile models','signed coefficients'],deps:['F0-02','F7-01','F7-03','F7-05']});
N.bankMount({id:ID,num:'14',title:'Identity Visualiser · Premium Review',def,linked:['F7-01','F7-03','F7-05','F7-13'],years:'Year 9 / GCSE',spec:{purpose:'Compare signed algebra tile coefficients across two expression mats and decide whether equality holds for every x.',params:'Two polynomial coefficient vectors for x², x and units; positive and negative tokens; maximum 18 tiles.',presets:'Y9 algebraic equivalence, quadratic expansion, difference of squares, false square-of-sum, same-value trap, signed equivalence.',steps:'Notice → reveal tiles → build left → build right → compare coefficients → identity proof.',interactions:'F0/F2 SVG drag between tray and own mat, keyboard L/R/Enter, Return, undo, reset, hint, four true/false Challenge rounds.',traps:'Assuming equality at x=0 is an identity; forgetting cross-terms when squaring; mixing x², x and constants; ignoring negative signs.',gcse:'Identity verification for quadratic expansions and factorisation; no reliance on a single substituted number.'}});
(function(){const host=document.getElementById(ID);let pointer=null;window.addEventListener('pointerdown',e=>{const el=e.target.closest?.('[data-drag="1"]');if(el&&host.contains(el))pointer=e.pointerId;},true);
 window.addEventListener('pointermove',e=>{const d=N.ui._drag;if(!d?.el||!host.contains(d.el)||pointer!==e.pointerId)return;if(d.el.contains(e.target)||d.el.hasPointerCapture?.(e.pointerId))return;d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons,bubbles:false}));},true);
 window.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;const d=N.ui._drag;if(d?.el&&host.contains(d.el)&&!d.el.contains(e.target))d.up(e);pointer=null;},true);
 window.addEventListener('pointercancel',e=>{if(pointer!==e.pointerId)return;pointer=null;const d=N.ui._drag;if(d?.el&&host.contains(d.el))N.ui.cancelDrag();},true);window.addEventListener('blur',()=>pointer=null);})();
const card=document.getElementById(ID),details=H('details',{class:'nv-dev'});details.append(H('summary',{text:'Developer: component specification'}));card.querySelectorAll('details.nova-spec,p.purpose').forEach(x=>details.append(x));card.append(details);
const setAlts=()=>card.querySelectorAll('img').forEach(x=>{if(!x.getAttribute('alt'))x.alt='NOVA mathematics tutor helper';});setAlts();new MutationObserver(setAlts).observe(card,{subtree:true,childList:true});
window.F714_MATH={same,evaluate,symbolic,tokensFor,counts,describeDifference,geometry};
})();
