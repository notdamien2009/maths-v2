# F11-06 Explore keeps a live drawing handle (box) with bound drag handles; on a layout redraw the runtime asks this closure to
# rebuild it from the pupil's live state, so drags and controls keep working after a resize (state-preserving relayout hook).
EDITS=[('function redraw(recreate=true){',"function redraw(recreate=true){window.NovaF11Runtime?.onRelayout('explore',()=>{redraw(true);},()=>!!(box&&box.svg&&box.svg.isConnected));")]
# Keep the geometry layer in its original place on a repaint (below the drag handle), so the handle's hit target is never covered
# and a repaint draws the same layer order as a fresh draw.
EDITS.append(("""let old=svg.querySelector('[data-layer="geometry"]');old?.remove();let g=E('g',{'data-layer':'geometry','data-testid':'f116-geometry'},svg),""","""let old=svg.querySelector('[data-layer="geometry"]'),oldNext=old?.nextSibling;old?.remove();let g=E('g',{'data-layer':'geometry','data-testid':'f116-geometry'},svg),keepLayer=(oldNext&&oldNext.parentNode===svg)?svg.insertBefore(g,oldNext):null,"""))
