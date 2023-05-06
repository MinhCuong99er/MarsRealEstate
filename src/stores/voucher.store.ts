import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import RootStore from './RootStore'
import * as voucherServices from '@src/services/voucher.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { IVoucherInfo, Voucher } from '@src/interfaces/Voucher'
import { ListVoucherParams } from '@src/interfaces/dto/voucher.dto'
import { VOUCHER_TYPE } from '@src/interfaces/enums'
import Config from '@src/contains/Config'
import { IApiResponse } from '@src/utils/request'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'

export type VoucherHydration = {
  detail?: IVoucherInfo | unknown
  newest?: Array<Voucher>

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

  setNewest?: (_data: Array<Voucher>) => void
  setHasEnd?: (_data: {
    [VOUCHER_TYPE.NEW]?: boolean
    [VOUCHER_TYPE.HOT]?: boolean
    [VOUCHER_TYPE.FREE]?: boolean
    [VOUCHER_TYPE.ACCUMULATE]?: boolean
  }) => void

  getListNewestVouchers?: (params: ListVoucherParams) => Promise<any>
}

export default class VoucherStore {
  @observable state = 'pending'
  @observable root: RootStore
  @observable newest: Array<Voucher> = []
  @observable detail: IVoucherInfo | unknown = {}

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

  @action setNewest(_data: Array<Voucher>) {
    this.newest = _data
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

  @computed get isChangeParams() {
    return this.params
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
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

  @action hydrate(data?: VoucherHydration) {
    if (data && data.detail) {
      this.detail = data.detail
    }
    if (data && data.newest) {
      this.newest = data.newest
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
    this.getListNewestVouchers(_params)
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
