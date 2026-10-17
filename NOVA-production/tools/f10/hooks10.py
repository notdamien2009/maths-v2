# Per-engine hook settings for build10.py. model: native model expression; apply: code run when state.preset is given (K key, P preset, M model);
# after: code after overrides; hid: concealed draw; show: revealed phase draw (p = phase); rev: first revealed phase.
H={}
H['F10-01']=dict(model='ST',apply="M.preset=K;M.points=clone(P.points)",
 hid="renderBoard(stage,{show:4,read:false,showQuadrants:true,active:'',curve:false,drag:false,helper:'Count the grid squares between the points.'})",
 show="renderBoard(stage,{show:Math.max(1,Math.min(4,p-1)),showQuadrants:true,read:p>=5,active:(ST.points[Math.max(0,Math.min(ST.points.length-1,p-2))]||{}).id,curve:p>=6,stepName:p>=5?'reading':'first'})",
 hidNote='all points plotted with letter labels; coordinates are not written beside the points')
H['F10-02']=dict(model='S',apply="M.preset=K;M.op=P.op;M.dx=P.dx;M.dy=P.dy;M.vertices=copy(BASE)",
 hid="scene(stage,{op:S.op,dx:S.dx,dy:S.dy,base:S.vertices,showImage:false,pose:'think',caption:'Apply the rule to every vertex.'})",
 show="scene(stage,{op:S.op,dx:S.dx,dy:S.dy,base:S.vertices,showImage:p>=2,highlight:p>=3,pose:p>=2?'point':'explain',caption:['Start with the original shape.','Read each vertex: x first, then y.','Apply the same rule to every vertex.','Check each image vertex against the rule.','Every vertex follows the same rule.'][Math.min(p,4)]})",
 hidNote='source shape and rule only; the image is not drawn')
H['F10-03']=dict(model='S',apply="M.preset=K;M.a=point(P.a);M.b=point(P.b)",
 hid="scene(stage,{a:S.a,b:S.b,view:'line',pose:'think',caption:'Use the two plotted points.'})",
 show="{const t=T[Math.min(p,T.length-1)];scene(stage,{a:S.a,b:S.b,view:t.view,pose:t.pose,step:Math.min(p,T.length-1)});}",
 hidNote='both points and the segment; no construction, midpoint or distance')
H['F10-04']=dict(model='state',apply="M.preset=K",
 hid="scene(stage,{preset:state.preset,mode:'points',visible:4,selected:0,pose:'think',caption:'Use the rule to extend the table.'})",
 show="{const t=STEPS[Math.min(p,STEPS.length-1)];scene(stage,{preset:state.preset,mode:t.view,visible:t.row,selected:t.row<0?0:t.row,pose:t.pose});}",
 hidNote='rule, table rows and plotted points; the asked value lies outside the table')
H['F10-05']=dict(model='S',apply="M.preset=K;M.m=P.m;M.c=P.c",
 patch=[("(o.task===0?'y = −x + c':","(o.task===0?formula(m,0,true)+' + c':")],patchNote='Challenge task-0 rule text is built from the drawn gradient (was fixed to y = −x + c; identical for m = −1)',
 hid="{const T=f10Tab(),L='__f105h'+(++f10N);Object.defineProperty(T,L,{value:{...T[S.preset],m:S.m,c:pData(S.preset).proportion?0:S.c},configurable:true,writable:true,enumerable:false});scene(stage,{preset:L,challenge:true,task:pData(S.preset).proportion?2:0,correct:false,pose:'think',caption:'Find the relationship from the graphical evidence.'});}",
 hidNote="native Challenge view (line and crossing, values hidden); direct-proportion presets use the F6-08 'y = kx' view")
H['F10-06']=dict(model='S',apply="M.preset=K;M.A=[...P.A];M.B=[...P.B]",
 hid="scene(stage,{challenge:true,correct:false,pose:'think',caption:'A ('+key(S.A)+') to B ('+key(S.B)+'): measure the rise and run.'})",
 hidNote='native Challenge view: line through A and B, rise/run triangle hidden')
H['F10-07']=dict(model='S',apply="M.preset=K;M.m2=P.m;M.c2=P.c2;M.edge=false",
 hid="scene(stage,{challenge:true,task:0,correct:false,pose:'think',caption:'Use the gradient of line A.'})",
 hidNote='native Challenge view: line A only, line B hidden')
H['F10-08']=dict(model='S',apply="M.preset=K;M.shift=0;M.variant='normal';M.candidate=1.5",
 hid="scene(stage,{challenge:true,correct:false,pose:'think',caption:'Find where both graphs meet.'})",
 show="scene(stage,{step:Math.min(p,9),pose:p>=3?'point':'explain',caption:p>=3?'Both graphs share this point.':'Read both graphs.'})",
 hidNote='native Challenge view: both graphs drawn, intersection markers hidden')
H['F10-09']=dict(model='S',apply="M.preset=K;M.x=3.5",
 hid="scene(stage,{challenge:true,correct:false,pose:'think',caption:'Read the graph and its units.'})",
 show="scene(stage,{step:Math.min(p,11),pose:p>=3?'point':'explain',caption:'Interpret the graph by reading both axes and their units.'})",
 hidNote='native Challenge view: graph and units, data markers and read-off guides hidden')
H['F10-10']=dict(model='S',apply="M.preset=K",
 hid="scene(stage,{challenge:true,pose:'think',caption:'Answer from the journey, not from a guess.'})",
 show="scene(stage,{step:Math.min(p,11),pose:p>=2?'point':'explain',caption:['Read distance and time using the labelled graph.','Follow the journey section by section.','Read a point: time across, distance up.','A flat section means resting.','A steeper section means faster travel.','Speed is distance ÷ time for one section.','Compare every section of the journey.'][Math.min(p,6)]})",
 hidNote='native Challenge view: the whole journey, no read-off guide')
H['F10-11']=dict(model='S',apply="M.preset=K",
 hid="scene(stage,{challenge:true,pose:'think',caption:'Decide whether this asks for gradient, velocity, displacement or distance.'})",
 show="scene(stage,{step:Math.min(p,11),pose:p>=2?'point':'explain',caption:['A velocity–time graph shows how motion changes over time.','Follow the motion section by section.','Read the velocity at a time.','The gradient is the acceleration.','A flat section means steady velocity.','The area under the graph is the displacement.','Below zero means moving backwards.'][Math.min(p,6)]})",
 hidNote='native Challenge view: graph and signed areas, no read-off')
H['F10-12']=dict(model='S',apply="M.preset=K;M.a=P.a;M.h=P.h;M.k=P.k;M.x=clamp(P.h-2,-5,5)",
 hid="scene(stage,{challenge:true,pose:'think',caption:'Use the graph to reason; the answer labels are hidden until marking.'})",
 show="scene(stage,{step:Math.min(p,12),pose:p>=5?'point':'explain',caption:['Explore how a quadratic curve bends, crosses axes and turns.','Plot points from the table.','Look at the differences in the table.','Join the points with a smooth curve.','A quadratic curve is symmetrical.','The roots are where y = 0.','The turning point is on the line of symmetry.','The line of symmetry passes through the vertex.'][Math.min(p,7)]})",
 hidNote='native Challenge view: the curve, with roots, vertex and symmetry line hidden')
H['F10-13']=dict(model='S',apply="M.preset=K;M.k=P.k||12;M.b=P.b||2;M.a=P.a||.25;M.x=P.kind==='reciprocal'?(P.x[0]>=0?2:-2):P.kind==='exponential'?1:2",
 hid="scene(stage,{challenge:true,pose:'think',caption:'Read the curve and calculate: the numerical read-off stays hidden until marking.'})",
 show="scene(stage,{step:Math.min(p,12),pose:p>=5?'point':'explain',caption:['Explore three mathematical curve families.','Build a table of values.','Plot the values.','Join them with a smooth curve.','Notice how the curve changes.','Check the rule at one point.','Read values from the curve.'][Math.min(p,6)]})",
 hidNote='native Challenge view: the curve, numerical landmarks hidden')
H['F10-14']=dict(model='S',apply="M.preset=K;M.h=P.h;M.k=P.k;M.a=P.a",
 hid="scene(stage,{challenge:true,pose:'think',caption:'Look carefully at the graph: the numerical evidence stays hidden until marking.'})",
 show="scene(stage,{step:Math.min(p,13),pose:p>=5?'point':'explain',caption:['Compare the fixed ghost parabola with its transformation.','Start from y = x².','Move the curve with h and k.','The turning point is (h, k).','The symmetry line is x = h.','a stretches or reflects the curve.','Read the roots where the curve meets the x-axis.'][Math.min(p,6)]})",
 hidNote='native Challenge view: ghost and transformed curves, turning point and roots hidden')
H['F10-15']=dict(model='S',patch=[("sgn=S.m>=0?' + ':' − '","sgn=S.b>=0?' + ':' − '"),("(inside(S.point)?'SATISFIES':'DOES NOT SATISFY')","(q.challenge&&!q.correct?'DECIDE: does it satisfy?':inside(S.point)?'SATISFIES':'DOES NOT SATISFY')")],
 patchNote='inequality text uses the sign of the constant (native showed y ≤ −x − 2 for y ≤ −x + 2); the test-point verdict is hidden in an unmarked Challenge',apply="M.preset=K;M.type=P.type;M.a=P.a;M.op=P.op;M.m=P.m||0;M.b=P.b??P.a;M.op2=P.op2||'<';M.point=[...P.point]",
 hid="scene(stage,{phase:1,challenge:true,pose:'think',caption:'Test the point against the inequality. Equality only counts when it is included.'})",
 show="scene(stage,{phase:Math.min(p,6),pose:p>=5?'point':'explain',caption:['Shade exactly the values that make the inequality true.','Draw the boundary line.','Solid means included; dashed means not included.','Pick a test point.','Check the test point in the inequality.','Shade the side that works.','Every shaded point satisfies the inequality.'][Math.min(p,6)]})",
 hidNote='boundary only (phase 1), no shading or membership label')
H['F10-16']=dict(model='P',apply="M.preset=K;M.centre=[...P.centre];M.radius=P.radius;M.solved=false;M.wrong=0;M.matches={};M.selected=null",
 hid="scene(stage,{phase:10,challenge:true,pose:'think',caption:'Read the radius from the grid, then use it. The measurement stays hidden until marking.'})",
 show="scene(stage,{phase:Math.min(p,10),pose:p>=5?'point':'explain',caption:['A circle is every point at one fixed distance from its centre.','Plot the centre C.','Draw one radius r.','Sweep the radius all the way round.','Every radius has the same length.','A diameter passes through the centre: d = 2r.','Use the radius for circumference and area.'][Math.min(p,6)]})",
 hidNote='native Challenge view: r = ? and no distance readout')
H['F10-17']=dict(model='state',patch=[("N.motion.trail(svg,curve,graph.colour,430)","N.motion.trail(svg,plotPath(graph,g),graph.colour,430)")],
 patchNote='focus trail now receives the path data (native passed the SVG group, logging an SVG error per draw)',apply="M.preset=K;M.matched={};M.selected=null;M.readPoint={};M.challengeChoice=null;M.challengeTask=null;M.showAnswer=false",
 hid="scene(stage,{challenge:true,title:'WHICH GRAPH?',point:'Match the rule in the question to graph A, B or C.',explain:'Look at the shape, the intercept and the gradient.',pose:'think',narration:'Inspect every graph before choosing.'})",
 show="scene(stage,{title:['GRAPH FAMILY STUDIO','READ THE AXES','LOOK AT THE SHAPE','FIND THE INTERCEPT','CHECK THE GRADIENT','MATCH THE RULE','PROVE THE MATCH'][Math.min(p,6)],point:['Read the graphs','Check the scales on both axes.','Straight, U-shaped or curved?','Where does each graph cross the y-axis?','Does it rise or fall, and how fast?','Pair the rule with the graph that fits every feature.','Test one point on the graph in the rule.'][Math.min(p,6)],pose:p>=5?'point':'explain'})",
 hidNote='native Challenge view: no match marks, no selected graph, no proof caption')
H['F10-18']=dict(model='S',patch=[("N.motion.trail(svg,stroke,role,530)","N.motion.trail(svg,'M'+la.map(v=>v.toFixed(2)).join(',')+'L'+lb.map(v=>v.toFixed(2)).join(','),role,530)")],
 patchNote='segment trail now receives the path data (native passed the SVG group, logging an SVG error per draw)',apply="setPreset(K,false)",
 hid="scene(stage,{phase:14,challenge:true,pose:'think',caption:'Read the scale and the endpoint rings before answering.'})",
 show="scene(stage,{phase:Math.min(p,14),focus:p===3?2:p===2?1:0,pose:p>=5?'point':'explain',caption:['A graph may use more than one rule.','Read the first interval.','Find where the rule changes.','Compare the gradients of the intervals.','Check each join: continuous or a jump?','Open rings exclude an endpoint; filled rings include it.','Read x first, then y.'][Math.min(p,6)]})",
 hidNote='native Challenge view: gradients m = ? and the reading line hidden')
H['F10-19']=dict(model='S',patch=[("read===null?'This output does not exist at an asymptote.'","!hidden&&read===null?'This output does not exist at an asymptote.'")],
 patchNote='the asymptote note is hidden in an unmarked Challenge (it gave away tan 90° = undefined)',apply="setPreset(K,false)",
 hid="scene(stage,{phase:15,challenge:true,pose:'think',caption:'Check the graph at the stated angle. Sine and cosine differ, and tangent can be undefined.'})",
 show="scene(stage,{phase:Math.min(p,15),pose:p>=5?'point':'explain',caption:['One angle drives every trigonometric graph.','Angles run along the horizontal axis.','Trace one full wave.','The unit circle gives the height.','Read the value at the marked angle.','Compare sin, cos and tan.','Amplitude, period and shifts change the wave.'][Math.min(p,6)]})",
 hidNote='native Challenge view: angle readout and values hidden')
H['F10-20']=dict(model='S',rec=['scene'],apply="applyPreset(K,false)",
 patch=[("S.kind==='concave'?'For this concave-down example","hide?'Compare the straight trapezium tops with the curve.':S.kind==='concave'?'For this concave-down example")],
 patchNote='the over/under note is hidden in an unmarked Challenge (it gave away the concave answer)',
 hid="scene(stage,{challenge:true,pose:'think',caption:'Estimate first. The gradient and area evidence stays hidden until marking.'})",
 show="scene(stage,{phase:Math.min(p,15),pose:p>=5?'point':'explain',caption:['Watch the curve: its steepness changes.','Trace the curve from left to right.','Where is it steepest?','A tangent touches the curve at one point.','Its gradient is the gradient of the curve there.','Split the region into trapezia.','Add the trapezium areas to estimate the region.'][Math.min(p,6)]})",
 hidNote='native Challenge view: tangent gradient, trapezium estimate, true area and error hidden')
