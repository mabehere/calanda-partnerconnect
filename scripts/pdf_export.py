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
fonts=Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('Body',str(fonts/'segoeui.ttf')))
pdfmetrics.registerFont(TTFont('Bold',str(fonts/'segoeuib.ttf')))
BG=HexColor('#151b16');FG=HexColor('#efeee2');MUTED=HexColor('#b6c0aa');COPPER=HexColor('#cfac7d');LINE=HexColor('#3e4936')

def text(c,value,x,y,w,size=14,color=FG,leading=None,bold=False):
    style=ParagraphStyle('body',fontName='Bold' if bold else 'Body',fontSize=size,leading=leading or size*1.45,textColor=color)
    p=Paragraph(value.replace('\n','<br/>'),style);_,h=p.wrap(w,1000);p.drawOn(c,x,y-h);return y-h

def page(c,title,index,total=19,label='CALANDA / PARTNERCONNECT',size=(960,540)):
    w,h=size;c.setFillColor(BG);c.rect(0,0,w,h,fill=1,stroke=0)
    text(c,label,42,h-26,w-84,9,COPPER);c.setStrokeColor(LINE);c.line(42,h-48,w-42,h-48)
    text(c,title,42,h-67,w-84,30,FG,34)
    c.line(42,39,w-42,39);text(c,'FELSGRAD · Fiktiver Pitch · Case gemäss Nutzerauftrag · Originalprüfung offen',42,28,w-130,8,MUTED)
    text(c,f'{index:02} / {total:02}',w-88,28,50,9,COPPER)

bullets=[
 ['Marco hat vier Kaminöfen bestellt.','Die Bestellung existiert im ERP.','Aber wer kennt den aktuellen Status?','30 Minuten Pitch inklusive Live-Demo. Danach 15 Minuten Kundengespräch.'],
 ['70 Mitarbeitende; Sitz in Chur.','Vier Standorte: Chur, Locarno, Hamburg, Paris.','150 aktive Vertriebspartner.','Ausschliesslich B2B. Endkunden finden Fachpartner; kein direkter Checkout im MVP.'],
 ['Akquise: 80 Anfragen/Monat, 20 qualifiziert, 4 neue Partner nach 90 Tagen. Antwortmedian: 4 Arbeitstage.','Bestellung: 1’200/Monat, 40% manuell, 12 Min. je Übertragung.','Service: 200 Fälle/Monat, 35% unvollständig. Klärungsmedian: 6 Arbeitstage.'],
 ['Entdecken → qualifizieren → bestellen → liefern → Service → Abschluss.','Live: Kamera, Kapitel, Pause, Explore, Vorher/Nachher.','Lokaler Film: 72 Sekunden, 1080p.','R4-Bestellportal ist spätere Zielentwicklung.'],
 ['ERP kennt den Auftrag. Excel und E-Mail verteilen den Kontext.','Verantwortung, Vertretung und nächste Aufgabe werden sichtbar.','Technik und Arbeitsregeln gemeinsam verändern.'],
 ['MVP in sechs Monaten: R1 Partner, R2 Lead, R5 Service, R7 Integration.','ERP bleibt führend für Produkte, Preise, Partnerstammdaten und Bestellungen.','R3 Marketing, R4 Portal, R6 Content und R8 KI folgen gestaffelt.'],
 ['Ofenbau Nord, Hamburg: Anfrage → Dublettenprüfung → Qualifikation.','Standort, Verantwortliche und nächste Aufgabe zuordnen; Stellvertretung zeigen.','Verkaufschance → Freigabe → simulierte ERP-Partnernummer.','Alle Figuren und Vorgänge sind fiktiv.'],
 ['Marco Bianchi, Locarno, ERP-Referenz CH-0042.','Partnerprofil, Aufträge, Service und Historie gemeinsam sichtbar.','Stammdaten bleiben im ERP. Rollen und Vertretung werden explizit vergeben.'],
 ['Lokaler Händlerlogin, Partnerpreise, Produktdetails und vier Öfen im Warenkorb.','Übertragung mit eindeutiger Transaktionskennung.','Fehler simulieren, mit identischer Kennung wiederholen, Doppelauftrag verhindern.','R4 gehört nicht zum MVP.'],
 ['Beschädigte Glasscheibe zu Partner und Auftrag zuordnen.','Foto fehlt → Rückfrage → Testfoto ergänzen.','Zuweisung → Bearbeitung → Eskalation.','Lösung → simulierte Nachricht → Abschluss. Historie bleibt erhalten.'],
 ['Segment: aktive Partner seit 90 Tagen ohne Bestellung.','ERP: Status und Bestelldatum; CRM: Kontakt und Berechtigung.','Berechtigung prüfen; neue Bestellung und Abmeldung stoppen die Journey.','Personalisierte Mailvorschau; kein echter Versand.'],
 ['B2B: Informationen, Sortiment, Dokumentation, Bewerbung, Login, Account Manager.','B2C: Inspiration → Modell → regionaler Fachpartner. Kein Checkout.','Lokale CMS-Ansicht ändert die sichtbare Headline.','Website-Ausbau nach dem MVP.'],
 ['ERP führt Stammdaten und Bestellungen; CRM führt Beziehung und Service.','Integration validiert, protokolliert und behandelt Fehler.','Produktiv: serverseitige Rechte und Idempotenz, Data Owner und Fehlerliste.','Vorhandene ERP-Schnittstellen in M1/M2 abklären. Keine API vorausgesetzt.'],
 ['MVP: regelbasierte Klassifikation.','Späterer KI-Pilot: 100 getrennte, de-identifizierte Testfälle (Annahme).','Ziele: ≥90% richtig, keine kritischen Fehler, ≥20% Zeitgewinn inkl. Review.','Immer manuelle Freigabe. Bei Nichterreichen auf KI verzichten.'],
 ['Antwortmedian: 4 → 1 Arbeitstag.','Neue Partner nach 90 Tagen: 4 → 6.','Unvollständige Tickets: 35% → 15%.','Ziele sind Annahmen. Feste Kohorten, Zeitstempel, Rollen und Vergleichsbedingungen. CRM ist nicht alleinige Ursache.'],
 ['1’200 × 40% = 480 manuelle Übertragungen.','480 × 12 / 60 = 96 Stunden pro Monat.','96 × CHF 60 = CHF 5’760/Monat, CHF 69’120/Jahr theoretischer Kapazitätswert.','Keine automatische Kosteneinsparung. Portalzusatzkosten unbekannt; kein belegter ROI.'],
 ['M1 Prozesse & Daten; M2 Integrationsnachweis.','M3 Partner & Lead; M4 Service & Tests.','M5 Pilot; M6 Rollout, Schulung und Übergabe.','Kritische Fehler blockieren Rollout. Ziele verfehlt: nachbessern und neu messen.'],
 ['Planung: CHF 145’000 einmalig, CHF 2’600/Monat, exkl. MWST.','Budgetgrenzen: CHF 150’000 / CHF 3’000. Keine Anbieterangebote.','45 interne Personentage zusätzlich (Annahme).','Risiken: ERP-Schnittstellen, Datenqualität, Nutzerakzeptanz.'],
 ['MVP R1/R2/R5/R7 für sechs Monate freigeben.','Sponsor und Process Owner benennen.','ERP-Abklärung, Pilot und überprüfbare Abnahme vereinbaren.','Vier Standorte. 150 Partner. Eine verlässliche Beziehung.'],
]
pitch=OUT/'calanda-pitch.pdf';c=canvas.Canvas(str(pitch),pagesize=(960,540));c.setTitle('Calanda - From Fire to Flow - 19 Szenen')
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
 ('Demo-Backup: Was dieses Dokument belegt','scene-06-1920.png',['Drei lokale B2B-Prozesse mit fiktiven Daten. Kein echter ERP-Zugriff, kein externer Login, keine echten Nachrichten.','MVP: R1, R2, R5, R7. Später: R3, R4, R6, R8. Der Portalnutzen wird dem MVP nicht zugerechnet.','Originalquellen fehlen. Exakte Leistungsanker sind offen; die Nachweise beziehen sich auf die Anforderungen im Nutzerauftrag.']),
 ('A / Partner gewinnen: Eingang und Qualifikation','lead-start.png',['1. Partneranfrage von Ofenbau Nord absenden. Lead entsteht lokal.','2. Anfrage erneut senden: normalisierte E-Mail erkennt Dublette.','3. Fachbetrieb, Region und Sortimentsinteresse prüfen.']),
 ('A / Partner gewinnen: Verantwortung und Freigabe','lead-end.png',['4. Hamburg und Lena Weber zuordnen; Aufgabe für nächsten Arbeitstag.','5. Abwesenheit an Jonas Frei übergeben. Verkaufschance anlegen.','6. Vertriebsfreigabe dokumentieren und simulierte ERP-Nummer DE-0151 zuordnen. Historie enthält die Übergänge.']),
 ('B / B2B-Bestellung: Fehler kontrollieren','order-error.png',['1. Als Marco lokal anmelden, Partnerkatalog und Produktdetail öffnen.','2. Vier Öfen bestellen; Menge editierbar. Preise sind fiktive ERP-Testdaten.','3. Schnittstellenfehler erzeugen. Transaktionskennung und Warenkorb bleiben zur Wiederholung erhalten. R4 ist später.']),
 ('B / B2B-Bestellung: einmalig bestätigen','order-end.png',['4. Fehler abschalten und mit derselben Kennung erneut übertragen.','5. Erneute Bestätigung erzeugt keinen Doppelauftrag. Versand und Lieferung simulieren.','Produktiv erforderlich: serverseitige, dauerhafte und atomare Idempotenz. Die lokale Simulation ist kein Beleg einer vorhandenen ERP-API.']),
 ('C / Service: Vollständigkeit herstellen','service-missing.png',['1. Glasschaden mit Partner CH-0042 und Auftrag CH-1042 erfassen.','2. Fehlendes Foto erkennen; Rückfrage lokal erzeugen.','3. Fiktives Testfoto ergänzen. Ohne vollständige Angaben startet keine technische Bearbeitung.']),
 ('C / Service: lösen und abschliessen','service-end.png',['4. Sofia Keller zuweisen; Bearbeitung starten; an Serviceleitung eskalieren.','5. Ersatzlösung dokumentieren und Partnerbenachrichtigung simulieren.','6. Erst danach abschliessen. Ticket-Historie enthält Zuweisung, Eskalation, Lösung und Abschluss.']),
 ('Systemlandschaft und Datenhoheit','scene-13-1920.png',['ERP: Produkte, Preise, Partnerstammdaten, Bestellungen. CRM: Leads, Chancen, Aktivitäten, Verantwortliche und Service.','Integrationsschicht: validieren, referenzieren, synchronisieren, protokollieren. ERP-Fähigkeiten in Monat 2 prüfen.','Rollen: Vertrieb, Service, Partner, Integration, Administration. Partnerpreise serverseitig schützen. Data Owner entscheidet über Dubletten.']),
 ('KPI-Rechnung und Sensitivität','business-100.png',['480 manuelle Übertragungen × 12 Minuten / 60 = 96 Stunden. × CHF 60 = CHF 5’760/Monat bzw. CHF 69’120/Jahr.','Bei 30/60/90% Automatisierung: 28,8/57,6/86,4 h freigesetzt. Entspricht CHF 1’728/3’456/5’184 Kapazitätswert pro Monat.','Kostenwirksame Realisierung standardmässig 0%. Portalzusatzkosten unbekannt. Keine ROI-Zusage. MVP-KPIs: Antwortzeit, neue Partner, vollständige Tickets.']),
 ('MVP, Kosten und Entscheidungstore','scene-17-1920.png',['M1 Discovery, M2 Datenmodell & ERP-Nachweis, M3 Partner/Lead, M4 Service/Integration, M5 Pilot, M6 Schulung/Rollout/Übergabe.','CHF 145’000 einmalig (inkl. CHF 11’000 Reserve); CHF 2’600/Monat. Schätzungen, exkl. MWST. 45 interne Personentage separat.','Sponsor genehmigt. Kritische Fehler stoppen Rollout. Verfehlte Pilotziele führen zu Ursachenanalyse und Wiederholungsmessung.']),
 ('Risiken: früh erkennen und handeln','risks.png',['ERP-Schnittstelle: mittel/hoch. Testzugang fehlt Ende M1 → technischer Spike und Go/No-Go M2. Verantwortung IT.','Datenqualität: hoch/hoch. Dubletten/Referenzfehler → Profiling, Bereinigung und Data Owner.','Akzeptanz: mittel/mittel. Rückkehr zu Excel → Co-Design, Key User, Alltagstests und Schulungen. Verantwortung Process Owner.']),
 ('R1–R8: nachvollziehbare Nachweise',None,['R1: Partnerprofil und Historie, Szene 8. R2: Anfrage bis ERP-Freigabe, Szene 7.','R3: 90-Tage-Segment, Berechtigung, Mail und Stopps, Szene 11. R4: Bestellung mit Retry, Szene 9.','R5: Servicefall bis Abschluss, Szene 10. R6: zwei Website-Pfade und Content-Änderung, Szene 12.','R7: führende Daten, Rechte und Fehlerbehandlung, Szene 13. R8: Regeln/KI, manuelle Prüfung, Pilot und Verzichtsoption, Szene 14.']),
 ('Quellen, Annahmen und KI-Offenlegung',None,['Quelle der Case-Werte: Nutzerauftrag „MASTER PROMPT – CALANDA INTERACTIVE CONSULTING EXPERIENCE“.','Nicht vorhanden: FHGR - Pitch Case.pdf und FHGR - Bewertungsraster Pitch 2026.xlsx. Originalanker und Originalkonformität sind offen.','Modelle: Unternehmen, Figuren, Produkte, Preise, KPI-Ziele, Kosten, Szenarien und Pilotgrössen. Keine Anbieterangebote.','KI unterstützt Struktur, Text, Code, Geometrien und Dokumenterzeugung. Menschliche fachliche Freigabe und Generalprobe stehen aus.','Technische Quellen: vite.dev/guide/ · r3f.docs.pmnd.rs · remotion.dev/docs · Vercel Web Interface Guidelines. Alle Medien zur Präsentation lokal.']),
]
backup=OUT/'calanda-demo-backup.pdf';c=canvas.Canvas(str(backup),pagesize=(960,540));c.setTitle('Calanda - lesbares Demo-Backup')
for i,(title,image,items) in enumerate(backup_pages):
    page(c,title,i+1,len(backup_pages),'CALANDA / DEMO-BACKUP')
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
