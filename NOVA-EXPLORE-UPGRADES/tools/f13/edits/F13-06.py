# F13-06 Explore: the cross-section preset select grew to its longest option and pushed the 390 page 24px wide; cap it at the row width.
EDITS=[("var select=h('select',{class:'nova-input','aria-label':'Choose prism cross-section'});","var select=h('select',{class:'nova-input','aria-label':'Choose prism cross-section',style:'max-width:100%'});")]
EDITS.append(("pRow(panel,[h('label',{},['CROSS-SECTION ',select])]);","pRow(panel,[h('label',{style:'min-width:0;max-width:100%'},['CROSS-SECTION ',select])]);"))
