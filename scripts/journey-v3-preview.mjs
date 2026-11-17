import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const phase=process.argv[2]||'slice',root=`output/journey-v3-${phase}`;
await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:5173/#scene-4');await page.locator('canvas[data-time]').waitFor();await page.waitForTimeout(3000);
for(const i of phase==='slice'?[0,4]:[0,1,2,3,4,5]){
 await page.locator('.moments button').nth(i).click();await page.waitForTimeout(800);await page.screenshot({path:`${root}/chapter-${i+1}-after.png`});
 await page.getByRole('button',{name:'Vorher',exact:true}).click();await page.waitForTimeout(300);await page.screenshot({path:`${root}/chapter-${i+1}-before.png`});
 await page.getByRole('button',{name:'Nachher',exact:true}).click();
}
await fs.writeFile(`${root}/browser.json`,JSON.stringify({errors},null,2));console.log(JSON.stringify({errors}));await browser.close();
