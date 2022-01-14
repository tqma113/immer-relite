import { createStore, Store, Actions } from "immer-relite";

export type Model<S extends unknown, AS extends Actions<S>> = {
  readonly symbol: symbol;
  createStore: (initialState?: S) => Store<S, AS>;
};

export const createModel = <S extends unknown, AS extends Actions<S>>(
  actions: AS,
  initialState: S,
  name?: string
): Model<S, AS> => {
  const symbol = Symbol("STORE_MODEL_SYMBOL");

  return {
    get symbol() {
      return symbol;
    },
    createStore: (_initialState: S = initialState) => {
      return createStore(actions, _initialState, name);
    },
  };
};
