# F7-02 phone layout: a 620-unit-wide board with 5 tiles per row, stacked trays; desktop geometry unchanged.
EDITS=[
("""const posLane={x:35,y:146,w:930,h:207},negLane={x:35,y:420,w:930,h:207};
const removeZone={id:'return',kind:'remove',x:700,y:766,w:265,h:81};
const laneFor=sg=>sg===1?posLane:negLane;
function unitPos(sg,i){return {x:83+(i%7)*121,y:(sg===1?223:497)+Math.floor(i/7)*72};}""",
"""let NW=false,posLane,negLane,removeZone,L;
function setLayout(){NW=window.matchMedia('(max-width:720px)').matches;
 if(!NW){posLane={x:35,y:146,w:930,h:207};negLane={x:35,y:420,w:930,h:207};removeZone={id:'return',kind:'remove',x:700,y:766,w:265,h:81};
  L={W:1000,H:728,HI:866,title:57,head:45,lane:48,ruleY:388,ruleA:[120,337],ruleB:[663,878],ringX:500,res:[676,47],cols:7,stride:121,ux:83,uy:[223,497],tray:[[38,764],[360,764]],trayW:285,cap:42,rem:{x:700,y:766,w:265,h:81,tx:832,ty:819}};}
 else{posLane={x:24,y:146,w:572,h:290};negLane={x:24,y:510,w:572,h:290};removeZone={id:'return',kind:'remove',x:24,y:1000,w:572,h:76};
  L={W:620,H:905,HI:1092,title:44,head:34,lane:40,ruleY:473,ruleA:[60,250],ruleB:[370,560],ringX:310,res:[870,32],cols:5,stride:104,ux:56,uy:[222,586],tray:[[24,900],[316,900]],trayW:280,cap:36,rem:{x:24,y:1000,w:572,h:76,tx:310,ty:1050}};}}
setLayout();
const laneFor=sg=>sg===1?posLane:negLane;
function unitPos(sg,i){return {x:L.ux+(i%L.cols)*L.stride,y:(sg===1?L.uy[0]:L.uy[1])+Math.floor(i/L.cols)*72};}"""),
("""function scene(tiles,o={}){
 const interactive=!!o.interactive, s=N.svg.root(1000,interactive?866:728,""",
"""function scene(tiles,o={}){setLayout();
 const interactive=!!o.interactive, s=N.svg.root(L.W,interactive?L.HI:L.H,"""),
("""chalk(s,44,60,'ZERO-PAIR WORKSHOP','given',57,'start');
 chalk(s,44,115,o.headline||'A plus and a minus always make zero.','support',45,'start');""",
"""chalk(s,NW?26:44,60,'ZERO-PAIR WORKSHOP','given',L.title,'start');
 {const hl=o.headline||'A plus and a minus always make zero.';chalk(s,NW?26:44,115,hl,'support',NW&&hl.length>30?30:L.head,'start');}"""),
("""chalk(s,62,z.y+49,name,sg===1?'result':'error',48,'start');""","""chalk(s,z.x+27,z.y+49,name,sg===1?'result':'error',L.lane,'start');"""),
("""N.neonLine(s,120,388,337,388,{role:'result',width:4});N.neonRing(s,500,389,{role:'unknown',r:31,pulse:false});
 chalk(s,500,402,'0','unknown',48);N.neonLine(s,663,388,878,388,{role:'error',width:4});
 chalk(s,500,676,o.hideResult?'Cancel pairs to reveal the result':o.formula||'Count the uncancelled units',o.hideResult?'given':'result',47);""",
"""N.neonLine(s,L.ruleA[0],L.ruleY,L.ruleA[1],L.ruleY,{role:'result',width:4});N.neonRing(s,L.ringX,L.ruleY+1,{role:'unknown',r:31,pulse:false});
 chalk(s,L.ringX,L.ruleY+14,'0','unknown',48);N.neonLine(s,L.ruleB[0],L.ruleY,L.ruleB[1],L.ruleY,{role:'error',width:4});
 chalk(s,L.ringX,L.res[0],o.hideResult?'Cancel pairs to reveal the result':o.formula||'Count the uncancelled units',o.hideResult?'given':'result',L.res[1]);"""),
("""   for(const [sg,x,caption] of [[1,38,'ADD  +1'],[-1,360,'ADD  −1']]){""","""   for(const [sg,x,caption,ty] of [[1,L.tray[0][0],'ADD  +1',L.tray[0][1]],[-1,L.tray[1][0],'ADD  −1',L.tray[1][1]]]){"""),
("""     glass(g,x,764,285,84,sg===1?'result':'error',18);
     unitDrawing(g,sg,x+12,775);
     chalk(g,x+103,819,caption,sg===1?'result':'error',42,'start');""",
"""     glass(g,x,ty,L.trayW,84,sg===1?'result':'error',18);
     unitDrawing(g,sg,x+12,ty+11);
     chalk(g,x+(NW?92:103),ty+55,caption,sg===1?'result':'error',L.cap,'start');"""),
("""N.ui.svgDrag(s,g,{box:{x,y:764,w:285,h:84},""","""N.ui.svgDrag(s,g,{box:{x,y:ty,w:L.trayW,h:84},"""),
("""   if(o.allowRemove){glass(s,700,766,265,81,'error',16);chalk(s,832,819,'REMOVE','error',47);}else{
     glass(s,700,766,265,81,'given',16);chalk(s,832,819,'MATCH PAIRS','given',35);""",
"""   if(o.allowRemove){glass(s,L.rem.x,L.rem.y,L.rem.w,L.rem.h,'error',16);chalk(s,L.rem.tx,L.rem.ty,'REMOVE','error',47);}else{
     glass(s,L.rem.x,L.rem.y,L.rem.w,L.rem.h,'given',16);chalk(s,L.rem.tx,L.rem.ty,'MATCH PAIRS','given',NW?40:35);"""),
("""if(o.celebrate)N.motion.flash(s,500,389,'result',76);""","""if(o.celebrate)N.motion.flash(s,L.ringX,L.ruleY+1,'result',76);"""),
]
