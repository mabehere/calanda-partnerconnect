# Assets und Herkunft · Creative Upgrade

Es wurden keine externen Modelle, Stockbilder, HDRIs, Texturen, Audios oder kostenpflichtigen Assets beschafft. Alle neuen Visuals werden lokal aus Code erzeugt. Keine Runtime-Abhängigkeit von einem Asset-Server.

| Asset | Herkunft / Rechte | Technik und Einsatz |
|---|---|---|
| Cutaway-Architektur, Fenster, Türen, Steinplatten, Träger, Leuchten | Eigene prozedurale Gestaltung | `ThreeWorld.tsx`, statisch nach Material gebündelte BufferGeometry; Browser und Film |
| Ofen, Gehäuse, Türprofil, Griff, Rauchrohr, Scheite | Eigene Weiterentwicklung des vorhandenen fiktiven Produktmodells | Abgerundete Geometrie, Zylinder, Metall-/Glasmaterialien; keine neuen Produkteigenschaften |
| Flammen | Eigener GLSL-Shader | Transparente Fläche; deterministische UV-/Zeitfunktion, keine Videotextur |
| Personen | Eigene prozedurale Figuren | Schulter-, Hüft- und Kniegelenke; kein externes Rig oder Animationsdownload |
| Fahrzeug, Arbeitsplätze, Regale, Verpackung, Pflanzen | Eigene prozedurale Gestaltung | Illustration bereits vorhandener Prozesse, keine neuen fachlichen Schritte |
| Umgebungslicht | `RoomEnvironment` aus der vorhandenen Three.js-Installation, MIT | Lokal berechnete PMREM-Umgebung; keine HDRI-Downloads |
| Favicon | Eigenes SVG in bestehender Flammen-/Kupferidentität | `public/favicon.svg` |
| Manrope 5.3.0 | Bestehendes `@fontsource/manrope`; SIL Open Font License 1.1 | `node_modules/@fontsource/manrope/LICENSE`, Copyright Manrope Project Authors |
| Bodoni Moda 5.3.0 | Bestehendes `@fontsource/bodoni-moda`; SIL Open Font License 1.1 | `node_modules/@fontsource/bodoni-moda/LICENSE`, Copyright Bodoni Moda Project Authors |
| Lucide-Icons | Bestehendes `lucide-react` | Unveränderte installierte Bibliothek/Lizenz; zusätzliche Mediensteuerungs-Icons |

Keine GLB-Dateien, Texturpakete oder Decoder hinzugefügt. Geometrien und Materialien sind Teil des lazy geladenen Journey-Moduls. Film unverändert 1920×1080, 30 fps, 2160 Frames. Kein Audio hinzugefügt.

Die Welt ist eine illustrative Architektur, keine Rekonstruktion tatsächlicher Caleira-Gebäude. Personen und Produkte behalten den bereits deklarierten fiktiven Charakter.

Technische Quellen: [Three.js RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html), [Remotion ThreeCanvas](https://www.remotion.dev/docs/three-canvas), [GSAP Context/Cleanup](https://gsap.com/docs/v3/GSAP/gsap.context()/). Bibliotheksversionen wurden nicht geändert.
