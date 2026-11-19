import {useLayoutEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {ease,truckDistance,armAngles} from './timing';
import {DESK,ADVISOR,TABLET} from './layout';
import {HUBS,makeWheel,sampleWheel,disposeWheel} from './wheels';

type V3=[number,number,number];
export const PALETTE={cream:'#eee9dc',sage:'#a9bbaa',green:'#31574d',copper:'#be754f',ink:'#24413b',sand:'#ddc8a7',yellow:'#edbd68'};
export function Round({at=[0,0,0],size=[1,1,1],color=PALETTE.sage,radius=.12,metal=0}:{at?:V3;size?:V3;color?:string;radius?:number;metal?:number}){
 const geometry=useMemo(()=>new RoundedBoxGeometry(...size,4,Math.min(radius,...size.map(v=>v/2-.001))),[size[0],size[1],size[2],radius]);useLayoutEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={at} geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.6} metalness={metal}/></mesh>;
}
function Orb({at=[0,0,0],scale=[1,1,1],color}:{at?:V3;scale?:V3;color:string}){return <mesh position={at} scale={scale} castShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={color} roughness={.7}/></mesh>}
function Limb({length=.3,width=.08,color}:{length?:number;width?:number;color:string}){return <mesh position={[0,-length/2,0]} castShadow><capsuleGeometry args={[width,Math.max(.01,length-width*2),8,20]}/><meshStandardMaterial color={color} roughness={.72}/></mesh>}
export function Character({time=0,advisor=false,gesture='look'}:{time?:number;advisor?:boolean;gesture?:'look'|'point'|'tap'|'nod'}){
 const skin=advisor?'#bd8d6f':'#d9af8c',shirt=advisor?'#72998c':PALETTE.copper;
 const nod=gesture==='nod'?Math.sin(Math.PI*ease((time-.3)/.8))*.14:0;
 return <group name={advisor?'sage-advisor':'copper-marco'}>
 {[-.15,.15].map(x=><group key={x} position={[x,.79,0]}><Limb length={.6} width={.105} color='#3f5b57'/><Round at={[0,-.67,.075]} size={[.24,.17,.38]} color={advisor?'#e1d3b9':'#6a5545'} radius={.075}/></group>)}
 <Round at={[0,1.08,0]} size={[.65,.72,.43]} color={shirt} radius={.2}/>
 <Round at={[0,1.4,0]} size={[.24,.13,.23]} color={skin} radius={.06}/>
 <group position={[0,1.71,0]} rotation={[nod,gesture==='look'?.15:0,0]}>
 <Orb scale={[.29,.32,.265]} color={skin}/>
 <Orb at={[0,.18,-.055]} scale={[.295,.19,.255]} color={advisor?'#554238':'#71513b'}/>
 {advisor?<Orb at={[0,.18,-.27]} scale={[.17,.17,.14]} color='#554238'/>:<><Orb at={[-.17,.22,.09]} scale={[.16,.105,.18]} color='#71513b'/><Orb at={[.07,.28,.015]} scale={[.19,.095,.17]} color='#71513b'/></>}
 {[-.1,.1].map(x=><Orb key={x} at={[x,.015,.249]} scale={[.026,.035,.015]} color='#35443a'/>)}
 <Orb at={[0,-.055,.265]} scale={[.045,.055,.045]} color={skin}/>
 <mesh position={[0,-.135,.252]} rotation={[0,0,Math.PI]}><torusGeometry args={[.065,.012,10,20,Math.PI]}/><meshStandardMaterial color='#92684f'/></mesh>
 {[-.29,.29].map(x=><Orb key={x} at={[x,-.02,0]} scale={[.045,.075,.065]} color={skin}/>)}
 </group>
 {[-1,1].map(side=><group key={side} position={[side*.34,1.34,0]} rotation={armAngles(side,gesture,time).shoulder}>
 <Limb length={.31} width={.09} color={shirt}/><group position={[0,-.31,0]} rotation={armAngles(side,gesture,time).elbow}><Orb scale={[.075,.075,.075]} color={skin}/><Limb length={.28} width={.07} color={skin}/><Orb at={[0,-.31,.015]} scale={[.085,.105,.075]} color={skin}/></group>
 </group>)}
 </group>;
}
function Flame({time=0}:{time?:number}){
 const geometry=useMemo(()=>{const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(-.26,.08,-.19,.35,0,.65);s.bezierCurveTo(.02,.38,.28,.2,.18,.08);s.quadraticCurveTo(.13,-.03,0,0);return new THREE.ExtrudeGeometry(s,{depth:.035,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:4,steps:1,curveSegments:24})},[]);useLayoutEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group position={[-.06,.58,.535]}>{[-1,0,1].map(i=><mesh key={i} position={[i*.21,0,i===0?.04:0]} scale={[i===0?.85:.65,(i===0?1:.65)+.025*Math.sin(time*3+i),1]} geometry={geometry}><meshStandardMaterial color={i===0?'#ffe3a0':'#e9a254'} emissive={i===0?'#f4b553':'#b65a26'} emissiveIntensity={.35} roughness={.72}/></mesh>)}</group>;
}
export function SoftStove({time=0}:{time?:number}){return <group name='soft-stove'>
 <Round at={[0,.1,0]} size={[1.22,.2,1.02]} color='#3e5751' radius={.09}/>
 <Round at={[0,.98,0]} size={[1.1,1.65,.88]} color='#4e6f63' radius={.18} metal={.15}/>
 <Round at={[0,1.02,.45]} size={[.85,1.15,.085]} color='#d0ba91' radius={.15} metal={.3}/>
 <Round at={[0,1.02,.5]} size={[.71,1.01,.045]} color='#273e3b' radius={.12}/>
 <Flame time={time}/>
 <Round at={[.48,1.04,.53]} size={[.055,.35,.06]} color='#e2d0ac' radius={.025} metal={.4}/>
 <mesh position={[0,2.22,-.12]} castShadow><cylinderGeometry args={[.14,.14,.9,40]}/><meshStandardMaterial color='#47675b' roughness={.55} metalness={.2}/></mesh>
 <Round at={[0,1.8,-.06]} size={[1.07,.1,.82]} color='#57786a' radius={.045}/>
 </group>}
export function Envelope({time=0}:{time?:number}){return <group name='request-envelope' rotation={[0,0,Math.sin(time)*.025]}>
 <Round size={[.72,.48,.1]} radius={.07} color='#f6e9cd'/>
 {[-1,1].map(side=><mesh key={side} position={[side*.15,.04,.061]} rotation={[0,0,side*.55]}><boxGeometry args={[.37,.017,.012]}/><meshStandardMaterial color='#ba8c62'/></mesh>)}
 </group>}
export function SoftVan({distance=0,scale=1}:{distance?:number;scale?:number}){
 const wheels=useMemo(()=>HUBS.map(makeWheel),[]);useLayoutEffect(()=>{wheels.forEach(w=>sampleWheel(w,distance,scale))},[wheels,distance,scale]);useLayoutEffect(()=>()=>wheels.forEach(disposeWheel),[wheels]);
 return <group name='soft-delivery-van' scale={scale}>
 <Round at={[0,.63,0]} size={[4.05,.25,1.62]} radius={.12} color='#43665b'/>
 <Round at={[-.57,1.43,0]} size={[2.85,1.65,1.68]} radius={.21} color='#dfdcc9'/>
 <Round at={[1.25,1.27,0]} size={[1.38,1.35,1.65]} radius={.25} color='#9db6a3'/>
 <Round at={[1.95,1.5,0]} size={[.045,.57,1.28]} radius={.02} color='#516e67'/>
 {[-1,1].map(side=><group key={side}><Round at={[1.29,1.59,side*.828]} size={[.85,.51,.035]} color='#526f68' radius={.11}/><Round at={[1.36,.93,side*.84]} size={[.25,.05,.04]} color='#dce1d2' radius={.02}/><Round at={[-.58,1.32,side*.855]} size={[1.65,.06,.02]} color='#b17b57' radius={.008}/></group>)}
 <Round at={[2.02,.68,0]} size={[.16,.16,1.5]} color='#e3d6b7' radius={.06}/>
 {[-.53,.53].map(z=><Round key={z} at={[2.025,1.03,z]} size={[.04,.22,.24]} color='#f7dfac' radius={.02}/>)}
 {wheels.map((w,i)=><primitive key={i} object={w} dispose={null}/>)}
 </group>;
}
export function StudioLights(){const {gl,scene}=useThree();useLayoutEffect(()=>{const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(gl),target=pmrem.fromScene(room,.06);const old=scene.environment;scene.environment=target.texture;scene.environmentIntensity=.35;room.dispose();pmrem.dispose();return()=>{scene.environment=old;target.dispose()}},[gl,scene]);return <><hemisphereLight args={['#fff5e5','#b5c4b4',1.5]}/><directionalLight position={[-4,8,5]} color='#fff0d5' intensity={2.2} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.025}/><directionalLight position={[5,4,-4]} color='#d8e6df' intensity={1.3}/></>}
export function Ground(){return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color={PALETTE.cream} roughness={1}/></mesh>}
export function PilotWorld({chapter,time}:{chapter:number;time:number}){
 return <group><Ground/>
 <Round at={[0,.01,-.2]} size={[7.5,.09,4.4]} color={chapter===0?'#e3d6bd':'#d4ded0'} radius={.04}/>
 {chapter===0?<>
 <group position={[-1.7,.02,.4]} rotation={[0,.85,0]}><Character time={time} gesture='point'/></group>
 <Round at={[.65,.15,-.2]} size={[2.2,.22,1.8]} color='#c9d7c5' radius={.1}/><group position={[.65,.26,-.2]}><SoftStove time={time}/></group>
 <pointLight position={[.65,1.2,.5]} color='#efbd6e' intensity={2} distance={3}/>
 </>:<>
 <group position={[-2.1,.02,.3]} rotation={[0,.65,0]}><Character time={time-4.5} gesture='nod'/></group>
 <group position={ADVISOR.position} rotation={[0,ADVISOR.yaw,0]}><Character advisor time={time<5?time-2.4:time-5.1} gesture={time<5?'tap':'nod'}/></group>
 <Round at={DESK.position} size={DESK.size} radius={.075} color='#cfb38c'/>{[.45,2.25].map(x=><Round key={x} at={[x,.46,DESK.position[2]]} size={[.14,.82,.6]} color='#6f9687' radius={.065}/>)}
 <Round at={[1.2,1.08,.93]} size={[.14,.25,.14]} color='#718f80' radius={.04}/><Round at={[1.2,1.0,.88]} size={[.45,.04,.3]} color='#718f80' radius={.018}/>
 <Round at={TABLET.position} size={TABLET.size} color='#57796a' radius={.018}/>
 <group position={[1.2,1.38,.95]} rotation={[-.16,Math.PI,0]}><Round size={[.95,.62,.065]} color='#718f80' radius={.11}/><Round at={[0,0,.042]} size={[.82,.49,.012]} color='#eef0dc' radius={.005}/></group>
 </>}
 <group position={[chapter===0?2.5:-3.1,.1,-1]}><Round at={[0,.28,0]} size={[.55,.55,.55]} color='#d9c5a5' radius={.16}/>{[0,1,2].map(i=><Orb key={i} at={[(i-1)*.16,.85+i*.12,0]} scale={[.17,.4,.1]} color={i===1?'#719781':'#9bb49b'}/>)}</group>
 </group>;
}
export function Camera({chapter,time,test=false,angle=0,distance=6}:{chapter:number;time:number;test?:boolean;angle?:number;distance?:number}){const {camera}=useThree();useLayoutEffect(()=>{if(test){camera.position.set(Math.sin(angle)*distance,2.6,Math.cos(angle)*distance);camera.lookAt(0,1,0)}else{const p=ease(time/6);camera.position.set(chapter===0?3.8-p*.5:.7-p*.3,3.1-p*.15,7.8-p*.35);camera.lookAt(0,1,0)}camera.updateProjectionMatrix()},[camera,chapter,time,test,angle,distance]);return null}
export function VehicleWorld({time}:{time:number}){const {camera}=useThree();useLayoutEffect(()=>{camera.position.set(0,2.1,12.6);camera.lookAt(0,.85,0)},[camera]);return <><Ground/><Round at={[0,-.02,0]} size={[16,.03,3.4]} color='#d3ddcf' radius={.014}/>{[-6,-4,-2,0,2,4,6].map(x=><Round key={x} at={[x,.002,1.28]} size={[.6,.012,.05]} color='#f6f0df' radius={.005}/>)}<group position={[-3+truckDistance(time),0,0]}><SoftVan distance={truckDistance(time)}/></group></>}




