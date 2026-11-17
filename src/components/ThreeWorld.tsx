import {useLayoutEffect,useMemo,useRef} from 'react';
import type {ReactNode} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {PerspectiveCamera,OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type V3=[number,number,number];
export type JourneyTime={current:number};
const C={stone:'#b6b4a4',wall:'#d7d0bc',wood:'#926e4e',dark:'#283933',metal:'#36413d',copper:'#b79668',paper:'#e5dcc7'};
export const STATIONS=[{name:'Showroom',x:-6,z:-3},{name:'Vertrieb',x:0,z:-3},{name:'Werkstatt',x:6,z:-3},{name:'Logistik',x:6,z:3},{name:'Service',x:0,z:3},{name:'Partnernetz',x:-6,z:3}];
export function Block({at=[0,0,0],size=[1,1,1],color=C.metal,metal=0,emissive,round=false}:{at?:V3;size?:V3;color?:string;metal?:number;emissive?:string;round?:boolean}){
 const geometry=useMemo(()=>round?new RoundedBoxGeometry(...size,2,.035):new THREE.BoxGeometry(...size),[size[0],size[1],size[2],round]);
 useLayoutEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={at} geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} metalness={metal} roughness={metal?.36:.78} emissive={emissive??'#000000'} emissiveIntensity={emissive?.7:0}/></mesh>;
}
function Cylinder({at=[0,0,0],radius=.1,height=1,color=C.dark,metal=0,rotation=[0,0,0]}:{at?:V3;radius?:number;height?:number;color?:string;metal?:number;rotation?:V3}){return <mesh position={at} rotation={rotation} castShadow receiveShadow><cylinderGeometry args={[radius,radius,height,16]}/><meshStandardMaterial color={color} metalness={metal} roughness={.48}/></mesh>}

/** Flatten only static architecture; React owns originals, this component owns merged buffers. */
function StaticBatch({children}:{children:ReactNode}){
 const source=useRef<THREE.Group>(null),batch=useRef<THREE.Group>(null);
 useLayoutEffect(()=>{
  const src=source.current!,dst=batch.current!;src.updateWorldMatrix(true,true);
  const inverse=src.matrixWorld.clone().invert();const buckets=new Map<string,{material:THREE.Material;geometries:THREE.BufferGeometry[]}>();
  src.traverse(o=>{if(!(o instanceof THREE.Mesh)||Array.isArray(o.material))return;const m=o.material as THREE.MeshStandardMaterial;
   const key=[m.type,m.color?.getHex(),m.metalness,m.roughness,m.emissive?.getHex(),m.emissiveIntensity,m.opacity,m.transparent].join(':');
   const b=buckets.get(key)??{material:m,geometries:[]};const g=o.geometry.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld));
   b.geometries.push(g.index?g.toNonIndexed():g);if(g.index)g.dispose();buckets.set(key,b);
  });
  for(const b of buckets.values()){const g=mergeGeometries(b.geometries);b.geometries.forEach(g=>g.dispose());if(g){const m=new THREE.Mesh(g,b.material);m.castShadow=!b.material.transparent;m.receiveShadow=true;dst.add(m)}}
  return()=>{for(const m of [...dst.children]){(m as THREE.Mesh).geometry.dispose();dst.remove(m)}};
 },[children]);
 return <><group ref={source} visible={false}>{children}</group><group ref={batch}/></>;
}
function StoveBody(){return <>
 <Block at={[0,.12,0]} size={[1.16,.18,.88]} color='#242c2a' metal={.72} round/>
 <Block at={[0,1.1,-.08]} size={[1.04,1.9,.65]} color='#343d39' metal={.65} round/>
 <Block at={[0,1.2,.275]} size={[.85,1.35,.11]} color='#101916' metal={.55} round/>
 <Block at={[0,1.2,.34]} size={[.68,1.12,.03]} color='#120e0a'/>
 {[-.4,.4].map(x=><Block key={x} at={[x,1.2,.37]} size={[.06,1.31,.08]} color='#68716a' metal={.82}/>)}
 {[.56,1.84].map(y=><Block key={y} at={[0,y,.37]} size={[.85,.045,.08]} color='#70746b' metal={.85}/>)}
 <Cylinder at={[.43,1.18,.49]} radius={.025} height={.42} color='#b8b4a4' metal={.9}/>
 {[1.02,1.34].map(y=><Block key={y} at={[.43,y,.43]} size={[.035,.025,.12]} color='#b8b4a4' metal={.9}/>)}
 <Block at={[0,2.08,-.02]} size={[1.13,.1,.82]} color='#515b54' metal={.8} round/>
 <Cylinder at={[0,2.84,-.14]} height={1.5} radius={.135} color='#38443e' metal={.75}/>
 {[2.2,2.9,3.55].map(y=><Cylinder key={y} at={[0,y,-.14]} height={.045} radius={.15} color='#657168' metal={.8}/>)}
 {[.28,.34,.4].map(y=><Block key={y} at={[0,y,.27]} size={[.71,.025,.025]} color='#101a16'/>)}
 {[-.18,.04,.22].map((x,i)=><group key={x} position={[x,.71,.12]} rotation={[Math.PI/2,.12-i*.1,.8]}><Cylinder radius={.07} height={.44} color='#553a24'/><Cylinder at={[0,.225,0]} radius={.058} height={.012} color='#b28753'/></group>)}
 <Block at={[0,.8,.36]} size={[.56,.035,.05]} color='#5e2710' emissive='#c75119'/>
 </>}
// UV-space flame tongues, sampled from the chapter clock in both renderers.
const fireVertex=`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fireFragment=`varying vec2 vUv; uniform float time; uniform float seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){vec2 p=vUv;float t=time*1.4+seed;float n=noise(vec2(p.x*7.,p.y*6.-t*2.));
float sway=sin(p.y*9.-t*3.)*.045*p.y;float tongues=0.;
for(int i=0;i<4;i++){float fi=float(i);float x=.15+fi*.23+sway;float h=.55+.22*sin(fi*4.7+t*.8);float taper=max(.005,(1.-p.y/h)*(.1+.03*sin(t+fi)));float d=abs(p.x-x)/(taper+.035*n);float f=(1.-smoothstep(.45,1.35,d))*(1.-smoothstep(h-.15,h+.1,p.y));tongues=max(tongues,f);}
float a=tongues*smoothstep(0.,.12,p.y)*(1.-smoothstep(.8,1.,p.y));if(a<.01)discard;
vec3 col=mix(vec3(1.,.16,.015),vec3(1.,.67,.17),pow(a,1.7));col=mix(col,vec3(1.,.91,.53),pow(a,4.)*(1.-p.y));gl_FragColor=vec4(col,a*.95);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
function Flames({index=0}:{index?:number}){const uniforms=useMemo(()=>({time:{value:0},seed:{value:index}}),[index]);return <mesh userData={{fire:index}} position={[0,1.19,.405]}><planeGeometry args={[.67,.97]}/><shaderMaterial uniforms={uniforms} vertexShader={fireVertex} fragmentShader={fireFragment} transparent depthWrite={false} side={THREE.DoubleSide}/></mesh>}
export function Stove({position=[0,0,0],scale=1,ember=true}:{position?:V3;scale?:number;ember?:boolean}){return <group position={position} scale={scale}><StoveBody/>{ember&&<Flames/>}<mesh position={[0,1.2,.43]}><planeGeometry args={[.69,1.12]}/><meshStandardMaterial color='#a3b8ac' transparent opacity={.11} metalness={.4} roughness={.2} depthWrite={false}/></mesh></group>}
function Plant({at,scale=1}:{at:V3;scale?:number}){return <group position={at} scale={scale}><mesh position={[0,.21,0]} castShadow><cylinderGeometry args={[.28,.22,.42,16]}/><meshStandardMaterial color='#7c8173' roughness={.95}/></mesh><Cylinder at={[0,.65,0]} radius={.025} height={.7} color='#6b684b'/>{[0,1,2,3,4].map(i=><mesh key={i} position={[Math.cos(i*2.4)*.16,.78+i*.075,Math.sin(i*2.4)*.16]} rotation={[.3,i*2.4,.5]} scale={[.2,.34,.12]} castShadow><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color={i%2?'#536b49':'#77805b'} roughness={.9}/></mesh>)}</group>}
function Chair({at,rotation=0}:{at:V3;rotation?:number}){return <group position={at} rotation={[0,rotation,0]}><Block at={[0,.5,0]} size={[.48,.09,.47]} color='#40594e' round/><Block at={[0,.79,.2]} size={[.48,.55,.09]} color='#40594e' round/>{[-.17,.17].flatMap(x=>[-.16,.16].map(z=><Cylinder key={`${x}${z}`} at={[x,.25,z]} radius={.025} height={.45} color='#626f65' metal={.7}/>))}</group>}
function Desk({at=[0,0,0]}:{at?:V3}){return <group position={at}><Block at={[0,.86,0]} size={[1.75,.1,.82]} color={C.wood} round/>{[-.7,.7].flatMap(x=>[-.3,.3].map(z=><Block key={`${x}${z}`} at={[x,.44,z]} size={[.05,.8,.05]} color='#59675d' metal={.6}/>))}<Block at={[0,1.24,-.18]} size={[.65,.43,.045]} color='#20352e' round/><Block at={[0,1.25,-.15]} size={[.58,.34,.01]} color='#95b6a3' emissive='#50796b'/><Cylinder at={[0,1,-.18]} radius={.035} height={.16} metal={.7}/><Block at={[0,.93,.19]} size={[.5,.025,.18]} color='#454e48'/>{[0,1,2].map(i=><Block key={i} at={[-.57,.93+i*.012,.2]} size={[.3,.008,.24]} color={C.paper}/>)}<Cylinder at={[.57,1,.06]} radius={.055} height={.16} color={C.paper}/><Chair at={[0,0,.72]}/></group>}
function Shelf({at}:{at:V3}){return <group position={at}>{[-.62,.62].flatMap(x=>[-.3,.3].map(z=><Block key={`${x}${z}`} at={[x,1.05,z]} size={[.06,2.1,.06]} color={C.metal} metal={.6}/>))}{[.25,1,1.76].map((y,i)=><group key={y}><Block at={[0,y,0]} size={[1.35,.065,.72]} color='#6d776d' metal={.4}/>{[-.33,.31].map(x=><group key={x}><Block at={[x,y+.25,0]} size={[.5,.43,.54]} color={i%2?'#b7976a':'#c4b38d'}/><Block at={[x,y+.25,.275]} size={[.025,.43,.008]} color='#eee0ba'/><Block at={[x+.1,y+.28,.28]} size={[.13,.08,.01]} color='#ede8d9'/></group>)}</group>)}</group>}
function Room({index}:{index:number}){const s=STATIONS[index];return <group position={[s.x,.04,s.z]}>
 <Block at={[0,.02,0]} size={[5.7,.16,4.25]} color={index===0?'#b9ac94':index===2||index===3?'#a8ad9e':'#bdbca9'}/>
 <Block at={[0,.42,-2]} size={[5.7,.68,.18]} color={C.wall}/>
 <Block at={[0,2.48,-2]} size={[5.7,.24,.2]} color={C.wall}/>
 {[-2.72,-.9,.9,2.72].map(x=><Block key={x} at={[x,1.5,-2]} size={[.13,1.86,.25]} color='#47594e' metal={.3}/>)}
 {[-1.82,0,1.82].map(x=><group key={x}><Block at={[x,.79,-1.99]} size={[1.7,.05,.3]} color={C.stone}/><mesh position={[x,1.57,-2.04]}><boxGeometry args={[1.66,1.5,.025]}/><meshStandardMaterial color='#73988f' metalness={.45} roughness={.16} transparent opacity={.23} depthWrite={false}/></mesh><Block at={[x,2.35,-1.96]} size={[1.65,.045,.08]} color={C.dark}/></group>)}
 {[-2,-1,0,1,2].map(x=><Block key={`joint${x}`} at={[x,.109,0]} size={[.012,.006,3.95]} color='#7b8574'/>)}
 {[-1,0,1].map(z=><Block key={`joint${z}`} at={[0,.109,z]} size={[5.5,.006,.012]} color='#7b8574'/>)}
 <Block at={[-2.78,1.3,-1.25]} size={[.2,2.55,1.45]} color={C.wall}/>
 <Block at={[-2.78,2.45,.25]} size={[.2,.25,1.6]} color={C.wall}/>
 <Block at={[-2.78,1.22,1.12]} size={[.2,2.45,.15]} color={C.wall}/>
 <Block at={[-2.7,.12,.3]} size={[.5,.07,1.4]} color={C.stone}/>
 <Block at={[0,.18,2.05]} size={[5.7,.15,.12]} color={C.stone}/>
 {[-2.7,2.7].map(x=><group key={x}><Block at={[x,1.3,-1.85]} size={[.1,2.5,.1]} color={C.dark} metal={.6}/><Block at={[x,2.57,-.7]} size={[.1,.12,2.5]} color={C.dark} metal={.5}/></group>)}
 <Block at={[0,2.58,-.5]} size={[5.55,.08,.1]} color={C.dark} metal={.5}/>
 <Block at={[0,2.51,-.5]} size={[4.9,.025,.04]} color='#e4ce9c' emissive='#c3a373'/>
 {index===0&&<><Block at={[0,.18,-.9]} size={[4.9,.16,1.5]} color='#d2c9b5'/>{[-1.55,0,1.55].map(x=><group key={x} position={[x,.27,-.9]} scale={.58}><StoveBody/></group>)}<Block at={[1.9,.38,1.3]} size={[1.25,.5,.55]} color='#6f8170' round/><Plant at={[-2.1,.15,1.2]}/></>}
 {index===1&&<><Desk at={[-1.2,.15,-.65]}/><Desk at={[1.1,.15,-.65]}/><Plant at={[2.2,.15,1.25]} scale={.85}/><Block at={[-2.4,1.4,-.8]} size={[.035,.8,1.15]} color={C.paper}/></>}
 {index===2&&<><Block at={[0,.95,-.9]} size={[4.7,.15,.85]} color={C.wood}/>{[-2,0,2].map(x=><Block key={x} at={[x,.5,-.9]} size={[.12,.9,.6]} color={C.metal} metal={.4}/>)}{[0,1,2,3].map(n=><group key={n} position={[-1.8+n*1.2,1.03,-.9]} scale={.25}><StoveBody/></group>)}<group position={[-1.6,.16,.8]} scale={.48}><StoveBody/></group><Block at={[1.75,.5,.85]} size={[1,.7,.5]} color={C.dark} round/>{[.3,.5,.7].map(y=><Block key={y} at={[1.75,y,1.11]} size={[.7,.025,.03]} color={C.copper} metal={.8}/>)}</>}
 {index===3&&<>{[-1.7,0,1.7].map(x=><Shelf key={x} at={[x,.14,-1.1]}/>)}{[-1.6,-1.1,-.6].map(x=><Block key={x} at={[x,.2,1.1]} size={[.37,.12,1.1]} color={C.wood}/>)}<Block at={[-1.1,.52,1.1]} size={[1.1,.5,.8]} color='#baa37c'/><Block at={[-1.1,.52,1.51]} size={[.04,.5,.015]} color={C.paper}/></>}
 {index===4&&<><Desk at={[-1.05,.15,-.75]}/><group position={[1.5,.2,.15]} scale={.55}><StoveBody/></group><Block at={[1.5,.15,.25]} size={[1.25,.12,1.4]} color='#788574'/><Block at={[2.45,.9,-1.1]} size={[.13,1.45,1]} color={C.wood}/><Plant at={[-2,.15,1.3]} scale={.7}/></>}
 {index===5&&<><mesh position={[0,.84,0]} castShadow><cylinderGeometry args={[1.05,1.05,.09,40]}/><meshStandardMaterial color={C.wood} roughness={.65}/></mesh><Cylinder at={[0,.45,0]} radius={.24} height={.8} color={C.dark}/>{[0,1,2,3].map(n=><group key={n} rotation={[0,n*Math.PI/2,0]}><Chair at={[0,.15,1.35]}/><Block at={[0,.9,.65]} size={[.32,.015,.23]} color={C.paper}/></group>)}<Plant at={[-2.15,.15,-1.05]} scale={1.25}/><Plant at={[2.15,.15,1.25]} scale={.8}/></>}
 </group>}
function Person({at,color=C.copper,action='work',index=0,rotation=0}:{at:V3;color?:string;action?:'walk'|'work'|'inspect'|'talk';index?:number;rotation?:number}){
 return <group position={at} rotation={[0,rotation,0]} userData={{actor:true,at,rotation,action,index}}>
 <mesh position={[0,1.39,0]} castShadow><sphereGeometry args={[.125,14,12]}/><meshStandardMaterial color='#c6a27c'/></mesh>
 <mesh position={[0,1.46,-.02]} scale={[1,.65,1]} castShadow><sphereGeometry args={[.13,12,10]}/><meshStandardMaterial color='#493c31'/></mesh>
 <Cylinder at={[0,1.24,0]} radius={.055} height={.12} color='#c6a27c'/>
 <mesh position={[0,1.05,0]} castShadow><capsuleGeometry args={[.16,.23,4,12]}/><meshStandardMaterial color={color} roughness={.9}/></mesh>
 {[-1,1].map(side=><group key={side} position={[side*.09,.84,0]} userData={{limb:'leg',side}}><mesh position={[0,-.22,0]} castShadow><capsuleGeometry args={[.065,.32,4,8]}/><meshStandardMaterial color='#334139'/></mesh><group position={[0,-.4,0]} userData={{limb:'knee',side}}><mesh position={[0,-.17,0]} castShadow><capsuleGeometry args={[.055,.26,4,8]}/><meshStandardMaterial color='#334139'/></mesh><Block at={[0,-.34,.045]} size={[.13,.09,.23]} color='#242e29' round/></group></group>)}
 {[-1,1].map(side=><group key={side} position={[side*.2,1.2,0]} userData={{limb:'arm',side}}><mesh position={[0,-.15,0]} castShadow><capsuleGeometry args={[.052,.21,4,8]}/><meshStandardMaterial color={color}/></mesh><group position={[0,-.29,0]} rotation={[-.55,0,0]}><Cylinder at={[0,-.1,0]} radius={.043} height={.2} color='#c6a27c'/><mesh position={[0,-.22,0]}><sphereGeometry args={[.05,8,8]}/><meshStandardMaterial color='#c6a27c'/></mesh></group></group>)}
 </group>;
}
function Truck(){return <group userData={{truck:true}} position={[3,.18,0]}>
 <Block at={[0,.42,0]} size={[2.1,.17,.88]} color={C.dark} metal={.5}/><Block at={[-.4,1,0]} size={[1.5,1.05,.91]} color='#c0b490' round/>
 <Block at={[.78,.84,0]} size={[.8,.88,.88]} color='#8eaa94' metal={.4} round/><Block at={[1.19,1,0]} size={[.015,.35,.73]} color='#334e47' metal={.65}/>
 {[-.45,.45].map(z=><Block key={z} at={[.78,1.04,z]} size={[.5,.3,.015]} color='#334e47' metal={.5}/>)}
 <Block at={[1.22,.48,0]} size={[.07,.12,.94]} color='#b4b9ab' metal={.8}/>
 {[-.3,.3].map(z=><Block key={z} at={[1.225,.65,z]} size={[.025,.1,.16]} color='#e9d4a3' emissive='#d0ba8c'/>)}
 {[-.8,.85].flatMap(x=>[-.48,.48].map(z=><group key={`${x}${z}`} position={[x,.28,z]} userData={{wheel:true}}><Cylinder radius={.25} height={.13} rotation={[Math.PI/2,0,0]} color='#1f2924'/><Cylinder at={[0,0,z>0?.08:-.08]} radius={.12} height={.02} rotation={[Math.PI/2,0,0]} color='#9a9e90' metal={.8}/></group>))}
 </group>}
function Architecture(){return <>
 <Block at={[0,-.28,0]} size={[19.4,.5,11.5]} color='#626e60' round/>
 <Block at={[0,-.035,0]} size={[19.1,.08,11.2]} color='#929b86'/>
 <Block at={[0,.015,0]} size={[18.8,.045,1.45]} color='#4c5b51'/>
 {Array.from({length:23},(_,i)=><Block key={i} at={[-9+i*.8,.04,0]} size={[.3,.012,.025]} color='#c5baa0'/>)}
 {[-.88,.88].map(z=><Block key={z} at={[0,.05,z]} size={[18.8,.1,.14]} color={C.wall}/>)}
 {STATIONS.map((_,i)=><Room key={i} index={i}/>)}
 {[-9.1,9.1].flatMap(x=>[-4.5,4.5].map(z=><Plant key={`${x}${z}`} at={[x,.03,z]} scale={1.25}/>))}
 {[-9,9].map(x=><group key={x}><Cylinder at={[x,1.5,0]} radius={.045} height={3} color={C.dark} metal={.5}/><Block at={[x,3,.15]} size={[.2,.08,.5]} color={C.dark}/><Block at={[x,2.95,.15]} size={[.16,.015,.4]} color={C.paper} emissive='#bca57c'/></group>)}
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.56,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color='#202e28' roughness={1}/></mesh>
 </>}
const smooth=(v:number)=>{const x=THREE.MathUtils.clamp(v,0,1);return x*x*(3-2*x)};
export function sampleWorld(group:THREE.Group,time:number,chapter:number){
 group.traverse(o=>{
  const u=o.userData;
  if(u.actor){const active=u.index===chapter;const walk=u.action==='walk'&&active;const p=walk?smooth(time/6):0;
   o.position.set(u.at[0]+(walk?p*1.6:0),u.at[1],u.at[2]);o.rotation.y=walk?Math.PI/2:u.rotation;
   const stride=walk?Math.sin(p*1.6/.55*Math.PI*2):0;
   o.traverse(l=>{const d=l.userData;if(d.limb==='leg')l.rotation.x=stride*.48*d.side;if(d.limb==='knee')l.rotation.x=Math.max(0,-stride*d.side)*.55;if(d.limb==='arm')l.rotation.x=walk?-stride*.4*d.side:active?-.6-Math.sin(time*1.6+d.side)*.09:-.25;});
  }
  if(u.fire!==undefined&&o instanceof THREE.Mesh)(o.material as THREE.ShaderMaterial).uniforms.time.value=time;
  if(u.truck){const p=chapter===3?smooth((time-1)/9):0;o.position.x=6-p*12;o.rotation.y=Math.PI;}
  if(u.wheel)o.rotation.z=chapter===3?smooth((time-1)/9)*48:0;
 });
}
export function World({chapter=0,time=0,clock,before=false,onHotspot}:{chapter?:number;time?:number;clock?:JourneyTime;before?:boolean;onHotspot?:(n:number)=>void}){
 const dynamic=useRef<THREE.Group>(null);const architecture=useMemo(()=><Architecture/>,[]);
 useLayoutEffect(()=>{if(dynamic.current)sampleWorld(dynamic.current,time,chapter)},[time,chapter]);
 useFrame(()=>{if(clock&&dynamic.current)sampleWorld(dynamic.current,clock.current,chapter)});
 return <group><StaticBatch>{architecture}</StaticBatch>
 {STATIONS.map((s,i)=><group key={s.name} position={[s.x,.15,s.z]}>
  <mesh position={[0,.01,1.99]}><boxGeometry args={[5.4,.025,.045]}/><meshStandardMaterial color={chapter===i?(before?'#c28556':'#c9b482'):'#6e7d6b'} emissive={chapter===i?(before?'#9d4f28':'#b5a075'):'#000000'} emissiveIntensity={.5}/></mesh>
  {onHotspot&&<mesh position={[0,.9,0]} onClick={e=>{e.stopPropagation();onHotspot(i)}}><boxGeometry args={[5.5,1.8,3.9]}/><meshBasicMaterial visible={false}/></mesh>}
 </group>)}
 <group ref={dynamic}>
 {[-1.55,0,1.55].map((x,i)=><group key={x} position={[-6+x,.31,-3.9]} scale={.58}><Flames index={i}/></group>)}
 <Person at={[-7,.21,-1.9]} action='walk' index={0}/><Person at={[-.95,.21,-2.1]} rotation={Math.PI} color='#7b9b8a' index={1}/>
 <Person at={[6.2,.21,-2.3]} rotation={Math.PI} action='inspect' index={2} color='#b4aa86'/>
 <Person at={[7,.21,4.15]} rotation={Math.PI} action='inspect' index={3} color='#b98b54'/>
 <Person at={[-.8,.21,2.8]} rotation={Math.PI} index={4} color='#8aa18b'/>
 <Person at={[-7.55,.21,3.7]} rotation={1.3} action='talk' index={5} color='#869b88'/><Person at={[-5.6,.21,4.45]} rotation={-2.5} action='talk' index={5}/>
 <Truck/>
 </group>
 {before&&<group position={[0,1,-2.2]}>{[-.9,1.2].map(x=><Block key={x} at={[x,0,0]} size={[.4,.07,.3]} color={C.paper}/>)}</group>}
 </group>;
}
// Visual-only shot coordinates. Chapter time is shared with actors and the film.
const SHOTS:{from:V3;to:V3;target:V3}[]=[
 {from:[-11,8,9],to:[-9,6.4,6.8],target:[-5.3,.8,-2.1]},
 {from:[-3.7,7.4,8],to:[-1,6.2,7],target:[0,.8,-2.2]},
 {from:[11,7.6,8.6],to:[9.6,6.3,7],target:[5.9,.85,-2]},
 {from:[13,8.8,13],to:[10.2,7.1,12],target:[5.1,.6,2.5]},
 {from:[4.4,7,12],to:[2.2,5.8,10.5],target:[.2,.9,3]},
 {from:[-12,10,14],to:[-16,15,20],target:[-1.7,.5,0]},
];
export function sampleShot(chapter:number,time:number,wide=false){const s=SHOTS[chapter],p=smooth(time/12);return {position:(wide?[-16,16,21]:s.from.map((n,i)=>THREE.MathUtils.lerp(n,s.to[i],p))) as V3,target:(wide?[0,0,0]:s.target) as V3};}
export function SceneCamera({chapter,explore,wide=false,reduced=false,clock}:{chapter:number;explore:boolean;wide?:boolean;reduced?:boolean;clock?:JourneyTime}){
 const camera=useRef<THREE.PerspectiveCamera>(null);const {size}=useThree();const initial=sampleShot(chapter,0,wide);
 useFrame(()=>{if(explore||!camera.current)return;const s=sampleShot(chapter,reduced?0:clock?.current??0,wide);camera.current.position.set(...s.position);camera.current.lookAt(...s.target);});
 return <><PerspectiveCamera ref={camera} makeDefault position={initial.position} fov={size.width/size.height<1.45?52:42} near={.1} far={250}/>{explore&&<OrbitControls makeDefault minDistance={6} maxDistance={36} maxPolarAngle={Math.PI/2.15} target={[0,.5,0]} enableDamping={false}/>}</>;
}
export function WorldLights({low=false}:{low?:boolean}){
 const {gl,scene}=useThree();
 useLayoutEffect(()=>{const room=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(gl);const target=pmrem.fromScene(room,.04);const previous=scene.environment;scene.environment=target.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();return()=>{scene.environment=previous;target.dispose()}},[gl,scene]);
 return <><hemisphereLight args={['#f4e5ca','#354a3a',.85]}/><directionalLight position={[-7,14,7]} intensity={2.1} color='#ffe6bd' castShadow={!low} shadow-mapSize={[2048,2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-normalBias={.035} shadow-bias={-.0001}/><directionalLight position={[8,7,-9]} intensity={1.5} color='#bdcfcb'/></>;
}
