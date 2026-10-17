"""Rebuild upgraded F15 engines from the supplied originals.
Usage: python3 patch_f15.py [WORK_DIR]  (WORK_DIR contains originals/, F15/, integration/; default: $NOVA_F15_WORK or ../work)
CORE_SOURCE: $NOVA_F3_REFERENCE = an approved F3 engine whose embedded core v1.4 JS is current (default WORK/ref/F3-01-array-builder.html).
F15 native draw functions are already value-driven (plain option objects), so lesson values go through the native draws; no new draw is added.
Per engine: tools/edits/<ID>.py holds exact (old,new) replacements (phone layout); TEXT gives the engine's own SVG text helper that gets a
phone-layout size floor; ROOTS lists extra state-rebuilding functions replayed on a layout redraw (the adapter draws are always wrapped)."""
import re,glob,os,sys
H=os.path.dirname(os.path.abspath(__file__))
W=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.environ.get('NOVA_F15_WORK',os.path.join(H,'..','work')))
ref=os.environ.get('NOVA_F3_REFERENCE',os.path.join(W,'ref','F3-01-array-builder.html'))
f3=open(ref,encoding='utf8').read()
S='/* === NOVA FAMILY CORE v1.4 : JS START';E='/* === NOVA FAMILY CORE v1.4 : JS END'
core=f3[f3.find(S):f3.find(E)]
I=lambda n:open(os.path.join(W,'integration',n),encoding='utf8').read()
api=I('nova-v2-lesson-api.js')
pre=''.join('<script data-nova-f15-support="%s">\n%s\n</script>\n'%(n,I(n)) for n in ['nova-explore-policy.js','nova-speech-policy.js','nova-f15-contracts.js'])
post='\n<script data-nova-f15-support="nova-f15-runtime.js">\n%s\n</script>'%I('nova-f15-runtime.js')
# Phone typography: (phone test expression, [(helper, size parameter)]). The floor applies only while the phone test is true.
PHONE_AT={'F15-01':500,'F15-02':500}  # the other F15 engines switch to their phone layout at innerWidth<=540
PHONEX=lambda cid:"(window.innerWidth<=%d)"%PHONE_AT.get(cid,540)
# Floors are sized for the 390 template frame (iframe 312px; the 420-unit phone viewBox is drawn ~258px wide, 0.61 px per unit).
# Each entry: (short floor, long floor, [(helper, size parameter, text parameter)]). Short labels (<= 14 characters: values, units,
# axis names, card headings) get the short floor (19 units, about 11.7px); longer captions get the long floor (14 units, about 8.6px) only.
TEXT={'F15-07':(19,14,[('chalk','size','t')])}
# Live caption sync (see F13): engine id -> caption expression override (None = reuse the engine's own caption expression).
CAPSYNC={}
ROOTS={}
os.makedirs(os.path.join(W,'F15'),exist_ok=True)
import json
ROWS=sorted((r['id'],os.path.basename(r['path'])) for r in json.load(open(os.path.join(W,'integration','component-adapters.json'),encoding='utf8')) if r['id'].startswith('F15-'))
for cid,base in ROWS:
    f=os.path.join(W,'originals',base);s=open(f,encoding='utf8').read()
    a,b=s.find(S),s.find(E);assert a>0 and b>a,f
    s=s[:a]+core+s[b:]
    m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);assert m,f
    s=s[:m.start()]+pre+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+post+s[m.end():]
    ef=os.path.join(H,'edits',cid+'.py')
    if os.path.exists(ef):
        ns={};exec(open(ef,encoding='utf8').read(),ns)
        for old,new in ns['EDITS']:
            assert s.count(old)==1,(cid,old[:90],s.count(old));s=s.replace(old,new)
    # F0 foundation: engine-local glow filters use objectBoundingBox percentages; switch them to the core's userSpaceOnUse region
    # (same -400/1600 box as nv-glow), which keeps the look and stops the glow being clipped or resized with each shape.
    s,nf=re.subn(r"'filter',\{id:'([\w-]+)',x:'-?\d+%',y:'-?\d+%',width:'\d+%',height:'\d+%'\}",r"'filter',{id:'\1',filterUnits:'userSpaceOnUse',x:-400,y:-400,width:1600,height:1600}",s)
    F1,F2,helpers=TEXT.get(cid,(0,0,[]))
    for name,param,tp in helpers:
        hm=list(re.finditer(r'\bfunction '+name+r'\(([^)]*)\)\{',s));assert len(hm)==1,(cid,name,len(hm));assert re.search(r'\b'+param+r'\b',hm[0].group(1)) and re.search(r'\b'+tp+r'\b',hm[0].group(1)),(cid,name,param)
        s=s[:hm[0].end()]+'if(%s){var _n=String(%s).length,_z=+%s||0;if(_n<=14&&_z<%d)%s=%d;else if(_n>14&&_z<%d)%s=%d;}'%(PHONEX(cid),tp,param,F1,param,F1,F2,param,F2)+s[hm[0].end():]
    if cid in CAPSYNC:
        cm=list(re.finditer(r"NOVA\.cap\(stage,(.*?),('[^']*')\);",s));assert len(cm)==1,(cid,'cap',len(cm))
        expr=CAPSYNC[cid] or cm[0].group(1)
        s=s[:cm[0].end()]+"stage._f15cap=function(){var c=stage.querySelector('.nv-cap > span');if(c)c.textContent=%s;};"%expr+s[cm[0].end():]
        assert s.count('function refresh(){')==1,(cid,'refresh');s=s.replace('function refresh(){','function refresh(){if(stage._f15cap)stage._f15cap();')
    rm=list(re.finditer(r'window\.NovaV2Integration\.register\([\w\x27-]+,\w+,\{.*?draws:\{([^}]*)\}',s));assert len(rm)==1,(cid,'register')
    rm=rm[0];names=list(dict.fromkeys(re.findall(r'"(\w+)":\[',rm.group(1))+ROOTS.get(cid,[])))
    for n in names:assert re.search(r'\n[ \t]*function '+n+r'\(',s),(cid,n)
    wrap=''.join('try{%s=window.NovaF15Runtime.wrapDraw("%s",%s);}catch(e){}'%(n,n,n) for n in names)
    s=s[:rm.start()]+'\n/* F15 state-preserving layout redraw: remember the latest stage draw calls. */\n'+wrap+'\n'+s[rm.start():]
    open(os.path.join(W,'F15',os.path.basename(f)),'w',encoding='utf8').write(s);print(os.path.basename(f))
