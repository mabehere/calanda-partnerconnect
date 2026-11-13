# Qualitätsprüfung – 13. November 2026

## Bestätigt

- TypeScript und Vite-Produktionsbuild erfolgreich.
- 9 Unit-Tests bestanden: Ausgangsrechnung, Null-/Grenzwerte, Kapazität vs. Einsparung, 19 Szenen/1’800 Sekunden, Budgets, Dubletten, idempotente Übertragung und Abschlussregeln.
- 14 Playwright-Tests bestanden: je 7 in installiertem Microsoft Edge und Google Chrome.
- Vollständige Akquise-, Bestell- und Service-Journey durchgespielt. Fehler/Retry erzeugt keinen zweiten Demo-Auftrag.
- Business-Case-Eingaben, Reset, CMS-Änderung, Marketing-Stopp, KI-Review, Risikodetails und 3D-Kapitel geprüft.
- Tastatur nach Buttonklick, Escape, separates Presenter-Fenster und Szenensynchronisation geprüft.
- Alle 19 Szenen aufgerufen; keine JavaScript-Seitenfehler und keine horizontale Überbreite.
- 38 Screenshots bei 1920 × 1080 und 1366 × 768 erzeugt. Nach Layoutkorrektur passen die Ausgangsansichten bei 1366 × 768 in den Inhaltsbereich; umfangreiche Verlauf-/Detailansichten bleiben scrollbar. Szene 10 bei 1080p besitzt geringfügige interne Überhöhe; Status und Schaltflächen sind sichtbar.
- Lokale MP4 in beiden Browsern geladen und abgespielt: 1920 × 1080, 72 Sekunden, H.264. Drei Filmstellen visuell geprüft.
- Externe Browseranfragen im Medien-/Presenter-Test blockiert; Video und lokale Downloads funktionieren weiter.
- PDF-Präsentation: 19 Seiten, 960 × 540 pt (16:9). Demo-Backup: 13 Seiten. Alle 32 Seiten gerendert, Text extrahiert und Seitengrenzen geprüft; kein Text ausserhalb der Seiten. Kontaktübersichten und ausgewählte Vollseiten visuell geprüft. Eine überlagerte Unterzeile im ersten PDF-Entwurf wurde korrigiert.

## Grenzen und offene Abnahme

- Die FHGR-Original-PDF und Original-XLSX fehlen. Vollständige Faktenverifikation, sämtliche Tabellenblätter und exakte 5-Punkte-Leistungsanker können nicht geprüft werden.
- Keine tatsächliche Teampräsentation oder Jurybewertung. Geplante Zeitbudgets summieren sich auf 30 Minuten; reale Vortragszeit erfordert Generalprobe.
- Keine echte CRM-/ERP-Anbindung, Authentifizierung oder E-Mail-Zustellung. Tests bestätigen lokale Simulationen, keine produktive Sicherheit oder ERP-Kompatibilität.
- Die 3D-Welt ist eine bewusst stilisierte Eigenkonstruktion mit einfachen Figuren und Geometrien. Keine fotorealistische Gebäudeaufnahme; keine externen Modelle oder Sounds. Der Film verwendet deterministische Kamerafahrten und bewegte Elemente derselben Miniaturwelt.
- UI-Content-Pflege und Marketinglogik sind lokale Demonstratoren. Redaktionelle Mehrbenutzerfreigaben und reale Kampagnenzustellung gehören nicht zu diesem Artefakt.
- Keine reale Offline-Erstinstallation getestet; npm-Abhängigkeiten und Render-Browser müssen zunächst heruntergeladen werden. Die Präsentation selbst ist danach lokal nutzbar.
- Kein physischer Projektortest. Schriftgrösse und Kontrast sind in der Generalprobe mit dem tatsächlichen Beamer zu prüfen.

## Reproduzierbar

`npm run build`, `npm test`, `npm run test:e2e`.

Screenshots: `node scripts/screenshots.mjs`. Durchgespielte Backup-Zustände: `node scripts/backups.mjs`. Medienprüfung: `node scripts/media-qa.mjs`. Dokumente: `node scripts/documentation.mjs`, danach `npm run export`.

Vitest ist auf `src/**/*.test.ts` begrenzt; Playwright auf `tests/`. Dadurch werden Browsertests nicht versehentlich vom Unit-Test-Runner geladen.
