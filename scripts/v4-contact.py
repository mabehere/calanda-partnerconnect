from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
OUT=Path('output/caleira-v4-pilot')
font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',24)
def sheet(files,title,name,cols=4,cell=(360,330)):
    w,h=cell; rows=(len(files)+cols-1)//cols
    im=Image.new('RGB',(cols*w,rows*h+65),'#eee9dc');d=ImageDraw.Draw(im);d.text((24,18),title,fill='#24413b',font=font)
    for i,p in enumerate(files):
        tile=Image.open(p).convert('RGB');tile.thumbnail((w,h-30));x=(i%cols)*w+(w-tile.width)//2;y=(i//cols)*h+65
        im.paste(tile,(x,y));d.text(((i%cols)*w+12,y+h-32),p.stem,fill='#31574d',font=font)
    im.save(OUT/name)
for kind in ['legacy-advisor','legacy-worker','legacy-marco','legacy-truck','marco','advisor','stove','van']:
    sheet([OUT/f'audit/views/{kind}-{f}.png' for f in [0,30,60,90]],f'{kind} · vier Perspektiven',f'audit/{kind}-contact.jpg')
sheet([OUT/f'audit/views/{k}-{f}.png' for k in ['marco','advisor'] for f in [0,30,60,90]],'V4 · Charakterdesign · Marco / Beratung','character-contact.jpg')
sheet([OUT/f'audit/views/{k}-{f}.png' for k in ['legacy-advisor','legacy-worker','legacy-marco','legacy-truck'] for f in [0,30,60,90]],'V3 · unveränderte GLBs · nur Audit, nicht im Pilot','audit/legacy-contact.jpg')
if (OUT/'stills/pilot-402.png').exists():
    sheet([OUT/f'stills/pilot-{f}.png' for f in [24,66,145,201,291,402]],'V4 · Drei Momente pro Kapitel','pilot-contact.jpg',3,(640,390))
if (OUT/'stills/v3-420.png').exists():
    sheet([OUT/'stills/v3-60.png',OUT/'stills/pilot-66.png',OUT/'stills/v3-420.png',OUT/'stills/pilot-402.png'],'Links: V3-Quellcode · Rechts: V4-Pilot','comparison.jpg',2,(960,570))
for tag in ['pilot','vehicle']:
    files=sorted((OUT/'qa/frames').glob(f'{tag}-*.png'))
    if files: sheet(files,f'{tag} · aus MP4 dekodiert · Abstand 0,5 s',f'qa/{tag}-sequence.jpg',4,(480,300))
if (OUT/'qa/rendered-audio.wav').exists():
    import numpy as np, wave, json
    with wave.open(str(OUT/'qa/rendered-audio.wav'),'rb') as wav:
        sr=wav.getframerate();audio=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2')/32768
    peak=float(np.max(np.abs(audio)))
    (OUT/'qa/encoded-audio-check.json').write_text(json.dumps({'sampleRate':sr,'seconds':len(audio)/sr,'samplePeak':peak,'samplePeakDbFS':float(20*np.log10(peak)),'clippedSamples':int(np.sum(np.abs(audio)>=1))},indent=2))
