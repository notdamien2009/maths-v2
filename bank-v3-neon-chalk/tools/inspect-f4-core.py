#!/usr/bin/env python3
"""READ-ONLY NOVA F4 core compatibility report. No repository or other files modified."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]
OLD_SHA256={
    "nova-core.js":"1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21",
    "nova-core.css":"eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4",
}
GIT_AT_48A7EB7={
    "nova-core.js":"ac0b40a0bf19246ec3a9824798bd67dfe738c91c",
    "nova-core.css":"1830cd68b3a345cbeefae69782bf2b309765d5fa",
}
for filename in ("nova-core.js","nova-core.css"):
    f=ROOT/"core"/filename
    if not f.exists():
        print(filename+": MISSING. Merge this repair into the existing bank, not an empty folder.")
        continue
    b=f.read_bytes();sha256=hashlib.sha256(b).hexdigest()
    blob=hashlib.sha1(f"blob {len(b)}\0".encode()+b).hexdigest()
    if sha256==OLD_SHA256[filename]:
        message="OLDER F4 BUILD CORE (supported by original F4 builder; NOT latest Git core)"
    elif blob==GIT_AT_48A7EB7[filename]:
        message="GITHUB CORE at commit 48a7eb7 (existing old-F4 builder pins need migration)"
    else:
        message="UNRECOGNISED version: verify against your newest Git push before rebuilding"
    print(f"{filename}: {message}; bytes={len(b)} SHA256={sha256} GitBlob={blob}")
print("READ ONLY: this script does not approve migration, edit code or weaken integrity checks.")
