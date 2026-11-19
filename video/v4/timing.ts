export const FPS=30;
export const PILOT={chapterBreak:180,duration:447,voiceStarts:[6,96,186,324]} as const;
export const VOICE_LINES=[
 'Marco entdeckt Caleira im Showroom.',
 'Aus Interesse wird eine Anfrage.',
 'PartnerConnect ordnet sie einer verantwortlichen Person zu.',
 'So wird aus der Anfrage ein nächster Schritt.',
] as const;
export const VOICE_SECONDS=[2.8225,2.564875,4.4481875,3.8323125] as const;
export const ease=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*(3-2*p)};
export function truckDistance(t:number){return 6*ease((t-1)/3)}
export const WHEEL_RADIUS=.38;
export function wheelAngle(distance:number,modelScale=1){return -distance/(WHEEL_RADIUS*modelScale)}
export function pilotChapter(frame:number){return frame<PILOT.chapterBreak?0:1}
export function armAngles(side:number,gesture:string,time:number){
 const p=gesture==='point'?ease((time-.65)/.55)*(1-ease((time-2.5)/.6)):gesture==='tap'?ease((time-.6)/.5)*(1-ease((time-2.2)/.6)):0;
 const activeSide=gesture==='tap'?1:-1;
 return {shoulder:[side===activeSide?-.12-p*(gesture==='tap'?.68:.72):-.12,0,side*.09] as [number,number,number],elbow:[side===activeSide?-.25-p*(gesture==='tap'?.4:.9):-.2,0,0] as [number,number,number]};
}
