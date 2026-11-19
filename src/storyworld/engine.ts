export const stations = ['Entdecken', 'Partner gewinnen', 'Bestellen', 'Liefern', 'Service', 'Verbunden'] as const;
export type Station = 0|1|2|3|4|5;
export const stationIds:readonly Station[] = [0,1,2,3,4,5];

type Visit = {kind:'visit'; station:Station; soll:boolean; action:string; result:string};
type Reveal = {kind:'turn'|'final'; soll:boolean; action:string; result:string};
export type Step = Visit|Reveal;

const narratives:Record<Station, readonly [readonly [string,string],readonly [string,string]]> = {
 0:[['Website aufrufen','Website in einer Fremdsprache'],['Einstieg für Ofenbauer öffnen','Dreisprachiger Zugang · nach dem MVP']],
 1:[['Anfrage senden','Persönliche Antwort ausstehend'],['Anfrage übergeben','Zuständigkeit und Vertretung geklärt']],
 2:[['Bestellung per E-Mail empfangen','Vier Öfen · Bestellung von Hand ins ERP übertragen'],['Bestellung im Händlerportal übergeben','Einmalige Übergabe ans ERP · nach dem MVP']],
 3:[['Lieferstatus suchen','Status im ERP · für Marco nicht einsehbar'],['Lieferstatus am Telefon klären','ERP-Status im CRM sichtbar · Portalzugang später']],
 4:[['Glasschaden per E-Mail melden','Foto fehlt · Rückfrage nötig'],['Pflichtangaben zum Schaden prüfen','Foto ergänzt · Fall kann geprüft werden']],
 5:[['Informationen über Marco zusammensuchen','Partnerwissen in Postfächern und Excel-Listen'],['Gemeinsame Partnerhistorie öffnen','Dieselbe Historie an vier Standorten']],
};
const visits = (soll:boolean):Visit[] => stationIds.map(station=>{
 const [action,result]=narratives[station][soll?1:0];
 return {kind:'visit',station,soll,action,result};
});
export const steps:readonly Step[] = [
 ...visits(false),
 {kind:'turn',soll:false,action:'Medienbrüche im Zusammenhang sehen',result:'PartnerConnect verbindet die Partnerhistorie · das ERP bleibt führend'},
 ...visits(true),
 {kind:'final',soll:true,action:'Die gemeinsame Partnerreise überblicken',result:'Gemeinsame Historie im CRM · Auftrag und Versandstatus im ERP'},
];
export const stepName = (step:Step)=>step.kind==='visit'?stations[step.station]:step.kind==='turn'?'Wendepunkt':'Gesamtbild';
export const stationOf = (step:Step):Station=>step.kind==='visit'?step.station:5;
export const visitCount = (cursor:number,soll:boolean)=>steps.slice(0,cursor+1).filter(step=>step.kind==='visit'&&step.soll===soll).length;
export const STEP_SECONDS=3.4;
export type Mode = 'present'|'explore'|'film';
export type Story = {cursor:number; view:number; mode:Mode; generation:number; settle:boolean};
export const initial:Story = {cursor:0,view:0,mode:'present',generation:0,settle:false};
export type Command = 'forward'|'back'|'compare'|'replay'|'restart'|Mode|Station;
export function transition(s:Story,c:Command):Story {
 const update = (changes:Partial<Story>,settle=false)=>({...s,...changes,settle,generation:s.generation+1});
 const visitIndex = (station:Station,soll:boolean)=>steps.findIndex(step=>step.kind==='visit'&&step.station===station&&step.soll===soll);
 if(c==='forward'||c==='back'){
   if(s.mode!=='present'||s.cursor!==s.view)return update({view:s.cursor,mode:'present'},true);
   const cursor=Math.min(steps.length-1,Math.max(0,s.cursor+(c==='forward'?1:-1)));
   return update({cursor,view:cursor},c==='back');
 }
 const step=steps[s.view];
 if(c==='restart')return update({cursor:0,view:0,mode:'present'});
 if(c==='replay')return update({});
 if(c==='compare')return step.kind==='visit'?update({view:visitIndex(step.station,!step.soll)}):s;
 if(typeof c==='number')return update({mode:'explore',view:visitIndex(c,step.soll)},true);
 return update({mode:c,view:c==='present'?s.cursor:s.view},true);
}
export const commandEvent='caleira:story-command';
export const snapshotEvent='caleira:story-snapshot';
export const cursorKey='caleira:v5:full-cursor';
export type Snapshot={cursor:number;view:number;mode:Mode;phase:string};
export function restore():Story {
 const saved=sessionStorage.getItem(cursorKey);
 const value=Number(saved);
 return saved!==null&&Number.isInteger(value)&&steps[value]?{...initial,cursor:value,view:value,settle:true}:initial;
}
