import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('output/screenshots',{recursive:true});
const browser=await chromium.launch({channel:process.env.PW_CHANNEL||'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const size of [{width:1920,height:1080},{width:1366,height:768}]){await page.setViewportSize(size);for(let n=1;n<=19;n++){await page.goto(`http://127.0.0.1:5173/#scene-${n}`);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(n===1||n===4?1800:250);await page.screenshot({path:`output/screenshots/scene-${String(n).padStart(2,'0')}-${size.width}.png`});const overflow=await page.evaluate(()=>({body:document.documentElement.scrollWidth>innerWidth,content:document.querySelector('.scene-content')?.scrollHeight>document.querySelector('.scene-content')?.clientHeight+2}));console.log(n,size.width,overflow)}}
await fs.writeFile('output/screenshots/browser-errors.json',JSON.stringify(errors,null,2));console.log('Browser errors',errors);await browser.close();
