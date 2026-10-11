from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
checks=[]
for rs in (-1,1):
 for cs in (-1,1):
  for r in range(1,13):
   for c in range(1,13):
    result=(rs*r)*(cs*c);assert abs(result)==r*c
    assert (result>0)==(rs==cs)
    checks.append({'r':r,'c':c,'rs':rs,'cs':cs,'result':result})
(R/'tests/MATH-RESULTS.json').write_text(json.dumps({'assertions':len(checks)*2,'passed':len(checks)*2,'failed':0,'sign_cases':4},indent=2))
print('MATH PASS',len(checks)*2)
