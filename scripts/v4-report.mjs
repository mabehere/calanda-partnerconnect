import fs from 'node:fs';
const out='output/caleira-v4-pilot';const read=f=>JSON.parse(fs.readFileSync(`${out}/${f}`));
const p=read('render-provenance.json'),media=read('media-check.json'),browser=read('browser-check.json'),wheel=read('wheel-check.json'),hand=read('hand-check.json'),sound=read('qa/encoded-audio-check.json'),freeze=read('content-freeze.json');
if(![media,browser,wheel,hand,freeze].every(c=>c.passed))throw Error('Unresolved validation');
fs.writeFileSync(`${out}/BERICHT.md`,`# CALEIRA · V4 Pilot · Freigabepaket

Stand: ${p.completed}. **Pilot abgeschlossen; visuelle Freigabe offen.** Es wurden ausschliesslich Entdecken, Partner gewinnen und ein separater Fahrzeugtest umgesetzt. Kapitel 3–6 sind nur als Storyboard vorhanden. Keine Änderung am Production-Deployment, kein Push, Merge oder Deploy. Keine kostenpflichtigen Dienste oder neuen Frameworks.

## Ergebnisse

- [Lokale Freigabeseite](index.html): beide MP4s, sechs Screenshots, Kontaktbögen, Vorher/Nachher und Dokumentation.
- [Pilot](caleira-v4-pilot.mp4): 1920 × 1080, 30 fps, 447 Frames = 14,900 Sekunden Bild. AAC enthält 12 ms Encoder-Padding; Containerdauer 14,912 Sekunden. ${(p.renders[0].bytes/1e6).toFixed(2)} MB.
- [Fahrzeugtest](caleira-v4-vehicle-test.mp4): 1920 × 1080, 30 fps, 150 Frames = 5 Sekunden, ${(p.renders[1].bytes/1e6).toFixed(2)} MB, ohne Ton.
- [Sechs Pilotmomente](pilot-contact.jpg), [Charakter-Kontaktbogen](character-contact.jpg), [V3–V4-Vergleich](comparison.jpg), [Storyboard und aufnahmefertiger Text](STORYBOARD.md).
- Alle Modelle: vier Ansichten je Modell in \`audit/\`, unkomprimierte Einzelbilder in \`audit/views/\`. Die sechs ausgelieferten Pilot-Screenshots wurden direkt aus der finalen MP4 dekodiert.

## Ausgangsstand und alte MP4

Lokal war \`codex/cinematic-journey-v3\` bei \`b2f4ece860c7b9ea8533dca39e098f02c74fc1aa\` sauber. Der GitHub-Branch wurde über den Connector geprüft und stand auf demselben Commit. V4 arbeitet separat auf \`codex/soft-3d-journey-v4\`. Ausgangssicherung: \`tmp/v4-safety/source.zip\` plus Commit- und Film-Blob-Datei; dieses Archiv bleibt ausserhalb von Git und Deployment.

Die Produktions-MP4 besitzt weiterhin den Git-Blob \`e6bc33863631d3a10e4348c1a9b3edcc6162aa88\`, identisch zum Creative-Upgrade-Stand \`5121405\`. V3-Quellcode und gespeicherter Film waren somit auseinandergefallen. Vorhandene V3-Renderprotokolle belegen Einzelbilder, keinen erfolgreich ausgetauschten Gesamtfilm. Die konkrete Ursache des ausgebliebenen Austauschs lässt sich aus diesem Dateinachweis nicht abschliessend bestimmen. Ein gemeldetes Nutzungslimit ist kein Nachweis eines fertigen Renders.

Die alte MP4 bleibt auftragsgemäss unverändert, SHA-256 \`${freeze.productionFilm.sha256}\`. Die neuen V4-MP4s werden nicht als neuer Produktionsfilm ausgegeben. Die Vergleichsbilder links wurden aus dem aktuellen unveränderten V3-Quellcode neu gerendert, nicht aus der veralteten MP4.

## Asset-Audit und Korrekturen

| Altes Asset | Befund | Entscheidung für V4 |
|---|---|---|
| advisor.glb | 62 Bones. Gruppe **Pistol**, darunter Cube204, Cube204_1 und Cube204_2 mit DarkBrown/Grey/Black. Die Pistole ist in den Vierseitenansichten sichtbar. | Vollständig ersetzt durch eigene salbeifarbene Figur. Keine alten Charaktermeshes im Pilot. |
| worker.glb | 62 Bones; Arbeitskleidung, Helm; in den geprüften Ansichten keine Waffe erkennbar. | Im Pilot nicht benötigt, nicht übernommen. |
| marco.glb | 62 Bones, kantige modulare Silhouette, fünf vorhandene Clips. | Eigenes Modell: Kupferoberteil, dunkle Hose, markante Frisur; identisch in beiden Kapiteln. |
| truck.glb | Vorderreifen und gemeinsamer Hinterrad-Mesh haben lokalen Ursprung 0/0/0, während die Vertexdaten abseits davon liegen. Achse der alten Reifen ist X. Direkte rotateX-Drehung dreht damit um den falschen Mittelpunkt. | Eigenes rundes Fahrzeug mit vier expliziten Radnaben und lokaler Z-Radachse. |

Das alte Packing-Skript filterte Animationsnamen, nicht Waffen-Geometrie. Für V4 wurde deshalb kein importiertes Modell ungeprüft wiederverwendet. Die ursprünglichen GLBs bleiben ausschliesslich zur Reproduzierbarkeit und für die unveränderte bisherige Präsentation erhalten.

Scene Graphs, Mesh-/Materialzuordnungen, Bone-Hierarchien, Bounds sowie Namen, Dauern und Zieltracks aller enthaltenen Clips stehen in \`audit/advisor.json\`, \`worker.json\`, \`marco.json\`, \`truck.json\`. Die alten Figuren wurden mit einer Idle-Pose aus vier Perspektiven visuell geprüft; andere alte Clips werden in V4 nicht eingesetzt. \`audit/legacy-contact.jpg\` dokumentiert das tatsächliche Erscheinungsbild.

V4 verwendet runde lokale Geometrie, matte Creme-/Salbei-/Kupfermaterialien, warmes Studiolicht und wenige zweckgebundene Requisiten. Marco zeigt einmal auf das Produkt. Die Beratung bestätigt über ein Gerät, danach folgen kurze Nickgesten. Keine Gehschleifen, kein Gleiten, keine IK und keine importierten Requisiten. Prozessgrafiken zeigen Anfrage, Zuordnung und Ergebnis nacheinander.

Der Handweg wurde nach der Renderprüfung korrigiert: Der Tisch steht so weit vorne, dass die Hand vor dem Antippen oberhalb der Platte ankommt. ${hand.verticesTested.toLocaleString('de-CH')} geprüfte Weltkoordinaten über 301 Zeitpunkte und beide Arme: **${hand.deskIntersections} Tischdurchdringungen**, Kontakt zum Gerät wird erreicht. Numerischer Nachweis: \`hand-check.json\`.

## Fahrzeug und Determinismus

Jedes Rad wird von Beginn an um seine geometrische Nabe aufgebaut. Es müssen keine fremden Meshes umgehängt werden. Der tatsächliche Aussenradius der Torus-Geometrie ist 0,38 Modelleinheiten. Winkel = −zurückgelegter Weltweg / (Radius × gleichförmige Modellskalierung). Weg und Winkel werden direkt aus der Zeit bestimmt, ohne aufsummierte Frame-Deltas.

${wheel.samples} Stichproben bei Skalierungen 0,5 / 1 / 2, einschliesslich Rückwärts-Seeking und Pausen: maximale Nabenverschiebung **${wheel.maxHubDrift}**; Radialabweichung ${wheel.maxRadialError}. Vor und nach der Fahrt bleiben die Räder stehen. Siehe \`wheel-check.json\` und die aus der finalen MP4 extrahierte Bildfolge \`qa/vehicle-sequence.jpg\`.

## Sprache, Musik und Rechte

Die vier WAV-Sprachaufnahmen existieren lokal in \`audio/\` und sind als lokale Remotion-Audiospuren integriert. Stimme: **Microsoft Katja, de-DE**, installierte Windows-Systemstimme, Sprechtempo 1,03. Erzeugung über Windows.Media.SpeechSynthesis; keine Stimmklonung, kein Cloud-TTS, kein Abo oder Kauf. Die Windows-API verwendet installierte Microsoft-signierte Stimmen: [Microsoft-Dokumentation](https://learn.microsoft.com/en-us/uwp/api/windows.media.speechsynthesis.speechsynthesizer?view=winrt-26100). Die Stimme ist keine CC0-Stimmbibliothek; ihre Herkunft bleibt die vorhandene Windows-Installation. Es werden nur generierte Aufnahmen, keine Microsoft-Stimmdateien weitergegeben.

Dies ist eine Standard-Systemstimme. Ihr subjektiver Klang und die Aussprache der Markennamen sind ausdrücklich Teil der Freigabe; eine menschliche professionelle Sprecherleistung oder ein Premium-Neural-TTS wurde nicht vorgetäuscht. Der Gesamttext im Storyboard hat 78 Wörter; nur die ersten zwei Kapitel wurden vertont. Gemessene Dauern und Startpunkte stehen in \`audio/audio-check.json\` und im Storyboard. Deutsche Untertitel sind eingebrannt und zusätzlich als SRT/VTT enthalten.

Musik und Signaltöne wurden für diesen Pilot aus Sinuswellen, eigenen Akkorden und Hüllkurven erzeugt (\`scripts/v4-audio.py\`). Keine fremden Aufnahmen, Samplebibliotheken oder Musiktitel. Die leisen Signale begleiten Nachricht, Datenübergabe und Bestätigung. Die Stimme bleibt vorn. Eigene Geometrie und diese eigenen Audioelemente erzeugen keine zusätzlichen Drittanbieter-Lizenzkosten; bestehende Bibliotheks- und Schriftlizenzen gelten weiterhin. Manrope und Three.js/RoomEnvironment sind bereits im Projekt enthalten.

Der dekodierte finale AAC-Mix hat einen Sample-Peak von **${sound.samplePeakDbFS.toFixed(2)} dBFS** und **${sound.clippedSamples} geclippte Samples**. Dies ist eine Sample-Peak-Prüfung, keine zertifizierte True-Peak-/Broadcast-Loudness-Messung. Die technische Audioprüfung ersetzt keine subjektive Hörfreigabe.

## Prüfung und Schutz des bestehenden Stands

- Build erfolgreich; bestehende Unit-Tests: 11/11. Zusätzliche unabhängige Geometrieprüfungen für Radnaben und Hände bestanden.
- Vollständige Dekodierung zählt 447 Pilotframes und 150 Fahrzeugframes. H.264/AAC, Metadaten und Dateihashes stimmen. Keine beschädigte Datei. Visuelle Kontrolle der vierseitigen Assets, sechs grossen Pilotstills und der dekodierten Halbsekunden-Bildfolgen; Hand, Tisch, Monitorstand und Textüberlagerungen wurden dabei korrigiert.
- Browser: beide MP4s laden und spielen; Vorwärts-/Rückwärts-Seeking und Pause bestanden. Desktop und 390-Pixel-Mobilansicht ohne horizontalen Überlauf; keine geprüften Laufzeit- oder Assetfehler. Isoliertes Remotion Studio zeigt den Pilot. Siehe \`browser-check.json\` und \`qa/\`.
- ${freeze.checked} ursprüngliche getrackte Dateien bleiben unverändert, abgesehen von der ausdrücklich ausgenommenen, ergänzten \`.gitignore\`. Der vom Build erzeugte TypeScript-Cache wurde auf den Ausgangsstand zurückgesetzt. Content, Moment-Karten, alle bestehenden Bedienfunktionen und Präsentationszeiten bleiben bestehen. \`content-freeze.json\` dokumentiert den Vergleich; die V4-Integration in die interaktive Journey erfolgt erst nach Freigabe.
- \`.vercelignore\` unverändert. Renderdaten liegen in \`output/caleira-v4-pilot/\`, Arbeitsbundles und Backups in \`tmp/\`; beide Bereiche sind vom Deployment ausgeschlossen. Pilot und Fahrzeug zusammen sind deutlich unter 100 MB. Kein automatischer Commit, Push, Merge oder Deploy.

## Rendernachweis

Entry: \`video/v4/index.ts\`. Gemeinsame Modelle: \`video/v4/SoftWorld.tsx\`; Zeitfunktionen: \`timing.ts\`; Radgeometrie: \`wheels.ts\`; geprüfte Tisch-/Gerätepositionen: \`layout.ts\`. Diese Funktionen sind für die spätere interaktive Nutzung unabhängig von Remotion-Frame-Hooks aufgebaut.

| Datei | SHA-256 |
|---|---|
${p.renders.map(r=>`| ${r.file} | ${r.sha256} |`).join('\n')}

\`render-provenance.json\` enthält Renderbeginn, -ende, Basiscommit und SHA-256 der tatsächlich verwendeten Quellen und Audiodateien. \`media-check.json\` bestätigt deren Übereinstimmung mit dem aktuellen lokalen Stand. Reproduktion aus dem Workspace: \`scripts/v4-prepare.ps1 -Python <Python-mit-NumPy>\`, dann \`node scripts/v4-render.mjs films\`. Die vorhandenen WAVs werden dabei wiederverwendet. Für neue Sprachaufnahmen ist lokal Windows Katja erforderlich; neue Audio-Dauern sind vor dem nächsten Render mit der Timeline abzugleichen.

## Verbindlicher Stopp

Für das Weiterarbeiten ist die ausdrückliche visuelle Freigabe des Projektverantwortlichen erforderlich – für Figuren/Stil, Handlung und Prozessgrafik, Stimme/Taktung sowie Fahrzeugbewegung. Das ist das vom Auftrag verlangte Pilot-Gate. Bis dahin keine restlichen Kapitel, kein vollständiger Filmrender und kein Austausch der bisherigen Präsentation oder MP4.
`);
console.log('Report written with current render hashes.');


