from pathlib import Path
p=Path('/mnt/data/f9_work')
css=(p/'nova-core.css').read_text()
js=(p/'nova-core.js').read_text()
f9css=(p/'F9-02.css').read_text()
f9js=(p/'F9-02.js').read_text()
src='''<!doctype html><html lang="en-GB" data-theme="dark" data-premium="1"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOVA F9-02 · Term-to-term Animator · Premium Edition</title><style>@@CSS@@\n@@F9CSS@@</style></head><body data-topic="algebra"><div class="nova-wrap"><header id="nova-header" data-run="F9 · SEQUENCES AND PATTERNS" data-title="Term-to-term Animator" data-sub="Compare arithmetic and geometric sequence rules, then drag the correct rule and next term into place."></header><main id="gallery"></main></div><script>@@JS@@</script><script>@@F9JS@@</script></body></html>'''
(p/'F9-02.src.html').write_text(src)
result=src.replace('@@CSS@@',css).replace('@@F9CSS@@',f9css).replace('@@JS@@',js).replace('@@F9JS@@',f9js)
(p/'F9-02-term-to-term-animator.html').write_text(result)
print('Built',len(result),'chars')
