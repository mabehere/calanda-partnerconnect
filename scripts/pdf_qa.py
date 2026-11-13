from pathlib import Path
from PIL import Image,ImageDraw
import pdfplumber
root=Path(__file__).resolve().parent.parent/'output/pdf'
for name,prefix in [('calanda-pitch.pdf','pitch'),('calanda-demo-backup.pdf','backup')]:
    with pdfplumber.open(root/name) as pdf:
        issues=[]
        for i,page in enumerate(pdf.pages):
            for word in page.extract_words():
                if word['x0']<20 or word['x1']>940 or word['top']<10 or word['bottom']>530:
                    issues.append((i+1,word['text'],word['x0'],word['top']))
        print(name,'out-of-page text:',issues)
    paths=sorted(root.glob(prefix+'-*.png'))
    sheet=Image.new('RGB',(1200,((len(paths)+3)//4)*190),'#132015');d=ImageDraw.Draw(sheet)
    for i,p in enumerate(paths):
        im=Image.open(p);im.thumbnail((292,165));x=i%4*300;y=i//4*190;sheet.paste(im,(x,y));d.text((x+5,y+168),p.stem,fill='#d0ae81')
    sheet.save(root/(prefix+'-contact.jpg'))
