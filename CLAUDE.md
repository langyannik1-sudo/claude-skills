# Dauerhafte Notizen für Claude

Dieses Repo speichert alles, was ich (der Nutzer) Claude zum Herunterladen gegeben habe,
damit es in jeder neuen Sitzung wieder verfügbar ist.

## Vorlieben

- **Skills scannen:** Bevor ein weniger bekannter Skill installiert oder genutzt wird, frag mich,
  ob er mit SkillSpector (`sources/SkillSpector-main`) gescannt werden soll.
  Ausnahme: OmniRoute- und ponytail-Skills gelten als vertrauenswürdig und werden nicht gescannt.
- **Downloads merken:** Alles, was ich dir zum Herunterladen gebe, kommt in dieses Repo
  (Quellen nach `sources/`, Skills nach `.claude/skills/`) und wird unten in der Liste ergänzt.
  Dann committen und pushen.
- Antworte auf Deutsch.

## Heruntergeladen

| Name | Herkunft | Ort im Repo |
|---|---|---|
| SkillSpector | ZIP-Upload (NVIDIA, github.com/NVIDIA/skillspector) | `sources/SkillSpector-main` |
| FreeLLMAPI | ZIP-Upload | `sources/freellmapi-main` |
| ponytail | ZIP-Upload | `sources/ponytail-main`, Skills in `.claude/skills/ponytail*` |
| graphify (v8) | ZIP-Upload | `sources/graphify-8` |
| agentskills | ZIP-Upload | `sources/agentskills-main` |
| OmniRoute | https://github.com/cheaper-inference/OmniRoute.git | nur die Skills in `.claude/skills/` (`cli-*`, `omni-*`, `config-codex-cli`); Projekt bei Bedarf neu klonen |

## Einrichtung in einer neuen Sitzung

- Skills in `.claude/skills/` werden automatisch geladen, wenn dieses Repo die Sitzung ist.
- SkillSpector installieren: `cd sources/SkillSpector-main && uv sync --python 3.13 --all-extras`
- OmniRoute komplett: `git clone https://github.com/cheaper-inference/OmniRoute.git`
