  /* Premium exchange. Original glass bead() and neon rods remain unchanged. */
  self.exchange=function(p,done){
    if(self.dead||busy||p>=2||get(st.c,p)<10){if(o.onError)o.onError('You need ten beads on the '+placeName(p)+' rod before exchanging.',p);if(done)done(false);return;}
    busy=true;if(o.onBefore)o.onBefore('exchange',p);
    var before=totalA(st.c),x=rx(p),tx=rx(p+1),mid=by(4.5),n2=get(st.c,p+1),ty=by(n2),L=S.el('g',{'data-f205-exchange':'1'},sv),els=[];
    var originals=[].slice.call(sv.querySelectorAll('[data-rod="'+p+'"] [data-bead]')).slice(0,10);
    originals.forEach(function(b){b.style.opacity='0';});
    for(var i=0;i<10;i++)els.push({g:bead(L,x,by(i),p),y:by(i)});
    function phase(name,words){phaseBadge(sv,p,name);if(o.onPhase)o.onPhase('exchange',p,name,words);}
    phase('1 · COUNT TEN', 'Count ten beads on the '+placeName(p)+' rod. They are worth '+fmt(before)+ ' altogether with the other rods.');
    paced(620,function(e){if(self.dead)return;els.forEach(function(q){q.g.setAttribute('transform','translate(0,'+((mid-q.y)*e-20*Math.sin(e*Math.PI)).toFixed(1)+')');});},M.ease.inOut,function(){
      if(self.dead)return;phase('2 · 10 = 1', 'Ten beads × '+valueAt(p)+' = one bead × '+valueAt(p+1)+'. The amount stays '+fmt(before)+'.');
      phaseBadge(sv,p,'10  →  1');M.flash(sv,x,mid,PC(p),32);
      hold(EDU.speed===2?430:690,function(){if(self.dead)return;
        L.innerHTML='';var nb=bead(L,x,mid,p+1);M.trail(sv,'M'+x+','+mid+' Q'+((x+tx)/2)+','+(TOP-26)+' '+tx+','+ty,PC(p+1),950);
        phase('3 · MOVE TO NEXT ROD','Place the new bead on the '+placeName(p+1)+' rod. '+mathExchange(p)+'.');
        paced(950,function(e){if(self.dead)return;var yy=mid+(ty-mid)*e-72*Math.sin(e*Math.PI);nb.setAttribute('transform','translate('+((tx-x)*e).toFixed(1)+','+(yy-mid).toFixed(1)+')');},M.ease.inOut,function(){
          if(self.dead)return;st.c[p]-=10;st.c[p+1]=n2+1;busy=false;draw();
          phaseBadge(sv,p,'SAME VALUE · '+fmt(before));M.flash(sv,tx,ty,PC(p+1),30);
          if(o.onChange)o.onChange(st);if(o.onPhase)o.onPhase('exchange',p,'complete','We now have one more bead on '+placeName(p+1)+'. The value remains '+fmt(totalA(st.c))+'.');
          NOVA.events.emit('value',{engine:'F2-05',control:'exchange',value:{from:p,to:p+1,total:totalA(st.c)}});
          if(done)done(true);if(C.autoExchange){var hot=RD.filter(function(q){return q<2&&get(st.c,q)>=10;});if(hot.length)hold(540,function(){if(!self.dead&&!busy)self.exchange(hot[0]);});}
        });
      });
    });
  };
  self.breakOne=function(p,done){
    if(self.dead||busy||p<=-2||!get(st.c,p)||get(st.c,p-1)+10>12){if(o.onError)o.onError('To break a bead, the next rod must have room for ten. Try a different rod or remove some beads.',p);if(done)done(false);return;}
    busy=true;if(o.onBefore)o.onBefore('break',p);
    var before=totalA(st.c),n=get(st.c,p),x=rx(p),y=by(n-1),tx=rx(p-1),base=get(st.c,p-1),L=S.el('g',{'data-f205-break':'1'},sv);
    var top=sv.querySelectorAll('[data-rod="'+p+'"] [data-bead]')[n-1];if(top)top.style.opacity='0';var b=bead(L,x,y,p);
    phaseBadge(sv,p,'1 · 10');if(o.onPhase)o.onPhase('break',p,'start','One bead on '+placeName(p)+' has the same value as ten beads on '+placeName(p-1)+'.');
    paced(820,function(e){if(self.dead)return;b.setAttribute('transform','translate('+((tx-x)*e).toFixed(1)+','+((TOP+22-y)*e-64*Math.sin(e*Math.PI)).toFixed(1)+')');},M.ease.inOut,function(){
      if(self.dead)return;L.innerHTML='';M.flash(sv,tx,TOP+22,PC(p-1),35);
      phaseBadge(sv,p,'SPREAD TEN');if(o.onPhase)o.onPhase('break',p,'spread',mathBreak(p)+'. Watch the ten smaller beads appear.');
      var els=[];for(var i=0;i<10;i++)els.push({g:bead(L,tx,TOP+22,p-1),to:by(base+i),delay:i*47});
      paced(1100,function(e,q){if(self.dead)return;els.forEach(function(a){var k=Math.max(0,Math.min(1,(q*1100-a.delay)/530));a.g.setAttribute('transform','translate(0,'+((a.to-TOP-22)*M.ease.spring(k)).toFixed(1)+')');});},function(x){return x;},function(){
        if(self.dead)return;st.c[p]=n-1;st.c[p-1]=base+10;busy=false;draw();phaseBadge(sv,p,'SAME VALUE · '+fmt(before));
        if(o.onChange)o.onChange(st);if(o.onPhase)o.onPhase('break',p,'complete','Ten smaller beads replace the larger bead. We still have '+fmt(totalA(st.c))+'.');
        NOVA.events.emit('value',{engine:'F2-05',control:'break',value:{from:p,to:p-1,total:totalA(st.c)}});if(done)done(true);
      });
    });
  };
  self.resetRod=function(p){if(self.dead||busy||!get(st.c,p))return false;if(o.onBefore)o.onBefore('reset rod',p);st.c[p]=0;changed(null);return true;};
  self.busy=function(){return busy;};
