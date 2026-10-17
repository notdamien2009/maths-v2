from pathlib import Path
import re,json,zipfile
r=Path('.');a=r/'audit/f16-f18-production-2026-10-17';reg=json.loads((r/'integration/component-adapters.json').read_text(encoding='utf8'));rows=[x for x in reg if x['id'].split('-')[0] in ['F16','F17','F18']]
# Current entire shared core, including extensions after its historic END marker.
core=(r/'core/nova-core.js').read_text(encoding='utf8').strip();api=(r/'integration/nova-v2-lesson-api.js').read_text(encoding='utf8').strip()
for fam in ['16','17','18']:
 runtime=(r/'integration/nova-f15-runtime.js').read_text(encoding='utf8').replace('F15','F'+fam).replace('f15','f'+fam)
 
 if not (r/f'integration/nova-f{fam}-runtime.js').exists():(r/f'integration/nova-f{fam}-runtime.js').write_text(runtime,encoding='utf8')
 # Strict mathematical checks are expanded after source-specific payload inspection.
 contracts="""/* Native F%s source validation: finite JSON lesson values and private-state protection. */
(function(w){'use strict';function walk(v,p,e){if(typeof v==='number'&&!Number.isFinite(v))e.push(p+' must be finite');else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))e.push('Unsafe field '+k);else walk(x,p+'.'+k,e);}}w.NovaF%sContracts={validate(id,r){const e=[];walk(r,'record',e);return e;}};})(window);
"""%(fam,fam)
 
 if not (r/f'integration/nova-f{fam}-contracts.js').exists():(r/f'integration/nova-f{fam}-contracts.js').write_text(contracts,encoding='utf8')
for row in rows:
 p=r/row['path'];s=zipfile.ZipFile(a/'originals.zip').read(row['path']).decode('utf8');fam=row['id'].split('-')[0][1:]
 # Save a pure native script for exact, repeatable patches.
 native=(a/'native-source'/('F'+fam)/(p.stem+'.js')).read_text(encoding='utf8')
 # Expose two original destructured renderers through a thin argument bridge, without changing their drawing implementation.
 if row['id'] in ['F16-15','F16-16']:
  assert native.count('function stageScene(stage,')==1
  native=native.replace('function stageScene(stage,','function originalStageScene(stage,',1)
  bridge="function stageScene(stage,o={}){if(window.NovaLessonComponent?.active)[stage,o]=window.NovaLessonComponent.args('stageScene',arguments);return originalStageScene(stage,o);}\n"
  native=native.replace("(function(){'use strict';","(function(){'use strict';\n"+bridge,1)
  native=native.replace('draws:{}','draws:{"stageScene":["stage","o"]}')
  assert '"stageScene":["stage","o"]' in native
 
 if (a/'native-edits.json').exists():
  for old,new in json.loads((a/'native-edits.json').read_text(encoding='utf8')).get(row['id'],[]):
   assert native.count(old)==1,(row['id'],old[:90]);native=native.replace(old,new)
 # All declared stage functions are replayable on layout change; use original live state, not reset.
 m=re.search(r'window\.NovaV2Integration\.register\([^\n]*draws:\{(.*?)\}',native);assert m,row['id']
 names=re.findall(r'"(\w+)":\[',m[1]);labelled=row['id'] in ['F16-13','F17-02','F17-03','F17-04','F17-07','F17-10','F18-07','F18-08'];
 wrap=''.join(f'try{{{n}=window.NovaF{fam}Runtime.wrapDraw("{n}",{('window.NovaControlLabels.wrap('+n+')') if labelled else n});}}catch(e){{}}' for n in names)
 native=native[:m.start()]+wrap+'\n'+native[m.start():]
 scripts=list(re.finditer(r'<script\b[^>]*>([\s\S]*?)</script>',s))
 nativeM=scripts[-1];s=s[:nativeM.start(1)]+native+s[nativeM.end(1):]
 # Replace complete core script, not just marker prefix.
 sm=next(m for m in re.finditer(r'<script\b[^>]*>([\s\S]*?)</script>',s) if 'NOVA FAMILY CORE v1.4 : JS START' in m[1]);s=s[:sm.start(1)]+'\n'+core+'\n'+s[sm.end(1):]
 m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);assert m
 support=''.join('<script data-nova-support="'+n+'">\n'+(r/'integration'/n).read_text(encoding='utf8').strip()+'\n</script>\n' for n in ['nova-explore-policy.js','nova-speech-policy.js',f'nova-f{fam}-contracts.js'])+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>\n'+'<script data-nova-support="nova-f'+fam+'-runtime.js">\n'+(r/f'integration/nova-f{fam}-runtime.js').read_text(encoding='utf8').strip()+'\n</script>'
 if labelled:support+='<script data-nova-support="nova-control-labels.js">\n'+(r/'integration/nova-control-labels.js').read_text(encoding='utf8')+'\n</script>'
 s=s[:m.start()]+support+s[m.end():]
 s=s.replace('</head>','<style data-nova-touch-policy="1">@media(pointer:coarse){.nova-stage svg:has([data-drag]){touch-action:none!important}}</style></head>',1)
 p.write_text(s,encoding='utf8')
print('Synchronized 41 sources to the supplied updated core/API, with native scene and layout hooks.')
