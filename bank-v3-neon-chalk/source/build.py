from pathlib import Path
p=Path(__file__).resolve().parent
base=(p/'approved-F12-03-base.html').read_text(encoding='utf-8')
engine=(p/'f13-03.engine.js').read_text(encoding='utf-8')
b=base.index('<script>\n/* ===== F12-03 CONFIG:')
e=base.index('</script>',b)
s=base[:b]+'<script>\n'+engine+'\n'+base[e:]
s=s.replace('<title>NOVA F12-03 · Geoboard builder</title>','<title>NOVA F13-03 · Premium Isometric Drawing Studio</title>')
s=s.replace('data-run="F12 · 2D shapes, perimeter and area · F12-03" data-title="Geoboard builder" data-sub="Stretch a band round pegs to make shapes, then read their area, perimeter and name."','data-run="F13 · 3D shapes, volume and surface area · F13-03" data-title="Isometric drawing studio" data-sub="Construct precise isometric drawings with neon unit cubes, dot paper and three-dimensional stacking."')
css='''
/* F13-03 component additions; F0/F1/F12 production shell kept intact */
.f13-iso-svg{width:100%!important;max-width:810px!important;height:auto!important;display:block!important;margin:4px auto 0!important;touch-action:none;cursor:crosshair;user-select:none;outline:none}
.f13-iso-svg.f13-grabbing{cursor:grabbing}
.f13-iso-svg:focus-visible{outline:2px dashed var(--m-focus);outline-offset:-4px;border-radius:10px}
.f13-iso-background{pointer-events:none}
.f13-iso-cubes{pointer-events:none}
.f13-iso-dots{pointer-events:none}
.f13-iso-hits [data-cell]{cursor:crosshair}
.f13-teach-note{color:var(--v-ink);opacity:.9;font:700 .9rem/1.5 var(--nova-font-ui);margin:9px 0 6px}
.f13-panel-row{margin-top:9px}
.f13-panel-row label{font:700 .95rem var(--nova-font-chalk-draw);color:var(--v-ink)}
.f13-panel-row select{margin-left:8px;max-width:min(100%,280px)}
.f13-toggle{display:inline-flex;align-items:center;gap:6px;color:var(--v-ink);font:700 .82rem var(--nova-font-ui);white-space:nowrap}
.f13-toggle input{accent-color:var(--math-cyan)}
.f13-progress{color:var(--math-cyan);font:700 1.15rem var(--nova-font-chalk-draw)}
.nova-stage>.f13-iso-svg{flex:0 0 auto}
@media(max-width:580px){.f13-iso-svg{margin-top:6px!important}.f13-teach-note{font-size:.84rem}.f12-strip{gap:5px;padding-left:4px;padding-right:4px}.f12-strip .nv-ntile{padding:3px 9px;font-size:1.05rem}}
'''
s=s.replace('</style>\n</head>',css+'</style>\n</head>',1)
out=p.parent/'F13-03-Isometric-Drawing-PREMIUM-CORE.html'
out.write_text(s,encoding='utf-8')
print('Built',out)
