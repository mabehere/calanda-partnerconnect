# Bewertungsabdeckung – überprüfbarer Arbeitsstand

**Quellenblocker:** `docs/FHGR - Pitch Case.pdf` und `docs/FHGR - Bewertungsraster Pitch 2026.xlsx` fehlen. Die untenstehenden 20 IDs und Bezeichnungen stammen aus dem Nutzerauftrag. Exakte 5-Punkte-Leistungsanker dürfen nicht erfunden werden. Keine garantierte Punktzahl oder vollständige Originalkonformität.

| ID | Kriterium | Originaler 5-Punkte-Anker | Szene | Demo / Nachweisaktion | Zusatznachweis | Status |
|---|---|---|---|---|---|---|
| R1 | Partnerübersicht | OFFEN – Original-XLSX fehlt | 08 | Register Übersicht, Bestellungen, Service und Historie öffnen | src/components/Partner.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R2 | Lead und Verkaufschance | OFFEN – Original-XLSX fehlt | 07 | Anfrage, Dublette, Qualifikation, Vertretung, Chance und ERP-Freigabe | src/components/Demos.tsx; src/lib/demo.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R3 | Marketing Journey | OFFEN – Original-XLSX fehlt | 11 | Berechtigung ändern, Bestellung simulieren, Abmeldung prüfen | src/components/Details.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R4 | B2B-Bestellung | OFFEN – Original-XLSX fehlt | 09 | Login, vier Öfen, Fehler, Retry, Doppelprüfung, Versand | src/components/Demos.tsx; tests/pitch.spec.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R5 | Serviceprozess | OFFEN – Original-XLSX fehlt | 10 | Foto-Rückfrage, Ergänzung, Zuweisung, Eskalation, Lösung und Abschluss | src/components/Demos.tsx; src/lib/demo.test.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R6 | Website und Inhalte | OFFEN – Original-XLSX fehlt | 12 | Zielgruppe wechseln, Fachpartner finden, Content ändern | src/components/Details.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R7 | Systeme und Daten | OFFEN – Original-XLSX fehlt | 06, 09, 13 | ERP und Integrationsschicht anklicken; sichere Wiederholung | docs/architecture.md; src/components/Details.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| R8 | KI-Entscheid | OFFEN – Original-XLSX fehlt | 14 | Regel und Vorschlag vergleichen; manuell bestätigen; Pilot-Gates | src/components/Details.tsx; docs/assumptions.md | Implementierungsnachweis vorhanden; Originalabgleich offen |
| V1 | Problemverständnis | OFFEN – Original-XLSX fehlt | 02, 03, 05 | Case-Ausgangswerte und Informationsbrüche erläutern | docs/case-facts.md; src/data/case.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| V2 | Nutzenlogik | OFFEN – Original-XLSX fehlt | 05, 15, 16 | MVP und Portal trennen, Kapazität und Einsparung unterscheiden | src/lib/business.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| V3 | Messung und Rechnung | OFFEN – Original-XLSX fehlt | 03, 15, 16 | 96 Stunden reproduzieren, Parameter ändern, Methodik öffnen | src/lib/business.test.ts | Implementierungsnachweis vorhanden; Originalabgleich offen |
| V4 | Pitch-Story | OFFEN – Original-XLSX fehlt | 01, 04, 19 | Marco-Hook, Journey, Abschluss und Entscheidungsantrag | src/content/scenes.ts; video/root.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| M1 | MVP und Priorisierung | OFFEN – Original-XLSX fehlt | 06, 17 | R1/R2/R5/R7 im MVP; spätere Stufen begründen | docs/requirements-matrix.md | Implementierungsnachweis vorhanden; Originalabgleich offen |
| M2 | Meilensteine und Entscheidungen | OFFEN – Original-XLSX fehlt | 15, 17 | Monats-Gates mit Rollen und Vorgehen bei Nichterreichen | src/components/Details.tsx | Implementierungsnachweis vorhanden; Originalabgleich offen |
| P1 | Zusammenarbeit und Einführung | OFFEN – Original-XLSX fehlt | 17, 18 | Rollen und Einführung öffnen; Aufwand und Betrieb erläutern | docs/operating-model.md | Implementierungsnachweis vorhanden; Originalabgleich offen |
| P2 | Kosten und Risiken | OFFEN – Original-XLSX fehlt | 18 | Kosten und Risikomatrix; drei Risikodetails | src/data/case.ts; docs/risks.md | Implementierungsnachweis vorhanden; Originalabgleich offen |
| A1 | Verständlichkeit und Medien | OFFEN – Original-XLSX fehlt | 01–19 | 19 Szenen, 3D, Film, PDF, reduzierte Bewegung | README.md; output/screenshots/ | Implementierungsnachweis vorhanden; Originalabgleich offen |
| A2 | Teamkoordination | OFFEN – Original-XLSX fehlt | 07, 09, 10, alle | Moderationsrollen und Demo-Übergaben proben | docs/presenter-script.md | Ablauf vorbereitet; reale Teamprobe offen |
| A3 | Kundenorientierung | OFFEN – Original-XLSX fehlt | 02, 16, 19 | Annahmen live diskutieren und Freigabebedingungen erfragen | docs/qa-preparation.md | Implementierungsnachweis vorhanden; Originalabgleich offen |
| A4 | Fragen und Einwände | OFFEN – Original-XLSX fehlt | 19 + Anhang | 15 Minuten Diskussion anhand vorbereiteter Fragen | docs/qa-preparation.md | Antworten vorbereitet; Live-Leistung offen |

Abschlussbedingung: Originaldateien vollständig (PDF-Seiten, alle XLSX-Blätter inklusive ausgeblendeter Blätter, Formeln und Leistungsanker) prüfen, Faktenkonflikte auflösen und jeden Anker anhand des vorhandenen Nachweises einzeln abnehmen. Das ist ohne die Dateien nicht erledigt.
