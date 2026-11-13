// Erzeugt alle Docs aus einer Quelle: Szenen, Case-Daten und den Tabellen in dieser Datei.
// Aufruf: node scripts/documentation.mjs
import fs from 'node:fs/promises';
import {SCENES} from '../src/content/scenes.ts';
import {CASE,PLAN} from '../src/data/case.ts';
await fs.mkdir('docs',{recursive:true});await fs.mkdir('public/downloads',{recursive:true});await fs.mkdir('output',{recursive:true});
const table=(head,rows)=>'| '+head.join(' | ')+' |\n|'+head.map(()=>'---').join('|')+'|\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n';
const chf=n=>'CHF '+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'’');
const write=(file,text)=>fs.writeFile(file,text.trim()+'\n');

// ID, Kriterium, 5-Punkte-Anker (Originaltext Bewertungsraster 2026), Szene, Nachweis, Stand nach Umbau
const criteria=[
 ['R1','Partnerübersicht','Zusätzlich Bestellungen/Fälle verbunden, Datenquelle und Dublettenbehandlung erklärt.','08','Register Übersicht, Bestellungen, Service, Historie; Zeilen «Datenquelle» und «Dublettenregel»','Erfüllt. Asset und Datenquelle sichtbar.'],
 ['R2','Lead und Verkaufschance','Zusätzlich klare Qualifikationskriterien, nächster Schritt und Vertretung bei Ausfall.','07','Anfrage, Dublette, drei Fit-Kriterien, Aufgabe, Stellvertretung, Konvertierung, Freigabe','Erfüllt.'],
 ['R3','Marketing Journey','Zusätzlich Datenquelle, Versand-/Stoppregel, Abmeldung und Erfolgsmessung erklärt.','11','Segment, Auslöser 8 Wochen vor Saison, E-Mail, Stopp bei Bestellung oder Abmeldung, Kontrollgruppe','Erfüllt.'],
 ['R4','B2B-Bestellung','Zusätzlich ERP-Übergabe, Bestellhistorie und Behandlung einer fehlgeschlagenen Übergabe.','09','Login, Partnerpreis, Warenkorb, Störung, sichere Wiederholung, Status','Erfüllt.'],
 ['R5','Serviceprozess','Zusätzlich fehlende Angaben, Eskalation und Information des Partners berücksichtigt.','10','Case mit Bezug zu Partner, Bestellung und Asset; Rückfrage, Eskalation, Nachricht, Abschluss','Erfüllt.'],
 ['R6','Website und Inhalte','Zusätzlich konsistente Navigation, bearbeitbare Inhalte und begründete Nutzerführung.','12','Zwei Eingänge, Weg zum Fachpartner, Editor; Begründung im Sprechtext','Erfüllt, Begründung mündlich.'],
 ['R7','Systeme und Daten','Zusätzlich Rechte, Datenqualität und Verhalten bei Schnittstellenfehlern schlüssig.','06, 09, 13','Systembild mit Salesforce, Integrationsschicht, ERP; Fehlerliste; Rollen','Erfüllt.'],
 ['R8','KI-Entscheid','Zusätzlich Prüfung, menschliche Verantwortung und messbarer Pilot. Auch begründeter Verzicht möglich.','14','Regel gegen KI-Vorschlag, manuelle Freigabe, Pilot mit drei Schwellen','Erfüllt.'],
 ['V1','Problemverständnis','Zusätzlich Zielkonflikt, Unsicherheit und zu prüfende Annahme überzeugend behandelt.','02, 03','Zielkonflikt Wachstum gegen Verlässlichkeit; offene Annahme Saison oder Werkzeug','Erfüllt, lebt vom Vortrag.'],
 ['V2','Nutzenlogik','Zusätzlich Alternativursache und Bedingungen des Nutzens konkret begründet.','05, 15, 16','Alternativursache Saison und Besetzung; Vorjahresvergleich als Bedingung','Erfüllt.'],
 ['V3','Messung und Rechnung','Zusätzlich Verantwortliche, Zeitraum und Sensitivität. Kapazitätswert von Kosteneinsparung unterschieden.','15, 16','Drei KPIs mit Messweg und Verantwortung; MVP-Rechnung; Szenarien 30/60/90 %','Erfüllt.'],
 ['V4','Pitch-Story','Zusätzlich klare Priorität und Entscheidungsaufforderung. Behauptungen durch passende Nachweise gestützt.','01, 07–10, 19','Marco durch alle drei Journeys; Kältewoche als Klammer; drei Bitten am Schluss','Erfüllt.'],
 ['M1','MVP und Priorisierung','Zusätzlich Abhängigkeiten, Ausschlüsse und Gründe für Reihenfolge schlüssig.','06, 17','R1/R2/R5/R7 im MVP; Portal später wegen Schreib-Schnittstelle und Lizenzen','Erfüllt.'],
 ['M2','Meilensteine und Entscheidungen','Zusätzlich messbare Freigabekriterien, verantwortliche Rollen und Anpassung bei verfehltem Pilotziel.','17','Sechs Tore mit Kriterium und Rolle; Vorgehen bei Nichtbestehen','Erfüllt.'],
 ['P1','Zusammenarbeit und Einführung','Zusätzlich konkreter Kundenaufwand, Abnahmeverantwortung und Betrieb nach Projektende.','17, 18','45 Personentage Kunde, Abnahme durch Sponsor, Betriebsmodell','Erfüllt.'],
 ['P2','Kosten und Risiken','Zusätzlich Mengen/Raten, Folgekosten, Reserve und Verantwortliche für Risiken nachvollziehbar.','18','96 PT × CHF 1’400, 12 Lizenzen × CHF 100, Reserve, Portal-Folgekosten, drei Risiken mit Verantwortlichen','Erfüllt, Preise sind Annahmen.'],
 ['A1','Verständlichkeit und Medien','Zusätzlich gezielte Verdichtung und flüssige Medienführung. Auch Detailfragen lassen sich gut verorten.','alle','Eine Kernaussage je Szene; Demo-Backup für Details','Generalprobe nötig.'],
 ['A2','Teamkoordination','Zusätzlich Beiträge greifen ineinander, das Team unterstützt sich und löst Übergänge ohne Brüche.','alle','Sechs Sprechblöcke mit Übergabesätzen','Namen einsetzen, proben.'],
 ['A3','Kundenorientierung','Zusätzlich fasst es das Anliegen korrekt zusammen und passt Erklärung oder Priorität daran an.','16, 19','Rückfrage an die Geschäftsleitung in Szene 16 und 19','Live-Leistung.'],
 ['A4','Fragen und Einwände','Zusätzlich Alternativen abgewogen und konkrete Klärung vereinbart. Team beantwortet Einwände konsistent.','19 + Gespräch','Top-10-Fragen mit Antwort und zuständiger Person','Live-Leistung.'],
];
await write('docs/rubric-coverage.md',`# Abdeckung des Bewertungsrasters

Quelle: «FHGR – Bewertungsraster Pitch 2026», Blätter Bewertung, Leistungsanker und Anforderungen. 20 Kriterien à 5 Punkte. Die Spalte «Stand» ist die Einschätzung des Teams, nicht der Jury.

${table(['ID','Kriterium','5-Punkte-Anker (Originaltext)','Szene','Nachweis','Stand'],criteria)}
Format: ${SCENES.length} Hauptfolien (erlaubt 20 inklusive Titel), ${SCENES.reduce((s,x)=>s+x.seconds,0)/60} Minuten Pitch, danach 15 Minuten Kundengespräch.`);

const reqs=[
 ['R1','Partner, Kontakte, verantwortliche Person; Interaktionen, Bestellungen und Fälle verknüpft','MVP','Szene 08 · Demo Partnerübersicht','Grundlage für alles Weitere'],
 ['R2','Anfrage erfassen, qualifizieren, zuweisen, bis zum nächsten Verkaufsschritt verfolgen','MVP','Szene 07 · Demo Journey 1','Antwortzeit ist der schnellste sichtbare Gewinn'],
 ['R3','Ein Segment, ein Auslöser, eine E-Mail; Datenbasis, Versandlogik, Abmeldung','Stufe 2','Szene 11 · Demo Marketing','Braucht saubere Kontakte und Einwilligungen aus dem MVP; rechtzeitig vor der nächsten Heizsaison'],
 ['R4','Geschützter Katalog, Partnerpreise, Warenkorb, Abschluss, ERP-Übergabe, Status','Stufe 3','Szene 09 · Demo Journey 2','Braucht geprüfte Schreib-Schnittstelle ins ERP und Portal-Lizenzen ausserhalb des MVP-Budgets'],
 ['R5','Anfrage zu Partner und Bestellung; Zuständigkeit, Status, Rückmeldung','MVP','Szene 10 · Demo Journey 3','35 % unvollständige Fälle, 6 Arbeitstage Klärung'],
 ['R6','Partner und Endkunden unterscheiden; Inhalt mit Produkt oder Partneranfrage verbinden','Stufe 2','Szene 12 · Demo Website','Bestehende Website genügt für das Lead-Formular im MVP; Mehrsprachigkeit folgt'],
 ['R7','Architektur mit führenden Daten, Schnittstellen, Zugriffsrechten; ERP bleibt','MVP','Szenen 06, 13 · Systembild','Ohne geprüfte ERP-Referenzen keine verlässliche Partnersicht'],
 ['R8','KI-Fall mit Lösung ohne KI vergleichen; Daten, Kontrolle, Nutzen, Grenzen','Stufe 4','Szene 14 · Demo KI-Entscheid','Regeln genügen für den Start; KI erst nach messbarem Pilot'],
];
const reqText=`# Anforderungen R1–R8 mit Folien- und Demo-Verweisen

${table(['ID','Verbindlicher Inhalt (Case)','Stufe','Nachweis','Begründung der Stufe'],reqs)}
Abhängigkeiten: R7 vor R1 und R5 (ERP-Referenzen). R1 vor R3 (Kontakte, Einwilligungen). R7 lesend im MVP, schreibend erst für R4. R5 liefert die Falldaten für R8.

Ausschlüsse im MVP: kein Direktverkauf an Endkunden, kein Partnerportal, kein Mailversand an Partner, keine KI.`;
await write('docs/requirements-matrix.md',reqText);
await write('public/downloads/nachweise.md',reqText+'\n\n'+`## Quellen

- FHGR, Digital Relationship Management, Pitch-Case 2026 (Schulte/Merz, 24.09.2026).
- FHGR, Bewertungsraster Pitch 2026.
- Vorlesungsfolien Block 1–4 (Road to Proposal, CRM, Marketing Automation und CMS, Commerce und Communication Skills).
- Salesforce-Listenpreise: öffentliche Preisseiten, abgerufen am 13.11.2026.

Alle weiteren Werte sind Zusatzannahmen und in docs/assumptions.md aufgeführt.`);

await write('docs/case-facts.md',`# Case-Fakten

Quelle: ${CASE.source} Alle Werte stimmen mit dem Case überein.

- Sitz Chur, ${CASE.employees} Mitarbeitende, Standorte ${CASE.locations.join(', ')}.
- ${CASE.partners} aktive Vertriebspartner als Hauptkanal (B2B-Case).
- Ausgangslage: einsprachige Website, ERP, Excel und E-Mails.
- Das ERP bleibt führend für Produkte, Preise, Partnerstammdaten und Bestellungen.
- MVP in ${CASE.limits.months} Monaten mit ${CASE.mvp.join(', ')}. Der Rest wird begründet gestaffelt.
- Budget MVP: höchstens ${chf(CASE.limits.investment)} einmalig und ${chf(CASE.limits.monthly)} pro Monat, exkl. MWST.
- Kein direkter B2C-Checkout im MVP. Endkunden-Inhalte dürfen Partner unterstützen.
- Partnerakquise: ${CASE.acquisition.requests} Anfragen pro Monat, ${CASE.acquisition.qualified} qualifiziert, ${CASE.acquisition.newPartners} neue Partner nach ${CASE.acquisition.days} Tagen, erste Antwort im Median nach ${CASE.acquisition.responseDays} Arbeitstagen.
- Bestellungen: ${CASE.orders.monthly} pro Monat, ${CASE.orders.manualShare} % manuell ins ERP übertragen, je ${CASE.orders.minutes} Minuten.
- Service: ${CASE.service.monthly} Fälle pro Monat, ${CASE.service.incompleteShare} % anfangs unvollständig, Klärung im Median ${CASE.service.clarificationDays} Arbeitstage.
- Rechenbasis ${chf(CASE.orders.hourlyValue)} je interner Arbeitsstunde. Frei werdende Kapazität ist nicht automatisch eine Kostensenkung.
- Format: höchstens 20 Hauptfolien inklusive Titel, 30 Minuten Pitch mit Demo, 15 Minuten Kundengespräch.

## Abgeleitet

- 480 manuelle Übertragungen, 96 Stunden und ${chf(5760)} Kapazitätswert pro Monat, ${chf(69120)} pro Jahr.
- 70 unvollständige Servicefälle pro Monat.
- Quoten: 25 % der Anfragen qualifiziert, 20 % der qualifizierten werden Partner.
- 96 Bestellungen je Partner und Jahr im Durchschnitt (1’200 × 12 / 150).

## Von der Gruppe festgelegt

${CASE.company}, Hersteller von Cheminées und Öfen. Agentur ${CASE.agency}. Fachpartner: Ofenbauer und Studios. Plattform: ${CASE.platform}.`);

await write('docs/assumptions.md',`# Zusatzannahmen

Nichts in dieser Tabelle steht im Case. Jede Zeile ist eine Annahme der Agentur und wird im Projekt geprüft.

${table(['Annahme','Wert','Begründung','Prüfung'],[
 ['Figuren und Betriebe','Marco Bianchi, Bianchi Ofenbau Locarno; Giulia Rossi, Luca Ferrari, Sofia Keller','Ein Protagonist für alle drei Journeys','Reine Demo-Figuren'],
 ['Sortiment','Öfen und Ersatzteile; Ersatzteile und Zubehör tragen die wiederkehrenden Bestellungen','Das Raster verlangt wiederkehrende B2B-Bestellungen; 8 Bestellungen je Partner und Monat sind mit Öfen allein nicht plausibel','ERP-Auswertung nach Artikelgruppe'],
 ['Saisonalität','Spitzen bei Bestellungen und Servicefällen in der Heizsaison','Branchenlogik; in der Vorlesung als «saisonale Produkte» geführt','Monatsverlauf aus dem ERP'],
 ['Tagessatz Agentur',chf(PLAN.dayRate),'Mischsatz über alle Rollen','Offerte'],
 ['Aufwand MVP',PLAN.days+' Personentage, Reserve '+chf(10600),'Aufteilung siehe Kostenplan','Schätzung nach Discovery'],
 ['Salesforce-Edition','Pro Suite, '+chf(PLAN.userPrice)+' je Nutzer und Monat','Listenpreis EUR 100, vorsichtig 1:1 in CHF; Sales und Service in einer Edition','Offerte Salesforce; Eignung für die ERP-Schnittstelle bestätigen'],
 ['Anzahl Nutzer',PLAN.users+' ('+PLAN.userSplit.map(([a,b])=>b+' '+a).join(', ')+')','Im MVP arbeiten nur Partnerbetreuung, Service und Leitung im System','Rollenliste des Kunden'],
 ['Betrieb','CHF 400 Integration und Monitoring, CHF 1’000 Support pro Monat','Rund 0,7 Personentage Support','Betriebsvertrag'],
 ['Kundenaufwand',PLAN.clientDays+' Personentage: 10 Prozesse, 12 IT und Daten, 15 Tests und Pilot, 8 Schulung','Nicht im Projektpreis','Bestätigung durch Kundenrollen'],
 ['Pilot',PLAN.pilotEmployees+' Mitarbeitende, '+PLAN.pilotPartners+' Partner, ausserhalb der Saisonspitze','Zwei Drittel der Nutzer, alle vier Standorte','Auswahl im Monat 4'],
 ['KPI-Ziele','Antwort 1 statt 4 Arbeitstage; 6 statt 4 neue Partner; 15 statt 35 % unvollständig','Erreichbar mit Zuweisung, Vertretung und Pflichtfeldern','Festlegung im Monat 1, Vergleich mit Vorjahresmonat'],
 ['Rückfrage je unvollständigem Fall',PLAN.followUp.clarificationMinutes+' Minuten','Ein Mail und ein Telefonat','Zeitaufnahme im Pilot'],
 ['Portal-Lizenzen (Stufe 3)',chf(PLAN.followUp.portalMonthly)+' pro Monat für '+CASE.partners+' Partner','Listenpreis Experience Cloud für Partner, USD 25 je Mitglied','Offerte; Login-basiertes Modell prüfen'],
 ['Automatisierung Bestellungen','30, 60 oder 90 % der manuellen Übertragungen','Szenarien statt Punktwert','Portalnutzung im Betrieb'],
 ['KI-Pilot','100 Fälle, mindestens 90 % richtig, kein kritischer Fehler, 20 % Zeitgewinn','Messbare Schwellen für den Entscheid','Eigener Testsatz'],
])}
## Was die Demo ist

Die Demo ist ein klickbarer Prototyp des Salesforce-Zielbilds mit Beispieldaten. Sie ist nicht an ein ERP, einen Mailserver oder ein KI-Modell angebunden. Diese Abgrenzung steht einmal hier und im Dialog «Quellen & Backup», nicht in jedem Sprechtext.`);

await write('docs/platform-decision.md',`# Plattformentscheid: Salesforce

## Entscheid

PartnerConnect läuft auf Salesforce. Im MVP: Sales Cloud (Lead, Account, Contact, Verkaufschance) und Service Cloud (Case, Asset, Fristen, Eskalation) in der Pro Suite. Später: Experience Cloud für das Partnerportal und eine Marketing-Lösung für die Journey. Das ERP bleibt führend.

## Begründung

1. Eine Plattform für alle Stufen. Vertrieb, Service und später das Partnerportal greifen auf dieselben Datensätze zu. Der Partner sieht im Portal denselben Case wie der Service. Bei getrennten Werkzeugen müsste diese Verbindung gebaut und betrieben werden.
2. Die MVP-Anforderungen sind Standard. Lead-Konvertierung, Zuweisung, Vertretung, Dublettenregeln, Pflichtfelder, Eskalation und Rechte sind konfigurierbar. Das hält den Aufwand bei ${PLAN.days} Personentagen.
3. Das Budget geht auf. ${PLAN.users} Nutzer × ${chf(PLAN.userPrice)} = ${chf(PLAN.users*PLAN.userPrice)} pro Monat, mit Betrieb ${chf(PLAN.monthly)}. Es bleiben ${chf(CASE.limits.monthly-PLAN.monthly)} Luft, das sind vier weitere Nutzer.
4. Der Ausbau ist vorgezeichnet. R3, R4 und R8 sind Erweiterungen derselben Plattform und keine neuen Projekte mit neuen Schnittstellen.

## Abgewogene Alternativen

${table(['Alternative','Dafür','Dagegen','Urteil'],[
 ['Eigenentwicklung','Keine Lizenzkosten, volle Freiheit','Standardfunktionen müssten gebaut werden; 6 Monate und CHF 150’000 reichen nicht; Betrieb hängt an der Agentur','Verworfen'],
 ['Günstigeres Standard-CRM','Tiefere Lizenzkosten, schneller Start','Partnerportal und Service auf einer Plattform schwächer; Wechsel in Stufe 3 wahrscheinlich','Rückfallposition, falls die Pro Suite für die Schnittstelle nicht genügt'],
 ['Excel und E-Mail verbessern','Kein Projekt, keine Lizenzen','Zuständigkeit, Vertretung und Historie bleiben personenabhängig','Verworfen'],
 ['Höhere Salesforce-Edition','Mehr Automatisierung und Schnittstellen','EUR 175–195 je Nutzer sprengen CHF 3’000 schon bei 12 Nutzern knapp','Nur mit Budgetentscheid'],
])}
## Offene Punkte

- Genügt die Pro Suite für die ERP-Schnittstelle? Klärung im Monat 2 zusammen mit der ERP-Abklärung. Falls nein: höhere Edition für weniger Nutzer oder Budgetantrag.
- Listenpreise sind öffentliche Preise vom 13.11.2026. Verbindlich ist die Offerte.`);

await write('docs/differentiation.md',`# Was unseren Pitch von den anderen Gruppen unterscheidet

Alle Gruppen lösen denselben Case mit denselben Zahlen. Diese fünf Punkte gelten nur für Caleira.

1. **Eine Kältewoche als Klammer.** Der Pitch beginnt und endet mit demselben Moment: Marco beim Endkunden, die Scheibe ist gesprungen. Dazwischen liegt ein Jahr. Die Case-Zahlen 35 % und 6 Arbeitstage bekommen damit ein Bild.
2. **Saison als Auslöser und als Alternativursache.** Die Marketing-Journey startet acht Wochen vor der Heizsaison. Die Kennzahlen werden mit dem Vorjahresmonat verglichen, weil sonst die Saison gemessen wird und nicht die Lösung. Das beantwortet den 5-Punkte-Anker «Alternativursache».
3. **Ersatzteile erklären die 1’200 Bestellungen.** 8 Bestellungen je Partner und Monat sind mit Öfen allein nicht plausibel. Mit Scheiben, Dichtungen und Zubehör schon. Das zeigt die Bestell-Demo.
4. **Die Sprache des Partners.** Marco sitzt in Locarno, seine Betreuerin spricht Italienisch, die Rückmeldung im Servicefall auch. Die einsprachige Website wird als Beziehungsproblem behandelt.
5. **Das Portal wird mit einer Rechnung gestaffelt.** Lizenzen für 150 Partner kosten rund CHF 3’750 pro Monat und damit mehr als das ganze laufende MVP-Budget. Die Reihenfolge ist begründet und nicht nur behauptet.

Bewusst weggelassen: Aussagen über reale Hersteller, Normen oder Abnahmen durch Kaminfeger. Dazu steht nichts im Case.`);

await write('docs/theory-map.md',`# Modelle aus den Vorlesungen im Pitch

${table(['Modell (Begriff der Dozierenden)','Vorlesung','Szene','Verwendung'],[
 ['Prospect Theory, Verlustaversion','1','01, 03','Problem als Verlust: 16 von 20 Anfragen, 96 Stunden, 6 Arbeitstage'],
 ['Attention Grabber und Story Loop','1','01, 19','Kältewoche am Anfang und am Schluss'],
 ['Story Framework: Hero, Challenges, Helpers, Victory','1','01–19','Marco, verlorene Verantwortung, PartnerConnect, derselbe Moment ein Jahr später'],
 ['Why / What / How / Impact','1','02–06, 15','Gliederung des ersten Drittels'],
 ['Feature, Kanal oder Transformation','1','05','«Mehr als Digitalisierung»: Zusammenarbeit ändert sich'],
 ['Tell – Show – Tell','1','07, 09, 10','Jede Demo: drei Punkte ankündigen, zeigen, Nutzen nennen'],
 ['Business Value Map: Ziel, Objective, Capability, Metric','1','15','Herleitung der drei Kennzahlen aus dem Auftrag'],
 ['Cognitive Load, eine Core Message','1','alle','Eine Kernaussage je Szene'],
 ['Pitch Etiquette, «The Close»','1','01, 19','Zeitrahmen bestätigen; drei Bitten mit Termin'],
 ['Customer Lifecycle, Awareness bis Advocacy','2','04','Sechs Momente der Journey'],
 ['Operatives und analytisches CRM','2','06, 15','MVP ist operatives CRM; die Kennzahlen sind der analytische Teil'],
 ['Lead-to-Cash, Lead-Konvertierung «aus eins mach drei»','2','07','Lead wird zu Account, Contact und Verkaufschance'],
 ['Lead Scoring: Fit-Kriterien','3','07','Drei feste Qualifikationskriterien'],
 ['Service-Datenarchitektur: Account, Contact, Asset, Case','2','08, 10','Der eingebaute Ofen als Asset am Fall'],
 ['SLA, Milestones, Eskalation','2','10','Eskalation in der Heizsaison'],
 ['Service Recovery, Service als Treiber der Bindung','2','10','Kernsatz der Service-Demo'],
 ['Zielpyramide','3','15','Kennzahlen aus dem Unternehmensziel abgeleitet'],
 ['Enterprise CMS: multi-language, Rollen','3','12','Dreisprachige Inhalte, Pflege durch das Team'],
 ['Sonderform B2B2C','4','02, 12','Caleira erreicht die Bauherrin nur über den Partner'],
 ['B2B-Commerce: ausgehandelte Preise, Nachbestellung','4','09','Partnerpreise aus dem ERP'],
 ['Produktarten: saisonal, Never out of Stock','4','09, 11','Öfen saisonal, Ersatzteile ab Lager'],
 ['Voice, Filler Words, Nonverbal','4','Probe','Checkliste für die Generalprobe'],
])}`);

// Moderationsskript
let sec=0;const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
const blocks={};SCENES.forEach((s,i)=>(blocks[s.speaker]??=[]).push(i+1));
const script=SCENES.map((s,i)=>{const from=sec;sec+=s.seconds;const words=s.notes.split(/\s+/).length;return `## ${String(i+1).padStart(2,'0')} · ${s.title.replace('\n',' ')}

${fmt(from)}–${fmt(sec)} · ${s.seconds} Sekunden · ${s.speaker} · ${words} Wörter

**Kernaussage:** ${s.message}

${s.notes}

**Regie:** ${s.cue}

**Kriterien:** ${s.criteria.join(', ')}`}).join('\n\n');
await write('docs/presenter-script.md',`# Moderationsskript – 30 Minuten

${SCENES.length} Szenen, ${sec} Sekunden. Richtwert 130 Wörter pro Minute; in den Demo-Szenen bleibt Zeit zum Klicken.

## Sprechblöcke und Übergaben

${table(['Person','Szenen','Rolle in der Geschichte'],[
 ['Anya',blocks['Anya'].join(', '),'Rahmen: Kältewoche, Auftrag, Ausgangslage, Schlussantrag'],
 ['Sila',blocks['Sila'].join(', '),'Diagnose und Vorschlag'],
 ['Altina',blocks['Altina'].join(', '),'Journey 1: Marco wird Partner'],
 ['Vivienne',blocks['Vivienne'].join(', '),'Journey 2 und 3: Marco bestellt, Marco hat einen Schaden'],
 ['Josh',blocks['Josh'].join(', '),'Fundament: Marketing, Website, Systeme, KI'],
 ['Maik',blocks['Maik'].join(', '),'Wert, Weg und Kosten'],
])}
Jede Übergabe ist ein Satz im Sprechtext der abgebenden Person und nennt, was als Nächstes kommt. Wer nicht spricht, bedient die Demo der sprechenden Person oder hält das Demo-Backup bereit. Bei einer Störung über 60 Sekunden: Wechsel auf das PDF-Backup.

${script}`);

await write('docs/architecture.md',`# Systeme und Daten

## Führende Systeme

${table(['Daten','Führend','Salesforce','Richtung'],[
 ['Produkte, Preise','ERP','liest (ab Stufe 3 im Portal)','ERP → Salesforce'],
 ['Partnerstammdaten','ERP','liest; Änderungen als Auftrag ans ERP','ERP → Salesforce'],
 ['Bestellungen und Status','ERP','liest; schreibt ab Stufe 3 über das Portal','ERP ↔ Salesforce'],
 ['Leads, Verkaufschancen, Aktivitäten','Salesforce (Sales Cloud)','führt','Freigabe → ERP legt Partner an'],
 ['Kontakte und Einwilligungen','Salesforce','führt','–'],
 ['Cases, Assets, Fristen','Salesforce (Service Cloud)','führt','Bestellreferenz aus ERP'],
])}
## Schnittstelle

- Monat 2: Schnittstellen, Exportwege, Testmandant und Kosten des ERP klären. Erst danach wird gebaut.
- Jede Übertragung trägt Kennung, Quelle, Zeitstempel und Status. Fehler landen in einer Liste mit zuständiger Person. Verbindungsfehler werden begrenzt wiederholt, fachliche Fehler nicht.
- Für das Portal (Stufe 3): Die Kennung wird serverseitig gespeichert, eine wiederholte Übertragung erzeugt keine zweite Bestellung.

## Rechte

Vertrieb: eigene Partner und Leads, Vertretung wird ausdrücklich vergeben. Service: Cases mit Partner- und Bestellreferenz, keine Preise. Partner (ab Stufe 3): nur eigene Daten und Preise, geprüft bei jedem Zugriff. Integration: eigener technischer Nutzer mit minimalen Rechten. Administration: Änderungen werden protokolliert.

## Datenqualität

Eine verantwortliche Person beim Kunden legt Pflichtfelder fest und entscheidet über Dubletten. Regel: ERP-Partnernummer und normalisierte E-Mail-Adresse; unklare Treffer werden von Hand entschieden. Die Migration läuft zuerst als Test mit Stichprobe. Datenschutz, Aufbewahrung und Versandgrundlagen prüft der Kunde mit seiner Rechtsberatung.`);

await write('docs/risks.md',`# Drei Risiken des MVP

${table(['Risiko','Eintritt / Wirkung','Frühwarnzeichen','Massnahme','Verantwortlich'],[
 ['ERP-Schnittstelle unklar','mittel / hoch','Kein Testzugang bis Ende Monat 1','Technische Abklärung, Export als Ausweg, Entscheid im Monat 2','IT-Leitung Kunde, Integration Agentur'],
 ['Schlechte Datenqualität','hoch / hoch','Dubletten und fehlende Referenzen über der vereinbarten Schwelle','Datenprüfung, Bereinigung vor Migration, Entscheid von Hand','Datenverantwortliche Person Vertrieb'],
 ['Tiefe Akzeptanz','mittel / mittel','Persönliche Excel-Listen bleiben in Gebrauch','Mitgestaltung, Key User, Schulung, Sprechstunde im Pilot','Prozessverantwortliche Vertrieb und Service'],
])}
Schwellen werden im Monat 1 gemeinsam festgelegt. Kritische Fehler bei Schnittstelle, Rechten oder Daten verhindern den Rollout. Wird ein Pilotziel verfehlt: Ursache klären, nachbessern, erneut messen; über Umfang und Termin entscheidet der Sponsor.

Zusätzlich beobachtet: Die Pro Suite genügt nicht für die Schnittstelle (siehe docs/platform-decision.md).`);

await write('docs/operating-model.md',`# Zusammenarbeit, Einführung und Betrieb

## Rollen

${table(['Rolle','Aufgabe'],[
 ['Sponsor, Geschäftsleitung','Budget, Konflikte, Abnahme'],
 ['Prozessverantwortliche Vertrieb und Service','Anforderungen, Pilotziele, Freigabe der Tore 1, 3 und 4'],
 ['IT und datenverantwortliche Person','Schnittstelle, Rechte, Datenqualität, Freigabe Tor 2'],
 ['Key User','Tests, Schulung der Kolleginnen und Kollegen'],
 [CASE.agency,'Projektleitung, Konfiguration, Integration, Tests, Dokumentation, Betrieb nach Übergabe'],
])}
## Kundenaufwand

${PLAN.clientDays} Personentage zusätzlich zum Projektpreis: 10 für Prozesse und Entscheide, 12 für IT und Daten, 15 für Tests und Pilot, 8 für Schulung und Übergabe.

## Rhythmus

Wöchentliche Abstimmung, alle zwei Wochen eine Vorführung, monatlich der Lenkungsausschuss mit Freigabe des Tors.

## Einführung

Pilot im Monat 5 mit ${PLAN.pilotEmployees} Mitarbeitenden und ${PLAN.pilotPartners} Partnern aus allen vier Standorten. Schulung nach Rolle, Kurzanleitungen in Deutsch, Italienisch und Französisch, Sprechstunde während des Pilots. Die 90-Tage-Kennzahl für neue Partner läuft über den Rollout hinaus und wird nicht vorzeitig gemeldet.

## Betrieb nach Projektende

Der Kunde besitzt die Daten und vergibt die Rechte. Die Agentur übernimmt Support und Überwachung der Schnittstelle im Rahmen von CHF 1’400 pro Monat. Reaktionszeiten, Sicherung und Änderungsprozess werden im Betriebsvertrag festgelegt.`);

// Top-10 der Geschäftsleitung, danach weitere Fragen. Spalte 3: wer antwortet.
const qa=[
 ['Warum Salesforce und nicht etwas Günstigeres?','Weil Vertrieb, Service und später das Portal auf derselben Plattform laufen. Marco sieht im Portal denselben Fall wie Ihr Service. Mit zwölf Nutzern in der Pro Suite bleiben wir bei 2’600 Franken pro Monat. Ein günstigeres CRM wäre möglich, hätte aber spätestens beim Portal einen Wechsel zur Folge. Die Abwägung steht im Anhang.','Sila'],
 ['Reichen zwölf Lizenzen für 70 Mitarbeitende?','Im MVP arbeiten nur Partnerbetreuung, Service und Leitung im System: sechs im Vertrieb, vier im Service, die Vertriebsleitung und eine Administration. Produktion, Logistik und Finanzen bleiben im ERP. Vier weitere Nutzer hätten im Budget Platz. Die Rollenliste bestätigen wir im ersten Monat mit Ihnen.','Maik'],
 ['Der grösste Nutzen liegt bei den Bestellungen. Warum ist das Portal nicht im MVP?','Aus zwei Gründen. Das Portal schreibt ins ERP, und diese Schnittstelle ist noch nicht geprüft. Und die Lizenzen für 150 Partner kosten rund 3’750 Franken pro Monat, mehr als das ganze laufende MVP-Budget. Das MVP schafft die Grundlage und der Portal-Entscheid kommt mit einer eigenen Rechnung.','Maik'],
 ['Was bringt uns das MVP in Franken?','Vorsichtig gerechnet rund 800 Franken Kapazität pro Monat im Service und acht zusätzliche Partner pro Jahr. Der Wert der Partner hängt von Ihrem Umsatz je Partner ab, den wir nicht kennen. Wir behaupten keinen ROI. Wir legen drei Kennzahlen fest und messen sie gegen den Vorjahresmonat.','Maik'],
 ['Sparen wir damit Personal?','Nein, nicht automatisch. 96 Stunden sind frei werdende Kapazität. Ob Sie diese für die Partnerbetreuung einsetzen oder Stellen nicht nachbesetzen, entscheiden Sie. Im Rechner stellen Sie den kostenwirksamen Anteil selbst ein.','Maik'],
 ['Was, wenn unser ERP keine brauchbare Schnittstelle hat?','Das ist das wichtigste Risiko und darum das Tor im zweiten Monat. Gibt es keine Schnittstelle, arbeiten wir mit einem täglichen Export. Die Partnerübersicht ist dann einen Tag alt, aber vollständig. Reicht auch das nicht, stoppen wir vor dem Bau und Sie haben bis dahin rund ein Viertel des Budgets eingesetzt.','Josh'],
 ['Wie belastbar sind die 145’000 Franken?','Es sind 96 Personentage zu 1’400 Franken und 10’600 Franken Reserve. Den Aufwand bestätigen wir nach der Discovery im ersten Monat. Die grösste Unsicherheit ist die Integration mit 24 Tagen. Reicht die Reserve nicht, entscheidet der Lenkungsausschuss über Umfang oder Termin, nicht wir.','Maik'],
 ['Was müssen unsere Leute leisten?','45 Personentage über sechs Monate, vor allem für Tests und Pilot. Dazu drei benannte Personen: Sponsor, je eine prozessverantwortliche Person für Vertrieb und Service. Ohne diese Zeit wird das Projekt nicht fertig, das sagen wir lieber heute.','Maik'],
 ['Was, wenn die Mitarbeitenden bei Excel bleiben?','Dann haben wir nichts gewonnen. Darum bauen Key User aus allen vier Standorten mit, der Pilot läuft ausserhalb der Saisonspitze, und wir beobachten ein Zeichen: Werden die persönlichen Listen noch geführt? Wenn ja, klären wir, was im System fehlt, bevor wir ausrollen.','Altina'],
 ['Warum keine KI? Alle reden davon.','Weil eine Regel den Glasbruch heute schon richtig zuordnet. KI lohnt sich bei den Antwortentwürfen, braucht aber Ihre Falldaten, die erst mit dem MVP entstehen. Wir schlagen einen Test mit 100 Fällen und drei Schwellen vor. Besteht die KI ihn nicht, bleiben die Regeln.','Josh'],
 ['Warum bauen Sie das CRM nicht selbst?','Partnerübersicht, Lead-Prozess, Fälle und Rechte sind Standardfunktionen. Sie würden uns dafür bezahlen, sie nachzubauen, und wären danach von uns abhängig. Mit 96 Personentagen ist das nicht zu schaffen.','Sila'],
 ['Verlieren wir Partner, wenn Endkunden auf der Website landen?','Nein. Die Website führt Endkunden zum Fachpartner in ihrer Nähe und verkauft nichts direkt. Im MVP gibt es keinen Checkout für Endkunden.','Josh'],
 ['Ist die Marketing-Mail zulässig?','Versendet wird nur an Kontakte mit dokumentierter Einwilligung, jede Mail hat eine Abmeldung. Die rechtliche Grundlage prüfen Sie mit Ihrer Rechtsberatung, bevor Stufe 2 startet.','Josh'],
 ['Wie schützen Sie die Partnerpreise?','Preise bleiben im ERP. Im Portal sieht ein Partner nur seine eigenen, und das wird bei jedem Zugriff auf dem Server geprüft.','Josh'],
 ['Was ist an der Demo echt?','Die Abläufe und Regeln sind so, wie wir sie in Salesforce konfigurieren würden. Die Daten sind Beispiele, und die Demo ist nicht an Ihr ERP angebunden.','Vivienne'],
 ['Was genau entscheiden wir heute?','Drei Dinge: die Freigabe des MVP mit 145’000 Franken und 2’600 Franken pro Monat, die Benennung von Sponsor und zwei prozessverantwortlichen Personen, und den Zugang zu Ihrem ERP-Verantwortlichen bis Ende Januar.','Anya'],
];
await write('docs/qa-preparation.md',`# Kundengespräch – 15 Minuten

Ablauf: Frage in einem Satz zusammenfassen, direkt antworten, begründen, Wissenslücke benennen und eine Klärung mit Termin vereinbaren. Jede Person kann angesprochen werden; die genannte Person antwortet zuerst, die anderen ergänzen nur, wenn etwas fehlt. Die letzten drei Minuten gehören der Frage: Wer macht was bis wann?

## Die zehn kritischsten Fragen der Geschäftsleitung

${qa.slice(0,10).map(([q,a,p],i)=>`### ${i+1}. ${q}\n\n${a}\n\nAntwortet: ${p}`).join('\n\n')}

## Weitere Fragen

${qa.slice(10).map(([q,a,p])=>`### ${q}\n\n${a}\n\nAntwortet: ${p}`).join('\n\n')}`);

await write('docs/ai-disclosure.md',`# Offenlegung der KI-Nutzung

Die erste Fassung der Präsentation (Struktur, Code, 3D-Geometrien, Texte) wurde mit Codex erstellt. Der Abgleich mit Case, Bewertungsraster und Vorlesungen, die Überarbeitung der Story, das Kostenmodell und die Docs wurden mit Claude Code erstellt. Das Team ${CASE.agency} hat die Inhalte geprüft und verantwortet sie.

Figuren, Betriebe und Vorgänge sind erfunden. Es wurden keine echten Kundendaten verarbeitet und keine Nachrichten versendet. Die KI-Antwort in Szene 14 ist ein vorbereiteter Text und kein Modellaufruf.`);

await fs.writeFile('output/content.json',JSON.stringify({scenes:SCENES,case:CASE,plan:PLAN,criteria},null,2));
console.log('Docs erzeugt. Szenen:',SCENES.length,'Sekunden:',sec);
