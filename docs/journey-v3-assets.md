# Cinematic Journey V3 · Asset-Provenienz

Kostenlose Assets, lokal gespeichert. Keine Käufe, keine neuen Runtime-Bibliotheken. Stand der Quellenprüfung: 17.11.2026.

| Datei | Urheber und Originalpaket | Rechte / Bearbeitung |
|---|---|---|
| `public/assets/journey-v3/marco.glb` | Quaternius, [Ultimate Modular Men](https://quaternius.com/packs/ultimatemodularcharacters.html), Casual_2.gltf | Ältere CC0-Ausgabe. Eigenes GLB-Packing, relevante Animationsclips, Kleidungsfarben zur Laufzeit. |
| `public/assets/journey-v3/worker.glb` | Gleiches Paket, Worker.gltf | Gleiche Lizenz, Skeleton/Vertexdaten erhalten. |
| `public/assets/journey-v3/truck.glb` | Quaternius, [Zombie Apocalypse Kit](https://quaternius.com/packs/zombieapocalypsekit.html), Vehicle_Truck.gltf | Ältere CC0-Ausgabe; ausschliesslich ziviles Fahrzeug. |
| `wood-Diffuse.jpg`, `wood-nor_gl.jpg`, `wood-Rough.jpg` | Dimitrios Savva, [Wood Floor Deck / Poly Haven](https://polyhaven.com/a/wood_floor_deck) | [CC0](https://polyhaven.com/license), 1K-JPEG-PBR-Maps, lokal. Base Color sRGB, Normal/Roughness Datenmaps. |

Die Herstellerseite verweist bei den älteren Quaternius-Paketen auf einen Google-Drive-Ordner. Einzeldateien wurden aus dem öffentlichen [Archiv agentkaerf/FreeModels](https://github.com/agentkaerf/FreeModels) bezogen, fixiert auf Commit `db3df04d1e4714298a09510b26fb6de6645138a2`. Originale Paket-Lizenztexte werden unter `public/assets/journey-v3/Quaternius-License.txt` und `Quaternius-Vehicles-License.txt` unverändert mitgeführt. Der Fahrzeug-Lizenztext trägt einen offenbar übernommenen Paketnamen „Ultimate Platformer Pack“; die konkrete Herstellerseite nennt für das Fahrzeugpaket ebenfalls CC0. Die Lizenzprüfung bezieht sich auf diese ältere archivierte Ausgabe, nicht pauschal auf sämtliche aktuellen Quaternius-Angebote.

Die Ausgangs-glTFs bleiben als Arbeitsdateien in `tmp/journey-v3-assets/`; die Anwendung lädt nur die GLBs. `scripts/journey-v3-assets.mjs` reproduziert das Packing. `manifest.json` dokumentiert Dateigrössen, Dreieckszahlen, Bounds und Clipdauern. Keine Draco-/KTX-Decoder und keine externen Laufzeit-URLs nötig.

Kenney Animated Characters 2 wurde geprüft; die frühere Hersteller-URL lieferte 404. Quaternius Universal Base Characters wurde geprüft, aber zugunsten bereits bekleideter, animierter Figuren nicht verwendet. Eine zusätzliche HDRI wurde zugunsten des bestehenden lokalen RoomEnvironment und gezielter Szenenbeleuchtung verworfen. Ein generischer externer Ofen würde die Produktdarstellung weniger konsistent machen; das vorhandene eigene Modell wird gezielt verbessert.

Die vorhandenen Manrope-/Bodoni-Schriften, Lucide-Icons und Three.js-RoomEnvironment behalten ihre im früheren Asset-Bericht dokumentierte Herkunft. Es gibt keine neuen Audioassets. Die vorhandene Remotion-Version bleibt unverändert; [deren Lizenzbedingungen](https://www.remotion.dev/pricing) wurden konsultiert. Es wurde keine kostenpflichtige Lizenz beschafft oder ein unbekannter Lizenzstatus als bestätigt dargestellt.
