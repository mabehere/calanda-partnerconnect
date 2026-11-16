import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const phase=process.argv[2]||'after';
const root=`output/creative-${phase}`;
await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:process.env.PW_CHANNEL||'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
const errors=[],layout=[],content={};page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>['127.0.0.1','localhost'].includes(new URL(r.request().url()).hostname)||r.request().url().startsWith('data:')?r.continue():r.abort());
for(const width of [1920,1366]){
 await page.setViewportSize({width,height:width===1920?1080:768});
 for(let n=1;n<=19;n++){
  await page.goto(`http://127.0.0.1:5173/#scene-${n}`);await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(n===1||n===4?1800:150);
  await page.screenshot({path:`${root}/scene-${String(n).padStart(2,'0')}-${width}.png`});
  content[n]=await page.locator('main').innerText();
  layout.push({scene:n,width,...await page.evaluate(()=>({horizontal:document.documentElement.scrollWidth>innerWidth,scroll:document.querySelector('.scene-content')?.scrollHeight>document.querySelector('.scene-content')?.clientHeight+2}))});
 }
 await page.goto('http://127.0.0.1:5173/#scene-4');await page.locator('.moments button').first().waitFor();
 for(let c=0;c<6;c++){
  await page.locator('.moments button').nth(c).click();await page.waitForTimeout(500);
  await page.screenshot({path:`${root}/journey-${c+1}-after-${width}.png`});
  await page.getByRole('button',{name:'Vorher',exact:true}).click();await page.waitForTimeout(100);
  await page.screenshot({path:`${root}/journey-${c+1}-before-${width}.png`});
  await page.getByRole('button',{name:'Nachher',exact:true}).click();
 }
 await page.getByRole('button',{name:'Kamera',exact:true}).click();await page.waitForTimeout(300);await page.screenshot({path:`${root}/journey-wide-${width}.png`});
 await page.getByRole('button',{name:'Explore',exact:true}).click();await page.mouse.move(width*.4,350);await page.mouse.down();await page.mouse.move(width*.5,400,{steps:10});await page.mouse.up();await page.screenshot({path:`${root}/journey-explore-${width}.png`});
}
await page.getByRole('button',{name:'Film',exact:true}).click();const v=page.locator('video');await v.evaluate(async el=>{if(el.readyState<2)await new Promise(r=>el.addEventListener('loadeddata',r,{once:true}));el.pause()});
const media=await v.evaluate(el=>({width:el.videoWidth,height:el.videoHeight,duration:el.duration}));
for(const t of [0,6,12,18,24,30,36,42,48,54,60,66,71.9]){await v.evaluate(async(el,t)=>{if(t===0)t=.001;const ready=new Promise(r=>el.addEventListener('seeked',r,{once:true}));el.currentTime=t;await ready},t);const pixels=await v.evaluate(el=>{const c=document.createElement('canvas');c.width=el.videoWidth;c.height=el.videoHeight;c.getContext('2d').drawImage(el,0,0);return c.toDataURL('image/png').split(',')[1]});await fs.writeFile(`${root}/film-${t}.png`,Buffer.from(pixels,'base64'))}
await fs.writeFile(`${root}/observations.json`,JSON.stringify({errors,layout,media,content},null,2));
console.log(JSON.stringify({phase,errors,layout,media}));await browser.close();

