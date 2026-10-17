import re,json,glob,os,sys
R='/workspace/codex-f6/work2/root';SRC='/workspace/codex-f6/src';B=os.path.dirname(os.path.abspath(__file__))
HID=json.load(open(B+'/hidden.json'))
open(R+'/integration/nova-f6-contracts.js','w').write(open(B+'/nova-f6-contracts.js').read());open(R+'/integration/nova-f6-runtime.js','w').write(open(B+'/nova-f6-runtime.js').read())
I=lambda f:open(R+'/integration/'+f).read().strip()
pairs=json.load(open(R+'/audit/f4-ref/f3-core-hunks.json'))[8:18]
support=''.join('<script data-nova-f6-support="%s">\n%s\n</script>\n'%(f,I(f)) for f in ['nova-explore-policy.js','nova-speech-policy.js','nova-f6-contracts.js','nova-f4-runtime.js','nova-f6-runtime.js'])
api='<script data-nova-lesson-api="1.0.0">\n'+I('nova-v2-lesson-api.js')+'\n</script>'
hook=open(B+'/hook.js').read();report={}
for path in sorted(glob.glob(SRC+'/F6-[01]*.html')):
    name=os.path.basename(path);cur=name[:5];rep=report.setdefault(cur,[])
    s=open(path,newline='').read().replace('\r\n','\n')
    if cur not in HID:
        rep.append('UNCHANGED: config-only preset; host engine not in the codebase');continue
    s,n=re.subn(r'<script data-nova-lesson-api="1\.0\.0">.*?</script>',lambda m:support+api,s,count=1,flags=re.S);assert n==1,cur;rep.append('canonical lesson API + F6 support scripts')
    for m,p in pairs:
        a='\n'.join(m);b='\n'.join(p)
        if s.count(a)==1:s=s.replace(a,b);rep.append('core: '+a.strip()[:40])
        else:rep.append('core NOT APPLIED: '+a.strip()[:40])
    regpat=re.compile(r'window\.NovaV2Integration\.register\(ID,DEF,\{')
    m=regpat.search(s);assert m,cur
    s=s[:m.start()]+hook.replace('__HID__',str(HID[cur][0])).replace('__HDRAW__','true' if HID[cur][1] else 'false').replace('__REV__',str(HID[cur][2])).replace('__HCODE__',HID[cur][1] or '0')+"window.NovaV2Integration.register(ID,DEF,{validate:r=>window.NovaF6Contracts.validate(ID,r,C),"+s[m.end():]
    m=re.search(r'window\.NovaV2Integration\.register\(ID,DEF,\{validate.*?\}\);\n',s,re.S);assert m,cur
    s=s[:m.end()]+"window.NovaF4Runtime.bind(window.NovaLessonComponent);window.NovaF6Runtime.bind(window.NovaLessonComponent);\n"+s[m.end():]
    bps=sorted({int(n)-(1 if op=='<' else 0) for op,n in re.findall(r'innerWidth\s*(<=|<)\s*(\d+)',s)})
    if bps:
        s,cnt=re.subn(r'(function (\w+)\(stage,[^)]*\)\{\s*if\(window\.NovaLessonComponent\?\.active\)\{\[[^\]]*\]=window\.NovaLessonComponent\.args\("\w+",arguments\);\})',lambda m:m.group(1)+'window.NovaF6Runtime?.record?.('+m.group(2)+',this,arguments);',s)
        assert cnt,cur
        k=s.rfind('</body>');s=s[:k]+'<script>window.NovaF6Runtime?.breakpoints?.('+json.dumps(bps)+');</script>\n'+s[k:]
        rep.append('relayout: %d draw(s) recorded, breakpoints %s'%(cnt,bps));rep.append('F6 data.lesson hook (concealed view: %s) + contracts + runtime bind'%(('native Challenge view' if HID[cur][1] else 'step cap %d'%HID[cur][0])))
    open(R+'/F6/'+name,'w',newline='').write(s)
json.dump(report,open(B+'/build-report.json','w'),indent=1)
for k,v in report.items():print(k,len(v),[x for x in v if 'NOT' in x or 'UNCH' in x])
# Engine-specific: step captions hard-coded to the default 2:3 example are computed from the drawn ratio.
for cur,name,a,b,tag in [
 ('F6-03','F6-03-sharing-in-a-ratio.html',"t.narration=dyn[i];stageScene(stage,p,{step:i,pose:t.pose,caption:t.caption});","t.narration=dyn[i];stageScene(stage,p,{step:i,pose:t.pose,caption:i===4?f6C(f6W(p.a))+' parts make '+f6W(a)+'.':i===5?f6C(f6W(p.b))+' parts make '+f6W(b)+'.':t.caption});",'step 5/6 captions computed from the ratio (were fixed to the 2:3 £30 example)'),
 ('F6-14','F6-14-ratio-fraction-translator.html',"const art=draw(stage,p,{mode:'watch',step,pose:s.pose,caption:s.caption});","const art=draw(stage,p,{mode:'watch',step,pose:s.pose,caption:step===3?p.names[0]+' has '+f6W(p.a)+' of '+f6W(p.a+p.b)+'.':step===4?p.names[1]+' has '+f6W(p.b)+' of '+f6W(p.a+p.b)+'.':s.caption});",'step 4/5 captions computed from the ratio (were fixed to 2:3)')]:
    path=R+'/F6/'+name;s=open(path,newline='').read();assert s.count(a)==1,(cur,s.count(a));s=s.replace(a,'const f6W=n=>{const o=[\'zero\',\'one\',\'two\',\'three\',\'four\',\'five\',\'six\',\'seven\',\'eight\',\'nine\',\'ten\',\'eleven\',\'twelve\',\'thirteen\',\'fourteen\',\'fifteen\',\'sixteen\',\'seventeen\',\'eighteen\',\'nineteen\'],t=[\'\',\'\',\'twenty\',\'thirty\',\'forty\',\'fifty\',\'sixty\',\'seventy\',\'eighty\',\'ninety\'];return Number.isInteger(n)&&n>=0&&n<100?(n<20?o[n]:t[Math.floor(n/10)]+(n%10?\'-\'+o[n%10]:\'\')):String(n);},f6C=s=>s.charAt(0).toUpperCase()+s.slice(1);'+b);open(path,'w',newline='').write(s);report[cur].append(tag)
json.dump(report,open(B+'/build-report.json','w'),indent=1);print('captions patched')
