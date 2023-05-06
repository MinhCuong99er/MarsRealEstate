import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import RootStore from './RootStore'
import * as productServices from '@src/services/product.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ProductDetail } from '@src/interfaces/Product'
import { STATE } from '@src/interfaces/enums'
import Config from '@src/contains/Config'
import { IPagination } from '@src/interfaces/dto/common.dto'

export type ProductHydration = {
  state?: STATE
  detail?: ProductDetail | unknown
  pagination?: IPagination
  params?: Record<string, any>
  hasMoreItems?: boolean
  isChangeParams?: any
  setPagination?: (_data: IPagination) => void
  setParams?: (_data: Record<string, any>) => void
}

export default class ProductStore {
  @observable state = STATE.PENDING
  @observable root: RootStore
  @observable detail: ProductDetail | unknown = {}
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setPagination(_data: IPagination) {
    const _pagination = clone(this.pagination)
    Object.assign(_pagination, _data)
    this.pagination = _pagination
  }

  @action setParams(_data: Record<string, any>) {
    const _params = clone(this.params)
    Object.assign(_params, _data)
    this.params = _params
  }

  @computed get isChangeParams() {
    return this.params
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
  }

  @flow *getProductInfo(productId: number) {
    this.root.loading = true
    this.state = STATE.PROCESSING
    try {
      const res = yield productServices.getProductsInfo<ProductDetail>(productId, this.root.authStore.token)
      this.state = STATE.DONE
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.detail = res.data?.data
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = STATE.ERROR
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: ProductHydration) {
    if (data && data.detail) {
      this.detail = data.detail
    }
    if (data && data.pagination) {
      const _pagination = clone(this.pagination)
      this.pagination = {
        ..._pagination,
        ...data.pagination,
        totalPage: Math.floor(((data.pagination?.total ?? 0) + _pagination.limit - 1) / _pagination.limit),
      }
    }
  }

  private caculateParams(total: number) {
    const _pagination = clone(this.pagination)
    this.pagination = {
      ..._pagination,
      total,
      totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
    }
  }
}
