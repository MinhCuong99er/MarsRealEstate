import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import omit from 'lodash/omit'
import RootStore from './RootStore'
import * as voucherServices from '@src/services/voucher.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { IVoucherInfo, Voucher } from '@src/interfaces/Voucher'
import { ListVoucherParams } from '@src/interfaces/dto/voucher.dto'
import { MY_VOUCHER_USED, VOUCHER_TYPE, VOUCHER_TYPES } from '@src/interfaces/enums'
import Config from '@src/contains/Config'
import { IApiResponse } from '@src/utils/request'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { wait } from '@src/helpers/wait'
import { DEFAULT_ERROR_MESSAGE, DEFAULT_WAIT_SECONDS } from '@src/contains/contants'

export type VoucherHydration = {
  voucherCodeDetail?: any
  voucherCodeInfo?: any
  detail?: IVoucherInfo | unknown
  newest?: Array<Voucher>
  hots?: Array<Voucher>
  frees?: Array<Voucher>
  accumulates?: Array<Voucher>
  usedVouchers?: Array<Voucher>
  notUsedVouchers?: Array<Voucher>
  courses?: Array<Voucher>
  voucherType?: VOUCHER_TYPE
  voucherTypes?: VOUCHER_TYPES
  myVoucherUsed?: MY_VOUCHER_USED
  activeVoucherArr?: Array<Voucher>
  pagination?: IPagination
  params?: Record<string, any>
  hasMoreItems?: boolean
  hasEnd?: {
    [VOUCHER_TYPE.NEW]: boolean
    [VOUCHER_TYPE.HOT]: boolean
    [VOUCHER_TYPE.FREE]: boolean
    [VOUCHER_TYPE.ACCUMULATE]: boolean
  }

  isChangeParams?: any
  isChangeVoucherType?: any
  isChangeVoucherTypes?: any
  isChangeMyVoucherUsed?: any

  setVoucherType?: (_data: VOUCHER_TYPE) => void
  setVoucherTypes?: (_data: VOUCHER_TYPES) => void
  setMyUsedVoucher?: (_data: MY_VOUCHER_USED) => void
  setNewest?: (_data: Array<Voucher>) => void
  setHots?: (_data: Array<Voucher>) => void
  setFrees?: (_data: Array<Voucher>) => void
  setAccumulates?: (_data: Array<Voucher>) => void
  setCourses?: (_data: Array<Voucher>) => void
  setPagination?: (_data: IPagination) => void
  setParams?: (_data: Record<string, any>) => void
  setUsedVouchers?: (_data: Array<Voucher>) => void
  setNotUsedVouchers?: (_data: Array<Voucher>) => void
  setHasEnd?: (_data: {
    [VOUCHER_TYPE.NEW]?: boolean
    [VOUCHER_TYPE.HOT]?: boolean
    [VOUCHER_TYPE.FREE]?: boolean
    [VOUCHER_TYPE.ACCUMULATE]?: boolean
  }) => void

  getListNewestVouchers?: (params: ListVoucherParams) => Promise<any>
  getListHotVouchers?: (params: ListVoucherParams) => Promise<any>
  getListFreeVouchers?: (params: ListVoucherParams) => Promise<any>
  getListAccumulateVouchers?: (params: ListVoucherParams) => Promise<any>
  getMyUsedVouchers?: (params: ListVoucherParams) => Promise<any>
  getMyNotUsedVouchers?: (params: ListVoucherParams) => Promise<any>
  getListCourses?: (params: ListVoucherParams) => Promise<any>
  loadMore?: () => void
  loadMoreSearch?: (keyword: string) => void
  loadMoreCourse?: () => void
  loadMoreMyVoucherUsed?: () => void
  filter?: () => void
  filterVoucherUsed?: () => void
  reChargeByCode?: (code: string) => Promise<any>
}

export default class VoucherStore {
  @observable state = 'pending'
  @observable root: RootStore
  // ưu đãi gần nhất
  @observable nearest: Array<Voucher> = []
  // ưu đãi mới nhất
  @observable newest: Array<Voucher> = []
  // ưu đãi hot nhat
  @observable hots: Array<Voucher> = []
  @observable frees: Array<Voucher> = []
  // ưu đãi khóa học
  @observable courses: Array<Voucher> = []
  // voucher tich diem
  @observable accumulates: Array<Voucher> = []
  // voucher đã sử dụng
  @observable usedVouchers: Array<Voucher> = []
  // voucher chưa sử dụng
  @observable notUsedVouchers: Array<Voucher> = []
  @observable detail: IVoucherInfo | unknown = {}
  @observable voucherType: VOUCHER_TYPE = VOUCHER_TYPE.NEW
  @observable voucherTypes: VOUCHER_TYPES = VOUCHER_TYPES.EARN_OFF

  @observable myVoucherUsed: MY_VOUCHER_USED = MY_VOUCHER_USED.NOT_USED

  @observable voucherCodeDetail?: any = {}
  @observable voucherCodeInfo?: any = {}

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
    [VOUCHER_TYPE.ACCUMULATE]: boolean
    [VOUCHER_TYPE.NEAREST]: boolean
  } = {
    [VOUCHER_TYPE.NEW]: false,
    [VOUCHER_TYPE.HOT]: false,
    [VOUCHER_TYPE.FREE]: false,
    [VOUCHER_TYPE.ACCUMULATE]: false,
    [VOUCHER_TYPE.NEAREST]: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setHots(_data: Array<Voucher>) {
    this.hots = _data
  }

  @action setNewest(_data: Array<Voucher>) {
    this.newest = _data
  }

  @action setFrees(_data: Array<Voucher>) {
    this.frees = _data
  }

  @action setAccumulates(_data: Array<Voucher>) {
    this.accumulates = _data
  }

  @action setUsedVouchers(_data: Array<Voucher>) {
    this.usedVouchers = _data
  }

  @action setNotUsedVouchers(_data: Array<Voucher>) {
    this.notUsedVouchers = _data
  }

  @action setCourses(_data: Array<Voucher>) {
    this.courses = _data
  }

  @action setVoucherType(_data = VOUCHER_TYPE.HOT) {
    this.voucherType = _data
  }

  @action setVoucherTypes(_data: VOUCHER_TYPES) {
    this.voucherTypes = _data
  }

  @action setMyUsedVoucher(_data = MY_VOUCHER_USED.NOT_USED) {
    this.myVoucherUsed = _data
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
    [VOUCHER_TYPE.FREE]?: boolean
    [VOUCHER_TYPE.ACCUMULATE]?: boolean
    [VOUCHER_TYPE.NEAREST]?: boolean
  }) {
    const _hasEnd = clone(this.hasEnd)
    Object.assign(_hasEnd, _data)
    this.hasEnd = _hasEnd
  }

  @computed get isChangeVoucherType() {
    return this.voucherType
  }

  @computed get isChangeMyVoucherUsed() {
    return this.myVoucherUsed
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

  @computed get activeVoucherArr() {
    switch (this.voucherType) {
      case VOUCHER_TYPE.NEW:
        switch (this.voucherTypes) {
          case VOUCHER_TYPES.EARN_OFF:
          case VOUCHER_TYPES.EXCHANGE_DISCOUNT_PERCENT:
            return this.newest.filter((item) =>
              [VOUCHER_TYPES.EARN_OFF, VOUCHER_TYPES.EXCHANGE_DISCOUNT_PERCENT].includes(item.type)
            )
          case VOUCHER_TYPES.EARN_ON_ECOM:
            return this.newest.filter((item) => item.type == VOUCHER_TYPES.EARN_ON_ECOM)
          default:
            return this.newest
        }
      case VOUCHER_TYPE.HOT:
        return this.hots
      case VOUCHER_TYPE.FREE:
        return this.frees
      case VOUCHER_TYPE.ACCUMULATE:
        return this.accumulates
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
      const _params: ListVoucherParams = {
        ...this.params,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByVoucherType(_params)
    } else {
      this.setHasEnd({
        [this.voucherType]: true,
      })
    }
  }

  @action async loadMoreSearch(keyword: string) {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListVoucherParams = {
        ...this.params,
        keyword,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.getListSearchVouchers(_params)
    }
  }

  @action async loadMoreCourse() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListVoucherParams = {
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.getListCourses(_params)
    }
  }

  @action async loadMoreMyVoucherUsed() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListVoucherParams = {
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByMyVoucherUsed(_params)
    } else {
      this.setHasEnd({
        [this.voucherType]: true,
      })
    }
  }

  @action async filter() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: ListVoucherParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByVoucherType(_params)
  }

  @action async filterVoucherUsed() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: ListVoucherParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByMyVoucherUsed(_params)
  }

  @flow *getListNearestVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramNearest: ListVoucherParams = {
        ...params,
        sort: 'location',
      }
      if (
        Config.publicRuntimeConfig.MAX_DISTANCE &&
        typeof Config.publicRuntimeConfig.MAX_DISTANCE_NEAREST_VOUCHER == 'number'
      ) {
        paramNearest.maxDistance = Number(Config.publicRuntimeConfig.MAX_DISTANCE_NEAREST_VOUCHER)
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        paramNearest,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.nearest = res.data?.data as Voucher[]
        } else {
          this.nearest = [...this.nearest, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getListHotVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramHot: ListVoucherParams = {
        ...params,
        isHot: 1,
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        paramHot,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.hots = res.data?.data as Voucher[]
        } else {
          this.hots = [...this.hots, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getListNewestVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        params,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.newest = res.data?.data as Voucher[]
        } else {
          this.newest = [...this.newest, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getListSearchVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        params,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.hots = res.data?.data as Voucher[]
        } else {
          this.hots = [...this.hots, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getListFreeVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramHot: ListVoucherParams = {
        ...params,
        payment: 'free',
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        paramHot,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.frees = res.data?.data as Voucher[]
        } else {
          this.frees = [...this.frees, ...((res.data?.data as Voucher[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[VOUCHER_TYPE.FREE] == false) {
            this.setHasEnd({
              [VOUCHER_TYPE.FREE]: true,
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

  @flow *getListAccumulateVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramHot: ListVoucherParams = {
        ...params,
        pointType: 'earn',
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        paramHot,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.accumulates = res.data?.data as Voucher[]
        } else {
          this.accumulates = [...this.accumulates, ...((res.data?.data as Voucher[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[VOUCHER_TYPE.ACCUMULATE] == false) {
            this.setHasEnd({
              [VOUCHER_TYPE.ACCUMULATE]: true,
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

  @flow *getMyUsedVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramMyVoucher: ListVoucherParams = {
        ...params,
        used: MY_VOUCHER_USED.USED,
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getMyVouchers(
        paramMyVoucher,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.usedVouchers = res.data?.data as Voucher[]
        } else {
          this.usedVouchers = [...this.usedVouchers, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getMyNotUsedVouchers(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramMyVoucher: ListVoucherParams = {
        ...params,
        used: MY_VOUCHER_USED.NOT_USED,
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getMyVouchers(
        paramMyVoucher,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.notUsedVouchers = res.data?.data as Voucher[]
        } else {
          this.notUsedVouchers = [...this.notUsedVouchers, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getListCourses(params: ListVoucherParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramCourse: ListVoucherParams = {
        ...params,
        types: 'course',
      }
      const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getListVouchers(
        paramCourse,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.courses = res.data?.data as Voucher[]
        } else {
          this.courses = [...this.courses, ...((res.data?.data as Voucher[]) ?? [])]
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

  @flow *getVoucherInfo(voucherId: number | string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield voucherServices.getVouchersInfo<IVoucherInfo>(voucherId, this.root.authStore.token)
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

  @flow *reChargeByCode(code: string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<any>> = yield voucherServices.reChargeByCode<any>(
        code,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.root.authStore?.getCustomerInfo()
        this.detail = res.data?.data
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: VoucherHydration) {
    if (data && data.detail) {
      this.detail = data.detail
    }
    if (data && data.newest) {
      this.newest = data.newest
    }
    if (data && data.hots) {
      this.hots = data.hots
    }
    if (data && data.frees) {
      this.frees = data.frees
    }
    if (data && data.accumulates) {
      this.accumulates = data.accumulates
    }
    if (data && data.courses) {
      this.courses = data.courses
    }
    if (data && data.notUsedVouchers) {
      this.notUsedVouchers = data.notUsedVouchers
    }
    if (data && data.usedVouchers) {
      this.usedVouchers = data.usedVouchers
    }
    if (data && data.voucherCodeDetail) {
      this.voucherCodeDetail = data.voucherCodeDetail
    }
    if (data && data.voucherCodeInfo) {
      this.voucherCodeInfo = data.voucherCodeInfo
    }
    if (data && data.voucherType) {
      this.voucherType = data.voucherType
    }
    if (data && data.voucherTypes) {
      this.voucherTypes = data.voucherTypes
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

  private fetchByVoucherType(_params: ListVoucherParams) {
    switch (this.voucherType) {
      case VOUCHER_TYPE.NEW:
        this.getListNewestVouchers(_params)
        break
      case VOUCHER_TYPE.HOT:
        this.getListHotVouchers(_params)
        break
      case VOUCHER_TYPE.FREE:
        this.getListFreeVouchers(_params)
        break
      case VOUCHER_TYPE.ACCUMULATE:
        this.getListAccumulateVouchers(_params)
        break
      default:
        this.getListHotVouchers(_params)
        break
    }
  }

  private fetchByMyVoucherUsed(_params: ListVoucherParams) {
    switch (this.myVoucherUsed) {
      case MY_VOUCHER_USED.NOT_USED:
        this.getMyNotUsedVouchers(_params)
        break
      case MY_VOUCHER_USED.USED:
        this.getMyUsedVouchers(_params)
        break
      default:
        this.getMyNotUsedVouchers(_params)
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
