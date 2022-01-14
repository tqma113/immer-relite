import { Action } from '../../src'

interface State {
  count: number
}

export const NOCHANGE: Action<State> = (state) => {
  return state
}

export const CHANGE: Action<State, number> = (state, count) => {
  return {
    ...state,
    count,
  }
}
