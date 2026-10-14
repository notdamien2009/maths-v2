#!/usr/bin/env python3
"""Local-only NOVA F16-02 builder: never writes to GitHub or shared cores.

Prerequisite: F2/F2-03-base-ten-blocks.html at the same locked review core revision.
The builder refuses different source bytes instead of silently changing a style.
"""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'F2'/'F2-03-base-ten-blocks.html'
if not base.exists():raise SystemExit('Missing existing locked source '+str(base))
raw=base.read_text(encoding='utf-8')
css=raw.split('<style>',1)[1].split('</style>',1)[0][:84537]
js=raw.split('<script>',1)[1].split('</script>',1)[0]
expected_css='d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'
expected_js='fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc'
if hashlib.sha256(css.encode()).hexdigest()!=expected_css:raise SystemExit('F2-03 CSS prefix mismatch: stop, inspect reference rather than redesign.')
if hashlib.sha256(js.encode()).hexdigest()!=expected_js:raise SystemExit('F2-03 JS runtime mismatch: stop, inspect reference rather than redesign.')
page=(ROOT/'build'/'F16-02.src.html').read_text()
for token,content in [('@@CSS@@',css),('@@JS@@',js),('@@F16CSS@@',(ROOT/'src'/'F16-02.css').read_text()),('@@F16JS@@',(ROOT/'src'/'F16-02.js').read_text())]:
    if page.count(token)!=1:raise SystemExit('Missing/duplicate template placeholder '+token)
    page=page.replace(token,content)
output=ROOT/'F16'/'F16-02-bar-chart-builder.html'
output.write_text(page)
print('Built',output,'SHA256',hashlib.sha256(page.encode()).hexdigest())
