import {Component,useId,useCallback,useEffect,useLayoutEffect,useReducer,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import gsap from 'gsap';
import {MomentPanel,chapters,curve,MOOD,PHASES,MOMENTS,px,py} from '../components/Journey';
import {commandEvent,snapshotEvent,cursorKey,STEP_SECONDS,steps,stepName,stationOf,visitCount,transition,restore,type Command,type Snapshot,type Station} from './engine';
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
 const [gpuLost,setGpuLost]=useState(false);
 const [filmChapter,setFilmChapter]=useState(0);
 const handleContextLost=useCallback(()=>setGpuLost(true),[]);
 const resultId=useId();
 const stage=useRef<HTMLDivElement>(null),clock=useRef(0),animation=useRef<gsap.core.Tween|null>(null);
 const step=steps[story.view],chapter=story.mode==='film'?filmChapter:stationOf(step);
 const visit=story.mode==='film'||step.kind==='visit',moment=MOMENTS[chapter];
 const scope=visit?moment.req+' · '+(moment.mvp?'MVP':'nach dem MVP'):'Sechs Stationen · symbolische Prozesslandschaft';
 const artwork=story.mode==='explore'?'overview':'step-'+story.view;
 const command=useCallback((c:Command)=>{if(c==='film')setFilmChapter(0);dispatch(c)},[]);
 useLayoutEffect(()=>{
   const state={time:0};
   const settled=reduced||story.settle||story.mode==='film';
   clock.current=settled?STEP_SECONDS:0;
   setMoving(!settled);setPaused(false);setPhase(settled?'Ergebnis':'Anfahrt');
   window.dispatchEvent(new Event('caleira:frame'));
   if(settled)return;
   let previousPhase='Anfahrt';
   const tween=gsap.to(state,{time:STEP_SECONDS,duration:STEP_SECONDS,ease:'none',onComplete:()=>setMoving(false),onUpdate:()=>{
     clock.current=state.time;
     window.dispatchEvent(new Event('caleira:frame'));
     const nextPhase=state.time<.85?'Anfahrt':state.time<2.45?'Handlung':'Ergebnis';
     if(nextPhase!==previousPhase){previousPhase=nextPhase;setPhase(nextPhase)}
   }});
   animation.current=tween;
   return()=>{tween.kill();animation.current=null};
 },[story,reduced]);
 useEffect(()=>{
   const snapshot:Snapshot={cursor:story.cursor,view:story.mode==='film'?filmChapter:story.view,mode:story.mode,phase};
   sessionStorage.setItem(cursorKey,String(story.cursor));
   window.dispatchEvent(new CustomEvent(snapshotEvent,{detail:snapshot}));
 },[story,phase,filmChapter]);
 useEffect(()=>{
   const handle=(event:Event)=>{
     const c=(event as CustomEvent<Command>).detail;
     if(c==='forward'&&story.cursor===steps.length-1&&story.mode==='present'&&story.view===story.cursor){if(animation.current?.isActive()||clock.current<STEP_SECONDS){animation.current?.progress(1);return}location.hash='scene-5';return}
     command(c);
   };
   window.addEventListener(commandEvent,handle);
   return()=>window.removeEventListener(commandEvent,handle);
 },[story,command]);
 const fallback=<img className="sw-fallback" src={'/assets/storyworld-v5/'+artwork+'.webp'} alt={stepName(step)+' · '+step.result}/>;
 const advance=(direction:'forward'|'back')=>window.dispatchEvent(new CustomEvent(commandEvent,{detail:direction}));
 const visible=(soll:boolean)=>story.mode==='explore'?6:visitCount(story.cursor,soll);
 const act=step.kind==='turn'?'WENDEPUNKT':step.kind==='final'?'GESAMTBILD':step.soll?'AKT II · MIT PARTNERCONNECT':'AKT I · HEUTE';
 return <div className="journey sw" data-step={story.view} data-phase={phase} data-cursor={story.cursor} data-mode={story.mode} data-settled={!moving}>
  <div className="journey-main"><div ref={stage} className="journey-stage sw-stage">
   {story.mode==='film'?<video controls muted onTimeUpdate={e=>setFilmChapter(Math.min(chapters.length-1,Math.floor(e.currentTarget.currentTime/12)))} className="journey-video" src="/media/caleira-customer-journey.mp4"/>:
    gpuLost?fallback:<StageBoundary fallback={fallback}><Stage clock={clock} story={story} eco={eco} pick={command} fallback={fallback} contextLost={handleContextLost}/></StageBoundary>}
   <div className="sw-header"><span>{story.mode==='film'?'FILM':story.mode==='explore'?'EXPLORE':act}</span>
   <details><summary aria-label="Ansicht und Einstellungen">Ansicht ▾</summary><div>
    <button onClick={()=>command(story.mode==='explore'?'present':'explore')}>{story.mode==='explore'?'Zur Präsentation':'Explore'}</button>
    <button onClick={()=>command(story.mode==='film'?'present':'film')}>{story.mode==='film'?'Zur Präsentation':'Film'}</button>
    {import.meta.env.DEV&&<a href="/output/caleira-v4-pilot/index.html" target="_blank" rel="noreferrer">V4-Pilot · Stilkonzept</a>}
    <button onClick={()=>setEco(!eco)}>Qualität · {eco?'Eco':'Hoch'}</button>
    <button onClick={()=>document.fullscreenElement?void document.exitFullscreen():void stage.current?.requestFullscreen()}>Vollbild</button>
    <button onClick={()=>command('restart')}>Von vorne beginnen</button>
    <button onClick={()=>{location.hash='scene-5'}}>Journey verlassen</button>
   </div></details></div>
   {story.mode!=='film'&&<><div className="sw-result" aria-live="polite"><small>{stepName(step)} · {scope}</small>
    <strong id={resultId}>{phase==='Ergebnis'?step.result:step.action}</strong></div>
    <div className="sw-controls"><button onClick={()=>advance('back')} aria-label="Journey zurück">←</button>
    <button onClick={()=>command('replay')} aria-label="Schritt wiederholen">↺</button>
    <button disabled={!moving} aria-label="Animation pausieren oder fortsetzen" onClick={()=>{animation.current?.paused(!paused);setPaused(!paused);setPhase(paused?(clock.current<.85?'Anfahrt':clock.current<2.45?'Handlung':'Ergebnis'):'Pausiert')}}>{paused?'▶':'Ⅱ'}</button>
    {visit&&<button onClick={()=>command('compare')}>{step.soll?'IST zeigen':'SOLL zeigen'}</button>}
    {story.mode==='explore'&&<button onClick={()=>command('present')}>Zur Präsentation</button>}
    <button onClick={()=>advance('forward')} aria-label="Journey weiter">Weiter →</button></div></>}
  </div>{visit?<MomentPanel chapter={chapter}/>:<aside className="moment-panel sw-overview-panel" aria-labelledby={resultId}>
   <div className="moment-head"><span>{stepName(step)}</span><span className="phase-chip">Illustrativ</span></div>
   <h3>{step.kind==='turn'?'Eine gemeinsame Sicht':'Eine gemeinsame Partnerhistorie'}</h3>
   <div className="moment-row next"><span>PartnerConnect · CRM</span><p>Vertrieb und Service greifen auf die gemeinsame Partnerhistorie zu.</p></div>
   <div className="moment-row today"><span>ERP</span><p>Führend für Auftrag und Versandstatus. Das CRM zeigt den Status aus dem ERP.</p></div>
   <div className="moment-row"><span>Ausbaustufen</span><p>Dreisprachige Website und Händlerportal folgen nach dem MVP.</p></div>
  </aside>}</div>
  <div className="journey-track"><div className="mood-legend"><em>Wie Marco die Beziehung erlebt · illustrativ</em><span className="today">Heute</span><span className="next">Mit PartnerConnect</span></div>
  <div className="mood" aria-hidden="true"><svg viewBox="0 0 600 100" preserveAspectRatio="none">{(['today','next'] as const).map(k=><path key={k} className={'mood-'+k} d={curve(MOOD[k].slice(0,visible(k==='next')))}/>)}</svg>
  {(['today','next'] as const).map(k=>MOOD[k].slice(0,visible(k==='next')).map((v,i)=><i key={k+i} className={'dot '+k+(visit&&i===chapter&&step.soll===(k==='next')?' active':'')} style={{left:px(i)/6+'%',top:py(v)+'%'}}/>))}</div>
  <div className="moments">{chapters.map((name,i)=><button key={name} className={visit&&chapter===i?'active':''} aria-current={visit&&chapter===i?'step':undefined} onClick={()=>command(i as Station)}><b>0{i+1}</b>{name}{MOMENTS[i].live&&<small>Live</small>}</button>)}</div>
  <div className="phases">{PHASES.map(([name,n])=><span key={name} className={MOMENTS[chapter].phase===name?'active':''} style={{gridColumn:'span '+n}}>{name}</span>)}</div></div>
 </div>
}


