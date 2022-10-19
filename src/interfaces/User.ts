import { GENDER } from './enums'

export interface IUserResponse {
  code: number
  message: number
  accessToken?: string
  userInfo?: User
  customerInfo?: User
  calculateTier?: CalculateTier
  tierInfos?: Array<TierInfos>
}

export interface IUserNoti {
  code: number
  message: number
  count?: number
}

export interface User {
  address?: string
  avatar?: string
  birth?: number
  codeCount?: number
  contact?: number
  createdAt: 1634288570437
  districtId?: number
  email?: string
  exchangeId?: string
  gender?: GENDER
  id: number
  inviteCode?: number
  name?: string
  phone?: string
  point?: number
  provinceId: number
  tierId?: number
  updatedAt?: number
  vndAccno?: Array<Record<string, any>>
  vndCustId?: string
  vndUsername?: string
  wardId?: number
  // tổng đã sử dụng
  totalUsage?: number
  // tổng đã tích
  totalReverse?: number
  countNotiUnRead?: number
  mpoint?: number
  totalMpoint?: number
}

export interface CalculateTier {
  currentTier?: Record<string, any>
  nextTier?: Record<string, any>
  nextTierPoint?: number
  tierMessage?: string
  tierProgress?: number
}

export interface TierInfos {
  activeImage?: string
  backgroudImage?: string
  cardImage?: string
  createdAt?: number
  description?: string
  id: number
  inactiveImage?: string
  name: string
  updatedAt?: number
  upgradePoint?: number
}
