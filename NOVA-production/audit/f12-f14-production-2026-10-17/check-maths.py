from pathlib import Path
import json,math
r=Path('audit/f12-f14-production-2026-10-17');cases=json.loads((r/'lesson-cases.json').read_text(encoding='utf8'));base={x['id']:x for x in json.loads((r/'baseline-browser.json').read_text(encoding='utf8'))};lib=json.loads((r/'shape-library.json').read_text(encoding='utf8'));out=[]
for id,bank in cases.items():
 for q in bank['questions']:
  a=q['scene']['arguments'];s=a.get('st',a.get('s',{}));f,n=map(int,id[1:].split('-'));ans=None
  if f==12:
   if n==1:ans=lib[a['o']['active']]['p']['sides']
   elif n==2:
    p=base[id]['descriptor']['config']['props'][s['a']];ans=sum(v['p'][p['key']]>=p['min'] and (p.get('max') is None or v['p'][p['key']]<=p['max']) for v in lib.values())
   elif n==3:ans=sum(math.dist(v,s['verts'][(i+1)%len(s['verts'])]) for i,v in enumerate(s['verts']))
   elif n==4:ans=sum([s['a'],s['b'],s['a'],s['b']])
   elif n==5:ans=sum(1 for x in range(s['cols']) for y in range(s['rows']))
   elif n==6:ans=s['b']*s['h']
   elif n==7:ans=abs(s['b']*(-s['h']))/2
   elif n==8:ans=s['a']*s['h']+(s['b']-s['a'])*s['h']/2
   elif n==9:ans=s['d1']/2*s['d2']
   elif n==10:ans=s['W']*s['t']+(s['H']-s['t'])*s['t']
   elif n==11:ans=s['r']+s['r']
   elif n==12:ans=round(math.pi*s['r']**2,2)
   elif n==13:ans=round(math.pi*s['r']**2/(360/s['a']),2)
   elif n==14:ans=sum([s['la'],s['wa'],s['la'],s['wa']])
   elif n==15:ans=s['val']*10**2
  else:
   if n in [1,2,3,4,5,6]:
    x,y=s['shape'][0]
    if n==1:ans=2*s['k']-x
    elif n==2:ans=round(x*math.cos(math.radians(s['angle']))-y*math.sin(math.radians(s['angle'])),8)
    elif n in [3,6]:ans=x+s['vector'][0]
    elif n==4:ans=s['origin'][0]+s['factor']*(x-s['origin'][0])
    elif n==5:ans=round(x*math.cos(math.radians(s['angle']))-y*math.sin(math.radians(s['angle']))+s['vector'][0],8)
   elif n==7:ans=len(base[id]['descriptor']['config']['presets'][s['key']]['axes'])
   elif n==8:
    p=base[id]['descriptor']['config']['presets'][s['key']];V=p['vertices'];c=p['centre'];matches=0
    for k in range(1,361):
     t=math.radians(k);rot=[(c[0]+(x-c[0])*math.cos(t)-(y-c[1])*math.sin(t),c[1]+(x-c[0])*math.sin(t)+(y-c[1])*math.cos(t)) for x,y in V]
     if all(any(math.dist(v,w)<1e-5 for w in V) for v in rot):matches+=1
    ans=matches
   elif n==9:p=q['config']['presets']['squares'];ans=sum(p['cols'] for _ in range(p['rows']))
   elif n==10:
    p=base[id]['descriptor']['config']['presets'][s['key']];V=p['base'];edges=sorted(math.dist(v,V[(i+1)%len(V)]) for i,v in enumerate(V));scaled=[v*p['scale'] for v in edges];ans=int(all(abs(v-w)<1e-6 for v,w in zip(edges,scaled)))
   elif n==11:ans=round((2*s['k'])*(3*s['k'])/6,2)
   elif n==12:ans=s['u'][0]+s['v'][0]
   elif n==13:ans=round(sum(s['step'] for _ in range(s['n']-1)),2)
  out.append({'component':id,'question':q['id'],'oracle':ans,'key':q['privateAnswer'],'pass':ans is not None and abs(ans-q['privateAnswer'])<1e-6})
(r/'independent-maths.json').write_text(json.dumps(out,indent=2),encoding='utf8');print(sum(x['pass'] for x in out),'/',len(out));print([x for x in out if not x['pass']])
