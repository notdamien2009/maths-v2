"""Rebuild shared F7-08 engine and F7-09/F7-10 presets from the current canonical NOVA F0 core.
Run from this repository's bank-v3-neon-chalk folder; requires the F7-08 source template and F0 core from prior installed runs.
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'build/F7-08.src.html').read_text('utf8')
for key,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-08.css','@@F7JS@@':'src/F7-08.js'}.items():
 source=source.replace(key,(ROOT/path).read_text('utf8'))
assert '@@' not in source
entries=[('F7-08-balance-scales.html',None),('F7-09-balance-negatives-unknowns.html','F7-09'),('F7-10-cups-and-counters.html','F7-10')]
for name,variant in entries:
 html=source
 if variant=='F7-09':
  html=html.replace('<title>NOVA F7-08 · Balance Scales · Premium Review</title>','<title>NOVA F7-09 · Balance with Negatives and Unknowns · Premium Review</title>')
  html=html.replace('<body>','<body data-entry-preset="F7-09-negatives" data-entry-variant="F7-09">')
  html=html.replace('data-title="Balance Scales" data-sub="Keep both pans equal to solve equations with inverse operations."','data-title="Balance with Negatives and Unknowns" data-sub="Zero pairs, negative balloons and unknowns on both pans."')
 elif variant=='F7-10':
  html=html.replace('<title>NOVA F7-08 · Balance Scales · Premium Review</title>','<title>NOVA F7-10 · Cups-and-Counters Solver · Premium Review</title>')
  html=html.replace('<body>','<body data-entry-preset="F7-10-cups" data-entry-variant="F7-10">')
  html=html.replace('data-title="Balance Scales" data-sub="Keep both pans equal to solve equations with inverse operations."','data-title="Cups-and-Counters Solver" data-sub="Remove matching counters, then share equally between mystery cups."')
 (ROOT/'F7'/name).write_text(html,'utf8')
 print('Built',name,len(html),'bytes')
