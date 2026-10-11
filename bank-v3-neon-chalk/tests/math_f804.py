#!/usr/bin/env python3
"""Checks the algebra and reverse order for all F8-04 preset variations, including negative inputs."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
OPS={'m5':lambda x:x*5,'s4':lambda x:x-4,'a4':lambda x:x+4,'d5':lambda x:x/5,'m2':lambda x:x*2,'a3':lambda x:x+3,'s3':lambda x:x-3,'d2':lambda x:x/2}
P=[('Y8-016',['m5','s4'],['a4','d5']),('Y8-016-b',['m2','a3'],['s3','d2']),('Y8-016-c',['a4','m5'],['d5','s4'])]
checks=[]
def record(name,okay):checks.append({'test':name,'passed':bool(okay)})
for name,fw,rev in P:
 for i in range(-100,101):
  x=i/2
  one=OPS[fw[0]](x);out=OPS[fw[1]](one);undo=OPS[rev[0]](out);ret=OPS[rev[1]](undo)
  record(f'{name}/x={x}/composition',abs(ret-x)<1e-10)
  record(f'{name}/x={x}/undo-order',abs(undo-one)<1e-10)
for name,fw,rev in P:
 record(f'{name}/wrong-order-detected',any(abs(OPS[rev[0]](OPS[rev[1]](OPS[fw[1]](OPS[fw[0]](x))))-x)>1e-9 for x in range(-6,7)))
summary={'total':len(checks),'passed':sum(k['passed'] for k in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(R/'tests/F8-04-math-results.json').write_text(json.dumps(summary,indent=2))
print('MATH',summary['passed'],'/',summary['total'])
assert not summary['failed']
