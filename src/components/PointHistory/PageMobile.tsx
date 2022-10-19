import React, { FC, useState, useEffect } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import { observer, inject } from 'mobx-react'
import moment from 'dayjs'
import numeral from 'numeral'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
registerLocale('vi', vi)
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import FooterMobile from '@src/components/common/FooterMobile'
import { AuthHydration } from '@src/stores/auth.store'
import { flowResult, reaction } from 'mobx'
import PageLoading from '@src/helpers/PageLoading'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import isEqual from 'lodash/isEqual'
import { HISTORY_EXCHANGE_TYPE } from '@src/interfaces/enums'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  authStore?: AuthHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const disposers = []
  const { authStore, loading } = props
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 1))),
    [startDateInput, setStartDateInput] = useState(moment(new Date().setDate(new Date().getDate() - 1))),
    [endDate, setEndDate] = useState(new Date()),
    [endDateInput, setEndDateInput] = useState(moment(new Date()))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
    addHistory()
    const datePickers = document.getElementsByClassName('react-datepicker__input-container')

    Array.from(datePickers).forEach((el) =>
      // @ts-ignore
      el.childNodes[0].setAttribute('readOnly', true)
    )
  }, [])

  const addHistory = async () => {
    historyAccumulate()
  }
  const historyAccumulate = async () => {
    changHistoryType(HISTORY_EXCHANGE_TYPE.ACCUMULATE)
    const fromTime = Number(startDateInput.valueOf())
    const toTime = Number(endDateInput.valueOf())
    authStore?.setParams({
      fromTime,
      toTime,
    })
    const data = {
      type: 'accumulate',
      fromTime: Number(startDateInput.valueOf()),
      toTime: Number(endDateInput.valueOf()),
      skip: 0,
      limit: 10,
    }
    const resHistory = await flowResult<any>(authStore.getHistoryTransactionAccumulate?.(data))
    if (resHistory?.code == 0) {
      // setAccumulateList(resHistory?.data)
    }
  }
  // const historyExchange = async () => {
  //   const data = {
  //     type: 'exchange',
  //     fromTime: Number(startDateInput.valueOf()),
  //     toTime: Number(endDateInput.valueOf()),
  //     skip: 0,
  //     limit: 10,
  //   }
  //   const resHistory = await flowResult<any>(
  //     authStore.getHistoryTransactionExchange?.(data)
  //   )
  //   if (resHistory?.code == 0) {
  //     // setExchangeList(resHistory?.data)
  //   }
  // }

  const handleLoadMore = () => {
    authStore?.loadMore()
  }
  const hasMoreItems = authStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const filterPoint = () => {
    const fromTime = Number(startDateInput.valueOf())
    const toTime = Number(endDateInput.valueOf())
    authStore?.setParams({
      fromTime,
      toTime,
    })
  }

  const changHistoryType = (vType: HISTORY_EXCHANGE_TYPE) => {
    authStore.setHistoryType(vType)
  }

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => authStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            authStore?.filter()
          }
        }
      )
    )
    disposers.push(
      reaction(
        () => authStore.isChangeHistoryType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            authStore?.filter()
          }
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Lịch sử điểm'} />
        <div className="container">
          <div className="md-point-history">
            <div className="is-row clearfix">
              <div className="form-group">
                <DatePicker
                  locale="vi"
                  selected={startDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => {
                    setStartDate(date)
                    setStartDateInput(moment(date))
                  }}
                />
              </div>
              <div className="form-group">
                <DatePicker
                  locale="vi"
                  selected={endDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => {
                    setEndDate(date)
                    setEndDateInput(moment(date))
                  }}
                />
              </div>
            </div>
            <button className="btn btn-secondary" onClick={filterPoint}>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="md-point-historytab">
          <div className="is-tab">
            <ul className="clearfix">
              <li
                onClick={() => changHistoryType(HISTORY_EXCHANGE_TYPE.ACCUMULATE)}
                className={`${authStore?.historyType == HISTORY_EXCHANGE_TYPE.ACCUMULATE ? 'active' : ''}`}
              >
                <span>Tích điểm</span>
              </li>
              <li
                onClick={() => changHistoryType(HISTORY_EXCHANGE_TYPE.EXCHANGE)}
                className={`${authStore?.historyType == HISTORY_EXCHANGE_TYPE.EXCHANGE ? 'active' : ''}`}
              >
                <span>Sử dụng điểm</span>
              </li>
            </ul>
          </div>
          <div className="is-tabcontent">
            <ul className="clearfix">
              {authStore?.activeHistoryArr?.length <= 0 && !loading ? (
                <div>Không có giao dịch nào</div>
              ) : (
                (authStore?.activeHistoryArr || []).map((item, idx) => {
                  return (
                    <li
                      ref={authStore?.activeHistoryArr?.length == idx + 1 ? lastElementRef : null}
                      key={`pointhistory-${moment(item.createdAt).format('DD/MM/YYYY')}-${idx}`}
                    >
                      <div className="is-left">
                        <b>{moment(item.createdAt).format('DD/MM/YYYY')}</b>
                        <span>{item.description}</span>
                      </div>
                      <div className="is-right">{numeral(item.amount).format('#,#')} điểm</div>
                      <div className="is-right">
                        Tổng:
                        <br />
                        {numeral(item.balance).format('#,#')} điểm
                      </div>
                    </li>
                  )
                })
              )}
              {loading ? <PageLoading style={{ height: '150px' }} /> : null}
            </ul>
          </div>
        </div>
        {/* <FooterMobile activeMenu={4} /> */}
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  loading: store.loading,
}))(observer(PageMobile))
