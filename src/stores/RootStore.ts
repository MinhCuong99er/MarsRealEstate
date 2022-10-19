import { action, observable, makeObservable } from 'mobx'
import { create } from 'mobx-persist'
import CartStore, { CartHydration } from './cart.store'
import AuthStore, { AuthHydration } from './auth.store'
import VoucherStore, { VoucherHydration } from './voucher.store'
import CharityStore, { CharityHydration } from './charity.store'
import GlobalStore, { GlobalHydration } from './global.store'
import ProductStore, { ProductHydration } from './product.store'

const isClient = typeof window !== 'undefined'
let hydrate
if (isClient) {
  hydrate = create({
    storage: localStorage,
    jsonify: true,
  })
}

export type RootStoreHydration = {
  loading?: boolean

  setLoader?: (loading: boolean) => void
  cartStore?: CartHydration
  authStore?: AuthHydration
  voucherStore?: VoucherHydration
  charityStore?: CharityHydration
  globalStore?: GlobalHydration
  productStore?: ProductHydration
}
export default class RootStore {
  @observable loading = false
  cartStore: CartStore
  authStore: AuthStore
  voucherStore: VoucherStore
  charityStore: CharityStore
  globalStore: GlobalStore
  productStore: ProductStore
  // sizeSwitcherStore: ReturnType<typeof sizeSwitcherStoreFactory>;

  constructor() {
    // this.sizeSwitcherStore = sizeSwitcherStoreFactory(this);
    this.cartStore = new CartStore(this)
    this.authStore = new AuthStore(this)
    this.voucherStore = new VoucherStore(this)
    this.charityStore = new CharityStore(this)
    this.globalStore = new GlobalStore(this)
    this.productStore = new ProductStore(this)
    if (isClient) {
      hydrate('authStore', this.authStore).then(() => console.warn('authStore hydrated'))
      hydrate('cartStore', this.cartStore).then(() => console.warn('cartStore hydrated'))
    }
    makeObservable(this)
  }

  @action setLoader(_loading: boolean) {
    this.loading = _loading
  }

  @action hydrate(data: RootStoreHydration) {
    if (data.cartStore) {
      this.cartStore.hydrate(data.cartStore)
      if (isClient) {
        hydrate('cartStore', this.cartStore, data.cartStore).then(() => console.warn('cartStore rehydrated'))
      }
    }
    if (data.authStore) {
      this.authStore.hydrate(data.authStore)
      if (isClient) {
        hydrate('authStore', this.authStore, data.authStore).then(() => console.warn('authStore rehydrated'))
      }
    }
    if (data.voucherStore) {
      this.voucherStore.hydrate(data.voucherStore)
    }
    if (data.charityStore) {
      this.charityStore.hydrate(data.charityStore)
    }
    if (data.globalStore) {
      this.globalStore.hydrate(data.globalStore)
    }
    if (data.productStore) {
      this.productStore.hydrate(data.productStore)
    }
  }
}
