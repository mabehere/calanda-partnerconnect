from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
from pypdf import PdfReader
import json
root=Path(__file__).resolve().parent.parent
checks=[]
with ZipFile(root/'output/creative-baseline/source.zip') as baseline:
    for name in ['caleira-pitch.pdf','caleira-demo-backup.pdf']:
        original=PdfReader(BytesIO(baseline.read('public/downloads/'+name)))
        current=PdfReader(root/'public/downloads'/name)
        # Ignore only font-dependent wrapping; preserve every word and number.
        text=lambda pages:[' '.join(p.extract_text().split()) for p in pages]
        checks.append(dict(file=name,pages=len(current.pages),content_unchanged=text(original.pages)==text(current.pages)))
(root/'output/creative-pdf-check.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
print(checks)
assert all(c['content_unchanged'] for c in checks)
