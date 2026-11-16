import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
const page=await context.newPage();await page.goto('http://127.0.0.1:5173/#scene-4');
await page.locator('.moments button').nth(4).tap();await page.getByRole('button',{name:'Vorher',exact:true}).tap();
await page.screenshot({path:'output/creative-after/mobile-touch.png',fullPage:true});
const touch={chapter:await page.locator('.moment-head').innerText(),before:await page.locator('.journey').getAttribute('class'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),illustrative:await page.getByText('Wie Marco die Beziehung erlebt · illustrativ').isVisible()};
await context.close();const motion=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
const p=await motion.newPage();await p.goto('http://127.0.0.1:5173/#scene-4');await p.locator('canvas[data-time]').waitFor();
await p.waitForTimeout(1800);await p.screenshot({path:'output/creative-after/motion-a.png'});await p.waitForTimeout(1800);await p.screenshot({path:'output/creative-after/motion-b.png'});
await p.locator('.moments button').nth(3).click();await p.getByRole('button',{name:'Kapitel erneut abspielen'}).click();await p.waitForTimeout(3500);await p.screenshot({path:'output/creative-after/motion-logistics.png'});
await p.getByRole('button',{name:'Film-Modus pausieren'}).click();await p.getByRole('button',{name:'Kamera',exact:true}).focus();await p.screenshot({path:'output/creative-after/keyboard-focus.png'});
await motion.close();await fs.writeFile('output/creative-touch.json',JSON.stringify(touch,null,2));console.log(touch);await browser.close();

