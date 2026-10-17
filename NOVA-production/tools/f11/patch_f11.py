"""Rebuild upgraded F11 engines from the supplied originals.
Usage: python3 patch_f11.py [WORK_DIR]  (WORK_DIR contains originals/, F11/, integration/; default: $NOVA_F11_WORK or ../work)
CORE_SOURCE: $NOVA_F3_REFERENCE = an approved F3 engine whose embedded core v1.4 JS is current (default WORK/ref/F3-01-array-builder.html).
F11 native draw functions are already value-driven (plain option objects), so lesson values go through the native draws; no new draw is added.
Per engine: tools/edits/<ID>.py holds exact (old,new) replacements (phone layout); TEXT gives the engine's own SVG text helper that gets a
phone-layout size floor; ROOTS lists extra state-rebuilding functions replayed on a layout redraw (the adapter draws are always wrapped)."""
import re,glob,os,sys
H=os.path.dirname(os.path.abspath(__file__))
W=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.environ.get('NOVA_F11_WORK',os.path.join(H,'..','work')))
ref=os.environ.get('NOVA_F3_REFERENCE',os.path.join(W,'ref','F3-01-array-builder.html'))
f3=open(ref,encoding='utf8').read()
S='/* === NOVA FAMILY CORE v1.4 : JS START';E='/* === NOVA FAMILY CORE v1.4 : JS END'
core=f3[f3.find(S):f3.find(E)]
I=lambda n:open(os.path.join(W,'integration',n),encoding='utf8').read()
api=I('nova-v2-lesson-api.js')
pre=''.join('<script data-nova-f11-support="%s">\n%s\n</script>\n'%(n,I(n)) for n in ['nova-explore-policy.js','nova-speech-policy.js','nova-f11-contracts.js'])
post='\n<script data-nova-f11-support="nova-f11-runtime.js">\n%s\n</script>'%I('nova-f11-runtime.js')
# Phone typography: (phone test expression, [(helper, size parameter)]). The floor applies only while the phone test is true.
PHONE="(window.innerWidth<=480)"
# Floors are sized for the 390 template frame (iframe ~312px, SVG drawn ~236px wide): units = 11.8px / (236 / viewBox width).
# Each entry: (floor, [(helper, size parameter, text parameter)]); only short labels (≤ 8 characters: values, angles, vertex
# letters) get the floor, so long captions keep their native size and do not run into the figure.
TEXT={'F11-02':(38,[('chalk','size','text')]),'F11-04':(36,[('chalk','size','value')])}  # F11-07 uses an arrow helper: see edits/F11-07.py
ROOTS={}
os.makedirs(os.path.join(W,'F11'),exist_ok=True)
for f in sorted(glob.glob(os.path.join(W,'originals','F11-*.html'))):
    s=open(f,encoding='utf8').read();cid=os.path.basename(f)[:6]
    a,b=s.find(S),s.find(E);assert a>0 and b>a,f
    s=s[:a]+core+s[b:]
    m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);assert m,f
    s=s[:m.start()]+pre+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+post+s[m.end():]
    ef=os.path.join(H,'edits',cid+'.py')
    if os.path.exists(ef):
        ns={};exec(open(ef,encoding='utf8').read(),ns)
        for old,new in ns['EDITS']:
            assert s.count(old)==1,(cid,old[:90],s.count(old));s=s.replace(old,new)
    FLOOR,helpers=TEXT.get(cid,(0,[]))
    if FLOOR:
      for name,param,tp in helpers:
        hm=list(re.finditer(r'\n[ \t]*function '+name+r'\(([^)]*)\)\{',s));assert len(hm)==1,(cid,name,len(hm));assert re.search(r'\b'+param+r'\b',hm[0].group(1)) and re.search(r'\b'+tp+r'\b',hm[0].group(1)),(cid,name,param)
        s=s[:hm[0].end()]+'if(%s&&%s<%d&&String(%s).length<=8)%s=%d;'%(PHONE,param,FLOOR,tp,param,FLOOR)+s[hm[0].end():]
    rm=list(re.finditer(r'window\.NovaV2Integration\.register\(\w+,def,\{.*?draws:\{([^}]*)\}',s));assert len(rm)==1,(cid,'register')
    rm=rm[0];names=list(dict.fromkeys(re.findall(r'"(\w+)":\[',rm.group(1))+ROOTS.get(cid,[])))
    for n in names:assert re.search(r'\n[ \t]*function '+n+r'\(',s),(cid,n)
    wrap=''.join('try{%s=window.NovaF11Runtime.wrapDraw("%s",%s);}catch(e){}'%(n,n,n) for n in names)
    s=s[:rm.start()]+'\n/* F11 state-preserving layout redraw: remember the latest stage draw calls. */\n'+wrap+'\n'+s[rm.start():]
    open(os.path.join(W,'F11',os.path.basename(f)),'w',encoding='utf8').write(s);print(os.path.basename(f))
