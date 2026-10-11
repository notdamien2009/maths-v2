"""Check mathematical invariants for every named KS3 F8-01 lesson preset.
No external data/network required. SymPy is needed for author-side test only.
"""
from sympy import symbols, simplify, Eq, solveset, S
from pathlib import Path
import json
x=symbols('x')
check=[]
def claim(name,correct,detail=''):
 check.append({'check':name,'pass':bool(correct),'detail':str(detail)})
# Order of operations: parentheses before multiplication before subtraction
claim('Y7-018 parentheses',18-3*(2+4)==18-3*6)
claim('Y7-018 multiply',18-3*6==18-18)
claim('Y7-018 finish',18-18==0)
# Four cross-products and like-term collection
line0=(x+3)*(x+2);line1=x*x+2*x+3*x+6;line2=x*x+(2+3)*x+6;line3=x*x+5*x+6
for i,(a,b) in enumerate([(line0,line1),(line1,line2),(line2,line3)]):claim('Y8-011 transformation '+str(i+1),simplify(a-b)==0)
# Factorisation has the exact original identity for every x
f0=12*x+18;f1=6*2*x+6*3;f2=6*(2*x+3)
for i,(a,b) in enumerate([(f0,f1),(f1,f2),(f2,f0)]):claim('Y8-012 transformation '+str(i+1),simplify(a-b)==0)
# Equations are equivalent *solution sets*, not equivalent numerical expressions for arbitrary x
s0=solveset(Eq(x/3+2,7),x,domain=S.Reals)
s1=solveset(Eq(x/3,5),x,domain=S.Reals)
s2=solveset(Eq(x,15),x,domain=S.Reals)
claim('Y8-015 subtract preserves solution set',s0==s1)
claim('Y8-015 multiply preserves solution set',s1==s2)
claim('Y8-015 original-equation substitution',15/3+2==7)
# Variant sampling across positive/negative/zero integer values
for k in range(-50,51):
 claim('Y8-011 evaluate x='+str(k),simplify(line0.subs(x,k)-line3.subs(x,k))==0)
 claim('Y8-012 evaluate x='+str(k),simplify(f0.subs(x,k)-f2.subs(x,k))==0)
out=Path(__file__).resolve().parent/'math-results.json'
out.write_text(json.dumps(check,indent=2))
print(f'{sum(c["pass"] for c in check)}/{len(check)} PASS')
if not all(c['pass'] for c in check):raise SystemExit(1)
