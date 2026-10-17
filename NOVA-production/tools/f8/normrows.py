import json,ast
def conv(v):
    if not isinstance(v,str):return v
    try:return json.loads(v)
    except Exception:pass
    return ast.literal_eval(v.replace('null','None').replace('true','True').replace('false','False'))
def norm(rows):
    for r in rows:
        for k in ['tables','draws','exploreFields','nativeFieldsByStep','models']:
            if k in r:r[k]=conv(r[k])
    return rows
if __name__=='__main__':
    import sys;p=sys.argv[1];rows=norm(json.load(open(p)));json.dump(rows,open(p,'w'),indent=2,ensure_ascii=False)
    for r in rows:print(r['id'],{k:type(r[k]).__name__ for k in ['tables','draws','exploreFields','nativeFieldsByStep']},len(r['nativeFieldsByStep']))
