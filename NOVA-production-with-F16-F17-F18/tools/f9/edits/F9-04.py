# F9-04 phone layout: the core plot frame writes its tick labels at 10 units; at the phone width this engine enlarges its own plot's tick labels to the 19-unit floor (core untouched).
EDITS=[("""yLabel:null,grid:true});""","""yLabel:null,grid:true});if(small())P.g.querySelectorAll('text').forEach(t=>{t.style.setProperty('font-size','19px','important');});""")]
