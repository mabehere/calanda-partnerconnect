# Content Freeze · Abschlussprüfung

Vergleichsbasis ist Commit `bf2a7f56fc6a6b4f02aea4e2248c31f27603aad6`, gesichert in `output/creative-baseline/source.zip`. Die Umsetzung liegt auf `codex/creative-excellence`. Es wurden keine fachlichen Korrekturen vorgenommen.

## Automatisierter Vergleich

`node scripts/verify-content-freeze.mjs` besteht mit **51/51 Prüfungen**. Der maschinenlesbare Nachweis steht in `output/content-freeze-check.json`.

- Sämtliche ursprünglichen Dateien in `src/data/`, `src/content/`, `src/lib/` und `docs/` stimmen mit der Baseline überein.
- `scripts/documentation.mjs`, die bestehenden fachlichen Browsertests, `public/downloads/nachweise.md` und `output/content.json` sind unverändert.
- Die vollständigen Komponenten Demos, Details, BusinessCase und Partner sind unverändert. Gleiches gilt für `package.json` und Lockfile.
- Journey-Kapitel, Beschreibungen, sämtliche MOMENTS, MOOD-Kurvenwerte und PHASES stimmen exakt überein.
- Alle sechs Remotion-Sequences einschliesslich Namen, Texten, Untertiteln und Zeitdefinitionen sind unverändert. Der Film hat weiterhin 2160 Frames bei 30 fps, also 72 Sekunden.
- Der gerenderte Haupttext jeder der 19 Szenen entspricht der Baseline. Dieser DOM-Vergleich deckt die aufgenommenen Standardansichten ab; andere Zustände werden zusätzlich durch unveränderte Quelldateien und die fachlichen Tests abgesichert.

Bei Quelltext-Hashes wird ausschliesslich LF/CRLF normalisiert. Beim DOM-Text werden Leerraum und Zeilenumbrüche normalisiert. Zahlen, Wörter, Satzzeichen und Reihenfolge werden nicht angepasst.

## Verhalten und Exporte

Die bestehenden elf Unit-Tests bestehen. Die sieben bestehenden Browserfälle bestehen unverändert in Chrome und Edge; sechs ergänzende technische Fälle pro Browser ergeben zusammen 26 erfolgreiche Browser-Tests. Sie prüfen unter anderem die Demo-Abläufe, Fehlerzustände, Rechner, Navigation und Presenter sowie die neue Journey-Steuerung. Die fachlichen Tests wurden weder abgeschwächt noch umgeschrieben.

`scripts/creative-pdf-check.py` vergleicht die extrahierten Texte jeder PDF-Seite mit den ursprünglichen PDFs im Baseline-Archiv. Ergebnis: **19/19 Pitch-Seiten und 13/13 Backup-Seiten inhaltlich gleich**, mit normalisiertem Leerraum wegen veränderter Zeilenumbrüche. Nachweis: `output/creative-pdf-check.json`. Bilder und Seitengestaltung wurden aktualisiert; die PDFs sind deshalb erwartungsgemäss nicht binär identisch.

Sprecherzuteilungen, Sprechtexte, Zeitbudgets, Szenenreihenfolge, Produktinformationen, Preise, Budgetpositionen, Berechnungsannahmen und Formeln bleiben durch die unveränderten fachlichen Quellen erhalten. Vorhandene Nachweise und Quellen wurden nicht ersetzt.

## Technische Änderungen an der Präsentation

Keine der ausdrücklich geschützten Quelldateien benötigte eine Ausnahme. Die neuen fünf Creative-Dokumente ergänzen die ursprüngliche Dokumentation. Der vorhandene Generator überschreibt diese neuen Dateien nicht.

`App.tsx` erhielt Animationsintegration, eine Eingabeabgrenzung für Journey-Steuerelemente und verlässlicheres Broadcasting bei direkten Szenenlinks beziehungsweise Timer-Reset. `Journey.tsx`, `ThreeWorld.tsx`, CSS und der visuelle Teil der Filmkomposition wurden überarbeitet. Neue Replay-, Qualitäts- und Vollbildfunktionen verändern keine fachlichen Abläufe. Die Welt bleibt ausdrücklich illustrativ; ihre Architektur ist kein behaupteter Standortgrundriss.

Die Prüfung belegt den Content Freeze mit Quelldateivergleichen, gerenderten Texten, PDF-Texten und den ausgeführten Tests. Sie ist keine Behauptung, jede denkbare Eingabekombination formal bewiesen zu haben.
