import { enableStaticRendering } from 'mobx-react-lite'
import React, { createContext, ReactNode, useContext } from 'react'
import { Provider } from 'mobx-react'
import RootStore, { RootStoreHydration } from '../stores/RootStore'

enableStaticRendering(typeof window === 'undefined')

let store: RootStore
const StoreContext = createContext<RootStore | undefined>(undefined)
StoreContext.displayName = 'StoreContext'

export function useRootStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider')
  }

  return context
}

export function useAuthStore() {
  const { authStore } = useRootStore()
  return authStore
}

export function useCartStore() {
  const { cartStore } = useRootStore()
  return cartStore
}

function initializeStore(initialData?: RootStoreHydration): RootStore {
  const _store = store ?? new RootStore()

  if (initialData) {
    _store.hydrate(initialData)
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export default function RootStoreProvider({
  children,
  hydrationData,
}: {
  children: ReactNode
  hydrationData?: RootStoreHydration
}) {
  console.log(`🚀 ~ file: RootStoreProvider.tsx ~ hydrationData`, hydrationData)
  const store = initializeStore(hydrationData)

  return (
    <StoreContext.Provider value={store}>
      <Provider store={store}>{children}</Provider>
    </StoreContext.Provider>
  )
}
