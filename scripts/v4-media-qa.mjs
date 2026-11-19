import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out=path.resolve('output/caleira-v4-pilot'),bin=path.resolve('node_modules/@remotion/compositor-win32-x64-msvc');
const probe=file=>JSON.parse(execFileSync(`${bin}/ffprobe.exe`,['-v','error','-count_frames','-show_entries','format=duration,size:stream=codec_name,codec_type,width,height,avg_frame_rate,nb_read_frames,duration','-of','json',file]).toString());
const provenance=JSON.parse(fs.readFileSync(`${out}/render-provenance.json`));const hashes=Object.entries(provenance.sources).map(([file,expected])=>({file,passed:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===expected}));
const results=[];fs.mkdirSync(`${out}/qa/frames`,{recursive:true});
for(const r of provenance.renders){
 const file=`${out}/${r.file}`,info=probe(file),video=info.streams.find(s=>s.codec_type==='video');
 if(Number(video.nb_read_frames)!==r.frames)throw Error('Frame count mismatch');
 if(info.streams.filter(s=>s.codec_type==='audio').length!==(r.id==='CaleiraV4Pilot'?1:0))throw Error('Unexpected audio streams');
 const tag=r.id==='CaleiraV4Pilot'?'pilot':'vehicle';
 for(let i=0;i<Math.ceil(r.frames/r.fps*2);i++)execFileSync(`${bin}/ffmpeg.exe`,['-y','-v','error','-ss',String(i/2),'-i',file,'-frames:v','1','-s','640x360','-an',`${out}/qa/frames/${tag}-${String(i+1).padStart(3,'0')}.png`]);
 if(tag==='pilot'){
  execFileSync(`${bin}/ffmpeg.exe`,['-y','-v','error','-i',file,'-vn','-ac','1','-ar','48000','-c:a','pcm_s16le',`${out}/qa/rendered-audio.wav`]);
  for(const frame of [24,66,145,201,291,402])execFileSync(`${bin}/ffmpeg.exe`,['-y','-v','error','-ss',String(frame/30),'-i',file,'-frames:v','1','-an',`${out}/stills/pilot-${frame}.png`]);
 }else execFileSync(`${bin}/ffmpeg.exe`,['-y','-v','error','-ss','2.5','-i',file,'-frames:v','1','-an',`${out}/stills/vehicle.png`]);
 const sha256=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(sha256!==r.sha256)throw Error('Video hash changed');
 results.push({file:r.file,sha256,metadata:info});
}
if(hashes.some(h=>!h.passed))throw Error('Source changed after render: '+JSON.stringify(hashes.filter(h=>!h.passed)));
fs.writeFileSync(`${out}/media-check.json`,JSON.stringify({passed:true,sourcesMatch:hashes,results},null,2));console.log(JSON.stringify(results,null,2));
