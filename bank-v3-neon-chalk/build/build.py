import os, re
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
css=open('core/nova-core.css').read();js=open('core/nova-core.js').read()
# Filter lock: every bank-defined SVG glow filter must use userSpaceOnUse.
for ident in ('nv-glow','nv-shadow','nv-neon','nv-neon-halo','nv-neon-soft','nv-chalk'):
  match=re.search(r"E\('filter',\{id:'"+ident+r"'([^}]*)\}",js)
  if not match or "filterUnits:'userSpaceOnUse'" not in match.group(1):
    raise RuntimeError('SVG filter lock failed: '+ident)
os.makedirs('F0',exist_ok=True)
engines=[('F0-01','F0-01-design-tokens'),('F0-02','F0-02-svg-primitives'),('F0-03','F0-03-animation-timeline'),('F0-04','F0-04-interaction-kit'),('F0-05','F0-05-maths-text'),('F0-06','F0-06-seeded-randomiser'),('F0-07','F0-07-state-events'),('F0-08','F0-08-narration-hooks'),('F0-09','F0-09-registry-manifest'),('F0-10','F0-10-gallery-shell'),('F0-11','F0-11-assessment'),('F0-12','F0-12-game-wrapper'),('F0-13','F0-13-worked-example'),('F0-14','F0-14-axes-plotting'),('F0-15','F0-15-interactive-table'),('F0-16','F0-16-geometry-canvas'),('F0-17','F0-17-static-print')]
for n,o in engines:
  s=open(f'build/{n}.src.html').read().replace('@@CSS@@',css).replace('@@JS@@',js);open(f'F0/{o}.html','w').write(s)
# Premium trial build of F0-02 only (opt-in data-premium; original untouched above)
s=open('build/F0-02.src.html').read().replace('@@CSS@@',css).replace('@@JS@@',js)
s=s.replace('<html lang="en" data-theme="dark">','<html lang="en" data-theme="dark" data-premium="1">')
s=s.replace('<title>NOVA F0-02 · SVG primitives (arrows, braces, arcs, grids, axes, labels)</title>',
            '<title>NOVA F0-02 · SVG primitives PREMIUM trial</title>')
s=s.replace('data-title="SVG primitives"','data-title="SVG primitives · Premium trial"')
s=s.replace('data-sub="Arrows, braces, arcs, grids, axes and labels: the drawing kit every NOVA engine is built from."',
            'data-sub="Premium neon-glass drawing kit trial. Same maths, richer strokes, glows and panels."')
open('F0/F0-02-svg-primitives-PREMIUM.html','w').write(s)
print('built', len(engines), 'engines + F0-02 PREMIUM')

# F5 Premium Edition: isolated, opt-in build using current v3.6.2 foundation.
F5=[('F5-01','F5-01-fraction-strips-and-wall'),('F5-02','F5-02-fraction-circles'),('F5-03','F5-03-area-model-fractions'),('F5-04','F5-04-fractions-number-line-preset'),('F5-05','F5-05-equivalent-fraction-multiplier'),('F5-06','F5-06-fraction-simplifier'),('F5-07','F5-07-add-and-subtract-fractions'),('F5-09','F5-09-divide-fractions'),('F5-10','F5-10-mixed-improper-converter'),('F5-11','F5-11-fraction-of-an-amount'),('F5-12','F5-12-hundred-square-percentage-grid'),('F5-13','F5-13-fdp-conversion-machine')]
import re
for n,out in F5:
  src=open(f'build/{n}.src.html',encoding='utf-8').read()
  assert '@@CSS@@' in src and '@@JS@@' in src,n
  assert not re.search(r'function\s+(?:arrow|subdiv|meter)\s*\(',src), 'Unapproved SVG primitive'
  assert 'svgDrag' in src and ('NOVA.motion' in src or 'M.tween' in src or 'M.arrive' in src), 'v3.6 toolkit missing'
  assert '.nv-frac-tbd' not in src, 'TBD notation deprecated by owner lock'
  assert 'NOVA_'+n.replace('-','_')+'_CONFIG' in src, 'config missing'
  os.makedirs('F5',exist_ok=True)
  built=src.replace('@@CSS@@',css).replace('@@JS@@',js)
  open(f'F5/{out}.html','w',encoding='utf-8').write(built)
  print('built',n,out,'using bank core v3.6.2')

# F5-14 premium percentage-of-an-amount addition
name='F5-14'; slug='F5-14-percentage-of-an-amount'; src=open('build/F5-14.src.html',encoding='utf-8').read()
assert '@@CSS@@' in src and '@@JS@@' in src and 'NOVA_F5_14_CONFIG' in src
assert 'svgDrag' in src and 'M.tween' in src and 'N.numberLine' in src
assert '.nv-frac-tbd' not in src
open('F5/'+slug+'.html','w',encoding='utf-8').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
print('built F5-14 using NOVA v3.6.2 core')

# F5-15 Premium Edition: calibrated change/multiplier bar adapter
name='F5-15';slug='F5-15-percentage-change-and-multipliers';src=open('build/F5-15.src.html',encoding='utf-8').read()
assert '@@CSS@@' in src and '@@JS@@' in src
assert 'NOVA_F5_15_CONFIG' in src and 'svgDrag' in src and 'M.tween' in src and 'N.numberLine' in src
assert 'N.svg.arrow' in src and '.nv-frac-tbd' not in src
open('F5/'+slug+'.html','w',encoding='utf-8').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
print('built F5-15 with locked v3.6.2 core')

# F5-16 reverse percentage: F4-06 shared-engine preset adapter.
name='F5-16';slug='F5-16-reverse-percentage-preset'
src=open('build/F5-16.src.html',encoding='utf-8').read()
assert '@@CSS@@' in src and '@@JS@@' in src
assert 'NOVA_F5_16_CONFIG' in src and 'N.ui.svgDrag' in src and 'M.tween' in src
assert 'N.numberLine' in src and 'N.svg.arrow' in src
assert '.nv-frac-tbd' not in src and 'function subdiv(' not in src
built=src.replace('@@CSS@@',css).replace('@@JS@@',js)
open('F5/'+slug+'.html','w',encoding='utf-8').write(built)
print('built F5-16 as F4-06 reverse-percentage adapter against NOVA core')

# F5-17: recurring decimal explorer; exact rational remainder loop.
src=open('build/F5-17.src.html',encoding='utf-8').read()
assert 'NOVA_F5_17_CONFIG' in src and 'N.ui.svgDrag' in src and 'M.tween' in src
assert '@@CSS@@' in src and '@@JS@@' in src and '.nv-frac-tbd' not in src
open('F5/F5-17-recurring-decimal-explorer.html','w',encoding='utf-8').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
print('built F5-17 using NOVA v3.6.2 core')

# F5-18: terminating or recurring sorter; reduced-denominator prime factors.
src=open('build/F5-18.src.html',encoding='utf-8').read()
assert '@@CSS@@' in src and '@@JS@@' in src
assert 'NOVA_F5_18_CONFIG' in src and 'N.ui.svgDrag' in src and 'M.tween' in src
assert '.nv-frac-tbd' not in src
assert 'N.chalkText' in src and 'N.neonBox' in src
open('F5/F5-18-terminating-recurring-sorter.html','w',encoding='utf-8').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
print('built F5-18 with NOVA v3.6.2 core')

# F5-19 Premium Edition: pizza and chocolate equal-area contexts.
src=open('build/F5-19.src.html',encoding='utf-8').read()
assert '@@CSS@@' in src and '@@JS@@' in src
assert 'NOVA_F5_19_CONFIG' in src and 'N.ui.svgDrag' in src and 'M.tween' in src
assert '.nv-frac-tbd' not in src and 'N.chalkText' in src
open('F5/F5-19-pizza-and-chocolate-fraction-contexts.html','w',encoding='utf-8').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
print('built F5-19 with locked NOVA core')
