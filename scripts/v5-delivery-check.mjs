import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Group,Vector3} from 'three';
import {HUBS,makeWheel,sampleWheel,disposeWheel} from '../video/v4/wheels.ts';
import {WHEEL_RADIUS} from '../video/v4/timing.ts';
import {vanScale,vanDistance,deliveryTravel} from '../src/storyworld/deliveryMotion.ts';
const vehicle=new Group();
vehicle.scale.setScalar(vanScale);
const wheels=HUBS.map(makeWheel);
vehicle.add(...wheels);
const samples=[...Array.from({length:103},(_,i)=>i/30),2.6,1.4,1.4,.2,3.4];
let maxHubDrift=0;
for(const time of samples){
 const distance=deliveryTravel(time);
 vehicle.position.x=distance-.12;
 for(const [i,wheel] of wheels.entries()){
   sampleWheel(wheel,distance,vanScale);
   const hub=vehicle.worldToLocal(wheel.getWorldPosition(new Vector3()));
   maxHubDrift=Math.max(maxHubDrift,hub.distanceTo(new Vector3(...HUBS[i])));
   assert.ok(Math.abs(wheel.rotation.z*vanScale*WHEEL_RADIUS+distance)<1e-12);
 }
}
assert.ok(maxHubDrift<1e-12);
assert.equal(deliveryTravel(.5),0);
assert.equal(deliveryTravel(3.4),vanDistance);
wheels.forEach(disposeWheel);
const result={samples:samples.length*4,maxHubDrift,scale:vanScale,distance:vanDistance,radius:WHEEL_RADIUS,passed:true};
fs.writeFileSync('output/interactive-storyworld-v5/full/delivery-check.json',JSON.stringify(result,null,2));
console.log(result);
