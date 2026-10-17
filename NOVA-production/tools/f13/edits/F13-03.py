# Phone typography (390 frame: 420-unit phone viewBox drawn ~258px wide, 0.61 px per unit): the engine calls the core chalk text
# directly, so the axis names, cube level numbers and the cube total get phone sizes here (about 11-12 CSS px).
P="(window.innerWidth<=580)"
EDITS=[("{role:a[2],size:16})","{role:a[2],size:%s?19:16})"%P),
       ("NOVA.chalkText(ce,mid[0],mid[1]+5,String(z+1),{role:'given',size:16,anchor:'middle'})","NOVA.chalkText(ce,mid[0],mid[1]+5,String(z+1),{role:'given',size:%s?18:16,anchor:'middle'})"%P),
       ("total(st.grid)+' cubes',{size:18,","total(st.grid)+' cubes',{size:%s?19:18,"%P)]
# Live accessible name: a cube added from the keyboard or pointer redrew the model but left the drawing's aria-label/title
# saying the old cube count; draw() now refreshes them (the full render text, so a layout redraw gives identical markup).
EDITS.append(("function draw(){root.replaceChildren();pj=projection(W,H,st.grid);","function draw(){var _al='Isometric dot paper and a model built from '+total(st.grid)+' unit cubes. Exposed faces and three axes at thirty degree diagonals.';sv.setAttribute('aria-label',_al);var _t=sv.querySelector('title');if(_t)_t.textContent=_al;root.replaceChildren();pj=projection(W,H,st.grid);"))
