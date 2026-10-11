from pathlib import Path
root=Path(__file__).resolve().parents[1]
core_css=(root/'core/nova-core.css').read_text(encoding='utf8')
core_js=(root/'core/nova-core.js').read_text(encoding='utf8')
local_css=(root/'src/F3-02.css').read_text(encoding='utf8')
local_js=(root/'src/F3-02.js').read_text(encoding='utf8')
for source,target in [('F3-02.src.html','F3/F3-02-area-model-of-multiplication.html'),('F7-05.entry.src.html','F7/F7-05-expanding-double-brackets.html')]:
 text=(root/'build'/source).read_text(encoding='utf8')
 for key,v in [('@@CSS@@',core_css),('@@F302CSS@@',local_css),('@@JS@@',core_js),('@@F302JS@@',local_js)]:
  assert text.count(key)==1,(source,key)
  text=text.replace(key,v)
 dest=root/target;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf8');print(target,'compiled')
