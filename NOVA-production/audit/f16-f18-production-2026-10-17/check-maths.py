import json,statistics,math
from pathlib import Path
from decimal import Decimal,ROUND_HALF_UP
p=Path('audit/f16-f18-production-2026-10-17');cases=json.loads((p/'lesson-cases.json').read_text(encoding='utf8'));out=[]
for id,bank in cases.items():
 for q in bank['questions']:
  a=q['scene']['arguments'];o=a.get('o',a.get('opt',a.get('options',a.get('opts',{}))));s=o.get('state',o.get('st',a.get('s',{})));m=a.get('m',{});cfg=q.get('config',{});pre=a.get('p',o.get('data',o.get('pre',s.get('p',cfg.get('presets',{}).get(cfg.get('preset'),{})))));f,n=map(int,id[1:].split('-'));ans=None
  if f==16:
   if n==1:ans=sum(o['values'])
   elif n==2:ans=sum(s['v'])
   elif n==3:ans=round(statistics.mean(s['values']),1)
   elif n==4:ans=360*s['counts'][0]/sum(s['counts'])
   elif n==5:ans=statistics.median(pre['A'])
   elif n==6:ans=round(statistics.mean(s['A']),3)
   elif n==7:ans=statistics.mean(s['heights'])
   elif n==8:ans=max(s['a'])-min(s['a'])
   elif n==9:
    bounds=pre['bounds'];mid=[(a+b)/2 for a,b in zip(bounds,bounds[1:])];ans=round(sum(x*y for x,y in zip(mid,s['freq']))/sum(s['freq']),2)
   elif n==10:ans=s['line'][0]+(s['line'][1]-s['line'][0])*7/10
   elif n==11:ans=sum(map(sum,s['counts']))
   elif n==12:ans=s['freq'][0]/(pre['bounds'][1]-pre['bounds'][0])
   elif n==13:ans=max(s['sets'][0])-min(s['sets'][0])
   elif n==14:ans=sum(pre['counts'])
   elif n==15:ans=60-len(o['selected'])
   elif n==16:ans=12-sum(o['records'])
  elif f==17:
   if n==1:ans=pre['good']/pre['total']
   elif n==2:ans=round(sum(m['primary'])/len(m['primary']),3)
   elif n in [3,4]:ans=sum(x['win'] for x in m['history'])/len(m['history'])
   elif n==5:ans=len(pre['rows'])*len(pre['cols'])
   elif n==6:ans=len(pre['first'])*len(pre['second'])
   elif n==7:ans=pre['a'][0]/sum(pre['a'])*pre['b'][0]/sum(pre['b'])
   elif n==8:ans=len(set(pre['A'])|set(pre['B']))
   elif n==9:ans=sum(m['counts'])
   elif n==10:ans=sum(pre['counts'][:3])
   elif n==11:ans=round(pre['red']/(pre['red']+pre['blue']+pre['gold']),4)
   elif n==12:ans=m['planned']*m['a'][0]/m['a'][1]*m['b'][0]/m['b'][1]
   elif n==13:ans=round(len(m['win'])/6*m['prize']-m['stake'],3)
   elif n==14:ans=math.perm(len(pre['items']),pre['k']) if pre['ordered'] else math.comb(len(pre['items']),pre['k'])
  elif f==18:
   if n==1:ans=s['length']*pre['ratio']
   elif n==2:ans=s['amount']*100
   elif n==3:
    angle=abs((s['h']%12)*30+s['m']/2-s['m']*6);ans=min(angle,360-angle)
   elif n==4:ans=pre['trips'][0][-1]-pre['trips'][0][0]
   elif n==5:ans=pre['paid']-pre['cost']
   elif n==6:ans=pre['gross']-sum(x[1] for x in pre['deds']+pre['costs'])
   elif n==7:
    balance=Decimal(pre['p'])/100
    for year in range(pre['years']):balance=(balance*(1+Decimal(pre['bp'])/10000)).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
    ans=float(balance)
   elif n==8:ans=pre['values'][0]/pre['values'][2]
   elif n==10:ans=math.prod(pre['round'])
   elif n==11:ans=pre['v']+pre['step']/2
   elif n==12:ans=pre['from']*100
  out.append({'component':id,'question':q['id'],'expectedByIndependentCalculation':ans,'lessonKey':q['privateAnswer'],'pass':ans is not None and abs(ans-q['privateAnswer'])<1e-6})
(p/'independent-maths.json').write_text(json.dumps(out,indent=2),encoding='utf8');print(sum(x['pass'] for x in out),'/',len(out));print([x for x in out if not x['pass']])
