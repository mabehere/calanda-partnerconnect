export const stations = ['Entdecken', 'Partner gewinnen'] as const;
export const steps = [
  {station:0, soll:false, action:'Website aufrufen', result:'Website in einer Fremdsprache'},
  {station:1, soll:false, action:'Anfrage senden', result:'Persönliche Antwort ausstehend'},
  {station:0, soll:true, action:'Einstieg für Ofenbauer öffnen', result:'Dreisprachiger Zugang · nach dem MVP'},
  {station:1, soll:true, action:'Anfrage übergeben', result:'Zuständigkeit und Vertretung geklärt'},
] as const;
export type Mode = 'present'|'explore'|'film';
export type Story = {cursor:number; view:number; mode:Mode; generation:number; settle:boolean};
export const initial:Story = {cursor:0,view:0,mode:'present',generation:0,settle:false};
export type Command = 'forward'|'back'|'compare'|'replay'|Mode|0|1;
export function transition(s:Story,c:Command):Story {
  const update = (changes:Partial<Story>,settle=false)=>({...s,...changes,settle,generation:s.generation+1});
  if(c==='forward'||c==='back'){
    const cursor=Math.min(steps.length-1,Math.max(0,s.cursor+(c==='forward'?1:-1)));
    return update({cursor,view:cursor,mode:'present'},c==='back');
  }
  if(c==='replay')return update({});
  if(c==='compare')return update({view:steps.findIndex(v=>v.station===steps[s.view].station&&v.soll!==steps[s.view].soll)});
  if(typeof c==='number')return update({mode:'explore',view:steps.findIndex(v=>v.station===c&&v.soll===steps[s.view].soll)});
  return update({mode:c,view:c==='present'?s.cursor:s.view},true);
}
export const commandEvent='caleira:story-command';
export const snapshotEvent='caleira:story-snapshot';
export type Snapshot={cursor:number;view:number;mode:Mode;phase:string};
export function restore():Story {
  const value=Number(sessionStorage.getItem('caleira:v5:cursor'));
  return Number.isInteger(value)&&steps[value]?{...initial,cursor:value,view:value,settle:sessionStorage.getItem('caleira:v5:cursor')!==null}:initial;
}
