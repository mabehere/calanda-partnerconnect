import {Component,useCallback,useEffect,useLayoutEffect,useReducer,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import gsap from 'gsap';
import {MomentPanel,chapters,curve,MOOD,PHASES,MOMENTS,px,py} from '../components/Journey';
import {commandEvent,snapshotEvent,steps,transition,restore,type Command,type Snapshot} from './engine';
import Stage from './Stage';
import './story.css';

class StageBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?this.props.fallback:this.props.children}
}
export default function StoryJourney({reduced=false}:{reduced?:boolean}){
 const [story,dispatch]=useReducer(transition,undefined,restore);
 const [phase,setPhase]=useState('Anfahrt'),[eco,setEco]=useState(false),[paused,setPaused]=useState(false);
 const [moving,setMoving]=useState(false);
 const [detail,setDetail]=useState<number|null>(null);
 const stage=useRef<HTMLDivElement>(null),clock=useRef(0),animation=useRef<gsap.core.Tween|null>(null);
 const step=steps[story.view],chapter=detail??step.station;
 const command=useCallback((c:Command)=>{setDetail(null);dispatch(c)},[]);
 useLayoutEffect(()=>{
   const state={time:0};
   const settled=reduced||story.settle||story.mode!=='present';
   clock.current=settled?3.4:0;
   setMoving(!settled);setPaused(false);setPhase(settled?'Ergebnis':'Anfahrt');
   window.dispatchEvent(new Event('caleira:frame'));
   if(settled)return;
   let previousPhase='Anfahrt';
   const tween=gsap.to(state,{time:3.4,duration:3.4,ease:'none',onComplete:()=>setMoving(false),onUpdate:()=>{
     clock.current=state.time;
     window.dispatchEvent(new Event('caleira:frame'));
     const nextPhase=state.time<.85?'Anfahrt':state.time<2.45?'Handlung':'Ergebnis';
     if(nextPhase!==previousPhase){previousPhase=nextPhase;setPhase(nextPhase)}
   }});
   animation.current=tween;
   return()=>{tween.kill();animation.current=null};
 },[story,reduced]);
 useEffect(()=>{
   const snapshot:Snapshot={cursor:story.cursor,view:story.view,mode:story.mode,phase:detail===null?phase:'Moment-Karte · '+chapters[detail]};
   sessionStorage.setItem('caleira:v5:cursor',String(story.cursor));
   window.dispatchEvent(new CustomEvent(snapshotEvent,{detail:snapshot}));
 },[story,phase,detail]);
 useEffect(()=>{
   const handle=(event:Event)=>{
     const c=(event as CustomEvent<Command>).detail;
     if(c==='forward'&&story.cursor===steps.length-1&&story.mode==='present'&&story.view===story.cursor){location.hash='scene-5';return}
     command(c);
   };
   window.addEventListener(commandEvent,handle);
   return()=>window.removeEventListener(commandEvent,handle);
 },[story,command]);
 const fallback=<img className="sw-fallback" src={'/assets/storyworld-v5/step-'+story.view+'.webp'} alt={chapters[step.station]+' · '+step.result}/>;
 const advance=(direction:'forward'|'back')=>window.dispatchEvent(new CustomEvent(commandEvent,{detail:direction}));
 const visible=(soll:boolean)=>story.mode==='explore'?6:steps.slice(0,story.cursor+1).filter(s=>s.soll===soll).length;
 return <div className="journey sw" data-step={story.view} data-phase={phase}>
  <div className="journey-main"><div ref={stage} className="journey-stage sw-stage">
   {story.mode==='film'?<video controls muted className="journey-video" src="/media/caleira-customer-journey.mp4"/>:
    <StageBoundary fallback={fallback}><Stage clock={clock} story={story} eco={eco} pick={command} fallback={fallback}/></StageBoundary>}
   <div className="sw-header"><span>{story.mode==='film'?'FILM':story.mode==='explore'?'EXPLORE':step.soll?'AKT II · MIT PARTNERCONNECT':'AKT I · HEUTE'}</span>
   <details><summary aria-label="Ansicht und Einstellungen">Ansicht ▾</summary><div>
    <button onClick={()=>command(story.mode==='explore'?'present':'explore')}>{story.mode==='explore'?'Zur Präsentation':'Explore'}</button>
    <button onClick={()=>command(story.mode==='film'?'present':'film')}>{story.mode==='film'?'Zur Präsentation':'Film'}</button>
    <button onClick={()=>setEco(!eco)}>Qualität · {eco?'Eco':'Hoch'}</button>
    <button onClick={()=>document.fullscreenElement?void document.exitFullscreen():void stage.current?.requestFullscreen()}>Vollbild</button>
    <button onClick={()=>{location.hash='scene-5'}}>Journey verlassen</button>
   </div></details></div>
   {story.mode!=='film'&&<><div className="sw-result" aria-live="polite"><small>{chapters[step.station]} · {step.station===0?'R6 · nach dem MVP':'R2 · MVP'}</small>
    <strong>{phase==='Ergebnis'?step.result:step.action}</strong></div>
    <div className="sw-controls"><button onClick={()=>advance('back')} aria-label="Journey zurück">←</button>
    <button onClick={()=>command('replay')} aria-label="Schritt wiederholen">↺</button>
    <button disabled={!moving} aria-label="Animation pausieren oder fortsetzen" onClick={()=>{animation.current?.paused(!paused);setPaused(!paused);setPhase(paused?(clock.current<.85?'Anfahrt':clock.current<2.45?'Handlung':'Ergebnis'):'Pausiert')}}>{paused?'▶':'Ⅱ'}</button>
    <button onClick={()=>command('compare')}>{step.soll?'IST zeigen':'SOLL zeigen'}</button>
    <button onClick={()=>advance('forward')} aria-label="Journey weiter">Weiter →</button></div></>}
  </div><MomentPanel chapter={chapter}/></div>
  <div className="journey-track"><div className="mood-legend"><em>Wie Marco die Beziehung erlebt · illustrativ</em><span className="today">Heute</span><span className="next">Mit PartnerConnect</span></div>
  <div className="mood" aria-hidden="true"><svg viewBox="0 0 600 100" preserveAspectRatio="none">{(['today','next'] as const).map(k=><path key={k} className={'mood-'+k} d={curve(MOOD[k].slice(0,visible(k==='next')))}/>)}</svg>
  {(['today','next'] as const).map(k=>MOOD[k].slice(0,visible(k==='next')).map((v,i)=><i key={k+i} className={'dot '+k+(i===chapter?' active':'')} style={{left:px(i)/6+'%',top:py(v)+'%'}}/>))}</div>
  <div className="moments">{chapters.map((name,i)=><button key={name} className={chapter===i?'active':''} onClick={()=>i<2?command(i as 0|1):setDetail(i)}><b>0{i+1}</b>{name}{MOMENTS[i].live&&<small>Live</small>}</button>)}</div>
  <div className="phases">{PHASES.map(([name,n])=><span key={name} className={MOMENTS[chapter].phase===name?'active':''} style={{gridColumn:'span '+n}}>{name}</span>)}</div></div>
 </div>
}


