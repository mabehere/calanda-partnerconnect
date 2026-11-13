from pathlib import Path
import json, shutil
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw

ROOT=Path(__file__).resolve().parent.parent
DATA=json.loads((ROOT/'output/content.json').read_text(encoding='utf-8'))
OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
def _font(*candidates):
    for c in candidates:
        if Path(c).exists(): return c
    raise SystemExit('Keine passende Schrift gefunden: '+', '.join(candidates))
pdfmetrics.registerFont(TTFont('Body',_font('C:/Windows/Fonts/segoeui.ttf','/System/Library/Fonts/Supplemental/Arial.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('Bold',_font('C:/Windows/Fonts/segoeuib.ttf','/System/Library/Fonts/Supplemental/Arial Bold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')))
BG=HexColor('#151b16');FG=HexColor('#efeee2');MUTED=HexColor('#b6c0aa');COPPER=HexColor('#cfac7d');LINE=HexColor('#3e4936')

def text(c,value,x,y,w,size=14,color=FG,leading=None,bold=False):
    style=ParagraphStyle('body',fontName='Bold' if bold else 'Body',fontSize=size,leading=leading or size*1.45,textColor=color)
    p=Paragraph(value.replace('\n','<br/>'),style);_,h=p.wrap(w,1000);p.drawOn(c,x,y-h);return y-h

def page(c,title,index,total=19,label='CALEIRA / PARTNERCONNECT',size=(960,540)):
    w,h=size;c.setFillColor(BG);c.rect(0,0,w,h,fill=1,stroke=0)
    text(c,label,42,h-26,w-84,9,COPPER);c.setStrokeColor(LINE);c.line(42,h-48,w-42,h-48)
    text(c,title,42,h-67,w-84,30,FG,34)
    c.line(42,39,w-42,39);text(c,'SUPER TROOPER · Pitch Caleira · Case: FHGR Pitch-Case 2026 · Zusatzannahmen im Anhang',42,28,w-130,8,MUTED)
    text(c,f'{index:02} / {total:02}',w-88,28,50,9,COPPER)

bullets=[
 ['Erste Kältewoche. Marco steht beim Endkunden, die Scheibe ist gesprungen.','Bei Caleira weiss niemand Bescheid. Sechs Arbeitstage bis zur Klärung.','Für die Kundin ist Marco Caleira.','30 Minuten Pitch mit Demo, danach 15 Minuten Gespräch.'],
 ['70 Mitarbeitende, Sitz in Chur. Standorte Chur, Locarno, Hamburg, Paris.','150 aktive Fachpartner als Hauptkanal.','B2B2C: Caleira erreicht den Endkunden über den Partner. Kein Direktverkauf im MVP.','Zielkonflikt: wachsen und verlässlicher werden, mit denselben Leuten.'],
 ['Akquise: 80 Anfragen, 20 qualifiziert, 4 neue Partner. Erste Antwort nach 4 Arbeitstagen.','Bestellungen: 1’200 pro Monat, 40 % von Hand, 12 Minuten. 96 Stunden pro Monat.','Service: 200 Fälle, 35 % unvollständig, 6 Arbeitstage bis zur Klärung.','Offen: Liegt es am Werkzeug oder an der Saison? Das misst der Pilot.'],
 ['Entdecken, anfragen, bestellen, liefern, Schaden, Lösung.','Drei Momente live: Partner gewinnen, Bestellung, Servicefall.','Film als Reserve: 72 Sekunden.'],
 ['Die Bestellung steht im ERP, das Mail im Postfach, die Liste in Excel.','Jedes System stimmt. Dazwischen geht die Verantwortung verloren.','Es braucht eine gemeinsame Sicht und klare Übergaben.'],
 ['Salesforce: Sales Cloud und Service Cloud im MVP.','Das ERP bleibt führend für Produkte, Preise, Partnerstammdaten, Bestellungen.','MVP in sechs Monaten: R1 Partner, R2 Lead, R5 Service, R7 Systeme.','Danach: R6 Website, R3 Marketing, R4 Portal, R8 KI.'],
 ['Rolle: Marco als Interessent, Giulia Rossi in Locarno.','Anfrage, Dublette, drei Kriterien, Zuweisung, Aufgabe.','Ausnahme: Giulia fehlt, die Stellvertretung übernimmt.','Lead wird zu Partnerkonto, Kontakt und Verkaufschance. Nutzen: ein Arbeitstag statt vier.'],
 ['Marco Bianchi, Locarno, ERP-Nummer CH-0042.','Bestellungen, Servicefälle und eingebauter Ofen in einer Sicht.','Stammdaten aus dem ERP, nur gelesen.','Dubletten: ERP-Nummer und E-Mail, unklare Treffer von Hand.'],
 ['Rolle: Marco im Partnerportal (Stufe 3).','Login, eigene Preise aus dem ERP, Öfen und Ersatzteile, Warenkorb.','Ausnahme: Verbindung fällt aus. Gleiche Kennung, keine doppelte Bestellung.','Nutzen: 480 Bestellungen pro Monat müssen nicht mehr abgetippt werden.'],
 ['Rolle: Marco meldet den Schaden, Sofia Keller im Service.','Fall mit Bezug zu Partner, Bestellung und Ofen.','Ausnahme: Foto fehlt. Sofortige Rückfrage statt Hin und Her.','Eskalation in der Heizsaison, Nachricht auf Italienisch, dann Abschluss.'],
 ['Segment: aktive Partner, 90 Tage ohne Bestellung.','Auslöser: acht Wochen vor der Heizsaison.','Daten: Bestelldatum aus dem ERP, Einwilligung aus Salesforce.','Stopp bei Bestellung oder Abmeldung. Erfolg gegen Kontrollgruppe.'],
 ['Endkunden: Inspiration, Modell, Fachpartner in der Nähe. Kein Checkout.','Partner: Sortiment, Unterlagen, Bewerbung.','Inhalte pflegt das Team selbst.','Dreisprachig: Deutsch, Italienisch, Französisch.'],
 ['Jede Information hat ein führendes System.','Integrationsschicht mit Kennung, Zeitstempel, Status und Fehlerliste.','Rechte folgen der Aufgabe.','ERP-Schnittstellen werden im Monat 2 geprüft, bevor gebaut wird.'],
 ['Start mit Regeln: Glasbruch geht an den Service.','KI-Test nach dem MVP mit 100 anonymisierten Fällen.','Schwellen: 90 % richtig, kein kritischer Fehler, 20 % Zeitgewinn.','Ein Mensch gibt jede Antwort frei. Sonst bleiben die Regeln.'],
 ['Erste Antwort: 4 → 1 Arbeitstag.','Neue Partner nach 90 Tagen: 4 → 6.','Unvollständige Servicefälle: 35 → 15 %.','Ziele sind Annahmen. Vergleich mit dem Vorjahresmonat.'],
 ['MVP: 40 Fälle weniger × 20 Min. = 13 h, rund CHF 800 pro Monat (Annahme).','MVP: 8 Partner mehr pro Jahr × 96 Bestellungen = rund 770 Bestellungen.','Portal: 1’200 × 40 % × 12 Min. = 96 h = CHF 5’760 pro Monat.','Kapazität ist keine Einsparung.'],
 ['M1 Prozesse und Kennzahlen. M2 ERP-Schnittstelle getestet.','M3 Partner und Lead. M4 Service.','M5 Pilot mit 8 Mitarbeitenden und 10 Partnern. M6 Übergabe.','Portal später: Schreib-Schnittstelle und CHF 3’750 Lizenzen pro Monat.'],
 ['CHF 145’000 einmalig: 96 Personentage × CHF 1’400, Reserve CHF 10’600.','CHF 2’600 pro Monat: 12 Lizenzen × CHF 100, Integration 400, Support 1’000.','Kundenaufwand: 45 Personentage.','Risiken: ERP-Schnittstelle, Datenqualität, Akzeptanz.'],
 ['Dieselbe Kältewoche, ein Jahr später: Rückmeldung am selben Tag.','MVP freigeben: 6 Monate, CHF 145’000, CHF 2’600 pro Monat.','Sponsor und zwei prozessverantwortliche Personen benennen.','Zugang zum ERP-Verantwortlichen bis Ende Januar.'],
]
pitch=OUT/'caleira-pitch.pdf';c=canvas.Canvas(str(pitch),pagesize=(960,540));c.setTitle('Caleira PartnerConnect - Pitch Super Trooper')
for i,s in enumerate(DATA['scenes']):
    title=s['title'].replace('\n',' ');page(c,title,i+1)
    text(c,s['message'],42,395,870,16,COPPER)
    y=350
    for item in bullets[i]:
        c.setFillColor(COPPER);c.circle(46,y-8,2,fill=1,stroke=0)
        y=text(c,item,59,y,340,13.5,MUTED,19)-15
    image=ROOT/f'output/screenshots/scene-{i+1:02}-1920.png'
    if image.exists():c.drawImage(str(image),430,90,width=480,height=270,preserveAspectRatio=True,mask='auto')
    text(c,f"Zeitbudget: {s['seconds']//60}:{s['seconds']%60:02} Minuten · Kriterien: {', '.join(s['criteria'])}",430,78,485,9,COPPER)
    text(c,'Nachweis: '+s['proof'],430,60,485,8,MUTED)
    c.showPage()
c.save()

backup_pages=[
 ('Demo-Backup: Was dieses Dokument belegt','scene-06-1920.png',['Drei lokale B2B-Prozesse mit fiktiven Daten. Kein echter ERP-Zugriff, kein externer Login, keine echten Nachrichten.','MVP: R1, R2, R5, R7. Später: R3, R4, R6, R8. Der Portalnutzen wird dem MVP nicht zugerechnet.','Die Demo ist ein klickbarer Prototyp des Salesforce-Zielbilds mit Beispieldaten, ohne Anbindung an ERP, Mailserver oder KI-Modell.']),
 ('A / Partner gewinnen: Eingang und Qualifikation','lead-start.png',['1. Marcos Partneranfrage absenden. In Salesforce entsteht ein Lead.','2. Anfrage erneut senden: normalisierte E-Mail erkennt Dublette.','3. Drei Fit-Kriterien prüfen: Fachbetrieb, Region, Sortimentsinteresse.']),
 ('A / Partner gewinnen: Verantwortung und Freigabe','lead-end.png',['4. Locarno und Giulia Rossi zuordnen; Aufgabe für nächsten Arbeitstag.','5. Abwesenheit an Luca Ferrari übergeben. Verkaufschance anlegen.','6. Vertriebsfreigabe dokumentieren und simulierte ERP-Nummer CH-0042 zuordnen. Historie enthält die Übergänge.']),
 ('B / B2B-Bestellung: Fehler kontrollieren','order-error.png',['1. Als Marco lokal anmelden, Partnerkatalog und Produktdetail öffnen.','2. Vier Öfen bestellen; Menge editierbar. Öfen und Ersatzteile; Preise sind Beispieldaten.','3. Schnittstellenfehler erzeugen. Transaktionskennung und Warenkorb bleiben zur Wiederholung erhalten. R4 ist später.']),
 ('B / B2B-Bestellung: einmalig bestätigen','order-end.png',['4. Fehler abschalten und mit derselben Kennung erneut übertragen.','5. Erneute Bestätigung erzeugt keinen Doppelauftrag. Versand und Lieferung simulieren.','Produktiv erforderlich: serverseitige, dauerhafte und atomare Idempotenz. Die lokale Simulation ist kein Beleg einer vorhandenen ERP-API.']),
 ('C / Service: Vollständigkeit herstellen','service-missing.png',['1. Glasschaden mit Partner CH-0042 und Auftrag CH-1042 erfassen.','2. Fehlendes Foto erkennen; Rückfrage lokal erzeugen.','3. Testfoto ergänzen. Ohne vollständige Angaben startet keine technische Bearbeitung.']),
 ('C / Service: lösen und abschliessen','service-end.png',['4. Sofia Keller zuweisen; Bearbeitung starten; an Serviceleitung eskalieren.','5. Ersatzlösung dokumentieren und Partnerbenachrichtigung simulieren.','6. Erst danach abschliessen. Ticket-Historie enthält Zuweisung, Eskalation, Lösung und Abschluss.']),
 ('Systemlandschaft und Datenhoheit','scene-13-1920.png',['ERP: Produkte, Preise, Partnerstammdaten, Bestellungen. Salesforce: Leads, Verkaufschancen, Aktivitäten, Verantwortliche und Cases.','Integrationsschicht: validieren, referenzieren, synchronisieren, protokollieren. ERP-Fähigkeiten in Monat 2 prüfen.','Rollen: Vertrieb, Service, Partner, Integration, Administration. Partnerpreise serverseitig schützen. Data Owner entscheidet über Dubletten.']),
 ('KPI-Rechnung und Sensitivität','business-100.png',['480 manuelle Übertragungen × 12 Minuten / 60 = 96 Stunden. × CHF 60 = CHF 5’760/Monat bzw. CHF 69’120/Jahr.','Bei 30/60/90% Automatisierung: 28,8/57,6/86,4 h freigesetzt. Entspricht CHF 1’728/3’456/5’184 Kapazitätswert pro Monat.','Kostenwirksame Realisierung standardmässig 0%. Portalzusatzkosten unbekannt. Keine ROI-Zusage. MVP-KPIs: Antwortzeit, neue Partner, vollständige Tickets.']),
 ('MVP, Kosten und Entscheidungstore','scene-17-1920.png',['M1 Discovery, M2 Datenmodell & ERP-Nachweis, M3 Partner/Lead, M4 Service/Integration, M5 Pilot, M6 Schulung/Rollout/Übergabe.','CHF 145’000 einmalig (inkl. CHF 11’000 Reserve); CHF 2’600/Monat. Schätzungen, exkl. MWST. 45 interne Personentage separat.','Sponsor genehmigt. Kritische Fehler stoppen Rollout. Verfehlte Pilotziele führen zu Ursachenanalyse und Wiederholungsmessung.']),
 ('Risiken: früh erkennen und handeln','risks.png',['ERP-Schnittstelle: mittel/hoch. Testzugang fehlt Ende M1 → technischer Spike und Go/No-Go M2. Verantwortung IT.','Datenqualität: hoch/hoch. Dubletten/Referenzfehler → Profiling, Bereinigung und Data Owner.','Akzeptanz: mittel/mittel. Rückkehr zu Excel → Co-Design, Key User, Alltagstests und Schulungen. Verantwortung Process Owner.']),
 ('R1–R8: nachvollziehbare Nachweise',None,['R1: Partnerprofil und Historie, Szene 8. R2: Anfrage bis ERP-Freigabe, Szene 7.','R3: 90-Tage-Segment, Berechtigung, Mail und Stopps, Szene 11. R4: Bestellung mit Retry, Szene 9.','R5: Servicefall bis Abschluss, Szene 10. R6: zwei Website-Pfade und Content-Änderung, Szene 12.','R7: führende Daten, Rechte und Fehlerbehandlung, Szene 13. R8: Regeln/KI, manuelle Prüfung, Pilot und Verzichtsoption, Szene 14.']),
 ('Quellen, Annahmen und KI-Offenlegung',None,['Case-Fakten: FHGR Pitch-Case 2026 und Bewertungsraster Pitch 2026, vollständig abgeglichen.','Plattform: Salesforce. Listenpreise von öffentlichen Preisseiten, Stand 13.11.2026. Verbindlich ist die Offerte.','Zusatzannahmen: Figuren, Sortiment, Saisonalität, Tagessatz, Personentage, Nutzerzahl, KPI-Ziele, Rückfragezeit, Pilotgrösse. Vollständig in docs/assumptions.md.','KI-Nutzung: erste Fassung mit Codex, Abgleich und Überarbeitung mit Claude Code. Geprüft und verantwortet vom Team Super Trooper.','Technische Quellen: vite.dev/guide/ · r3f.docs.pmnd.rs · remotion.dev/docs. Alle Medien liegen lokal.']),
]
backup=OUT/'caleira-demo-backup.pdf';c=canvas.Canvas(str(backup),pagesize=(960,540));c.setTitle('Caleira - lesbares Demo-Backup')
for i,(title,image,items) in enumerate(backup_pages):
    page(c,title,i+1,len(backup_pages),'CALEIRA / DEMO-BACKUP')
    if image:
        path=(ROOT/'output/backup'/image) if not image.startswith('scene-') else (ROOT/'output/screenshots'/image)
        if path.exists():c.drawImage(str(path),400,100,width=518,height=291.4,preserveAspectRatio=True,mask='auto')
    y=388
    for item in items:
        c.setFillColor(COPPER);c.circle(46,y-8,2,fill=1,stroke=0)
        y=text(c,item,60,y,310 if image else 820,13.5 if image else 17,MUTED,19 if image else 25)-20
    c.showPage()
c.save()
for path in [pitch,backup]:
    shutil.copy2(path,ROOT/'public/downloads'/path.name)
    r=PdfReader(path);print(path.name,len(r.pages),'pages',path.stat().st_size,'bytes')
    assert all(len(p.extract_text())>100 for p in r.pages)
shots=sorted((ROOT/'output/screenshots').glob('*1920.png'))
sheet=Image.new('RGB',(1200,((len(shots)+3)//4)*190),'#101a12');draw=ImageDraw.Draw(sheet)
for i,p in enumerate(shots):
    im=Image.open(p);im.thumbnail((292,165));x=(i%4)*300;y=(i//4)*190;sheet.paste(im,(x,y));draw.text((x+5,y+168),p.stem,fill='#cfac7d')
sheet.save(OUT/'screenshots-contact-sheet.jpg')
print('PDF export complete')
