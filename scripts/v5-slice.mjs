import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const out='output/interactive-storyworld-v5',assets='public/assets/storyworld-v5';
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(assets,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
try{
 const ctx=await browser.newContext({viewport:{width:1366,height:768}});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>{console.error(e);errors.push(e.message)});
 const base='http://127.0.0.1:5195/';
 await page.goto(base+'#scene-4');
 const stage=page.locator('.sw-stage');
 async function check(i){await page.locator('.sw[data-step="'+i+'"][data-phase="Ergebnis"]').waitFor({timeout:45000});await page.waitForTimeout(350)}
 await check(0);
 const presenter=await ctx.newPage();await presenter.goto(base+'?presenter=1#scene-4');
 for(let i=0;i<4;i++){
   await page.bringToFront();if(i){await page.keyboard.press('PageDown');await page.waitForTimeout(500);console.log('click',i,page.url(),await page.locator('.sw').getAttribute('data-step'),await page.locator('.sw').getAttribute('data-phase'));}
   await check(i);await presenter.locator('[data-story-step="'+i+'"]').waitFor();
   await stage.screenshot({path:out+'/step-'+i+'.png'});
   const image=await stage.locator('canvas').evaluate(c=>c.toDataURL('image/webp',.88).split(',')[1]);
   console.log('Verified state',i);fs.writeFileSync(out+'/step-'+i+'.webp',Buffer.from(image,'base64'));
 }
 await presenter.keyboard.press('PageUp');await check(2);
 await page.getByRole('button',{name:'IST zeigen'}).click();await check(0);
 await page.getByRole('button',{name:'SOLL zeigen'}).click();await check(2);
 await page.getByLabel('Schritt wiederholen').click();await check(2);
 await page.reload();await check(2);
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Explore',exact:true}).click();
 await page.locator('.sw-header button',{hasText:'Zur Präsentation'}).click();await check(2);
 await page.setViewportSize({width:1920,height:1080});await page.getByLabel('Ansicht und Einstellungen').click();
 await page.screenshot({path:out+'/pitch-1920.png'});
 assert.deepEqual(errors,[]);for(let i=0;i<4;i++)fs.copyFileSync(out+'/step-'+i+'.webp',assets+'/step-'+i+'.webp');
 fs.writeFileSync(out+'/slice-check.json',JSON.stringify({fourStates:true,presenter:true,reverse:true,compare:true,replay:true,reload:true,exploreReturn:true,errors},null,2));
}finally{await browser.close()}


