import {test,expect} from '@playwright/test';

test('Journey führt mit dem Clicker durch beide Akte und wartet auf den nächsten Klick',async({page})=>{
 await page.goto('/#scene-4');
 const world=page.locator('.sw');
 for(let step=0;step<14;step++){
   if(step>0)await page.keyboard.press('PageDown');
   await expect(world).toHaveAttribute('data-step',String(step));
   await expect(world).toHaveAttribute('data-settled','true');
   await expect(page).toHaveURL(/scene-4/);
 }
 await expect(page.locator('.sw-result')).toContainText('Auftrag und Versandstatus im ERP');
 await expect(page.locator('.mood .dot')).toHaveCount(12);
 await page.keyboard.press('PageUp');
 await expect(world).toHaveAttribute('data-step','12');
 await page.keyboard.press('ArrowRight');
 await expect(world).toHaveAttribute('data-step','13');
 await page.getByRole('button',{name:'Journey weiter'}).click();
 await expect(page).toHaveURL(/scene-5/);
});

test('Explore, Vergleich, Qualität und Rückkehr erhalten den geführten Fortschritt',async({page})=>{
 await page.goto('/#scene-4');
 const world=page.locator('.sw');
 await expect(world).toHaveAttribute('data-settled','true');
 await page.keyboard.press('ArrowRight');
 await expect(world).toHaveAttribute('data-cursor','1');
 await page.getByRole('button',{name:'SOLL zeigen'}).click();
 await expect(world).toHaveAttribute('data-step','8');
 await expect(world).toHaveAttribute('data-cursor','1');
 await page.locator('.moments button').nth(4).click();
 await expect(world).toHaveAttribute('data-mode','explore');
 await expect(page.locator('.moment-panel')).toContainText('Die Scheibe ist gesprungen');
 await expect(page.locator('.phases .active')).toHaveText('Retention');
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Qualität · Hoch'}).click();
 await expect(page.getByRole('button',{name:'Qualität · Eco'})).toBeVisible();
 await page.getByRole('button',{name:'Vollbild',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);
 await page.getByRole('button',{name:'Vollbild',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.locator('.sw-controls').getByRole('button',{name:'Zur Präsentation'}).click();
 await expect(world).toHaveAttribute('data-step','1');
 await page.reload();
 await expect(world).toHaveAttribute('data-step','1');
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('button',{name:'Journey weiter'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Schnelle Navigation beendet Reveals und Formularpfeile bleiben lokal',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#scene-2');
 for(const n of [3,5,15,17,8,7]){await page.evaluate(n=>{location.hash='scene-'+n},n);await page.waitForTimeout(65)}
 await expect(page.locator('main h1')).toContainText('Aus Interesse');await page.waitForTimeout(800);
 expect(await page.locator('main h1').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 await page.locator('input').first().focus();await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/scene-7/);
});

test('Film und direkte Demo-Links synchronisieren Moment und Presenter',async({page})=>{
 await page.goto('/#scene-4');
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Film',exact:true}).click();
 const video=page.locator('.journey-video');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
 expect(await video.evaluate(v=>v.paused)).toBe(true);
 await video.evaluate(v=>{v.currentTime=54});
 await expect(page.locator('.moment-head')).toContainText('05');
 await expect(page.locator('.phases .active')).toHaveText('Retention');
 await page.getByRole('button',{name:'Sprechernotizen',exact:true}).click();
 const popupEvent=page.waitForEvent('popup');
 await page.getByRole('button',{name:'Separates Presenter-Fenster'}).click();
 const popup=await popupEvent;
 await expect(popup.locator('[data-story-step]')).toContainText('Service');
 await page.getByRole('button',{name:'Notizen schliessen'}).click();
 await page.getByRole('button',{name:'Live-Demo · Szene 10'}).click();
 await expect(popup.locator('h1')).toContainText('Ein Schaden');
 await popup.close();
});
