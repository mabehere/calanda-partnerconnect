import {useLayoutEffect,useMemo,useRef} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Group,Vector3,Mesh,TorusGeometry,CanvasTexture,SRGBColorSpace} from 'three';
import {Character,SoftStove,Round,Envelope,Ground,StudioLights} from '../../video/v4/SoftWorld';
import {ADVISOR,DESK,TABLET} from '../../video/v4/layout';
import {ease,armAngles} from '../../video/v4/timing';
import {steps,type Story} from './engine';
import type {RefObject} from 'react';

type Props={story:Story; clock:RefObject<number>; eco:boolean; pick:(id:0|1)=>void; fallback:React.ReactNode};
const centers=[-4,4];
function Plaque({label,width=1.9}:{label:string;width?:number}){
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=144;
    const ctx=canvas.getContext('2d')!;
    ctx.fillStyle='#fff4de';ctx.fillRect(0,0,768,144);
    ctx.font='bold 52px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#31574d';ctx.fillText(label,384,72,735);
    const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return map;
  },[label]);
  useLayoutEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh><planeGeometry args={[width,width*144/768]}/><meshBasicMaterial map={texture}/></mesh>
}function Room({office}:{office:boolean}){
  return <>
    <Round at={[0,.01,-.2]} size={[7.2,.1,4.3]} color={office?'#d0dccb':'#d8c3a2'}/>
    <Round at={[0,1.24,-2.18]} size={[7.1,2.5,.18]} color={office?'#b1c7b7':'#decfb6'}/>
    <Round at={[-3.47,.55,-1.32]} size={[.17,1.1,1.85]} color={office?'#b1c7b7':'#decfb6'}/>
    {office?<><group position={ADVISOR.position} rotation-y={ADVISOR.yaw}><Character advisor/></group>
      <Round at={DESK.position} size={DESK.size} color="#d7ba96"/>
      {[.45,2.25].map(x=><Round key={x} at={[x,.46,1.05]} size={[.14,.84,.56]} color="#759386"/>)}
      <Round at={[1.15,1.31,.89]} size={[.88,.58,.09]} color="#47665b"/>
      <Round at={[1.15,1.33,.95]} size={[.76,.43,.035]} color="#cfdfce"/>
      <Round at={[1.15,1,.89]} size={[.4,.12,.22]} color="#47665b"/>
      <Round at={TABLET.position} size={TABLET.size} color="#57796a"/>
    </>:<><Round at={[.65,.15,-.35]} size={[2.2,.2,1.7]} color="#bdcbb8"/>
      <group position={[.65,.25,-.35]}><SoftStove/></group>
      <Round at={[2.35,.65,.15]} size={[.18,1.25,.25]} color="#b19a78"/>
      <Round at={[2.35,1.38,.15]} size={[1.1,.67,.12]} color="#57766a"/>
    </>}
  </>;
}
function Scene({story,clock,pick}:{story:Story;clock:RefObject<number>;pick:Props['pick']}){
  const {camera,invalidate,size}=useThree();
  const actor=useRef<Group>(null),packet=useRef<Group>(null),receipt=useRef<Group>(null);
  const start=useRef(new Vector3(0,8,15)),startTarget=useRef(new Vector3()),target=useRef(new Vector3());
  const step=steps[story.view], overview=story.mode==='explore',cx=centers[step.station];
  useLayoutEffect(()=>{
    start.current.copy(camera.position);
    camera.getWorldDirection(startTarget.current).multiplyScalar(8).add(camera.position);
    actor.current?.traverse(o=>{
      if(o instanceof Mesh && o.geometry instanceof TorusGeometry) o.scale.y=step.soll?1:.18;
    });
    invalidate();
  },[story.generation,camera,invalidate,step.soll]);
  useFrame(()=>{
    const t=clock.current, move=ease(t/1.05), flow=ease((t-.85)/1.55);
    if(!overview){
      const distance=Math.max(8.3,11.4/(size.width/size.height));
      camera.position.set(cx+2.2,3.65,distance).lerp(start.current,1-move);
      target.current.set(cx,1.22,0).lerp(startTarget.current,1-move);
      camera.lookAt(target.current);
    }
    if(receipt.current) receipt.current.visible=step.soll&&flow>=.99;
    if(packet.current){
      packet.current.visible=t>.8 && !(step.station===1&&step.soll&&flow>=.99);
      const x=step.station===0?2.35:-1.65+(step.soll?3.1:1.15)*flow;
      packet.current.position.set(x,step.station===0?1.38:1.54+.27*Math.sin(flow*Math.PI),step.station===0?.32:.56);
      packet.current.scale.setScalar(step.station===0?.75:.63);
    }
    const marco=actor.current?.getObjectByName('copper-marco');
    if(marco){
      const arm=marco.children.find(o=>o.position.x===-.34);
      if(arm){const pose=armAngles(-1,'point',t);arm.rotation.set(...pose.shoulder);arm.children[1]?.rotation.set(...pose.elbow)}
      marco.rotation.y=(step.station===0?1.18:.65)*ease(t/.8);
    }
  });
  return <>
    <StudioLights/><Ground/>
    <Round at={[0,-.008,0]} size={[4,.05,.58]} color="#bc9e7b"/>
    {([0,1] as const).map(id=><group key={id} visible={overview||id===step.station} position-x={centers[id]} onClick={e=>{if(overview&&e.delta<5){e.stopPropagation();pick(id)}}}>
      <Room office={id===1}/>
      <group position={[id===0?-1.68:0,2.12,-2.07]}><Plaque label={id===0?'CALEIRA · SHOWROOM':'PARTNERBETREUUNG'} width={2.5}/></group>
      {id===step.station&&<>
        <group ref={actor} position={[-1.66,.025,.28]}><Character/></group>
        {id===1&&<group ref={receipt} position={[1.15,1.33,.976]}><Plaque label="✓ Zugeordnet" width={.75}/></group>}
        <group ref={packet}>{id===1?<Envelope/>:<Plaque label={step.soll?'DE  /  IT  /  FR':'Eine Sprache'} width={1.55}/>}</group>
      </>}
      
    </group>)}
    {overview&&<OrbitControls makeDefault target={[0,.65,0]} enablePan={false} minDistance={9} maxDistance={24} maxPolarAngle={1.4}/>}
  </>;
}
function FramePump({clock,story}:{clock:RefObject<number>;story:Story}){
 const {invalidate,camera}=useThree();
 useLayoutEffect(()=>{
   if(story.mode==='explore')camera.position.set(1,8,17);
   invalidate();
   window.addEventListener('caleira:frame',invalidateFrame);
   function invalidateFrame(){invalidate()}
   return ()=>window.removeEventListener('caleira:frame',invalidateFrame);
 },[clock,story,camera,invalidate]);return null;
}
export default function Stage({story,clock,eco,pick,fallback}:Props){
 return <Canvas frameloop="demand" fallback={fallback} shadows={!eco} dpr={eco?1:[1,1.35]} camera={{position:[0,8,15],fov:36}} gl={{antialias:true,preserveDrawingBuffer:true}}>
  <color attach="background" args={['#eae5d8']}/><Scene story={story} clock={clock} pick={pick}/><FramePump clock={clock} story={story}/>
 </Canvas>;
}
