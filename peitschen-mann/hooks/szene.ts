// Vollbild-Szene: Strichmann läuft von links rein und peitscht an vier Stellen.
// Ohne Animation (Bewegung reduzieren) steht er bei der ersten Stelle.

const STOPS = [
  [240, 650],
  [640, 280],
  [1040, 620],
  [1400, 320],
] as const

// Prozent der 12-s-Schleife, in denen er an Stopp i steht.
const HALT = [
  [10, 22],
  [32, 44],
  [54, 66],
  [76, 88],
] as const

function lauf(): string {
  const p = (x: number, y: number) => `transform: translate(${x}px, ${y}px)`
  const zeilen = [`0% { ${p(-550, 650)} }`]
  STOPS.forEach(([x, y], i) => {
    const [a, b] = HALT[i]!
    zeilen.push(`${a}% { ${p(x, y)} }`, `${b}% { ${p(x, y)} }`)
  })
  zeilen.push(`100% { ${p(1800, 320)} }`)
  return `@keyframes lauf { ${zeilen.join(' ')} }`
}

function hieb(): string {
  const zeilen = ['0% { transform: rotate(-40deg) }']
  HALT.forEach(([a]) => {
    // Zwei ruhige Hiebe pro Halt, je etwa 0,5 s hin und 0,5 s zurück.
    for (let k = 0; k < 2; k++) {
      const t = a + 1 + k * 5
      zeilen.push(`${t}% { transform: rotate(-40deg) }`, `${t + 4}% { transform: rotate(35deg) }`)
    }
    zeilen.push(`${a + 11}% { transform: rotate(-40deg) }`)
  })
  zeilen.push('100% { transform: rotate(-40deg) }')
  return `@keyframes hieb { ${zeilen.join(' ')} }`
}

function klatsch(i: number): string {
  const [a, b] = HALT[i]!
  return `@keyframes k${i} { 0% { opacity: 0 } ${a + 3}% { opacity: 0 } ${a + 6}% { opacity: 1 } ${b - 2}% { opacity: 1 } ${b + 1}% { opacity: 0 } 100% { opacity: 0 } }
  .k${i} { animation: k${i} 12s ease-in-out infinite; }`
}

const STIL = `
  .mann { stroke: #2b2622; fill: none; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }
  .kopf { fill: #f4ecdc; }
  .peitsche { stroke: #7a4a22; stroke-width: 4; }
  .wort { fill: #d97757; font-family: sans-serif; font-weight: 800; font-size: 54px; opacity: 0; }
  @media (prefers-color-scheme: dark) {
    .mann { stroke: #f0e7d7; }
    .kopf { fill: #1f1a15; }
    .peitsche { stroke: #e0a46b; }
  }
  .wandern { animation: lauf 12s ease-in-out infinite; }
  .arm { transform-box: view-box; transform-origin: 0 0; animation: hieb 12s linear infinite; }
  .bein1 { transform-box: view-box; transform-origin: 0 0; animation: schritt 0.6s ease-in-out infinite alternate; }
  .bein2 { transform-box: view-box; transform-origin: 0 0; animation: schritt 0.6s ease-in-out infinite alternate-reverse; }
  @keyframes schritt { from { transform: rotate(-18deg) } to { transform: rotate(18deg) } }
  ${lauf()}
  ${hieb()}
  ${[0, 1, 2, 3].map(klatsch).join('\n')}
`

const WORTE = STOPS.map(
  ([x, y], i) => `<text class="wort k${i}" x="${x < 900 ? x + 300 : x - 420}" y="${y - 160}">KLATSCH!</text>`,
).join('')

export const SZENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>${STIL}</style>
<g class="wandern" transform="translate(240 650)">
  <g class="mann" transform="scale(1.5)">
    <g transform="translate(0 0)"><line class="bein1" x1="0" y1="0" x2="0" y2="70"/></g>
    <g transform="translate(0 0)"><line class="bein2" x1="0" y1="0" x2="0" y2="70"/></g>
    <line x1="0" y1="0" x2="0" y2="-80"/>
    <line x1="0" y1="-60" x2="-35" y2="-25"/>
    <g transform="translate(0 -60)">
      <g class="arm">
        <line x1="0" y1="0" x2="45" y2="20"/>
        <path class="peitsche" d="M45 20 C 100 -20, 150 30, 210 -30 S 280 -60, 310 -20"/>
      </g>
    </g>
    <circle class="kopf" cx="0" cy="-105" r="25"/>
  </g>
</g>
${WORTE}
</svg>`

export const LEER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>`
