import { expect, mock, test } from 'claude-code/testing'

// Die Tests lesen den Zustand mit: jede Schreibung von `peitscht` landet hier.
let zuletzt = false
let langsam: (() => Promise<void>) | undefined
async function peitscht(_: unknown): Promise<boolean> {
  return zuletzt
}

function engine(on: any) {
  zuletzt = false
  langsam = undefined
  on('state.set', { plugin: 'peitschen-mann' }, ($: any, e: any, next: any) => {
    zuletzt = e.key === 'peitscht' ? e.value === true : e.value?.value?.peitscht === true
    return next(e)
  })
  on('state.get', { plugin: 'peitschen-mann' }, async ($: any, e: any, next: any) => {
    const warte = langsam
    langsam = undefined
    const gelesen = await next(e)
    // Der Wert ist gelesen; die Antwort kommt erst später an.
    if (warte !== undefined) {
      await warte()
    }
    return gelesen
  })
  on('turn.start', (_: any, e: any) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
}

const ende = (turnId: string, extra: object = {}) => ({
  turnId, answer: '', durationMs: 0, isAborted: false, reason: 'answer' as const, ...extra,
})

test('nach 15 s peitscht er', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.settle()
  await clock.advance(14999)
  expect(await peitscht($)).toBe(false)
  await clock.advance(1)
  expect(await peitscht($)).toBe(true)
})

test('kurzer Turn: nie', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(5000)
  await $.turn.complete(ende('t1'))
  await clock.advance(20000)
  expect(await peitscht($)).toBe(false)
})

test('Ende räumt auf, auch abgebrochen', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(16000)
  expect(await peitscht($)).toBe(true)
  await $.turn.complete(ende('t1', { reason: 'aborted', isAborted: true }))
  expect(await peitscht($)).toBe(false)
})

test('Subagent ignoriert', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(1000)
  await $.turn.start({ text: 'sub', turnId: 's1', agentId: 'a1' })
  await $.turn.complete(ende('s1', { agentId: 'a1' }))
  await clock.advance(15000)
  expect(await peitscht($)).toBe(true)
})

const BACKDROP = {
  plugin: 'peitschen-mann',
  component: 'Backdrop',
  requestId: 'bd',
  props: { scene: 'peitsche', plugin: 'peitschen-mann', glass: false },
} as const

test('Backdrop: leer, dann Strichmann', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  const ui = await $.ui.mount({ ...BACKDROP, surface: 'desktop' })
  expect(((await ui.find({ type: 'Svg' })) as any)?.props?.alt).toBe('leer')
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(15000)
  expect(((await ui.find({ type: 'Svg' })) as any)?.props?.alt).toMatch(/Strichmann/)
  await ui.unmount()
})

test('Backdrop: andere Oberfläche bleibt Engine', async ($, on) => {
  engine(on)
  on('ui.render', ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })
  const ui = await $.ui.mount({ ...BACKDROP, surface: 'mobile' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

const SPINNER = {
  plugin: 'peitschen-mann',
  component: 'Spinner',
  props: { word: 'Arbeiten', message: null, suffix: '…', mode: 'thinking' },
} as const

test('Spinner sagt klatsch, nur beim Peitschen', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  on('ui.render', { component: 'Spinner' }, ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)
    return <Text>{`${e.props.word}${e.props.suffix}`}</Text>
  })
  let ui = await $.ui.mount({ ...SPINNER, surface: 'desktop' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('Arbeiten…')
  await ui.unmount()
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(15000)
  ui = await $.ui.mount({ ...SPINNER, surface: 'desktop' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('Arbeiten… *klatsch!*')
  await ui.unmount()
})

test('Wettlauf: Turn endet genau beim Timer', async ($, on) => {
  const clock = mock.clock(on)
  engine(on)
  void $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(14999)
  // Der Timer liest gleich den Zustand; dieses Lesen kommt spät an.
  langsam = () => clock.sleep(10)
  await clock.advance(1)
  await $.turn.complete(ende('t1'))
  await clock.advance(20)
  expect(await peitscht($)).toBe(false)
})
