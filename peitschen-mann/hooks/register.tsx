import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Zustand } from '../types'
import { LEER, SZENE } from './szene'

// Nur Spaß: kein Hook hier ändert, was Claude tut.
export const SCHWELLE_MS = 15000

const AUS: Zustand = { turn: null, peitscht: false }
// Turn und Peitschen in einem Wert, damit Prüfen und Schreiben zusammen passieren.
const zustand = atom({ plugin: 'peitschen-mann', key: 'zustand' } as const, AUS, {
  shape: 'zustand-1',
})

async function peitschtGerade($: Parameters<typeof read>[0]): Promise<boolean> {
  return (await read($, zustand)).peitscht
}

export const register: Register = on => {
  // Modulvariable: nach einem Reload weg, darum prüft der Timer zusätzlich `turn`.
  let timer: { cancel: () => void } | undefined

  on('session.start', async ($, e, next) => {
    // Ohne Desktop-Client wird nichts gemalt; still bleiben, keine Statuszeile.
    await $.theme.set({
      backdrop: { scene: 'peitsche', glass: { blur: 6, opacity: 0.35 } },
    })

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (
      e.surface !== 'desktop' ||
      e.props.scene !== 'peitsche' ||
      e.props.plugin !== 'peitschen-mann'
    ) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return (await peitschtGerade($)) ? (
      <Svg source={SZENE} alt="Ein Strichmann peitscht Claude quer über den Bildschirm" isInteractive />
    ) : (
      <Svg source={LEER} alt="leer" isInteractive />
    )
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'desktop' || !(await peitschtGerade($))) {
      return next(e)
    }
    const text = e.props.message ?? e.props.word
    const punkte = text.endsWith('…') ? '' : '…'

    return next({ ...e, props: { ...e.props, suffix: `${punkte} *klatsch!*` } })
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId !== undefined) {
      return next(e)
    }
    timer?.cancel()
    await update($, zustand, () => ({ turn: e.turnId, peitscht: false }))
    timer = $.clock.after(SCHWELLE_MS, () => {
      update($, zustand, z => (z.turn === e.turnId ? { ...z, peitscht: true } : z)).catch(
        () => undefined,
      )
    })

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      timer?.cancel()
      timer = undefined
      await update($, zustand, () => AUS)
    }

    return next(e)
  })
}
