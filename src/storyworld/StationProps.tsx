import {useRef} from 'react';
import type {RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import {Group} from 'three';
import {Round,Envelope,SoftVan} from '../../video/v4/SoftWorld';
import {ease} from '../../video/v4/timing';
import {sampleWheel} from '../../video/v4/wheels';
import {CASE} from '../data/case';
import Plaque from './Plaque';
import type {Station} from './engine';

const tones={green:'#537368',sage:'#a5b8a5',paper:'#f1e5cd',copper:'#b57952',wood:'#c6a582',dark:'#334e47'};
import {vanScale,deliveryTravel} from './deliveryMotion';

function Screen({at,label,color=tones.dark}:{at:[number,number,number];label:string;color?:string}){
 return <group position={at}>
   <Round size={[1.4,.8,.14]} color={color}/>
   <Round at={[0,0,.08]} size={[1.23,.63,.03]} color="#d6e1d3"/>
   <group position={[0,0,.101]}><Plaque label={label} width={1.16}/></group>
   <Round at={[0,-.49,0]} size={[.52,.22,.27]} color={color}/>
 </group>;
}
function Folder({color=tones.wood}:{color?:string}){
 return <>
   <Round at={[0,0,0]} size={[.68,.5,.09]} color={color}/>
   <Round at={[-.16,.27,0]} size={[.30,.12,.09]} color={color}/>
   <Round at={[0,.02,.055]} size={[.48,.30,.025]} color={tones.paper}/>
 </>;
}
function Parcel({at,scale=1}:{at:[number,number,number];scale?:number}){
 return <group position={at} scale={scale}>
   <Round at={[0,.29,0]} size={[.59,.57,.58]} color="#bf966d" radius={.055}/>
   <Round at={[0,.57,0]} size={[.12,.025,.57]} color="#efdfba"/>
   <Round at={[.11,.32,.296]} size={[.22,.13,.02]} color="#f4e9d8"/>
 </group>;
}
function StoveTile({x}:{x:number}){
 return <group position={[x,.16,-.35]}>
  <Round at={[0,.43,0]} size={[.42,.65,.36]} color={tones.green}/>
  <Round at={[0,.47,.18]} size={[.29,.36,.027]} color={tones.dark}/>
  <Round at={[0,.44,.201]} size={[.10,.12,.022]} color="#e3ab58"/>
  <Round at={[0,.81,-.05]} size={[.14,.29,.14]} color={tones.green}/>
 </group>;
}
function Desk({x=1.15,width=2.6}:{x?:number;width?:number}){
 return <>
   <Round at={[x,.78,-.24]} size={[width,.16,1.34]} color="#d5b58c"/>
   {[-1,1].map(side=><Round key={side} at={[x+side*(width/2-.35),.41,-.24]} size={[.16,.77,.84]} color={tones.sage}/>)}
 </>;
}
function Glass(){
 const crack=[[-.13,.26,.53],[-.055,.04,.08],[.045,-.18,.66],[.16,-.32,.93],[.086,.27,-.61]];
 return <group position={[.14,1.33,.25]}>
   <Round size={[1.12,1.12,.16]} color={tones.dark}/>
   <Round at={[0,0,.09]} size={[.90,.9,.06]} color="#8eaaa1"/>
   {crack.map(([x,y,angle],i)=><mesh key={i} position={[x,y,.126]} rotation-z={angle}>
     <boxGeometry args={[.034,.31,.014]}/><meshBasicMaterial color="#fff5df"/>
   </mesh>)}
 </group>;
}

export default function StationProps({station,soll,clock,active}:{station:Station;soll:boolean;clock:RefObject<number>;active:boolean}){
 const token=useRef<Group>(null),outcome=useRef<Group>(null),van=useRef<Group>(null);
 const wheels=useRef<Group[]>([]);
 useFrame(()=>{
   const time=active?clock.current:3.4;
   const p=ease((time-.95)/1.37);
   if(van.current){
     const travelled=deliveryTravel(time);
     van.current.position.x=-.12+travelled;
     if(wheels.current.length!==4){
       wheels.current=[];
       van.current.traverse(o=>{if(o instanceof Group&&o.name==='wheel-pivot')wheels.current.push(o)});
     }
     wheels.current.forEach(wheel=>sampleWheel(wheel,travelled,vanScale));
   }
   if(token.current){
     token.current.visible=time>.92 && p<.998;
     if(station===2){
       token.current.position.set(-.65+2.85*p,1.20+.3*Math.sin(p*Math.PI),.72);
       if(!soll)token.current.rotation.z=-.22*Math.sin(2*Math.PI*p);
     }
     if(station===4)token.current.position.set(.43+1.72*(soll?p:.55*p),1.24+.45*Math.sin(p*Math.PI),.68);
     if(station===5)token.current.position.set(-.8+2.55*p,1.39+.28*Math.sin(p*Math.PI),.57);
   }
   if(outcome.current)outcome.current.visible=p>=.99;
 });
 if(station===2)return <>
   <Desk x={2.17} width={1.7}/>
   <Round at={[-.2,.12,-.38]} size={[2.38,.14,.68]} color="#c6b08c"/>
   <Screen at={[2.26,1.31,-.54]} label="ERP"/>
   {[-1.05,-.49,.07,.63].map(x=><StoveTile key={x} x={x}/>)}
   <group position={[.14,1.13,-.18]}><Plaque label={soll?'Portal · später':'E-Mail'} width={1.18}/></group>
   <group ref={token}>{soll?<Folder color={tones.green}/>:<Envelope/>}</group>
   <group ref={outcome} position={[2.25,1.31,-.432]}>
     <Plaque label={soll?'✓ 1 Übergabe':'Manuell erfasst'} width={1.16} tone={soll?'positive':'waiting'}/>
   </group>
 </>;
 if(station===3)return <>
   <Round at={[.36,.093,.58]} size={[6.35,.07,1.63]} color="#a2afa0" radius={.032}/>
   {[-1.7,-.9,-.1,.7,1.5,2.3].map(x=><Round key={x} at={[x,.131,1.28]} size={[.34,.012,.032]} color="#eee5cb"/>)}
   <Parcel at={[-1.1,.06,-.45]}/><Parcel at={[-.46,.06,-.65]} scale={.83}/>
   <group position={[2.05,2.03,-2.04]}><Plaque label="ERP · Versand" width={1.75}/></group>
   <group ref={van} position={[-.12,.13,.63]}><SoftVan scale={vanScale}/></group>
   <group ref={outcome} position={[1.25,1.72,-2.03]}>
     <Plaque label={soll?'CRM · Status aus ERP':'Status nur im ERP'} width={1.95} tone={soll?'positive':'waiting'}/>
   </group>
 </>;
 if(station===4)return <>
   <Desk x={1.33}/>
   <Glass/>
   <Screen at={[2.07,1.32,-.55]} label={soll?'Service · CRM':'Posteingang'}/>
   <group ref={token}>{soll?<Folder color={tones.green}/>:<Envelope/>}</group>
   <group ref={outcome} position={[2.08,1.32,-.441]}>
     <Plaque label={soll?'✓ Foto ergänzt':'Foto fehlt'} width={1.16} tone={soll?'positive':'waiting'}/>
   </group>
 </>;
 if(station===5)return <>
   <Desk/>
   <Screen at={[1.87,1.31,-.57]} label={soll?'CRM · Historie':'Excel / E-Mail'}/>
   {CASE.locations.map((name,i)=><group key={name} position={[.05+i*.88,1.93,-1.85]}>
     <Plaque label={name} width={.82}/>
   </group>)}
   {[-.2,.55,1.3].map((x,i)=><group key={x} position={[x,1.11,.14]} rotation-z={soll?0:(i-1)*.19}>
     <Folder color={soll?tones.sage:tones.wood}/>
   </group>)}
   {soll&&<Round at={[.60,.99,.12]} size={[2.15,.19,.55]} color={tones.green}/>}
   {soll&&<group ref={token}><Folder color={tones.green}/></group>}
   <group ref={outcome} position={[1.88,1.31,-.462]}>
     <Plaque label={soll?'✓ Gemeinsame Sicht':'Verteilt'} width={1.16} tone={soll?'positive':'waiting'}/>
   </group>
 </>;
 return null;
}
