import re,json,glob,os,sys
B=os.path.dirname(os.path.abspath(__file__));W=os.environ.get('NOVA_F10_WORK',os.path.dirname(B));R=W+'/root';SRC=W+'/src'
exec(open(B+'/hooks10.py').read())
open(R+'/integration/nova-f10-contracts.js','w').write(open(B+'/nova-f10-contracts.js').read().rstrip()+'\n'+open(B+'/rules10.js').read())
open(R+'/integration/nova-f10-runtime.js','w').write(open(B+'/nova-f10-runtime.js').read())
I=lambda f:open(R+'/integration/'+f).read().strip()
pairs=json.load(open(os.environ.get('NOVA_F3_CORE_HUNKS',R+'/audit/f4-ref/f3-core-hunks.json')))[8:18]
support=''.join('<script data-nova-f10-support="%s">\n%s\n</script>\n'%(f,I(f)) for f in ['nova-explore-policy.js','nova-speech-policy.js','nova-f10-runtime.js','nova-f10-contracts.js','nova-f4-runtime.js'])
api='<script data-nova-lesson-api="1.0.0">\n'+I('nova-v2-lesson-api.js')+'\n</script>'
hook=open(B+'/hook.js').read();report={}
only=sys.argv[1:]
for path in sorted(glob.glob(SRC+'/*F10-[0-9][0-9]*.html')):
    name=os.path.basename(path);cur=re.search(r'F10-\d\d',name).group(0)
    if only and cur not in only:continue
    if cur not in H:print('skip',cur);continue
    rep=report.setdefault(cur,[]);c=H[cur]
    s=open(path,newline='').read().replace('\r\n','\n')
    s,n=re.subn(r'<script data-nova-lesson-api="1\.0\.0">.*?</script>',lambda m:support+api,s,count=1,flags=re.S);assert n==1,cur;rep.append('canonical lesson API + F10 support scripts')
    for m,p in pairs:
        a='\n'.join(m);b='\n'.join(p)
        if s.count(a)==1:s=s.replace(a,b);rep.append('core: '+a.strip()[:40])
        else:rep.append('core NOT APPLIED: '+a.strip()[:40])
    for a,b in c.get('patch',[]):
        assert s.count(a)==1,(cur,'patch anchor',a[:60],s.count(a));s=s.replace(a,b);rep.append('engine patch: '+c.get('patchNote','see hooks10.py'))
    m=re.search(r'window\.NovaV2Integration\.register\(ID,def,\{',s);assert m,cur
    hk=hook.replace('__MODEL__',c['model']).replace('__CUR__',c.get('cur','M.preset')).replace('__APPLY__',c.get('apply','')).replace('__AFTER__',c.get('after','')).replace('__REV__',str(c.get('rev',1))).replace('__HID__',c['hid']).replace('__SHOW__',c.get('show','f10NativeRender.call(def,Math.min(p,def.steps.length-1),stage)'))
    s=s[:m.start()]+hk+"window.NovaV2Integration.register(ID,def,{validate:r=>window.NovaF10Contracts.validate('%s',r,f10Ctx()),"%cur+s[m.end():]
    m=re.search(r'window\.NovaV2Integration\.register\(ID,def,\{validate.*?\}\);\n',s,re.S);assert m,cur
    s=s[:m.end()]+"window.NovaF4Runtime.bind(window.NovaLessonComponent);window.NovaF10Runtime.bind(window.NovaLessonComponent);\n"+s[m.end():]
    bps=sorted({int(n)-(1 if op=='<' else 0) for op,n in re.findall(r'innerWidth\s*(<=|<)\s*(\d+)',s)}|{760})
    s,cnt=re.subn(r'(function (\w+)\(stage,[^)]*\)\{\s*if\(window\.NovaLessonComponent\?\.active\)\{\[[^\]]*\]=window\.NovaLessonComponent\.args\("\w+",arguments\);\})',lambda m:m.group(1)+'window.NovaF10Runtime?.record?.('+m.group(2)+',this,arguments);',s)
    for fn in c.get('rec',[]):
        s,k=re.subn(r'(function '+fn+r'\([^)]*\)\{)',lambda m:m.group(1)+'window.NovaF10Runtime?.record?.('+fn+',this,arguments);',s,count=1);cnt+=k
    assert cnt,cur
    k=s.rfind('</body>');s=s[:k]+'<script>window.NovaF10Runtime?.breakpoints?.('+json.dumps(bps)+');</script>\n'+s[k:]
    rep.append('relayout: %d draw(s) recorded, breakpoints %s'%(cnt,bps));rep.append('F10 data.lesson hook (concealed view: %s) + contracts + runtime bind'%c.get('hidNote','native Challenge-style view'))
    open(R+'/F10/'+name,'w',newline='').write(s)
old=json.load(open(B+'/build-report.json')) if os.path.exists(B+'/build-report.json') else {}
old.update(report);json.dump(old,open(B+'/build-report.json','w'),indent=1)
for k,v in report.items():print(k,len(v),[x for x in v if 'NOT' in x or 'relayout' in x])
