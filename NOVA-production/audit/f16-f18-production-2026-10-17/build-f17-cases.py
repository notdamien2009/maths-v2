from pathlib import Path
import json,copy,math
r=Path('.');a=r/'audit/f16-f18-production-2026-10-17';baseline=json.loads((a/'current-browser.json').read_text(encoding='utf8'));cases=json.loads((a/'lesson-cases.json').read_text(encoding='utf8'))
for row in baseline:
 if not row['id'].startswith('F17-'):continue
 cid=row['id'];k=int(cid[-2:]);desc=row['descriptor'];prekey=desc['config']['preset'];preset=desc['config']['presets'][prekey];fn=next(iter(row['scenes']));sample=copy.deepcopy(row['scenes'][fn]['sample']);args=dict(zip(desc['draws'][fn][1:],sample[1:]));qs=[]
 for j in range(6):
  ar=copy.deepcopy(args);opkey=desc['draws'][fn][-1];o=ar[opkey];o.update(animate=False,flash=False,pose='think',say='Use the equally likely outcomes and the stated event.',hideAnswer=True,challenge=True,interact=False);cfg=None;expected=[]
  if k==1:
   p=ar['p'];p.update(good=j+1,total=10,context='Ten equally likely counters',minor=.1,unit=.1);o.update(showCount=10,showOutcomes=True,showMarker=False,showComplement=False,value=(j+1)/10);answer=(j+1)/10;prompt='Find the probability of choosing a favourable counter, as a decimal.';expected=['10']
  elif k==2:
   p=ar['p'];p.update(year=8,context='One fair six-sector spinner',primary={'n':6,'wins':list(range(j+1)),'name':'Spinner'},secondary=None);ar['m']={'primary':[i<j+1 for i in range(6)],'secondary':None,'history':[],'last':None,'spinning':False,'angle':0,'angleB':0};o.update(showOutcome=False,showAnimation=False);cfg={'preset':'y8'};answer=round((j+1)/6,3);prompt='Find the theoretical probability of a winning spin, to three decimal places.';expected=['6']
  elif k==3:
   key='y7experiment';p=copy.deepcopy(desc['config']['presets'][key]);ar['p']=p;h=[{'out':{'c':'H' if i<5+j else 'T'},'win':i<5+j} for i in range(20)];ar['m']={'kind':'coin','events':['HEADS',None],'history':h,'last':h[-1],'tumble':False,'selected':'HEADS'};answer=(5+j)/20;prompt='Twenty trials are shown. What is the experimental relative frequency of heads? Give a decimal.';cfg={'preset':key};expected=['20',str(5+j)]
  elif k==4:
   h=[{'out':'H' if i<8+j else 'T','win':i<8+j} for i in range(20)];ar['m'].update(history=h,prediction=None,last=h[-1],running=False);answer=(8+j)/20;prompt='Find the relative frequency of successes in the twenty recorded trials.';expected=['20']
  elif k==5:
   key='y8';p=copy.deepcopy(desc['config']['presets'][key]);p['cols']=[str(i+1) for i in range(j+1)];p['description']='A coin and a fair numbered spinner.';p['colTitle']='SPINNER';ar['p']=p;ar['m']={'marked':[],'last':None,'reveal':False,'focusKey':'0-0'};o.update(hideAnswer=True,revealCount=2*(j+1),showWin=False);answer=2*(j+1);prompt='How many ordered outcomes are in this coin-and-spinner sample space?';cfg={'preset':key};expected=['H','T']
  elif k==6:
   p=ar['p'];p.update(first=['H','T'],second=[str(i+1) for i in range(j+1)],names=['COIN','SPINNER'],event='Heads with an even number',kind='H × EVEN');ar['m']={'marked':[],'focus':'0-0','revealed':False};o.update(revealCount=2*(j+1),showWinning=False);answer=2*(j+1);prompt='How many ordered outcomes are in this systematic list?';expected=['H','T']
  elif k==7:
   p=ar['p'];p.update(first=['R','B'],second=['R','B'],a=[j+1,7-j],b=[2,3],event='Red, then red',kind='R THEN R',context='Two independent weighted spinners');ar['m']={'marked':[],'focus':'0-0','revealed':False};o.update(revealCount=4,showWeights=True,showPath=False,showFavourites=False);answer=(j+1)/8*2/5;prompt='Find P(red then red) for the two independent spinners, as a decimal.';expected=[str(j+1),'8']
  elif k==8:
   U=list(range(21,33));A=U[:6];B=U[j+3:j+8];p=ar['p'];p.update(universe=U,A=A,B=B,a='A',b='B',context='Twelve numbered outcomes in two sets',focus='union');ar['m']={'placed':[],'focus':'union','selected':21,'checked':False,'revealed':False};answer=len(set(A)|set(B));prompt='How many outcomes belong to A or B, including the overlap once?';expected=['21','32']
  elif k==9:
   p=ar['p'];p.update(a='A',na='Not A',b='B',nb='Not B',context='A frequency tree with four terminal groups',counts=[5+j,10,15,20],focus='union');ar['m']={'assign':[],'counts':p['counts'],'focus':'union','selected':0,'checked':False};o.update(step=5);answer=sum(p['counts']);prompt='Add the four leaf frequencies to find the whole population.';expected=[str(5+j),'20']
  elif k==10:
   p=ar['p'];p.update(a='A',b='B',context='Four disjoint Venn regions',counts=[5+j,7,9,11],focus='or');ar['m']={'op':'or','assigned':[],'selected':0,'checked':False,'reveal':False};o.update(model=True,hideCounts=False,reveal=False);answer=21+j;prompt='How many outcomes belong to A or B? Count the overlap once.';expected=[str(5+j),'11']
  elif k==11:
   red=1+j%5;blue=2+j//5;gold=1;placed=[['r'+str(i),i] for i in range(red)]+[['b'+str(i),red+i] for i in range(blue)]+[['g0',red+blue]];p=ar['p'];p.update(red=red,blue=blue,gold=gold,draws=1,replace=True,context='One draw with replacement');ar['m'].update(placed=placed,draws=1,replace=True,trials=0,successes=0,last='—',history=[],selected='r0',step=2,flash=False);o.update(step=2);answer=round(red/(red+blue+gold),4);prompt='Find the probability of drawing red, to four decimal places.';expected=[str(red+blue+gold)]
  elif k==12:
   ar['m'].update(a=[j+1,8],b=[2,5],planned=100,actual=0,success=0,atA=0,atB=0,predicted=None);o.update(step=2);answer=(j+1)/8*2/5*100;prompt='In 100 independent trials, how many successes of A and B should be expected?';expected=['100','8','5']
  elif k==13:
   ar['m'].update(win=[0,2],prize=j+2,stake=1,tries=0,success=0,earned=0,chosen=0,flash=False,last='—');answer=round((j+2)/3-1,3);prompt='Two of six faces win. With the shown gross prize and a £1 stake, find expected net gain in pounds to three decimal places.';expected=[str(j+2)]
  elif k==14:
   key=['arr3','comb4','arr4','comb5','arr3','comb4'][j];p=copy.deepcopy(desc['config']['presets'][key]);ar['p']=p;ar['m']={'placed':[None]*p['k'],'selected':j%len(p['items']),'checked':False,'flash':False};p['context']=p['context']+' Case '+str(j+1);answer=math.perm(len(p['items']),p['k']) if p['ordered'] else math.comb(len(p['items']),p['k']);prompt='How many different '+('ordered arrangements' if p['ordered'] else 'unordered selections')+' are possible without replacement?';cfg={'preset':key};expected=p['items'][:2]
  rec={'id':'C1.Q'+str(j+1),'source':'SRC','nativeIndex':0,'data':{},'scene':{'function':fn,'arguments':ar},'prompt':prompt,'privateAnswer':answer,'answerType':'numeric','hint':'Use the whole sample space and the event stated in the question.','wrongFeedback':'Check the favourable outcomes and the complete sample space.','correctFeedback':'Correct.','expected':expected}
  if cfg:rec['config']=cfg
  if isinstance(answer,float) and not answer.is_integer():rec['tolerance']=0.000001
  qs.append(rec)
 cases[cid]={'questions':qs}
(a/'lesson-cases.json').write_text(json.dumps(cases,indent=2,ensure_ascii=False),encoding='utf8');print('F17 cases created',84)
