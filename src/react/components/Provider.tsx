import React, { useEffect, useReducer, PropsWithChildren } from 'react'

import { attachDevTool } from '../../attachDevTool'
import type { Store } from '../../index'

import { StoreContext } from './Context'

export type ProviderProps<S extends Store<any, any>> = {
  store: S
}

export const StoreContextProvider = <S extends Store<any, any>>({
  store,
  children,
}: PropsWithChildren<ProviderProps<S>>) => {
  const [_, dispatch] = useReducer((state) => (state += 1), 0)

  useEffect(() => {
    attachDevTool(store)

    return store.subscribe(() => {
      dispatch()
    })
  }, [store, dispatch])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
