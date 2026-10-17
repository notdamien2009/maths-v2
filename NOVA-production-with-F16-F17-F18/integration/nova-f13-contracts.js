/* F13 3D solids, surface area and volume: domain checks for lesson records. All numbers must be finite; the native draw
   arguments of each engine are range-checked against the engine's own tables and Explore control ranges, so a lesson cannot
   draw an impossible or off-stage solid (unknown shape, negative lengths, a fill above 100%, a scale factor the drawing cannot fit). */
(function(w){'use strict';const I=Number.isInteger,num=v=>typeof v==='number'&&Number.isFinite(v),between=(v,a,b)=>num(v)&&v>=a&&v<=b,opt=(v,a,b)=>v===undefined||between(v,a,b),one=(v,list)=>v===undefined||list.includes(v),intIn=(v,a,b)=>v===undefined||(I(v)&&v>=a&&v<=b);
function walk(v,path,errors){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',errors));return;}
 for(const k of Object.keys(v)){const x=v[k];if(typeof x==='number'&&!Number.isFinite(x))errors.push(path+'.'+k+' must be finite');if(x&&typeof x==='object'&&!(x.nodeType))walk(x,path+'.'+k,errors);}}
/* Unit-cube grids (F13-03 to F13-05): N × N columns (N = 4), each 0–4 cubes high. */
const grid=g=>g===undefined||(Array.isArray(g)&&g.length===4&&g.every(r=>Array.isArray(r)&&r.length===4&&r.every(n=>I(n)&&n>=0&&n<=4)));
const ang=v=>opt(v,-6.3,6.3);
const SOLIDS1=['cube','cuboid','triPrism','pyramid','cylinder','cone','sphere'],NETS=['cube','cuboid','prism','pyramid'],SHAPES6=['rectangle','triangle','trapezium','lshape','pentagon'],
 P7=['classic','cube','parcel','tower','shallow','custom','own'],P8=['classic','slender','wide','balanced','column','custom','own'],P9=['cone','coneSmall','coneTall','pyramid','pyramidSmall','pyramidWide','custom','own'],
 P10=['r2','r3','r4','r5','r6','custom','own'],SOL11=['cube','cuboid','tri','pyramid','cylinder','cone','sphere'],P12=['empty','hundred','quarter','half','threeQuarter','full','cubicMetre','custom','own'],
 D13=['cube2','cube3','cuboid','parcel','prism','prismSmall','pyramid','pyramidLarge'],D14=['cube','cuboid','slab','tower','crate'];
const S={
 'F13-01':{mountStage:a=>{const o=a.st||{};return one(o.shape,SOLIDS1)&&one(o.show,['none','all','faces','edges','vertices'])&&ang(o.yaw)&&ang(o.pitch)||'F13-01 mountStage needs a known solid, show none/all/faces/edges/vertices and finite yaw/pitch';},
  mainDrawing:a=>{const o=a.st||{};return one(o.shape,SOLIDS1)&&ang(o.yaw)&&ang(o.pitch)||'F13-01 mainDrawing needs a known solid';},facts:a=>{const o=a.st||{};return one(o.shape,SOLIDS1)||'F13-01 facts needs a known solid';}},
 'F13-02':{scene:a=>{const o=a.st||{};return one(o.shape,NETS)&&opt(o.fold,0,1)&&ang(o.yaw)&&ang(o.pitch)||'F13-02 scene needs a cube/cuboid/prism/pyramid net and fold 0–1';},counts:a=>{const o=a.st||{};return one(o.shape,NETS)||'F13-02 counts needs a known net';}},
 'F13-03':{visual:a=>{const o=a.st||{};return grid(o.grid)||'F13-03 visual needs a 4 × 4 grid of column heights 0–4';}},
 'F13-04':{renderStage:a=>{const o=a.st||{};return grid(o.grid)||'F13-04 renderStage needs a 4 × 4 grid of column heights 0–4';}},
 'F13-05':{renderStage:a=>{const o=a.st||{};return grid(o.grid)&&intIn(o.reveal,0,4)||'F13-05 renderStage needs a 4 × 4 grid of column heights 0–4';}},
 'F13-06':{renderStage:a=>{const o=a.st||{};return one(o.shape,SHAPES6)&&intIn(o.length,1,8)&&opt(o.cut,0,1)||'F13-06 renderStage needs a known cross-section, whole length 1–8 and cut 0–1';}},
 'F13-07':{renderStage:a=>{const o=a.st||{};return one(o.preset,P7)&&intIn(o.l,1,6)&&intIn(o.w,1,6)&&intIn(o.ht,1,6)&&opt(o.unfold,0,100)&&one(o.group,['all','top','front','side'])||'F13-07 renderStage needs whole l, w, h 1–6 and unfold 0–100';}},
 'F13-08':{stageBuild:a=>{const o=a.st||{};return one(o.preset,P8)&&intIn(o.r,1,4)&&intIn(o.ht,1,6)&&opt(o.unroll,0,100)||'F13-08 stageBuild needs whole r 1–4, h 1–6 and unroll 0–100';}},
 'F13-09':{makeStage:a=>{const o=a.st||{};return one(o.preset,P9)&&one(o.kind,['cone','pyramid'])&&intIn(o.base,2,8)&&intIn(o.ht,2,8)&&intIn(o.pours,0,3)||'F13-09 makeStage needs cone/pyramid, whole base and height 2–8 and 0–3 pours';}},
 'F13-10':{makeStage:a=>{const o=a.s||{};return one(o.preset,P10)&&intIn(o.r,2,8)&&opt(o.cut,-1,1)&&ang(o.yaw)&&ang(o.pitch)||'F13-10 makeStage needs a whole radius 2–8 and cut −1 to 1';}},
 'F13-11':{makeStage:a=>{const o=a.s||{};return one(o.shape,SOL11)&&one(o.orient,['horizontal','vertical','tilted'])&&opt(o.pos,-1,1)&&ang(o.yaw)&&ang(o.pitch)||'F13-11 makeStage needs a known solid, cut direction and plane position −1 to 1';}},
 'F13-12':{makeStage:a=>{const o=a.s||{};return one(o.preset,P12)&&one(o.mode,['litre','metre'])&&opt(o.fill,0,1)||'F13-12 makeStage needs litre/metre mode and fill 0–1';}},
 'F13-13':{makeStage:a=>{const o=a.s||{};return one(o.preset,D13)&&opt(o.fold,0,1)&&ang(o.yaw)&&ang(o.pitch)||'F13-13 makeStage needs a known solid and fold 0–1';}},
 'F13-14':{makeStage:a=>{const o=a.s||{};return one(o.preset,D14)&&opt(o.k,0.5,3)&&one(o.focus,['length','area','volume'])||'F13-14 makeStage needs a known solid, scale factor 0.5–3 and focus length/area/volume';}}};
w.NovaF13Contracts={validate(id,r){const e=[];if(!r||typeof r!=='object')return e;const sc=r.scene||{};
 const chk=S[id]&&sc.function&&S[id][sc.function];if(chk){const ok=chk(sc.arguments||{});if(ok!==true)e.push(ok);}
 for(const k of ['data','nativeData','config'])if(r[k])walk(r[k],k,e);if(sc.arguments)walk(sc.arguments,'scene',e);if(r.explore)walk(r.explore.value,'explore',e);return e;}};})(window);
