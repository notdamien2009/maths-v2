# F11-08 Explore keeps a live drawing handle (box) with bound drag handles; on a layout redraw the runtime asks this closure to
# rebuild it from the pupil's live state, so drags and controls keep working after a resize (state-preserving relayout hook).
EDITS=[('function repaint(){updateFields();if(!box){box=draw(',"function repaint(){window.NovaF11Runtime?.onRelayout('explore',()=>{box=null;repaint();},()=>!!(box&&box.svg&&box.svg.isConnected));updateFields();if(!box){box=draw(")]
