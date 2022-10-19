import {
  CumstomerInfoParams,
  HistoryPointTranferParams,
  HistoryTransactionParams,
  ListOrderShipParams,
  NotificationParams,
  TokenPayload,
  TransferPointParams,
} from '@src/interfaces/dto/user.dto'
import request from '@src/utils/request'

export function getCustomerInfo<T>({ voucherId, refId, phone }: TokenPayload, token) {
  return request<T>({
    // url: '/customer/login-viettel',
    url: 'customer/get-customer-info',
    options: {
      method: 'post',
      data: {
        voucherId,
        refId,
        phone,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function updateCustomerInfo<T>(info: CumstomerInfoParams, token: string) {
  return request<T>({
    url: '/customer/update-customer-info',
    options: {
      method: 'post',
      data: {
        info,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getHistoryTransaction<T>(data: HistoryTransactionParams | any, token: string) {
  return request<T>({
    url: '/point-transaction/get-history-transaction',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function checkCustomer<T>(custId: string, token: string) {
  return request<T>({
    url: '/transfer-point/check-customer',
    options: {
      method: 'post',
      data: {
        custId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function transferPoint<T>(data: TransferPointParams, token: string) {
  return request<T>({
    url: '/transfer-point/transfer',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getHistoryTranferPoint<T>(data: HistoryPointTranferParams, token: string) {
  return request<T>({
    url: '/transfer-point/history',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function linkExchange<T>(phone: string, token: string) {
  return request<T>({
    url: '/customer/link-exchange',
    options: {
      method: 'post',
      data: {
        phone,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function verifyLinkExchange<T>(phone: string, code: string, token: string) {
  return request<T>({
    url: '/customer/verify-link-exchange',
    options: {
      method: 'post',
      data: {
        phone,
        code,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getListOrderShips<T>(data: ListOrderShipParams, token: string) {
  return request<T>({
    url: '/ordership/get-list-order-ships',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getListNotification<T>(data: NotificationParams, token: string) {
  return request<T>({
    url: '/notification/get-all-notification',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getNotiCount<T>(token: string) {
  return request<T>({
    url: '/notification/get-noti-count',
    options: {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function updateIsRead<T>(id: number, token: string) {
  return request<T>({
    url: '/notification/update-is-read',
    options: {
      method: 'post',
      data: {
        id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
