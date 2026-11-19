import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {transition,steps,initial} from '../src/storyworld/engine.ts';
let state=initial;
for(let i=0;i<steps.length;i++){
 assert.equal(state.cursor,i);
 for(const c of ['compare','replay','compare','explore',1,'film','present'])state=transition(state,c);
 assert.equal(state.view,i);assert.equal(state.cursor,i);
 state=transition(state,'forward');
}
for(let i=2;i>=0;i--){state=transition(state,'back');assert.equal(state.view,i);assert(state.settle)}
const normalize=s=>s.replaceAll('\r\n','\n');
const read=p=>normalize(fs.readFileSync(p,'utf8'));
const base=p=>normalize(execFileSync('git',['show','53e0339:'+p],{encoding:'utf8'}));
const slice=(s,start,end)=>s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)));
const file='src/components/Journey.tsx';
for(const [start,end] of [['const chapters=','export '],['<aside className="moment-panel"','</aside>']]){
 assert.equal(slice(read(file),start,end).trim(),slice(base(file),start,end).trim());
}
for(const file of ['src/content/scenes.ts','src/data/case.ts','.vercelignore'])assert.equal(read(file),base(file));
const report=JSON.parse(read('output/caleira-v4-pilot/render-provenance.json'));
for(const r of report.renders)assert.equal(crypto.createHash('sha256').update(fs.readFileSync('output/caleira-v4-pilot/'+r.file)).digest('hex'),r.sha256);
assert.equal(execFileSync('git',['hash-object','public/media/caleira-customer-journey.mp4'],{encoding:'utf8'}).trim(),'e6bc33863631d3a10e4348c1a9b3edcc6162aa88');
console.log('Four states, reverse restoration, compare/replay/mode invariants, original moments and phases, scene data, case facts, ignore rules and three MP4 hashes passed.');
