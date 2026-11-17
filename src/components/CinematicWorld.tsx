import {createContext,useContext,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame,useLoader,useThree} from '@react-three/fiber';
import {OrbitControls,PerspectiveCamera} from '@react-three/drei';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {Block,Stove,WorldLights as BaseLights,sampleWorld} from './ThreeWorld';
import type {JourneyTime} from './ThreeWorld';

type V3=[number,number,number];
const ROOT='/assets/journey-v3/';
const Assets=createContext(ROOT);
const smooth=(v:number)=>{const p=THREE.MathUtils.clamp(v,0,1);return p*p*(3-2*p)};
type Shot={from:V3;to:V3;at:V3;end?:V3};
const SHOTS:Record<number,Shot[]>={
 0:[{from:[3.4,2.25,4.4],to:[2.9,2.05,3.9],at:[-.1,1.05,0]},
 {from:[.05,1.45,1.85],to:[-.2,1.38,1.6],at:[-.8,1.05,-.06]},
 {from:[2.8,1.95,3.7],to:[2.2,1.85,3.3],at:[-.05,1.12,-.05]}],
 1:[{from:[3.8,2.5,4.2],to:[3.2,2.3,3.8],at:[0,1.1,-.6]},
 {from:[1.3,2.1,2.2],to:[1,1.95,1.9],at:[.65,1.4,-1.2]},
 {from:[-2.1,2.25,3.6],to:[-1.7,2.1,3.2],at:[.3,1.15,-.8]}],
 2:[{from:[1.8,2.3,3.1],to:[1.5,2.1,2.8],at:[0,1.3,-.6]},
 {from:[-2.1,1.6,1.3],to:[-1.9,1.5,1],at:[-1.6,.95,-1.6]},
 {from:[2.8,2.2,2.7],to:[2.4,2.05,2.4],at:[.55,1.2,-.9]}],
 3:[{from:[5.3,2.5,1.7],to:[4.9,2.35,1.5],at:[1,1,-.75]},
 {from:[4,2.1,8],to:[1.8,2.1,8],at:[0,1.1,3.35],end:[-1,1.1,3.35]},
 {from:[-2.6,2.1,3.8],to:[-2.3,1.95,3.5],at:[-.5,1.2,-1.1]}],
 4:[{from:[.05,1.48,1.8],to:[-.1,1.42,1.6],at:[-.8,1.04,-.06]},
 {from:[2.6,2,3.5],to:[2.1,1.85,3.3],at:[-.1,1.05,.1]},
 {from:[3.6,2.25,2.7],to:[3.1,2.05,2.3],at:[.8,1.15,-1.15]}],
 5:[{from:[-4.4,2.5,8.7],to:[-4.8,2.3,8.3],at:[-8,1.1,4]},
 {from:[-5,2.8,8],to:[-4.7,3.3,8.5],at:[-8,1.15,3.4]},
 {from:[-7,6,12],to:[-18,18,25],at:[-6,1,3],end:[0,.4,0]}],
};
const OFFSETS:V3[]=[[-8,0,-4],[0,0,-4],[8,0,-4],[8,0,4],[0,0,4],[-8,0,4]];
export function sampleShot(chapter:number,time:number,wide=false){
 if(wide)return {position:[-18,19,26] as V3,target:[0,.5,0] as V3};
 const i=Math.min(2,Math.floor(Math.max(0,time)/4)),s=SHOTS[chapter][i],p=smooth((time-i*4)/4);
 return {position:s.from.map((n,j)=>THREE.MathUtils.lerp(n,s.to[j],p)) as V3,target:s.at.map((n,j)=>THREE.MathUtils.lerp(n,(s.end??s.at)[j],p)) as V3};
}
export function SceneCamera({chapter,explore,wide=false,reduced=false,clock}:{chapter:number;explore:boolean;wide?:boolean;reduced?:boolean;clock?:JourneyTime}){
 const camera=useRef<THREE.PerspectiveCamera>(null);const {size}=useThree();const initial=sampleShot(chapter,0,wide);
 useFrame(()=>{if(explore||!camera.current)return;const s=sampleShot(chapter,reduced?0:clock?.current??0,wide);camera.current.position.set(...s.position);camera.current.lookAt(...s.target)});
 useLayoutEffect(()=>{if(explore&&camera.current){camera.current.position.set(-18,19,26);camera.current.lookAt(0,.5,0)}},[explore]);
 return <><PerspectiveCamera ref={camera} makeDefault position={initial.position} fov={size.width/size.height<1.45?55:42} near={.05} far={150}/>{explore&&<OrbitControls makeDefault target={[0,.5,0]} minDistance={2.5} maxDistance={50} maxPolarAngle={Math.PI/2.05} enableDamping={false}/>}</>;
}

type ActorRole='inspect'|'photo'|'desk'|'waiting'|'walk'|'greet';
/** Two-bone reach on top of the authored clip: hands meet devices, not empty air. */
function makeReach(root:THREE.Object3D,side:'L'|'R'){
 const bone=(name:string)=>root.getObjectByName(name+side)??root.getObjectByName(name+'.'+side);
 const upper=bone('UpperArm'),lower=bone('LowerArm'),wrist=bone('Wrist');
 const s=new THREE.Vector3(),e=new THREE.Vector3(),w=new THREE.Vector3(),goal=new THREE.Vector3(),dir=new THREE.Vector3(),pole=new THREE.Vector3(),bend=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3();
 const rotation=new THREE.Quaternion(),world=new THREE.Quaternion(),parent=new THREE.Quaternion();
 const turn=(joint:THREE.Object3D,child:THREE.Object3D,target:THREE.Vector3)=>{joint.getWorldPosition(a);child.getWorldPosition(b).sub(a).normalize();a.copy(target).sub(a).normalize();rotation.setFromUnitVectors(b,a);joint.getWorldQuaternion(world);joint.parent!.getWorldQuaternion(parent).invert();joint.quaternion.copy(parent.multiply(rotation.multiply(world)));joint.updateWorldMatrix(false,true)};
 return (target:V3)=>{if(!upper||!lower||!wrist)return;root.updateWorldMatrix(true,true);upper.getWorldPosition(s);lower.getWorldPosition(e);wrist.getWorldPosition(w);goal.set(...target);root.localToWorld(goal);
  const l1=s.distanceTo(e),l2=e.distanceTo(w),distance=Math.min(s.distanceTo(goal),l1+l2-.002);dir.copy(goal).sub(s).normalize();goal.copy(s).addScaledVector(dir,distance);
  pole.set(side==='L'?.8:-.8,-.5,.15).transformDirection(root.matrixWorld);pole.addScaledVector(dir,-pole.dot(dir)).normalize();
  const along=(l1*l1+distance*distance-l2*l2)/(2*distance);bend.copy(s).addScaledVector(dir,along).addScaledVector(pole,Math.sqrt(Math.max(0,l1*l1-along*along)));
  turn(upper,lower,bend);turn(lower,wrist,goal);
 };
}
function Actor({at,rotation=0,worker=false,staff=false,role='inspect',time,clock,before=false}:{at:V3;rotation?:number;worker?:boolean;staff?:boolean;role?:ActorRole;time:number;clock?:JourneyTime;before?:boolean}){
 const asset=useLoader(GLTFLoader,useContext(Assets)+(staff?'advisor.glb':worker?'worker.glb':'marco.glb'));
 const actor=useMemo(()=>{
  const root=clone(asset.scene),materials:THREE.Material[]=[];
  root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;const original=Array.isArray(o.material)?o.material:[o.material];const copied=original.map(m=>{const c=m.clone() as THREE.MeshStandardMaterial;c.roughness=.84;c.side=THREE.FrontSide;
   if(!worker&&!staff&&c.name==='LightBrown')c.color.set('#a95d32');
   if(!worker&&!staff&&c.name==='LightBlue')c.color.set('#203e43');
   materials.push(c);return c});o.material=Array.isArray(o.material)?copied:copied[0];}});
  const mixer=new THREE.AnimationMixer(root);const actions=Object.fromEntries(asset.animations.map(clip=>[clip.name,mixer.clipAction(clip)]));
  for(const action of Object.values(actions)){action.play();action.weight=0;}
  return {root,mixer,actions,materials,head:root.getObjectByName('Head'),left:makeReach(root,'L'),right:makeReach(root,'R')};
 },[asset,worker,staff]);
 useLayoutEffect(()=>{for(const clip of asset.animations){actor.actions[clip.name]=actor.mixer.clipAction(clip);actor.actions[clip.name].play();actor.actions[clip.name].weight=0}return()=>{actor.mixer.stopAllAction();actor.mixer.uncacheRoot(actor.root);actor.materials.forEach(m=>m.dispose());actor.root.traverse(o=>{if(o instanceof THREE.SkinnedMesh)o.skeleton.dispose()})}},[actor,asset]);
 const sample=(t:number)=>{
  let interaction=role==='desk'?(.4+.1*Math.sin(t)):role==='inspect'?smooth((t-7)/2):role==='photo'?smooth((t-3)/1.5):0;
  if(before&&role==='desk')interaction=.12;
  const walk=role==='walk'?1-smooth((t-3.6)/.4):0,wave=role==='greet'?smooth((t-1)/2)*(1-smooth((t-5)/2)):0;
  actor.actions.Idle_Neutral.weight=(1-interaction)*(1-walk)*(1-wave);actor.actions.Interact.weight=interaction;actor.actions.Walk.weight=walk;actor.actions.Wave.weight=wave;
  actor.mixer.setTime(role==='walk'?t*.45:t*.7);
  if(role==='desk'&&!before){actor.left([.2,.94,.38]);actor.right([-.2,.94,.38])}
  if(role==='walk'){actor.left([.22,.98,.42]);actor.right([-.22,.98,.42])}
  if(role==='photo'&&t>=3)actor.right([-.21,1.38,.48]);
  if(actor.head&&role==='photo')actor.head.rotation.x+=.16;
 };
 useLayoutEffect(()=>{sample(time)},[time,actor,role,before]);useFrame(()=>{if(clock)sample(clock.current)});
 return <group position={at} rotation={[0,rotation,0]}><primitive object={actor.root} dispose={null}/>{role==='photo'&&<Phone actor={actor.root}/>}</group>;
}
function Phone({actor}:{actor:THREE.Object3D}){
 const phone=useMemo(()=>{const root=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(.085,.16,.012),new THREE.MeshStandardMaterial({color:'#18232c',metalness:.5,roughness:.3}));root.add(body);const screen=new THREE.Mesh(new THREE.PlaneGeometry(.07,.135),new THREE.MeshBasicMaterial({color:'#9fc3bc'}));screen.position.z=.007;root.add(screen);root.position.set(0,.13,.025);root.rotation.set(Math.PI/2,0,0);return root},[]);
 useLayoutEffect(()=>{const wrist=actor.getObjectByName('WristR')??actor.getObjectByName('Wrist.R');wrist?.add(phone);return()=>{phone.removeFromParent();phone.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose()}})}},[actor,phone]);return null;
}
function Floor({service=false}:{service?:boolean}){
 const root=useContext(Assets);const maps=useLoader(THREE.TextureLoader,[root+'wood-Diffuse.jpg',root+'wood-nor_gl.jpg',root+'wood-Rough.jpg']);
 const textures=useMemo(()=>maps.map((m,i)=>{const t=m.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.colorSpace=i===0?THREE.SRGBColorSpace:THREE.NoColorSpace;t.needsUpdate=true;return t}),[maps]);
 useLayoutEffect(()=>()=>textures.forEach(t=>t.dispose()),[textures]);
 return <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[7,6]}/>{service?<meshStandardMaterial color='#8c9491' roughness={.82}/>:<meshStandardMaterial map={textures[0]} normalMap={textures[1]} roughnessMap={textures[2]} normalScale={new THREE.Vector2(.35,.35)} color='#b8a18a'/>}</mesh>;
}
function Crack(){
 const geometry=useMemo(()=>{const pts:number[]=[];const paths=[[[0,0],[.13,.17],[.2,.38]],[[.13,.17],[.25,.2]],[[0,0],[-.16,.1],[-.28,.25]],[[0,0],[-.08,-.18],[-.2,-.37]],[[0,0],[.18,-.13],[.29,-.33]],[[.18,-.13],[.27,-.1]],[[0,0],[.04,.3],[0,.48]]];for(const path of paths)for(let i=1;i<path.length;i++)pts.push(path[i-1][0],path[i-1][1],0,path[i][0],path[i][1],0);return new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(pts,3))},[]);
 useLayoutEffect(()=>()=>geometry.dispose(),[geometry]);return <lineSegments geometry={geometry} position={[-.8,1.12,-.054]} scale={.75}><lineBasicMaterial color='#e6f0e4' transparent opacity={.92}/></lineSegments>;
}
function Monitor({at,before=false,time,clock,kind='service'}:{at:V3;before?:boolean;time:number;clock?:JourneyTime;kind?:string}){
 const screen=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=640;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return {c,t,last:-1}},[]);
 const paint=(time:number)=>{const step=Math.floor(time/2);if(screen.last===step)return;screen.last=step;const ctx=screen.c.getContext('2d')!;
 const titles:Record<string,string>= {service:'Beschädigte Glasscheibe',lead:'Anfrage von Marco',order:'Vier Öfen',erp:'Bestehendes ERP',delivery:'Lieferstatus',history:'Gemeinsame Historie',website:'Partner werden'};
 const rows:Record<string,string[]>={service:['Foto','Zuständigkeit','Dokumentierte Lösung'],lead:['Anfrage','Zuständige Person','Vertretung'],order:['Vier Öfen','Eindeutige Transaktion','Übergabe an ERP'],erp:['Auftrag','Versand','Status'],delivery:['ERP führt den Auftrag','Versand bestätigt','Status aus dem ERP'],history:['Chur · Locarno','Hamburg · Paris','Eine Partnerbeziehung'],website:['DE',before?'':'IT',before?'':'FR']};
 ctx.fillStyle=before?'#e7ddca':'#edf0e5';ctx.fillRect(0,0,1024,640);ctx.fillStyle='#19382f';ctx.fillRect(0,0,1024,100);ctx.fillStyle='#eee5d3';ctx.font='30px sans-serif';ctx.fillText(kind==='order'?(before?'BESTELLUNG · HEUTE':'HÄNDLERPORTAL · SPÄTERE AUSBAUSTUFE'):kind==='service'?'SERVICE · MARCO':kind==='website'?(before?'WEBSITE · HEUTE':'WEBSITE · NACH DEM MVP'):kind==='erp'?'ERP · FÜHRENDES SYSTEM':kind==='delivery'?'LIEFERSTATUS · INTERNE ANSICHT':'PARTNERCONNECT',32,64);
 ctx.fillStyle='#284d40';ctx.font='bold 40px sans-serif';ctx.fillText(titles[kind]??'Anfrage',42,174);
 const labels=rows[kind]??rows.lead;
 labels.forEach((label,i)=>{ctx.fillStyle='#d7dfd0';ctx.fillRect(42,220+i*110,940,90);ctx.fillStyle=before?'#b47747':'#4c785d';ctx.fillRect(62,242+i*110,45,45);if(!before&&i<=step){ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(72,264+i*110);ctx.lineTo(83,277+i*110);ctx.lineTo(99,250+i*110);ctx.stroke()}ctx.fillStyle='#284739';ctx.font='30px sans-serif';ctx.fillText(label,133,276+i*110)});
 if(before&&kind!=='website'){const note:Record<string,string>={service:'Pflichtangaben fehlen',lead:'Keine klare Zuständigkeit',order:'Manuelle Erfassung',erp:'Manuelle Erfassung',delivery:'Für Marco nicht sichtbar',history:'Postfächer · Excel'};ctx.fillStyle='#f4ebd7';ctx.fillRect(490,240,500,300);ctx.strokeStyle='#b08353';ctx.strokeRect(490,240,500,300);ctx.fillStyle='#8d553b';ctx.font='25px sans-serif';ctx.fillText(note[kind]??'Anfrage',510,290);for(let i=0;i<4;i++){ctx.fillStyle='#bca787';ctx.fillRect(515,330+i*42,365-i*20,8)}}
 // An actual progress change on the monitor, tied to the same chapter clock.
 if(!before){ctx.fillStyle='#c5a26b';ctx.fillRect(42,610,940*smooth(time/9),8)}
 screen.t.needsUpdate=true;
 };
 useLayoutEffect(()=>{screen.last=-1;paint(time)},[before,kind,time]);useLayoutEffect(()=>()=>screen.t.dispose(),[screen]);useFrame(()=>{if(clock)paint(clock.current)});
 return <group position={at}><Block at={[0,0,0]} size={[1.5,.94,.07]} color='#162b2c' round/><mesh position={[0,0,.038]}><planeGeometry args={[1.4,.86]}/><meshBasicMaterial map={screen.t} toneMapped={false}/></mesh><Block at={[0,-.58,0]} size={[.07,.3,.07]} metal={.7}/><Block at={[0,-.73,.1]} size={[.55,.03,.3]} metal={.6}/></group>;
}
function Environment({service=false,children}:{service?:boolean;children?:React.ReactNode}){return <>
 <Floor service={service}/><Block at={[0,-.15,0]} size={[7,.28,6]} color='#343e39' round/>
 <Block at={[0,1.65,-2.7]} size={[7,3.3,.16]} color={service?'#536768':'#334b40'}/>
 {service?<><Block at={[-2.5,1.55,-2.57]} size={[1.1,1.5,.06]} color='#a79c82'/>{[-.5,-.25,0,.25,.5].map(x=><Block key={x} at={[-2.5+x,1.55,-2.52]} size={[.016,1.4,.02]} color='#53605b'/>)}</>:<>{Array.from({length:17},(_,i)=><Block key={i} at={[-3.2+i*.4,1.65,-2.56]} size={[.07,3.25,.1]} color='#8d7554'/>)}<Block at={[-.8,.07,-.45]} size={[2.1,.12,1.7]} color='#777267' round/></>}
 <Block at={[-3.45,1.65,-.9]} size={[.12,3.3,3.6]} color={service?'#9faaa0':'#a99d83'}/>
 {[-1.6,-.3,1].map(z=><group key={z}><Block at={[-3.36,1.85,z]} size={[.035,1.65,1.18]} color='#587e79' metal={.35}/>{[1,2.7].map(y=><Block key={y} at={[-3.3,y,z]} size={[.06,.07,1.25]} color='#c5b692'/>)}{[-.62,.62].map(dz=><Block key={dz} at={[-3.3,1.85,z+dz]} size={[.06,1.75,.06]} color='#c5b692'/>)}</group>)}
 {children}
 </>}
function Slice({chapter,before,time,clock,actors=true}:{chapter:number;before:boolean;time:number;clock?:JourneyTime;actors?:boolean}){
 const dynamic=useRef<THREE.Group>(null);const service=chapter===4;
 useLayoutEffect(()=>{if(dynamic.current)sampleWorld(dynamic.current,time,chapter)},[time,chapter]);useFrame(()=>{if(clock&&dynamic.current)sampleWorld(dynamic.current,clock.current,chapter)});
 return <group><Environment service={service}>
 <group ref={dynamic}><Stove position={[-.8,.14,-.45]} scale={.9} ember={!service}/></group>
 {service&&<Crack/>}
 {actors&&<Actor at={[.6,.01,.45]} rotation={-1.1} role={service?'photo':'inspect'} time={time} clock={clock}/>}
 {service&&<><Block at={[1.45,.76,-1.65]} size={[2.3,.12,.9]} color='#9c7756' round/>{[.45,2.45].map(x=><Block key={x} at={[x,.36,-1.65]} size={[.08,.72,.65]} color='#33423b'/>)}<Monitor at={[1.5,1.55,-1.85]} before={before} time={time} clock={clock}/><Actor at={[1.45,.01,-.85]} rotation={Math.PI} role={before?'waiting':'desk'} worker time={time} clock={clock}/></>}
 {!service&&<><Stove position={[-2.3,.03,-1.6]} scale={.5}/><Block at={[1.7,.27,-1.8]} size={[1.8,.5,.65]} color='#836449' round/><group position={[1.7,.35,-1.8]} scale={.7}><Monitor at={[0,1.4,0]} kind='website' before={before} time={time} clock={clock}/></group></>}
 </Environment>
 <pointLight position={[-.8,1,.05]} color={service?'#bed4d6':'#ff8d35'} intensity={service?2:5} distance={5}/>
 </group>;
}
function Desk({at=[0,0,0]}:{at?:V3}){return <group position={at}>
 <Block at={[0,.79,0]} size={[2.8,.11,1.1]} color='#916e4b' round/>{[-1.2,1.2].map(x=><Block key={x} at={[x,.39,0]} size={[.06,.78,.85]} color='#33463d' metal={.65}/>)}
 <Block at={[0,.865,.31]} size={[.59,.025,.21]} color='#223733' round/>{Array.from({length:9},(_,i)=><Block key={i} at={[-.25+i*.06,.882,.31]} size={[.035,.01,.13]} color='#8a9990'/>)}
 <Block at={[.58,.87,.32]} size={[.11,.05,.17]} color='#53645a' round/>
 </group>}
function Papers({at}:{at:V3}){return <group position={at}>{[0,1,2,3].map(i=><group key={i} rotation={[0,(i-2)*.13,0]}><Block at={[0,i*.016,0]} size={[.52,.012,.38]} color='#dfd8bd'/>{[0,1,2].map(j=><Block key={j} at={[0,i*.016+.008,-.1+j*.08]} size={[.36,.002,.013]} color='#8d9487'/>)}</group>)}</group>}
function Plant({at}:{at:V3}){return <group position={at}><mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.29,.22,.56,24]}/><meshStandardMaterial color='#b2ab92' roughness={.9}/></mesh>{[0,1,2,3,4,5].map(i=><group key={i} rotation={[0,i*2.4,0]}><mesh position={[0,.86+i*.08,.15]} rotation={[.35,0,0]} scale={[.12,.44,.035]} castShadow><sphereGeometry args={[1,12,16]}/><meshStandardMaterial color={i%2?'#365a43':'#678365'} roughness={.82}/></mesh></group>)}</group>}
function Transfer({before,time,clock,from,to}:{before:boolean;time:number;clock?:JourneyTime;from:V3;to:V3}){
 const ref=useRef<THREE.Group>(null);const sample=(t:number)=>{if(!ref.current)return;const p=before?0:smooth((t-3)/5);ref.current.position.set(...from.map((v,i)=>THREE.MathUtils.lerp(v,to[i],p)) as V3);ref.current.scale.setScalar(.75+.25*Math.sin(Math.PI*p));ref.current.visible=t<9||before};
 useLayoutEffect(()=>sample(time),[time,before]);useFrame(()=>{if(clock)sample(clock.current)});
 return <group ref={ref}><Block size={[.31,.22,.035]} color={before?'#c19062':'#d7d9be'} round/><Block at={[0,.03,.022]} size={[.2,.02,.008]} color='#5c7d63'/><Block at={[-.03,-.03,.022]} size={[.14,.015,.008]} color='#788b6d'/></group>;
}
function Office({chapter,before,time,clock,actors}:{chapter:number;before:boolean;time:number;clock?:JourneyTime;actors:boolean}){
 const order=chapter===2,history=chapter===5;const wall=history?'#314e42':order?'#6c7770':'#c1b79f';
 return <group><Floor service={order}/><Block at={[0,-.15,0]} size={[7,.28,6]} color='#465047' round/>
 <Block at={[0,1.6,-2.7]} size={[7,3.2,.16]} color={wall}/>
 {order?<><Block at={[-1.6,.8,-1.8]} size={[3.3,.13,.9]} color='#ac8254'/>{[0,1,2,3].map(i=><Stove key={i} position={[-2.8+i*.8,.88,-1.8]} scale={.2} ember={false}/>)}<Block at={[-1.6,.4,-1.8]} size={[3,.65,.65]} color='#3d504a'/></>:<>{[-2.7,-1.8,-.9,0,.9,1.8,2.7].map(x=><Block key={x} at={[x,2.15,-2.58]} size={[.025,1.8,.05]} color={history?'#967950':'#788d83'}/>)}<Block at={[0,2.15,-2.59]} size={[6.5,1.8,.018]} color={history?'#415d4a':'#9caf9f'} metal={.15}/></>}
 <Plant at={[-2.9,0,1.5]}/><Plant at={[2.85,0,-1.8]}/>
 <Desk at={order?[.65,0,-.6]:[.7,0,-1.15]}/>
 <Monitor at={order?[.65,1.59,-.85]:[.7,1.59,-1.4]} kind={history?'history':order?'order':'lead'} before={before} time={time} clock={clock}/>
 {before&&<Papers at={order?[1.7,.86,-.4]:[1.7,.86,-.95]}/>}
 {actors&&<Actor at={order?[.4,0,.35]:[-1.2,0,.55]} rotation={order?Math.PI:1.3} role={order?'desk':history?'greet':before?'waiting':'inspect'} time={time} clock={clock} before={before}/>}
 {!order&&<Actor at={[.7,0,-.23]} rotation={Math.PI} staff role={before?'waiting':'desk'} time={time} clock={clock} before={before}/>}
 {order?<group position={[2.6,.5,-1.8]} scale={.7}><Monitor at={[0,1.55,0]} kind='erp' before={before} time={time} clock={clock}/></group>:<group position={[-1.85,.4,-1.2]} scale={.55}><Monitor at={[0,1.5,0]} kind={history?'history':'lead'} before={before} time={time} clock={clock}/></group>}
 <Block at={order?[2.6,.52,-1.73]:[-1.85,.41,-1.15]} size={order?[.7,1.04,.6]:[.75,.82,.48]} color='#6b7d70' round/>
 <Transfer from={order?[.8,1.5,-.7]:[-1.5,1.5,-.9]} to={order?[2.3,1.5,-1.6]:[.5,1.5,-1.25]} before={before} time={time} clock={clock}/>
 <pointLight position={[-1,2.8,1]} intensity={history?6:3} color={order?'#c1d1df':'#f3d1a1'} distance={7}/>
 </group>;
}
function Parcel({at=[0,0,0],scale=1}:{at?:V3;scale?:number}){return <group position={at} scale={scale}>
 <Block at={[0,.45,0]} size={[.72,.9,.64]} color='#b89c72' round/>{[-.2,.2].map(x=><Block key={x} at={[x,.45,.325]} size={[.035,.9,.012]} color='#ddd4ad'/>)}<Block at={[0,.61,.337]} size={[.22,.18,.009]} color='#e6e5d2'/>{[0,1,2,3,4,5].map(i=><Block key={i} at={[-.08+i*.03,.61,.344]} size={[.012,.1,.004]} color='#5e685b'/>)}</group>}
function Truck({time,clock}:{time:number;clock?:JourneyTime}){
 const gltf=useLoader(GLTFLoader,useContext(Assets)+'truck.glb');const vehicle=useMemo(()=>{const model=gltf.scene.clone(true);model.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true}});const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());const scale=4.3/Math.max(size.x,size.z);model.position.set(-center.x,-bounds.min.y,-center.z);const wheels:THREE.Object3D[]=[];model.traverse(o=>{if(/Wheel/.test(o.name))wheels.push(o)});return {model,scale,wheels,rotations:wheels.map(w=>w.rotation.clone())}},[gltf]);
 const group=useRef<THREE.Group>(null);const sample=(t:number)=>{if(group.current){const p=smooth((t-4)/4);group.current.position.x=2.1-p*9;vehicle.wheels.forEach((w,i)=>{w.rotation.copy(vehicle.rotations[i]);w.rotateX(-p*25)})}};
 useLayoutEffect(()=>sample(time),[time,vehicle]);useFrame(()=>{if(clock)sample(clock.current)});
 return <group ref={group} position={[2.1,.02,3.35]} rotation={[0,-Math.PI/2,0]} scale={vehicle.scale}><primitive object={vehicle.model} dispose={null}/></group>;
}
function Logistics({before,time,clock,actors}:{before:boolean;time:number;clock?:JourneyTime;actors:boolean}){
 const cart=useRef<THREE.Group>(null);const sample=(t:number)=>{if(cart.current){const p=smooth(t/4);cart.current.position.set(3,0,-1.4+p*1.5)}};
 useLayoutEffect(()=>sample(time),[time]);useFrame(()=>{if(clock)sample(clock.current)});
 return <group><Floor service/><Block at={[0,-.15,0]} size={[7,.28,6]} color='#465047' round/>
 <Block at={[0,-.04,3.6]} size={[9,.05,2.8]} color='#3c4b43'/>
 <Block at={[0,1.6,-2.7]} size={[7,3.2,.16]} color='#7a8b84'/>
 {[-2,0,2].map(x=><group key={x}>{[-.78,.78].map(dx=><Block key={dx} at={[x+dx,1.2,-2.25]} size={[.08,2.4,.12]} color='#b9894b' metal={.5}/>)}{[.15,1.2,2.25].map(y=><group key={y}><Block at={[x,y,-2.25]} size={[1.75,.09,.8]} color='#53645c' metal={.65}/>{[-.4,.4].map(dx=><Parcel key={dx} at={[x+dx,y+.05,-2.25]} scale={.8}/>)}</group>)}</group>)}
 {[-2,-1,0,1,2].map(x=><Block key={x} at={[x,.01,.4]} size={[.48,.012,.035]} color='#dcc280'/>)}
 <Truck time={time} clock={clock}/>
 <group ref={cart}><Block at={[0,.12,0]} size={[1,.12,.9]} color='#676e60'/><Parcel at={[0,.19,0]}/>{[-.35,.35].flatMap(x=>[-.3,.3].map(z=><mesh key={`${x}${z}`} position={[x,.08,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.08,.08,.08,12]}/><meshStandardMaterial color='#28362d'/></mesh>))}{[-.3,.3].map(x=><Block key={x} at={[x,.55,-.48]} size={[.04,.9,.04]} color='#79847a' metal={.6}/>)}<Block at={[0,.98,-.48]} size={[.64,.045,.045]} color='#405149' metal={.6}/>{actors&&<Actor at={[0,0,-.9]} role='walk' worker time={time} clock={clock}/>}</group>
 <group position={[-2.1,.25,-.8]} scale={.72}><Monitor at={[0,1.55,0]} kind='delivery' before={before} time={time} clock={clock}/></group>
 <Block at={[-2.1,.4,-.75]} size={[.85,.8,.6]} color='#6b7d70' round/>
 {actors&&<Actor at={[-1.6,0,-.15]} rotation={-2.3} worker role={before?'waiting':'desk'} time={time} clock={clock}/>}</group>;
}
export function World({chapter=0,time=0,clock,before=false,onHotspot,overview=false,assetRoot=ROOT}:{chapter?:number;time?:number;clock?:JourneyTime;before?:boolean;onHotspot?:(n:number)=>void;overview?:boolean;assetRoot?:string}){
 const all=overview||chapter===5;
 return <Assets.Provider value={assetRoot}><group name={all?'journey-overview':'journey-story'}>{(all?[0,1,2,3,4,5]:[chapter]).map(i=><group key={i} position={all?OFFSETS[i]:[0,0,0]}>
 {i===0||i===4?<Slice chapter={i} before={before} time={i===chapter?time:0} clock={i===chapter?clock:undefined} actors={i===chapter}/>:i===3?<Logistics before={before} time={i===chapter?time:0} clock={i===chapter?clock:undefined} actors={i===chapter}/>:<Office chapter={i} before={before} time={i===chapter?time:0} clock={i===chapter?clock:undefined} actors={i===chapter}/>}
 {all&&onHotspot&&<mesh position={[0,.06,2.85]} onClick={e=>{e.stopPropagation();onHotspot(i)}}><boxGeometry args={[6.7,.06,.22]}/><meshStandardMaterial color={i===chapter?'#d5b87b':'#687869'}/></mesh>}
 </group>)}{all&&<Block at={[0,-.22,0]} size={[24,.2,1.6]} color='#6b7464'/>}<mesh rotation={[-Math.PI/2,0,0]} position={[0,-.3,0]} receiveShadow><planeGeometry args={[150,150]}/><meshStandardMaterial color='#172922' roughness={1}/></mesh></group></Assets.Provider>;
}
export function WorldLights({low=false}:{low?:boolean}){return <><BaseLights low={low}/><spotLight position={[1,5,3]} angle={.65} penumbra={1} intensity={42} color='#ffe1b2'/></>}
