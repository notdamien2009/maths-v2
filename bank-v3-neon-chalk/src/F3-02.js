/* NOVA F3-02 — canonical-core area-model engine, fresh 2026-10-10 master prompt.
   Only the original NOVA house SVG, motion, drag, maths renderer and UI APIs draw maths.
*/
const F302_CONFIG={id:'F3-02',startMode:'watch',preset:'Y7-009-whole-decimal-multiplication',
  presets:{
   'Y7-009-whole-decimal-multiplication':{label:'Whole number multiplication',kind:'numeric',x:[20,3],y:[10,4]},
   'Y7-022-fraction-add-subtract':{label:'Fraction addition / subtraction',kind:'fraction-add',den:6,a:3,b:2,op:'+',wholes:0},
   'Y7-023-multiplying-fractions':{label:'Fraction of a fraction',kind:'fraction-product',a:2,b:3,c:3,d:4},
   'Y7-031-single-brackets':{label:'Expanding a single bracket',kind:'single',factor:3,constant:2},
   'Y7-032-factorising-common-factor':{label:'Factorising common terms',kind:'factorise',factor:3,constant:2},
   'Y8-005-mixed-number-fractions':{label:'Mixed-number addition / subtraction',kind:'fraction-add',den:4,a:6,b:3,op:'+',wholes:0},
   'Y8-011-double-brackets':{label:'Expanding double brackets',kind:'double',xConst:3,yConst:2},
   'Y9-006-algebraic-equivalence':{label:'Equivalent algebraic expressions',kind:'double',xConst:3,yConst:2},
   'F5-03-area-model-fractions':{label:'F5-03 · Fractions area preset',kind:'fraction-product',a:2,b:3,c:3,d:4},
   'F7-04-expanding-single-brackets':{label:'F7-04 · Single bracket preset',kind:'single',factor:3,constant:2},
   'F7-05-expanding-double-brackets':{label:'F7-05 · Double bracket preset',kind:'double',xConst:3,yConst:2},
   'decimal-tenths':{label:'Decimal tenths',kind:'numeric',x:[2,.3],y:[1,.4]}
  },events:{value:['preset','width','height','splitX','splitY','placedPart','removedPart','targetPart','total','fractionSelection','challengeTask'],types:['step','correct','hintUsed','mode']},
  challenge:{tasks:['whole','decimal','algebra']}
};
(function(){'use strict';
const N=window.NOVA,H=N.h,E=N.svg.el,C=F302_CONFIG,id=C.id;
function corePose(p){
 // F0 owns the helper art, placement and motion. Only its universal slots are supplied to its dock.
 const slots=['idle','think','cheer','oops','point','explain','walk','leap'];
 const map={'ruler':'point','point-left':'point','point-right':'point','point-down':'point','show-one':'point','show-two':'point','show-three':'point','count':'point','magnify':'think','idea':'think','compare':'think','high-five':'cheer','celebrate':'cheer','success':'cheer','read-tablet':'think','checking':'think','not-yet':'oops','question':'think','encourage':'cheer'};
 return slots.includes(p)?p:(map[p]||'explain');
}
const roles=['given','focus','op','result'];
const TALK={
 outline:{skin:'pip',pose:'explain',text:'We measure both sides first. Their product is the area inside the rectangle.'},
 partition:{skin:'pip',pose:'point-right',text:'Split each side into friendly parts, and keep each length accounted for.'},
 'part-1':{skin:'nova',pose:'explain-right',text:'Start with the top-left region. Its side lengths multiply, not add.'},
 'part-2':{skin:'pip',pose:'point-right',text:'The top-right region has the same height and its own width.'},
 'part-3':{skin:'pip',pose:'think',text:'Now the lower-left region. Each partition gives a different partial product.'},
 'part-4':{skin:'pip',pose:'idea',text:'Four parts fill the original whole without gaps or overlaps.'},
 'partials':{skin:'nova',pose:'explain-left',text:'Add the four partial products: the parts exactly rebuild the rectangle.'},
 total:{skin:'pip',pose:'celebrate',text:'The distributive law guarantees that the parts have the same total as the original product.'},
 explore:{skin:'pip',pose:'idea',text:'Drag the amber handles. The partitions change, but the original product stays fixed.'},
 fraction:{skin:'nova',pose:'checking',text:'Both fractions divide the same whole. The green overlap is the fraction of a fraction.'},
 'fraction-add':{skin:'pip',pose:'explain',text:'Make equal-sized parts first. Add or remove the parts without changing the size of one whole.'},
 challenge:{skin:'teen',pose:'think',text:'Place each partial product in its correct region. Check every part before the whole.'}
};
const f=(n)=>{if(typeof n==='string')return n;const v=Math.round(n*1e6)/1e6;return String(v).replace(/\.0+$/,'');};
const frac=(a,b)=>String.raw`\frac{${a}}{${b}}`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
function arithmetic(x,y){const parts=[y[0]*x[0],y[0]*x[1],y[1]*x[0],y[1]*x[1]],total=+(parts.reduce((a,b)=>a+b,0)).toFixed(9);return {parts,total,answer:+((x[0]+x[1])*(y[0]+y[1])).toFixed(9)};}
const math={arithmetic,fractionProduct:(a,b,c,d)=>{if(![a,b,c,d].every(Number.isInteger)||b<=0||d<=0||a<0||c<0||a>b||c>d)throw Error('invalid fractions');const n=a*c,den=b*d,g=gcd(n,den);return {numerator:n,denominator:den,simplified:[n/g,den/g]};},fractionAddition:(den,a,b,op='+')=>{if(![den,a,b].every(Number.isInteger)||den<=0||a<0||b<0||(op==='-'&&b>a))throw Error('invalid parts');const num=op==='-'?a-b:a+b,g=gcd(num,den);return {numerator:num,denominator:den,whole:Math.floor(num/den),remainder:num%den,simplified:[num/g,den/g]};}};
math.areaGeometry={overlap:(a,b,c,d)=>{const q=math.fractionProduct(a,b,c,d);return {selected:q.numerator,total:q.denominator,columns:b,rows:d,simplified:q.simplified};}};window.F302_MATH=math;
function value(key,v){if(!C.events.value.includes(key))throw Error('Unknown F3-02 event key '+key);N.events.emit('value',{engine:id,key,value:v});}
function svgRoot(alt){return N.svg.root(760,605,alt);}
function tx(p,x,y,text,size=22,role='given'){return N.chalkText(p,x,y,String(text),{size,role});}
function bx(p,x,y,w,h,role='given',text=null,size=21){return N.neonBox(p,x,y,w,h,{role,text,size,r:12});}
function ln(p,x,y,X,Y,role='op',width=3){return N.neonLine(p,x,y,X,Y,{role,width});}
function ring(p,x,y,role='result',radius=10){return N.neonRing(p,x,y,{role,r:radius,pulse:false});}
function btn(name,fn,cl='nova-btn'){return H('button',{class:cl,text:name,onclick:fn});}
function kindOf(p){return p.kind||'numeric';}
function model(p){const kind=kindOf(p);
 if(kind==='numeric'){const x=p.x||[20,3],y=p.y||[10,4],ans=arithmetic(x,y);return {kind,x:x.map(f),y:y.map(f),parts:ans.parts.map(f),total:f(ans.total),head:f(+x[0]+ +x[1])+' × '+f(+y[0]+ +y[1]),proof:ans.parts.map(f).join(' + ')+' = '+f(ans.total),geometry:ans,ratio:[+x[0]/(+x[0]+ +x[1]),+y[0]/(+y[0]+ +y[1])]};}
 if(kind==='single'||kind==='factorise'){let k=+p.factor||3,t=+p.constant||2;return {kind,x:['x',f(t)],y:[f(k),''],parts:[f(k)+'x',f(k*t)],total:f(k)+'x + '+f(k*t),head:kind==='single'?f(k)+'(x + '+f(t)+')':f(k)+'x + '+f(k*t),proof:kind==='single'?f(k)+'x + '+f(k*t):f(k)+'(x + '+f(t)+')',ratio:[.62,1],active:2};}
 if(kind==='double'){let a=+p.xConst||3,b=+p.yConst||2;return {kind,x:['x',f(a)],y:['x',f(b)],parts:['x²',f(a)+'x',f(b)+'x',f(a*b)],total:'x² + '+f(a+b)+'x + '+f(a*b),head:'(x + '+f(a)+')(x + '+f(b)+')',proof:'x² + '+f(a)+'x + '+f(b)+'x + '+f(a*b),ratio:[.59,.58]};}
 return {kind};}
function dims(data){const x=158,y=138,w=470,h=322,splitX=x+Math.max(.13,Math.min(.87,data.ratio[0]))*w,splitY=y+(data.active===2?1:Math.max(.13,Math.min(.87,data.ratio[1])))*h;return {x,y,w,h,splitX,splitY,widths:[splitX-x,x+w-splitX],heights:[splitY-y,y+h-splitY]};}
function areaSvg(p,opt={}){
 const data=model(p),s=svgRoot('Area model: '+(data.head||'equal part grid')+'; mathematical area evidence shown by neon rectangles and chalk labels.');
 if(data.kind==='fraction-product'||data.kind==='fraction-add')return fractionalSvg(s,p,opt);
 const d=dims(data),parts=data.parts,n=opt.reveal==null?4:opt.reveal;
 bx(s,d.x-5,d.y-5,d.w+10,d.h+10,'support');
 const partsG=E('g',{class:'f302-region-group'},s);
 const regions=[];
 for(let i=0;i<(data.active||4);i++){
  const col=i%2,row=Math.floor(i/2),x=d.x+(col?d.widths[0]:0),y=d.y+(row?d.heights[0]:0),w=d.widths[col],h=d.heights[row],centerX=x+w/2,centerY=y+h/2;
  regions.push({x,y,w,h,cx:centerX,cy:centerY,i,role:roles[i]});
  if(n>i){const g=E('g',{'data-region':i,class:'f302-region'},partsG);bx(g,x+4,y+4,w-8,h-8,roles[i]);
   if(opt.challenge){let placed=opt.placements?.[i];if(placed!=null)tx(g,centerX,centerY+11,String(placed.v),Math.min(33,Math.max(18,w*.24)),roles[i]);else {tx(g,centerX,centerY+8,'?',30,'unknown');ring(g,centerX,centerY+32,'focus',8);}}
   else if(opt.showLabels!==false)tx(g,centerX,centerY+9,String(parts[i]),Math.min(37,Math.max(27,w*.45)),roles[i]);
   if(opt.animate&&!N.reducedMotion())N.motion.arrive(g,0,-14,270+i*100,N.motion.ease.back);
  }
 }
 if(n>0||opt.stepName==='partition'){N.svg.brace(s,d.x,d.y-23,d.splitX,d.y-23,{role:'given',depth:9});tx(s,(d.x+d.splitX)/2,d.y-40,data.x[0],28,'given');
 N.svg.brace(s,d.splitX,d.y-23,d.x+d.w,d.y-23,{role:'focus',depth:9});tx(s,(d.splitX+d.x+d.w)/2,d.y-40,data.x[1],28,'focus');
 N.svg.brace(s,d.x-21,d.y,d.x-21,d.splitY,{role:'op',depth:9});tx(s,d.x-51,(d.y+d.splitY)/2+7,data.y[0],29,'op');
 if(data.active!==2){N.svg.brace(s,d.x-21,d.splitY,d.x-21,d.y+d.h,{role:'result',depth:9});tx(s,d.x-51,(d.splitY+d.y+d.h)/2+7,data.y[1],28,'result');}
 if(data.active!==2){ln(s,d.splitX,d.y,d.splitX,d.y+d.h,'focus',4.5);ln(s,d.x,d.splitY,d.x+d.w,d.splitY,'op',4.5);}else ln(s,d.splitX,d.y,d.splitX,d.y+d.h,'focus',4.5);
 }
 if(opt.interactive&&!opt.challenge){
  function handle(k,cx,cy,vertical){let shape=bx(s,cx-19,cy-17,38,34,'focus',vertical?'↕':'↔',22);shape.classList.add('f302-split-handle');shape.setAttribute('tabindex','0');shape.setAttribute('role','slider');shape.setAttribute('aria-label',vertical?'Move the horizontal partition between the side lengths':'Move the vertical partition between the side lengths');shape.setAttribute('aria-valuetext',(vertical?data.y:data.x).join(' plus '));
   shape.addEventListener('keydown',e=>{const change=vertical?({ArrowUp:1,ArrowDown:-1}[e.key]):({ArrowRight:1,ArrowLeft:-1}[e.key]);if(change){e.preventDefault();opt.onPartition?.(k,change);}});
   N.ui.svgDrag(s,shape,{box:{x:cx-21,y:cy-19,w:42,h:38},zones:()=>vertical?[
    {id:'decrease',kind:'drop',x:d.x+100,y:d.y+16,w:d.w-200,h:70},
    {id:'increase',kind:'drop',x:d.x+100,y:d.y+d.h-86,w:d.w-200,h:70}]:[
    {id:'decrease',kind:'drop',x:d.x+12,y:d.y+30,w:78,h:d.h-60},
    {id:'increase',kind:'drop',x:d.x+d.w-90,y:d.y+30,w:78,h:d.h-60}],onDrop:z=>{opt.onPartition?.(k,z==='increase'?1:-1);return true;}});
  }
  handle('x',d.splitX,d.y+d.h+24,false);if(data.active!==2)handle('y',d.x+d.w+30,d.splitY,true);
 }
 if(opt.challenge&&opt.cardValues){
   const cardY=506,mobile=window.matchMedia('(max-width:720px)').matches,cardX=mobile?100:26,cardStride=mobile?90:89,trayX=mobile?558:602,trayW=mobile?112:134;
   const placedCards=opt.placements||{};
   const slots=opt.cardValues.map((v,i)=>({v,i})).filter(z=>!Object.values(placedCards).some(e=>e?.i===z.i));
   slots.forEach((it,ix)=>{
    let xx=cardX+ix*cardStride,gg=bx(s,xx,cardY,78,48,'focus',f(it.v),23);gg.classList.add('f302-drag-card');gg.setAttribute('data-card-index',it.i);gg.setAttribute('tabindex',ix===0?'0':'-1');gg.setAttribute('role','button');gg.setAttribute('aria-label','Partial product '+it.v+'; press Enter then choose a region, or drag');
    gg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onChoose?.(it.i);}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const b=[...s.querySelectorAll('.f302-drag-card')],at=b.indexOf(gg),next=b[(at+(e.key==='ArrowRight'?1:-1)+b.length)%b.length];gg.tabIndex=-1;next.tabIndex=0;next.focus();}});
    N.ui.svgDrag(s,gg,{box:{x:xx,y:cardY,w:78,h:48},zones:()=>[...regions.map(r=>({id:String(r.i),kind:'drop',x:r.x+4,y:r.y+4,w:r.w-8,h:r.h-8})),{id:'tray',kind:'remove',x:trayX,y:500,w:trayW,h:64}],onDrop:q=>opt.onPlace?.(it.i,Number(q))||false,onRemove:()=>opt.onRemove?.(it.i)});
   });
   bx(s,trayX+5,502,trayW-10,54,'error','Remove',mobile?22:19);
   regions.forEach(r=>{if(r.i>=(data.active||4))return;const placed=placedCards[r.i];if(!placed)return;const focus=E('g',{'data-filled-index':r.i,role:'button',tabindex:'0','aria-label':'Remove partial product '+placed.v+' from region '+(r.i+1)},s);ring(focus,r.cx+Math.min(35,r.w*.25),r.cy-19,'focus',10);focus.addEventListener('keydown',e=>{if(['Enter',' ','Delete','Backspace'].includes(e.key)){e.preventDefault();opt.onRemoveRegion?.(r.i);}});focus.addEventListener('click',()=>opt.onRemoveRegion?.(r.i));
   N.ui.svgDrag(s,focus,{box:{x:r.cx-25,y:r.cy-25,w:50,h:50},zones:()=>[{id:'tray',kind:'remove',x:trayX,y:500,w:trayW,h:64}],onRemove:()=>opt.onRemoveRegion?.(r.i)});
   });
  }
  if(opt.activeCard!=null)regions.filter(r=>r.i<(data.active||4)).forEach(r=>{let g=E('g',{'data-drop-region':r.i,role:'button',tabindex:r.i===opt.focusRegion?'0':'-1','aria-label':'Place selected product in region '+(r.i+1)},s);ring(g,r.cx,r.cy+Math.min(48,r.h*.3),'focus',12);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onPlace?.(opt.activeCard,r.i);}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();opt.onFocusRegion?.((r.i+(e.key==='ArrowRight'?1:-1)+(data.active||4))%(data.active||4));}});g.addEventListener('click',()=>opt.onPlace?.(opt.activeCard,r.i));});
 tx(s,390,570,opt.challenge?'Drag a product card into the matching region.':opt.stepName==='total'?'Each region is counted exactly once.':'Each part has its own area.',19,'given');
 return s;
}
function fractionalSvg(s,p,opt){const kind=p.kind,x=126,y=155,w=508,h=314;
 if(kind==='fraction-product'){
   const a=+p.a,b=+p.b,c=+p.c,d=+p.d,part=math.fractionProduct(a,b,c,d),cw=w/b,ch=h/d;
   bx(s,x-6,y-6,w+12,h+12,'support');
   for(let j=0;j<d;j++)for(let i=0;i<b;i++){
    const selectedX=i<a,selectedY=j<c,over=selectedX&&selectedY,role=over?'result':selectedX?'given':selectedY?'op':'support';
    bx(s,x+i*cw+3,y+j*ch+3,cw-6,ch-6,role);
    if(over)ring(s,x+(i+.5)*cw,y+(j+.5)*ch,'result',Math.min(16,cw*.19));
   }
   N.svg.brace(s,x,y-25,x+a*cw,y-25,{role:'given',depth:11});N.svg.brace(s,x-22,y,x-22,y+c*ch,{role:'op',depth:10});
   tx(s,380,104,'fraction of a fraction',23,'given');
   tx(s,380,534,part.numerator+' selected cells out of '+part.denominator,25,'result');
   return s;
 }
 const den=+p.den,a=+p.a,b=+p.b,sum=math.fractionAddition(den,a,b,p.op||'+'),wholes=Math.max(1,Math.ceil((p.op==='-'?a:a+b)/den));
 const barH=Math.min(105,310/wholes),startY=y+(314-barH*wholes)/2;
 bx(s,x-6,startY-5,w+12,wholes*barH+10,'support');
 for(let i=0;i<wholes*den;i++){let row=Math.floor(i/den),col=i%den,kind2=p.op==='-'?(i<a-b?'result':i<a?'op':'support'):(i<a?'given':i<a+b?'op':'support');bx(s,x+col*(w/den)+3,startY+row*barH+3,w/den-6,barH-6,kind2);}
 tx(s,380,105,p.op==='-'?'remove equal-sized parts from the whole':'combine equal-sized parts of a whole',22,'given');
 tx(s,380,552,sum.numerator+' equal parts = '+sum.whole+' whole(s) + '+sum.remainder+' parts',23,'result');
 return s;
}
const pres=C.presets;
function resultFor(p){const k=p.kind;if(k==='fraction-product'){const q=math.fractionProduct(p.a,p.b,p.c,p.d);return {head:frac(p.a,p.b)+' × '+frac(p.c,p.d),total:frac(q.numerator,q.denominator),proof:frac(q.simplified[0],q.simplified[1])};}if(k==='fraction-add'){const q=math.fractionAddition(p.den,p.a,p.b,p.op||'+');return {head:frac(p.a,p.den)+(p.op==='-'?' − ':' + ')+frac(p.b,p.den),total:frac(q.numerator,p.den),proof:q.whole?(q.remainder?q.whole+' '+frac(q.remainder,p.den):String(q.whole)):frac(q.simplified[0],q.simplified[1])};}const m=model(p);return {head:m.head,total:m.total,proof:m.proof};}
function scene(stage,p,opt={}){stage.innerHTML='';stage.dataset.kind=p.kind;N.cap(stage,'Area evidence',opt.heading||(p.kind==='fraction-add'?'Rebuild equivalent fractional parts':p.kind==='fraction-product'?'Fractional overlap proves multiplication':p.kind==='double'?'Prove the four algebraic terms':p.kind==='single'||p.kind==='factorise'?'Expand or factorise the rectangle':'Multiply by splitting the rectangle'));
 const layout=H('div',{class:'f302-scene'}),svg=areaSvg(p,opt);svg.classList.add('f302-art');if(window.matchMedia('(max-width:720px)').matches)svg.setAttribute('viewBox','91 48 585 535');layout.appendChild(svg);
 const eq=resultFor(p), aside=H('div',{class:'f302-aside'}),ans=N.answerChip(opt.hideTotal?'?':eq.total,true);
 const mathRow=H('span',{class:'f302-maths'});mathRow.appendChild(N.mt.render(eq.head));
 const c1=N.neonCard([H('span',{class:'f302-kicker',text:'THE WHOLE PRODUCT'}),H('div',{class:'f302-answer'},[mathRow,ans])],{role:'result'});
 const m2=H('span',{class:'f302-maths'});m2.appendChild(N.mt.render(opt.hideParts?'?':eq.proof));
 const c2=N.neonCard([H('span',{class:'f302-kicker',text:opt.hideParts?'PARTIAL PRODUCTS':'PARTS REBUILD THE WHOLE'}),m2],{role:'op'});
 const c3=N.neonCard([H('span',{class:'f302-kicker',text:'WHY THIS WORKS'}),H('p',{class:'f302-note',text:opt.note||'No area is counted twice. Putting each smaller region together exactly reconstructs the original rectangle.'})],{role:'support'});
 aside.append(c1,c2,c3);layout.appendChild(aside);stage.appendChild(layout);
 const s=TALK[opt.stepName]||TALK.explore;N.scene.helperStrip(stage,corePose(opt.peer?'think':s.pose),opt.helper||s.text);
 if(opt.stepName==='total'&&!N.reducedMotion()&&!opt.hideTotal&&p.kind==='numeric')N.countUp(ans,0,Number(model(p).total),850);
 return svg;
}
const steps=[
 {name:'outline',narration:'A rectangle measuring twenty-three by fourteen has area twenty-three groups of fourteen. We will prove that by splitting the sides.',prompt:'What does the area of the full rectangle represent?',mood:'neutral'},
 {name:'partition',narration:'Split twenty-three into twenty and three. Split fourteen into ten and four. Every part of both original side lengths is still present.',prompt:'Why must each side add back to its original length?',mood:'focus'},
 {name:'part-1',narration:'Twenty times ten makes two hundred in the top-left region. That is the first partial product.',prompt:'Why is this part two hundred?',mood:'focus'},
 {name:'part-2',narration:'Three times ten makes thirty in the top-right region. This width is three, not twenty-three.',prompt:'Which two side parts made thirty?',mood:'focus'},
 {name:'part-3',narration:'Twenty times four makes eighty in the bottom-left region. We have not lost the four units from the height.',prompt:'Where does the eighty come from?',mood:'think'},
 {name:'part-4',narration:'Three times four makes twelve in the bottom-right. All four parts now fill the original rectangle.',prompt:'Have we counted every region exactly once?',mood:'think'},
 {name:'partials',narration:'Add two hundred, thirty, eighty and twelve. Every partial product is area, so the sum is the whole area.',prompt:'How does addition rebuild the whole rectangle?',mood:'focus'},
 {name:'total',narration:'Two hundred plus thirty plus eighty plus twelve is three hundred and twenty-two. So twenty-three times fourteen is three hundred and twenty-two.',prompt:'How do you know no part was missed?',mood:'celebrate'}
];
const defaults={kind:'numeric',x:[20,3],y:[10,4]};
const def={id,title:'Area model of multiplication',config:C,steps,
 alt:'Glass neon rectangle split into coloured partial-product areas, with chalk side lengths and proof of the distributive law.',
 staticAlt:'23 × 14 = (20 + 3)(10 + 4) = 200 + 30 + 80 + 12 = 322. Every region is part of the original rectangle.',
 render(i,stage){scene(stage,defaults,{stepName:steps[i].name,reveal:i<=1?0:Math.min(4,i-1),showLabels:i>=2,hideTotal:i!==7,hideParts:i<6,animate:true,note:i===0?'Start with the whole rectangle; one area, two side lengths.':i===1?'Partition both dimensions. The side lengths still add to their original values.':'Each part is the product of one horizontal and one vertical section.'});},
 exploreIntro:'Move the split handles, switch between whole numbers, decimals, fractions and algebra, and prove that the area remains consistent.',
 explore(panel,stage,api){let current='Y7-009-whole-decimal-multiplication',p={...pres[current],x:[20,3],y:[10,4]};
  const intro=H('p',{class:'f302-prompt',text:'Choose a mathematical model. Use the gold handles or value controls to transform its parts.'}),bar=H('div',{class:'f302-controller'});
  const sel=H('select',{'aria-label':'Area model preset'});Object.keys(pres).forEach(k=>sel.add(new Option(pres[k].label,k)));sel.value=current;
  const group=H('div',{class:'f302-controller'}),hint=H('p',{class:'f302-instruct'});
  function draw(){group.innerHTML='';const k=p.kind;
    if(k==='numeric'){['x','y'].forEach(axis=>{let parts=p[axis];const labels=axis==='x'?['Width part A','Width part B']:['Height part A','Height part B'];parts.forEach((v,i)=>{const inp=H('input',{type:'number',min:0.1,max:99.9,step:current==='decimal-tenths'?0.1:1,value:String(v),'aria-label':labels[i]});const l=H('label',{},[labels[i],inp]);inp.onchange=()=>{parts[i]=Math.max(.1,Math.min(99.9,Number(inp.value)||.1));value(axis==='x'?'width':'height',parts.slice());draw();};group.appendChild(l);});});}
    if(k==='single'||k==='factorise'||k==='double'){let names=k==='double'?[['xConst','Top constant'],['yConst','Side constant']]:[['factor','Common factor'],['constant','Added length']];names.forEach(([key,label])=>{const inp=H('input',{type:'number',min:1,max:12,step:1,value:p[key],'aria-label':label});inp.onchange=()=>{p[key]=Math.max(1,Math.min(12,Math.round(+inp.value||1)));value(key==='factor'?'height':'splitX',p[key]);draw();};group.appendChild(H('label',{},[label,inp]));});}
    if(k==='fraction-product'){[['a','Width selected'],['b','Width denominator'],['c','Height selected'],['d','Height denominator']].forEach(([key,label])=>{const inp=H('input',{type:'number',min:key==='b'||key==='d'?1:0,max:12,step:1,value:p[key],'aria-label':label});inp.onchange=()=>{p[key]=Math.max(0,Math.min(12,+inp.value||0));p.b=Math.max(1,p.b);p.d=Math.max(1,p.d);p.a=Math.min(p.a,p.b);p.c=Math.min(p.c,p.d);value('fractionSelection',[p.a,p.b,p.c,p.d]);draw();};group.appendChild(H('label',{},[label,inp]));});}
    if(k==='fraction-add'){const op=H('select',{'aria-label':'Add or subtract fractions'});op.add(new Option('Add equal parts','+'));op.add(new Option('Subtract equal parts','-'));op.value=p.op||'+';op.onchange=()=>{p.op=op.value;if(p.op==='-'&&p.b>p.a)p.b=p.a;value('fractionSelection',[p.a,p.b,p.den,p.op]);draw();};group.appendChild(H('label',{},['Operation',op]));[['a','First numerator'],['b','Second numerator'],['den','Equal denominator']].forEach(([key,label])=>{const inp=H('input',{type:'number',min:key==='den'?1:0,max:12,step:1,value:p[key],'aria-label':label});inp.onchange=()=>{p[key]=Math.max(key==='den'?1:0,Math.min(12,Math.round(+inp.value||0)));if(p.op==='-'&&p.b>p.a)p.b=p.a;value('fractionSelection',[p.a,p.b,p.den]);draw();};group.appendChild(H('label',{},[label,inp]));});}
    let note=k==='numeric'?'Drag either gold partition handle. The dimensions remain constant; the four areas recalculate.':k==='double'?'Symbolic x is not a measured number. Each region stands for a term; the diagram is schematic, not to scale.':k==='fraction-product'?'The green overlap is the product. Every small square is an equal part of the same whole.':k==='fraction-add'?p.op==='-'?'Remove equal-sized parts; first create a common denominator.':'Combine equal-sized parts; fractions must first have a common denominator.':'The whole area proves expansion or the reverse operation of factorising.';
    hint.textContent=note;
    scene(stage,p,{stepName:k==='fraction-add'?'fraction-add':k==='fraction-product'?'fraction':'explore',interactive:!k.startsWith('fraction'),note,onPartition:(axis,change)=>{
      if(k==='numeric'){let a=p[axis],unit=current==='decimal-tenths'?.1:1,total=+a[0]+ +a[1],n=+(+a[0]+change*unit).toFixed(6);if(n>=unit&&total-n>=unit){p[axis]=[n,+(total-n).toFixed(6)];value(axis==='x'?'splitX':'splitY',n);draw();}}
      else if(k==='single'||k==='factorise'){p.constant=Math.max(1,Math.min(12,+p.constant+change));value('splitX',p.constant);draw();}
      else {const key=axis==='x'?'xConst':'yConst';p[key]=Math.max(1,Math.min(12,+p[key]+change));value(axis==='x'?'splitX':'splitY',p[key]);draw();}
    }});
  }
  sel.onchange=()=>{current=sel.value;p=JSON.parse(JSON.stringify(pres[current]));value('preset',current);draw();};
  bar.appendChild(H('label',{},['Preset / representation',sel]));panel.append(intro,bar,group,hint);draw();
 },
 challenge(panel,api,stage){let task=0,correct=0,wrong=0,selected=null,focusRegion=0,placements={};
  const cases=[{label:'23 × 14',p:{kind:'numeric',x:[20,3],y:[10,4]}},{label:'2.3 × 1.4',p:{kind:'numeric',x:[2,.3],y:[1,.4]}},{label:'(x + 3)(x + 2)',p:{kind:'double',xConst:3,yConst:2}}];
  const feedback=H('p',{class:'f302-instruct',role:'status'});
  function fail(msg){wrong++;api.check(false,msg,{task,wrong});feedback.textContent=msg;}
  function next(){api.check(true,'Correct: all partial products and the whole match.',{task});correct++;if(correct===3){panel.innerHTML='';panel.append(H('h3',{text:'Three area proofs complete'}),H('p',{text:'You accounted for every region, including the decimal tenths and the algebraic x terms.'}));scene(stage,cases[2].p,{stepName:'total',peer:'celebrate'});return;}task++;value('challengeTask',task);selected=null;focusRegion=0;placements={};render();}
  function render(){panel.innerHTML='';let t=cases[task],m=model(t.p),assigned=Object.fromEntries(Object.entries(placements).map(([k,i])=>[k,{i,v:m.parts[i]}]));
   const choices=[...m.parts];
   choices.push(task===2?'3x':task===1?'0.8':'322'); // distractor: a wrong partial total
   let active=selected;
   const instruct=H('p',{class:'f302-prompt',text:'Proof '+(task+1)+' / 3 · '+t.label+' — place four correct region products, then enter the whole product.'});
   const stat=H('p',{class:'f302-instruct',text:'Choose a product, then a region with Enter; or drag it into position. Wrong placements return to the tray. Move a filled product to the red Remove tray to change it.'});
   const input=H('input',{type:'text','aria-label':'Total area','placeholder':'Total area / expression',style:'width:min(340px,100%);height:42px;padding:6px 12px;border-radius:10px;background:#0c2438;border:1px solid #3d6886;color:white;font:700 1.1rem var(--nova-font-chalk-write)'});
   let previous=panel.querySelector('input[aria-label="Total area"]');if(previous)input.value=previous.value;
   function place(i,region){if(region<0||region>=4)return false;const candidate=m.parts[i];if(String(candidate)!==String(m.parts[region])){fail('This region is '+m.y[Math.floor(region/2)]+' times '+m.x[region%2]+', not '+candidate+'. Multiply the side lengths of this specific part.');return false;}
      Object.entries(placements).forEach(([k,v])=>{if(v===i)delete placements[k];});placements[region]=i;value('placedPart',{region,value:candidate});selected=null;rebuild();return true;}
   function redraw(){scene(stage,t.p,{stepName:'challenge',challenge:true,reveal:4,placements:assigned,cardValues:choices,activeCard:active,focusRegion,hideTotal:true,hideParts:true,peer:'think',onChoose:i=>{selected=i;focusRegion=0;rebuild();stage.querySelector('[data-drop-region="0"]')?.focus();},onFocusRegion:i=>{focusRegion=i;rebuild();stage.querySelector('[data-drop-region="'+i+'"]')?.focus();},onPlace:place,onRemoveRegion:r=>{delete placements[r];value('removedPart',r);rebuild();},onRemove:i=>{Object.keys(placements).forEach(k=>{if(placements[k]===i)delete placements[k];});value('removedPart',i);rebuild();}});}
   function rebuild(){let keep=input.value;render();panel.querySelector('input[aria-label="Total area"]').value=keep;}
   panel.append(instruct,stat,H('div',{class:'f302-controller'},[input,btn('Check area proof',()=>{
      const complete=[0,1,2,3].every(i=>Object.hasOwn(placements,i)&&String(m.parts[placements[i]])===String(m.parts[i]));
      if(!complete){fail('Some regions are missing or misplaced. Every small rectangle must have its own partial product.');return;}
      const typed=input.value.trim().replace(/\s+/g,'').replace(/\*/g,'×').toLowerCase();const target=String(m.total).replace(/\s+/g,'').toLowerCase();
      if(typed!==target){fail(task===2?'Combine like terms: the two x terms add, but x squared stays separate.':'The partial regions are correct, but the total must be their sum: '+m.parts.join(' + ')+'.');return;}next();
   },'nova-btn primary'),btn('Hint',()=>api.hint('Start at the top left. Multiply its top section by its side section, then move clockwise.'),'nova-btn')] ),feedback);
   redraw();
  }
  value('challengeTask',task);render();
 },
 onRestore(){}
};
N.registry.add({id,title:def.title,topics:['multiplication','area','fractions','distributive law','algebra'],deps:['F0-02','F0-03','F0-04','F0-05','F0-07','F0-08']});
N.bankMount({id,num:'02',title:'Area model of multiplication · Premium Edition',def,linked:['F3-01','F3-03','F5-03','F7-04','F7-05'],years:'KS3 Year 7–9 with GCSE algebra extensions',spec:{
 purpose:'Prove whole and decimal products by partitioned areas; model fractional overlap and equivalent-part addition; expand and reverse algebraic factorisation.',
 params:'Width and height parts; split X/Y; integer/decimal arithmetic; symbolic x coefficients; numerator/denominator and equal fraction parts.',
 presets:'Eight explicitly identified lesson presets plus F5-03, F7-04 and F7-05 named modes; decimal-tenths demonstration. Ninth lesson not identified in the supplied master.',
 steps:'Outline → partition dimensions → four progressively filled area regions → collect partial products → combine for total.',
 interactions:'Drag both partition handles with spring/snap and keyboard arrows. Challenge drag partial product cards into quadrants, regrab/remove, Enter-place and roving keyboard navigation.',
 traps:'Forgetting cross products, adding lengths instead of multiplying, incorrect decimal tenths, mismatched algebra terms, confusing an overlap product with a fraction sum.',
 gcse:'Algebraic equivalence, double brackets and factorising; symbolic areas not claimed to be numerically to scale.'
 }});
// Canonical F2 SVG capture: Chromium may report setPointerCapture=true on a small <g>
// but deliver subsequent pointermove/up to the SVG instead. Forward those native events
// to the original F0 svgDrag listeners; never implement a competing drag algorithm.
window.addEventListener('pointermove',e=>{
 const d=N.ui._drag;if(d?.captured&&d.el?.isConnected&&document.getElementById(id)?.contains(d.el)&&!d.el.contains(e.target))
  d.el.dispatchEvent(new PointerEvent('pointermove',{pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY,buttons:e.buttons,bubbles:false}));
});
window.addEventListener('pointerup',e=>{const d=N.ui._drag;if(d?.el&&document.getElementById(id)?.contains(d.el)){
  if(!d.el.contains(e.target))d.up(e);
  if(N.ui._drag)N.ui.cancelDrag();
}});
window.addEventListener('pointercancel',()=>{if(N.ui._drag?.el&&document.getElementById(id)?.contains(N.ui._drag.el))N.ui.cancelDrag();});
const card=document.getElementById(id),dev=H('details',{class:'nv-dev'});dev.appendChild(H('summary',{text:'Developer: component specification'}));[...card.querySelectorAll('details.nova-spec,p.purpose')].forEach(x=>dev.appendChild(x));card.appendChild(dev);
let hh=card.querySelector('h3');if(hh)hh.textContent='Interactive maths workshop';
function bobAlt(){card.querySelectorAll('.face img').forEach(x=>{if(!x.getAttribute('alt'))x.alt='Sir Bob Maximus, maths tutor';});}bobAlt();new MutationObserver(bobAlt).observe(card,{childList:true,subtree:true});
})();
