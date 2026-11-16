# Creative Baseline · 16.11.2026

Ausgangscommit: `bf2a7f56fc6a6b4f02aea4e2248c31f27603aad6`. Sauberer Arbeitsstand auf `upgrade/cinematic-experience`; Umsetzung auf `codex/creative-excellence`. Unverändertes Quellarchiv unter `output/creative-baseline/source.zip`. Keine Rücksetzung, kein Remote-Overwrite.

Chrome/Windows, lokale Vite-Anwendung, 1920×1080 und 1366×768. Alle 19 Hauptszenen, sechs Journey-Momente in beiden Zuständen, Übersicht/Explore und 13 Filmframes aufgenommen. Belege: `output/creative-baseline/`. Bestehende Tests: Build erfolgreich, 11 Unit-Tests und 7 Chrome-Browsertests erfolgreich. Keine Browserfehler, keine horizontale Überbreite. Szene 10 benötigt bei 1920×1080 bereits vertikales Scrollen. Erste Sandbox-Testversuche erreichten localhost nicht; erneuter Lauf mit erreichbarem Server bestand.

Bewertung 1–10 ist eine interne gestalterische Einschätzung. Motion-Werte beruhen auf bestehender Animationsarchitektur und den geprüften Interaktionen, nicht auf einer gemessenen Bildrate. Keine Bewertung eines realen Projektors.

| Szene | Visual | Motion | Wirkung | Interaktion | Lesbarkeit | Konkrete Beobachtung |
|---|---:|---:|---:|---:|---:|---|
| 01 Hook | 7 | 5 | 7 | 7 | 7 | Gute Manrope/Bodoni-Kombination; Ofen wirkt kantig, Flammen sind sichtbare Kegel. |
| 02 Netzwerk | 6 | 4 | 6 | 7 | 6 | Luftige Karte; Zahlen gut, Erläuterungen deutlich zu klein. |
| 03 Ausgangslage | 7 | 4 | 7 | 7 | 6 | Starke Zahlensäulen, aber kleinteilige Tabellen. |
| 04 Journey | 5 | 3 | 5 | 6 | 6 | Raumblöcke ohne Fenster/Details; starre Figuren; austauschbare Gesamtansichten. Gute Moment-Karte. |
| 05 Reibung | 5 | 5 | 6 | 7 | 6 | Gedrehte Karten visualisieren Unordnung, dominieren aber den Inhalt. |
| 06 Vision | 7 | 4 | 7 | 7 | 6 | Grosses Wortzeichen funktioniert; spätere Stufen sehr dunkel. |
| 07 Lead | 5 | 4 | 5 | 8 | 5 | Korrekte Zustände; kleine Eingaben in grosser leerer Fläche. |
| 08 Partner | 6 | 4 | 6 | 8 | 5 | Klare Profil-/Historienstruktur, viele kleine Zeilen. |
| 09 Bestellung | 5 | 4 | 5 | 8 | 5 | Login sehr klein inszeniert; Produkte im Katalog wenig materiell. |
| 10 Service | 5 | 4 | 6 | 8 | 5 | Prozess verständlich; kompakte Schrift und überlaufende Fläche. |
| 11 Marketing | 7 | 4 | 7 | 8 | 6 | Helle Mail ist sinnvoller Kontrast; linke Fakten klein. |
| 12 Website | 7 | 4 | 6 | 8 | 6 | Helle Vorschau gut; Fläche wirkt schmal. |
| 13 Architektur | 6 | 4 | 6 | 8 | 6 | Verständliche Systemhierarchie, wenig räumliche Staffelung. |
| 14 KI | 6 | 4 | 6 | 8 | 5 | Ruhige Analyse, dichte Tabelle und kleine Hinweise. |
| 15 KPIs | 7 | 4 | 7 | 7 | 6 | Zahlen gut vergleichbar; Definitionen klein. |
| 16 Rechner | 6 | 4 | 6 | 8 | 6 | Funktionierende Eingaben; Ergebnisse könnten stärker führen. |
| 17 Roadmap | 6 | 4 | 6 | 8 | 5 | Zeitachse funktional; Freigabetor braucht klarere Hierarchie. |
| 18 Budget | 6 | 4 | 7 | 8 | 6 | Summen präsent; Positionen und Einschränkungen klein. |
| 19 Entscheidung | 7 | 4 | 7 | 7 | 6 | Typografischer Abschluss gut, schwache Anbindung an das Produkt. |

## Priorisierte Umsetzung

1. Zusammenhängende Architektur, glaubwürdige Öfen, Arbeitsplätze, Logistik und gegliederte Figuren statt abstrakter Plattformen.
2. Gemeinsame lokale Kapitelzeit für Kamera, Personen, Fahrzeug und Fortschritt; deterministischer Film mit denselben Modellen.
3. Grössere Journey-Bühne, lesbare Moment-Karte, stets sichtbarer Illustrativ-Hinweis und vollwertige Mediensteuerung.
4. Erhaltene dunkle Markenwelt mit präziseren Stein-/Kupferkontrasten, besserer Schriftgrösse und individuellen Szenen-Reveals.
5. Interaktions-/Content-Regression, Chrome/Edge, Filmrender, Medienprüfung und neue Exporte.

## Bereits bestehende technische Befunde

- Journey aktualisiert die gesamte React-Welt ca. 24-mal/s; Kapitelwechsel läuft separat über setInterval. Kamera läuft auch bei Pause weiter. Kein reproduzierbarer Replay.
- `scripts/media-qa.mjs` überschreibt alle Filmstills mit demselben Dateinamen `frame-.png`.
- Kleine Breiten blenden den Illustrativ-Hinweis der Kurve aus und setzen textbasierte Toolbar-Buttons auf Schriftgrösse 0.
- Kein fachlicher Fehler wird im Rahmen dieses Auftrags korrigiert.
