# Interactive Storyworld V5 · Übergabe A–C

Aktueller Betriebsstand nach Phase E: [Interactive Storyworld V5](interactive-storyworld-v5.md). Dieses Dokument archiviert die Übergabe des früheren Teilablaufs.

Der lokale Branch `codex/interactive-storyworld-v5` enthält einen spielbaren Vier-Schritte-Ausschnitt in Szene 4. Der vorherige V4-Branch hält den separat gesicherten Quellstand `53e0339`. Die Medien des Piloten liegen weiterhin im lokalen Ordner `output/caleira-v4-pilot/`. Die Freigabeseite dort enthält den Pilot mit Ton und den Fahrzeugtest. Die Produktion verwendet weiterhin den vorhandenen vollständigen Film.

## Vorführen

Mit `npm run dev -- --port 5195` starten und `http://127.0.0.1:5195/#scene-4` öffnen. Beim ersten Besuch erscheint der Showroom. Pfeile, Page Down/Page Up und die sichtbaren Pfeiltasten steuern dieselbe Schrittfolge. Weitere Klicks während einer Bewegung ersetzen den laufenden Übergang. Zurück stellt die vorherige Endpose unmittelbar her. Am letzten Schritt führt Weiter in die nächste Hauptszene. Über Ansicht kann man die Journey auch ausdrücklich verlassen.

| Schritt | Bildhandlung | Ergebnis für die Erzählung |
|---|---|---|
| I · Entdecken | Marco richtet sich auf den Ofen aus. Das Schild am Terminal zeigt den einsprachigen Zugang. | Marco liest in einer Fremdsprache. |
| I · Partner gewinnen | Ein Umschlag bewegt sich vom Partner in Richtung Arbeitsplatz und bleibt dazwischen stehen. | Die persönliche Antwort steht aus. |
| II · Entdecken | Derselbe Showroom und dasselbe Terminal zeigen DE, IT und FR. | Dreisprachiger Einstieg für Ofenbauer, ausdrücklich nach dem MVP. |
| II · Partner gewinnen | Die Nachricht erreicht den Arbeitsplatz. Der Empfang wird am Bildschirm bestätigt. | Zuständigkeit und Vertretung sind geklärt, R2 im MVP. |

Sila verfügt laut Szenendefinition über 90 Sekunden für Szene 4. Für eine Probe des Ausschnitts genügen etwa 20–30 Sekunden inklusive Erklärungen. Für den späteren Gesamtpfad sind zwölf Besuche zu etwa sechs Sekunden plus zwei Übersichtsmomente zu je etwa sechs Sekunden und sechs Sekunden Übergabereserve vorgesehen. Dies ist ein Ablaufvorschlag innerhalb der vorhandenen 90 Sekunden.

IST/SOLL wechselt die Perspektive am selben Ort. Replay wiederholt den angezeigten Zustand. Die Pausentaste hält Kamera und Handlung gemeinsam an. Unter Ansicht stehen Explore, Film, Vollbild, Qualität und Ausstieg. Explore zeigt beide Miniaturen, erlaubt Orbit und Zoom sowie Stationswahl per Modell oder HTML-Taste. „Zur Präsentation“ holt den geführten Schritt zurück. Beim Neuladen oder erneuten Besuch im selben Tab wird der geführte Endzustand wiederhergestellt. Der volle Film startet manuell. Die vier weiteren Stationsschaltflächen öffnen bereits jetzt die unveränderten fachlichen Karten einschliesslich ihrer Live-Demos. Sie sind noch keine V5-3D-Stationen.

## Architektur

- `src/storyworld/engine.ts` enthält das geordnete Manifest, die Funktionen für Zustandswechsel und den Speichervertrag. `cursor` ist der geführte Fortschritt, `view` der gerade dargestellte Schritt. `generation` startet eine neue Choreografie auch beim Replay. Vergleich, Film und Explore ändern den Cursor nicht.
- `StoryJourney.tsx` besitzt den Reducer und eine einzige GSAP-Uhr für den aktiven Schritt. Anfahrt dauert ungefähr eine Sekunde, Handlung und Ergebnis zusammen etwa 3,4 Sekunden. GSAP setzt die Zeit in einer Ref. Nur Phasenwechsel gelangen in React. Nach dem Ende wartet die Szene. Reduced Motion springt direkt zur Endpose.
- `Stage.tsx` sampelt Kamera, Figurenpose, Nachrichtenweg und Empfangsbestätigung aus dieser Uhr. Der R3F-Canvas rendert bedarfsgesteuert. Orbit-Steuerung oder Änderungen der Uhr fordern ein Bild an. Eco begrenzt die Pixeldichte und deaktiviert Schatten. Vier kleine lokale WebPs in `public/assets/storyworld-v5/` zeigen die wesentlichen Zustände bei fehlendem WebGL. Navigation, Ergebniskarte und Kurve laufen ausserhalb des Canvas weiter.
- Figuren, Ofen, Licht, Palette, Tischmasse, Gesten und Hüllkurven stammen unmittelbar aus den schon Remotion-unabhängigen Modulen unter `video/v4/`. Film und Browser referenzieren dieselben Modelle. V5 lädt für diese beiden Räume keine alten Figuren-GLBs. Die Renderer-Einstiege bleiben getrennt.
- `App.tsx` vermittelt Clicker und Footer an die Projektion. Über den vorhandenen BroadcastChannel erhält das Presenter-Fenster Zustandsmeldungen und kann Navigation anfordern. Beim Öffnen fordert es den aktuellen Zustand an. Es zeigt Akt, Station, Handlung, Phase, nächsten Schritt, Restschritte, bisherige Notizen und Timer. Die Projektion besitzt die Animationsuhr.
- `Journey.tsx` stellt die ursprüngliche Moment-Karte und ihre vorhandenen Daten für V5 bereit. Die Kurven verwenden die ursprünglichen Werte, Interpolation und Phasen. In der geführten Ansicht wachsen sie mit dem Cursor. Im Explore-Modus ist der vollständige fachliche Verlauf verfügbar.

## Design und Erweiterung

Kupfer bleibt Marcos Erkennungsfarbe. Cremefarbene und salbeigrüne Räume haben niedrige offene Seitenwände. Die dunkle Schrift der Ergebniskarte liegt auf einer hellen Fläche am Bühnenrand. Räumliche Schilder und Nachrichten gehören zur 3D-Szene. Bei neuen Räumen Hauptobjekt, Gesicht, Blickrichtung und Bodenkontakt im tatsächlichen Browserbild prüfen. Maximal eine aktive Handlung pro Kamerafokus.

Nach ausdrücklichem Auftrag für Phase D zuerst Stationsdefinitionen mit stabilen IDs und Weltpositionen für sechs Räume ergänzen. Die Zwei-Raum-Anordnung, Office-Verzweigung und Typgrenze 0/1 in Engine und Stage sind die derzeitigen Erweiterungspunkte. Die zwei bestehenden Renderpfade dann in eine Stationsregistrierung überführen. Für jede Station IST-/SOLL-Bildhandlung, Zielpose, Kamerafokus und erwartetes Ende festlegen. Die fachlichen Karten bleiben die Text- und Zahlenquelle. Danach Wendepunkt und Schlussübersicht als eigene Manifest-Einträge modellieren und deren Wirkung auf den Kurvenfortschritt explizit definieren. Derzeit zählt die Kurve ausschliesslich Stationsbesuche. Den korrigierten V4-Van für Liefern direkt wiederverwenden und in der Lagerumgebung erneut prüfen.

## Validierung und bekannte Grenzen

- TypeScript- und Vite-Build erfolgreich. `scripts/v5-state-check.mjs` prüft vier geführte Zustände, Rücknavigation und unveränderten Cursor bei Vergleich/Replay/Moduswechsel. Moment-Daten, Kurvenkonstanten und Karten-Markup wurden mit `53e0339` verglichen. Szenendefinition, Unternehmensdaten und Vercel-Ausschlüsse stimmen überein. Die drei bestehenden MP4-Dateien haben die erwarteten Hashes.
- `scripts/v5-slice.mjs` prüft in Chrome vier Station/Akt-Kombinationen, Presenter-Beitritt, Rücknavigation vom Presenter, Vergleich, Replay, Reload und Rückkehr aus Explore. Ergebnis ohne JavaScript-Laufzeitfehler. Die vier Bühnenaufnahmen entstanden bei 1366 × 768, die vollständige Präsentationsansicht bei 1920 × 1080.
- `scripts/v5-motion-check.mjs` vergleicht gerenderte Pixel bei Pause und nach Replay, prüft den zunächst pausierten Film und erzeugt die Zwei-Raum-Übersicht. `scripts/v5-fallback.mjs` deaktiviert WebGL vor Seitenstart und prüft alle vier lokalen Bilder, Reduced Motion und den Abschlussklick.
- Lokale Evidenz unter `output/interactive-storyworld-v5/`: vier Stationsbilder, `pitch-1920.png`, `overview.png`, JSON-Prüfergebnisse und Buildlog. Nur die vier erforderlichen Fallback-Bilder gehören zu den Runtime-Assets.
- Build-Ausgabe rund 90,4 MB, lokales Inventar der potenziellen Quelldateien nach Vercel-Ausschlüssen rund 88,8 MB, davon rund 39 kB zusätzliche Standbilder. Das sind lokale Dateisummen. Ein Upload wurde nicht ausgeführt.
- Noch offen für die Gesamtabnahme sind Langzeittest, GPU-/FPS-Messung auf dem Präsentationslaptop, echter Hardwareclicker, Beamerkontrast, vollständiger Offline-Durchlauf und alle Stationen ab Bestellen. Die aktuellen Browserprüfungen ersetzen diese Generalprobe nicht. Synchronisation gilt für Projektions- und Presenter-Fenster desselben Browserprofils und Origins.
- Die bestehende Sprechernotiz beschreibt bereits alle sechs Momente. Sie bleibt fachlich eingefroren. Der Zwischenstand führt nach den ersten zwei Stationen je Akt in Szene 5. Für den vollständigen Pitch ist der spätere Ausbau erforderlich.

Der lokale Commit schliesst Phase C ab. Nächster fachlicher Implementierungsschritt nach Beauftragung ist „Bestellen“ mit manueller ERP-Erfassung im IST und eindeutig als spätere Ausbaustufe ausgewiesener Portalübergabe im SOLL.
