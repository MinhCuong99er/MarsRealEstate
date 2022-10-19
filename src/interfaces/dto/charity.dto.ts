import { ListParam } from './common.dto'

export interface ListCharityParams extends ListParam {
  keyword?: string
}

export interface ListCharityDonateParams extends ListParam {
  charityId?: number
}
