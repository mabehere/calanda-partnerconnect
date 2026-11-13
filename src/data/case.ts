export const CASE = {
  company:'Caleira AG', agency:'Super Trooper', platform:'Salesforce', headquarters:'Chur', employees:70,
  locations:['Chur','Locarno','Hamburg','Paris'], partners:150,
  acquisition:{requests:80,qualified:20,newPartners:4,days:90,responseDays:4},
  orders:{monthly:1200,manualShare:40,minutes:12,hourlyValue:60},
  service:{monthly:200,incompleteShare:35,clarificationDays:6},
  limits:{investment:150000,monthly:3000,months:6},
  mvp:['R1','R2','R5','R7'],future:['R3','R4','R6','R8'],
  source:'FHGR Pitch-Case 2026 (24.09.2026) und Bewertungsraster Pitch 2026; abgeglichen am 13.11.2026.',
} as const;
// Annahmen, nicht aus dem Case: Tagessatz, Personentage, Salesforce-Listenpreis (Pro Suite, Stand 13.11.2026), Nutzerzahl.
export const PLAN = {
  investment:145000, monthly:2600, dayRate:1400, days:96, users:12, userPrice:100,
  targets:{responseDays:1,newPartners:6,incompleteShare:15},
  costs:[['Discovery & Konzeption · 12 PT',16800],['Sales Cloud: Partner & Lead · 15 PT',21000],['Service Cloud: Cases · 12 PT',16800],['ERP-Integration · 24 PT',33600],['Datenmigration & Dubletten · 9 PT',12600],['Rechte, Sicherheit & Tests · 9 PT',12600],['Schulung & Einführung · 8 PT',11200],['Projektleitung · 7 PT',9800],['Reserve · 7,9 %',10600]] as const,
  recurring:[['Salesforce Pro Suite · 12 Nutzer × CHF 100',1200],['Integration & Monitoring',400],['Betrieb & Support',1000]] as const,
  userSplit:[['Partnerbetreuung Chur',3],['Partnerbetreuung Locarno, Hamburg, Paris',3],['Service',4],['Vertriebsleitung',1],['Administration / IT',1]] as const,
  followUp:{portalMonthly:3750,portalPricePerPartner:25,clarificationMinutes:20},
  pilotEmployees:8,pilotPartners:10,clientDays:45,aiCases:100,aiAccuracy:90,aiCriticalErrors:0,aiTimeReduction:20,
} as const;
export const PRODUCTS = [
  {id:'ALP-80',name:'Alpin 80',type:'Kaminofen',price:2840,kw:'6 kW',description:'Klare Linien. Schweizer Wärme. Stahl, Panoramaglas und ein präziser Abbrand.'},
  {id:'ROC-60',name:'Rocca 60',type:'Kamineinsatz',price:3260,kw:'8 kW',description:'Architektonisch integrierter Kamineinsatz mit grosszügigem Blick auf das Feuer.'},
  {id:'ET-G80',name:'Ersatzscheibe A80',type:'Ersatzteil',price:186,kw:'ab Lager',description:'Ersatzscheibe für den Alpin 80. Ersatzteile und Zubehör machen die wiederkehrenden Bestellungen aus.'},
] as const;
export const SCENARIOS = {Konservativ:30,Basis:60,Optimistisch:90} as const;
export const chf=(n:number)=>new Intl.NumberFormat('de-CH',{style:'currency',currency:'CHF',maximumFractionDigits:0}).format(n);
export const number=(n:number,digits=0)=>new Intl.NumberFormat('de-CH',{maximumFractionDigits:digits}).format(n);
