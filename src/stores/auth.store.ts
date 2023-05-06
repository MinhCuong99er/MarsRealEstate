import { action, observable, makeObservable, flow, computed } from 'mobx'
import { persist } from 'mobx-persist'
import { clone } from 'lodash'
import RootStore from './RootStore'
import * as userServices from '@src/services/user.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { TokenPayload } from '@src/interfaces/dto/user.dto'
import { CalculateTier, IUserResponse, TierInfos, User } from '@src/interfaces/User'
import { STATE } from '@src/interfaces/enums'
import { IPagination } from '@src/interfaces/dto/common.dto'
import { IApiResponse } from '@src/utils/request'
import Config from '@src/contains/Config'

export type AuthHydration = {
  state?: STATE
  tokenPayload?: TokenPayload
  token?: string
  auth?: User
  calculateTier?: CalculateTier
  tierInfos?: Array<TierInfos>
  pagination?: IPagination
  hasMoreItems?: boolean
  params?: Record<string, any>

  setParams?: (_data: Record<string, any>) => void
  setToken?: (token: string) => void
  setAuth?: (data: { token?: string; auth: any }) => void
  getCustomerInfo?: () => void | Promise<any>
  isChangeParams?: any
}

export default class AuthStore {
  @observable state = STATE.PENDING
  @observable root: RootStore
  // eslint-disable-next-line @typescript-eslint/ban-types
  @persist('object') @observable tokenPayload: Partial<TokenPayload> = {}
  @persist @observable token = null
  @persist('object') @observable auth: Partial<User> = {}
  @persist('object') @observable calculateTier: CalculateTier = {}
  @persist('list') @observable tierInfos: Array<TierInfos> = []

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

  @action setTokenPayload(data: TokenPayload) {
    this.tokenPayload = data
  }

  @action setToken(token: string) {
    this.token = token
  }

  @action setAuth(data: { token?: string; auth: any }) {
    if (data.token) {
      this.token = data.token
    }
    this.auth = data.auth
  }

  @action setCalculateTier(data: any) {
    this.calculateTier = data
  }

  @action setTierInfos(data: any) {
    this.tierInfos = data
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

  @computed get currentTier() {
    if (this.token) {
      if (this?.auth?.tierId) {
        const findTier = this?.tierInfos.find((i) => i.id == this?.auth?.tierId)
        return findTier
      }
    }
    return 'N/A'
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
  }

  @flow *getCustomerInfo() {
    if (!this.token) {
      this.reset()
      return null
    }
    // this.root.loading = true
    this.state = STATE.PROCESSING
    try {
      const res: IApiResponse<IUserResponse> = yield userServices.getCustomerInfo<IUserResponse>(
        this.tokenPayload as TokenPayload,
        this.token
      )
      this.state = STATE.DONE
      // this.root.loading = false
      if (res.status === HttpStatusCode.OK) {
        this.token = res?.data.accessToken || this.token
        this.auth = res?.data?.userInfo || res?.data?.customerInfo
        this.calculateTier = res?.data?.calculateTier
        this.tierInfos = res?.data?.tierInfos
        return res.data
      } else if (res.status == HttpStatusCode.UNAUTHORIZED) {
        this.reset()
        return null
      }
      return res?.data
    } catch (error) {
      this.state = STATE.ERROR
      // this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: AuthHydration) {
    if (data && data.tokenPayload) {
      this.tokenPayload = data.tokenPayload
    }
    if (data && data.token) {
      this.token = data.token
    }
    if (data && data.auth) {
      this.auth = data.auth
    }
    if (data && data.calculateTier) {
      this.calculateTier = data.calculateTier
    }
    if (data && data.tierInfos) {
      this.tierInfos = data.tierInfos
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

  private reset() {
    this.auth = null
    this.calculateTier = null
    this.tierInfos = null
  }

  private caculateParams(total: number) {
    const _pagination = clone(this.pagination)
    this.pagination = {
      ..._pagination,
      totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
    }
  }
}
