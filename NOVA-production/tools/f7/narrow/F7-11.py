# F7-11 phone layout: the bar board is cropped to its working area (810 units) and chalk labels are enlarged x1.14,
# capped so every label still fits inside the cropped width. Desktop drawing unchanged.
EDITS=[
("""function chalk(p,x,y,s,size=47,role='given'){return N.chalkText(p,x,y,String(s),{size,role});}""",
"""const PHONE=()=>window.matchMedia('(max-width:720px)').matches;
function chalk(p,x,y,s,size=47,role='given'){if(PHONE()){size=Math.round(size*1.14);const t=String(s),room=x===500?780:Math.min(2*(x-100),2*(900-x))-12,est=t.length*size*.54;if(est>room)size=Math.max(30,Math.floor(room/(t.length*.54)));}return N.chalkText(p,x,y,String(s),{size,role});}"""),
("""svg.classList.add('f408-svg');svg.dataset.count""","""svg.classList.add('f408-svg');if(PHONE())svg.setAttribute('viewBox','95 0 810 '+g.H);svg.dataset.count"""),
]
