import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:process.env.PW_CHANNEL||'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const reports=[];
for(const quality of ['high','eco']){
 await page.goto('http://127.0.0.1:5173/#scene-4');await page.locator('canvas[data-time]').waitFor();
 if(quality==='eco')await page.getByRole('button',{name:'Reduzierte 3D-Qualität aktivieren'}).click();
 await page.waitForTimeout(2000);
 const report=await page.evaluate(async()=>{
  const c=document.querySelector('.journey canvas'),gl=c.getContext('webgl2'),debug=gl.getExtension('WEBGL_debug_renderer_info');
  const samples=[];let last=performance.now();await new Promise(resolve=>{function tick(t){samples.push(t-last);last=t;if(samples.length<180)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});samples.shift();samples.sort((a,b)=>a-b);
  return {userAgent:navigator.userAgent,backend:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),drawingBuffer:[c.width,c.height],canvas:[c.clientWidth,c.clientHeight],calls:c.dataset.calls,triangles:c.dataset.triangles,geometries:c.dataset.geometries,textures:c.dataset.textures,rafMs:{p50:samples[Math.floor(samples.length*.5)],p95:samples[Math.floor(samples.length*.95)],max:samples.at(-1)}};
 });reports.push({quality,...report});
}
const mounts=[];for(let i=0;i<3;i++){await page.goto('http://127.0.0.1:5173/#scene-2');await page.locator('.network-scene').waitFor();await page.goto('http://127.0.0.1:5173/#scene-4');await page.locator('canvas[data-time]').waitFor();await page.waitForTimeout(1500);mounts.push(await page.locator('canvas').evaluate(c=>({...c.dataset})));}
await fs.writeFile('output/creative-performance.json',JSON.stringify({reports,mounts,errors,note:'Headless Windows browser rAF cadence; not GPU render time or proof of 60 FPS on other laptops.'},null,2));console.log(JSON.stringify({reports,mounts,errors}));await browser.close();
