import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import RootStore from './RootStore'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { IApiResponse } from '@src/utils/request'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { IBanner, ICategory, IQuestionAnswer, ISearchResult } from '@src/interfaces/Global'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'
import { ACTIVE_TAB_SWAPGIFT_PAGE, CartType, STATE } from '@src/interfaces/enums'

export type GlobalHydration = {
  state?: STATE
  list?: Array<ISearchResult>
  banners?: Array<IBanner>
  bannerSorted?: Array<IBanner>
  voucherCategories?: Array<ICategory>
  productCategories?: Array<ICategory>
  questionAnswers?: Array<IQuestionAnswer>
  activeTabSwapGiftPage?: ACTIVE_TAB_SWAPGIFT_PAGE

  setList?: (_data: ISearchResult) => void
  setBanners?: (_data: Array<IBanner>) => void
  setVoucherCategories?: (_data: Array<ICategory>) => void
  setProductCategories?: (_data: Array<ICategory>) => void
  setQuestionAnswers?: (_data: Array<IQuestionAnswer>) => void
  setActiveTabSwapGiftPage?: (_data: ACTIVE_TAB_SWAPGIFT_PAGE) => void
  doSearch?: (text: string) => Promise<IApiResponse<ResponseType<ISearchResult>>>
  getListBanner?: () => Promise<IApiResponse<ResponseType<IBanner>>>
}

export default class GlobalStore {
  @observable state = 'pending'
  @observable stateInvite = 'pending'
  @observable root: RootStore
  // result search autocomplete
  @observable list: Array<ISearchResult> = []
  @observable banners: Array<IBanner> = []
  @observable voucherCategories: Array<ICategory> = []
  @observable productCategories: Array<ICategory> = []
  @observable questionAnswers: Array<IQuestionAnswer> = []
  @observable activeTabSwapGiftPage: ACTIVE_TAB_SWAPGIFT_PAGE = ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER

  @observable transactionCode: { code?: string; ttl?: number } = null

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setList(_data: Array<ISearchResult>) {
    this.list = _data
  }

  @action setBanners(_data: Array<IBanner>) {
    this.banners = _data
  }

  @action setVoucherCategories(_data: Array<ICategory>) {
    this.voucherCategories = _data
  }

  @action setProductCategories(_data: Array<ICategory>) {
    this.productCategories = _data
  }

  @action setQuestionAnswers(_data: Array<IQuestionAnswer>) {
    this.questionAnswers = _data
  }

  @action setActiveTabSwapGiftPage(_data: ACTIVE_TAB_SWAPGIFT_PAGE) {
    this.activeTabSwapGiftPage = _data
  }

  @computed get bannerSorted() {
    const _banners = this.banners
    // return _banners
    return _banners.slice().sort((a, b) => a.sequence - b.sequence)
  }

  @flow *doSearch(text: string) {
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<ISearchResult>> = yield globalServices.search(
        text,
        this.root.authStore.token
      )
      this.state = 'done'
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.list = res.data?.data as ISearchResult[]
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListBanner() {
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<IBanner>> = yield globalServices.getListBanner(this.root.authStore.token)
      this.state = 'done'
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.banners = res.data?.data as IBanner[]
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListCaregory(type: CartType = CartType.VOUCHER) {
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<ICategory>> = yield globalServices.getListCategory(
        type,
        this.root.authStore.token
      )
      this.state = 'done'
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        if (type == CartType.PRODUCT) {
          this.productCategories = res.data?.data as ICategory[]
        } else {
          this.voucherCategories = res.data?.data as ICategory[]
        }
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *putInvite<T extends any>(
    code: string
  ): Generator<
    any,
    | ResponseType<T>
    | {
        errorCode: number
        message: string
      },
    any
  > {
    this.stateInvite = 'processing'
    try {
      const res: IApiResponse<ResponseType<T>> = yield globalServices.putInvite<T>(code, this.root.authStore.token)
      this.stateInvite = 'done'
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        const _auth = clone(this.root.authStore.auth)
        this.root.authStore.setAuth({
          auth: {
            ..._auth,
            invideCode: code,
          },
        })
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: (res.data?.message || DEFAULT_ERROR_MESSAGE) as string,
      }
    } catch (error) {
      this.stateInvite = 'error'
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getTransactionCode<T extends any>(): Generator<
    any,
    | ResponseType<T>
    | {
        errorCode: number
        message: string
      },
    any
  > {
    this.stateInvite = 'processing'
    try {
      const res: IApiResponse<ResponseType<T>> = yield globalServices.getTransactionCode<T>(this.root.authStore.token)
      this.stateInvite = 'done'
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.transactionCode = res.data.data as any
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: (res.data?.message || DEFAULT_ERROR_MESSAGE) as string,
      }
    } catch (error) {
      this.stateInvite = 'error'
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: GlobalHydration) {
    if (data && data.list) {
      this.list = data.list
    }
    if (data && data.banners) {
      this.banners = data.banners
    }
    if (data && data.voucherCategories) {
      this.voucherCategories = data.voucherCategories
    }
    if (data && data.productCategories) {
      this.productCategories = data.productCategories
    }
    if (data && data.questionAnswers) {
      this.questionAnswers = data.questionAnswers
    }
    if (data && data.activeTabSwapGiftPage) {
      this.activeTabSwapGiftPage = data.activeTabSwapGiftPage
    }
  }
}
