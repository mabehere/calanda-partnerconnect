from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
import sys
root=Path('output')/('creative-'+(sys.argv[1] if len(sys.argv)>1 else 'baseline'))
for group,pattern in [('scenes','scene-*-1920.png'),('journey','journey-*-after-1920.png'),('film','film-*.png')]:
    files=sorted(root.glob(pattern))
    out=Image.new('RGB',(1440,((len(files)+2)//3)*290),'#202520')
    d=ImageDraw.Draw(out)
    for i,f in enumerate(files):
        out.paste(ImageOps.contain(Image.open(f),(480,270)),((i%3)*480,(i//3)*290))
        d.text(((i%3)*480+10,(i//3)*290+270),f.stem,fill='white')
    out.save(root/(group+'-contact.jpg'))
