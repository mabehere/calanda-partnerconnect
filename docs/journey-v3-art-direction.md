# Cinematic Journey V3 · Art Direction

Ausgangspunkt: `5121405` (vollständiger vorheriger Creative-Stand), gesichert in `output/journey-v3-baseline/source.zip`. Branch `codex/cinematic-journey-v3`. Scope: Scene 4, gemeinsame Produktassets und 72-Sekunden-Film. Keine Änderung der fachlichen Daten oder der übrigen Szenenlayouts.

## Asset-Strategie

Importierte Charaktere mit echtem Skelett ersetzen die bisherigen Kapsel-Figuren. Marco erhält konsistent kupferfarbene Kleidung, dunkle Hose und dieselbe Frisur. Seine Silhouette bleibt in Showroom, Bestellung, Service und Abschluss gleich. Der zusätzliche Mitarbeiter ist über Arbeitskleidung unterscheidbar. Die Modelle bleiben stilisiert; eine glaubwürdige Pose und erkennbare Handlung sind wichtiger als zusätzliche Dekoration.

Quaternius Ultimate Modular Men, ältere CC0-Ausgabe: Casual_2 und Worker, 5776 beziehungsweise 5240 Dreiecke. Skeleton-aware Instanzen mit eigenem Mixer; originale Clips Idle_Neutral, Interact, Walk, Wave. Nur passende Clips sind im ausgelieferten GLB benannt. Eigene Kleidungsfarben, materialabhängige Rauheit und präzise situative Posen ergänzen die Assets. Der Ofen bleibt eine eigene Produktillustration ohne neue Spezifikationen. Holz erhält lokale Poly-Haven-PBR-Texturen. Ein importiertes Quaternius-Fahrzeug wird auf die Eignung für die Lieferhandlung geprüft.

## Shot-Plan

Jedes Kapitel bleibt zwölf Sekunden lang. Drei Einstellungen von je vier Sekunden lenken von Kontext zu Handlung und Ergebnis. Die Schnitte sind bewusst gesetzt; kleine Dolly-Bewegungen innerhalb der Einstellungen verwenden Smoothstep. Keine unmotivierten Orbits. Im normalen Modus dominiert nur die aktive Umgebung. Explore und Übersicht zeigen den Zusammenhang der sechs Umgebungen.

| Kapitel | Visueller Fokus | Bestehender Prozess |
|---|---|---|
| Entdecken | Warmes Feuer, Materialdetail, Marco am Ofen | Produkt entdecken; heutige einsprachige gegenüber späterer dreisprachiger Website |
| Partner gewinnen | Anfrage und sichtbare Übergabe an einen Mitarbeiter | Zuständigkeit und Vertretung, statt verlorener Anfrage |
| Bestellen | Over-the-Shoulder, vier Produkte, eindeutige Übergabe | Späteres Händlerportal → bestehendes ERP, ausdrücklich nach MVP |
| Liefern | Lager, Ladefläche, bewegtes Fahrzeug und Status | ERP führt Auftrag und Versandstatus; eigener Portalzugang erst später |
| Service | Kalte Glasscheibe mit Riss, Foto, Bearbeitung | Schaden, Pflichtangaben, Zuständigkeit, dokumentierte Lösung |
| Verbunden | Marco, gemeinsame Historie, gezielter Gesamt-Reveal | Dieselbe Partnerbeziehung über die bestehenden Standorte |

## Vertical-Slice-Gate

Zuerst werden nur Entdecken und Service implementiert. Browseraufnahmen, sechs vollständige Filmstills und zwei kurze Testsequenzen liegen unter `output/journey-v3-slice/`. Die übrigen Kapitel werden erst nach der Sichtprüfung übertragen.

Prüffragen: Ist Marco sichtbar wiedererkennbar? Liegt die Handlung im Bildzentrum? Ist der Glasriss ohne Untertitel lesbar? Verbleibt die Hand am passenden Objekt? Stimmen Film und Browser überein? Gibt es schwarze Frames, Ladefehler, unmotiviertes Gleiten oder verdeckende Architektur? Sind Vorher/Nachher fachlich konsistent und MVP-Grenzen sichtbar?

## Technischer Vertrag

Eine gemeinsame lokale Kapitelzeit steuert Kamera, AnimationMixer, Requisiten und Monitorzustand. Remotion setzt den Zeitpunkt direkt aus dem Frame; keine Echtzeit-Timer. Pause hält auch Hände und Materialanimation an. Reduced Motion zeigt eine definierte erzählerische Einstellung. Assets werden lokal geladen, gemeinsame GLTF-Quellen bleiben im Loader-Cache; eigene Materialkopien, Mixer und Texturen werden beim Abbau freigegeben. Die alten Produktansichten behalten ihre bisherige Licht- und Kameralogik.
