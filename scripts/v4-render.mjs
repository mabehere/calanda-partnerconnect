import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia,openBrowser} from '@remotion/renderer';
const out=path.resolve('output/caleira-v4-pilot'),mode=process.argv[2]||'preview';
fs.mkdirSync(`${out}/stills`,{recursive:true});fs.mkdirSync(`${out}/audit/views`,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve(mode==='before'?'video/index.ts':'video/v4/index.ts'),publicDir:path.resolve('tmp/v4-public'),outDir:path.resolve(mode==='before'?'tmp/v4-old-bundle':'tmp/v4-bundle')});
const chromiumOptions={gl:'angle'};const browser=await openBrowser('chrome',{chromiumOptions});
const common={serveUrl,puppeteerInstance:browser,chromiumOptions,isProduction:false};
try{
 if(mode==='before'){
  const composition=await selectComposition({...common,id:'CaleiraJourney'});
  for(const frame of [60,420]){await renderStill({...common,composition,frame,output:`${out}/stills/v3-${frame}.png`});console.log('V3 comparison',frame)}
 }
 if(mode==='preview'||mode==='stills'){
  const composition=await selectComposition({...common,id:'CaleiraV4Pilot'});
  for(const frame of (mode==='preview'?[60,270,390]:[24,66,145,201,291,402])){await renderStill({...common,composition,frame,output:`${out}/stills/pilot-${frame}.png`});console.log('Still',frame)}
  const vehicle=await selectComposition({...common,id:'CaleiraV4VehicleTest'});await renderStill({...common,composition:vehicle,frame:75,output:`${out}/stills/vehicle.png`});
 }
 if(mode==='assets'||mode==='assets-new'){
  for(const kind of (mode==='assets-new'?['legacy-truck','marco','advisor','stove','van']:['legacy-advisor','legacy-worker','legacy-marco','legacy-truck','marco','advisor','stove','van'])){
   const inputProps={kind};const composition=await selectComposition({...common,id:'CaleiraV4AssetReview',inputProps});
   for(const frame of [0,30,60,90]){await renderStill({...common,composition,inputProps,frame,output:`${out}/audit/views/${kind}-${frame}.png`});console.log(kind,frame)}
  }
 }
 if(mode==='films'){
  const start=new Date().toISOString();const sources={};
  for(const file of [...fs.readdirSync('video/v4').map(f=>`video/v4/${f}`),...fs.readdirSync('tmp/v4-public/audio').map(f=>`tmp/v4-public/audio/${f}`),'scripts/v4-render.mjs'])sources[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const renders=[];
  for(const [id,file] of [['CaleiraV4Pilot','caleira-v4-pilot.mp4'],['CaleiraV4VehicleTest','caleira-v4-vehicle-test.mp4']]){
   const composition=await selectComposition({...common,id});let last=-1;
   // Windows can refuse Remotion's final rename over a previously opened MP4.
   // Render to a unique local staging path, then copy the completed file and verify.
   fs.mkdirSync('tmp/v4-final-renders',{recursive:true});
   const staged=path.resolve(`tmp/v4-final-renders/${crypto.randomUUID()}.mp4`);
   await renderMedia({...common,composition,codec:'h264',outputLocation:staged,concurrency:2,crf:18,audioBitrate:'192k',onProgress:p=>{const n=Math.floor(p.progress*10);if(n!==last){last=n;console.log(id,n*10+'%')}}});
   fs.copyFileSync(staged,`${out}/${file}`);
   if(!fs.readFileSync(staged).equals(fs.readFileSync(`${out}/${file}`)))throw Error('Final render copy mismatch');
   const bytes=fs.readFileSync(`${out}/${file}`);renders.push({id,file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,fps:composition.fps,frames:composition.durationInFrames,width:composition.width,height:composition.height});
  }
  fs.writeFileSync(`${out}/render-provenance.json`,JSON.stringify({started:start,completed:new Date().toISOString(),entry:'video/v4/index.ts',baseCommit:'b2f4ece860c7b9ea8533dca39e098f02c74fc1aa',sources,renders},null,2));
 }
}finally{await browser.close({silent:true})}


