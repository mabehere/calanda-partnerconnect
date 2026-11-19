import {test,expect} from '@playwright/test';

test('WebGL-Ausfall erhält die klickbare Journey und den lokalen Film',async({page})=>{
 await page.addInitScript(()=>{
   const get=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){
     if(type.includes('webgl'))return null;
     return get.apply(this,[type,...args] as Parameters<typeof get>);
   } as typeof get;
 });
 await page.goto('/#scene-4');
 for(let i=0;i<14;i++){
   if(i>0)await page.keyboard.press('ArrowRight');
   await expect(page.locator('.sw')).toHaveAttribute('data-step',String(i));
   await expect.poll(()=>page.locator('.sw-fallback').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 }
 await page.getByLabel('Ansicht und Einstellungen').click();
 await page.getByRole('button',{name:'Film',exact:true}).click();
 await expect.poll(()=>page.locator('.journey-video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
});

test('Alle Stationen laufen lokal und Explore stellt den geführten Schritt wieder her',async({page})=>{
 const errors:string[]=[],external:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(['127.0.0.1','localhost'].includes(url.hostname)||url.protocol==='data:'||url.protocol==='blob:')return route.continue();
   external.push(url.href);
   return route.abort();
 });
 await page.goto('/#scene-4');
 await expect(page.locator('.sw canvas')).toBeVisible();
 for(const station of [5,2,4,0,3,1]){
   await page.locator('.moments button').nth(station).click();
   await expect(page.locator('.moment-head')).toContainText('0'+(station+1));
 }
 await page.locator('.sw-controls').getByRole('button',{name:'Zur Präsentation'}).click();
 await expect(page.locator('.sw')).toHaveAttribute('data-step','0');
 expect(errors).toEqual([]);
 await expect(page.locator('.sw-fallback')).not.toBeVisible();
 expect(external).toEqual([]);
});
