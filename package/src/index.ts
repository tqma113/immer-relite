import produce, { isDraft, isDraftable } from 'immer'
import type { Draft } from 'immer'
/**
 * Copyright Lucifier129 and other contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/Front-End-Resort/relite/blob/master/LICENSE
 *
 */

/**
 * relite
 *
 * A redux-like library for managing state with simpler api.
 */

/**
 * Get the Object.keys() as keyof inputed unknown.
 *
 * @template T The typeof inputed unknown.
 *
 * @param o A value extends unknown.
 *
 * @returns Object.keys(o) with type keyof T.
 */
export const getKeys = <T extends Record<string, unknown>>(o: T) =>
  Object.keys(o) as Array<keyof T>

/** Action */

/**
 * A function looks like a reducer of redux, but more simple and powerful.
 *
 * An `Action` consist of `Action` type, `Action` payload, `Action` handler
 * and `Action` result. `Action` type is the identifier of this function.
 * `Action` handler is the body of this function. `Action` result is the
 * result of function.
 *
 * In each `Action`, change the attribute needed and retain another attribute.
 * Suggest to use `...state` accomplish it.
 *
 * @template S The type of state to be held by the store.
 * @template P The type of `Payload` that used to change the state as a assist.
 * @template RS The type of state that the action returns.
 *
 * @param state A snapshoot of current state. Will create new state based
 * on it.
 * @param [payload] Some useful data help to create new state. So we can
 * set it optionally.
 *
 * @returns A new state created just now.
 */
export interface AnyAction<
  S extends unknown = Record<string, unknown>,
  P = unknown
> {
  (state: Draft<S>, payload: P): S | Draft<S> | void
}

/**
 * The collection of `Action`.
 *
 * @template S The type of state to be held by the store.
 */
export type Actions<S extends unknown> = Record<string, AnyAction<S, any>>

/**
 * Get the rest arguments of action.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`. It will be map to the actions
 * that store will export.
 * @template A The type of action which need to infer arguments.
 */

export type Args<S extends unknown, A extends AnyAction<S>> = A extends (
  state: Draft<S>,
  ...args: infer Args
) => S | Draft<S> | void
  ? Args
  : never

/**
 * In Relite, before actions exported by `store` them must be currying from input
 * `Action` to a function that looks like `(p?: Payload) => State` firstly.
 *
 * The actions consist of `Action` need map to the actions consist of currying action.
 *
 * The code hint of actions and the `Payload` type hint will work after doing this.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`. It will be map to the actions
 * that store will export.
 */
export type Curring<S extends unknown, A extends AnyAction<S>> = A extends (
  state: S,
  ...args: infer Args
) => S | Draft<S> | void
  ? (...args: Args) => void
  : () => void

/**
 * The cyrring `Actions`. Each `Action` in this will be optional.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`. It will be map to the actions
 * that store will export.
 */
export type Currings<S extends unknown, AS extends Actions<S>> = {
  [k in keyof AS]: Curring<S, AS[k]>
}

/**
 * Infer the `Payload` data shape from an `Action`.
 *
 * @template A The type of `Action` which we want to infer from.
 */
export type PayloadFromAction<A> = A extends AnyAction<any, infer P> ? P : A

/** Data */

/**
 * A unknown that record all information of once change of state.
 *
 * It will be used when state will change while `dispatch()` or
 * `replaceState()` been called.
 *
 * @template S The type of state to be held by the store.
 */
export interface Data<S extends unknown, AS extends Actions<S>> {
  /**
   * The identifier `actionType` of `Action` of this change.
   */
  actionType: keyof AS

  /**
   * The additional `Payload` data of a change from the `Action` of this
   * change.
   */
  actionPayload: PayloadFromAction<AnyAction<S, any>>

  /**
   * The snapshoot of state before this change. The state that passed into
   * `Action`.
   */
  previousState: S
  /**
   * The state will be after this change. The state that returned from
   * `Action`.
   */
  currentState: S
  /**
   * The start time of this change occur.
   */
  start: Date
  /**
   * The finished time of this change occur.
   */
  end: Date
}

/** Store */

/**
 * An addit of store to add listener which listen the state change.
 *
 * @template S The type of state to be held by the store.
 */
export interface Subscribe<S extends unknown, AS extends Actions<S>> {
  (listener: Listener<S, AS>): () => void
}

/**
 * An callback will been called when state has changed which has been add by
 * `subscribe()`. The state change information, `Data`, will been passed in
 * when call it.
 *
 * @template S The type of state to be held by the store.
 *
 * @param [data] The data unknown that record the change of once `Action` has
 * been called by `dispatch()`.
 */
export interface Listener<S extends unknown, AS extends Actions<S>> {
  (data: Data<S, AS>): unknown
}

/**
 * An broadcast function which will call all listener added before. The
 * parameter `Data` passed into listener is it's parameter `Data`. So we
 * do not know if this `Data` really occur.
 *
 * @template S The type of state to be held by the store.
 */
export interface Publish<S extends unknown, AS extends Actions<S>> {
  (data: Data<S, AS>): void
}

/**
 * A setter of state which recover previous state forcedly. It may make
 * the state change uncertainly.
 *
 * @template S The type of state to be held by the store.
 */
export interface ReplaceState<S extends unknown, AS extends Actions<S>> {
  (nextState: S, data: Data<S, AS>, silent?: boolean): void
}

/**
 * A dispatcher that construct a new `Data` which record information of
 * new change of state by calling `Action` and call `updateState()` to
 * change state predictably.
 *
 * @template S The type of state to be held by the store.
 */
export type Dispatch<S extends unknown, AS extends Actions<S>> = <
  K extends keyof AS
>(
  actionType: K,
  ...args: Args<S, AS[K]>
) => S | Draft<S> | void

/**
 * An state updator which get the final next state and call `replaceState()`
 * to change state.
 *
 * @template S The type of state to be held by the store.
 *
 * @param nextState all type which `Action` may return a state.
 *
 * @returns The next state unknown.
 */
export interface StateUpdator<S extends unknown> {
  (nextState: S): S
}

/**
 * An unknown which export all API for change `state` and attach listener.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`.
 */
export interface Store<S extends unknown, AS extends Actions<S>> {
  /**
   * Contain all caller curring from `Action` passed in `createStore` and
   * `dispatch`. Could call dispatch whith mapped `Action` type.
   *
   * CurryingAction
   */
  actions: Currings<S, AS>

  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application that just can read.
   */
  getState: () => S

  /**
   * Cover the state with the new state and the data passed in. It will
   * change the state unpredictably called by user directly.
   *
   * @param nextState It could be a state `unknown` will be the next state.
   * @param [data] The unknown that record al information of current change.
   * @param [silent] The signature indicate if we need to `publish()`. `true`
   * indicate not. `false` indicate yes. Default value is `false`.
   */
  replaceState: ReplaceState<S, AS>
  /**
   * Dispatches an Action. It is the only way to trigger a state change.
   *
   *
   * The base implementation only supports plain unknown actions. If you want
   * to dispatch a Promise, you need pass in a Promise `Action`.
   *
   * @param actionType A plain string that is the identifier of an `Action`
   * which representing “what changed”. It is a good idea to keep actions
   * serializable so you can record and replay user sessions, or use the time
   * travelling `redux-devtools`. It is a requirement to use string constants
   * for Action types.
   * @param [actionPayload] Some useful data help to create new `state`. So
   * we can set it optionally.
   *
   * @returns For convenience, the next state unknown you changed to.
   */
  dispatch: Dispatch<S, AS>

  /**
   * Adds a change listener. It will be called any time an Action is
   * dispatched, and some part of the state tree may potentially have changed.
   * You may then call `getState()` to read the current state tree inside the
   * callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked,
   * this will not have any effect on the `dispatch()` that is currently in
   * progress. However, the next `dispatch()` call, whether nested or not,
   * will use a more recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all states changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param listener A callback to be invoked on every dispatch.
   *
   * @returns `unsubscribe` A function to remove this listener.
   */
  subscribe: Subscribe<S, AS>

  /**
   * Broadcast all the listener attached before.
   *
   * @param data The state change information.The data unknown that need to
   * pass in all `Listener`.
   */
  publish: Publish<S, AS>

  /**
   * The name for display at Redux Dev Tools.
   */
  name?: string;
}

/**
 * A *StoreCreator* can create a global Relite store that hold the state tree,
 * state, and also create getter and setter, `dispatch` and currying `actions`,
 * of it with `actions` and initialState. It support subscribe changes of state
 * implements with Observer design pattern.
 *
 * `createStore(reducer, preloadedState)` exported from the Relite package,
 * from store creators.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions those may be call by dispatch.
 */
export interface StoreCreator {
  <S extends unknown, AS extends Actions<S>>(
    actions: AS,
    initialState: S,
    name?: string
  ): Store<S, AS>
}

/** CreateStore */

/**
 * Create a global Relite store that hold the state tree, state, and also export
 * getter and setter, `dispatch` and `actions`,of it with `actions` and
 * initialState. It support subscribe changes of state implements with Observer
 * design pattern.
 *
 * @param actions An unknown who contains all the actions those can create state
 * and return it through passed previous state and `Payload` data.
 * @param [initialState] The initial state. You may optionally specify it.
 *
 * @returns A Relite store that lets you read the state, dispatch actions and
 * subscribe to changes. It contains the setter of state, `replaceState`,
 * `dispatch` and all the `actions` whose have been encapsulated  with function
 * currying, the getter of state, `getState`, and the subscribe API,
 * `subscribe` and `publish`.
 */
export const createStore: StoreCreator = <
  S extends unknown,
  AS extends Actions<S>
>(
  actions: AS,
  initialState: S,
  name?: string
) => {
  const listeners: Listener<S, AS>[] = []
  const subscribe: Subscribe<S, AS> = (listener: Listener<S, AS>) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      } else {
        console.warn(
          'You want to unsubscribe a nonexistent listener. Maybe you had unsubscribed it'
        )
      }
    }
  }

  const publish: Publish<S, AS> = (data) => {
    listeners.forEach((listener) => listener(data))
  }

  let currentState: S = produce(initialState, () => {})

  const getState = () => currentState
  const replaceState: ReplaceState<S, AS> = (nextState, data, silent) => {
    currentState = nextState
    if (!silent) {
      publish(data)
    }
  }

  let isDispatching = false
  const dispatch: Dispatch<S, AS> = (actionType, actionPayload) => {
    if (isDispatching) {
      throw new Error(
        `store.dispatch(actionType, actionPayload): handler may not dispatch`
      )
    }

    const start: Date = new Date()
    let nextState: S = currentState
    try {
      isDispatching = true
      if (isDraft(currentState)) {
        const draft = currentState as Draft<S> // We can assume this is already a draft
        const result = actions[actionType](draft, actionPayload)
        if (result !== undefined) {
          nextState = result as S
        }
      } else if (!isDraftable(currentState)) {
        const result = actions[actionType](currentState as any, actionPayload)

        if (typeof result === 'undefined') {
          if (currentState === null) {
            return currentState
          }
          throw Error(
            'A case reducer on a non-draftable value must not return undefined'
          )
        }

        return result as S
      } else {
        nextState = produce(currentState, (draft) => {
          const result = actions[actionType](draft, actionPayload)
          if (result !== undefined) {
            return result as Draft<S>
          }
          return draft as Draft<S>
        })
      }
    } finally {
      isDispatching = false
    }

    const updateState: StateUpdator<S> = (nextState) => {
      if (nextState === currentState) {
        return currentState
      }

      const data: Data<S, AS> = {
        start,
        end: new Date(),
        actionType,
        actionPayload,
        previousState: currentState,
        currentState: nextState,
      }

      replaceState(nextState, data)

      return nextState
    }

    return updateState(nextState)
  }

  const curryActions: Currings<S, AS> = getKeys(actions).reduce(
    (obj, actionType) => {
      if (typeof actions[actionType] === 'function') {
        obj[actionType] = ((...args: Args<S, AS[typeof actionType]>) =>
          dispatch(actionType, ...args)) as Curring<S, AS[keyof AS]>
      } else {
        throw new Error(
          `Action must be a function. accept ${actions[actionType]}`
        )
      }
      return obj
    },
    {} as Currings<S, AS>
  )

  const store: Store<S, AS> = {
    actions: curryActions,
    getState,
    replaceState,
    dispatch,
    subscribe,
    publish,
    name
  }

  return store
}

/**
 * The `Action` type for user to contruct input `Action`
 *
 * Pass in `unknown` type state and payload, return `unknown` type state.
 *
 * @template State Store state type.
 * @template P Payload type. It is optional
 */
export type Action<
  S extends unknown,
  Payload = unknown
> = unknown extends Payload
  ? (state: Draft<S>) => S | Draft<S> | void
  : (state: Draft<S>, payload: Payload) => S | Draft<S> | void
