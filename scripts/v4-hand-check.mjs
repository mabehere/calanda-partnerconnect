import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {armAngles} from '../video/v4/timing.ts';
import {DESK,ADVISOR,TABLET} from '../video/v4/layout.ts';
const desk=new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...DESK.position),new THREE.Vector3(...DESK.size));
const tablet=new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...TABLET.position),new THREE.Vector3(...TABLET.size));
let intersections=0,vertices=0,touchSamples=0;
for(const side of [-1,1]){
 const root=new THREE.Group();root.position.set(...ADVISOR.position);root.rotation.y=ADVISOR.yaw;
 const arm=new THREE.Group();arm.position.set(side*.34,1.34,0);root.add(arm);
 const fore=new THREE.Group();fore.position.set(0,-.31,0);arm.add(fore);
 const hand=new THREE.Mesh(new THREE.SphereGeometry(1,32,24));hand.position.set(0,-.31,.015);hand.scale.set(.085,.105,.075);fore.add(hand);
 const lower=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.14,8,20));lower.position.y=-.14;fore.add(lower);
 const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.13,8,20));upper.position.y=-.155;arm.add(upper);
 for(let sample=0;sample<=300;sample++){
  const angles=armAngles(side,'tap',sample/100);arm.rotation.set(...angles.shoulder);fore.rotation.set(...angles.elbow);root.updateMatrixWorld(true);let touch=false;
  for(const mesh of [hand,lower,upper]){const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++){const p=mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(positions,i));vertices++;if(desk.containsPoint(p))intersections++;if(mesh===hand&&tablet.containsPoint(p))touch=true}}
  if(touch)touchSamples++;
 }
 for(const mesh of [hand,lower,upper])mesh.geometry.dispose();
}
assert.equal(intersections,0,'Hand or arm enters desk volume');assert(touchSamples>0,'Gesture never reaches tablet');
const result={passed:true,sampledTimes:301,arms:2,verticesTested:vertices,deskIntersections:intersections,tabletTouchSamples:touchSamples,method:'World-space vertices of actual hand ellipsoid and arm capsules, shared pose and layout; conservative full desk AABB (rounded edge lies inside).'};
fs.writeFileSync('output/caleira-v4-pilot/hand-check.json',JSON.stringify(result,null,2));console.log(result);
