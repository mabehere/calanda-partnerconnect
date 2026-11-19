import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser=await chromium.launch({channel:'chrome'});
const origin='http://127.0.0.1:5196';
try{
 const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:1366,height:768}});
 const out='output/interactive-storyworld-v5/full';
 const external=[],errors=[];
 await page.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.origin===origin||['data:','blob:'].includes(url.protocol))return route.continue();
   external.push(url.href);
   return route.abort();
 });
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url())});
 await page.goto(origin+'/#scene-4');
 for(let i=0;i<14;i++){
   if(i)await page.keyboard.press('PageDown');
   await page.locator('.sw[data-step="'+i+'"][data-settled="true"] canvas').waitFor();
 }
 // Simulate an interruption after the WebGL context has already been created.
 await page.locator('.sw-stage canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost')));
 await page.locator('.sw-stage canvas').waitFor({state:'detached'});
 await page.locator('.sw-fallback').waitFor({state:'visible'});
 await page.waitForFunction(()=>{const image=document.querySelector('.sw-fallback');return image?.complete&&image.naturalWidth>0});
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Film',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.journey-video')?.readyState>=2);
 assert.equal(await page.locator('.journey-video').evaluate(video=>video.paused),true);
 for(const scene of [7,9,10]){
   await page.evaluate(scene=>{location.hash='scene-'+scene},scene);
   await page.locator('.demo-top').waitFor();
 }
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 fs.writeFileSync(out+'/offline-check.json',JSON.stringify({build:true,steps:14,externalRequests:external,errors,contextLoss:true,localFilm:true,linkedDemoScenes:[7,9,10]},null,2));
 console.log('Built offline preview: 14 steps, runtime context loss, local film, 3 linked demos.');
}finally{await browser.close()}
