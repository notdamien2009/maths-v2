# F11-11 Explore keeps a live drawing handle (box) with bound drag handles; on a layout redraw the runtime asks this closure to
# rebuild it from the pupil's live state, so drags and controls keep working after a resize (state-preserving relayout hook).
EDITS=[('function paint(){update();let opt={...st,editable:true',"function paint(){window.NovaF11Runtime?.onRelayout('explore',()=>{box=null;paint();},()=>!!(box&&box.svg&&box.svg.isConnected));update();let opt={...st,editable:true")]
