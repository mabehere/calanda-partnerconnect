# Architektur und Datenverantwortung

## System of Record

ERP: Produkte, Preise, Partnerstammdaten, Bestellungen. CRM: Leads, Chancen, Aktivitäten, Zuständigkeiten, Interaktionen, Tickets. Portal: spätere authentifizierte Oberfläche, keine eigene Stammdatenhoheit. Bestehende Website: einsprachig; Erweiterungen später.

## Integrationsvertrag – im Projekt zu verifizieren

1. M1/M2: vorhandene ERP-Schnittstellen, Exportverfahren, Lizenzkosten, Testmandant, Rate Limits und Verantwortliche abklären. Keine API-Verfügbarkeit voraussetzen.
2. Nachricht: Transaktionskennung, Quellsystem, Quellreferenz, Zeitstempel, Schema-Version, Payload und Prüfstatus.
3. Eingangsvalidierung und Partnerreferenzprüfung. Normalisierte E-Mail als einfacher Demo-Dublettenhinweis; produktiv zusätzlich Unternehmensidentität prüfen, unklare Treffer manuell entscheiden.
4. ERP-Schreibvorgänge nur über autorisierte Integrationsrolle. Für R4 Idempotenzschlüssel serverseitig dauerhaft speichern, atomare Annahme, erneute Zustellung mit identischem Resultat. Lokales Demo-Array beweist die Logik, keine verteilte Transaktionssicherheit.
5. Wiederholbare Verbindungsfehler mit begrenztem Backoff; fachliche Fehler in Fehlerliste, kein blindes Wiederholen. Alarm und Verantwortliche nach SLA.
6. Sync-Log mit Status, Versuch, Fehlercode, Referenz und Zeit. Keine Passwörter oder vollständigen sensiblen Inhalte ins Log. Abgleichberichte und Wiederanlauf testen.

## Rollenmodell

- Vertrieb: Leads und Aktivitäten seines Zuständigkeitsbereichs; standortübergreifende Vertretung explizit vergeben.
- Service: Tickets, benötigte Partner- und Bestellreferenzen; keine freie Preisänderung.
- Partner: ausschliesslich eigene Bestellungen und autorisierte Preise; jede Anfrage serverseitig prüfen.
- Integration: minimale technische Rechte, getrennte Credentials und Audit.
- Administration: Konfiguration; Änderungen protokollieren.

## Datenqualität und Betrieb

Data Owner definiert Pflichtfelder, Dublettenentscheidung und Aufbewahrungsregeln. Migration zunächst Testlauf mit Stichproben und Referenzabgleich. Backups, Restore, Monitoring, Rechteentzug und Fehlermeldungen vor Abnahme testen. Datenschutz, Löschfristen, rechtliche Versandgrundlagen und Verarbeitungsverträge fachlich prüfen; diese Demo stellt keine Rechtsberatung oder Rechtskonformitätszusage dar.
