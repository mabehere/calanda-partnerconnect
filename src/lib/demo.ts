import {create} from 'zustand';
import {persist} from 'zustand/middleware';
export type Entry={at:string;text:string};
const entry=(text:string):Entry=>({at:new Date().toLocaleTimeString('de-CH'),text});
export type Lead={email:string;company:string;stage:number;qualified:boolean;owner:string;task:string;erp:string;log:Entry[]};
export type Order={id:string;items:Record<string,number>;status:'Fehler'|'Bestätigt'|'Unterwegs'|'Geliefert';log:Entry[]};
export type Ticket={status:string;photo:boolean;owner:string;solution:string;notified:boolean;log:Entry[]};
type Demo={lead:Lead|null;orders:Order[];ticket:Ticket|null;notice:string;
 submitLead:(email:string,company:string)=>void;leadAction:(action:string)=>void;
 sendOrder:(id:string,items:Record<string,number>,fail:boolean)=>void;advanceOrder:(id:string)=>void;
 ticketAction:(action:string,value?:string)=>void;reset:(which?:string)=>void};
export const useDemo=create<Demo>()(persist((set,get)=>({
 lead:null,orders:[],ticket:null,notice:'',
 submitLead:(email,company)=>{const normalized=email.trim().toLowerCase();if(get().lead?.email===normalized){set({notice:'Dublette erkannt: vorhandener Lead geöffnet. Kein zweiter Datensatz.',lead:{...get().lead!,log:[...get().lead!.log,entry('Dublette über normalisierte E-Mail erkannt')]}});return}set({notice:'Anfrage lokal erfasst. Lead angelegt.',lead:{email:normalized,company,stage:0,qualified:false,owner:'Noch nicht zugewiesen',task:'',erp:'',log:[entry('Partneranfrage eingegangen · Quelle Website')]}})},
 leadAction:(action)=>{const lead=get().lead;if(!lead)return;const l={...lead,log:[...lead.log]};let text='';
  if(action==='qualify'){l.qualified=true;l.stage=1;text='Fachbetrieb, Region DACH und Sortimentsinteresse geprüft'}
  if(action==='assign'&&l.qualified){l.owner='Lena Weber · Hamburg';text='Standort Hamburg zugeordnet · Lena Weber verantwortlich'}
  if(action==='task'&&l.owner!=='Noch nicht zugewiesen'){l.task='Erstgespräch · nächster Arbeitstag';text='Aufgabe: Erstgespräch am nächsten Arbeitstag'}
  if(action==='delegate'&&l.task){l.owner='Jonas Frei · Stellvertretung Hamburg';text='Lena Weber abwesend · Aufgabe und Verantwortung an Jonas Frei übergeben'}
  if(action==='opportunity'&&l.qualified&&l.task){l.stage=2;text='Verkaufschance angelegt · Partner-Onboarding · nächster Schritt: Freigabe'}
  if(action==='approve'&&l.stage===2){l.stage=3;l.erp='DE-0151 (simuliert)';text='Vertriebsfreigabe dokumentiert · simulierte ERP-Partnernummer DE-0151 zugeordnet'}
  if(text){l.log.push(entry(text));set({lead:l,notice:text})}
 },
 sendOrder:(id,items,fail)=>{const old=get().orders.find(o=>o.id===id);if(old&&old.status!=='Fehler'){set({notice:'Bereits bestätigt: Transaktionskennung wiedererkannt. Kein Doppelauftrag.'});return}if(!Object.values(items).some(q=>q>0)){set({notice:'Warenkorb ist leer.'});return}
  const text=fail?'ERP-Simulation: Verbindung unterbrochen. Transaktion bleibt für Retry erhalten.':'ERP-Simulation: Auftrag einmalig bestätigt.';
  const o:Order={id,items:{...(old?.items??items)},status:fail?'Fehler':'Bestätigt',log:[...(old?.log??[]),entry(text)]};set({orders:old?get().orders.map(x=>x.id===id?o:x):[o,...get().orders],notice:text})},
 advanceOrder:id=>set({orders:get().orders.map(o=>o.id===id?{...o,status:o.status==='Bestätigt'?'Unterwegs':o.status==='Unterwegs'?'Geliefert':o.status,log:[...o.log,entry(o.status==='Bestätigt'?'ERP-Simulation: Versand bestätigt':'ERP-Simulation: Lieferung bestätigt')]}:o)}),
 ticketAction:(action,value)=>{if(action==='create'){set({ticket:{status:'Angaben fehlen',photo:false,owner:'Nicht zugewiesen',solution:'',notified:false,log:[entry('Ticket S-204 erfasst · Marco Bianchi · ERP-Auftrag CH-1042 · Glasscheibe beschädigt'),entry('Vollständigkeitsprüfung: Schadensfoto fehlt')]},notice:'Ticket S-204 erfasst. Schadensfoto fehlt.'});return}const t=get().ticket;if(!t)return;const n={...t,log:[...t.log]};let text='';
  if(action==='request'&&!n.photo){n.status='Warten auf Partner';text='Rückfrage lokal vorbereitet: Bitte Schadensfoto und Verpackungszustand ergänzen.'}
  if(action==='photo'){n.photo=true;n.status='Vollständig';text='Testfoto glass-damage.svg zugeordnet · Angaben vollständig'}
  if(action==='assign'&&n.photo){n.owner='Sofia Keller · Service Chur';text='Sofia Keller übernimmt den Fall'}
  if(action==='work'&&n.photo&&n.owner!=='Nicht zugewiesen'){n.status='In Bearbeitung';text='Technische Prüfung gestartet'}
  if(action==='escalate'&&n.status==='In Bearbeitung'){n.status='Eskaliert';n.owner='David Meier · Serviceleitung';text='Eskalation an Serviceleitung · Priorität hoch · manuell ausgelöst'}
  if(action==='solve'&&value?.trim()&&['In Bearbeitung','Eskaliert'].includes(n.status)){n.solution=value;n.status='Gelöst';text='Lösung dokumentiert: '+value}
  if(action==='notify'&&n.solution){n.notified=true;text='Partnerbenachrichtigung lokal simuliert · kein echter Versand'}
  if(action==='close'&&n.solution&&n.notified){n.status='Geschlossen';text='Ticket abgeschlossen · Abschluss und Bearbeitungshistorie archiviert'}
  if(text){n.log.push(entry(text));set({ticket:n,notice:text})}
 },
 reset:which=>set({...(!which||which==='lead'?{lead:null}:{}),...(!which||which==='order'?{orders:[]}:{}),...(!which||which==='ticket'?{ticket:null}:{}),notice:'Demo auf Startzustand zurückgesetzt.'}),
}),{name:'calanda-demo-v1',version:1,partialize:s=>({lead:s.lead,orders:s.orders,ticket:s.ticket})}));
