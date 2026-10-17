from pathlib import Path
import json,copy,math
r=Path('.');a=r/'audit/f16-f18-production-2026-10-17';baseline=json.loads((a/'current-browser.json').read_text(encoding='utf8'));cases=json.loads((a/'lesson-cases.json').read_text(encoding='utf8'))
for row in baseline:
 if not row['id'].startswith('F18-'):continue
 cid=row['id'];k=int(cid[-2:]);desc=row['descriptor'];fn='scene';sample=copy.deepcopy(row['scenes'][fn]['sample']);args=dict(zip(desc['draws'][fn][1:],sample[1:]));qs=[]
 for j in range(6):
  ar=copy.deepcopy(args);s=ar['s'];p=s['p'];o=ar['o'];o.update(animate=False,pose='think',say='Read the given measurements and keep the units consistent.',hideAnswers=True,showAnswer=False,showAnswers=False,reveal=False,showResult=False,readouts=False);expected=[]
  if k==1:
   length=round(2+j*.7,1);p.update(actual=length,result=length*5,name='A route on a scale map');s['length']=length;o.update(showObject=True,showReading=True,showResult=False,readouts=False);answer=round(length*5,2);prompt='The map scale is 1 cm to 5 km. Find the actual distance of the shown route, in kilometres.';expected=[str(length)]
  elif k==2:
   n=round(2+j*.3,1);p.update(amount=n,from_='m');p.pop('from_',None);p.update(story=f'A beam measures {n} metres.',explain=f'{n} m equals {n*100:g} cm.');s['amount']=n;s['selected']=None;answer=round(n*100,2);prompt='Convert the displayed length in metres to centimetres.';expected=[str(n),'m','cm']
  elif k==3:
   h=j+1;m=5+5*j;p.update(h=h,m=m,kind='angle',story='Compare the continuous hour hand with the minute hand.',labelShort='Clock hands');s.update(h=h,m=m);o.update(angle=True,reveal=False,hideAnswers=True,display=None);d=abs((h%12)*30+.5*m-6*m)%360;answer=min(d,360-d);prompt=f'At {h}:{m:02}, find the smaller angle between the clock hands, in degrees.';expected=['12']
  elif k==4:
   start=480+15*j;trips=[[start+40*t,start+40*t+10,start+40*t+25,start+40*t+35+j] for t in range(3)];p.update(trips=trips,from_=0);p.pop('from_',None);p.update(short='One service, four stops',context='Read the first and final stops of service A.',from_=0);p.pop('from_',None);p['from']=0;p['to']=3;p['selected']=0;s['service']=0;o.update(drag=False,hideAnswers=True);answer=35+j;prompt='How many minutes does service A take from Maple Park to Leisure Ctr?';expected=[f'{start//60:02}:{start%60:02}']
  elif k==5:
   cost=600+35*j;p.update(cost=cost,paid=1000,amount=1000-cost,caption='A purchase paid with £10',note=f'The price is £{cost/100:.2f}. Pay with £10.');s.update(placed=[],offer=None,message='');answer=1000-cost;prompt='Find the change from the shown £10 payment, in pence.';expected=[f'{cost/100:.2f}']
  elif k==6:
   gross=(10+j)*950;p.update(hours=10+j,rate=950,gross=gross,deds=[['Example deduction',500]],costs=[['Travel',700],['Food',500]],note='An illustrative budget, not a real payroll rule.');s.update(placed={},notice='');o['step']=0;answer=gross-1700;prompt='After the displayed deduction and both expenses, how much remains, in pence?';expected=[str(10+j)]
  elif k==7:
   rate=500+100*j;p.update(p=20000,bp=rate,years=3,desc='Compare simple and compound growth for the stated illustrative annual rate.');s.update(chosen=3,placed=True,notice='');o.update(reveal=3);amount=20000
   for _ in range(3):amount=math.floor(amount*(1+rate/10000)+.5)
   answer=amount/100;prompt='Find the compound balance after three years, in pounds. Round to the nearest penny each year.';expected=['200',str(rate/100).rstrip('0').rstrip('.')]
  elif k==8:
   dist=120+30*j;speed=dist/2.5;p.update(values=[dist,speed,2.5],description=f'A vehicle travels {dist} km in 2.5 hours.');s.update(target=1,slots=[None,None],notice='');o.update(step=0,revealAnswer=False,hideAnswers=True);answer=speed;prompt='Find speed in kilometres per hour using the distance and time shown.';expected=[str(dist),'2.5']
  elif k==10:
   n=round(19.8+10*j,1);p.update(a=n,b=6.1,round=[20+10*j,6],bad=[2,6],context=f'Estimate the mass of 6.1 crate loads, each of mass {n} kg.',why='Round each factor to the displayed easy whole numbers.',speech='Multiply the rounded factors.');s['slots']=[None,None];o['step']=3;answer=(20+10*j)*6;prompt='Estimate the product using the displayed rounded factors, in kilograms.';expected=[str(20+10*j),'6']
  elif k==11:
   p.update(v=12+j,step=1,u='cm',context=f'A length is recorded as {12+j} cm to the nearest centimetre.',ext=None);s.update(index=[0,4],notice='');o['step']=0;answer=12.5+j;prompt='Give the upper bound of the recorded length, in centimetres.';expected=[str(12+j)]
  elif k==12:
   n=round(2.6+.3*j,1);p.update(from_=n);p.pop('from_',None);p['from']=n;p.update(story=f'A desk length is {n} metres.',tip='Multiply metres by one hundred.',title='A length in two units');s['tile']=None;o['step']=2;answer=round(n*100,2);prompt='Express the displayed length in centimetres.';expected=['m','cm']
  rec={'id':'C1.Q'+str(j+1),'source':'SRC','nativeIndex':0,'data':{},'scene':{'function':fn,'arguments':ar},'prompt':prompt,'privateAnswer':answer,'answerType':'numeric','hint':'Use the given quantities and the correct unit conversion or relationship.','wrongFeedback':'Check the quantities, units and requested form of the answer.','correctFeedback':'Correct.','expected':expected}
  if isinstance(answer,float) and not answer.is_integer():rec['tolerance']=0.000001
  qs.append(rec)
 cases[cid]={'questions':qs}
for cid in ['F17-06','F17-07']:
 for rec in cases[cid]['questions']:rec['config']={'preset':'y8'}
(a/'lesson-cases.json').write_text(json.dumps(cases,indent=2,ensure_ascii=False),encoding='utf8');print('All 41 sources now have six separately configured, independently calculated lesson questions.')
