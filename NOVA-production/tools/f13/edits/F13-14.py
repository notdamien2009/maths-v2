# F13-14 Challenge: the strip was first drawn with the area and volume factors (k², k³) visible even when the question masks
# them (s.masked); only the next live refresh replaced them with "?". The first render now honours s.masked as well.
EDITS=[("['AREA ×',fmt(s.k*s.k),'focus'],['VOL ×',fmt(s.k*s.k*s.k),'op']","['AREA ×',s.masked?'?':fmt(s.k*s.k),'focus'],['VOL ×',s.masked?'?':fmt(s.k*s.k*s.k),'op']")]
