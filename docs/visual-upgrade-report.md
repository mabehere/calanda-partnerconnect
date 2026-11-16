# Caleira × Super Trooper · Creative Upgrade

Die bestehende Präsentation wurde visuell und technisch überarbeitet, mit Schwerpunkt auf der gemeinsam von interaktiver Journey und Film verwendeten 3D-Welt. Alle 19 Szenen wurden vor und nach der Umsetzung bei 1920×1080 und 1366×768 aufgenommen. Der Film und die visuellen Backups sind aktualisiert. Die freigegebenen fachlichen Inhalte bleiben erhalten.

Ausgangscommit: `bf2a7f56fc6a6b4f02aea4e2248c31f27603aad6`. Ausgangsbranch: `upgrade/cinematic-experience`. Arbeitsbranch: `codex/creative-excellence`. Der Ausgangsstand war sauber und wurde als Quellarchiv gesichert. Es erfolgte kein Push oder Merge; die Änderungen liegen lokal im Arbeitsverzeichnis.

## Design und Szenen

Manrope, Bodoni Moda, dunkles Grün und Kupfer bleiben die gestalterische Grundlage. Grössere Schrift, bewusst gesetzte helle Analyseflächen und stärkere Hierarchien verbessern die Präsentationswirkung. Layouts sind je nach Inhalt unterschiedlich gewichtet. Es wurden keine Informationen für ein reduzierteres Layout entfernt.

| Szenen | Umsetzung |
|---|---|
| 01 Hook | Detaillierter Ofen, Glas/Metall, animiertes Feuer und weichere räumliche Beleuchtung. |
| 02 Netzwerk, 03 Ausgangslage | Klarere Zahlen-/Text-Hierarchie, grössere Erläuterungen, präzisere Abstände. |
| 04 Journey | Neue zusammenhängende Architektur, sechs Kamerafahrten, bewegte Figuren und Fahrzeug, grosse Welt neben heller Moment-Karte. |
| 05 Reibung, 06 Vision | Kontrolliertere Staffelung und Kontraste; vorhandene Aussagen erhalten. |
| 07 Lead, 08 Partner, 09 Bestellung, 10 Service | Formulare, Historien, Tabellen, Produkte und Statusanzeigen visuell geordnet; Abläufe unverändert. |
| 11 Marketing, 12 Website | Bestehende helle Vorschauen deutlicher in die dunkle Bühne integriert. |
| 13 Architektur, 14 KI | Ruhige technische Hierarchie, bessere Text-/Flächennutzung. |
| 15 KPIs, 16 Rechner | Lesbarere Definitionen und stärkere Ergebnisflächen; keine Interpolation oder Änderung fachlicher Werte. |
| 17 Roadmap, 18 Budget | Klarere Zeitleiste, Freigabestufe und Investitionsdarstellung. |
| 19 Entscheidung | Präzisere typografische Hierarchie innerhalb der bestehenden Markenwelt. |

Die neuen Styles liegen in `src/creative.css`; die ursprünglichen fachlichen Demo-Komponenten bleiben unverändert. Die kompakten Layouts wurden anhand tatsächlicher Screenshots nachgebessert. In den finalen Standardansichten aller 19 Szenen melden beide Desktop-Auflösungen weder horizontale Überbreite noch überlaufenden Hauptinhalt. Detaillierte Demo-Ansichten und die mobile Darstellung dürfen bewusst vertikal scrollen.

## Scene 04: Modelle, Licht und Kamera

Sechs eingerichtete Cutaway-Räume teilen Sockel, Erschliessung und Fassadendetails. Fenster, Türen, Leuchten, geflieste Böden, Schreibtische, Monitore, Stühle, Regale, Paletten und Pflanzen vermitteln Funktion und Massstab. Das Ofenmodell besitzt gerundetes Gehäuse, Türrahmen, Griff, Rohrverbindungen, Lüftungsschlitze, Holzscheite, Glas und ein zeitgesteuertes Flammenmaterial.

Figuren haben gegliederte Arme und Beine mit prozeduralen Geh-, Arbeits-, Gesprächs- und Prüfbewegungen. Das Fahrzeug fährt im Logistikkapitel mit mitlaufenden Rädern. Es wurden keine fremden Modelle oder Bewegungsbibliotheken importiert. Die Figuren bleiben bewusst stilisierte Miniaturen; es handelt sich nicht um fotorealistische Charaktere oder Motion-Capture-Animation.

Lokales RoomEnvironment/PMREM, warmes Hauptlicht, kühleres Fülllicht, Umgebungslicht und Schatten differenzieren Metall, Glas, Holz und Stein. Es gibt keine externe HDRI-Abhängigkeit. Kein Bloom oder Tiefenunschärfe verdeckt Modell- oder Lesbarkeitsprobleme.

Sechs definierte Shots variieren Nähe, Dolly und abschliessenden Überblick. Die Kameraposition und ihr Ziel werden innerhalb des jeweiligen Zwölf-Sekunden-Kapitels kontrolliert interpoliert. Kapitelgrenzen sind bewusste Schnitte. Explore übergibt die Kamerakontrolle an OrbitControls. Film und Website verwenden dieselben Modelle, Lichtgrundlagen und Shot-Samples.

## Animation und Bedienung

Die frühere weltweite React-Aktualisierung ca. 24-mal pro Sekunde und der separate Kapitel-Timer wurden durch eine gemeinsame ref-basierte Zeit ersetzt. Kamera, Figuren, Fahrzeug und Fortschritt folgen dieser Zeit. React-Zustand ändert sich bei Kapitel- oder Bedienwechseln. Im Film wird dieselbe Szene deterministisch aus der Frameposition ausgewertet.

Pause hält die Welt samt Kamera an. Replay setzt den aktuellen Shot zurück. Kapitelwahl, Explore, Vorher/Nachher, Film, Qualitätswechsel und 3D-Vollbild bleiben direkt bedienbar. Das Abspielen beziehungsweise Suchen im Film synchronisiert Kapitel und Moment-Karte. Verdeckte Tabs pausieren; Reduced Motion liefert statische Einstellungen mit vollständigen Inhalten. Formulare und Journey-Steuerung lösen keine versehentlichen Präsentationswechsel aus. Direkte Demo-Links synchronisieren die Presenter-Ansicht.

`SceneChoreography.tsx` enthält szenenspezifische GSAP-Reveals mit kleinen Wegen und kurzen Staffeln. GSAP besitzt die inneren Elemente, Motion nur den äusseren Szenenwechsel. Der GSAP-Kontext räumt bei Navigation auf. Der Montagezeitpunkt berücksichtigt den wartenden Szenenwechsel. Reduced Motion überspringt die Choreografie.

## Performance

Statische Architektur wird materialweise zusammengeführt. Gemeinsam genutzte Materialien und Geometrien begrenzen Ressourcen; eigene zusammengeführte Buffer und die Umgebung werden beim Abbau freigegeben. Pausierte oder bewegungsreduzierte Ansichten rendern bei Bedarf. Eco reduziert Renderqualität und Schatten. Alle Assets bleiben lokal, die Journey bleibt separat geladen.

Messung in Headless Chrome 157 unter Windows, ANGLE/AMD Radeon 780M, 1366×768 Viewport, Canvas 893×392 bei DPR 1, nach Aufwärmen über 180 rAF-Abstände:

| Messwert | Hoch | Eco |
|---|---:|---:|
| Draw Calls, inklusive Schatten | 358 | 166 |
| Gerenderte Dreiecke, inklusive Schatten | 113270 | 53728 |
| Geometrien / Texturen | 204 / 4 | 204 / 4 |
| rAF-Abstand Median / p95 | 8,3 / 8,4 ms | 8,3 / 8,4 ms |

Drei echte Neu-Montagen zeigten jeweils 204 Geometrien und vier Texturen; keine Browserfehler. Die rAF-Abstände sind Browser-Taktung, keine GPU-Zeitmessung und kein Nachweis für 60 FPS auf jedem Laptop. Eine numerische Vorher-/Nachher-Performancebehauptung wird mangels vergleichbarer Baseline-Messung nicht gemacht. Der Journey-Build umfasst etwa 975 kB JavaScript, gzip etwa 260 kB; der Film etwa 76,9 MB. Die 3D-Ansicht bleibt damit ein wesentlicher Teil der Ladegrösse.

## Visuelle Vergleiche

`output/creative-baseline/` und `output/creative-after/` enthalten identisch benannte Vergleichsbilder. `output/creative-iteration1/` dokumentiert den Zwischenstand. Kontaktbögen erleichtern den Gesamtvergleich.

- `scene-04-1920.png` und `scene-04-1366.png`: abstrakte Stationen werden zu einer verbundenen Innenraumwelt; die Moment-Karte gewinnt Kontrast, die Bühne mehr Fläche.
- `journey-1-after-1920.png` bis `journey-6-after-1920.png`: alle sechs Kapitel, ergänzt um dieselben Vorher-Zustände und die zweite Auflösung. Architektur und Einrichtung sind deutlich detaillierter; Figuren bleiben bei Übersichten klein.
- `journey-wide-*` und `journey-explore-*`: räumlicher Zusammenhang und freie Perspektive.
- `film-*.png`: Kapitelmitten, Grenzen und Filmende. Der erste Frame wurde nach einem korrigierten Browser-Seeking nochmals aufgenommen; ein ursprünglich schwarzer Screenshot war ein Aufnahmeproblem, kein schwarzer Filmframe.
- `mobile-touch.png`, `keyboard-focus.png`, `motion-a.png`, `motion-b.png`, `motion-logistics.png`: ergänzende Touch-, Fokus- und Bewegungsprüfungen.

Kritische Einordnung: Die Welt ist nachvollziehbarer, materieller und lebendiger als die Baseline. Das ruhige Editorial-Layout führt besser zwischen Welt und Fachinhalt. Die Darstellung bleibt eine stilisierte prozedurale Architekturminiatur mit einfachen Charakteroberflächen. Ein internationaler Designpreis oder die visuelle Qualität eines grossen Spielestudios lässt sich aus diesen Prüfungen nicht ableiten. Die kleinen Detailtexte sollten vor dem Pitch auf dem tatsächlichen Projektor beurteilt werden.

## Ausgeführte Prüfungen und Exporte

| Prüfung | Ergebnis / Beleg |
|---|---|
| `npm run build` | Erfolgreich, TypeScript und Vite; `output/creative-build.log`. |
| `npm test` | 11 Tests in zwei Dateien erfolgreich; `output/creative-unit.log`. |
| `npm run test:e2e` | 26 erfolgreich, installierte Chrome- und Edge-Kanäle unter Windows; `output/creative-e2e.log`. |
| Visueller Browser-Audit | 19 Szenen bei beiden Zielauflösungen, alle sechs Journey-Kapitel vor/nach, Explore/Übersicht, Film; keine Browserfehler; `output/creative-after/observations.json`. |
| Touch/Reduced Motion | Emuliertes Mobilgerät 390×844, Kapitelwahl/Vorher bedienbar, keine Überbreite, Illustrativ-Hinweis sichtbar; `output/creative-touch.json`. |
| Navigation/Medien | Pause als unverändertes Canvas-Bild geprüft, Replay, Auto-Kapitelwechsel, Eco, Explore, Vollbild, schnelles Navigieren, Formular-Tasten, WebGL-Fallback, Film-Seeking und Presenter-Synchronisation. |
| Ohne externe Verbindung | Browser-Audit blockiert externe Requests; lokale Anwendung und Assets funktionieren. Kein Nachweis für einen Service Worker oder Betrieb ohne lokalen Server. |
| `npm run video:render` | Alle 2160 Frames gerendert und H.264 codiert. Windows verweigerte die abschliessende Umbenennung mit EPERM; deshalb CLI-Endstatus 1. Die vollständige temporäre Datei wurde nach Metadatenprüfung an den vorgesehenen Pfad kopiert und per Hash verglichen. Das temporäre Duplikat wurde entfernt. |
| Filmprüfung | Vorhanden und im Browser abspielbar: 1920×1080, 30 fps, 72 Sekunden. Alle 2160 Frames erfolgreich decodiert; kein Frame mit mittlerer Helligkeit unter 5/255. Visuelle Stichproben ergänzen diesen Ganzfilmtest; `output/creative-video-check.json`. |
| `npm run export`, Screenshot-/Backup-/Medien-Skripte | Aktualisierte PDFs, Hauptszenen- und Demo-Backups sowie drei korrekt getrennte Filmstills. Der frühere Dateinamensfehler im Medien-QA-Skript ist korrigiert. |
| PDF-Prüfung | 19 Pitch- und 13 Backup-Seiten visuell geprüft; extrahierter Text aller Seiten gegenüber Baseline gleich, nur Leerraum normalisiert; `output/creative-pdf-check.json`. |
| Content Freeze | 51/51 Vergleiche erfolgreich; Details in `content-freeze-verification.md`. |

Der fertige Film liegt weiterhin unter `public/media/caleira-customer-journey.mp4`. Die Downloads liegen weiterhin unter `public/downloads/caleira-pitch.pdf` und `public/downloads/caleira-demo-backup.pdf`. Die bestehenden Einbindungen und Downloadpfade bleiben erhalten.

## Eingesetzte Skills

Frontend und Prüfung: frontend-design, web-design-guidelines, vercel-react-best-practices. Motion: motion-director, site-motion-excellence-director, web-motion-auditor, gsap-core, gsap-react, gsap-timeline, gsap-performance. 3D: threejs-r3f, threejs-scene, threejs-animation, threejs-lighting, threejs-materials, threejs-shaders, threejs-geometry, threejs-assets, threejs-performance und threejs-testing. Film: remotion-video-agent, remotion-render und remotion-interactivity. Exportprüfung: PDF-Skill. Die Hinweise wurden insbesondere für Animationsbesitz/Cleanup, gemeinsame Zeit, lokale Assets, Ressourcenfreigabe, deterministische Frames und belegte visuelle QA angewendet. Es gab keine neue Bibliothek und kein Dependency-Upgrade.

## Verbleibende Grenzen

Es besteht kein offener Build-, Inhalts- oder Exportblocker. Die reale Generalprobe auf dem vorgesehenen Laptop und Projektor bleibt als Umgebungsprüfung erforderlich; ein physisches Touchgerät wurde nicht getestet. GPU-Auslastung, thermisches Verhalten und lange Akkulaufzeit wurden nicht gemessen. Der Qualitätsmodus und der lokale Film stehen für schwächere Hardware bereit. Die kreative Bewertung ist eine dokumentierte interne Einschätzung, keine externe Designabnahme.

Weitere Übergabedokumente: `visual-upgrade-audit.md`, `scene-04-art-direction.md`, `asset-licenses.md`, `content-freeze-verification.md`.
