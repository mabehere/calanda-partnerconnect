# Interactive Storyworld V5

Die 3D-Journey in Szene 4 führt durch sechs Stationen in zwei Akten. Nach dem IST-Durchlauf folgt der Wendepunkt. Nach dem SOLL-Durchlauf zeigt das Schlussbild alle Stationen, die gemeinsame Partnerhistorie und die Rolle des ERP. Jeder Schritt bleibt nach seiner Bildhandlung stehen.

## Vorführen

- Lokal `npm run dev -- --port 5195` ausführen und [Szene 4](http://127.0.0.1:5195/#scene-4) öffnen. Für die gebaute Fassung `npm run build` und dann `npm run preview -- --port 5196` ausführen. Der lokale Server liefert `dist/` aus.
- **Weiter**, **→** und **Page Down** steigern den geführten Fortschritt. **←** und **Page Up** stellen die vorangehende Endpose wieder her. Ein Klick während einer Animation wechselt zum folgenden Schritt. Am letzten Bild führt ein weiterer Klick in Szene 5. Schnelle Eingabe kann die Schlussanimation beenden, bevor der Ausstieg möglich ist.
- **IST zeigen / SOLL zeigen** wechselt den betrachteten Zustand bei gleicher Kamera. **Weiter** kehrt aus einem Vergleich oder aus Explore zunächst zum geführten Schritt zurück. Replay und Pause betreffen jeweils die aktive Bildhandlung.
- **Ansicht** öffnet Explore mit Drehung, Zoom und Stationswahl. Die sechs Tasten unter der Erlebniskurve sind eine zusätzliche direkte Auswahl. **Zur Präsentation** stellt den geführten Zustand wieder her. Ein Reload derselben Registerkarte lädt den letzten geführten Zustand als Standbild der Handlung. **Von vorne beginnen** setzt den Fortschritt zurück.
- **Ansicht → Film** öffnet den vollständigen bestehenden Film mit manueller Wiedergabe. Die Moment-Karte folgt dem Film beim Spulen. Der separate V4-Stilpilot liegt in `output/caleira-v4-pilot/index.html` und ist im lokalen Entwicklungsmenü verlinkt.
- **Sprechernotizen → Separates Presenter-Fenster** öffnet die synchronisierte Ansicht im gleichen Browserprofil. Das Fenster zeigt Station, Akt, Handlung und nächste Aktion. Presenter-Tasten senden ihre Navigationsbefehle an das Projektionsfenster.
- **Qualität · Eco** reduziert die Renderauflösung und deaktiviert Echtzeitschatten. Bei fehlendem oder verlorenem WebGL bleiben das Bild je Schritt, Karten, Kurve und Bedienelemente verfügbar. Explore nutzt dann die statische Übersicht und die sechs Stationsschaltflächen. Reduzierte Bewegung verwendet die Endpose direkt.

## Ablaufplan für Sila

Das Zeitbudget beträgt wie im vorhandenen Skript 90 Sekunden. Zwölf Besuche zu ungefähr sechs Sekunden ergeben 72 Sekunden. Dazu kommen je rund sechs Sekunden für Wendepunkt und Abschluss sowie sechs Sekunden Übergabereserve. Das Tempo bestimmt die präsentierende Person. Die animierte Bildhandlung dauert im regulären Modus 3,4 Sekunden je Schritt inklusive Anfahrt.

| Schritt | Station | Gezeigte Handlung |
|---|---|---|
| 1 | Entdecken · IST | Marco sieht den Ofen. Das einsprachige Terminal illustriert den Einstieg in einer Fremdsprache. |
| 2 | Partner gewinnen · IST | Der Umschlag bleibt vor dem Arbeitsplatz stehen. Die persönliche Antwort steht aus. |
| 3 | Bestellen · IST | Vier Öfen stehen auf der Ablage. Die E-Mail wird am ERP-Arbeitsplatz manuell erfasst. |
| 4 | Liefern · IST | Der V4-Lieferwagen fährt an den Paketen vorbei. Der Lieferstatus bleibt im ERP und ist für Marco nicht einsehbar. |
| 5 | Service · IST | Die gesprungene Scheibe und die Meldung ohne Foto führen zur Rückfrage. |
| 6 | Verbunden · IST | Getrennte Ablagen und der Bildschirm zeigen über Postfächer und Excel verteiltes Partnerwissen. |
| 7 | Wendepunkt | Die Kamera zieht auf. Die Welt zeigt die sechs Medienbrüche und die fachlich getrennten Rollen von CRM und ERP. |
| 8 | Entdecken · SOLL | Das Terminal bietet DE, IT und FR. Die Karte kennzeichnet die mehrsprachige Website als spätere Ausbaustufe. |
| 9 | Partner gewinnen · SOLL | Die Anfrage erreicht den Arbeitsplatz und erhält sichtbare Bestätigung. Zuständigkeit und Vertretung gehören zum MVP. |
| 10 | Bestellen · SOLL | Das spätere Händlerportal übergibt die Bestellung einmalig an das bestehende ERP. |
| 11 | Liefern · SOLL | Der Versand bleibt im ERP. Die Betreuung kann Marco am Telefon den ERP-Status nennen. Eigener Portalzugang erst später. |
| 12 | Service · SOLL | Die vollständigen Pflichtangaben und das ergänzte Foto führen in den nachvollziehbaren Servicefall. |
| 13 | Verbunden · SOLL | Dieselben vier vorhandenen Standorte teilen eine Partnerhistorie. |
| 14 | Gesamtbild | Alle Räume, beide Kurven, CRM-Zusammenhänge für Betreuung und Service sowie Auftrag und Versandstatus im ERP werden zusammen sichtbar. |

Die eingefrorene Sprecheranweisung in Szene 4 nennt „Kapitel 1, 3 und 5 anklicken“. Für V5 bedient Sila stattdessen die obige geführte Folge. Die fachlichen Notizen und der bestehende Cue sind im Szenendatensatz erhalten.

## Architektur und Weiterarbeit

Die Übergabe `interactive-storyworld-v5-handoff.md` dokumentiert den abgesicherten Teilablauf. Der aktuelle Stand ergänzt dessen Reducer und GSAP-Uhr. `engine.ts` hält die zwölf Besuche und zwei Übersichten. Der Cursor steuert den Fortschritt beider Kurven. Ein separater Ansichtswert trägt Vergleiche und Exploration. Der erweiterte Ablauf speichert seinen Cursor unter einem eigenen SessionStorage-Schlüssel, damit ältere Vier-Schritte-Indizes beim ersten Wechsel auf die vollständige Fassung keinen anderen Schritt öffnen.

`Stage.tsx` platziert sechs Stationen auf einem symbolischen Rundweg. Diese Geometrie bildet keine Standortkarte ab. Im Fokus wird nur der aktuelle Raum gerendert. In Übersichten stehen alle Räume, der Weg und die beschrifteten Systemverbindungen zur Verfügung. `StationProps.tsx` ergänzt die Prozessobjekte der vier neuen Räume. Figuren, Van, Ofen, Licht und Rundungen greifen auf die vorhandenen V4-Komponenten zurück. `deliveryMotion.ts` koppelt die Fahrstrecke an die bestehende lokale Raddrehung und stellt reproduzierbare Vorwärts-, Rückwärts- und Reset-Zustände bereit. `StoryJourney.tsx` bewahrt Karten, Navigation, Moduswechsel und die gemeinsame Zeitbasis.

Alle 15 WebP-Standbilder sind lokale Laufzeitdateien. Sie stammen aus Browseraufnahmen, die mit `scripts/v5-slice.mjs` wiederholbar sind. Die Ausgangsmedien bleiben über ihre lokalen Pfade erreichbar. Für weitere gezielte Anpassungen zuerst den betreffenden Manifest-Eintrag und die zugehörigen Objekte ändern. Danach die Browseraufnahme und den WebGL-Ersatz für den betroffenen Zustand aktualisieren.

## Prüfungen

Das lokale Prüfverzeichnis `output/interactive-storyworld-v5/full/` enthält Standbilder aller 14 Schritte, die frei drehbare Ansicht als Standbild, die Präsentationsansicht bei 1920 × 1080 sowie die JSON-Nachweise. Die dortige Übersicht stellt IST und SOLL pro Station direkt gegenüber.

- Chrome durchlief alle 14 Schritte bei 1366 × 768 mit Page Down und Pfeiltasten. Presenter-Einstieg, Rücknavigation, Vergleich, Reload, Explore-Rückkehr und synchronisierter Abschluss wurden geprüft. Der Pixelvergleich nach Replay stimmte im selben Browser. Die Pause hielt das Bild stabil.
- Die Produktionsvorschau lief mit blockierten externen Anfragen durch alle 14 Schritte. Sie öffnete die drei verlinkten Demo-Szenen und den lokalen Film. Der sichtbare Standbildersatz funktioniert beim Start ohne WebGL sowie nach simuliertem Kontextverlust während der Vorführung.
- Die V5-Fahrstrecke von 2,3 Einheiten und Skalierung 0,76 wurden mit dem vorhandenen V4-Radmodell numerisch geprüft. In 432 Stichproben betrug die grösste Abweichung einer Radnabe relativ zum Wagen weniger als 0,000000000001 Einheiten. Der Winkel folgt dem skalierten Radradius. Stillstand ist vor/nach der Fahrt konstant.
- Der Content-Freeze-Vergleich deckt Szenendefinition, fachliche Quelldaten, Moment-Karten, Kurvenwerte, Phasen, Vercel-Ausschlüsse und die drei MP4-Hashes ab. Ein zusätzlicher Git-Vergleich bestätigt die geschützten Quellpfade und V4-Renderquellen.
- Bei drei animierten Schritten lag das gemessene 95. Perzentil des Browser-Frameabstands bei rund 8,6 bis 16,3 ms. Die Schritte erreichten ihren Endzustand nach rund 3,4 bis 3,8 Sekunden. Diese Werte stammen aus Chrome im Headless-Modus und sind keine Messung am Vorführlaptop.
- Der Build benötigt rund 90,5 MB. Das lokale Inventar der potenziellen Upload-Quelldateien nach den vorhandenen Vercel-Ausschlüssen liegt bei rund 89 MB. Die 15 Laufzeitbilder tragen zusammen rund 168 kB bei. Der Vergleich beruht auf Dateigrössen vor einem tatsächlichen Upload.

Vor der Präsentation empfiehlt sich die 90-Sekunden-Generalprobe auf dem tatsächlichen Laptop mit Clicker, Projektionsmodus und Beamer. Die realen Hardwaretasten, Leistung und Kontrastwerte sind vor Ort zu prüfen. Die 3D-Handlungen verwenden stilisierte, ortsfeste Gesten und eingeblendete Prozessobjekte. Die logistische Bildhandlung verwendet den animierten Van. Die Fallaufnahme und der Telefonstatus werden in den Tafeln und der Prozessanimation vermittelt.

Die Unit-Suite bestand mit 11 von 11 Tests. Die vollständige Chrome-Suite bestand mit 13 von 13 Tests. Vite-Build, Zustands- und Content-Prüfung sowie die gebaute Offline-Vorschau bestanden.
