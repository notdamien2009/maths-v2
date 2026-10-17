# F11-07 Explore keeps a live drawing handle (box) with bound drag handles; on a layout redraw the runtime asks this closure to
# rebuild it from the pupil's live state, so drags and controls keep working after a resize (state-preserving relayout hook).
EDITS=[('function repaint(){countRead.textContent=state.n;',"function repaint(){window.NovaF11Runtime?.onRelayout('explore',()=>{box=null;repaint();},()=>!!(box&&box.svg&&box.svg.isConnected));countRead.textContent=state.n;")]
# Phone typography (390 frame, 530-unit phone viewBox drawn ~236px wide): chalk labels get a 27-unit floor (about 12 CSS px).
EDITS.append(("const chalk=(g,x,y,txt,role='given',size=26,anchor='middle')=>N.chalkText(g,x,y,String(txt),{role,size,anchor});","const chalk=(g,x,y,txt,role='given',size=26,anchor='middle')=>(window.innerWidth<=480&&size<27&&(size=27),N.chalkText(g,x,y,String(txt),{role,size,anchor}));"))
