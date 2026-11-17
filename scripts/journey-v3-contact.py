from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import sys
root=Path(sys.argv[1]); files=sorted(root.glob('*.png'))
out=Image.new('RGB',(1440,((len(files)+2)//3)*294),'#17241d');draw=ImageDraw.Draw(out)
for i,path in enumerate(files):
    out.paste(ImageOps.contain(Image.open(path),(480,270)),((i%3)*480,(i//3)*294))
    draw.text(((i%3)*480+10,(i//3)*294+273),path.stem,fill='white')
out.save(root/'contact.jpg')
