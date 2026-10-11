import os,re,sys
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
css=open('core/nova-core.css').read();js=open('core/nova-core.js').read()
F0=[('F0-01','F0-01-design-tokens'),('F0-02','F0-02-svg-primitives'),('F0-03','F0-03-animation-timeline'),('F0-04','F0-04-interaction-kit'),('F0-05','F0-05-maths-text'),('F0-06','F0-06-seeded-randomiser'),('F0-07','F0-07-state-events'),('F0-08','F0-08-narration-hooks'),('F0-09','F0-09-registry-manifest'),('F0-10','F0-10-gallery-shell'),('F0-11','F0-11-assessment'),('F0-12','F0-12-game-wrapper'),('F0-13','F0-13-worked-example'),('F0-14','F0-14-axes-plotting'),('F0-15','F0-15-interactive-table'),('F0-16','F0-16-geometry-canvas'),('F0-17','F0-17-static-print')]
F1=[('F1-01','F1-01-configurable-number-line'),('F1-02','F1-02-zoomable-number-line'),('F1-03','F1-03-jump-arc-operator')]
F12=[('F12-01','F12-01-shape-family-tree'),('F12-02','F12-02-property-sorter'),('F12-03','F12-03-geoboard-builder'),('F12-04','F12-04-perimeter-tracer'),('F12-05','F12-05-area-by-counting'),('F12-06','F12-06-parallelogram-shear'),('F12-07','F12-07-triangle-area-by-doubling'),('F12-08','F12-08-trapezium-area'),('F12-09','F12-09-kite-and-rhombus-area'),('F12-10','F12-10-compound-shape-decomposer'),('F12-11','F12-11-circumference-unrolling'),('F12-12','F12-12-circle-area-unwrap'),('F12-13','F12-13-arc-and-sector-explorer'),('F12-14','F12-14-area-and-perimeter-relationship'),('F12-15','F12-15-units-of-area-grid')]
# self-check: every SVG glow filter must use filterUnits=userSpaceOnUse (straight lines have a zero-height bbox)
def check(txt,name):
  bad=0
  for m in re.finditer(r"E\('filter'",txt):
    if 'userSpaceOnUse' not in txt[m.start():m.start()+120]: bad+=1
  for m in re.finditer(r'<filter\b[^>]*>',txt):
    if 'id="cvd-' in m.group(0): continue  # colour-vision simulation filters act on whole elements, not lines
    if 'userSpaceOnUse' not in m.group(0): bad+=1
  if bad: print('GLOW FILTER CHECK FAILED in',name,bad); sys.exit(1)
check(js,'core/nova-core.js')
def build(lst,outdir):
  os.makedirs(outdir,exist_ok=True)
  for n,o in lst:
    src=open(f'build/{n}.src.html').read(); check(src,f'build/{n}.src.html')
    open(f'{outdir}/{o}.html','w').write(src.replace('@@CSS@@',css).replace('@@JS@@',js))
build(F0,'F0');build(F1,'F1');build(F12,'F12')
# Premium trial build of F0-02 only (opt-in data-premium; original untouched above)
s=open('build/F0-02.src.html').read().replace('@@CSS@@',css).replace('@@JS@@',js)
s=s.replace('<html lang="en" data-theme="dark">','<html lang="en" data-theme="dark" data-premium="1">')
s=s.replace('<title>NOVA F0-02 · SVG primitives (arrows, braces, arcs, grids, axes, labels)</title>','<title>NOVA F0-02 · SVG primitives PREMIUM trial</title>')
s=s.replace('data-title="SVG primitives"','data-title="SVG primitives · Premium trial"')
s=s.replace('data-sub="Arrows, braces, arcs, grids, axes and labels: the drawing kit every NOVA engine is built from."','data-sub="Premium neon-glass drawing kit trial. Same maths, richer strokes, glows and panels."')
open('F0/F0-02-svg-primitives-PREMIUM.html','w').write(s)
print('built',len(F0),'F0 +',len(F1),'F1 +',len(F12),'F12 engines + F0-02 PREMIUM; glow-filter self-check passed')
