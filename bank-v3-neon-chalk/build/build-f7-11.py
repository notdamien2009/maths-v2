#!/usr/bin/env python3
"""Rebuild F7-11 and cumulative F4-08 from the original, UNMODIFIED NOVA F0 core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
t=(root/'build/F4-08.src.html').read_text()
css=(root/'core/nova-core.css').read_text();js=(root/'core/nova-core.js').read_text()
fcss=(root/'src/F4-08.css').read_text();fjs=(root/'src/F4-08.js').read_text()
for preset in (False,True):
 s=t.replace('@@CSS@@',css).replace('@@F4CSS@@',fcss).replace('@@JS@@',js).replace('@@F4JS@@',fjs)
 if preset:
  s=s.replace('<body data-topic="algebra">','<body data-topic="algebra" data-f711="1">').replace('<title>NOVA F4-08 · Algebra Bar · Premium Review</title>','<title>NOVA F7-11 · Bar-Model Equation · Premium Review</title>')
  s=s.replace('data-run="F4 · Run 08 · Review" data-title="Algebra Bar" data-sub="See unknown groups as equal bars, remove known quantities from both sides and connect the diagram to an equation."','data-run="F7 · Run 11 · Review" data-title="Bar-Model Equation" data-sub="Turn stories into equal x parts, subtract known amounts on both sides, and reveal one unknown quantity."')
 out=root/('F7/F7-11-bar-model-equation.html' if preset else 'F4/F4-08-algebra-bar.html');out.parent.mkdir(parents=True,exist_ok=True);out.write_text(s);print(out)
