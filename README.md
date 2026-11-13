# CALANDA — From Fire to Flow

Lokale interaktive Consulting-Präsentation in Schweizer Hochdeutsch: 19 Szenen, 3D-Journey, drei CRM-Prozesse, Business-Case-Rechner, Presenter Mode und lokale Backups.

## Start unter Windows

Voraussetzung: Node.js 24 LTS oder eine von den installierten Paketen unterstützte neuere LTS-Version. Die bereitgestellte Installation wurde hier mit Node 25.9 ausgeführt; Vitest empfiehlt Node 22.12/24/26+. Keine externen Zugangsdaten nötig.

```powershell
npm install
npm run dev
```

Danach http://127.0.0.1:5173 in Chrome oder Edge öffnen. Die erste Installation benötigt Internet. Zur Präsentation selbst werden keine externen Dienste geladen. Fonts, 3D-Geometrien, Demo-Bild, MP4 und PDFs liegen lokal. Nicht `index.html` direkt über `file://` öffnen; Vite stellt die Dateien bereit.

```powershell
npm run build
npm run preview
npm test
npm run test:e2e
```

`test:e2e` verwendet die installierten Windows-Browser Edge und Chrome. `package-lock.json` fixiert die tatsächlich installierten Versionen. `npm ci` reproduziert diese Installation.

## Bedienung

- Pfeil rechts / Leertaste: weiter; Pfeil links: zurück. Formulare, Buttons und Video behalten ihre eigene Tastaturbedienung.
- Kapitelübersicht und Fortschrittsleiste springen direkt zu Szenen. URL `/#scene-7` öffnet die Akquise-Demo.
- Notizsymbol: Sprechernotizen, Gesamttimer, Zeitbudget, Kriterien und nächster Schritt. Separates Presenter-Fenster synchronisiert Szene und Timer über BroadcastChannel.
- Vollbildsymbol: Präsentationsmodus. „Motion aus“ reduziert Bewegung; Systempräferenz wird beim Start berücksichtigt.
- Demos: „Zurücksetzen“ stellt den jeweiligen Anfangszustand her. Prozessdaten bleiben lokal im Browser gespeichert, keine echten Nachrichten oder ERP-Zugriffe.
- Szene 4: Kapitel, Pause, Explore, Kameraperspektive, Vorher/Nachher und lokaler Film.
- Szene 16: MVP und spätere Portalwirtschaftlichkeit sind getrennt. Erst ein expliziter Realisierungsanteil erzeugt modellierte Kosteneinsparungen.
- „Quellen & Backup“ enthält Downloads. Auf kleineren Fenstern sind umfangreiche Detailansichten intern scrollbar.

## Abgabe

- `public/downloads/calanda-pitch.pdf`: 19 statische Hauptszenen, 16:9.
- `public/downloads/calanda-demo-backup.pdf`: Prozesse, Screenshots, Architektur, Rechnung, Risiken und R1–R8.
- `public/media/calada-customer-journey.mp4`: 72 Sekunden, 1920 × 1080, H.264, ohne Ton.
- `docs/presenter-script.md`: 30-Minuten-Ablauf inkl. Demo-Regie und Übergaben.
- `docs/qa-preparation.md`: Kundengespräch und kritische Fragen.
- `docs/rubric-coverage.md`: alle 20 Kriterien aus dem Auftrag, Nachweise und offene Originalanker.
- `docs/case-facts.md`, `docs/assumptions.md`, `docs/requirements-matrix.md`, `docs/ai-disclosure.md`.
- `docs/qa-report.md`: tatsächliche Testresultate und Grenzen.

## Offener Quellenabgleich

Die Dateien `docs/FHGR - Pitch Case.pdf` und `docs/FHGR - Bewertungsraster Pitch 2026.xlsx` wurden nicht bereitgestellt. Alle Case-Werte sind daher aus dem Master-Prompt übernommen. Exakte 5-Punkte-Leistungsanker wurden **nicht erfunden**. Die vollständige FHGR-Originalkonformität kann noch nicht bestätigt werden.

## Inhalt und Abgrenzung

MVP: R1/R2/R5/R7 in sechs Monaten. R3/R4/R6/R8 folgen gestaffelt. Planbudget CHF 145’000 einmalig und CHF 2’600/Monat, exkl. MWST, ausdrücklich Schätzungen. ERP bleibt führend für Produkte, Preise, Partnerstammdaten und Bestellungen. Kein B2C-Checkout.

CRM, Login, ERP, Versand und KI sind lokale Simulationen mit fiktiven Daten. Kein produktives System, keine reale Authentifizierung oder serverseitige Sicherheitsgarantie. Die Miniaturwelt verwendet eigene stilisierte Geometrien. Für den Film werden deterministische Frames derselben Welt gerendert; die Kameras sind filmisch vorgegeben.

## Medien neu erzeugen

```powershell
npm run video:studio
npm run video:render
node scripts/documentation.mjs
node scripts/screenshots.mjs
npm run export
```

Der Videoexport nutzt Remotions mitgelieferten Render-Browser; dessen erster Download benötigt Internet. PDF-Export benötigt Python mit `reportlab`, `pypdf` und Pillow. `scripts/export.mjs` sucht zuerst den in dieser Umgebung bereitgestellten Python-Runtime-Pfad, danach `python`. `pdftoppm` wird nur für die zusätzliche Sichtkontrolle gebraucht.

## Technische Quellen

- [Vite-Dokumentation](https://vite.dev/guide/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Remotion](https://www.remotion.dev/docs/)
- [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)

Code und Dokumente wurden mit KI-Unterstützung erstellt; siehe `docs/ai-disclosure.md`. Keine Zuordnung zu einem realen Calanda-Unternehmen oder zu realen Produktangeboten.
