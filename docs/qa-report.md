# Qualitätsprüfung – 13. November 2026

Geprüft auf macOS (Apple Silicon), Node 24.22, Google Chrome.

## Bestanden

- Build (`npm run build`): ohne Fehler.
- Unit-Tests (`npm test`): 11 von 11. Neu: MVP-Wirkung (40 Fälle, 13,3 h, CHF 800, 8 Partner, 96 Bestellungen je Partner) und Kostenherleitung (96 PT × CHF 1’400 + Reserve = CHF 145’000; 12 × CHF 100 = CHF 1’200).
- Browser-Tests (`npm run test:e2e`): 7 von 7 in Chrome. Alle drei Journeys, Nutzenrechner, Editor, Marketing-Stopp, KI-Freigabe, Risiken, Film, Downloads, Presenter-Fenster.
- 38 Screenshots (1920 × 1080 und 1366 × 768), keine Browserfehler, keine horizontale Überbreite.
- PDF-Präsentation 19 Seiten, Demo-Backup 13 Seiten. Kein Text ausserhalb der Seiten. Alle Seiten gerendert; Seite 18 von Hand angesehen.
- Suche nach dem alten Firmennamen (auch mit Tippfehler) und dem alten Agenturnamen in allen Dateien ausser `.git` und `node_modules`: keine Treffer.

## Bekannte Einschränkungen

- Szene 10 ist bei 1920 × 1080 in der Verlaufsansicht leicht höher als der Inhaltsbereich und scrollt intern. Das bestand schon vorher.
- Microsoft Edge wurde nicht getestet, weil es auf dem Prüfrechner nicht installiert ist.
- Die Screenshots der Szenen 7 bis 10 und 16 bis 18 wurden nach dem Umbau stichprobenweise angesehen (8 und 16), nicht alle 38.
- Salesforce-Preise sind Listenpreise von öffentlichen Seiten und nicht durch eine Offerte bestätigt. Ob die Pro Suite für die ERP-Schnittstelle genügt, ist offen.
- Sprechzeiten sind berechnet, nicht gestoppt. Eine Generalprobe mit sechs Personen steht aus.
- Die Demo ist ein Prototyp ohne Anbindung an ERP, Mailserver oder KI-Modell.

## Wiederholen

`npm run build`, `npm test`, `npm run test:e2e`. Medien: siehe README.
