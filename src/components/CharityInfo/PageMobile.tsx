import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import Modal from 'react-bootstrap/Modal'
import { CharityHydration } from '@src/stores/charity.store'
import { flowResult } from 'mobx'
import get from 'lodash/get'
import moment from 'dayjs'
import { toastUtil } from '@src/helpers/Toast'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import numeral from 'numeral'
import PageLoading from '@src/helpers/PageLoading'
import NumberFormat from 'react-number-format'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  charityStore?: CharityHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { charityStore, loading } = props
  // const [active, setActive] = useState(true)
  // const [activeTab, setActiveTab] = useState('detail')
  const [showModal, setShowModal] = useState(false)
  const [pointDonate, setPointDonate] = useState<string>()
  const [tabActive, setTabActive] = useState<number>(1)
  const [activeBtnCharity, setActiveBtnCharity] = useState<boolean>(true)

  const handleClose = () => setShowModal(false)

  const setPointDonateA = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '')
    setPointDonate(val)
  }

  const addCharityPoint = async () => {
    if (!pointDonate) {
      toastUtil.error('Thiếu số điểm đóng góp!')
    } else {
      if (activeBtnCharity) {
        setActiveBtnCharity(false)
        const resDoDonate = await flowResult<any>(
          charityStore.doDonate?.(get(charityStore?.detail, 'id', ''), Number(pointDonate))
        )
        if (resDoDonate.code != 0) {
          toastUtil.error(resDoDonate.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
        } else {
          toastUtil.success(resDoDonate.message || 'Xác thực thành công!')
          setShowModal(false)
        }
        setActiveBtnCharity(true)
      }
    }
  }

  const handleLoadMore = () => {
    charityStore?.loadMoreDonates()
  }

  const hasMoreItems = charityStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const openContribute = () => {
    if (pointDonate) {
      setShowModal(true)
    } else {
      toastUtil.error('Bạn chưa nhập số điểm đóng góp')
    }
  }
  return (
    <>
      <div className="m-body">
        <HeaderMobile title={'Từ thiện vì cộng đồng'} />
        <div className="m-charity">
          <div className="m-charity__top">
            <div className="m-charity__top__img">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
              >
                {get(charityStore?.detail, 'images', '').map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img src={item} />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
            <div className="m-charity__top__text">
              <div className="m-charity__top__text__left">
                <span>{get(charityStore?.detail, 'name', '')}</span>
              </div>
              {/* <div className="m-charity__top__text__right">
                <img src="/images/charity2-love.png" />
                <a href="/#">
                  <img src="/images/charity2-share.png" />
                </a>
              </div> */}
            </div>
          </div>
          <div className="m-charity__mid">
            <span>
              Thời gian áp dụng: Từ {moment(get(charityStore?.detail, 'fromDate', '')).format('DD-MM-YYYY')} đến hết{' '}
              {moment(get(charityStore?.detail, 'toDate', '')).format('DD-MM-YYYY')}.
            </span>
            <div className="md-contribute">
              <span className="is-title">Số điểm đóng góp</span>
              <div className="md-contribute__row">
                <div className="form-group is-text">
                  <NumberFormat
                    value={pointDonate}
                    onChange={setPointDonateA}
                    className="form-control"
                    placeholder="Nhập số điểm"
                    thousandSeparator={true}
                  />
                </div>
                <button onClick={openContribute}>Đóng góp</button>
              </div>
            </div>
          </div>
          <div className="m-charity__bot">
            <div className="c-component-tab">
              <ul className="clearfix">
                <li className={`${tabActive == 1 ? 'active' : ''}`} onClick={() => setTabActive(1)}>
                  <span>Chi tiết</span>
                </li>
                <li className={`${tabActive == 2 ? 'active' : ''}`} onClick={() => setTabActive(2)}>
                  <span>Danh sách đóng góp</span>
                </li>
                <li className={`${tabActive == 3 ? 'active' : ''}`} onClick={() => setTabActive(3)}>
                  <span>Danh sách giải ngân</span>
                </li>
              </ul>
            </div>
            {tabActive == 1 ? (
              <pre className="m-charity__bot__content b-maincontent">
                {get(charityStore?.detail, 'description', '')}
              </pre>
            ) : null}
            {tabActive == 2 ? (
              <div className="md-charity-donates is-box">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Họ tên</th>
                      <th scope="col">Số điểm đã đóng góp</th>
                      <th scope="col">Ngày đóng góp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charityStore?.donates.map((item, index) => {
                      return (
                        <tr
                          ref={charityStore?.donates.length == index + 1 ? lastElementRef : null}
                          key={`key-${item.name}-${item.id}`}
                        >
                          <th>{index + 1}.</th>
                          <th>
                            Họ tên: <b>{get(item, 'customerName', '') ?? 'Anonymous'}</b>
                          </th>
                          <th>
                            {' '}
                            Số điểm đã đóng góp: <b>{numeral(get(item, 'point', '')).format('#,#')} điểm</b>
                          </th>
                          <th>
                            Ngày đóng góp: <b>{moment(get(item, 'createdAt', '')).format('DD-MM-YYYY')}</b>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {loading ? <PageLoading style={{ height: '150px' }} /> : null}
              </div>
            ) : null}
            {tabActive == 3 ? (
              <pre className="m-charity__bot__content b-maincontent">
                {get(charityStore?.detail, 'disbursement', '')}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} centered className="m-modal-charity">
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modalbody">Bạn có muốn đóng góp {numeral(pointDonate).format('#,#')} điểm?</div>
          </div>
          <div className="m-modal-charity__btn">
            {/* <button onClick={addCharityPoint} style={{ background: '#ee0033' }}> */}
            <button onClick={addCharityPoint} style={{ background: '#141ed2' }}>
              Đóng góp
            </button>
            <button onClick={() => setShowModal(false)} style={{ background: '#818285' }}>
              Huỷ
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default inject(({ store }) => ({
  charityStore: store?.charityStore,
  loading: store.loading,
}))(observer(PageMobile))
