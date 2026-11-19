import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome'});
try{
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>{
   const original=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(type,...args){
     return type.includes('webgl')?null:original.call(this,type,...args);
   };
 });
 await page.goto('http://127.0.0.1:5195/#scene-4');
 for(let i=0;i<4;i++){
   if(i)await page.keyboard.press('ArrowRight');
   await page.locator('.sw[data-step="'+i+'"][data-phase="Ergebnis"]').waitFor();
   await page.waitForFunction(()=>{const img=document.querySelector('.sw-fallback');return img?.complete&&img.naturalWidth>0});
 }
 await page.keyboard.press('ArrowRight');await page.waitForURL('**/#scene-5');
 fs.writeFileSync('output/interactive-storyworld-v5/fallback.json',JSON.stringify({webglDisabled:true,reducedMotion:true,imagesLoaded:4,finalExit:true}));
 console.log('Four fallback images and final click to scene 5 passed');
}finally{await browser.close()}
