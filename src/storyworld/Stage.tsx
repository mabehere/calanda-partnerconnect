import {useLayoutEffect,useRef} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Group,Vector3,Mesh,TorusGeometry,DirectionalLight} from 'three';
import {Character,SoftStove,Round,Envelope,Ground,StudioLights} from '../../video/v4/SoftWorld';
import {ADVISOR,DESK,TABLET} from '../../video/v4/layout';
import {ease,armAngles} from '../../video/v4/timing';
import {MOOD} from '../components/Journey';
import {steps,stations,stationIds,stationOf,visitCount,type Station,type Story} from './engine';
import StationProps from './StationProps';
import Plaque from './Plaque';
import type {RefObject,ReactNode} from 'react';

type Props={story:Story;clock:RefObject<number>;eco:boolean;pick:(id:Station)=>void;fallback:ReactNode;contextLost:()=>void};
const centers:readonly [number,number][]=[[-8,-3.3],[0,-3.3],[8,-3.3],[8,3.3],[0,3.3],[-8,3.3]];
const roomFloors=['#d8c3a2','#d0dccb','#e1cfac','#c7d4c6','#d8c2a8','#d1d8c1'];
const roomWalls=['#decfb6','#b1c7b7','#ddc5a0','#b8c8b7','#d5baa2','#becab4'];
function Room({station}:{station:Station}){
  const office=station===1;
  return <>
    <Round at={[0,.01,-.2]} size={[7.2,.1,4.3]} color={roomFloors[station]}/>
    <Round at={[0,1.24,-2.18]} size={[7.1,2.5,.18]} color={roomWalls[station]}/>
    <Round at={[-3.47,.55,-1.32]} size={[.17,1.1,1.85]} color={office?'#b1c7b7':'#decfb6'}/>
    {office?<><group position={ADVISOR.position} rotation-y={ADVISOR.yaw}><Character advisor/></group>
      <Round at={DESK.position} size={DESK.size} color="#d7ba96"/>
      {[.45,2.25].map(x=><Round key={x} at={[x,.46,1.05]} size={[.14,.84,.56]} color="#759386"/>)}
      <Round at={[1.15,1.31,.89]} size={[.88,.58,.09]} color="#47665b"/>
      <Round at={[1.15,1.33,.95]} size={[.76,.43,.035]} color="#cfdfce"/>
      <Round at={[1.15,1,.89]} size={[.4,.12,.22]} color="#47665b"/>
      <Round at={TABLET.position} size={TABLET.size} color="#57796a"/>
    </>:station===0?<><Round at={[.65,.15,-.35]} size={[2.2,.2,1.7]} color="#bdcbb8"/>
      <group position={[.65,.25,-.35]}><SoftStove/></group>
      <Round at={[2.35,.65,.15]} size={[.18,1.25,.25]} color="#b19a78"/>
      <Round at={[2.35,1.38,.15]} size={[1.1,.67,.12]} color="#57766a"/>
    </>:null}
  </>;
}

function Route({soll,through}:{soll:boolean;through:number}){
 return <group>{centers.slice(0,-1).map(([x,z],i)=>{
   const [toX,toZ]=centers[i+1], horizontal=z===toZ;
   const completed=i+1<through;
   return <Round key={i} at={[(x+toX)/2,-.006,(z+toZ)/2]}
    size={[horizontal?1.35:.42,.052,horizontal?.42:2.52]}
    color={soll&&completed?'#648f77':'#bd9b77'}/>;
 })}</group>;
}
const connections = [
 {sector:'CRM' as const, origin:[-2.6,.23], stations:[1,4,5]},
 {sector:'ERP' as const, origin:[3.2,.23], stations:[2,3]},
];
function SystemLines(){
 return <>{connections.flatMap(({origin,stations,sector})=>stations.map(id=>{
   const [x,z]=centers[id], dx=x-origin[0],dz=z-origin[1];
   return <group key={id} position={[(x+origin[0])/2,.066,(z+origin[1])/2]} rotation-y={-Math.atan2(dz,dx)}>
     <Round size={[Math.hypot(dx,dz),.04,.1]} radius={.015} color={sector==='CRM'?'#598e78':'#b67b4e'}/>
   </group>;
 }))}</>;
}
const summary=['Sprachzugang','Zuständigkeit','ERP-Übergabe','ERP-Status','Servicefall','Partnerhistorie'];
const friction=['Fremdsprache','Antwort offen','Manuelle Eingabe','Kein Einblick','Foto fehlt','Verteilt'];
function Scene({story,clock,pick}:{story:Story;clock:RefObject<number>;pick:Props['pick']}){
 const {camera,invalidate,size,scene}=useThree();
 const actor=useRef<Group>(null),packet=useRef<Group>(null),receipt=useRef<Group>(null);
 const previous=useRef(new Vector3(0,8,15)),startTarget=useRef(new Vector3()),target=useRef(new Vector3());
 const network=useRef<Group>(null);
 const step=steps[story.view],selected=stationOf(step);
 const orbit=story.mode==='explore',reveal=step.kind!=='visit',overview=orbit||reveal;
 const [cx,cz]=centers[selected];
 const mood=MOOD[step.soll?'next':'today'][selected];
 // The key light follows the camera focus. The same V4 environment supplies the ambient fill.
 useLayoutEffect(()=>{
   const light=scene.children.find(o=>o instanceof DirectionalLight&&o.castShadow) as DirectionalLight|undefined;
   if(!light)return;
   scene.add(light.target);
   light.target.position.set(overview?0:cx,0,overview?0:cz);
   light.position.set((overview?0:cx)-4,8,(overview?0:cz)+5);
   const span=overview?16:8;
   Object.assign(light.shadow.camera,{left:-span,right:span,top:span,bottom:-span});
   light.shadow.camera.updateProjectionMatrix();
   return()=>{scene.remove(light.target)};
 },[scene,cx,cz,overview]);
 useLayoutEffect(()=>{
   previous.current.copy(camera.position);
   camera.getWorldDirection(startTarget.current).multiplyScalar(8).add(camera.position);
   actor.current?.traverse(o=>{
     if(o instanceof Mesh&&o.geometry instanceof TorusGeometry){
       o.scale.y=.18+.82*Math.abs(mood-.45);
       o.rotation.z=mood<.32?0:Math.PI;
     }
   });
   invalidate();
 },[story.generation,camera,invalidate,mood]);
 useFrame(()=>{
   const t=clock.current,move=ease(t/1.13),flow=ease((t-.85)/1.55);
   if(!orbit){
     const aspect=size.width/size.height;
     if(overview){
       const distance=Math.max(22,35/aspect);
       camera.position.set(6, distance*.76,distance).lerp(previous.current,1-move);
       target.current.set(0,.35,0).lerp(startTarget.current,1-move);
     }else{
       const distance=Math.max(8.3,12.1/aspect);
       camera.position.set(cx+2.15,3.65,cz+distance).lerp(previous.current,1-move);
       target.current.set(cx,1.23,cz).lerp(startTarget.current,1-move);
     }
     camera.lookAt(target.current);
   }
   if(network.current){
     network.current.visible=orbit||t>=1.22;
     network.current.scale.y=orbit?1:.55+.45*ease((t-1.22)/.75);
   }
   if(receipt.current)receipt.current.visible=step.soll&&flow>=.99;
   if(packet.current){
     packet.current.visible=t>.8&&!(selected===1&&step.soll&&flow>=.99);
     const x=selected===0?2.35:-1.65+(step.soll?3.1:1.15)*flow;
     packet.current.position.set(x,selected===0?1.38:1.54+.27*Math.sin(flow*Math.PI),selected===0?.32:.56);
     packet.current.scale.setScalar(selected===0?.75:.63);
   }
   const marco=actor.current?.getObjectByName('copper-marco');
   if(marco){
     const arm=marco.children.find(o=>o.position.x===-.34);
     if(arm){
       const pose=armAngles(-1,'point',t*.96);
       arm.rotation.set(...pose.shoulder);
       arm.children[1]?.rotation.set(...pose.elbow);
     }
     marco.rotation.y=(selected===0?1.18:.58)*ease(t/.8);
     const head=marco.children.find(o=>o.position.y===1.71);
     if(head)head.rotation.x=(.55-mood)*.27*ease(t/.9)+(step.soll?.12*Math.sin(Math.PI*ease((t-2.25)/.83)):0);
   }
 });
 return <>
   <StudioLights/><Ground/>
   {overview&&<Route soll={step.soll} through={orbit?6:visitCount(story.cursor,step.soll)}/>}
   {stationIds.filter(id=>overview||id===selected).map(id=>{
     const active=id===selected&&!reveal;
     const [x,z]=centers[id];
     return <group key={id} position={[x,0,z]} onClick={e=>{if(orbit&&e.delta<5){e.stopPropagation();pick(id)}}}>
       <Room station={id}/>
       <group position={[id===0?-1.68:0,2.14,-2.065]}><Plaque label={overview?String(id+1).padStart(2,'0')+'  '+stations[id]:id===0?'CALEIRA · SHOWROOM':id===1?'PARTNERBETREUUNG':stations[id].toUpperCase()} width={overview?3.35:2.5}/></group>
       {id>=2&&<StationProps station={id} soll={step.soll} clock={clock} active={active}/>}
       {active&&<>
         <group ref={actor} position={[id===3?-2.46:id===2?-2.37:-1.88,.025,id===3?-.65:.42]}><Character/></group>
         {id===1&&<group ref={receipt} position={[1.15,1.33,.976]}><Plaque label="✓ Zugeordnet" width={.75} tone="positive"/></group>}
         {id<=1&&<group ref={packet}>{id===1?<Envelope/>:<Plaque label={step.soll?'DE  /  IT  /  FR':'Eine Sprache'} width={1.55}/>}</group>}
       </>}
     </group>;
   })}
   {overview&&<group ref={network}>
     {centers.map(([x,z],i)=><group key={i} position={[x,.24,z+1.98]}>
       <Plaque label={step.kind==='turn'?friction[i]:summary[i]} width={2.8} tone={step.kind==='turn'?'waiting':'neutral'}/>
     </group>)}
     {reveal&&<>
       <SystemLines/>
       <group position={[-2.6,3.1,.23]}>
         <Round size={[3.8,.76,.34]} color="#a3bba7"/>
         <group position={[0,0,.183]}><Plaque label="PartnerConnect · CRM" width={3.55} tone="positive"/></group>
       </group>
       <group position={[3.2,3.1,.23]}>
         <Round size={[4.3,.76,.34]} color="#cfb38c"/>
         <group position={[0,0,.183]}><Plaque label="ERP · Auftrag & Versand" width={4}/></group>
       </group>
       <Round at={[.14,3.07,.24]} size={[1.92,.045,.15]} color="#82a692"/>
     </>}
   </group>}
   {orbit&&<OrbitControls makeDefault target={[0,.65,0]} enablePan={false} minDistance={12} maxDistance={43} maxPolarAngle={1.4}/>}
 </>;
}
function FramePump({story,contextLost}:{story:Story;contextLost:Props['contextLost']}){
 const {invalidate,camera,gl}=useThree();
 useLayoutEffect(()=>{
   if(story.mode==='explore'){
     camera.position.set(5,18,26);
     camera.lookAt(0,.65,0);
   }
   invalidate();
   window.addEventListener('caleira:frame',invalidateFrame);
   const canvas=gl.domElement;
   canvas.addEventListener('webglcontextlost',contextLost);
   function invalidateFrame(){invalidate()}
   return ()=>{
     window.removeEventListener('caleira:frame',invalidateFrame);
     canvas.removeEventListener('webglcontextlost',contextLost);
   };
 },[story,camera,invalidate,gl,contextLost]);
 return null;
}
export default function Stage({story,clock,eco,pick,fallback,contextLost}:Props){
 return <Canvas frameloop="demand" fallback={fallback} shadows={!eco} dpr={eco?1:[1,1.35]}
   camera={{position:[0,8,15],fov:36}} gl={{antialias:true,preserveDrawingBuffer:true}}>
   <color attach="background" args={['#eae5d8']}/>
   <Scene story={story} clock={clock} pick={pick}/>
   <FramePump story={story} contextLost={contextLost}/>
 </Canvas>;
}
