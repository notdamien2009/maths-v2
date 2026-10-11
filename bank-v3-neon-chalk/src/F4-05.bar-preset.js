/* NOVA F4-05 · Bar-model PRESENTATION PRESET of F5-11.
   Reuses the F5-11 model, rational-number arithmetic, selection, validation,
   Watch/Guided/Explore/Challenge, challenge tasks, and event contract.
   Uses the existing NOVA neon/chalk primitives and F5-11 glow definitions.
   This adapter defines no independent maths engine. */
function renderF405Bar(stage,o,opt){
 opt=opt||{};
 if(live)live.dead=true;
 var sc={dead:false};live=sc;stage.innerHTML='';
 N.cap(stage,'F4-05 · FRACTION BAR','PREMIUM');
 var mob=innerWidth<=670,W=mob?420:1120,V=mob?1000:840;
 var svg=S.root(W,V,'Part-whole fraction bar. The whole amount is divided into exactly '+o.d+' equal parts. The numerator selects '+o.n+' parts.');
 svg.classList.add('f405-svg');svg.setAttribute('data-numer',''+o.n);svg.setAttribute('data-denom',''+o.d);svg.setAttribute('data-amount',''+o.a);svg.setAttribute('data-selected',''+o.selected.length);
 svg.setAttribute('data-mode-parent','F5-11');grad(svg);
 var st=opt.stage===undefined?5:opt.stage,split=st>=1,showOne=st>=2,showShade=st>=3,showResult=st>=4&&!opt.hidden&&(!opt.interactive||!!opt.isComplete);
 var sf=mob?18:24,small=mob?17:22;
 function txt(x,y,t,role,size,anchor){return chalk(svg,x,y,t,role||'support',size||small,anchor||'middle');}
 function barPart(x,y,w,h,role){N.neonBox(svg,x,y,w,h,{role:role,r:mob?8:12});}
 function title(x,y,text){txt(x,y,text,'support',mob?19:23);}
 txt(W/2,mob?41:48,'WHOLE → EQUAL PARTS','given',mob?25:32);
 // Three evidential cards: traditional stacked fraction, original, and computed result.
 var cards=mob?[{x:35,y:71,w:350,h:87},{x:35,y:171,w:350,h:87},{x:35,y:271,w:350,h:87}]:[{x:65,y:88,w:296,h:130},{x:413,y:88,w:296,h:130},{x:761,y:88,w:296,h:130}];
 ['Fraction of the whole','Original whole amount','Selected amount'].forEach(function(t,i){
  var c=cards[i],role=['given','op','result'][i];barPart(c.x,c.y,c.w,c.h,role);
  txt(c.x+16,c.y+(mob?24:34),t,'support',mob?21:18,'start');
  if(i===0){frac(svg,c.x+c.w/2,c.y+(mob?53:80),o.n,o.d,'given',mob?24:24);}
  if(i===1){txt(c.x+c.w/2,c.y+(mob?70:93),o.a,'op',mob?28:38);}
  if(i===2){if(showResult){mixed(svg,c.x+c.w/2,c.y+(mob?54:81),o.product,'result',mob?19:27);}else txt(c.x+c.w/2,c.y+(mob?70:94),'?','unknown',mob?29:38);}
 });
 var bx=mob?36:108,bw=mob?348:904,by=mob?440:331,bh=mob?83:113,part=bw/o.d;
 title(W/2,by-57,split?o.d+' EQUAL PARTS':'THE WHOLE');
 // Stable full-width mathematical bar; no number-line substitutes or freehand primitives.
 N.neonBox(svg,bx,by,bw,bh,{role:'given',r:mob?9:17});
 if(!split){txt(W/2,by+bh/2+10,o.a+' in the whole','given',mob?23:34);}
 if(split){
  for(var j=0;j<o.d;j++){
   var selected=showShade&&o.selected.includes(j),marked=showShade&&j<o.n&&st>=3&&!opt.interactive;
   var role=(selected||marked)?'result':'op',x=bx+j*part;
   barPart(x+3,by+4,part-6,bh-8,role);
   txt(x+part/2,by+bh/2+(mob?8:10),String(j+1),selected||marked?'result':'support',mob?25:27);
      var cell=E('rect',{x:x+2,y:by+2,width:part-4,height:bh-4,rx:7,fill:'transparent','data-group-cell':j,'aria-label':'Equal part '+(j+1)},svg);
   if(opt.interactive){cell.setAttribute('tabindex','0');cell.setAttribute('role','button');cell.setAttribute('aria-label',(selected?'Return':'Choose')+' equal part '+(j+1));
     (function(k){cell.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();if(opt.toggle)opt.toggle(k,'keyboard');}});})(j);
   }
  }
 }
 var center=W/2;
 if(split){
  N.neonLine(svg,bx,by+bh+29,bx+bw,by+bh+29,{role:'given',width:3});
  N.neonRing(svg,bx,by+bh+29,{role:'given',r:5,pulse:false});N.neonRing(svg,bx+bw,by+bh+29,{role:'given',r:5,pulse:false});
  txt(center,by+bh+62,'WHOLE = '+o.a,'given',mob?22:29);
 }
 // One-part value is exact rational arithmetic from F5-11; never float-rounded.
 var unitValue=rat(o.a,o.d),partValY=mob?677:601;
 title(center,partValY-52,'ONE EQUAL PART');
 N.neonBox(svg,center-(mob?146:216),partValY-38,mob?292:432,mob?77:82,{role:'op',r:14});
 var revealUnit=showOne&&!opt.hidden || !!C._f405UnitRevealed;
 if(revealUnit){mixed(svg,center,partValY+(mob?2:1),unitValue,'result',mob?23:29);}
 else txt(center,partValY+11,opt.hidden?'Drag the value chip to reveal':'Ready to divide','unknown',mob?16:24);
 var valChipX=mob?100:213,valChipY=mob?761:669;
 if(opt.interactive){
  var vg=E('g',{'data-value-chip':'true',tabindex:0,role:'button','aria-label':'Reveal the value of one part. Press Enter.'},svg);
  N.neonBox(vg,valChipX-39,valChipY-23,80,47,{role:'focus',r:12});chalk(vg,valChipX+1,valChipY+9,'÷ '+o.d,'focus',mob?20:23);
  vg.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();C._f405UnitRevealed=true;opt.onReveal&&opt.onReveal();}});
  N.ui.svgDrag(svg,vg,{box:{x:valChipX-39,y:valChipY-23,w:80,h:47},canStart:function(){return !sc.dead;},
   zones:function(){return [{id:'unit-part',kind:'drop',x:center-(mob?146:216),y:partValY-38,w:mob?292:432,h:82}]},
   onDrop:function(){C._f405UnitRevealed=true;opt.onReveal&&opt.onReveal();return true;}});
  txt(valChipX,valChipY+45,'Drag to reveal one part','support',mob?15:18);
 }
 var ay=mob?845:709,ax=mob?218:625,aw=mob?167:373,ah=mob?75:81;
 N.neonBox(svg,ax,ay,aw,ah,{role:'result',r:13});txt(ax+aw/2,ay+25,'TAKE '+o.n+' OF '+o.d,'result',mob?16:19);
 if(!opt.hidden && showResult){mixed(svg,ax+aw/2,ay+53,o.product,'result',mob?17:23);}
 else txt(ax+aw/2,ay+58,showShade?o.selected.length+' SELECTED':'SELECT PARTS','support',mob?16:21);
 var retX=mob?25:25,retY=ay,retW=mob?173:230,retH=ah;
 N.neonBox(svg,retX,retY,retW,retH,{role:'unknown',r:13});txt(retX+retW/2,retY+30,'RETURN','unknown',mob?18:23);txt(retX+retW/2,retY+57,'Selected part','support',mob?15:17);
 if(opt.interactive&&split){
  for(var k=0;k<o.d;k++)(function(i){
    var selected=o.selected.includes(i),x=bx+(i+.5)*part,y=by+bh-10;
    var g=E('g',{class:'f405-handle',tabindex:0,role:'button','data-part-handle':i,'aria-label':(selected?'Return':'Select')+' equal part '+(i+1)+'. Press Enter.'},svg);
    N.neonRing(g,x,y,{role:selected?'result':'focus',r:mob?10:12,pulse:false});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.toggle(i,'keyboard');}});
    N.ui.svgDrag(svg,g,{box:{x:x-15,y:y-15,w:30,h:30},canStart:function(){return !sc.dead;},
      zones:function(){return selected?[{id:'return-'+i,kind:'remove',x:retX,y:retY,w:retW,h:retH}]:[{id:'answer-'+i,kind:'drop',x:ax,y:ay,w:aw,h:ah}]},
      onDrop:function(){return !selected&&opt.toggle(i,'drag');},onRemove:function(){if(selected)opt.toggle(i,'drag');},
      removeTo:{x:retX+retW/2,y:retY+retH/2}});
  })(k);
 }
 svg.setAttribute('data-one-part',String(unitValue.num)+'/'+String(unitValue.den));
 svg.setAttribute('data-exact-answer',String(o.product.num)+'/'+String(o.product.den));
 stage.appendChild(svg);
 var mascotLine=opt.hidden?'Give it a go!':opt.interactive?(o.selected.length===o.n?'Nicely done!':'Choose the equal parts!'):
   ['Spot the whole!','Equal parts!','Find one part!','Shade the numerator!','Nearly there!','Nicely done!'][Math.min(5,st)];
 N.scene.helperStrip(stage,opt.pose||'show-three',mascotLine);
 return sc;
}
