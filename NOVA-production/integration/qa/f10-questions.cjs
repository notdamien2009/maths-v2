/* F10 Challenge questions for QA. state = {preset?, ...overrides of the engine's own model fields}. Answers are worked out from the drawn values. */
const pt=(id,x,y)=>({id,x,y});
const Q={
'F10-01':[
 [{preset:'Y7-038'},'How many units across is it from B to A?',7,['A','B']],
 [{points:[pt('A',-3,4),pt('B',5,4),pt('C',-3,-2),pt('D',2,-3)]},'How many units across is it from A to B?',8,['A','B']],
 [{points:[pt('A',-4,-1),pt('B',2,-1),pt('C',2,4),pt('D',-4,4)]},'ABCD is a rectangle. How long is side AB?',6,['A','B']],
 [{points:[pt('A',-5,-2),pt('B',3,-2),pt('C',3,4),pt('D',-5,4)]},'ABCD is a rectangle. What is its perimeter?',28,['A','C']],
 [{preset:'Y8-024'},'How many units up is it from A to D?',6,['A','D']],
 [{preset:'Y9-009'},'How many units across is it from A to D?',6,['A','D']]],
'F10-03':[
 [{preset:'Y8-045',a:{x:-4,y:-3},b:{x:2,y:5}},'Find the length of AB.',10,['A','B']],
 [{preset:'Y8-046'},'Find the length of AB to 1 decimal place.',7.8,['A','B']],
 [{preset:'Y9-040'},'Find the length of AB to 1 decimal place.',7.2,['A','B']],
 [{preset:'Y9-010'},'Find the length of AB to 1 decimal place.',8.9,['A','B']],
 [{preset:'Y8-045',a:{x:-5,y:-4},b:{x:3,y:2}},'Find the length of AB.',10,['A','B']],
 [{preset:'Y9-040',a:{x:-4,y:4},b:{x:3,y:-2}},'Find the length of AB to 1 decimal place.',9.2,['A','B']]],
'F10-04':[
 [{preset:'Y8-022'},'Use the rule y = 2x + 1. What is y when x = 4?',9,['y = 2x + 1']],
 [{preset:'Y7-039'},'Use the rule y = x + 2. What is y when x = 6?',8,['y = x + 2']],
 [{preset:'Y8-024'},'Use the rule y = −x + 1. What is y when x = 7?',-6,['y = −x + 1']],
 [{preset:'Y8-030'},'Use the rule y = x² − 3. What is y when x = 3?',6,['y = x² − 3']],
 [{preset:'Y8-022',rule:'y = 3x − 1',ys:[-7,-4,-1,2,5]},'Use the rule y = 3x − 1. What is y when x = 4?',11,['y = 3x − 1']],
 [{preset:'Y8-030',rule:'y = x² + 1',ys:[5,2,1,2,5]},'Use the rule y = x² + 1. What is y when x = 4?',17,['y = x² + 1']]],
'F10-05':[
 [{preset:'Y7-060'},'F6-08 direct proportion: tickets and cost. What do 9 tickets cost in £?',18,['y = kx']],
 [{preset:'Y8-035'},'F6-08 direct proportion: packs and stickers. How many stickers are in 8 packs?',24,['y = kx']],
 [{preset:'Y8-036'},'F6-08 direct proportion: time and distance. How far, in km, is travelled in 10 hours?',15,['y = kx']],
 [{preset:'Y9-020'},'F6-08 direct proportion. What is y when x = 12?',9,['y = kx']],
 [{preset:'Y8-022'},'The line is y = 2x + c. Read c from the graph, then find y when x = 4.',9,['y = 2x + c']],
 [{preset:'Y8-024'},'The line is y = 1.5x + c. Read c from the graph, then find y when x = 8.',11,['y = 1.5x + c']]],
'F10-06':[
 [{preset:'Y8-022'},'Find the gradient of the line through A and B.',1.5,['A','B']],
 [{preset:'Y8-023',B:[2,-3]},'Find the gradient of the line through A and B.',-1.5,['A','B']],
 [{preset:'Y8-022',A:[-4,-3],B:[4,1]},'Find the gradient of the line through A and B.',0.5,['A','B']],
 [{preset:'Y8-026',B:[5,12]},'Find the speed in km/h (the gradient of the distance–time line).',2.5,['A','B']],
 [{preset:'Y8-028',B:[5,14]},'Find the flow rate in L/min (the gradient).',2.25,['A','B']],
 [{preset:'Y9-017'},'Find the acceleration in m/s² (the gradient of the velocity–time line).',1.5,['A','B']]],
'F10-07':[
 [{preset:'Y8-025'},'Line B is perpendicular to line A. What is the gradient of line B?',-0.5,['m₁']],
 [{preset:'Y9-010'},'Line B is perpendicular to line A. What is the gradient of line B?',0.5,['m₁']],
 [{preset:'Y8-025',m:4,c:-3},'Line B is perpendicular to line A. What is the gradient of line B?',-0.25,['m₁']],
 [{preset:'Y9-010',m:-4,c:3},'Line B is perpendicular to line A. What is the gradient of line B?',0.25,['m₁']],
 [{preset:'Y9-040',m:-1.5,c:2},'Line B is perpendicular to line A. Write the gradient of line B as a fraction a/b.','2/3',['m₁']],
 [{preset:'Y9-040',m:0.75,c:-1},'Line B is perpendicular to line A. What is the gradient of B? Give it as a fraction a/b.','-4/3',['m₁']]],
'F10-08':[
 [{preset:'Y8-029'},'Where do the two lines meet? Write the point as x, y.','2, 3',['GRAPH A']],
 [{preset:'Y8-029',A:[0,2,1],B:[0,-1,4]},'Where do the two lines meet? Write the point as x, y.','1, 3',['GRAPH A']],
 [{preset:'Y8-029',A:[0,1,-2],B:[0,-2,4]},'Where do the two lines meet? Write the point as x, y.','2, 0',['GRAPH A']],
 [{preset:'Y8-033'},'When are the two water levels equal? Write the point as t, level.','3, 4',['GRAPH A']],
 [{preset:'Y8-029',A:[0,0.5,1],B:[0,-1,-2]},'Where do the two lines meet? Write the point as x, y.','-2, 0',['GRAPH A']],
 [{preset:'Y8-031'},'Where does the curve cross the x-axis? Give the roots in order, smaller first, as a, b.','-2, 2',['GRAPH A'],'ordered']],
'F10-09':[
 [{preset:'Y8-026',points:[[0,0],[2,5],[4,5],[6,10],[8,10]]},'What is the speed during the first 2 hours, in km/h?',2.5,['A walk and a rest']],
 [{preset:'Y7-072',points:[[0,7],[2,12],[4,9],[6,16],[8,13]]},'What is the rate of temperature change from 4 to 6 hours, in °C per hour?',3.5,['Temperature through the day']],
 [{preset:'Y8-026',points:[[0,0],[2,3],[4,3],[6,10],[8,10]]},'What is the speed between 4 and 6 hours, in km/h?',3.5,['A walk and a rest']],
 [{preset:'Y8-028',points:[[0,0],[2,3],[4,6],[6,15],[8,18]]},'What is the filling rate from 4 to 6 minutes, in litres per minute?',4.5,['Filling a container']],
 [{preset:'Y8-027',points:[[0,0],[2,5],[4,5],[6,0],[8,-2]]},'What is the acceleration in the first 2 seconds, in m/s²?',2.5,['Forward, stop, reverse']],
 [{preset:'Y9-013'},'The job takes 12 worker-hours. How many hours do 8 workers take?',1.5,['Workers and job time']]],
'F10-10':[
 [{preset:'Y8-026',title:'Morning walk',pts:[[0,0],[2,5],[4,5],[6,10],[8,10]]},'What is the speed during the first 2 hours, in km/h?',2.5,['Morning walk']],
 [{preset:'Y9-016',title:'Delivery van'},'What is the total distance travelled, in km?',20,['Delivery van']],
 [{preset:'Y9-016',title:'Cycle there and back',pts:[[0,0],[2,7],[3,7],[5,1],[6,1],[8,9]]},'What is the total distance travelled, in km?',21,['Cycle there and back']],
 [{preset:'Y8-026',title:'Hill walk',pts:[[0,0],[2,9],[4,9],[6,12],[8,12]]},'What is the speed during the first 2 hours, in km/h?',4.5,['Hill walk']],
 [{preset:'Y9-016',title:'Taxi shift',pts:[[0,0],[2,5],[3,5],[5,1],[6,1],[8,11]]},'What is the total distance travelled, in km?',19,['Taxi shift']],
 [{preset:'Y8-026',title:'Dog walk',pts:[[0,0],[2,7],[4,7],[6,10],[8,10]]},'What is the speed between 4 and 6 hours, in km/h?',1.5,['Dog walk']]],
'F10-11':[
 [{preset:'Y8-027',title:'Bus between stops'},'How far does the bus travel in the 8 seconds, in metres?',24,['Bus between stops']],
 [{preset:'Y9-017',title:'Reversing car'},'What is the net displacement after 8 seconds, in metres?',13,['Reversing car']],
 [{preset:'Y8-027',title:'Lift ride',pts:[[0,0],[2,5],[4,5],[6,0],[8,0]]},'What is the acceleration in the first 2 seconds, in m/s²?',2.5,['Lift ride']],
 [{preset:'Y8-027',title:'Cyclist',pts:[[0,0],[2,8],[5,8],[7,0],[8,0]]},'How far does the cyclist travel, in metres?',40,['Cyclist']],
 [{preset:'Y9-017',title:'Robot'},'What total distance does the robot travel (forwards plus backwards), in metres?',29,['Robot']],
 [{preset:'Y8-027',title:'Train',pts:[[0,0],[3,9],[5,9],[7,3],[8,0]]},'How far does the train travel in 8 seconds, in metres?',45,['Train']]],
'F10-12':[
 [{preset:'Y8-030'},'Write the turning point of the curve as x, y.','1, -4',['QUADRATIC'],'coordinates'],
 [{preset:'Y8-031'},'Give the roots of the curve in order, smaller first, as a, b.','-3, 1',['QUADRATIC'],'ordered'],
 [{preset:'Y8-030',name:'A shifted parabola',h:-2,k:-1},'Give the roots of the curve in order, smaller first, as a, b.','-3, -1',['QUADRATIC'],'ordered'],
 [{preset:'Y9-011'},'Write the turning point of the curve as x, y.','2, -2',['QUADRATIC'],'coordinates'],
 [{preset:'Y8-021',name:'Moved square curve',h:2,k:-4},'Give the roots of the curve in order, smaller first, as a, b.','0, 4',['QUADRATIC'],'ordered'],
 [{preset:'Y9-011',name:'A wider parabola',h:-1,k:-2},'Give the roots of the curve in order, smaller first, as a, b.','-3, 1',['QUADRATIC'],'ordered']],
'F10-13':[
 [{preset:'Y8-037'},'y = 12 ÷ x. Use the curve rule to find y when x = 8.',1.5,['y = 12 ÷ x']],
 [{preset:'Y9-014'},'y = 2ˣ. What is y when x = 6?',64,['y = 2ˣ']],
 [{preset:'Y9-019'},'x × y = 18. What is y when x = 8?',2.25,['y = 18 ÷ x']],
 [{preset:'EXT-DECAY'},'y = 0.5ˣ. What is y when x = −5?',32,['y = 0.5ˣ']],
 [{preset:'EXT-CUBIC'},'y = 0.25x³. What is y when x = 6?',54,['cubic']],
 [{preset:'Y9-013'},'x × y = 6. What is y when x = −4?',-1.5,['y = 6 ÷ x']]],
'F10-14':[
 [{preset:'Y9-011'},'Write the turning point of the transformed curve as x, y.','2, -3',['EQUATION'],'coordinates'],
 [{preset:'SHIFT-RIGHT'},'Use the transformed curve y = (x − 3)². What is y when x = −1?',16,['EQUATION']],
 [{preset:'EXT-STRETCH'},'Use the curve y = 2(x + 2)² − 1. What is y when x = 1?',17,['EQUATION']],
 [{preset:'EXT-REFLECT'},'Use the curve y = −(x + 1)² + 3. What is y when x = 3?',-13,['EQUATION']],
 [{preset:'SHIFT-UP'},'Use the curve y = x² + 3. What is y when x = 4?',19,['EQUATION']],
 [{preset:'ROOT-LESS',h:-1,k:2},'Write the turning point of the transformed curve as x, y.','-1, 2',['EQUATION'],'coordinates']],
'F10-15':[
 [{preset:'Y8-017',point:[4,1]},'Does the test point satisfy the inequality? Answer yes or no.','yes',['x > 2']],
 [{preset:'Y8-017-INCLUSIVE',point:[2,-3]},'Does the test point satisfy the inequality? Answer yes or no.','yes',['x ≥ 2']],
 [{preset:'Y8-017-NEGATIVE',point:[-2,3]},'Does the test point satisfy the inequality? Answer yes or no.','no',['x < −2']],
 [{preset:'GCSE-SLOPE',point:[2,4]},'Does the test point satisfy the inequality? Answer yes or no.','yes',['y > x + 1']],
 [{preset:'GCSE-SLOPE-INCLUSIVE',point:[3,0]},'Does the test point satisfy the inequality? Answer yes or no.','no',['y ≤ −x + 2']],
 [{preset:'Y8-017-LEFT',point:[-1,4]},'Does the test point satisfy the inequality? Answer yes or no.','yes',['x ≤ −1']]],
'F10-16':[
 [{preset:'Y9-040'},'Read the radius from the grid. Find the area of the circle to 1 decimal place.',28.3,['r = ?']],
 [{preset:'Y9-040-DIAMETER'},'Read the radius from the grid. What is the diameter of the circle?',8,['r = ?']],
 [{preset:'Y9-040-DIAMETER',radius:3.5},'Read the radius from the grid. What is the diameter of the circle?',7,['r = ?']],
 [{preset:'Y9-040-SYMMETRY'},'Read the radius from the grid. Find the circumference to 1 decimal place.',12.6,['r = ?']],
 [{preset:'GCSE-SHIFT',radius:2.5},'Read the radius from the grid. Find the area of the circle to 1 decimal place.',19.6,['r = ?']],
 [{preset:'GCSE-ORIGIN'},'Read the radius from the grid. Find the circumference to 1 decimal place.',25.1,['r = ?']]],
'F10-17':[
 [{preset:'Y8-023'},'Which graph matches y = 2x + 1? Choose A, B or C.','A',['CHOOSE A'],'choice'],
 [{preset:'Y8-032'},'Which graph matches y = 5 − x²? Choose A, B or C.','C',['CHOOSE C'],'choice'],
 [{preset:'Y8-033'},'Which graph decreases by 1 each step? Choose A, B or C.','B',['CHOOSE B'],'choice'],
 [{preset:'Y9-012'},'Which graph shows a ball going up, then down? Choose A, B or C.','B',['CHOOSE B'],'choice'],
 [{preset:'Y9-015'},'Which graph jumps at x = 0? Choose A, B or C.','B',['CHOOSE B'],'choice'],
 [{preset:'Y9-020'},'Which graph shows inverse proportion, xy = 8? Choose A, B or C.','B',['CHOOSE B'],'choice']],
'F10-18':[
 [{preset:'Y9-015',readX:6.5},'Read the graph. What is y when x = 6.5?',3.5,['Read the scale']],
 [{preset:'Y9-015-JOURNEY',readX:0.5},'Read the graph. What is y when x = 0.5?',1.5,['Read the scale']],
 [{preset:'Y9-015-CHARGE',readX:1.5},'Read the graph. What is y when x = 1.5?',3.5,['Read the scale']],
 [{preset:'Y9-015-V',readX:1},'Read the graph. What is y when x = 1?',5.5,['Read the scale']],
 [{preset:'Y9-015-STEP'},'Give the value just before x = 3 and the value at x = 3, as a, b.','2, 5',['Read the scale'],'ordered'],
 [{preset:'Y9-015-JUMP'},'Give the value the graph approaches just before x = 4 and the value at x = 4, as a, b.','5, 2',['Read the scale'],'ordered']],
'F10-19':[
 [{preset:'GCSE-SINE',angle:60},'Use the graph and the unit circle. Give sin 60° to 2 decimal places.',0.87,['Check the scale']],
 [{preset:'GCSE-TANGENT',angle:90},'What is tan 90°? Give a number or write undefined.','undefined',['Check the scale'],'text'],
 [{preset:'GCSE-AMPLITUDE',angle:30},'For this stretched sine graph, what is y when x = 30°?',0.75,['Check the scale']],
 [{preset:'GCSE-COMPARE',angle:45},'Give cos 45° to 2 decimal places.',0.71,['Check the scale']],
 [{preset:'GCSE-PHASE'},'Give the maximum and the minimum value of this graph, as a, b.','1.5, -0.5',['Check the scale'],'ordered'],
 [{preset:'GCSE-PERIOD',angle:30},'This graph has two cycles in 360°. Give y at x = 30° to 2 decimal places.',0.87,['Check the scale']]],
'F10-20':[
 [{preset:'GCSE-QUADRATIC'},'Use the tangent. What is the gradient of the curve at x = 3?',1.5,['TANGENT AT x = 3']],
 [{preset:'GCSE-TRAPEZIA-2',a:1,b:3},'Estimate the area under the curve from 1 to 3 using the two trapezia.',4.25,['2 strips'],undefined,9],
 [{preset:'GCSE-TRAPEZIA-8'},'Estimate the area under the curve from 0 to 4 using the eight trapezia.',9.375,['8 strips'],undefined,9],
 [{preset:'GCSE-CONCAVE'},'Does the trapezium rule overestimate or underestimate this area? Answer over or under.','under',['4 strips'],'text',12],
 [{preset:'GCSE-QUADRATIC',x:2.5},'Use the tangent. What is the gradient of the curve at x = 2.5?',1.25,['TANGENT AT x = 2.5']],
 [{preset:'GCSE-QUADRATIC',x:1.5},'Estimate the area under the curve from 0 to 4 using the four trapezia.',9.5,['4 strips'],undefined,9]],
'F10-02':[
 [{preset:'Y7-052'},'Translate B three right and two down. Write the coordinates of B′ as x, y.','2, 0',['B']],
 [{preset:'Y7-052',dx:2,dy:3},'Translate C two right and three up. Write the coordinates of C′ as x, y.','3, 4',['C']],
 [{preset:'Y8-053'},'Reflect C in the y-axis. Write the coordinates of C′ as x, y.','-1, 1',['C']],
 [{preset:'Y7-053'},'Rotate B 90° anticlockwise about the origin. Write B′ as x, y.','-2, -1',['B']],
 [{preset:'Y7-052',dx:-3,dy:1},'Translate B three left and one up. Write B′ as x, y.','-4, 3',['B']],
 [{preset:'Y8-053',vertices:[pt('A',-4,1),pt('B',2,3),pt('C',-1,1)]},'Reflect B in the y-axis. Write B′ as x, y.','-2, 3',['B']]]};
const TYPE={'F10-02':'coordinates','F10-08':'coordinates'};
function payload(id,j){const [state,prompt,privateAnswer,expected,qt,ph]=Q[id][j];const type=qt||TYPE[id]||(typeof privateAnswer==='number'?'numeric':'text');
 return {nativeIndex:0,data:{lesson:{state,phase:ph??5}},id:'C1.Q'+(j+1),source:'SRC',prompt,privateAnswer,answerType:type,...(type==='choice'?{choices:['A','B','C']}:{}),hint:'Use the grid one step at a time.',wrongFeedback:'Check each step again.',correctFeedback:'Correct.',expected};}
/* Per-engine impossible states: each must be rejected by the engine's own geometry rule (not just the generic |n| ≤ 500 limit). */
const BAD={'F10-01':{points:[{id:'A',x:1,y:1},{id:'A',x:2,y:2}]},'F10-02':{preset:'Y7-052',dx:4},'F10-03':{preset:'Y8-045',a:{x:6,y:0},b:{x:1,y:1}},'F10-04':{preset:'Y8-022',ys:[1,2,3,4]},
 'F10-05':{preset:'Y7-060',c:2},'F10-06':{preset:'Y8-022',A:[1,0],B:[1,4]},'F10-07':{preset:'Y8-025',m:5},'F10-08':{preset:'Y8-029',A:[0,1]},'F10-09':{preset:'Y8-026',points:[[0,0],[4,2],[2,3]]},
 'F10-10':{preset:'Y8-026',pts:[[1,0],[2,5]]},'F10-11':{preset:'Y8-027',pts:[[0,0],[3,2],[3,4]]},'F10-12':{preset:'Y8-030',h:5},'F10-13':{preset:'Y8-037',k:'x'},'F10-14':{preset:'Y9-011',a:0},
 'F10-15':{preset:'Y8-017',point:[7,0]},'F10-16':{preset:'Y9-040',radius:5.5},'F10-17':{preset:'Y8-023',matched:{c1:7}},'F10-18':{preset:'Y9-015',readX:9},'F10-19':{preset:'GCSE-SINE',angle:400},'F10-20':{preset:'GCSE-QUADRATIC',a:4,b:3}};
module.exports={payload,Q,TYPE,BAD};
