/* ===== F14-09 TESSELLATION MAKER · NOVA F0/F2 PREMIUM CORE ===== */
(function(){'use strict';
var h=NOVA.h,S=NOVA.svg,E=S.el;
var SQ3=Math.sqrt(3),DEG=Math.PI/180;
var CONFIG=window.NovaV2Integration.configuration(window.NOVA_F14_09_CONFIG={startMode:'watch',preset:'squares',events:['value','step','mode','hintUsed','correct'],presets:{
 squares:{label:'Squares · 4 around a point',name:'Square mosaic',type:'quad',u:[2.4,0],v:[0,2.4],cols:4,rows:4,vertexAngle:90,meeting:4,canTile:true},
 triangles:{label:'Equilateral triangles · 6 around a point',name:'Triangle lattice',type:'tri',u:[2.55,0],v:[1.275,2.55*SQ3/2],cols:3,rows:4,vertexAngle:60,meeting:6,canTile:true},
 hexagons:{label:'Regular hexagons · 3 around a point',name:'Honeycomb',type:'hex',r:1.5,cols:3,rows:4,vertexAngle:120,meeting:3,canTile:true},
 rhombi:{label:'Rhombi · 4 around a point',name:'Rhombus parquet',type:'quad',u:[2.55,0],v:[1.275,2.55*SQ3/2],cols:3,rows:5,vertexAngle:60,meeting:4,canTile:true},
 parallelograms:{label:'Parallelograms · opposite sides pair',name:'Parallelogram tiles',type:'quad',u:[2.6,.0],v:[.85,1.85],cols:3,rows:5,vertexAngle:55,meeting:4,canTile:true},
 pentagons:{label:'Regular pentagons · gaps remain',name:'Regular pentagons',type:'pent',r:1.7,cols:3,rows:3,vertexAngle:108,meeting:0,canTile:false}
}});
var DS={W:670,H:505,plot:{x:45,y:86,w:575,h:352}},MB={W:390,H:515,plot:{x:26,y:89,w:338,h:350}};
function view(){return innerWidth<=500?MB:DS;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function cv(v){return Math.round(v*1e4)/1e4;}
function emit(k,v){NOVA.events.emit('value',{engine:'F14-09',key:k,value:v});}
function chalk(svg,x,y,txt,role,sz,anchor){return NOVA.chalkText(svg,x,y,txt,{role:role||'unknown',size:sz||20,anchor:anchor||'middle'});}
function add(a,b){return [a[0]+b[0],a[1]+b[1]];}
function mul(a,k){return [a[0]*k,a[1]*k];}
function cell(d,i,j){var t=d.type,u=d.u||[0,0],v=d.v||[0,0],c;
 if(t==='quad') {c=add(mul(u,i),mul(v,j));return [c,add(c,u),add(add(c,u),v),add(c,v)];}
 if(t==='tri'){c=add(mul(u,i),mul(v,j));return [c,add(c,u),add(c,v)];}
 if(t==='hex'){var r=d.r; c=[(SQ3*r)*i+(SQ3*r/2)*j,1.5*r*j];return Array.from({length:6},function(_,k){var a=(90+k*60)*DEG;return [c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];});}
 if(t==='pent'){c=[3.4*i+1.15*(j%2),3.65*j];return Array.from({length:5},function(_,k){var a=(90+k*72)*DEG;return [c[0]+d.r*Math.cos(a),c[1]+d.r*Math.sin(a)];});}
}
function tiles(k){var d=CONFIG.presets[k],arr=[];for(var j=0;j<d.rows;j++)for(var i=0;i<d.cols;i++){
 var v=cell(d,i,j),id=String(arr.length);arr.push({id:id,vertices:v,i:i,j:j});
 if(d.type==='tri'){var c=add(mul(d.u,i),mul(d.v,j));arr.push({id:String(arr.length),vertices:[add(c,d.u),add(add(c,d.u),d.v),add(c,d.v)],i:i,j:j,flipped:true});}
 }return arr;}
function center(v){return v.reduce(function(q,p){return [q[0]+p[0]/v.length,q[1]+p[1]/v.length];},[0,0]);}
function geom(key,p){var arr=tiles(key),all=arr.flatMap(function(t){return t.vertices});var xx=all.map(function(v){return v[0]}),yy=all.map(function(v){return v[1]});var minx=Math.min.apply(null,xx),maxx=Math.max.apply(null,xx),miny=Math.min.apply(null,yy),maxy=Math.max.apply(null,yy),b=p.plot;
 var scale=Math.min(b.w/(maxx-minx),b.h/(maxy-miny)),dx=b.x+(b.w-(maxx-minx)*scale)/2,dy=b.y+(b.h-(maxy-miny)*scale)/2;
 function xy(q){return [dx+(q[0]-minx)*scale,dy+(maxy-q[1])*scale];}
 var out=arr.map(function(t){var poly=t.vertices.map(xy);return Object.assign({},t,{poly:poly,centre:center(poly)});});return {arr:out,scale:scale,plot:b};}
function polyPath(q){return 'M'+q.map(function(v){return cv(v[0])+','+cv(v[1]);}).join(' L')+' Z';}
function inside(p,poly){var c=false;for(var i=0,j=poly.length-1;i<poly.length;j=i++) {var a=poly[i],b=poly[j];if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]))c=!c;}return c;}
function prepared(key){var all=tiles(key),st={key:key,placed:[],target:1,selected:null,angles:false,showGrid:false,challenge:false};return st;}
function put(st,id){id=String(id);if(st.placed.indexOf(id)>=0)return false;st.placed.push(id);st.selected=id;emit('placed',st.placed.slice());return true;}
function remove(st,id){id=String(id);var i=st.placed.indexOf(id);if(i<0)return false;st.placed.splice(i,1);emit('removed',id);return true;}
function buildPreset(k,count){var s=prepared(k),list=tiles(k);s.placed=list.slice(0,Math.min(count,list.length)).map(function(x){return x.id});return s;}
function svgPoint(svg,e){var q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(svg.getScreenCTM().inverse());}
function zones(geo,st){var a=geo.arr.map(function(t){var b=t.centre,near=clamp(Math.sqrt(Math.abs(area(t.poly))),22,70)*.44;return {id:'tile:'+t.id,x:b[0]-near,y:b[1]-near,w:2*near,h:2*near,kind:'drop'};});var p=view();a.push({id:'remove',x:p.W-113,y:p.H-58,w:90,h:46,kind:'remove'});return a;}
function area(v){return Math.abs(v.reduce(function(s,p,i){var q=v[(i+1)%v.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2);}
function isFilled(st){return CONFIG.presets[st.key].canTile&&st.placed.length===tiles(st.key).length;}
function dragTile(svg,g,geo,st,id,redraw,isTray){var start=null,last=null;g.setAttribute('data-drag','1');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',isTray?'Drag a new tile to an empty dashed outline, or press Enter to fill the next empty position.':'Drag a placed tile to another position, or to the red remove zone. Arrow keys select an empty position.');
 g.addEventListener('pointerdown',function(e){start=svgPoint(svg,e);last=start;/* Core re-parents the SVG group for lift. Browser pointer capture may be lost after this move, so finish from a one-shot window release as a safe fallback. */window.addEventListener('pointerup',function(ev){var drag=NOVA.ui._drag;if(drag&&drag.el===g&&typeof drag.up==='function')drag.up(ev);},{once:true});},true);g.addEventListener('pointermove',function(e){if(start)last=svgPoint(svg,e);},true);g.addEventListener('pointerup',function(e){if(start)last=svgPoint(svg,e);},true);
 function first(){return geo.arr.find(function(t){return st.placed.indexOf(t.id)<0;});}
 function place(which){if(which==null)return false;which=String(which);if(!isTray&&which===id)return false;if(st.placed.indexOf(which)>=0)return false;if(!isTray)remove(st,id);var ok=put(st,which);if(ok)redraw('tile');return ok;}
 function zdrop(zid){if(!last)return false;var match=geo.arr.filter(function(t){return inside([last.x,last.y],t.poly)&&st.placed.indexOf(t.id)<0;}).sort(function(a,b){return Math.hypot(a.centre[0]-last.x,a.centre[1]-last.y)-Math.hypot(b.centre[0]-last.x,b.centre[1]-last.y);});
 if(match.length)return place(match[0].id);if(zid&&zid.indexOf('tile:')===0)return place(zid.slice(5));return false;}
 NOVA.ui.svgDrag(svg,g,{zones:function(){return zones(geo,st)},onDrop:zdrop,removeTo:{x:view().W-60,y:view().H-37},onRemove:isTray?null:function(){remove(st,id);redraw('remove');}});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();var n=first();if(n)place(n.id);}else if(!isTray&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();remove(st,id);redraw('delete');}else if(e.key.indexOf('Arrow')===0){e.preventDefault();var n=first();if(n)place(n.id);}});
 return g;}
function draw(stage,st,o){
if(window.NovaLessonComponent?.active){[stage,st,o]=window.NovaLessonComponent.args("draw",arguments);}
o=o||{};stage.innerHTML='';var p=view(),mobile=p===MB,d=CONFIG.presets[st.key],geo=geom(st.key,p),placed=st.placed.length;
 NOVA.cap(stage,o.cap||'Tessellation maker',o.sub||d.name,o.tag||'REPEAT · CONNECT · FILL');
 var svg=S.root(p.W,p.H,'A neon tessellation workshop with exact polygon tiles, an interactive tile tray and snap-to-grid mosaic.');svg.classList.add('f14-plot');
 var back=E('g',{'aria-hidden':'true'},svg);S.grid(back,p.plot.x,p.plot.y,p.plot.w,p.plot.h,mobile?34:42);
 chalk(svg,p.W/2,40,o.headline||'Can the tiles cover the plane?', 'unknown',mobile?21:23);
 // border of the canvas, drawn with the same core neon primitive as F0/F2
 var b=p.plot;NOVA.neonPath(svg,'M'+b.x+','+b.y+' L'+(b.x+b.w)+','+b.y+' L'+(b.x+b.w)+','+(b.y+b.h)+' L'+b.x+','+(b.y+b.h)+' Z',{role:'unknown',width:1.8}).style.opacity='.25';
 var gapHint=st.key==='pentagons';
 // Empty targets always underneath the solids; coloured outlines communicate valid snap targets.
 geo.arr.forEach(function(t){var ghost=NOVA.neonPath(svg,polyPath(t.poly),{role:st.selected===t.id?'unknown':'given',width:1.65,dash:'5 8'});ghost.style.opacity=st.placed.indexOf(t.id)>=0?'.11':'.4';ghost.setAttribute('pointer-events','none');});
 // Compositing roles alternate for a tile-work pattern with no fake gaps.
 geo.arr.forEach(function(t,n){if(st.placed.indexOf(t.id)<0)return;var g=E('g',{'data-maths':'placed-tile-'+t.id},svg),role=n%3===0?'given':n%3===1?'result':'op';NOVA.neonPath(g,polyPath(t.poly),{role:role,width:3.45,fill:true});
 var hit=E('path',{d:polyPath(t.poly),fill:'transparent',stroke:'transparent','stroke-width':9,'pointer-events':'all'},g); if(o.drag){dragTile(svg,g,geo,st,t.id,o.redraw,false);}else g.setAttribute('pointer-events','none');
 });
 // Valid empty slots have a centre marker; names are not crowded onto the maths.
 if(o.drag){geo.arr.forEach(function(t){if(st.placed.indexOf(t.id)>=0)return;var q=t.centre;var hit=E('g',{tabindex:0,role:'button','data-maths':'empty-slot-'+t.id,'aria-label':'Add one '+d.name+' tile here'},svg);NOVA.neonRing(hit,q[0],q[1],{role:'result',r:7});hit.style.opacity='.5';hit.addEventListener('click',function(){put(st,t.id);o.redraw('click');});hit.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();put(st,t.id);o.redraw('keyboard');}});});}
 // Construction rays: translate a copy by the same lattice vector, so the edges meet.
 if(o.rays&&d.type!=='pent'){var first=geo.arr[0],second=geo.arr.find(function(t){return t.j===0&&t.i===1&&!t.flipped;});if(first&&second){var a=first.centre,z=second.centre;NOVA.neonPath(svg,'M'+a.join(',')+' L'+z.join(','),{role:'unknown',width:3,dash:'6 6'});NOVA.neonRing(svg,z[0],z[1],{role:'unknown',r:6});}}
 if(o.angles){var text=gapHint?'108° at each vertex · does not fill 360°':d.type==='quad'?'Opposite angles add to 180° · four meet at 360°':d.type==='tri'?'6 × 60° = 360°':'3 × 120° = 360°';chalk(svg,p.W/2,p.plot.y+p.plot.h+21,text,gapHint?'unknown':'result',mobile?16:18);}
 if(gapHint){chalk(svg,p.W/2,p.plot.y+p.plot.h+19,'Regular pentagons leave gaps', 'unknown',mobile?18:21);}
 if(o.drag){ // Genuine draggable seed tile (same core drag kit as F2).
 var sample=geo.arr[0],cc=sample.centre,tray=[mobile?73:79,p.H-39],q=sample.poly.map(function(v){return [tray[0]+(v[0]-cc[0])*.42,tray[1]+(v[1]-cc[1])*.42];});
 var g=E('g',{'data-maths':'tile-tray'},svg);NOVA.neonPath(g,polyPath(q),{role:'unknown',width:3,fill:true});dragTile(svg,g,geo,st,null,o.redraw,true);
 chalk(svg,mobile?121:134,p.H-34,'DRAG A TILE', 'unknown',mobile?16:19,'start');
 NOVA.neonPath(svg,'M'+(p.W-116)+','+(p.H-58)+' L'+(p.W-13)+','+(p.H-58)+' L'+(p.W-13)+','+(p.H-14)+' L'+(p.W-116)+','+(p.H-14)+' Z',{role:'op',width:2,dash:'5 5'}).style.opacity='.65';
 chalk(svg,p.W-65,p.H-29,'REMOVE', 'unknown',mobile?16:18);
 }else{chalk(svg,p.W/2,p.H-27,o.foot||'No gaps. No overlaps.',gapHint?'unknown':'result',mobile?18:20);}
 stage.appendChild(svg);
 if(o.readout){var row=h('div',{class:'f14-readouts'});row.appendChild(NOVA.neonTile('Tiles: '+placed+' / '+geo.arr.length,{role:'given'}));row.appendChild(NOVA.neonTile(d.canTile?'Edge to edge':'Gaps remain',{role:d.canTile?'result':'unknown'}));stage.appendChild(row);}
 NOVA.scene.helperStrip(stage,o.pose||'explain',o.say||'Move each piece until the edges meet. A true tessellation leaves no gaps or overlaps.');return svg;}
var STEPS=[
 {name:'The first tile',pose:'explain',prompt:'What would happen if we repeated this square?',narration:'A tessellation covers a surface with repeated shapes. Begin with one square.'},
 {name:'Predict the neighbour',pose:'think',prompt:'Which edge should meet the next edge?',narration:'Copy the square and move it by exactly one side length. It must share an entire edge.'},
 {name:'Translate, do not stretch',pose:'point-right',prompt:'What stays the same when the tile slides?',narration:'Every copied tile keeps its shape and size. A translation moves the tile without turning or changing it.'},
 {name:'Complete the row',pose:'count',prompt:'Can you see any space between the tiles?',narration:'Now add more squares along the row. The boundaries fit together with no gaps and no overlaps.'},
 {name:'Fill the whole pattern',pose:'compare',prompt:'Why can this pattern continue?',narration:'Build row after row. The same edges match everywhere, so the pattern can repeat across the plane.'},
 {name:'Check angles at a vertex',pose:'celebrate',prompt:'How many right angles meet at one point?',narration:'Four ninety degree corners make a full three hundred and sixty degrees. That is why squares tessellate.'}
];
function watch(i,stage){var k=clamp(i|0,0,5),n=[1,1,2,4,12,16][k],st=buildPreset('squares',n);draw(stage,st,{cap:'Discover tessellation',sub:STEPS[k].name,tag:'STEP '+(k+1)+'/6',headline:k===5?'Four right angles make one full turn':'Fit the edges, not just the corners',rays:k===1||k===2,angles:k===5,readout:true,pose:STEPS[k].pose,say:['One tile begins the pattern.','Predict exactly where the copied square should go.','A translation keeps the same size and shape.','Now the row has no gaps.','The rows repeat to cover the surface.','Four corners of 90° meet at every interior vertex.'][k]});}
function btn(t,fn){return h('button',{class:'nova-btn',text:t,onclick:fn});}
var DEF={id:'F14-09',title:'Tessellation maker',config:CONFIG,steps:STEPS,render:watch,
 alt:'Exact squares, equilateral triangles and hexagons repeat edge to edge. The pupil can drag tiles to highlighted positions with no gaps or overlaps.',
 staticAlt:'Four squares of 90 degrees, six equilateral triangles of 60 degrees, or three regular hexagons of 120 degrees fit around a point, making 360 degrees.',
 exploreIntro:'Choose a polygon family, drag a tile from the tray onto an empty position, fill or clear the pattern, and compare whether the edges meet. Click or press Enter on any dotted slot as a keyboard alternative.',
 explore:function(panel,stage,api){window.NovaLessonComponent?.applyExploreModels();var st=buildPreset(CONFIG.preset,1),sel=h('select',{class:'nova-input','aria-label':'Tessellation shape preset'}),status=h('div',{class:'f14-status'}),showAngles=false;
 window.NovaLessonComponent?.applyExploreModels();Object.keys(CONFIG.presets).forEach(function(k){sel.appendChild(h('option',{value:k,text:CONFIG.presets[k].label}))});window.NovaLessonComponent?.applyExploreModels();sel.value=st.key;
 window.NovaLessonComponent?.applyExploreModels();function paint(){draw(stage,st,{cap:'Explore tessellations',sub:CONFIG.presets[st.key].name,tag:'MAKE · SNAP · TEST',headline:'Build a pattern without gaps',drag:true,angles:showAngles,readout:true,pose:isFilled(st)?'celebrate':'explain',say:isFilled(st)?'Excellent! All the pieces connect edge to edge.':CONFIG.presets[st.key].canTile?'Fill the dotted positions. These copies fit side by side.':'Regular pentagons alone cannot close every gap.',redraw:paint});status.textContent=isFilled(st)?'Pattern complete: all the tile positions are filled.':CONFIG.presets[st.key].canTile?'Placed '+st.placed.length+' out of '+tiles(st.key).length+'. Add tiles to continue the tessellation.':'Regular pentagons leave a gap at their vertices: 3 × 108° = 324°, not 360°.';}
 window.NovaLessonComponent?.applyExploreModels();sel.onchange=function(){st=buildPreset(sel.value,1);CONFIG.preset=sel.value;emit('preset',sel.value);paint();};window.NovaLessonComponent?.applyExploreModels();panel.appendChild(h('label',{class:'pr-row'},['Tessellation shape ',sel]));
 window.NovaLessonComponent?.applyExploreModels();var row=h('div',{class:'pr-row'});window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Add next tile',function(){var next=tiles(st.key).find(function(t){return st.placed.indexOf(t.id)<0;});if(next&&CONFIG.presets[st.key].canTile){put(st,next.id);paint();}}));
 window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Fill pattern',function(){if(CONFIG.presets[st.key].canTile){st.placed=tiles(st.key).map(function(t){return t.id});emit('placed',st.placed.slice());paint();}}));
 window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Remove last',function(){var id=st.placed.pop();if(id!=null){emit('removed',id);paint();}}));window.NovaLessonComponent?.applyExploreModels();row.appendChild(btn('Reset tiles',function(){st=buildPreset(st.key,1);paint();}));window.NovaLessonComponent?.applyExploreModels();panel.appendChild(row);
 window.NovaLessonComponent?.applyExploreModels();var angleBtn=btn('Show vertex angles',function(){showAngles=!showAngles;angleBtn.textContent=showAngles?'Hide vertex angles':'Show vertex angles';paint();});window.NovaLessonComponent?.applyExploreModels();panel.appendChild(angleBtn);window.NovaLessonComponent?.applyExploreModels();panel.appendChild(status);window.NovaLessonComponent?.applyExploreModels();paint();
 },
 challenge:function(panel,api,stage){var dragSt=buildPreset('squares',5),dragTri=buildPreset('triangles',4);var choice=function(rows){return NOVA.choiceTask(rows.map(function(r){return {label:r[0],value:r[1]}}),'F14-09');};
 var tasks=[
 {q:'Which regular shape tessellates on its own without gaps?',build:choice([['A square','yes'],['A regular pentagon','pent'],['A regular octagon','oct'],['A circle','circ']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Squares share complete edges, and four right angles make 360°.':v==='pent'?'Three 108° angles total 324°, leaving a 36° gap.':v==='oct'?'Regular octagons need another shape to fill the gaps.':'Circles leave spaces between them.'];},hint:'Check the angles where tiles meet.'},
 {q:'How many square corners meet around one interior point?',build:choice([['4','yes'],['3','three'],['5','five'],['6','six']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Four lots of 90° make 360°.':'Divide a full turn by 90°.'];},hint:'360° ÷ 90°'},
 {q:'How many equilateral-triangle corners fit round a vertex?',build:choice([['6','yes'],['3','three'],['4','four'],['5','five']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Six angles of 60° fit exactly.':'Each interior angle is 60°. How many fill 360°?'];},hint:'360° ÷ 60°'},
 {q:'How many regular hexagons meet at one vertex?',build:choice([['3','yes'],['6','six'],['4','four'],['2','two']]),check:function(v){return [v==='yes',v==='yes'?'Correct. Three corners of 120° make 360°.':'A regular hexagon has an interior angle of 120°.'];},hint:'360° ÷ 120°'},
 {q:'Why can regular pentagons not tessellate the plane by themselves?',build:choice([['Their 108° corners do not fill 360°','yes'],['They have five sides','five'],['They are too large','large'],['All pentagons fail to tessellate','all']]),check:function(v){return [v==='yes',v==='yes'?'Correct. 3 × 108° = 324°, leaving a 36° gap.':v==='all'?'Some irregular pentagons do tessellate. The question concerns regular pentagons.':'The problem is their angle around a vertex, not their size or side count alone.'];},hint:'At most three 108° angles fit without exceeding 360°.'},
 {q:'Drag a square tile from the gold tray onto an empty dashed square.',build:function(){return function(){return dragSt.placed.length;}},check:function(v){var good=v>=6;return [good,good?'Well placed. The tile snaps into an edge-to-edge position.':'Drag the gold tile to an empty dotted outline, or press Enter on a dotted square.'];},hint:'The green outlined slots are valid positions.'},
 {q:'Complete the next triangular tile in the tessellation.',build:function(){return function(){return dragTri.placed.length;}},check:function(v){return [v>=5,v>=5?'Correct. A matching triangle fills the next gap, edge to edge.':'Fill one more dotted triangular space without covering a tile.'];},hint:'Use the gold tray or focus a dotted triangle and press Enter.'}
 ];
 var idxKeys=['squares','squares','triangles','hexagons','pentagons','squares','triangles'];
 function show(i){var st=i===5?dragSt:i===6?dragTri:buildPreset(idxKeys[i],i===4?5:3);draw(stage,st,{cap:'Challenge '+(i+1),sub:CONFIG.presets[st.key].name,tag:'THINK · TEST · CHECK',headline:i>=5?'Place the next tile':i===4?'Does a gap remain?':'Do these angles meet at 360°?',drag:i>=5,readout:false,angles:false,pose:'think',say:i>=5?'Fit the tile into an empty slot, then check your work.':'Check whether the polygon corners fill an entire turn.',redraw:function(){show(i);}});}
 NOVA.challengeRun(panel,api,tasks,show,CONFIG);
 }
};

/* Versioned native lesson hook; no artwork replacement. */
window.NovaV2Integration.register('F14-09',DEF,{models:{},tables:{"STEPS":()=>STEPS},draws:{"draw":["stage","st","o"]},exploreFields:{}});
NOVA.bankMount({id:'F14-09',num:'F14·09',title:'Tessellation maker',def:DEF,years:'KS3 Year 7 · Y7-055 Symmetry, extending to Years 8–9.',linked:['F0-02','F0-03','F0-04','F14-03','F14-07','F14-08'],spec:{
 purpose:'Construct mathematically exact repeating tilings and determine whether polygons can cover a plane without gaps or overlaps.',
 params:'Tile type, polygon vertices, lattice vectors, number of rows and columns, placed-tile occupancy, vertex angles and snapping tolerances.',
 presets:'Squares; equilateral triangles; regular hexagons; rhombi; parallelograms; regular pentagons as a deliberate non-tessellating comparison.',
 steps:'See one tile → predict its neighbour → translate an identical tile → fill the row → repeat the rows → justify the vertex angles.',
 interactions:'Drag gold tiles into outlined target positions; click or keyboard-place; remove or rearrange placed tiles; Fill pattern, Reset, vertex-angle toggle; Watch, Guided, Explore and Challenge.',
 traps:'Leaving small gaps, allowing overlaps, rotating without matching edges, believing all regular polygons tessellate, confusing a pentagon with a regular pentagon, failing to reach 360° at a vertex.',
 gcse:'Extend into semiregular tessellations, mixed regular polygons, symmetry groups and transformations of periodic tilings.'}});
var log=document.getElementById('log');if(log){var report=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};NOVA.events.history().forEach(report);NOVA.events.on('*',report);var clear=document.getElementById('clearlog');if(clear)clear.onclick=function(){log.textContent='';};}
})();

