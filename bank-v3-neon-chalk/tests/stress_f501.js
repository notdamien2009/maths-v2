/* F5-01 independent stress probes. Driven by tests/run_f501_qa.py at 380/1280. */
window.F501Stress={
 state:function(){return {explore:NOVA_F5_01_CONFIG._explore&&NOVA_F5_01_CONFIG._explore.get(),challenge:NOVA_F5_01_CONFIG._challenge&&NOVA_F5_01_CONFIG._challenge.get()};},
 stranded:function(){var bad=[];document.querySelectorAll('#F5-01 [data-drag]').forEach(function(e){if(e.hasAttribute('transform')||e.classList.contains('nv-drag-lift')||e.style.opacity==='0')bad.push(e.getAttribute('data-piece')||'?');});if(document.querySelector('#F5-01 .nv-drop-hl'))bad.push('highlight');if(NOVA.ui._drag)bad.push('active drag');return bad;},
 coords:function(x,y){var svg=document.querySelector('#F5-01 svg.fw-svg'),p=svg.createSVGPoint();p.x=x;p.y=y;var q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y};},
 tray:function(){var mobile=innerWidth<=820,rows=mobile?6:12,y=(mobile?64:72)+rows*(mobile?54:42)+(mobile?28:21);return this.coords(mobile?175:500,y+(mobile?83:90)+172+24);},
 rail:function(name){var svg=document.querySelector('#F5-01 svg.fw-svg'),mobile=innerWidth<=820,rows=mobile?6:12,y=(mobile?64:72)+rows*(mobile?54:42)+(mobile?28:21);return this.coords(mobile?207:548,y+50+(name==='b'?(mobile?83:90):0)+30);}
};
