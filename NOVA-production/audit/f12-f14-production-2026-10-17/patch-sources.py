from pathlib import Path
import re,json,zipfile
r=Path('.');a=r/'audit/f12-f14-production-2026-10-17';rows=[x for x in json.loads((r/'integration/component-adapters.json').read_text(encoding='utf8')) if x['id'].startswith(('F12-','F14-'))]
core=(r/'core/nova-core.js').read_text(encoding='utf8').strip();api=(r/'integration/nova-v2-lesson-api.js').read_text(encoding='utf8').strip()
for row in rows:
 p=r/row['path'];f=row['id'].split('-')[0][1:];s=zipfile.ZipFile(a/'originals.zip').read(row['path']).decode('utf8');scripts=list(re.finditer(r'<script\b[^>]*>([\s\S]*?)</script>',s));native=(a/'native-source'/('F'+f)/(p.stem+'.js')).read_text(encoding='utf8')
 for old,new in json.loads((a/'native-edits.json').read_text(encoding='utf8')).get(row['id'],[]):
  assert native.count(old)==1,(row['id'],old[:80]);native=native.replace(old,new)
 m=re.search(r'window\.NovaV2Integration\.register\([^\n]*draws:\{(.*?)\}',native);names=re.findall(r'"(\w+)":\[',m[1]);wrap=''.join(f'try{{{n}=window.NovaF{f}Runtime.wrapDraw("{n}",window.NovaControlLabels.wrap({n}));}}catch(e){{}}' for n in names);native=native[:m.start()]+wrap+'\n'+native[m.start():];m=scripts[-1];s=s[:m.start(1)]+native+s[m.end(1):]
 m=next(x for x in re.finditer(r'<script\b[^>]*>([\s\S]*?)</script>',s) if 'NOVA FAMILY CORE v1.4 : JS START' in x[1]);extra=''
 if f=='12':extra=m[1][m[1].index('/* ==== v3.5 F12 SHAPE KIT'):]
 s=s[:m.start(1)]+core+'\n'+extra+s[m.end(1):]
 m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);support=''.join('<script data-nova-support="'+n+'">\n'+(r/'integration'/n).read_text(encoding='utf8')+'\n</script>' for n in ['nova-explore-policy.js','nova-speech-policy.js',f'nova-f{f}-contracts.js'])+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+''.join('<script data-nova-support="'+n+'">\n'+(r/'integration'/n).read_text(encoding='utf8')+'\n</script>' for n in [f'nova-f{f}-runtime.js','nova-control-labels.js']);s=s[:m.start()]+support+s[m.end():];s=s.replace('</head>','<style data-nova-touch-policy="1">@media(pointer:coarse){.nova-stage svg:has([data-drag]){touch-action:none!important}}</style></head>',1);p.write_text(s,encoding='utf8')
print('Patched',len(rows),'native sources; shared core and existing families unchanged.')
