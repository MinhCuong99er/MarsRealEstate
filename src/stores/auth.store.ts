import { action, observable, makeObservable, flow, computed } from 'mobx'
import { persist } from 'mobx-persist'
import clone from 'lodash/clone'
import omit from 'lodash/omit'
import RootStore from './RootStore'
import * as userServices from '@src/services/user.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import {
  CumstomerInfoParams,
  HistoryPointTranferParams,
  HistoryTransactionAcumulateParams,
  HistoryTransactionParams,
  ITranferObject,
  ListOrderShipParams,
  NotificationParams,
  TokenPayload,
  TransferPointParams,
} from '@src/interfaces/dto/user.dto'
import { CalculateTier, IUserNoti, IUserResponse, TierInfos, User } from '@src/interfaces/User'
import { DEFAULT_ERROR_MESSAGE, DEFAULT_WAIT_SECONDS } from '@src/contains/contants'
import {
  HISTORY_EXCHANGE_TYPE,
  TRANSACTION_TYPE,
  STATE,
  ORDER_ITEM_STATUS,
  NOTIFICATION_TYPE,
} from '@src/interfaces/enums'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { IApiResponse } from '@src/utils/request'
import Config from '@src/contains/Config'
import { wait } from '@src/helpers/wait'
import { OrderShipItem } from '@src/interfaces/Product'

export type AuthHydration = {
  state?: STATE
  tokenPayload?: TokenPayload
  token?: string
  auth?: User
  calculateTier?: CalculateTier
  tierInfos?: Array<TierInfos>
  accumulateHistoryTransaction?: Array<Record<string, any>>
  exchangeHistoryTransaction?: Array<Record<string, any>>
  listOrderShipsWaitForAdminConfirm?: Array<OrderShipItem>
  listOrderShipsShipping?: Array<OrderShipItem>
  listOrderShipsCompleted?: Array<OrderShipItem>
  listOrderShipsCanceled?: Array<OrderShipItem>
  notificationPersonal?: Array<Record<string, any>>
  notificationAll?: Array<Record<string, any>>
  historyPointTransfer?: Array<Record<string, any>>
  currentTier?: TierInfos
  currentTierProcess?: number
  percentTierBetween?: number
  notiCount?: string
  transferObject?: ITranferObject
  isLinkExchangePhone?: boolean
  historyType?: HISTORY_EXCHANGE_TYPE
  activeHistoryArr?: Array<Record<string, any>>
  orderItemType?: ORDER_ITEM_STATUS
  activeOrderItemArr?: Array<Record<string, any>>
  notificationType?: NOTIFICATION_TYPE
  activeNotificationArr?: Array<Record<string, any>>
  pagination?: IPagination
  hasMoreItems?: boolean
  params?: Record<string, any>
  hasEnd?: {
    [ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM]: boolean
    [ORDER_ITEM_STATUS.SHIPPING]: boolean
    [ORDER_ITEM_STATUS.COMPLETED]: boolean
    [ORDER_ITEM_STATUS.CANCELED]: boolean
  }
  hasEndNotification?: {
    [NOTIFICATION_TYPE.PERSONAL]: boolean
    [NOTIFICATION_TYPE.ALL]: boolean
  }

  setParams?: (_data: Record<string, any>) => void
  isChangeTransferObject?: () => ITranferObject
  setTransferObject?: (data: ITranferObject) => void
  setToken?: (token: string) => void
  setAuth?: (data: { token?: string; auth: any }) => void
  setCalculateTier?: (data: any) => void
  setTierInfos?: (data: any) => void
  setUsePoint?: (point: number) => void
  setHistoryType?: (_data: HISTORY_EXCHANGE_TYPE) => void
  setOrderItemType?: (_data: ORDER_ITEM_STATUS) => void
  setNotificationType?: (_data: NOTIFICATION_TYPE) => void

  updateCustomerInfo?: (params: CumstomerInfoParams) => Promise<any>
  getHistoryTransactionExchange?: (params: HistoryTransactionAcumulateParams) => Promise<any>
  getHistoryTransactionAccumulate?: (params: HistoryTransactionAcumulateParams) => Promise<any>
  getHistoryTranferPoint?: (params: HistoryPointTranferParams) => Promise<any>
  getListOrderShipsWaitForAdminConfirm?: (params: ListOrderShipParams) => Promise<any>
  getListOrderShipsShipping?: (params: ListOrderShipParams) => Promise<any>
  getListOrderShipsCompleted?: (params: ListOrderShipParams) => Promise<any>
  getListOrderShipsCanceled?: (params: ListOrderShipParams) => Promise<any>

  getListNotificationPersonal?: (params: NotificationParams) => Promise<any>
  getListNotificationAll?: (params: NotificationParams) => Promise<any>

  transferPoint?: (params: TransferPointParams) => Promise<any>
  checkCustomer?: (custId: string) => Promise<any>
  getCustomerInfo?: () => void | Promise<any>
  getNotiCount?: () => void | Promise<any>
  linkExchange?: (phone: string) => Promise<IApiResponse<any>>
  verifyLinkExchange?: (phone: string, otp: string) => Promise<IApiResponse<any>>
  updateIsRead?: (id: number) => Promise<IApiResponse<any>>
  setPagination?: (_data: IPagination) => void
  loadMore?: () => void
  loadMoreOrderItems?: () => void
  loadMoreNotification?: () => void
  filter?: () => void
  filterOrderItem?: () => void
  filterNotification?: () => void
  setHasEnd?: (_data: {
    [ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM]?: boolean
    [ORDER_ITEM_STATUS.SHIPPING]?: boolean
    [ORDER_ITEM_STATUS.COMPLETED]?: boolean
    [ORDER_ITEM_STATUS.CANCELED]?: boolean
  }) => void
  setHasEndNotification?: (_data: { [NOTIFICATION_TYPE.PERSONAL]?: boolean; [NOTIFICATION_TYPE.ALL]?: boolean }) => void

  isChangeHistoryType?: any
  isChangeParams?: any
  isChangeOrderItemType?: any
  isChangeNotificationType?: any
}

export default class AuthStore {
  @observable state = 'pending'
  @observable root: RootStore
  // eslint-disable-next-line @typescript-eslint/ban-types
  @persist('object') @observable tokenPayload: Partial<TokenPayload> = {}
  @persist @observable token = 'customer'
  @persist('object') @observable auth: Partial<User> = {}
  @persist('object') @observable calculateTier: CalculateTier = {}
  @persist('list') @observable tierInfos: Array<TierInfos> = []
  @persist('list') @observable accumulateHistoryTransaction = []
  @persist('list') @observable exchangeHistoryTransaction = []
  @persist('list') @observable historyPointTransfer = []
  @persist('list')
  @observable
  listOrderShipsWaitForAdminConfirm: Array<OrderShipItem> = []
  @persist('list') @observable listOrderShipsShipping: Array<OrderShipItem> = []
  @persist('list') @observable listOrderShipsCompleted: Array<OrderShipItem> = []
  @persist('list') @observable listOrderShipsCanceled: Array<OrderShipItem> = []
  @persist('list') @observable notificationPersonal: Array<Record<string, any>> = []
  @persist('list') @observable notificationAll: Array<Record<string, any>> = []

  @observable usePoint = 0
  @observable notiCount = '0'
  @observable transferObject: ITranferObject = {
    receiver: null,
    receiveId: null,
    phone: '',
    point: 0,
    description: '',
  }
  @observable historyType: HISTORY_EXCHANGE_TYPE = HISTORY_EXCHANGE_TYPE.ACCUMULATE
  @observable orderItemType: ORDER_ITEM_STATUS = ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM
  @observable notificationType: NOTIFICATION_TYPE = NOTIFICATION_TYPE.PERSONAL
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }
  @observable hasEnd: {
    [ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM]: boolean
    [ORDER_ITEM_STATUS.SHIPPING]: boolean
    [ORDER_ITEM_STATUS.COMPLETED]: boolean
    [ORDER_ITEM_STATUS.CANCELED]: boolean
  } = {
    [ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM]: false,
    [ORDER_ITEM_STATUS.SHIPPING]: false,
    [ORDER_ITEM_STATUS.COMPLETED]: false,
    [ORDER_ITEM_STATUS.CANCELED]: false,
  }
  @observable hasEndNotification: {
    [NOTIFICATION_TYPE.PERSONAL]: boolean
    [NOTIFICATION_TYPE.ALL]: boolean
  } = {
    [NOTIFICATION_TYPE.PERSONAL]: false,
    [NOTIFICATION_TYPE.ALL]: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
    // this.disposeInfo = autorun(
    //   () => {
    //     // if (this.isRunUpdateInfo) {
    //       // console.log(`🚀 ~ file: auth.store.ts ~ line 94 ~ AuthStore ~ this.isRunUpdateInfo`, this.isRunUpdateInfo);
    //       // this?.getCustomerInfo()
    //     // }
    //   }
    //   /* {
    //     scheduler: (run) => {
    //       console.log(
    //         `🚀 ~ file: HeaderHomeDesktop.tsx ~ line 77 ~ autorun ~ run`,
    //         run
    //       )
    //       setTimeout(run, 1000)
    //     },
    //   } */
    // )
  }

  @action setTokenPayload(data: TokenPayload) {
    this.tokenPayload = data
  }

  @action setTransferObject(data: ITranferObject) {
    const _tranferObject = this.transferObject
    this.transferObject = {
      ..._tranferObject,
      ...data,
    }
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

  @action setUsePoint(point: number) {
    this.usePoint = point
  }

  @action setHistoryType(_data = HISTORY_EXCHANGE_TYPE.ACCUMULATE) {
    this.historyType = _data
  }

  @action setOrderItemType(_data = ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM) {
    this.orderItemType = _data
  }

  @action setNotificationType(_data = NOTIFICATION_TYPE.PERSONAL) {
    this.notificationType = _data
  }

  @action setPagination(_data: IPagination) {
    const _pagination = clone(this.pagination)
    Object.assign(_pagination, _data)
    this.pagination = _pagination
  }

  @action setParams(_data: Record<string, any>) {
    let _params = clone(this.params)
    Object.assign(_params, _data)
    if (_params.fromTime == '*' && _params.toTime == '*') {
      _params = omit(_params, ['fromTime', 'toTime'])
    }
    this.params = _params
  }

  @action async filter() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: HistoryTransactionParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByHistoryType(_params)
  }

  @action async filterOrderItem() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: ListOrderShipParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByOrderItemsType(_params)
  }
  @action async filterNotification() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: NotificationParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(DEFAULT_WAIT_SECONDS)
    this.fetchByNotificationType(_params)
  }

  @computed get isChangeParams() {
    return this.params
  }

  @computed get isChangeTransferObject() {
    return this.transferObject
  }

  @computed get isChangeOrderItemType() {
    return this.orderItemType
  }

  @computed get isChangeNotificationType() {
    return this.notificationType
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

  @computed get currentTierProcess() {
    if (this.token) {
      const indexCurrentTier = this?.tierInfos.findIndex((item: any) => item.id == this?.auth?.tierId)
      const totalTier = this?.tierInfos.length ?? 0
      const perTwoTier = 100 / (totalTier - 1)
      const tierProcessBetweenTwoTier =
        Number(this?.calculateTier?.tierProgress ?? '0') == 0 ? 100 : Number(this?.calculateTier?.tierProgress ?? '0')
      // 25: % 1 khoang | 75: % 2 khoảng hiện tại
      // x              | 100%
      const tierProcess = Math.floor(
        perTwoTier * (tierProcessBetweenTwoTier / 100) + (indexCurrentTier - 1) * perTwoTier
      )
      if (tierProcess == 0) return 100
      return tierProcess
    }
    return 0
  }

  @computed get percentTierBetween() {
    if (this.token) {
      const totalTier = this?.tierInfos.length ?? 0
      const perTwoTier = 100 / (totalTier - 1)
      return perTwoTier
    }
    return 100
  }

  @computed get isLinkExchangePhone() {
    if (
      this.token &&
      this.auth &&
      this.auth.phone != null &&
      this.auth.phone != '' &&
      this.auth.exchangeId != null &&
      this.auth.exchangeId != ''
    ) {
      return true
    }
    return false
  }

  @computed get isChangeHistoryType() {
    return this.historyType
  }

  @computed get activeHistoryArr() {
    switch (this.historyType) {
      case HISTORY_EXCHANGE_TYPE.ACCUMULATE:
        return this.accumulateHistoryTransaction
      case HISTORY_EXCHANGE_TYPE.EXCHANGE:
        return this.exchangeHistoryTransaction
      default:
        return this.accumulateHistoryTransaction
    }
  }

  @computed get activeOrderItemArr() {
    switch (this.orderItemType) {
      case ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM:
        return this.listOrderShipsWaitForAdminConfirm
      case ORDER_ITEM_STATUS.SHIPPING:
        return this.listOrderShipsShipping
      case ORDER_ITEM_STATUS.COMPLETED:
        return this.listOrderShipsCompleted
      case ORDER_ITEM_STATUS.CANCELED:
        return this.listOrderShipsCanceled
      default:
        return this.listOrderShipsWaitForAdminConfirm
    }
  }

  @computed get activeNotificationArr() {
    switch (this.notificationType) {
      case NOTIFICATION_TYPE.PERSONAL:
        return this.notificationPersonal
      case NOTIFICATION_TYPE.ALL:
        return this.notificationAll
      default:
        return this.notificationAll
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
      const _params: HistoryTransactionParams = {
        ...this.params,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByHistoryType(_params)
    }
  }
  @action async loadMoreOrderItems() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListOrderShipParams = {
        ...this.params,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByOrderItemsType(_params)
    }
  }
  @action async loadMoreNotification() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: NotificationParams = {
        ...this.params,
        skip: (this.pagination.skip + this.pagination.limit) * this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(DEFAULT_WAIT_SECONDS)
      this.fetchByNotificationType(_params)
    }
  }

  @flow *transferPoint(params: TransferPointParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.transferPoint<ResponseType<any>>(params, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK) {
        this.transferObject = {
          receiver: null,
          receiveId: null,
          phone: '',
          point: 0,
          description: '',
        }
        // this.auth = res?.data?.customerInfo
        this.getCustomerInfo()
        return res.data
      }
      return {
        errorCode: res.data?.status || HttpStatusCode.BAD_REQUEST,
        message: res.data?.message || 'Hệ thống đang bận. Vui lòng thực hiện lại sau!',
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

  @flow *getCustomerInfo() {
    if (
      !this.token
      // || !this.tokenPayload ||
      // !this.tokenPayload.phone ||
      // !this.tokenPayload.refId ||
      // !this.tokenPayload.voucherId ||
      // !Object.keys(this.tokenPayload).length
    ) {
      this.reset()
      return null
    }
    // this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<IUserResponse> = yield userServices.getCustomerInfo<IUserResponse>(
        this.tokenPayload as TokenPayload,
        this.token
      )
      console.log(`🚀 ~ file: auth.store.ts ~ line 530 ~ AuthStore ~ @flow*getCustomerInfo ~ res`, res)
      this.state = 'done'
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
      this.state = 'error'
      // this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getNotiCount() {
    if (!this.token) {
      this.reset()
      return null
    }
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<IUserNoti> = yield userServices.getNotiCount<IUserNoti>(this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK) {
        this.notiCount = res?.data?.count.toString()
        return res.data
      } else if (res.status == HttpStatusCode.UNAUTHORIZED) {
        this.reset()
        return null
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

  @flow *updateCustomerInfo(params: CumstomerInfoParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.updateCustomerInfo<IUserResponse>(params, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK) {
        this.auth = res?.data?.customerInfo
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

  @flow *getHistoryTransactionAccumulate(params: HistoryTransactionAcumulateParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramAcumulate: HistoryTransactionParams = {
        ...params,
        type: TRANSACTION_TYPE.ACCUMULATE,
      }
      const res: IApiResponse<ResponseType<Record<string, any>>> = yield userServices.getHistoryTransaction(
        paramAcumulate,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.accumulateHistoryTransaction = res.data?.data as Record<string, any>[]
        } else {
          this.accumulateHistoryTransaction = [
            ...this.accumulateHistoryTransaction,
            ...((res.data?.data as Record<string, any>[]) ?? []),
          ]
        }

        return res.data
      }
      return res.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
    }
  }

  @flow *getHistoryTransactionExchange(params: HistoryTransactionAcumulateParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramAcumulate: HistoryTransactionParams = {
        ...params,
        type: TRANSACTION_TYPE.EXCHANGE,
      }
      const res: IApiResponse<ResponseType<Record<string, any>>> = yield userServices.getHistoryTransaction(
        paramAcumulate,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.exchangeHistoryTransaction = res.data?.data as ResponseType<Record<string, any>>[]
        } else {
          this.exchangeHistoryTransaction = [
            ...this.exchangeHistoryTransaction,
            ...((res.data?.data as ResponseType<Record<string, any>>[]) ?? []),
          ]
        }

        return res.data
      }
      return res.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
    }
  }

  @flow *getHistoryTranferPoint(params: HistoryPointTranferParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.getHistoryTranferPoint(params, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        this.historyPointTransfer = res.data?.data ?? []
        return res.data?.data
      }
      return res.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *checkCustomer(custId: string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.checkCustomer(custId, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        this.transferObject = {
          ...this.transferObject,
          receiver: res.data?.data,
          receiveId: res.data?.data?.id,
        }
        return res.data?.data
      } else {
        this.transferObject = {
          ...this.transferObject,
          receiver: null,
          receiveId: null,
        }
      }
      return {
        errorCode: res.data?.status || HttpStatusCode.BAD_REQUEST,
        message: res.data?.message || 'Không tìm thấy thông tin người tặng!',
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

  @flow *linkExchange(phone: string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.linkExchange(phone, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        return res.data
      }
      return {
        errorCode: res.data?.status || HttpStatusCode.BAD_REQUEST,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      console.log(`🚀 ~ file: auth.store.ts ~ line 411 ~ AuthStore ~ @flow*linkExchange ~ error`, error)
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *verifyLinkExchange(phone: string, otp: string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.verifyLinkExchange(phone, otp, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        this.getCustomerInfo()
        return res.data
      }
      return {
        errorCode: res.data?.status || HttpStatusCode.BAD_REQUEST,
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

  @flow *updateIsRead(id: number) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield userServices.updateIsRead(id, this.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code === 0) {
        // const _params: NotificationParams = {
        //   ...this.params,
        //   skip: 0,
        //   limit: this.pagination.limit,
        // }
        // this.getListNotificationAll(_params)
        // this.getListNotificationPersonal(_params)
        const checkExist = this.notificationPersonal[this.notificationPersonal.findIndex((obj) => obj.id == id)]
        if (checkExist) {
          this.notificationPersonal[this.notificationPersonal.findIndex((obj) => obj.id == id)].isRead = 1
        } else {
          this.notificationAll[this.notificationAll.findIndex((obj) => obj.id == id)].isRead = 1
        }
        this.getNotiCount()
        return res.data
      }
      return {
        errorCode: res.data?.status || HttpStatusCode.BAD_REQUEST,
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

  @action setHasEnd(_data: {
    [ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM]?: boolean
    [ORDER_ITEM_STATUS.SHIPPING]?: boolean
    [ORDER_ITEM_STATUS.COMPLETED]?: boolean
    [ORDER_ITEM_STATUS.CANCELED]?: boolean
  }) {
    const _hasEnd = clone(this.hasEnd)
    Object.assign(_hasEnd, _data)
    this.hasEnd = _hasEnd
  }

  @flow *getListOrderShipsWaitForAdminConfirm(params: ListOrderShipParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramWaitForAdminConfirm: ListOrderShipParams = {
        ...params,
        status: ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM,
      }
      const res: IApiResponse<ResponseType<OrderShipItem[]>> = yield userServices.getListOrderShips(
        paramWaitForAdminConfirm,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.listOrderShipsWaitForAdminConfirm = res.data?.data as OrderShipItem[]
        } else {
          this.listOrderShipsWaitForAdminConfirm = [
            ...this.listOrderShipsWaitForAdminConfirm,
            ...((res.data?.data as OrderShipItem[]) ?? []),
          ]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[params.status] == false) {
            this.setHasEnd({
              [params.status]: true,
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
  @flow *getListOrderShipsShipping(params: ListOrderShipParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramWaitForAdminConfirm: ListOrderShipParams = {
        ...params,
        status: ORDER_ITEM_STATUS.SHIPPING,
      }
      const res: IApiResponse<ResponseType<OrderShipItem[]>> = yield userServices.getListOrderShips(
        paramWaitForAdminConfirm,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.listOrderShipsShipping = res.data?.data as OrderShipItem[]
        } else {
          this.listOrderShipsShipping = [...this.listOrderShipsShipping, ...((res.data?.data as OrderShipItem[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[params.status] == false) {
            this.setHasEnd({
              [params.status]: true,
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
  @flow *getListOrderShipsCompleted(params: ListOrderShipParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramWaitForAdminConfirm: ListOrderShipParams = {
        ...params,
        status: ORDER_ITEM_STATUS.COMPLETED,
      }
      const res: IApiResponse<ResponseType<OrderShipItem[]>> = yield userServices.getListOrderShips(
        paramWaitForAdminConfirm,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.listOrderShipsCompleted = res.data?.data as OrderShipItem[]
        } else {
          this.listOrderShipsCompleted = [
            ...this.listOrderShipsCompleted,
            ...((res.data?.data as OrderShipItem[]) ?? []),
          ]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[params.status] == false) {
            this.setHasEnd({
              [params.status]: true,
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
  @flow *getListOrderShipsCanceled(params: ListOrderShipParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramWaitForAdminConfirm: ListOrderShipParams = {
        ...params,
        status: ORDER_ITEM_STATUS.CANCELED,
      }
      const res: IApiResponse<ResponseType<OrderShipItem[]>> = yield userServices.getListOrderShips(
        paramWaitForAdminConfirm,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.listOrderShipsCanceled = res.data?.data as OrderShipItem[]
        } else {
          this.listOrderShipsCanceled = [...this.listOrderShipsCanceled, ...((res.data?.data as OrderShipItem[]) ?? [])]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd[params.status] == false) {
            this.setHasEnd({
              [params.status]: true,
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

  @flow *getListNotificationPersonal(params: NotificationParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramAll: NotificationParams = {
        ...params,
        // type: NOTIFICATION_TYPE.PERSONAL,
        type: 'all',
      }
      const resAll: IApiResponse<ResponseType<any>> = yield userServices.getListNotification(paramAll, this.token)
      const paramPersonal: NotificationParams = {
        ...params,
        // type: NOTIFICATION_TYPE.PERSONAL,
        type: 'personal',
      }
      const resPersonal: IApiResponse<ResponseType<any>> = yield userServices.getListNotification(
        paramPersonal,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (
        resAll.status === HttpStatusCode.OK &&
        resAll.data &&
        resAll.data.code == 0 &&
        resPersonal.status === HttpStatusCode.OK &&
        resPersonal.data &&
        resPersonal.data.code == 0
      ) {
        this.caculateParams(resAll.data?.total + resPersonal.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.notificationPersonal = resAll.data?.data
            .concat(resPersonal.data?.data)
            .filter((item) => item.action == 'voucher' || item.action == 'url' || item.action == 'product')
            .sort(function (x, y) {
              return x.createdAt - y.createdAt
            }) as any
        } else {
          this.notificationPersonal = [
            ...this.notificationPersonal,
            ...((resAll.data?.data
              .concat(resPersonal.data?.data)
              .filter((item) => item.action == 'voucher' || item.action == 'url' || item.action == 'product')
              .sort(function (x, y) {
                return x.createdAt - y.createdAt
              }) as any) ?? []),
          ]
        }
        if (resAll.data?.data?.push(resPersonal.data?.data).length == 0) {
          if (this.hasEnd[params.type] == false) {
            this.setHasEnd({
              [params.type]: true,
            })
          }
        }
        return resAll.data
      }
      return resAll?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListNotificationAll(params: NotificationParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const paramAll: NotificationParams = {
        ...params,
        // type: NOTIFICATION_TYPE.PERSONAL,
        type: 'all',
      }
      const resAll: IApiResponse<ResponseType<any>> = yield userServices.getListNotification(paramAll, this.token)
      const paramPersonal: NotificationParams = {
        ...params,
        // type: NOTIFICATION_TYPE.PERSONAL,
        type: 'personal',
      }
      const resPersonal: IApiResponse<ResponseType<any>> = yield userServices.getListNotification(
        paramPersonal,
        this.token
      )
      this.state = 'done'
      this.root.loading = false
      if (
        resAll.status === HttpStatusCode.OK &&
        resAll.data &&
        resAll.data.code == 0 &&
        resPersonal.status === HttpStatusCode.OK &&
        resPersonal.data &&
        resPersonal.data.code == 0
      ) {
        this.caculateParams(resAll.data?.total + resPersonal.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.notificationAll = resAll.data?.data
            .concat(resPersonal.data?.data)
            .filter((item) => item.action == 'message')
            .sort(function (x, y) {
              return y.createdAt - x.createdAt
            }) as any
        } else {
          this.notificationAll = [
            ...this.notificationAll,
            ...(
              (resAll.data?.data.concat(resPersonal.data?.data).filter((item) => item.action == 'message') as any) ?? []
            ).sort(function (x, y) {
              return x.createdAt - y.createdAt
            }),
          ]
        }
        if (resAll.data?.data?.push(resPersonal.data?.data).length == 0) {
          if (this.hasEnd[params.type] == false) {
            this.setHasEnd({
              [params.type]: true,
            })
          }
        }
        return resAll.data
      }
      return resAll?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: AuthHydration) {
    if (data && data.accumulateHistoryTransaction) {
      this.accumulateHistoryTransaction = data.accumulateHistoryTransaction
    }
    if (data && data.exchangeHistoryTransaction) {
      this.exchangeHistoryTransaction = data.exchangeHistoryTransaction
    }
    if (data && data.listOrderShipsWaitForAdminConfirm) {
      this.listOrderShipsWaitForAdminConfirm = data.listOrderShipsWaitForAdminConfirm
    }
    if (data && data.listOrderShipsShipping) {
      this.listOrderShipsShipping = data.listOrderShipsShipping
    }
    if (data && data.listOrderShipsCompleted) {
      this.listOrderShipsCompleted = data.listOrderShipsCompleted
    }
    if (data && data.listOrderShipsCanceled) {
      this.listOrderShipsCanceled = data.listOrderShipsCanceled
    }
    if (data && data.notificationPersonal) {
      this.notificationPersonal = data.notificationPersonal
    }
    if (data && data.notificationAll) {
      this.notificationAll = data.notificationAll
    }
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
    if (data && data.notiCount) {
      this.notiCount = data.notiCount
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
    this.notiCount = '0'
    this.accumulateHistoryTransaction = []
    this.exchangeHistoryTransaction = []
    this.historyPointTransfer = []
    this.listOrderShipsWaitForAdminConfirm = []
    this.listOrderShipsShipping = []
    this.listOrderShipsCompleted = []
    this.listOrderShipsCanceled = []
    this.notificationPersonal = []
    this.notificationAll = []
  }

  private fetchByHistoryType(_params: HistoryTransactionParams) {
    switch (this.historyType) {
      case HISTORY_EXCHANGE_TYPE.ACCUMULATE:
        this.getHistoryTransactionAccumulate(_params)
        break
      case HISTORY_EXCHANGE_TYPE.EXCHANGE:
        this.getHistoryTransactionExchange(_params)
        break
      default:
        this.getHistoryTransactionAccumulate(_params)
        break
    }
  }

  private fetchByOrderItemsType(_params: ListOrderShipParams) {
    switch (this.orderItemType) {
      case ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM:
        this.getListOrderShipsWaitForAdminConfirm(_params)
        break
      case ORDER_ITEM_STATUS.SHIPPING:
        this.getListOrderShipsShipping(_params)
        break
      case ORDER_ITEM_STATUS.COMPLETED:
        this.getListOrderShipsCompleted(_params)
        break
      case ORDER_ITEM_STATUS.CANCELED:
        this.getListOrderShipsCanceled(_params)
        break
      default:
        this.getListOrderShipsWaitForAdminConfirm(_params)
        break
    }
  }

  private fetchByNotificationType(_params: NotificationParams) {
    switch (this.notificationType) {
      case NOTIFICATION_TYPE.PERSONAL:
        this.getListNotificationPersonal(_params)
        break
      case NOTIFICATION_TYPE.ALL:
        this.getListNotificationAll(_params)
        break
      default:
        this.getListNotificationAll(_params)
        break
    }
  }

  private caculateParams(total: number) {
    const _pagination = clone(this.pagination)
    this.pagination = {
      ..._pagination,
      totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
    }
  }
}
