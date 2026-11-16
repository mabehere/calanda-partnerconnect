import {test,expect} from '@playwright/test';

test('Journey: eine Uhr, Pause, Replay, Kapitelzustand und Tastatur',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#scene-4');
 const canvas=page.locator('.journey canvas');
 await expect.poll(()=>canvas.getAttribute('data-time')).not.toBeNull();
 await page.getByRole('button',{name:'Film-Modus pausieren'}).click();
 await page.waitForTimeout(650);const first=await canvas.screenshot();const time=await canvas.getAttribute('data-time');
 await page.waitForTimeout(700);expect(await canvas.getAttribute('data-time')).toBe(time);expect(await canvas.screenshot()).toEqual(first);
 await page.locator('.moments button').nth(4).click();await expect(page.locator('.moment-panel')).toContainText('Die Scheibe ist gesprungen');
 await expect.poll(()=>canvas.getAttribute('data-time')).toBe('0.000');
 await expect(page.locator('.phases .active')).toHaveText('Retention');
 await page.getByRole('button',{name:'Kamera',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/scene-4/);
 await page.getByRole('button',{name:'Kapitel erneut abspielen'}).click();await expect.poll(async()=>Number(await canvas.getAttribute('data-time'))).toBeGreaterThan(.3);
 await page.getByRole('button',{name:'Film-Modus pausieren'}).click();
 await page.getByRole('button',{name:'Vorher',exact:true}).click();await expect(page.locator('.journey')).toHaveClass(/is-before/);
 await page.getByRole('button',{name:'Nachher',exact:true}).click();await expect(page.locator('.journey')).toHaveClass(/is-after/);
 await page.getByRole('button',{name:'Live-Demo · Szene 10'}).click();await expect(page).toHaveURL(/scene-10/);
});

test('Journey: automatisches Kapitel und Eco/Explore',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#scene-4');
 await expect(page.locator('.moments button').nth(1)).toHaveAttribute('aria-current','step',{timeout:30000});
 await expect(page.locator('.moment-panel')).toContainText('Ich habe angefragt');
 await page.getByRole('button',{name:'Explore',exact:true}).click();
 const canvas=page.locator('.journey canvas');await page.waitForTimeout(600);const paused=await canvas.getAttribute('data-time');await page.waitForTimeout(700);expect(await canvas.getAttribute('data-time')).toBe(paused);
 await page.getByRole('button',{name:'Reduzierte 3D-Qualität aktivieren'}).click();await expect(page.getByRole('button',{name:'Hohe 3D-Qualität aktivieren'})).toHaveAttribute('aria-pressed','true');
});

test('Journey: Reduced Motion, alle Momente, Mobile und Vollbild',async({page})=>{
 await page.goto('/#scene-4');const canvas=page.locator('.journey canvas');await expect.poll(()=>canvas.getAttribute('data-time')).toBe('0.000');
 for(let i=0;i<6;i++){await page.locator('.moments button').nth(i).click();await expect(page.locator('.moment-head')).toContainText(`0${i+1}`);await expect(page.locator('.moment-panel blockquote')).toBeVisible();}
 await page.getByRole('button',{name:'3D-Vollbild starten'}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);
 await page.getByRole('button',{name:'3D-Vollbild beenden'}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);
 await page.setViewportSize({width:390,height:844});await expect(page.getByText('Wie Marco die Beziehung erlebt · illustrativ')).toBeVisible();
 await expect(page.getByRole('button',{name:'Vorher',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Schnelle Navigation beendet Reveals und Formularpfeile bleiben lokal',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#scene-2');
 for(const n of [3,5,15,17,8,7]){await page.evaluate(n=>{location.hash=`scene-${n}`},n);await page.waitForTimeout(65)}
 await expect(page.locator('main h1')).toContainText('Aus Interesse');await page.waitForTimeout(800);
 expect(await page.locator('main h1').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 await page.locator('input').first().focus();await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/scene-7/);
});

test('WebGL-Ausfall bietet den lokalen Film an',async({page})=>{
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){if(type.includes('webgl'))return null;return get.apply(this,[type,...args] as Parameters<typeof get>)} as typeof get;});
 await page.goto('/#scene-4');await expect(page.locator('.graphics-fallback')).toBeVisible();await expect(page.locator('.graphics-fallback video')).toBeVisible();
 await expect.poll(()=>page.locator('.graphics-fallback video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
});

test('Film und direkte Demo-Links synchronisieren Moment und Presenter',async({page})=>{
 await page.goto('/#scene-4');await page.getByRole('button',{name:'Film',exact:true}).click();
 const v=page.locator('.journey-video');await expect.poll(()=>v.evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
 await v.evaluate((v:HTMLVideoElement)=>{v.pause();v.currentTime=54});
 await expect(page.locator('.moment-head')).toContainText('05');await expect(page.locator('.phases .active')).toHaveText('Retention');
 await page.getByRole('button',{name:'Sprechernotizen',exact:true}).click();const popupEvent=page.waitForEvent('popup');await page.getByRole('button',{name:'Separates Presenter-Fenster'}).click();const popup=await popupEvent;
 await expect(popup.locator('h1')).toContainText('Sechs Momente');await page.getByRole('button',{name:'Notizen schliessen'}).click();
 await page.getByRole('button',{name:'Live-Demo · Szene 10'}).click();await expect(popup.locator('h1')).toContainText('Ein Schaden');await popup.close();
});
