import React, { useMemo, PropsWithChildren, useReducer, useEffect } from "react";

import { createStorage, SRA } from "../store";

import { StorageContext } from "./Context";

export const StorageProvider = <
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
  children,
}: PropsWithChildren<{
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
}>) => {
  const storage = useMemo(() => createStorage({ list }), [list]);
  const [_, dispatch] = useReducer(
    (_: unknown, action: unknown) => action,
    null
  );

  useEffect(() => {
    return storage.subscribe((data) => {
      dispatch(data);
    });
  }, [storage]);

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};
