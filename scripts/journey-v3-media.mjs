import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const file=process.argv[2]||'output/journey-v3-slice/service.mp4',out=file.replace(/\.mp4$/,'-frames');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();await page.goto('http://127.0.0.1:5173/');
await page.evaluate(src=>{document.body.innerHTML='';const v=document.createElement('video');v.src='/'+src;v.muted=true;v.controls=true;document.body.append(v)},file);
const video=page.locator('video');await video.evaluate(async v=>{if(v.readyState<2)await new Promise((resolve,reject)=>{v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(v.error?.message),{once:true})})});
const meta=await video.evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration}));
for(const t of meta.duration>20?[0,3,6,10,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,71.9]:[0,1.5,3.8,4.1,6,7.8,8.1,10,11.9]){
 await video.evaluate(async(v,t)=>{const ready=new Promise(r=>v.addEventListener('seeked',r,{once:true}));v.currentTime=Math.max(.001,t);await ready},t);
 const png=await video.evaluate(v=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/png').split(',')[1]});await fs.writeFile(`${out}/${String(t).padStart(4,'0')}.png`,Buffer.from(png,'base64'));
}
await video.evaluate(v=>{v.currentTime=0;return v.play()});await page.waitForTimeout(700);meta.playbackAdvanced=await video.evaluate(v=>v.currentTime>.2);await fs.writeFile(out+'/metadata.json',JSON.stringify(meta,null,2));console.log(meta);await browser.close();
