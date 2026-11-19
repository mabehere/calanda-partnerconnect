import {useEffect,useMemo} from 'react';
import {CanvasTexture,SRGBColorSpace} from 'three';

export default function Plaque({label,width=1.9,tone='neutral'}:{label:string;width?:number;tone?:'neutral'|'positive'|'waiting'}){
 const texture=useMemo(()=>{
   const canvas=document.createElement('canvas');
   canvas.width=768;
   canvas.height=144;
   const ctx=canvas.getContext('2d')!;
   ctx.fillStyle=tone==='positive'?'#365a4c':tone==='waiting'?'#f2dbc0':'#fff4de';
   ctx.fillRect(0,0,768,144);
   ctx.font='bold 68px Arial';
   ctx.textAlign='center';
   ctx.textBaseline='middle';
   ctx.fillStyle=tone==='positive'?'#fff6df':'#24453b';
   ctx.fillText(label,384,74,705);
   const map=new CanvasTexture(canvas);
   map.colorSpace=SRGBColorSpace;
   return map;
 },[label,tone]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh><planeGeometry args={[width,width*144/768]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
