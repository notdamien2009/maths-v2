# F13-10: the strip tile is labelled "area ÷ π" and a full render shows 4r² (e.g. 16), but the live update after a radius change
# wrote "16π" into it (area ÷ π shown with a π). The live update now writes the same value as the full render.
EDITS=[("v=[String(s.r),String(2*s.r),String(4*s.r*s.r)+'π']","v=[String(s.r),String(2*s.r),String(4*s.r*s.r)]")]
