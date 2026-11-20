export type Zustand = { turn: string | null; peitscht: boolean }

declare module 'claude-code' {
  interface PluginState {
    'peitschen-mann': { zustand: Shaped<Zustand> }
  }
}
