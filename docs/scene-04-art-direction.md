# Scene 04 · Architektur der Beziehung

Die freigegebene Reihenfolge bleibt Showroom → Vertrieb → Werkstatt → Logistik → Service → Partnernetz. Die Welt ist eine illustrative Cutaway-Modellarchitektur, kein behaupteter realer Standortgrundriss.

Materialkonzept: warmer Kalkstein, geräuchertes Holz, anthrazitfarbenes Metall, getöntes Glas, zurückhaltende kupferne Orientierung. Bestehendes dunkles Grün bleibt Bühnenhintergrund. Keine neuen Produktvarianten, Prozessschritte oder Unternehmensfakten.

Eine gemeinsame Sockelplatte, durchgehende Erschliessung und wiederkehrende Fassadenprofile verbinden sechs unterschiedlich eingerichtete Räume. Fensterrahmen, Türen, Leuchten, Arbeitsplätze, Regale und Ladeflächen geben Massstab. Eigene prozedurale Modelle halten alle Assets lokal.

Kamerakonzept: Showroom-Reveal, mittlere Vertriebseinstellung, Werkbank-Dolly, Logistik-Truck, Service-Nähe, abschliessender Overview. Je Kapitel zwölf Sekunden. Kontrollierte kubische Interpolation, keine freien zufälligen Orbits. Explore übergibt die Kamera explizit an OrbitControls.

Motion-Spec: Aktives Kapitel ist die erste Wahrnehmung; Moment-Karte und Kurve bleiben ruhige Bezugspunkte. Gemeinsame Kapitelzeit steuert Bewegungen. Gangzyklen werden an Wegstrecke gekoppelt; Arbeitshaltungen wechseln nur in dafür vorgesehenen Phasen. Pause hält die Zeit an, Kapitelwahl setzt sie zurück, Replay beginnt denselben Shot erneut. Verdeckte Tabs pausieren. Reduced Motion zeigt definierte statische Einstellungen mit sämtlichen Inhalten.

DOM-Reveals: 200–650 ms, kleine Wege, GSAP-Kontext mit Cleanup; Motion besitzt ausschliesslich den äusseren Szenenwechsel. Keine numerische Interpolation fachlicher Ergebnisse. Kamera/3D verwenden Refs, Film den Remotion-Frame. Niedrige Qualität reduziert DPR und Schatten, ohne Inhalte zu entfernen.

Prüfung: gleiche Shots bei beiden Zielauflösungen, schnelle Kapitelwechsel, Pause/Replay, Explore, Vorher/Nachher, alle Demo-Links, Reduced Motion, alle Filmkapitel und Schnittgrenzen. Statische Bildqualität vor Effekten; kein Bloom/DOF als Ersatz für Modellqualität.
