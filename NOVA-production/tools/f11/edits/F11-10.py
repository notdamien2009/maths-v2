# F11-10 Explore keeps a live drawing handle (box) with bound drag handles; on a layout redraw the runtime asks this closure to
# rebuild it from the pupil's live state, so drags and controls keep working after a resize (state-preserving relayout hook).
EDITS=[("function paint(){updateControls();const opt={...st,editable:true,hide:false,caption:'Measure","function paint(){window.NovaF11Runtime?.onRelayout('explore',()=>{box=null;paint();},()=>!!(box&&box.svg&&box.svg.isConnected));updateControls();const opt={...st,editable:true,hide:false,caption:'Measure")]
