"""Generate work/integration/qa/test-f15-production.cjs from the F13 production test.
Changes vs F13: F13->F15, F15 payload inlined, numeric-equivalence answer-leak check (stricter), and the resize
panel-text comparison ignores whitespace only (choice buttons wrap differently at 390 px; the words must be identical),
and two new 390 px checks (allowing up to 3 s for the debounced layout repaint): the Challenge game's drawing is repainted in the phone layout and no second drawing is left behind."""
import os,sys
H=os.path.dirname(os.path.abspath(__file__))
# Base: the F13 production test (env NOVA_F13_TEST, default: the merged F13 copy next to this tree).
BASE=os.environ.get('NOVA_F13_TEST',os.path.join(H,'..','..','integration','qa','test-f13-production.cjs'))
# Output: env NOVA_F15_TEST_OUT, default ../work/integration/qa/test-f15-production.cjs (work tree) 
OUT=os.environ.get('NOVA_F15_TEST_OUT',os.path.join(H,'..','work','integration','qa','test-f15-production.cjs'))
s=open(BASE).read()
E='if(tolerance)r.tolerance=tolerance;return r;}'
a=s.index('function payload(id,j){');b=s.index(E,a)+len(E)
p=open(os.path.join(H,'f15payload.js')).read()
s=s[:a]+p[p.index('function payload(id,j){'):p.index(E)+len(E)]+s[b:]
s=s.replace('F13','F15').replace('f13','f15')
old="answerInText:ansTokens.includes(String(r.privateAnswer)),"
assert s.count(old)==1
new="answerInText:(()=>{const av=Number(r.privateAnswer),dA=r.tolerance?Math.max(0,Math.round(-Math.log10(2*r.tolerance))):(String(r.privateAnswer).split('.')[1]||'').length,gv=(r.prompt.match(/-?\\d+(?:\\.\\d+)?/g)||[]).map(Number);return (stage.innerText.replace(/\\u2212/g,'-').match(/(?:^|[^\\w.\\d])-?\\d+(?:\\.\\d+)?/g)||[]).map(t=>t.replace(/^[^\\d-]/,'')).some(t=>{const v=Number(t),d=(t.split('.')[1]||'').length;if(gv.some(g=>Math.abs(g-v)<1e-9))return false;if(d>dA)return Math.abs(v-av)<1e-9||(dA>0||!!r.tolerance)&&Math.abs(v-av)<=0.5*Math.pow(10,-dA)+1e-9;if(d===0)return v===av;return Math.abs(v-av)<=0.5*Math.pow(10,-d)+1e-9;});})(),"
s=s.replace(old,new)
old2="panel text, inputs and progress kept across the resize`,after.panel===before.panel&&"
assert s.count(old2)==1
s=s.replace(old2,"panel text, inputs and progress kept across the resize`,after.panel.replace(/\\s+/g,'')===before.panel.replace(/\\s+/g,'')&&")
old3="await frame.locator('.f012-game-host').screenshot("
assert s.count(old3)==1
s=s.replace(old3,"if(width===390){await frame.waitForFunction(()=>{const h=document.querySelector('.f012-game-host .f012-chart-area svg');return !h||h.viewBox.baseVal.width<600;},null,{timeout:3000}).catch(()=>{});const gv=await frame.evaluate(()=>{const st=NOVA.engines[NovaLessonComponent.id].stage,big=s=>s.getBoundingClientRect().width>120;const host=st.querySelector('.f012-game-host');const inHost=host?[...host.querySelectorAll('.f012-chart-area svg')].filter(big).map(s=>s.viewBox.baseVal.width):[];const outside=[...st.querySelectorAll('svg')].filter(s=>big(s)&&!s.closest('.f012-game-host,.nv-dock')).length;return {host:!!host,inHost,outside};});check('390: Challenge game drawing repainted in the phone layout (viewBox narrower than 600)',!gv.host||(gv.inHost.length>0&&gv.inHost.every(v=>v<600)),gv);check('390: no second drawing left outside the Challenge game',!gv.host||gv.outside===0,gv);}"+old3)
open(OUT,'w').write(s)
print('ok')
