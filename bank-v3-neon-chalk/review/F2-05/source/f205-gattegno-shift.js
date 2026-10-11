  /* Keep original Gattegno tile artwork; make each ×/÷ 10 move visibly explain itself. */
  self.shift=function(k,done){
    var ps=RW.filter(function(p){return get(st.g,p);});
    if(self.dead||!ps.length||ps.some(function(p){return RW.indexOf(p+k)<0;})){
      if(o.onError)o.onError('The selected tiles cannot move '+(k>0?'up':'down')+': one would leave the chart.');if(done)done(false);return;
    }
    if(o.onBefore)o.onBefore('shift',k);
    var before=totalG(st.g),L=S.el('g',{'data-f205-shift':'1'},sv),els=[];
    ps.forEach(function(p){var t=sv.querySelector('[data-t="'+p+'_'+st.g[p]+'"]');if(t)t.style.opacity='.14';});
    ps.forEach(function(p){var d=st.g[p],x=tx(d),y=ty(p),y2=ty(p+k),g=S.el('g',{},L);
      NOVA.neonBox(g,x,y,GW,GH,{role:'#ffcc58',r:7});
      var lab=NOVA.chalkText(g,x+GW/2,y+21,tv(p,d),{size:15,anchor:'middle',role:'focus'});lab.style.fontFamily='var(--nova-font-chalk-write)';
      els.push({g:g,dy:y2-y});M.trail(sv,'M'+(x+GW/2)+','+(y+15)+' L'+(x+GW/2)+','+(y2+15),PC(p+k),950);
    });
    phaseBadge(sv,0,k>0?'× 10 · UP ONE ROW':'÷ 10 · DOWN ONE ROW');
    if(o.onPhase)o.onPhase('shift',k,'start','Every selected tile moves '+(k>0?'up':'down')+' one row. Each selected contribution becomes '+(k>0?'ten times':'one tenth of')+' its old value.');
    paced(1000,function(e){if(self.dead)return;els.forEach(function(q){q.g.setAttribute('transform','translate(0,'+(q.dy*e).toFixed(1)+')');});},M.ease.inOut,function(){
      if(self.dead)return;var n={};ps.forEach(function(p){n[p+k]=st.g[p];});st.g=n;changed();
      phaseBadge(sv,0,fmt(before)+'  →  '+fmt(totalG(st.g)));
      if(o.onPhase)o.onPhase('shift',k,'complete',fmt(before)+(k>0?' × 10 = ':' ÷ 10 = ')+fmt(totalG(st.g))+'. The digits represent new places.');
      if(done)done(true);
    });
  };
