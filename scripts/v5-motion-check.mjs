import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 await page.goto('http://127.0.0.1:5195/#scene-4');
 const stage=page.locator('.sw-stage'), pixels=()=>stage.locator('canvas').evaluate(c=>c.toDataURL());
 const end=()=>page.waitForFunction(()=>document.querySelector('.sw [aria-label="Animation pausieren oder fortsetzen"]')?.disabled);
 await page.waitForSelector('.sw canvas');await end();await page.waitForTimeout(300);
 const first=await pixels();
 await page.getByLabel('Schritt wiederholen').click();
 const pause=page.getByLabel('Animation pausieren oder fortsetzen');
 await page.waitForTimeout(500);await pause.click();await page.waitForTimeout(200);
 const held=await pixels();await page.waitForTimeout(420);assert.equal(await pixels(),held);
 await pause.click();await end();await page.waitForTimeout(200);
 const repeat=await pixels();assert.ok(repeat===first,'Replay did not restore the same image');
 await page.getByLabel('Ansicht und Einstellungen').click();await page.getByRole('button',{name:'Explore',exact:true}).click();
 await page.getByLabel('Ansicht und Einstellungen').click();await page.waitForTimeout(350);
 await stage.screenshot({path:'output/interactive-storyworld-v5/overview.png'});
 await page.getByLabel('Ansicht und Einstellungen').click();await page.getByRole('button',{name:'Film',exact:true}).click();
 assert.equal(await stage.locator('video').evaluate(v=>v.paused),true);
 fs.writeFileSync('output/interactive-storyworld-v5/motion-check.json',JSON.stringify({pausePixelStable:true,replayEndPixelIdentical:true,filmInitiallyPaused:true}));
}finally{await browser.close()}
