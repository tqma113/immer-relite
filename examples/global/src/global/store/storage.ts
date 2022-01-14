import { attachDevTool } from "immer-relite/dev";
import type { Store, Actions, Data } from "immer-relite";

import { Model } from "./model";

export type StorageValue = {
  model: Model<any, any>;
  store: Store<any, any>;
};

export type Listener<S, AS extends Actions<S>> = (data: Data<S, AS>) => void;
export type Storage = {
  getStore: <S extends unknown, AS extends Actions<S>>(
    model: Model<S, AS>
  ) => Store<S, AS>;
  subscribe: (listener: Listener<unknown, any>) => () => void;
};

export type StorageCreatorOptions = {
  list?: [Model<any, any>, any][];
};

export type SRA<S> = {
  model: Model<S, any>;
  initialState?: S;
};

export const createStorage = <
  A extends any,
  B extends any,
  C extends any,
  D extends any,
  E extends any,
  F extends any,
  G extends any,
  H extends any,
  I extends any,
  J extends any
>({
  list,
}: {
  list?:
    | [SRA<A>]
    | [SRA<A>, SRA<B>]
    | [SRA<A>, SRA<B>, SRA<C>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>, SRA<E>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>, SRA<E>, SRA<F>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>, SRA<E>, SRA<F>, SRA<G>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>, SRA<E>, SRA<F>, SRA<G>, SRA<H>]
    | [SRA<A>, SRA<B>, SRA<C>, SRA<D>, SRA<E>, SRA<F>, SRA<G>, SRA<H>, SRA<I>]
    | [
        SRA<A>,
        SRA<B>,
        SRA<C>,
        SRA<D>,
        SRA<E>,
        SRA<F>,
        SRA<G>,
        SRA<H>,
        SRA<I>,
        SRA<J>
      ];
}): Storage => {
  const map = new WeakMap<Model<any, any>, StorageValue>();

  let listeners: Listener<unknown, any>[] = [];
  const publish = (data: Data<unknown, any>) => {
    listeners.forEach((listener) => listener(data));
  };

  const addModel = (model: Model<any, any>, initialState?: unknown) => {
    const store = model.createStore(initialState as any);
    store.subscribe(publish);
    map.set(model, { model, store });
    attachDevTool(store);
    return store;
  };

  if (list) {
    list.forEach(({ model, initialState }) => {
      addModel(model, initialState);
    });
  }

  const getStore = <S extends unknown, AS extends Actions<S>>(
    model: Model<S, AS>,
    initialState?: S
  ): Store<S, AS> => {
    const storageValue = map.get(model);
    if (storageValue) {
      return storageValue.store;
    }

    return addModel(model, initialState);
  };

  const subscribe = (listener: Listener<unknown, any>) => {
    const index = listeners.push(listener);
    return () => {
      listeners = listeners.splice(index, 1);
    };
  };

  return {
    getStore,
    subscribe,
  };
};
