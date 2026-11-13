import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('output/video',{recursive:true});
const browser=await chromium.launch({channel:process.env.PW_CHANNEL||'chrome',headless:true});const p=await browser.newPage({viewport:{width:1920,height:1080}});
await p.goto('http://127.0.0.1:5173/#scene-4');await p.getByRole('button',{name:'Film',exact:true}).click();const v=p.locator('video');await v.evaluate(async el=>{if(el.readyState<2)await new Promise(r=>el.addEventListener('loadeddata',r,{once:true}));el.pause()});
for(const t of [6,30,65]){await v.evaluate(async(el,t)=>{const ready=new Promise(r=>el.addEventListener('seeked',r,{once:true}));el.currentTime=t;await ready},t);await p.waitForTimeout(250);const pixels=await v.evaluate(el=>{const c=document.createElement('canvas');c.width=el.videoWidth;c.height=el.videoHeight;c.getContext('2d').drawImage(el,0,0);return c.toDataURL('image/png').split(',')[1]});await fs.writeFile(`output/video/frame-.png`,Buffer.from(pixels,'base64'))}
console.log(await v.evaluate(el=>({width:el.videoWidth,height:el.videoHeight,duration:el.duration})));await browser.close();
