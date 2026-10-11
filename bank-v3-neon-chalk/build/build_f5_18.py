from pathlib import Path
R=Path(__file__).resolve().parents[1]
shell=(R/'build/F5-18.src.html').read_text(encoding='utf-8')
start='<script>@@JS@@</script><script>\n'
assert start in shell and shell.endswith('</script></body></html>')
js=(R/'src/F5-18.js').read_text(encoding='utf-8')
shell=shell[:shell.index(start)+len(start)]+js+'\n</script></body></html>'
assert 'NOVA_F5_18_CONFIG' in shell and 'N.ui.svgDrag' in shell and 'M.tween' in shell
assert '.nv-frac-tbd' not in shell
html=shell.replace('@@CSS@@',(R/'core/nova-core.css').read_text(encoding='utf-8')).replace('@@JS@@',(R/'core/nova-core.js').read_text(encoding='utf-8'))
target=R/'F5/F5-18-terminating-recurring-sorter.html'
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(html,encoding='utf-8')
print('built F5-18 against NOVA v3.6.2; bytes:',len(html.encode('utf-8')))
