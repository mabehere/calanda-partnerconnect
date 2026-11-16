import {useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';

// Motion owns the outer scene, GSAP owns only these children. Keyed mounting
// means an interrupted exit cannot accidentally animate the previous scene.
const compositions:Record<number,string>={
 0:'.hero .eyebrow,.hero h1,.hero-sub,.hero-body,.hero-cta',
 1:'.network-graphic,.network-numbers>div',2:'.baseline-col',
 3:'.journey-main,.journey-track',4:'.tabs,.friction-canvas>div,.editorial-line',
 5:'.vision-word,.scope>div',6:'.demo-top,.demo-body',7:'.partner-profile,.partner-record',
 8:'.demo-top,.demo-body',9:'.demo-top,.demo-body',10:'.marketing>div',
 11:'.website-preview,.cms',12:'.system-row,.integration,.architecture aside',
 13:'.ai-choice>div,.pilot-callout',14:'.kpi-column,.kpi-definition',
 15:'.mvp-case>div',16:'.timeline button,.gate',17:'.budget-line,.budget-grid aside',
 18:'.final-quote,.finale aside,.finale .hero-cta',
};
export default function SceneChoreography({scene,reduced}:{scene:number;reduced:boolean}){
 const marker=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{
  const root=marker.current?.parentElement;if(!root||reduced)return;
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({defaults:{ease:'power2.out',duration:.5}});
   const heading=root.querySelectorAll('.scene-header .eyebrow,.scene-header h1,.scene-header>div>p');
   if(heading.length)tl.from(heading,{opacity:0,y:9,stagger:.06},0);
   const elements=root.querySelectorAll(compositions[scene]);
   if(elements.length)tl.from(elements,{opacity:0,y:scene===0?18:12,stagger:{each:scene===16?.045:.065,amount:Math.min(.3,elements.length*.065)},duration:scene===0?.7:.5},.1);
  },root);
  return()=>ctx.revert();
 },[scene,reduced]);
 return <span hidden ref={marker}/>;
}
