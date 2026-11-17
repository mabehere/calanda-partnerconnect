import fs from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Vector3} from 'three';
globalThis.ProgressEvent=class {constructor(type,init){Object.assign(this,{type},init)}};
const manifest=[];
for(const [source,target] of [['Suit','advisor'],['Casual_2','marco'],['Worker','worker'],['truck','truck']]){
 const input=`tmp/journey-v3-assets/${source}.gltf`,g=JSON.parse(fs.readFileSync(input));
 if(g.animations)g.animations=g.animations.filter(a=>['Idle','Idle_Neutral','Walk','Interact','Wave'].includes(a.name));
 // Preserve skinning and original vertex data; package embedded buffer as local GLB.
 const binary=Buffer.from(g.buffers[0].uri.split(',')[1],'base64');delete g.buffers[0].uri;
 const json=Buffer.from(JSON.stringify(g)),jp=Buffer.alloc(Math.ceil(json.length/4)*4,32);json.copy(jp);
 const bp=Buffer.alloc(Math.ceil(binary.length/4)*4);binary.copy(bp);
 const header=Buffer.alloc(12);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jp.length+bp.length,8);
 const jh=Buffer.alloc(8);jh.writeUInt32LE(jp.length);jh.writeUInt32LE(0x4e4f534a,4);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(bp.length);bh.writeUInt32LE(0x004e4942,4);
 const out=Buffer.concat([header,jh,jp,bh,bp]);fs.writeFileSync(`public/assets/journey-v3/${target}.glb`,out);
 const info={source,target,bytes:out.length,clips:g.animations?.map(a=>a.name),triangles:g.meshes.reduce((n,m)=>n+m.primitives.reduce((n,p)=>n+(p.indices!==undefined?g.accessors[p.indices].count:g.accessors[p.attributes.POSITION].count)/3,0),0)};
 if(target!=='truck'){
 const model=await new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
 model.scene.updateMatrixWorld(true);const box=new Box3().setFromObject(model.scene);info.bounds={min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new Vector3()).toArray()};
 info.clips=model.animations.map(c=>({name:c.name,duration:c.duration}));
 }
 manifest.push(info);
}
fs.writeFileSync('public/assets/journey-v3/manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
