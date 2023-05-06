import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { IApiResponse } from '@src/utils/request'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { IBanner } from '@src/interfaces/Global'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'
import { STATE } from '@src/interfaces/enums'

export type GlobalHydration = {
  state?: STATE
  banners?: Array<IBanner>
  bannerSorted?: Array<IBanner>

  setBanners?: (_data: Array<IBanner>) => void
  getListBanner?: () => Promise<IApiResponse<ResponseType<IBanner>>>
}

export default class GlobalStore {
  @observable state = STATE.PENDING
  @observable root: RootStore
  @observable banners: Array<IBanner> = []

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setBanners(_data: Array<IBanner>) {
    this.banners = _data
  }

  @computed get bannerSorted() {
    const _banners = this.banners
    return _banners.slice().sort((a, b) => a.sequence - b.sequence)
  }

  @flow *getListBanner() {
    this.state = STATE.PROCESSING
    try {
      const res: IApiResponse<ResponseType<IBanner>> = yield globalServices.getListBanner(this.root.authStore.token)
      this.state = STATE.DONE
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.banners = res.data?.data as IBanner[]
        return res.data
      }
      return {
        errorCode: res.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = STATE.ERROR
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: GlobalHydration) {
    if (data && data.banners) {
      this.banners = data.banners
    }
  }
}
