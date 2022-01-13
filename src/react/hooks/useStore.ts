import { useContext } from 'react'

import { StoreContext } from '../components'

export const useStore = () => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('Can not use `useStore` outside `StoreContext.Provider`')
  }

  return store
}
