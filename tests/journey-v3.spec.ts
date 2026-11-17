import {test,expect} from '@playwright/test';

test('Fehlendes Charakterasset erhält Journey-Inhalte und lokalen Film',async({page})=>{
 await page.route('**/assets/journey-v3/marco.glb',route=>route.abort());
 await page.goto('/#scene-4');
 await expect(page.locator('.graphics-fallback video')).toBeVisible();
 await expect(page.locator('.moment-panel')).toContainText('Schöne Öfen');
 await expect(page.locator('.moments button')).toHaveCount(6);
 await expect.poll(()=>page.locator('.graphics-fallback video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
});

test('Alle Kapitelassets funktionieren ohne externe Server, auch nach Explore',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const url=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(url.hostname)||url.protocol==='data:'||url.protocol==='blob:'?route.continue():route.abort()});
 await page.goto('/#scene-4');await expect(page.locator('canvas[data-time]')).toBeVisible();
 for(const chapter of [5,2,4,0,3,1]){await page.locator('.moments button').nth(chapter).click();await expect(page.locator('.moment-head')).toContainText(`0${chapter+1}`);await page.waitForTimeout(200)}
 await page.getByRole('button',{name:'Explore',exact:true}).click();await page.waitForTimeout(500);
 await page.locator('.moments button').first().click();await expect(page.locator('canvas[data-time]')).toBeVisible();
 await expect(page.locator('.graphics-fallback')).toHaveCount(0);expect(errors).toEqual([]);
});
