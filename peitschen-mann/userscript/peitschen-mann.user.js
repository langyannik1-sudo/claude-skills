// ==UserScript==
// @name         Peitschen-Mann
// @namespace    https://github.com/langyannik1-sudo/claude-skills
// @version      0.1.0
// @description  Arbeitet Claude länger als 15 Sekunden, peitscht ein Strichmann über den Bildschirm. Nur Spaß.
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/langyannik1-sudo/claude-skills/main/peitschen-mann/userscript/peitschen-mann.user.js
// @updateURL    https://raw.githubusercontent.com/langyannik1-sudo/claude-skills/main/peitschen-mann/userscript/peitschen-mann.user.js
// ==/UserScript==

(function () {
  'use strict'

  const SCHWELLE_MS = 15000
  // Woran man erkennt, dass Claude gerade arbeitet: der Stopp-Knopf.
  // Ändert claude.ai die Seite, hier neue Merkmale eintragen.
  const STOPP_KNOPF = [
    'button[aria-label="Stop response"]',
    'button[aria-label*="stop" i]',
    'button[aria-label*="stopp" i]',
    'button[aria-label*="interrupt" i]',
    'button[data-testid*="stop" i]',
  ]
  const SZENE = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1600 900\" preserveAspectRatio=\"xMidYMid slice\">\n<style>\n  .mann { stroke: #2b2622; fill: none; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }\n  .kopf { fill: #f4ecdc; }\n  .peitsche { stroke: #7a4a22; stroke-width: 4; }\n  .wort { fill: #d97757; font-family: sans-serif; font-weight: 800; font-size: 54px; opacity: 0; }\n  @media (prefers-color-scheme: dark) {\n    .mann { stroke: #f0e7d7; }\n    .kopf { fill: #1f1a15; }\n    .peitsche { stroke: #e0a46b; }\n  }\n  .wandern { animation: lauf 12s ease-in-out infinite; }\n  .arm { transform-box: view-box; transform-origin: 0 0; animation: hieb 12s linear infinite; }\n  .bein1 { transform-box: view-box; transform-origin: 0 0; animation: schritt 0.6s ease-in-out infinite alternate; }\n  .bein2 { transform-box: view-box; transform-origin: 0 0; animation: schritt 0.6s ease-in-out infinite alternate-reverse; }\n  @keyframes schritt { from { transform: rotate(-18deg) } to { transform: rotate(18deg) } }\n  @keyframes lauf { 0% { transform: translate(-550px, 650px) } 10% { transform: translate(240px, 650px) } 22% { transform: translate(240px, 650px) } 32% { transform: translate(640px, 280px) } 44% { transform: translate(640px, 280px) } 54% { transform: translate(1040px, 620px) } 66% { transform: translate(1040px, 620px) } 76% { transform: translate(1400px, 320px) } 88% { transform: translate(1400px, 320px) } 100% { transform: translate(1800px, 320px) } }\n  @keyframes hieb { 0% { transform: rotate(-40deg) } 11% { transform: rotate(-40deg) } 15% { transform: rotate(35deg) } 16% { transform: rotate(-40deg) } 20% { transform: rotate(35deg) } 21% { transform: rotate(-40deg) } 33% { transform: rotate(-40deg) } 37% { transform: rotate(35deg) } 38% { transform: rotate(-40deg) } 42% { transform: rotate(35deg) } 43% { transform: rotate(-40deg) } 55% { transform: rotate(-40deg) } 59% { transform: rotate(35deg) } 60% { transform: rotate(-40deg) } 64% { transform: rotate(35deg) } 65% { transform: rotate(-40deg) } 77% { transform: rotate(-40deg) } 81% { transform: rotate(35deg) } 82% { transform: rotate(-40deg) } 86% { transform: rotate(35deg) } 87% { transform: rotate(-40deg) } 100% { transform: rotate(-40deg) } }\n  @keyframes k0 { 0% { opacity: 0 } 13% { opacity: 0 } 16% { opacity: 1 } 20% { opacity: 1 } 23% { opacity: 0 } 100% { opacity: 0 } }\n  .k0 { animation: k0 12s ease-in-out infinite; }\n@keyframes k1 { 0% { opacity: 0 } 35% { opacity: 0 } 38% { opacity: 1 } 42% { opacity: 1 } 45% { opacity: 0 } 100% { opacity: 0 } }\n  .k1 { animation: k1 12s ease-in-out infinite; }\n@keyframes k2 { 0% { opacity: 0 } 57% { opacity: 0 } 60% { opacity: 1 } 64% { opacity: 1 } 67% { opacity: 0 } 100% { opacity: 0 } }\n  .k2 { animation: k2 12s ease-in-out infinite; }\n@keyframes k3 { 0% { opacity: 0 } 79% { opacity: 0 } 82% { opacity: 1 } 86% { opacity: 1 } 89% { opacity: 0 } 100% { opacity: 0 } }\n  .k3 { animation: k3 12s ease-in-out infinite; }\n</style>\n<g class=\"wandern\" transform=\"translate(240 650)\">\n  <g class=\"mann\" transform=\"scale(1.5)\">\n    <g transform=\"translate(0 0)\"><line class=\"bein1\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"70\"/></g>\n    <g transform=\"translate(0 0)\"><line class=\"bein2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"70\"/></g>\n    <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-80\"/>\n    <line x1=\"0\" y1=\"-60\" x2=\"-35\" y2=\"-25\"/>\n    <g transform=\"translate(0 -60)\">\n      <g class=\"arm\">\n        <line x1=\"0\" y1=\"0\" x2=\"45\" y2=\"20\"/>\n        <path class=\"peitsche\" d=\"M45 20 C 100 -20, 150 30, 210 -30 S 280 -60, 310 -20\"/>\n      </g>\n    </g>\n    <circle class=\"kopf\" cx=\"0\" cy=\"-105\" r=\"25\"/>\n  </g>\n</g>\n<text class=\"wort k0\" x=\"540\" y=\"490\">KLATSCH!</text><text class=\"wort k1\" x=\"940\" y=\"120\">KLATSCH!</text><text class=\"wort k2\" x=\"620\" y=\"460\">KLATSCH!</text><text class=\"wort k3\" x=\"980\" y=\"160\">KLATSCH!</text>\n</svg>"

  let seit = null
  let test = false
  let buehne = null

  function arbeitet() {
    return STOPP_KNOPF.some(sel => {
      const el = document.querySelector(sel)
      return el !== null && el.offsetParent !== null
    })
  }

  function zeigen() {
    if (buehne !== null) return
    buehne = document.createElement('div')
    buehne.id = 'peitschen-mann'
    buehne.setAttribute('aria-hidden', 'true')
    buehne.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;pointer-events:none;'
    buehne.innerHTML = SZENE.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ')
    document.body.appendChild(buehne)
  }

  function weg() {
    if (buehne === null) return
    buehne.remove()
    buehne = null
  }

  function pruefen() {
    if (test) return
    if (arbeitet()) {
      if (seit === null) seit = Date.now()
      if (Date.now() - seit >= SCHWELLE_MS) zeigen()
    } else {
      seit = null
      weg()
    }
  }

  // Zum Ausprobieren: Alt+Shift+P zeigt ihn sofort, nochmal drücken blendet ihn aus.
  document.addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && e.code === 'KeyP') {
      test = !test
      if (test) zeigen()
      else { weg(); seit = null }
    }
  })

  setInterval(pruefen, 500)
})()
