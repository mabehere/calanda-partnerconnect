import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const out='output/interactive-storyworld-v5/full',assets='public/assets/storyworld-v5';
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(assets,{recursive:true});
const base='http://127.0.0.1:5195/';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
try{
 const ctx=await browser.newContext({viewport:{width:1366,height:768}});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
 await page.goto(base+'#scene-4');
 const stage=page.locator('.sw-stage');
 const check=i=>page.locator('.sw[data-step="'+i+'"][data-settled="true"]').waitFor({timeout:30000});
 const capture=async name=>{
   await stage.screenshot({path:out+'/'+name+'.png'});
   const image=await stage.locator('canvas').evaluate(c=>c.toDataURL('image/webp',.89).split(',')[1]);
   fs.writeFileSync(out+'/'+name+'.webp',Buffer.from(image,'base64'));
 };
 await check(0);
 const presenter=await ctx.newPage();
 await presenter.goto(base+'?presenter=1#scene-4');
 const perf=[];
 for(let i=0;i<14;i++){
   await page.bringToFront();
   const started=Date.now();
   if(i)await page.keyboard.press(i%2?'PageDown':'ArrowRight');
   // Browser frame pacing includes Chromium overhead; it is not a hardware GPU benchmark.
   const frameSample=i===4||i===6||i===13?page.evaluate(()=>new Promise(resolve=>{
     const frameTimes=[];let start=0,last=0;
     function tick(now){
       if(!start)start=now;
       if(last)frameTimes.push(now-last);
       last=now;
       if(now-start<2500)requestAnimationFrame(tick);
       else resolve(frameTimes);
     }
     requestAnimationFrame(tick);
   })):null;
   await check(i);
   await presenter.locator('[data-story-step="'+i+'"]').waitFor();
   if(frameSample){
     const times=await frameSample,sorted=times.toSorted((a,b)=>a-b);
     perf.push({step:i,toSettledMs:Date.now()-started,frames:times.length,medianFrameMs:sorted[Math.floor(times.length*.5)],p95FrameMs:sorted[Math.floor(times.length*.95)]});
   }
   assert.match(page.url(),/#scene-4$/);
   await capture('step-'+i);
   console.log('Captured',i+1,'/ 14');
 }
 await presenter.keyboard.press('PageUp');await check(12);
 await page.bringToFront();
 await page.getByRole('button',{name:'IST zeigen'}).click();await check(5);
 assert.equal(await page.locator('.sw').getAttribute('data-cursor'),'12');
 await page.getByRole('button',{name:'SOLL zeigen'}).click();await check(12);
 await page.reload();await check(12);
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Explore',exact:true}).click();
 await page.getByLabel('Ansicht und Einstellungen').click();
 await capture('overview');
 await page.locator('.moments button').nth(4).click();
 await check(11);
 await page.locator('.sw-controls').getByRole('button',{name:'Zur Präsentation'}).click();
 await check(12);
 await page.setViewportSize({width:1920,height:1080});
 await page.keyboard.press('PageDown');await check(13);
 await page.screenshot({path:out+'/pitch-1920.png'});
 await page.keyboard.press('PageDown');
 await page.waitForURL('**/#scene-5');
 await presenter.waitForURL(/#scene-5$/);
 assert.deepEqual(errors,[]);
 for(const name of [...Array.from({length:14},(_,i)=>'step-'+i),'overview']){
   fs.copyFileSync(out+'/'+name+'.webp',assets+'/'+name+'.webp');
 }
 fs.writeFileSync(out+'/browser-check.json',JSON.stringify({steps:14,clicker:true,presenter:true,reverse:true,compare:true,reload:true,explore:true,finalExit:true,errors},null,2));
 fs.writeFileSync(out+'/performance.json',JSON.stringify({browser:browser.version(),viewport:'1366×768',kind:'Headless Chrome requestAnimationFrame during transition',perf},null,2));
}finally{await browser.close()}

