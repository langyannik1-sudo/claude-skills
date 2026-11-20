# Peitschen-Mann

Reiner Spaß-Mod für die Claude-Desktop-App. Braucht Claude für eine Aufgabe länger als 15 Sekunden,
läuft ein Strichmännchen mit Peitsche von links über den ganzen Bildschirm (als Hintergrund-Szene
hinter dem Chat) und „peitscht“ an vier Stellen, mit weichem „KLATSCH!“. Die Spinner-Zeile sagt
dazu „*klatsch!*“. Ist der Turn fertig, verschwindet er. Kein echter Nutzen, keine Wirkung auf Claude.

## Installieren

Im Terminal, an der Claude-Code-Eingabe:

```
/plugin install peitschen-mann --marketplace langyannik1-sudo/claude-skills
```

Aus der Shell:

```bash
claude plugin install peitschen-mann --marketplace langyannik1-sudo/claude-skills
```

In der Desktop-App (wo `/plugin` nicht läuft): auf **+** neben dem Eingabefeld, dann **Plugins**,
**Add marketplace** mit `langyannik1-sudo/claude-skills`, dann **Add plugin**.

## Im Browser (claude.ai) – Userscript

Der Browser zeichnet keine Mod-Oberflächen. Dafür gibt es ein Userscript, das dieselbe Szene
**über** die Seite legt, sobald Claude länger als 15 Sekunden arbeitet (erkannt am Stopp-Knopf).

1. In Chrome die Erweiterung **Tampermonkey** installieren.
2. Unter `chrome://extensions` bei Tampermonkey auf **Details** gehen und **Nutzerskripts zulassen**
   (bzw. oben rechts den **Entwicklermodus**) einschalten.
3. Diesen Link öffnen und auf **Installieren** klicken:
   <https://raw.githubusercontent.com/langyannik1-sudo/claude-skills/main/peitschen-mann/userscript/peitschen-mann.user.js>

Testen ohne zu warten: auf claude.ai **Alt+Shift+P** drücken, dann erscheint er sofort; nochmal
drücken blendet ihn aus.

Ändert claude.ai den Stopp-Knopf, erkennt das Skript die Arbeit nicht mehr. Dann in
`STOPP_KNOPF` oben im Skript ein neues Merkmal eintragen.
