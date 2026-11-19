import fs from 'node:fs';
import crypto from 'node:crypto';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
globalThis.ProgressEvent=class {constructor(type,init){Object.assign(this,{type},init)}};
const out='output/caleira-v4-pilot';fs.mkdirSync(`${out}/audit`,{recursive:true});const report=[];
for(const name of ['advisor','worker','marco','truck']){
 const bytes=fs.readFileSync(`public/assets/journey-v3/${name}.glb`);const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
 // Geometry audit does not decode embedded textures; the browser contact sheets do.
 const loader=new GLTFLoader();loader.register(()=>({name:'audit-texture-placeholder',loadTexture:()=>Promise.resolve(new THREE.Texture())}));
 const scene=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');scene.scene.updateMatrixWorld(true);
 const objects=[];scene.scene.traverse(o=>{const b=new THREE.Box3().setFromObject(o);objects.push({name:o.name,type:o.type,parent:o.parent?.name,position:o.position.toArray(),quaternion:o.quaternion.toArray(),scale:o.scale.toArray(),bounds:b.isEmpty()?null:{min:b.min.toArray(),max:b.max.toArray()},geometry:o.geometry?{positionCount:o.geometry.attributes.position?.count,groups:o.geometry.groups,materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>m.name)}:undefined})});
 const info={name,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,nodes:gltf.nodes,meshes:gltf.meshes,skins:gltf.skins,materials:gltf.materials,animations:scene.animations.map(a=>({name:a.name,duration:a.duration,tracks:a.tracks.map(t=>t.name)})),objects,decision:'Retired from V4. Original production asset preserved, not imported by pilot.'};
 fs.writeFileSync(`${out}/audit/${name}.json`,JSON.stringify(info,null,2));report.push({name,bytes:bytes.length,objects:objects.length,bones:objects.filter(o=>o.type==='Bone').length,meshes:objects.filter(o=>o.geometry).map(o=>({name:o.name,materials:o.geometry.materials})),clips:info.animations.map(a=>a.name)});
}
fs.writeFileSync(`${out}/audit/summary.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
