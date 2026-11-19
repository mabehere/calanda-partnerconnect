import * as THREE from 'three';
import {WHEEL_RADIUS,wheelAngle} from './timing.ts';
export const HUBS:[number,number,number][]=[[-1.2,WHEEL_RADIUS,-.88],[-1.2,WHEEL_RADIUS,.88],[1.2,WHEEL_RADIUS,-.88],[1.2,WHEEL_RADIUS,.88]];
export function makeWheel(hub:[number,number,number]){
 const pivot=new THREE.Group();pivot.name='wheel-pivot';pivot.position.set(...hub);
 const rubber=new THREE.MeshStandardMaterial({color:'#344441',roughness:.86});
 const metal=new THREE.MeshStandardMaterial({color:'#e8e4d6',roughness:.4,metalness:.2});
 const tyre=new THREE.Mesh(new THREE.TorusGeometry(WHEEL_RADIUS-.095,.095,16,48),rubber);tyre.castShadow=true;tyre.name='tyre';pivot.add(tyre);
 const disc=new THREE.Mesh(new THREE.CylinderGeometry(.235,.235,.15,40),metal);disc.rotation.x=Math.PI/2;pivot.add(disc);
 for(let i=0;i<3;i++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(.055,.35,.17),rubber);spoke.rotation.z=i*Math.PI/3;pivot.add(spoke)}
 return pivot;
}
export function sampleWheel(wheel:THREE.Group,distance:number,scale=1){wheel.rotation.z=wheelAngle(distance,scale)}
export function disposeWheel(wheel:THREE.Group){const materials=new Set<THREE.Material>();wheel.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))}});materials.forEach(m=>m.dispose())}
