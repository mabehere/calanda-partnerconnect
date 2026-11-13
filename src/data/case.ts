export const CASE = {
  company:'Calanda Feuertechnik AG', agency:'FELSGRAD', headquarters:'Chur', employees:70,
  locations:['Chur','Locarno','Hamburg','Paris'], partners:150,
  acquisition:{requests:80,qualified:20,newPartners:4,days:90,responseDays:4},
  orders:{monthly:1200,manualShare:40,minutes:12,hourlyValue:60},
  service:{monthly:200,incompleteShare:35,clarificationDays:6},
  limits:{investment:150000,monthly:3000,months:6},
  mvp:['R1','R2','R5','R7'],future:['R3','R4','R6','R8'],
  source:'Nutzerauftrag; FHGR-Originaldateien fehlen. Originalprüfung offen.',
} as const;
export const PLAN = {
  investment:145000, monthly:2600, targets:{responseDays:1,newPartners:6,incompleteShare:15},
  costs:[['Analyse & Konzeption',18000],['CRM-Konfiguration',25000],['ERP-Integration',36000],['Serviceprozesse',20000],['Datenmigration',15000],['Tests & Schulung',12000],['Sicherheit & Rechte',8000],['Reserve',11000]] as const,
  recurring:[['Lizenzen · 20 interne Nutzer',1200],['Hosting & Monitoring',400],['Betrieb & Support',1000]] as const,
  pilotEmployees:8,pilotPartners:10,clientDays:45,aiCases:100,aiAccuracy:90,aiCriticalErrors:0,aiTimeReduction:20,
} as const;
export const PRODUCTS = [
  {id:'ALP-80',name:'Alpin 80',type:'Kaminofen',price:2840,kw:'6 kW',description:'Klare Linien. Schweizer Wärme. Stahl, Panoramaglas und ein präziser Abbrand.'},
  {id:'ROC-60',name:'Rocca 60',type:'Kamineinsatz',price:3260,kw:'8 kW',description:'Architektonisch integrierter Kamineinsatz mit grosszügigem Blick auf das Feuer.'},
  {id:'VAL-40',name:'Val 40',type:'Kompaktofen',price:2190,kw:'4 kW',description:'Kompakte Feuerstätte für sorgfältig geplante Wohnräume.'},
] as const;
export const SCENARIOS = {Konservativ:30,Basis:60,Optimistisch:90} as const;
export const chf=(n:number)=>new Intl.NumberFormat('de-CH',{style:'currency',currency:'CHF',maximumFractionDigits:0}).format(n);
export const number=(n:number,digits=0)=>new Intl.NumberFormat('de-CH',{maximumFractionDigits:digits}).format(n);
