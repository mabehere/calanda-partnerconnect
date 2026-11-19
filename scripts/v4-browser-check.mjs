import {chromium} from '@playwright/test';
import fs from 'node:fs';
const out='output/caleira-v4-pilot';const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[],glbRequests=[];page.on('request',r=>{if(/\.glb(?:\?|$)/.test(r.url()))glbRequests.push(r.url())});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('/output/caleira-v4-pilot/'))errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:5173/output/caleira-v4-pilot/index.html');
 const checks=[];
 for(const id of ['pilot','vehicle']){
  const result=await page.locator(`#${id}`).evaluate(async video=>{
   if(video.readyState<1)await new Promise(r=>video.addEventListener('loadedmetadata',r,{once:true}));
   const duration=video.duration;video.muted=true;
   async function seek(time){const p=new Promise(r=>video.addEventListener('seeked',r,{once:true}));video.currentTime=time;await p;return video.currentTime}
   const seeks=[];for(const t of [duration-.2,.5,duration/2])seeks.push(await seek(t));
   const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;const ctx=canvas.getContext('2d');
   function pixels(){ctx.drawImage(video,0,0,320,180);return Array.from(ctx.getImageData(0,0,320,180).data).reduce((h,n)=>Math.imul(h^n,16777619)>>>0,2166136261)}
   const first=pixels();await seek(.25);await seek(duration/2);const second=pixels();if(first!==second)throw Error('Repeated seek changed pixels');
   await video.play();await new Promise(r=>setTimeout(r,500));video.pause();const a=video.currentTime;await new Promise(r=>setTimeout(r,200));const b=video.currentTime;
   if(a<=duration/2||a!==b)throw Error('Playback / pause failed');
   await seek(.01);return {id:video.id,duration,width:video.videoWidth,height:video.videoHeight,seeks,playbackAdvanced:true,pauseStable:true,repeatedSeekPixelHash:first};
  });checks.push(result);
 }
 await page.screenshot({path:`${out}/qa/review-desktop.png`,fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:`${out}/qa/review-mobile.png`,fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw Error('Mobile overflow');
 await page.goto('http://localhost:3002/CaleiraV4Pilot');await page.waitForSelector('canvas',{timeout:30000});await page.screenshot({path:`${out}/qa/studio.png`});
 if(glbRequests.length)errors.push('Pilot unexpectedly loaded legacy GLB assets');
 const result={passed:errors.length===0,checks,mobileOverflow:overflow,errors,studioCanvas:true,glbRequests};fs.writeFileSync(`${out}/browser-check.json`,JSON.stringify(result,null,2));console.log(result);if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close()}
