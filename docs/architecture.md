# Systeme und Daten

## Führende Systeme

| Daten | Führend | Salesforce | Richtung |
|---|---|---|---|
| Produkte, Preise | ERP | liest (ab Stufe 3 im Portal) | ERP → Salesforce |
| Partnerstammdaten | ERP | liest; Änderungen als Auftrag ans ERP | ERP → Salesforce |
| Bestellungen und Status | ERP | liest; schreibt ab Stufe 3 über das Portal | ERP ↔ Salesforce |
| Leads, Verkaufschancen, Aktivitäten | Salesforce (Sales Cloud) | führt | Freigabe → ERP legt Partner an |
| Kontakte und Einwilligungen | Salesforce | führt | – |
| Cases, Assets, Fristen | Salesforce (Service Cloud) | führt | Bestellreferenz aus ERP |

## Schnittstelle

- Monat 2: Schnittstellen, Exportwege, Testmandant und Kosten des ERP klären. Erst danach wird gebaut.
- Jede Übertragung trägt Kennung, Quelle, Zeitstempel und Status. Fehler landen in einer Liste mit zuständiger Person. Verbindungsfehler werden begrenzt wiederholt, fachliche Fehler nicht.
- Für das Portal (Stufe 3): Die Kennung wird serverseitig gespeichert, eine wiederholte Übertragung erzeugt keine zweite Bestellung.

## Rechte

Vertrieb: eigene Partner und Leads, Vertretung wird ausdrücklich vergeben. Service: Cases mit Partner- und Bestellreferenz, keine Preise. Partner (ab Stufe 3): nur eigene Daten und Preise, geprüft bei jedem Zugriff. Integration: eigener technischer Nutzer mit minimalen Rechten. Administration: Änderungen werden protokolliert.

## Datenqualität

Eine verantwortliche Person beim Kunden legt Pflichtfelder fest und entscheidet über Dubletten. Regel: ERP-Partnernummer und normalisierte E-Mail-Adresse; unklare Treffer werden von Hand entschieden. Die Migration läuft zuerst als Test mit Stichprobe. Datenschutz, Aufbewahrung und Versandgrundlagen prüft der Kunde mit seiner Rechtsberatung.
