# F15-14 phone typography: the Challenge card's second line and the two working-panel lines are the only SVG labels at 390 px; lift them from 17/16 to 19 viewBox
# units on the phone layout (about 11.1 px in the 258 px phone drawing). Desktop sizes are unchanged.
EDITS=[("tt(g,x+w/2,y+(mob?59:77),'Work out the unknown','given',mob?18:20)","tt(g,x+w/2,y+(mob?59:77),'Work out the unknown','given',mob?19:20)"),
 ("tt(g,x+w/2,y+(mob?24:52),line1,'given',mob?17:20)","tt(g,x+w/2,y+(mob?24:52),line1,'given',mob?19:20)"),
 ("tt(g,x+w/2,y+(mob?47:112),line2,'focus',mob?16:20)","tt(g,x+w/2,y+(mob?47:112),line2,'focus',mob?19:20)")]
