# Phone typography (see F13-03): direct core chalk-text calls for the axis names and cube level numbers.
P="(window.innerWidth<=580)"
EDITS=[("{role:a[2],size:16})","{role:a[2],size:%s?19:16})"%P),
       ("NOVA.chalkText(ce,mid[0],mid[1]+5,String(z+1),{role:'given',size:16,anchor:'middle'})","NOVA.chalkText(ce,mid[0],mid[1]+5,String(z+1),{role:'given',size:%s?18:16,anchor:'middle'})"%P)]
