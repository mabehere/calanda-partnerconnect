# Caleira PartnerConnect – Pitch der Agentur Super Trooper

Interaktive Präsentation für den FHGR-Pitch «Digital Relationship Management» vom 10.12.2026: 19 Szenen, 3D-Journey, drei Live-Demos, Nutzenrechner, Presenter Mode, PDF-Backup und Film.

Kunde: Caleira AG, Hersteller von Cheminées und Öfen. Vorschlag: PartnerConnect auf Salesforce (Sales Cloud und Service Cloud im MVP), das ERP bleibt führend.

## Start

Voraussetzung: Node.js 24 LTS.

```bash
npm install
npm run dev
```

Danach http://127.0.0.1:5173 in Chrome öffnen. Die Installation braucht Internet, die Präsentation nicht.

```bash
npm run build
npm test
npm run test:e2e
```

`test:e2e` läuft standardmässig in Chrome. Weitere Browser: `PW_CHANNELS=chrome,msedge npm run test:e2e`.

## Bedienung

- Pfeil rechts oder Leertaste: weiter. Pfeil links: zurück. `/#scene-7` öffnet direkt eine Szene.
- Notizsymbol: Sprechtext, Timer und Kriterien. Das separate Presenter-Fenster läuft synchron.
- «Zurücksetzen» stellt in jeder Demo den Anfang wieder her.
- «Quellen & Backup»: Downloads und Quellenangaben.

## Abgabe

- `public/downloads/caleira-pitch.pdf`: 19 Hauptfolien.
- `public/downloads/caleira-demo-backup.pdf`: lesbares Demo-Backup mit den drei Journeys.
- `public/downloads/nachweise.md`: Matrix R1–R8 mit Folien- und Demo-Verweisen, Quellen.
- `public/media/caleira-customer-journey.mp4`: Film, 72 Sekunden.

## Docs

Alle Dateien in `docs/` ausser `qa-report.md` werden von `scripts/documentation.mjs` erzeugt. Inhalte dort ändern, nicht in den Markdown-Dateien.

| Datei | Inhalt |
|---|---|
| `case-facts.md` | Fakten aus dem Case, abgeglichen |
| `rubric-coverage.md` | 20 Kriterien mit Original-Ankern, Szene und Nachweis |
| `requirements-matrix.md` | R1–R8, Stufe, Abhängigkeiten |
| `assumptions.md` | Alle Zusatzannahmen |
| `platform-decision.md` | Warum Salesforce, abgewogene Alternativen |
| `differentiation.md` | Was diesen Pitch von den anderen Gruppen unterscheidet |
| `theory-map.md` | Modelle aus den Vorlesungen und ihre Verwendung |
| `presenter-script.md` | Sprechtext, Zeiten, sechs Sprechblöcke, Übergaben |
| `qa-preparation.md` | Top-10-Fragen der Geschäftsleitung mit Antworten |
| `architecture.md`, `risks.md`, `operating-model.md` | Systeme, Risiken, Zusammenarbeit |
| `ai-disclosure.md` | Offenlegung der KI-Nutzung |
| `qa-report.md` | Testergebnisse und offene Punkte |

## Medien neu erzeugen

```bash
node scripts/documentation.mjs
npm run dev            # in einem zweiten Terminal laufen lassen
node scripts/screenshots.mjs
node scripts/backups.mjs
npm run export         # braucht Python mit reportlab, pypdf, pillow
npm run video:render
```

`CALEIRA_PYTHON` zeigt bei Bedarf auf ein Python mit den drei Paketen. `PW_CHANNEL` wählt den Browser für die Screenshot-Skripte (Standard: chrome).

## Vor dem Pitch

- Zuteilung der Sprechblöcke prüfen (`speaker` in `src/content/scenes.ts`), nach Änderungen `node scripts/documentation.mjs`.
- Salesforce-Offerte einholen oder Listenpreise bestätigen (`docs/platform-decision.md`).
- Generalprobe mit Stoppuhr und dem Beamer im Raum.

Der lokale Ordner und das GitHub-Repository tragen noch den alten Projektnamen. Umbenennen kann nur die Person mit Adminrechten auf GitHub.
