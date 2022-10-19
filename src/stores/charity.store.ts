import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import clone from 'lodash/clone'
import * as charityServices from '@src/services/charity.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { Charity } from '@src/interfaces/Charity'
import Config from '@src/contains/Config'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { wait } from '@src/helpers/wait'
import { ListCharityDonateParams, ListCharityParams } from '@src/interfaces/dto/charity.dto'
import { IApiResponse } from '@src/utils/request'
import { DEFAULT_WAIT_SECONDS } from '@src/contains/contants'

export type CharityHydration = {
  detail?: Charity | unknown
  charities?: Array<Charity>
  donates?: Array<Charity>
  pagination?: IPagination
  hasMoreItems?: boolean
  setCharities?: (_data: Array<Charity>) => void
  setDonates?: (_data: Array<Charity>) => void
  setFrees?: (_data: Array<Charity>) => void
  setDetail?: (_data: Charity) => void
  getListCharities?: (params: ListCharityParams) => Promise<any>
  getListDonates?: (params: ListCharityDonateParams) => Promise<any>
  getCharityInfo?: (id: number) => Promise<any>
  doDonate?: (charityId: number, point: number) => Promise<any>
  setPagination?: (_data: IPagination) => void
  loadMore?: () => void
  loadMoreDonates?: () => void
}

export default class CharityStore {
  @observable state = 'pending'
  @observable root: RootStore
  @observable charities: Array<Charity> = []
  @observable donates: Array<Charity> = []
  @observable detail: Charity | Record<string, any> = {}
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setCharities(_data: Array<Charity>) {
    this.charities = _data
  }

  @action setDonates(_data: Array<Charity>) {
    this.donates = _data
  }

  @action setDetail(_data: Charity) {
    this.detail = _data
  }
  @action setPagination(_data: IPagination) {
    const _pagination = clone(this.pagination)
    Object.assign(_pagination, _data)
    this.pagination = _pagination
  }

  @action async loadMore() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListCharityParams = {
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.getListCharities(_params)
    }
  }

  @action async loadMoreDonates() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListCharityDonateParams = {
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.getListDonates(_params)
    }
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
  }

  @flow *getListCharities(params: ListCharityParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Charity>> = yield charityServices.getListCharities(
        params,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.charities = res.data?.data as Charity[]
        } else {
          this.charities = [...this.charities, ...((res.data?.data as Charity[]) ?? [])]
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

  @flow *getListDonates(params: ListCharityDonateParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield charityServices.getListDonates(params, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.donates = res.data?.data as Charity[]
        } else {
          this.donates = [...this.donates, ...((res.data?.data as Charity[]) ?? [])]
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

  @flow *getCharityInfo(id: number) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield charityServices.getCharityInfo<Charity>(id, this.root.authStore.token)
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

  @flow *doDonate(charityId: number, point: number) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield charityServices.donate(charityId, point, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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

  @action hydrate(data?: CharityHydration) {
    if (data && data.detail) {
      this.detail = data.detail
    }
    if (data && data.charities) {
      this.charities = data.charities
    }
    if (data && data.donates) {
      this.donates = data.donates
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
