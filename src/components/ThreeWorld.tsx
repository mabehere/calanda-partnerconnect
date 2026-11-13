import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {PerspectiveCamera,OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
type V3=[number,number,number];
export function Block({at=[0,0,0],size=[1,1,1],color='#363c39',metal=0,emissive}: {at?:V3;size?:V3;color?:string;metal?:number;emissive?:string}){return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metal} roughness={.48} emissive={emissive??'#000000'} emissiveIntensity={emissive?1.5:0}/></mesh>}
export function Stove({position=[0,0,0],scale=1,ember=true}:{position?:V3;scale?:number;ember?:boolean}){return <group position={position} scale={scale}>
 <Block at={[0,.08,0]} size={[1.18,.16,.85]} color="#202725" metal={.7}/><Block at={[0,1.06,0]} size={[1.05,1.85,.74]} color="#252b29" metal={.75}/>
 <Block at={[0,1.16,.38]} size={[.83,1.25,.045]} color="#090c0b" metal={.25}/><Block at={[0,1.17,.41]} size={[.68,1.04,.015]} color={ember?'#28150b':'#101511'}/>
 <Block at={[.43,1.15,.46]} size={[.035,.38,.05]} color="#c7b7a0" metal={.8}/><Block at={[0,2.02,0]} size={[1.1,.09,.78]} metal={.9}/>
 <mesh position={[0,2.8,-.12]}><cylinderGeometry args={[.13,.13,1.6,24]}/><meshStandardMaterial color="#1d2220" metalness={.8} roughness={.3}/></mesh>
 {ember&&<group>{[-.2,0,.19].map((x,i)=><group key={x}><mesh position={[x,.91,.44]} rotation={[0,0,.2-i*.18]}><coneGeometry args={[.13,.58+i*.12,12]}/><meshStandardMaterial color="#ff9c3d" emissive="#f26419" emissiveIntensity={2.5} transparent opacity={.9}/></mesh><mesh position={[x,.69,.44]} rotation={[0,0,.2]}><capsuleGeometry args={[.06,.25,4,8]}/><meshStandardMaterial color="#402015" emissive="#e15116" emissiveIntensity={.5}/></mesh></group>)}<pointLight position={[0,1.1,.8]} color="#ff792f" intensity={3} distance={4}/></group>}
 <Block at={[0,.34,.38]} size={[.82,.15,.03]} color="#101511"/>
 </group>}
function Person({at=[0,0,0],color='#be8763'}:{at?:V3;color?:string}){return <group position={at}><mesh position={[0,.85,0]} castShadow><sphereGeometry args={[.13,12,12]}/><meshStandardMaterial color="#d4bc9a"/></mesh><mesh position={[0,.55,0]} castShadow><capsuleGeometry args={[.13,.3,4,10]}/><meshStandardMaterial color={color}/></mesh>{[-.08,.08].map(x=><Block key={x} at={[x,.18,0]} size={[.1,.35,.12]} color="#242c2b"/>)}</group>}
function Desk({at=[0,0,0]}:{at?:V3}){return <group position={at}><Block at={[0,.65,0]} size={[1.3,.09,.6]} color="#a98766"/><Block at={[0,.38,0]} size={[.85,.7,.35]} color="#363e3b"/><Block at={[0,.95,-.1]} size={[.5,.38,.04]} color="#183d37" emissive="#13352e"/></group>}
export const STATIONS=[{name:'Showroom',x:-6,z:-3},{name:'Vertrieb',x:0,z:-3},{name:'Werkstatt',x:6,z:-3},{name:'Logistik',x:6,z:3},{name:'Service',x:0,z:3},{name:'Partnernetz',x:-6,z:3}];
export function World({chapter=0,time=0,before=false,onHotspot}:{chapter?:number;time?:number;before?:boolean;onHotspot?:(n:number)=>void}){
 return <group>
 <Block at={[0,-.35,0]} size={[19,.6,12]} color="#222b28"/><Block at={[0,-.02,0]} size={[18,.06,1.3]} color="#52605a"/>
 {Array.from({length:18},(_,i)=><Block key={i} at={[-8.5+i,.02,0]} size={[.45,.02,.04]} color="#b6a58b"/>)}
 {STATIONS.map((s,i)=><group key={s.name} position={[s.x,0,s.z]} onClick={e=>{e.stopPropagation();onHotspot?.(i)}}>
   <Block at={[0,.08,0]} size={[4.8,.16,3.5]} color={chapter===i?'#997154':'#48514a'}/>
   <Block at={[0,.8,-1.65]} size={[4.8,1.45,.15]} color="#697367"/><Block at={[-2.32,.8,0]} size={[.15,1.45,3.4]} color="#505e54"/>
   <Block at={[0,1.55,-1.65]} size={[4.8,.05,.22]} color="#e7bb80" emissive={chapter===i?'#bf7438':undefined}/>
   {i===0&&<><Stove position={[-1.35,.17,-.7]} scale={.55}/><Stove position={[0,.17,-.7]} scale={.55}/><Stove position={[1.35,.17,-.7]} scale={.55}/><Person at={[1,.17,.65]}/></>}
   {i===1&&<><Desk at={[-1,.18,-.3]}/><Desk at={[1,.18,-.3]}/><Person at={[.8,.17,.6]} color="#6f9385"/>{before&&[0,1,2].map(n=><Block key={n} at={[n*.5-.5,.9,.3]} size={[.4,.03,.3]} color="#ddc3a3"/>)}</>}
   {i===2&&<><Desk at={[0,.18,-.6]}/><Stove position={[-1.3,.17,.5]} scale={.5}/><Person at={[.6,.17,.6]}/>{[0,1,2,3].map(n=><Stove key={n} scale={.22} position={[-1.2+n*.65,.85+Math.sin(time*2+n)*.04,-.6]}/>)}</>}
   {i===3&&<>{[0,1,2].map(n=><group key={n}><Block at={[-1.6+n*1.4,.95,-.9]} size={[1.2,1.7,.7]} color="#333f38"/>{[.5,1.3].map(y=><Block key={y} at={[-1.6+n*1.4,y,-.48]} size={[.8,.5,.5]} color="#b5946b"/>)}</group>)}<Person at={[-1,.17,.8]}/></>}
   {i===4&&<><Desk at={[0,.18,-.5]}/><Person at={[.3,.17,.4]} color="#72978a"/><Stove position={[1.5,.17,.2]} scale={.4}/><Block at={[-1.6,.8,-.7]} size={[.6,1.2,.2]} color={before?'#a05337':'#6fa38a'}/></>}
   {i===5&&<>{[-1.5,-.5,.5,1.5].map((x,n)=><group key={x}><Block at={[x,.4,-.4]} size={[.65,.65,.8]} color={['#c79465','#9eada0','#899d91','#b5a98d'][n]}/><Block at={[x,.8,-.4]} size={[.7,.15,.85]} color="#28352f"/></group>)}<Person at={[0,.17,.8]}/></>}
 </group>)}
 <group position={[Math.sin(time*.5)*6,.08,.1]}><Block at={[0,.42,0]} size={[1.5,.7,.65]} color="#b88962"/><Block at={[1,.35,0]} size={[.65,.58,.65]} color="#d0b995"/><Block at={[1.2,.6,0]} size={[.2,.22,.68]} color="#20352d"/>{[-.55,.85].flatMap(x=>[-.37,.37].map(z=><mesh key={`${x}-${z}`} position={[x,.16,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.19,.19,.1,16]}/><meshStandardMaterial color="#111915"/></mesh>))}</group>
 <group position={[-3.1,.15,0]}><Block at={[0,.5,0]} size={[.55,1,.55]} color="#234b3c" emissive={before?undefined:'#14392c'}/><Block at={[0,1.05,0]} size={[.58,.1,.58]} color="#b8d4bd"/></group>
 <group position={[3.1,.15,0]}><Block at={[0,.5,0]} size={[.55,1,.55]} color="#b48862"/><Block at={[0,1.05,0]} size={[.58,.1,.58]} color="#efd4ad"/></group>
 </group>
}
const positions:V3[]=[[-11,8,7],[-3,8,8],[12,8,7],[13,8,12],[3,8,13],[-11,9,12]];
export function SceneCamera({chapter,explore,wide=false,reduced=false}:{chapter:number;explore:boolean;wide?:boolean;reduced?:boolean}){const camera=useRef<THREE.PerspectiveCamera>(null);const target=useRef(new THREE.Vector3());useFrame((_,delta)=>{if(explore||!camera.current)return;const s=STATIONS[chapter];const p=wide?[15,15,18]:positions[chapter];const dest=new THREE.Vector3(...p as V3);camera.current.position.lerp(dest,reduced?1:1-Math.exp(-delta*2));target.current.lerp(new THREE.Vector3(wide?0:s.x*.65,0,wide?0:s.z*.65),reduced?1:1-Math.exp(-delta*2));camera.current.lookAt(target.current)});return <><PerspectiveCamera ref={camera} makeDefault position={[15,15,18]} fov={42}/>{explore&&<OrbitControls makeDefault minDistance={8} maxDistance={32} maxPolarAngle={Math.PI/2.15} target={[0,0,0]}/>}</>}
export function WorldLights(){return <><ambientLight intensity={.65}/><hemisphereLight args={['#ffe8c7','#233a2b',1.3]}/><directionalLight position={[0,14,8]} intensity={3} color="#ffe1b2" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={15} shadow-camera-bottom={-15}/><directionalLight position={[-10,8,-8]} intensity={2} color="#b6c4b5"/></>}
