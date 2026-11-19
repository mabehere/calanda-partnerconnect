import {useLayoutEffect,useMemo} from 'react';
import {AbsoluteFill,Composition,Sequence,Html5Audio,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import * as THREE from 'three';
import {Camera,Character,Ground,PALETTE,PilotWorld,SoftStove,SoftVan,StudioLights,VehicleWorld} from './SoftWorld';
import {ease,FPS,PILOT,VOICE_LINES,VOICE_SECONDS} from './timing';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';

const FONT='Manrope, sans-serif';
function EnvelopeIcon(){return <svg viewBox='0 0 90 64' width='70' height='50'><rect x='4' y='5' width='82' height='54' rx='12' fill='#f5e8cc' stroke='#be754f' strokeWidth='3'/><path d='M9 13L45 37L81 13' fill='none' stroke='#be754f' strokeWidth='3' strokeLinecap='round'/></svg>}
function Check(){return <svg width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='24' fill='#426e59'/><path d='M13 24l7 7 15-16' fill='none' stroke='#fff8e7' strokeWidth='4' strokeLinecap='round' strokeLinejoin='round'/></svg>}
function Flow({chapter,time}:{chapter:number;time:number}){const p=ease((time-(chapter===0?3.1:.65))/(chapter===0?1.1:3.4)),visible=p>0&&p<1;return <>
 {chapter===0&&visible&&<div style={{position:'absolute',left:720+p*640,top:460-Math.sin(p*Math.PI)*130-p*90,transform:`rotate(${-8+16*p}deg) scale(.65)`,opacity:Math.sin(p*Math.PI)}}><EnvelopeIcon/></div>}
 {chapter===1&&time>.8&&<svg style={{position:'absolute',left:880,top:535,overflow:'visible'}} width='280' height='80'><path d='M0 0 Q85 70 245 12' fill='none' stroke='#aa7654' strokeWidth='3' pathLength='1' strokeDasharray='1' strokeDashoffset={1-p}/>{p>.9&&<path d='M231 4l16 7-7 16' fill='none' stroke='#aa7654' strokeWidth='3' strokeLinecap='round'/>}{visible&&<circle cx={245*p} cy={Math.sin(p*Math.PI)*32+12*p} r='7' fill='#aa7654'/>}</svg>}
 </>}
function Process({chapter,frame}:{chapter:number;frame:number}){
 const t=frame/FPS,enter=ease((t-(chapter===0?3.15:.15))/.45),done=chapter===1?ease((t-4.65)/.5):0;
 return <div style={{position:'absolute',left:chapter===0?1390:700,top:chapter===0?315:350,width:430,boxSizing:'border-box',opacity:enter,transform:`translateY(${(1-enter)*20}px)`,padding:'23px 24px',border:'1px solid #d1c7b3',borderRadius:24,background:'#fff9eaf5',boxShadow:'0 18px 45px #314d3420',display:'flex',alignItems:'center',gap:16}}>
 {done>.5?<Check/>:<EnvelopeIcon/>}<div><div style={{fontSize:14,letterSpacing:2,color:'#96724d',marginBottom:6}}>{chapter===0?'ERSTER KONTAKT':'PARTNERCONNECT · CRM'}</div><div style={{fontSize:26,color:PALETTE.ink,fontWeight:600}}>{chapter===0?'Anfrage gesendet':done>.5?'Klar zugeordnet':'Anfrage eingegangen'}</div>{chapter===1&&<div style={{fontSize:20,marginTop:8,color:'#50715f'}}>{done>.5?'Nächster Schritt bereit':'Wird zugeordnet …'}</div>}</div>
 {chapter===1&&done<.5&&<div style={{width:90,height:6,background:'#dbe2d4',borderRadius:8,overflow:'hidden'}}><div style={{width:`${ease((t-.5)/4)*100}%`,height:'100%',background:'#aa7654'}}/></div>}
 </div>;
}
function Shot({chapter}:{chapter:number}){const frame=useCurrentFrame(),t=frame/FPS;return <AbsoluteFill>
 <ThreeCanvas width={1920} height={1080} dpr={1} shadows={{type:THREE.PCFShadowMap}} camera={{fov:39,position:[3.8,3.1,7.8]}} gl={{antialias:true}}><color attach='background' args={['#eceae5']}/><StudioLights/><Camera chapter={chapter} time={t}/><PilotWorld chapter={chapter} time={t}/></ThreeCanvas>
 <div style={{position:'absolute',left:90,top:135,fontSize:65,lineHeight:1.12,letterSpacing:-2.5,color:PALETTE.ink}}>{chapter===0?<>Ein Funke<br/>Interesse.</>:<>Eine Anfrage.<br/>Ein nächster Schritt.</>}</div>
 <Flow chapter={chapter} time={t}/><Process chapter={chapter} frame={frame}/>
 </AbsoluteFill>}
function Pilot(){const frame=useCurrentFrame(),chapter=frame<PILOT.chapterBreak?0:1;const line=PILOT.voiceStarts.findIndex((start,i)=>frame>=start&&frame<start+Math.ceil(VOICE_SECONDS[i]*FPS));const wipe=frame>=174&&frame<190?Math.sin((frame-174)/16*Math.PI):0;return <AbsoluteFill style={{fontFamily:FONT,background:PALETTE.cream}}>
 <Sequence from={0} durationInFrames={PILOT.chapterBreak} name='01 — Entdecken'><Shot chapter={0}/></Sequence>
 <Sequence from={PILOT.chapterBreak} durationInFrames={PILOT.duration-PILOT.chapterBreak} name='02 — Partner gewinnen'><Shot chapter={1}/></Sequence>
 <AbsoluteFill style={{background:PALETTE.cream,opacity:Math.max(0,wipe),pointerEvents:'none'}}/>
 <div style={{position:'absolute',top:55,left:90,right:90,display:'flex',justifyContent:'space-between',color:PALETTE.green,fontSize:19,letterSpacing:4}}><span style={{fontWeight:600}}>CALEIRA <span style={{fontWeight:400,opacity:.65}}> / FROM FIRE TO FLOW</span></span><span>0{chapter+1} / 06 · {chapter===0?'ENTDECKEN':'PARTNER GEWINNEN'}</span></div>
 {line>=0&&<div style={{position:'absolute',bottom:58,left:180,right:180,textAlign:'center'}}><span style={{display:'inline-block',padding:'19px 34px',borderRadius:18,fontSize:33,lineHeight:1.35,color:'#fff9eb',background:'#29483fee',boxShadow:'0 8px 30px #24413b14'}}>{VOICE_LINES[line]}</span></div>}
 <div style={{position:'absolute',bottom:0,height:5,width:`${(frame+1)/PILOT.duration*100}%`,background:PALETTE.copper}}/>
 <Sequence from={PILOT.voiceStarts[0]} name='Voice — Showroom'><Html5Audio src={staticFile('audio/voice-1.wav')} volume={.92}/></Sequence>
 <Sequence from={PILOT.voiceStarts[1]} name='Voice — Anfrage'><Html5Audio src={staticFile('audio/voice-2.wav')} volume={.92}/></Sequence>
 <Sequence from={PILOT.voiceStarts[2]} name='Voice — Zuständigkeit'><Html5Audio src={staticFile('audio/voice-3.wav')} volume={.92}/></Sequence>
 <Sequence from={PILOT.voiceStarts[3]} name='Voice — Nächster Schritt'><Html5Audio src={staticFile('audio/voice-4.wav')} volume={.92}/></Sequence>
 <Html5Audio src={staticFile('audio/music.wav')} volume={1}/><Html5Audio src={staticFile('audio/sound-design.wav')} volume={1}/>
 </AbsoluteFill>}
function Vehicle(){const frame=useCurrentFrame(),t=frame/FPS;return <AbsoluteFill style={{fontFamily:FONT,background:PALETTE.cream}}><ThreeCanvas width={1920} height={1080} shadows={{type:THREE.PCFShadowMap}} camera={{fov:36,position:[0,2.1,12.6]}} gl={{antialias:true}}><color attach='background' args={['#eceae5']}/><StudioLights/><VehicleWorld time={t}/></ThreeCanvas><div style={{position:'absolute',top:80,left:90,color:PALETTE.ink,fontSize:50}}>Weich in der Form. Präzise in Bewegung.</div><div style={{position:'absolute',bottom:100,left:90,color:PALETTE.green,fontSize:30}}>{t<1?'Stillstand':t<4?'Fahrt · Raddrehung aus zurückgelegter Distanz':'Stillstand · Räder stehen'}<div style={{fontSize:22,marginTop:15,opacity:.7}}>V4 · Seitenansicht · 4 lokale Radnaben · reproduzierbares Seeking</div></div></AbsoluteFill>}
function Legacy({kind}:{kind:string}){const gltf=useLoader(GLTFLoader,staticFile(`legacy/${kind}.glb`));const root=useMemo(()=>{const r=clone(gltf.scene);r.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(r),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());const s=kind==='truck'?4.3/Math.max(size.x,size.z):2.05/size.y;r.scale.multiplyScalar(s);r.position.set(-c.x*s,-box.min.y*s,-c.z*s);r.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true}});return r},[gltf,kind]);useLayoutEffect(()=>{const mixer=new THREE.AnimationMixer(root);const clip=gltf.animations.find(a=>/idle/i.test(a.name));if(clip){mixer.clipAction(clip).play();mixer.setTime(.7)}return()=>{mixer.stopAllAction()}},[root,gltf]);return <primitive object={root}/>}
function Asset({kind}:{kind:string}){const f=useCurrentFrame(),angle=Math.floor(f/30)*Math.PI/2;return <AbsoluteFill style={{background:PALETTE.cream,fontFamily:FONT}}><ThreeCanvas width={1200} height={1000} shadows={{type:THREE.PCFShadowMap}} camera={{fov:35,position:[0,2.6,6]}} gl={{antialias:true}}><color attach='background' args={['#eceae5']}/><StudioLights/><Camera chapter={0} time={0} test angle={angle} distance={kind.includes('truck')||kind==='van'?7.4:6}/><Ground/>{kind.startsWith('legacy-')?<Legacy kind={kind.slice(7)}/>:kind==='marco'?<group position={[0,-.08,0]}><Character/></group>:kind==='advisor'?<group position={[0,-.08,0]}><Character advisor/></group>:kind==='stove'?<group position={[0,-.045,0]}><SoftStove/></group>:<SoftVan/>}</ThreeCanvas><div style={{position:'absolute',top:35,left:40,fontSize:28,color:PALETTE.ink}}>{kind} · {['Front','Rechts','Rückseite','Links'][Math.floor(f/30)]}</div></AbsoluteFill>}
export function V4Root(){return <>
 <Composition id='CaleiraV4Pilot' component={Pilot} durationInFrames={PILOT.duration} fps={FPS} width={1920} height={1080}/>
 <Composition id='CaleiraV4VehicleTest' component={Vehicle} durationInFrames={150} fps={FPS} width={1920} height={1080}/>
 <Composition id='CaleiraV4AssetReview' component={Asset} durationInFrames={120} fps={FPS} width={1200} height={1000} defaultProps={{kind:'marco'}}/>
 </>}




