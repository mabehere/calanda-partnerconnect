import {Component,useEffect,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {World,SceneCamera,WorldLights as JourneyLights} from './CinematicWorld';
import {WorldLights,Stove,Block,sampleWorld} from './ThreeWorld';
import {Play,Pause,Rotate3D,Film,MoveUpRight,ArrowRight,RotateCcw,Maximize,Minimize,Gauge} from 'lucide-react';
import {PCFShadowMap,type Group} from 'three';
import {CASE,PLAN,number} from '../data/case';
export class GraphicsBoundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<div className="graphics-fallback"><h3>Die Journey bleibt verfügbar.</h3><p>WebGL ist auf diesem Gerät nicht verfügbar. Nutzen Sie den lokalen Film.</p><video controls muted src="/media/caleira-customer-journey.mp4"/></div>:this.props.children}}
function JourneyRuntime({clock,playing,chapter,onNext,progress}:{clock:{current:number};playing:boolean;chapter:number;onNext:()=>void;progress:React.RefObject<HTMLDivElement|null>}){
 const {gl}=useThree();const measured=useRef(0);
 useFrame((_,dt)=>{if(playing&&!document.hidden){clock.current+=Math.min(dt,.1);if(clock.current>=12){clock.current=0;onNext()}}if(progress.current)progress.current.style.transform=`scaleX(${clock.current/12})`;
 gl.domElement.dataset.time=clock.current.toFixed(3);measured.current+=dt;if(measured.current>.5||!gl.domElement.dataset.calls){measured.current=0;gl.domElement.dataset.chapter=String(chapter);gl.domElement.dataset.time=clock.current.toFixed(3);gl.domElement.dataset.calls=String(gl.info.render.calls);gl.domElement.dataset.triangles=String(gl.info.render.triangles);gl.domElement.dataset.geometries=String(gl.info.memory.geometries);gl.domElement.dataset.textures=String(gl.info.memory.textures);}},-1);return null;
}
const chapters=['Entdecken','Partner gewinnen','Bestellen','Liefern','Service','Verbunden'];
const descriptions=['Ein neuer Fachpartner entdeckt die Öfen im Caleira-Showroom.','Die Anfrage erhält eine Zuständigkeit und einen nächsten Schritt.','Marco bestellt vier Öfen. Das spätere Portal übergibt an das ERP.','Das ERP bestätigt den Versand. Marco sieht den Lieferstatus.','Eine beschädigte Glasscheibe wird zum nachvollziehbaren Servicefall.','Chur. Locarno. Hamburg. Paris. Eine gemeinsame Partnerbeziehung.'];
// Inhalt je Moment. Zahlen stammen aus src/data/case.ts (Case-Fakten) bzw. docs/case-facts.md (abgeleitet). «next» beschreibt Ziele, keine Messwerte.
type Moment={phase:string;quote:string;value:string;unit:string;label:string;today:string;next:string;req:string;mvp:boolean;live?:number};
const A=CASE.acquisition,O=CASE.orders,S=CASE.service;
const MOMENTS:Moment[]=[
 {phase:'Awareness',quote:'«Schöne Öfen. Aber wie werde ich Partner?»',value:String(A.requests),unit:'Anfragen',label:'von Fachbetrieben pro Monat',today:'Die Website ist einsprachig. Marco aus Locarno liest sie in einer Fremdsprache.',next:'Dreisprachige Website mit eigenem Eingang für Ofenbauer.',req:'R6',mvp:false},
 {phase:'Consideration',quote:'«Ich habe angefragt. Hört mich jemand?»',value:String(A.responseDays),unit:'Arbeitstage',label:'bis zur ersten persönlichen Antwort · Median',today:`${A.qualified-A.newPartners} von ${A.qualified} qualifizierten Anfragen werden nie Partner.`,next:`Ziel: Antwort nach ${PLAN.targets.responseDays} Arbeitstag. Jede Anfrage hat eine zuständige Person und eine Vertretung.`,req:'R2',mvp:true,live:7},
 {phase:'Purchase',quote:'«Vier Öfen. Ist die Bestellung angekommen?»',value:`${O.manualShare} %`,unit:'von Hand',label:`von ${number(O.monthly)} Bestellungen pro Monat`,today:`Jemand tippt die Bestellung ins ERP ab. ${O.minutes} Minuten pro Bestellung, ${O.monthly*O.manualShare/100*O.minutes/60} Stunden im Monat.`,next:'Das Portal übergibt direkt ans ERP. Jede Bestellung kommt genau einmal an.',req:'R4',mvp:false,live:9},
 {phase:'Purchase',quote:'«Wann kommt die Ware? Meine Kundin fragt.»',value:String(O.monthly*12/CASE.partners),unit:'Bestellungen',label:'pro Partner und Jahr · Durchschnitt',today:'Der Lieferstatus steht im ERP. Marco sieht ihn nicht.',next:'Wer Marco am Telefon hat, sieht den Status aus dem ERP. Später sieht Marco ihn selbst im Portal.',req:'R1 · R7',mvp:true},
 {phase:'Retention',quote:'«Die Scheibe ist gesprungen. Meine Kundin friert.»',value:String(S.clarificationDays),unit:'Arbeitstage',label:'bis ein Servicefall geklärt ist · Median',today:`${S.incompleteShare} % der ${S.monthly} Fälle pro Monat kommen unvollständig an. Dann beginnt das Hin und Her.`,next:`Pflichtangaben werden beim Erfassen geprüft. Ziel: noch ${PLAN.targets.incompleteShare} % unvollständig.`,req:'R5',mvp:true,live:10},
 {phase:'Advocacy',quote:'«Die kennen mich. Bei denen bleibe ich.»',value:String(CASE.partners),unit:'Partner',label:`an ${CASE.locations.length} Standorten`,today:'Was Caleira über Marco weiss, liegt in persönlichen Postfächern und Excel-Listen.',next:`Eine gemeinsame Historie für ${CASE.locations.slice(0,3).join(', ')} und ${CASE.locations[3]}.`,req:'R1',mvp:true},
];
// Marcos Erleben je Moment, 0 = Tiefpunkt, 1 = Hochpunkt. Illustrativ, keine Messung.
const MOOD={today:[.72,.34,.56,.4,.06,.3],next:[.76,.8,.76,.8,.5,.94]};
const PHASES:[string,number][]=[['Awareness',1],['Consideration',1],['Purchase',2],['Retention',1],['Advocacy',1]];
const px=(i:number)=>(i+.5)*100,py=(v:number)=>88-v*76;
const curve=(v:number[])=>v.map((m,i)=>i===0?`M${px(i)} ${py(m)}`:`C${px(i)-50} ${py(v[i-1])} ${px(i)-50} ${py(m)} ${px(i)} ${py(m)}`).join(' ');
export default function Journey({reduced=false}:{reduced?:boolean}){
 const [chapter,setChapter]=useState(0),[playing,setPlaying]=useState(!reduced),[explore,setExplore]=useState(false),[before,setBefore]=useState(false),[film,setFilm]=useState(false),[wide,setWide]=useState(false),[low,setLow]=useState(false),[fullscreen,setFullscreen]=useState(false);
 const clock=useRef(0),progress=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 useEffect(()=>{if(reduced)setPlaying(false)},[reduced]);
 useEffect(()=>{const update=()=>setFullscreen(document.fullscreenElement===stage.current);document.addEventListener('fullscreenchange',update);return()=>document.removeEventListener('fullscreenchange',update)},[]);
 const select=(n:number)=>{clock.current=0;setChapter(n);setPlaying(false);setFilm(false);setExplore(false)};
 const replay=()=>{clock.current=0;setExplore(false);if(film&&video.current){video.current.currentTime=0;if(!reduced)void video.current.play()}setPlaying(!reduced)};
 const togglePlay=()=>{if(film&&video.current){if(video.current.paused)void video.current.play();else video.current.pause()}else setPlaying(v=>!v)};
 const m=MOMENTS[chapter];
 return <div className={`journey ${before?'is-before':'is-after'}`} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.stopPropagation()}}><div className="journey-main"><div className="journey-stage" ref={stage}>
 {film?<video ref={video} className="journey-video" controls muted autoPlay={!reduced} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={e=>{const t=e.currentTarget.currentTime;setChapter(Math.min(5,Math.floor(t/12)));setBefore(t>=12&&t<16)}} src="/media/caleira-customer-journey.mp4" aria-label="72 Sekunden Customer-Journey-Film"/>:<GraphicsBoundary><Canvas frameloop={playing&&!reduced&&!explore?'always':'demand'} shadows={low?false:{type:PCFShadowMap}} dpr={low?1:[1,1.5]} gl={{antialias:true,preserveDrawingBuffer:true}}><color attach="background" args={['#202e28']}/><JourneyLights low={low}/><JourneyRuntime clock={clock} playing={playing&&!reduced&&!explore} chapter={chapter} onNext={()=>setChapter(c=>(c+1)%6)} progress={progress}/><SceneCamera chapter={chapter} explore={explore} wide={wide} reduced={reduced} clock={clock}/><World overview={wide||explore} chapter={chapter} clock={clock} before={before} onHotspot={select}/></Canvas></GraphicsBoundary>}
 <div className="world-label"><span className="live-dot"/>{film?'CINEMATIC FILM · 72 S':before?'VORHER · FRAGMENTIERT':'PARTNERCONNECT · MINIATURWELT'}</div>
 <div className="toolbar stage-toolbar">
 <button onClick={togglePlay} aria-label={playing?'Film-Modus pausieren':'Film-Modus fortsetzen'}>{playing?<Pause size={15}/>:<Play size={15}/>}</button>
 <button onClick={replay} aria-label="Kapitel erneut abspielen" title="Replay"><RotateCcw size={15}/></button>
 <button className={explore?'selected':''} aria-pressed={explore} onClick={()=>{setExplore(!explore);setFilm(false);setPlaying(false)}}><Rotate3D size={15}/>Explore</button>
 <button aria-pressed={wide} onClick={()=>setWide(!wide)}><MoveUpRight size={15}/>Kamera</button>
 <button aria-pressed={before} onClick={()=>setBefore(!before)}>{before?'Nachher':'Vorher'}</button>
 <button onClick={()=>{setFilm(!film);setPlaying(false);if(!film){clock.current=0;setChapter(0);setBefore(false)}}}><Film size={15}/>{film?'3D':'Film'}</button>
 <button aria-label={low?'Hohe 3D-Qualität aktivieren':'Reduzierte 3D-Qualität aktivieren'} aria-pressed={low} title={low?'Qualität: Eco':'Qualität: Hoch'} onClick={()=>setLow(!low)}><Gauge size={15}/></button>
 <button aria-label={fullscreen?'3D-Vollbild beenden':'3D-Vollbild starten'} onClick={()=>{if(fullscreen)void document.exitFullscreen();else void stage.current?.requestFullscreen().catch(()=>{})}}>{fullscreen?<Minimize size={15}/>:<Maximize size={15}/>}</button>
 </div>
 {!film&&<><div className="world-caption"><span>0{chapter+1} / 06</span><h3>{chapters[chapter]}</h3><p>{descriptions[chapter]}</p></div><div className="shot-progress" aria-hidden="true"><div ref={progress}/></div></>}</div>

 <aside className="moment-panel" aria-live="polite"><div className="moment-head"><span>MARCOS MOMENT 0{chapter+1}</span><span className="phase-chip">{m.phase}</span></div>
 <blockquote key={`q${chapter}`}>{m.quote}</blockquote>
 <div className="moment-figure" key={`f${chapter}`}><strong>{m.value}</strong><div><b>{m.unit}</b><span>{m.label}</span></div></div>
 <div className="moment-row today"><span>HEUTE</span><p>{m.today}</p></div>
 <div className="moment-row next"><span>MIT PARTNERCONNECT</span><p>{m.next}</p></div>
 <div className="moment-foot"><span className={`tag ${m.mvp?'mvp':''}`}>{m.req} · {m.mvp?'IM MVP':'NACH DEM MVP'}</span>{m.live&&<button onClick={()=>{location.hash=`scene-${m.live}`}}><span className="live-dot"/>Live-Demo · Szene {String(m.live).padStart(2,'0')}<ArrowRight size={14}/></button>}</div></aside></div>
 <div className="journey-track"><div className="mood-legend"><em>Wie Marco die Beziehung erlebt · illustrativ</em><span className="today">Heute</span><span className="next">Mit PartnerConnect</span></div><div className="mood" aria-hidden="true"><svg viewBox="0 0 600 100" preserveAspectRatio="none"><path className="mood-today" d={curve(MOOD.today)}/><path className="mood-next" d={curve(MOOD.next)}/></svg>{MOOD.today.map((v,i)=><i key={`t${i}`} className={`dot today ${chapter===i?'active':''}`} style={{left:`${px(i)/6}%`,top:`${py(v)}%`}}/>)}{MOOD.next.map((v,i)=><i key={`n${i}`} className={`dot next ${chapter===i?'active':''}`} style={{left:`${px(i)/6}%`,top:`${py(v)}%`}}/>)}</div>
 <div className="moments">{chapters.map((c,i)=><button className={chapter===i?'active':''} key={c} aria-current={chapter===i?'step':undefined} onClick={()=>select(i)}><b>0{i+1}</b><span>{c}</span>{MOMENTS[i].live&&<small>Live</small>}</button>)}</div>
 <div className="phases" aria-label="Customer Lifecycle: Awareness, Consideration, Purchase, Retention, Advocacy">{PHASES.map(([p,n])=><span key={p} className={m.phase===p?'active':''} style={{gridColumn:`span ${n}`}}>{p}</span>)}</div></div></div>
}
export function HeroStove({reduced=false}:{reduced?:boolean}){return <GraphicsBoundary><Canvas frameloop={reduced?'demand':'always'} shadows={{type:PCFShadowMap}} dpr={[1,1.5]} camera={{position:[4,3.3,6.5],fov:38}}><color attach="background" args={['#151916']}/><ambientLight intensity={.6}/><spotLight position={[-3,7,4]} angle={.5} penumbra={.8} intensity={85} color="#e5c8a0" castShadow/><pointLight position={[3,2,-2]} intensity={18} color="#c9cfc4"/><WorldLights/><HeroFire reduced={reduced}/><Block at={[0,-.1,0]} size={[5,.18,5]} color="#3a4038"/><mesh position={[-2,2,-1.5]} rotation={[0,.35,0]}><boxGeometry args={[.2,5,5]}/><meshStandardMaterial color="#252d25"/></mesh><OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={.3} target={[0,1.45,0]} minPolarAngle={1.15} maxPolarAngle={1.4}/></Canvas></GraphicsBoundary>}

function HeroFire({reduced}:{reduced:boolean}){const g=useRef<Group>(null);const clock=useRef(0);useFrame((_,dt)=>{if(!reduced&&!document.hidden)clock.current+=Math.min(dt,.1);if(g.current)sampleWorld(g.current,clock.current,0)});return <group ref={g}><Stove/></group>}
