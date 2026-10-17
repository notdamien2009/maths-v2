from pathlib import Path
import json,copy,math
r=Path('.');a=r/'audit/f12-f14-production-2026-10-17';base={x['id']:x for x in json.loads((a/'baseline-browser.json').read_text(encoding='utf8'))};lib=json.loads((a/'shape-library.json').read_text(encoding='utf8'));out={}
for id,B in base.items():
 qs=[];fam,n=map(int,id[1:].split('-'));name=next((x for x in ['createScene','scene','buildStage','build','plot','paint','board','draw'] if x in B['scenes'] and (x!='plot' or fam==14)),None);sn=B['scenes'][name];d=B['descriptor']
 for j in range(6):
  args={k:copy.deepcopy(v) for k,v in zip(sn['parameters'][1:],sn['sample'][1:])};st=args.get('st',args.get('s',{}));opt=args.get('o',args.get('opt',{}));cfg={};expected=[];ans=None;prompt=''
  if fam==12:
   if n==1:
    k=['trapezium','kite','parallelogram','rectangle','rhombus','square'][j];opt={'pk':'quads','active':k};args={'pk':'quads','o':opt};prompt=f'How many sides does the highlighted {lib[k]["name"]} have?';ans=len(lib[k]['pts']);expected=[{'trapezium':'Trapezium'}.get(k,lib[k]['name'].split()[0])]
   elif n==2:
    prop=['ra','eq','par2','par1','tri','quad'][j];st={'kind':'one','a':prop};args={'st':st,'hl':None};p=d['config']['props'][prop];ans=sum(v['p'][p['key']]>=p['min'] and (p.get('max') is None or v['p'][p['key']]<=p['max']) for v in lib.values());prompt='How many of the shape cards qualify for: '+p['label']+'?';expected=['YES']
   elif n==3:
    w=2+j%3;h=2+j//3;st.update(verts=[[1,1],[1+w,1],[1+w,1+h],[1,1+h]],closed=True);opt.update(edges=True);ans=2*(w+h);prompt=f'Find the perimeter of this {w} by {h} peg-grid rectangle, in unit lengths.';expected=['A']
   elif n==4:
    st.update(kind='rect',a=3+j,b=2);opt.update(t=0,hide=False);ans=2*(st['a']+st['b']);prompt='Find the perimeter of the rectangle in centimetres.';expected=[str(st['a'])]
   elif n==5:
    st.update(kind='rect',cols=3+j,rows=2);args['show']={'whole':True,'num':False};ans=st['cols']*st['rows'];prompt=f'Count the unit squares in the {st["cols"]} by 2 rectangle. What is its area?';expected=['whole']
   elif n==6:
    st.update(b=3+j,h=2,s=1,k=0,t=0);opt.update(rect=False);ans=st['b']*st['h'];prompt='Find the parallelogram area from its base and perpendicular height, in square centimetres.';expected=[str(st['b'])]
   elif n==7:
    st.update(b=3+j,h=2,p=1,th=0);ans=st['b']*st['h']/2;prompt='Find the triangle area from the labelled base and perpendicular height, in square centimetres.';expected=[str(st['b'])]
   elif n==8:
    st.update(a=2+j,b=8,h=2,x0=1,th=0);ans=(st['a']+st['b'])*st['h']/2;prompt='Find the area of the trapezium in square centimetres.';expected=[str(st['a']),'8']
   elif n==9:
    st.update(d1=4+j,d2=4,p=.5);opt.update(view='diag');ans=st['d1']*st['d2']/2;prompt='Find the rhombus area from its two perpendicular diagonals, in square centimetres.';expected=[str(st['d1'])]
   elif n==10:
    st.update(kind='L',W=5+j%3,H=4+j//3,t=1);args['view']='perim';ans=st['W']*st['H']-(st['W']-1)*(st['H']-1);prompt='Find the area of the L-shape in square centimetres. Each arm has thickness 1 cm.';expected=[str(st['W'])]
   elif n==11:
    st.update(view='vocab',r=2+j);ans=2*st['r'];prompt=f'The circle radius is {st["r"]} cm. Find its diameter in centimetres.';expected=[str(st['r'])]
   elif n==12:
    st.update(r=2+j,n=8,m=0);opt.update(rad={'txt':f'r = {st["r"]} cm'});ans=round(math.pi*st['r']**2,2);prompt='Find the area of the circle in square centimetres, to two decimal places.';expected=[str(st['r'])]
   elif n==13:
    st.update(r=6,a=30+30*j);ans=round(st['a']/360*math.pi*st['r']**2,2);prompt='Find the sector area in square centimetres, to two decimal places.';expected=[str(st['a'])]
   elif n==14:
    st.update(mode='compare',la=3+j,wa=2,lb=5,wb=3);ans=2*(st['la']+st['wa']);prompt='Find the perimeter of rectangle A, in metres.';expected=[str(st['la'])]
   elif n==15:
    st.update(pair=0,view='grid',dir='down',val=2+j);ans=st['val']*100;prompt=f'Convert {st["val"]} square centimetres into square millimetres.';expected=['100']
  else:
   opt.update(showImage=True,showMirror=True,guide=True,readout=False,readouts=False,showDesc=False,showResult=False,showOrder=False,showCount=False,animate=False,animation=False,say='Use the given coordinates and transformation.',pose='think')
   if n in [1,2,3,4,5,6]:
    x=-3+j%3;y=1+j//3;st['shape']=[[x,y],[x+1,y],[x,y+1]];expected=['A']
    if n==1:st.update(kind='vertical',k=0,imgOff=[0,0]);ans=-x;prompt=f'Reflect A({x}, {y}) in x = 0. Give the x-coordinate of A-prime.'
    elif n==2:st.update(centre=[0,0],angle=90,imgOff=[0,0]);ans=-y;prompt=f'Rotate A({x}, {y}) 90 degrees anticlockwise about (0, 0). Give its new x-coordinate.'
    elif n==3:st.update(vector=[1+j%3,1],imgOff=[0,0]);ans=x+st['vector'][0];prompt=f'Translate A({x}, {y}) by ({st["vector"][0]}, 1). Give its new x-coordinate.'
    elif n==4:
     st.update(shape=[[-1,-1],[0,-1],[-1,0]],origin=[0,0],factor=.5+j*.5,imgOff=[0,0]);ans=-st['factor'];prompt=f'Enlarge A(-1, -1) about (0, 0) by scale factor {st["factor"]}. Give its new x-coordinate.'
    elif n==5:
     st.update(ops=['rotate','translate'],angle=-90,centre=[0,0],vector=[j%3,1],midOff=[0,0],finalOff=[0,0]);opt.update(showMid=True,showFinal=True);ans=y+st['vector'][0];prompt=f'Rotate A({x}, {y}) 90 degrees clockwise about (0, 0), then translate by ({st["vector"][0]}, 1). Give its final x-coordinate.'
    elif n==6:st.update(kind='translate',vector=[1+j%3,1],offset=[0,0]);opt['image']=True;ans=x+st['vector'][0];prompt=f'The transformation is translation by ({st["vector"][0]}, 1). What is the x-coordinate of the image of A({x}, {y})?'
   elif n==7:
    key=['kite','rectangle','square','triangle','hexagon','asym'][j];st.update(key=key,angle=90,showAxes=False);opt.update(half=False,reveal=True,evidence=False);ans=len(d['config']['presets'][key]['axes']);prompt=f'How many lines of symmetry does the displayed {d["config"]["presets"][key]["name"]} have?';expected=[d['config']['presets'][key]['name']]
   elif n==8:
    key=['square','rectangle','triangle','pentagon','hexagon','parallelogram'][j];st.update(key=key,pivot=[0,0],angle=15*j);ans=d['config']['presets'][key]['order'];prompt=f'What is the rotational symmetry order of the displayed {d["config"]["presets"][key]["name"]}?';expected=['match']
   elif n==9:
    cfg={'presets':{'squares':{'cols':2+j%3,'rows':2+j//3}}};st.update(key='squares',placed=['0'],target=1);opt['readout']=False;ans=(2+j%3)*(2+j//3);prompt=f'A square mosaic needs {2+j%3} columns and {2+j//3} rows. How many tiles are needed in total?';expected=['tile']
   elif n==10:
    key=['y7_construction','y7_intro','y8_bisector','y8_enlargement','y8_similarity','y9_ssa'][j]
    if key not in d['config']['presets']:key=list(d['config']['presets'])[j]
    st.update(key=key,turn=0,flip=False);ans=1 if d['config']['presets'][key]['congruent'] else 0;prompt='Are these triangles congruent? Enter 1 for yes or 0 for no.';expected=['triangle']
   elif n==11:
    st.update(key='y7_enlarge',k=.5+j*.5);opt['ratios']=False;ans=round(st['k']**2,2);prompt=f'The length scale factor is {st["k"]}. What is the area scale factor?';expected=['ORIGINAL']
   elif n==12:
    st.update(start=[-4,-2],u=[1+j%3,1],v=[1,1+j//3],op='add',displace=[0,0]);opt.update(showSecond=True,showResult=False,columns=True);ans=st['u'][0]+st['v'][0];prompt=f'Add vectors ({st["u"][0]}, 1) and (1, {st["v"][1]}). Give the horizontal component of the resultant.';expected=['u']
   elif n==13:
    st.update(key='frieze',n=[2,3,4,5,3,4][j],step=round(1.8+.1*j,1),filled=False);opt.update(amount=st['n'],rows=False);ans=(st['n']-1)*st['step'];ans=round(ans,2);prompt=f'The frieze has {st["n"]} copies separated by translation step {st["step"]}. What is the displacement from the first to last copy?';expected=['motif']
  if 'st' in args:args['st']=st
  if 's' in args:args['s']=st
  if 'o' in args:args['o']=opt
  if 'opt' in args:args['opt']=opt
  data={}
  if fam==12:
   data['st']=copy.deepcopy(args.get('st',args.get('o',{})))
   for key in ['o','show','view']:
    if key in args and key in d['steps'][0]:data[key]=copy.deepcopy(args[key])
  qs.append({'id':f'C1.Q{j+1}','source':'SRC','nativeIndex':0,'data':data,'scene':{'function':name,'arguments':args},**({'config':cfg} if cfg else {}),'prompt':prompt,'privateAnswer':ans,'answerType':'numeric','hint':'Use the given measurements, vertices or transformation rule.','wrongFeedback':'Check the givens and the requested quantity.','expected':expected})
 out[id]={'questions':qs}
(a/'lesson-cases.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8');print(len(out),'banks,',sum(len(x['questions']) for x in out.values()),'question records')

