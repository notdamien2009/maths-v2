# F9-02 phone layout: larger value rings at the phone width so the 19-unit term values fit inside them.
EDITS=[("""function node(svg,x,y,val,role='given',r=16){""","""function node(svg,x,y,val,role='given',r=16){if(isSmall())r=Math.max(r,24);""")]
EDITS.append(("""{role,label:label||null,height:sm?54:64});""","""{role,label:sm?null:(label||null),height:sm?54:64});if(sm&&label)N.svg.pill(svg,(xs[i]+xs[i+1])/2,hop.peak-4,label,{role,size:20});"""))
