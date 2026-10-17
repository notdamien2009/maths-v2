from pathlib import Path
import json,copy,statistics
r=Path('.');a=r/'audit/f16-f18-production-2026-10-17';baseline=json.loads((a/'current-browser.json').read_text(encoding='utf8'));cases={}
for row in baseline:
 if not row['id'].startswith('F16-'):continue
 cid=row['id'];k=int(cid[-2:]);desc=row['descriptor'];prekey=desc['config']['preset'];preset=desc['config']['presets'][prekey];fn=next(iter(desc['draws']));arg=desc['draws'][fn][-1];qs=[]
 for j in range(6):
  q=copy.deepcopy(preset);opt={'phase':9,'animate':False,'pose':'think','speech':'Use the given data to calculate the requested quantity.','say':'Use the given data to calculate the requested quantity.','interactive':False,'challenge':True};config=None;expected=[]
  if k==1:
   v=[2+j,3+j,4+j,5+j];q.update(title='Four category frequencies',cats=['A','B','C','D'],base=v,key=2);opt.update(pre=q,values=v,st={'placed':[None]*4,'sel':None,'feedback':'','guided':False},phase=5);answer=sum(v);prompt='Find the total frequency of categories A, B, C and D.';expected=[str(v[0]),str(v[-1])]
  elif k==2:
   v=[2+j,4+j,6+j,8+j];q.update(name='Four category counts',cats=['A','B','C','D'],values=v,max=20,minor=1);opt.update(data=q,state={'v':v,'baseline':0,'message':'','selected':0},phase=5);answer=sum(v);prompt='Find the total count in the four bars.';expected=[str(v[0]),str(v[-1])]
  elif k==3:
   v=[2+j,5+j,9+j,12+j,8+j,4+j];q.update(title='Six measured readings',values=v,max=20,crop=0,step=2,trend='Compare all six measurements.');opt.update(data=q,state={'values':v,'baseline':0,'selected':2},phase=8);answer=round(sum(v)/6,1);prompt='Find the mean of the six readings, to one decimal place.';expected=[str(v[0]),str(v[-1])]
  elif k==4:
   v=[2+j,8-j,6,4];q.update(title='Twenty survey responses',names=['A','B','C','D'],short=['A','B','C','D'],counts=v,context='Twenty responses, each counted once.');opt.update(data=q,state={'counts':v,'selected':0},phase=6,active=0);answer=v[0]*18;prompt='Find the angle of the sector for category A, in degrees.';expected=[str(v[0]),'20']
  elif k==5:
   v=[11+j,14+j,17+j,21+j,25+j,31+j,36+j,42+j];q.update(title='Eight ordered observations',context='Eight observations, including repeated values where present.',A=v,chips={'A':[]},two=False);opt.update(data=q,state={'placed':{},'selected':'A'},phase=5);answer=statistics.median(v);prompt='Read the stem-and-leaf and find the median of the eight observations.';expected=['Key']
  elif k==6:
   v=[1,2,3,4,5,6,2+j,10];q.update(title='Eight measured scores',context='Each dot is one observation.',A=v);q.pop('B',None);opt.update(data=q,state={'A':v},phase=4);answer=round(sum(v)/len(v),3);prompt='Find the mean score to three decimal places.';expected=['10']
  elif k==7:
   v=[1,2,4,6,7+j];q.update(title='Five stacks, one total',context='Compute the fair-share mean from all five stacks.',scores=v);opt.update(state={'heights':v},phase=4);answer=sum(v)/5;prompt='What is the fair-share mean of the five stacks?';config=q;expected=[str(v[-1])]
  elif k==8:
   v=[2,3,5,6,8+j];q.update(title='Spread of five scores',context='Compare the minimum and maximum.',a=v,scale=[0,16]);q.pop('b',None);opt.update(state={'a':v,'b':None,'pins':{'a':[min(v),max(v)],'b':[min(v),max(v)]}},phase=5);answer=max(v)-min(v);prompt='Find the range of the displayed observations.';config=q;expected=[str(v[-1])]
  elif k==9:
   f=[1+j,3,4,2];q.update(title='Grouped journey times',context='Estimate the mean from class midpoints.',frequencies=f,raw=[5]*f[0]+[15]*f[1]+[25]*f[2]+[35]*f[3]);opt.update(state={'freq':f},phase=6);answer=round(sum(x*y for x,y in zip([5,15,25,35],f))/sum(f),2);prompt='Estimate the mean time from the grouped data, to two decimal places.';config=q;expected=['10','20']
  elif k==10:
   pairs=[[1,12+j],[2,22+j],[3,32+j],[4,42+j],[5,52+j],[6,62+j]];q.update(title='A linear association',context='Use the shown straight line for an estimate.',pairs=pairs,xMax=10,xTick=2,yMax=100,yTick=20,predictX=7,compareX=9,warning='This constructed dataset is exactly linear; real data may scatter.');opt.update(state={'pairs':pairs,'line':[2+j,102+j],'removed':0,'edited':True},phase=7);answer=72+j;prompt='Use the straight line to estimate the y value when x is 7.';config=q;expected=[str(12+j)]
  elif k==11:
   v=[[5+j,6,7],[8,9+j,10]];q.update(title='A two-way frequency table',context='Every observation belongs to one cell.',counts=v,question={'type':'joint','row':0,'col':0,'description':'first row and first column'});opt.update(state={'counts':v,'removed':0},phase=6);answer=sum(map(sum,v));prompt='Find the grand total of the two-way table.';config=q;expected=[str(v[0][0])]
  elif k==12:
   f=[2+j,8,6,10];q.update(title='Unequal-width histogram',context='Bar area is frequency; bar height is density.',frequencies=f);opt.update(state={'freq':f,'removed':0},phase=6);answer=round(f[0]/5,2);prompt='What is the frequency density of the first class, whose width is 5?';config=q;expected=['5']
  elif k==13:
   v=[2,3,4,5,6,7,8,9,10,11,12,14+j];q.update(title='Twelve ordered observations',desc='Use the median of the lower and upper halves.',sets=[v],scale=[0,25],grouped=False);opt.update(state={'grouped':False,'sets':[v],'which':0,'pins':None},phase=6);answer=max(v)-min(v);prompt='Find the range of the twelve original observations.';config=q;expected=[str(v[-1])]
  elif k==14:
   v=[52+j,56+j,59+j];q.update(title='Cropped axis comparison',desc='Compare the actual counts, not the exaggerated visual heights.',names=['A','B','C'],counts=v,expected=7,wrong=v[-1],fault='The axis is cropped.',repair='Starting the axis at zero does not change the counts.');opt.update(state={'repaired':False},phase=5);answer=sum(v);prompt='Ignore the cropped axis and find the total of the three source counts.';config=q;expected=[str(v[0]),str(v[-1])]
  elif k==15:
   selected=list(range(6+j));q.update(title='Inspect a selected sample');opt.update(selected=selected,method='manual',phase=4);answer=60-len(selected);prompt='How many of the sixty population members are not selected in this sample?';config=q;expected=['60']
  elif k==16:
   data=[(i+j)%4 for i in range(12)];q.update(title='Twelve survey responses',subtitle='Record each observation once.',data=data,totals=[data.count(i) for i in range(4)]);records=[i<j+1 for i in range(12)];opt.update(records=records,question=0,audience=0,phase=6);answer=12-sum(records);prompt='How many of the twelve response cards still need to be recorded?';config=q;expected=['12']
  rec={'id':'C1.Q'+str(j+1),'source':'SRC','nativeIndex':0,'data':{},'scene':{'function':fn,'arguments':{arg:opt}},'prompt':prompt,'privateAnswer':answer,'answerType':'numeric','hint':'Use the original data, scale and units shown in the model.','wrongFeedback':'Check the data and the requested quantity.','correctFeedback':'Correct.','expected':expected}
  if isinstance(answer,float) and not answer.is_integer():rec['tolerance']=0.000001
  if config:rec['config']={'preset':prekey,'presets':{prekey:config}}
  qs.append(rec)
 cases[cid]={'questions':qs,'nativeDomain':'See validated family contract and native schema.'}
(a/'lesson-cases.json').write_text(json.dumps(cases,indent=2,ensure_ascii=False),encoding='utf8');print('F16 cases created',len(cases)*6)
