import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const baseline=fs.readFileSync('output/creative-baseline/commit.txt','utf8').replace(/^\uFEFF/,'').trim();
const git=(...args)=>execFileSync('git',args,{maxBuffer:20*1024*1024});
const original=p=>git('show',`${baseline}:${p}`);
// Git stores LF while this Windows checkout uses CRLF. Normalize only line endings.
const canonical=b=>b.toString().replace(/\r\n/g,'\n');
const hash=b=>createHash('sha256').update(canonical(b)).digest('hex');
const paths=git('ls-tree','-r','--name-only',baseline).toString().trim().split('\n').filter(p=>/^(src\/(data|content|lib)\/|docs\/|scripts\/documentation\.mjs$|tests\/pitch\.spec\.ts$|public\/downloads\/nachweise\.md$|output\/content\.json$)/.test(p));
const checks=paths.map(path=>({path,passed:hash(original(path))===hash(fs.readFileSync(path)),sha256:hash(fs.readFileSync(path))}));
const extractJourney=s=>canonical(s.slice(s.indexOf('const chapters='),s.indexOf('export default function Journey')));
checks.push({path:'Journey: chapters, descriptions, MOMENTS, MOOD, PHASES',passed:extractJourney(original('src/components/Journey.tsx').toString())===extractJourney(fs.readFileSync('src/components/Journey.tsx','utf8'))});
const film=s=>[...s.matchAll(/<Sequence name="[\s\S]*?<\/Sequence>/g)].map(m=>m[0]);
checks.push({path:'Film: all sequences, titles, captions, durations',passed:JSON.stringify(film(original('video/root.tsx').toString()))===JSON.stringify(film(fs.readFileSync('video/root.tsx','utf8')))});
for(const path of ['src/components/Demos.tsx','src/components/Details.tsx','src/components/BusinessCase.tsx','src/components/Partner.tsx','package.json','package-lock.json'])checks.push({path,passed:hash(original(path))===hash(fs.readFileSync(path))});
const normal=s=>s.replace(/\s+/g,' ').trim();
if(fs.existsSync('output/creative-after/observations.json')){
 const before=JSON.parse(fs.readFileSync('output/creative-baseline/observations.json','utf8')).content;
 const after=JSON.parse(fs.readFileSync('output/creative-after/observations.json','utf8')).content;
 for(const n of Object.keys(before))checks.push({path:`Rendered main text scene ${n}`,passed:normal(before[n])===normal(after[n])});
}
fs.writeFileSync('output/content-freeze-check.json',JSON.stringify({baseline,checks},null,2));
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} content checks passed`);for(const c of checks.filter(c=>!c.passed))console.error(c.path);process.exitCode=checks.every(c=>c.passed)?0:1;
