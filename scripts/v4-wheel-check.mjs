import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {HUBS,makeWheel,sampleWheel,disposeWheel} from '../video/v4/wheels.ts';
import {truckDistance,WHEEL_RADIUS,wheelAngle} from '../video/v4/timing.ts';
let maxHubDrift=0,maxRadialError=0,samples=0;
for(const scale of [.5,1,2]){
 const truck=new THREE.Group();truck.scale.setScalar(scale);truck.rotation.y=.63;truck.position.set(3,0,-4);
 const wheels=HUBS.map(makeWheel);truck.add(...wheels);truck.updateMatrixWorld(true);
 const baseline=wheels.map(w=>w.getWorldPosition(new THREE.Vector3()));
 for(const frame of [...Array.from({length:151},(_,i)=>i),120,25,80,80,0,150]){
  const distance=truckDistance(frame/30);
  wheels.forEach((wheel,i)=>{
   sampleWheel(wheel,distance,scale);truck.updateMatrixWorld(true);
   const hub=wheel.getWorldPosition(new THREE.Vector3());maxHubDrift=Math.max(maxHubDrift,hub.distanceTo(baseline[i]));
   const tyre=wheel.getObjectByName('tyre');const points=tyre.geometry.attributes.position;
   for(let j=0;j<points.count;j+=16){const p=new THREE.Vector3().fromBufferAttribute(points,j);const localRadius=Math.hypot(p.x,p.y);const world=tyre.localToWorld(p);const z=tyre.geometry.attributes.position.getZ(j)*scale;const radial=Math.sqrt(Math.max(0,world.distanceToSquared(hub)-z*z));maxRadialError=Math.max(maxRadialError,Math.abs(radial-localRadius*scale))}
   assert(Math.abs(wheel.rotation.z+distance/(WHEEL_RADIUS*scale))<1e-12);samples++;
  });
 }
 wheels.forEach(disposeWheel);
}
assert(maxHubDrift<1e-12);assert(maxRadialError<1e-12);
assert.equal(wheelAngle(truckDistance(0)),wheelAngle(truckDistance(.8)));
assert.equal(wheelAngle(truckDistance(4.1)),wheelAngle(truckDistance(4.9)));
const stoppedAngle=wheelAngle(truckDistance(2.1));assert.equal(stoppedAngle,wheelAngle(truckDistance(2.1)));
const result={passed:true,samples,scales:[.5,1,2],axis:'local Z',actualOuterRadius:WHEEL_RADIUS,maxHubDrift,maxRadialError,tests:['world hub invariance under rotation','world radius includes model scale','forward/reverse/random seek','pre/post motion stops','repeat sampling/pause','angle equals negative distance divided by world radius']};
fs.writeFileSync('output/caleira-v4-pilot/wheel-check.json',JSON.stringify(result,null,2));console.log(result);
