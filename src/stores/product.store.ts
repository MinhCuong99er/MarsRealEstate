import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import omit from 'lodash/omit'
import RootStore from './RootStore'
import * as productServices from '@src/services/product.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ProductDetail, Product } from '@src/interfaces/Product'
import { ListProductParams } from '@src/interfaces/dto/product.dto'
import { VOUCHER_TYPE } from '@src/interfaces/enums'
import Config from '@src/contains/Config'
import { IApiResponse } from '@src/utils/request'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { wait } from '@src/helpers/wait'
import { DEFAULT_WAIT_SECONDS } from '@src/contains/contants'

export type ProductHydration = {
  detail?: ProductDetail | unknown
  newest?: Array<Product>
  hots?: Array<Product>
  productType?: VOUCHER_TYPE
  pagination?: IPagination
  params?: Record<string, any>
  hasMoreItems?: boolean
  activeProductArr?: Array<Product>
  hasEnd?: {
    [VOUCHER_TYPE.NEW]: boolean
    [VOUCHER_TYPE.HOT]: boolean
  }

  isChangeParams?: any
  isChangeProductType?: any

  setProductType?: (_data: VOUCHER_TYPE) => void
  setNewest?: (_data: Array<Product>) => void
  setHots?: (_data: Array<Product>) => void
  setPagination?: (_data: IPagination) => void
  setParams?: (_data: Record<string, any>) => void
  setHasEnd?: (_data: { [VOUCHER_TYPE.NEW]?: boolean; [VOUCHER_TYPE.HOT]?: boolean }) => void

  getListNewestProducts?: (params: ListProductParams) => Promise<any>
  getListHotProducts?: (params: ListProductParams) => Promise<any>
  loadMore?: () => void
  loadMoreSearch?: (keyword: string) => void
  filter?: () => void
}

export default class ProductStore {
  @observable state = 'pending'
  @observable root: RootStore
  // sản phẩm gần nhất
  @observable nearest: Array<Product> = []
  // sản phẩm mới nhất
  @observable newest: Array<Product> = []
  // sản phẩm hot nhat
  @observable hots: Array<Product> = []
  @observable detail: ProductDetail | unknown = {}
  @observable productType: VOUCHER_TYPE = VOUCHER_TYPE.HOT
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }
  @observable hasEnd: {
    [VOUCHER_TYPE.NEW]: boolean
    [VOUCHER_TYPE.HOT]: boolean
    [VOUCHER_TYPE.FREE]: boolean
    [VOUCHER_TYPE.NEAREST]: boolean
  } = {
    [VOUCHER_TYPE.NEW]: false,
    [VOUCHER_TYPE.HOT]: false,
    [VOUCHER_TYPE.FREE]: false,
    [VOUCHER_TYPE.NEAREST]: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setHots(_data: Array<Product>) {
    this.hots = _data
  }

  @action setNewest(_data: Array<Product>) {
    this.newest = _data
  }

  @action setProductType(_data = VOUCHER_TYPE.HOT) {
    this.productType = _data
  }

  @action setPagination(_data: IPagination) {
    const _pagination = clone(this.pagination)
    Object.assign(_pagination, _data)
    this.pagination = _pagination
  }

  @action setParams(_data: Record<string, any>) {
    let _params = clone(this.params)
    Object.assign(_params, _data)
    if (_params.fromPoint == '*' && _params.toPoint == '*') {
      _params = omit(_params, ['fromPoint', 'toPoint'])
    }
    this.params = _params
  }

  @action setHasEnd(_data: {
    [VOUCHER_TYPE.NEW]?: boolean
    [VOUCHER_TYPE.HOT]?: boolean
    [VOUCHER_TYPE.NEAREST]?: boolean
  }) {
    const _hasEnd = clone(this.hasEnd)
    Object.assign(_hasEnd, _data)
    this.hasEnd = _hasEnd
  }

  @computed get isChangeProductType() {
    return this.productType
  }

  @computed get isChangeParams() {
    return this.params
    /* return (
      // eslint-disable-next-line no-prototype-builtins
      this.params.hasOwnProperty('fromPoint') &&
      // eslint-disable-next-line no-prototype-builtins
      this.params.hasOwnProperty('toPoint')
    ) */
  }

  @computed get activeProductArr() {
    switch (this.productType) {
      case VOUCHER_TYPE.NEW:
        return this.newest
      case VOUCHER_TYPE.HOT:
        return this.hots
      default:
        return this.hots
    }
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
  }

  @action async loadMore() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListProductParams = {
        ...this.params,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByProductType(_params)
    } else {
      this.setHasEnd({
        [this.productType]: true,
      })
    }
  }

  @action async loadMoreSearch(keywords: string) {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListProductParams = {
        ...this.params,
        keywords,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.getListSearchProducts(_params)
    }
  }

  @action async filter() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: ListProductParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByProductType(_params)
  }

  @flow *getListNearestProducts(params: ListProductParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramNearest: ListProductParams = {
        ...params,
        sort: 'location',
      }
      if (
        Config.publicRuntimeConfig.MAX_DISTANCE &&
        typeof Config.publicRuntimeConfig.MAX_DISTANCE_NEAREST_VOUCHER == 'number'
      ) {
        paramNearest.maxDistance = Number(Config.publicRuntimeConfig.MAX_DISTANCE_NEAREST_VOUCHER)
      }
      const res: IApiResponse<ResponseType<Product[]>> = yield productServices.getListProducts(
        paramNearest,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.nearest = res.data?.data as Product[]
        } else {
          this.nearest = [...this.nearest, ...((res.data?.data as Product[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[VOUCHER_TYPE.NEAREST] == false) {
            this.setHasEnd({
              [VOUCHER_TYPE.NEAREST]: true,
            })
          }
        }
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListHotProducts(params: ListProductParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramHot: ListProductParams = {
        ...params,
        isHot: 1,
      }
      const res: IApiResponse<ResponseType<Product[]>> = yield productServices.getListProducts(
        paramHot,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.hots = res.data?.data as Product[]
        } else {
          this.hots = [...this.hots, ...((res.data?.data as Product[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[VOUCHER_TYPE.HOT] == false) {
            this.setHasEnd({
              [VOUCHER_TYPE.HOT]: true,
            })
          }
        }
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListNewestProducts(params: ListProductParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Product[]>> = yield productServices.getListProducts(
        params,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.newest = res.data?.data as Product[]
        } else {
          this.newest = [...this.newest, ...((res.data?.data as Product[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[VOUCHER_TYPE.NEW] == false) {
            this.setHasEnd({
              [VOUCHER_TYPE.NEW]: true,
            })
          }
        }
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListSearchProducts(params: ListProductParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Product[]>> = yield productServices.getListProducts(
        params,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          // this.hots = res.data?.data as Product[]
          this.setListByProductType(res.data?.data as Product[])
        } else {
          // this.hots = [...this.hots, ...((res.data?.data as Product[]) ?? [])]
          this.setListByProductType([...this.hots, ...((res.data?.data as Product[]) ?? [])])
        }
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getProductInfo(productId: number) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield productServices.getProductsInfo<ProductDetail>(productId, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.detail = res.data?.data
        return res.data
      }
      return res?.data
    } catch (error) {
      this.state = 'error'
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
    if (data && data.newest) {
      this.newest = data.newest
    }
    if (data && data.hots) {
      this.hots = data.hots
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

  private setListByProductType(_data: Product[]) {
    switch (this.productType) {
      case VOUCHER_TYPE.NEW:
        this.newest = _data
        break
      case VOUCHER_TYPE.HOT:
        this.hots = _data
        break
      default:
        this.hots = _data
        break
    }
  }

  private fetchByProductType(_params: ListProductParams) {
    switch (this.productType) {
      case VOUCHER_TYPE.NEW:
        this.getListNewestProducts(_params)
        break
      case VOUCHER_TYPE.HOT:
        this.getListHotProducts(_params)
        break
      default:
        this.getListHotProducts(_params)
        break
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
