import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import Modal from 'react-bootstrap/Modal'
import Breadcrumb from '@src/components/common/Breadcrumb'
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

interface PageDesktopProps {
  charityStore?: CharityHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { charityStore, loading } = props
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
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <Breadcrumb nameLink={'Đóng góp vì cộng đồng'} link={'/tu-thien-vi-cong-dong'} />
          <div className="container">
            <div className="d-charity-detail">
              <div className="d-charity-detail__top">
                <div className="d-charity-detail__top__img">
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
                <div className="d-charity-detail__top__title">
                  <div className="d-charity-detail__top__title__left">
                    <span>{get(charityStore?.detail, 'name', '')}</span>
                  </div>
                  {/* <div className="d-charity-detail__top__title__right">
                    <img src="/images/charity2-love.png" />
                    <a href="/#">
                      <img src="/images/charity2-share.png" />
                    </a>
                  </div> */}
                </div>
              </div>
              <div className="d-charity-detail__mid">
                <div className="d-charity-detail__mid__text">
                  <span>
                    <span>
                      Thời gian áp dụng: Từ {moment(get(charityStore?.detail, 'fromDate', '')).format('DD-MM-YYYY')} đến
                      hết {moment(get(charityStore?.detail, 'toDate', '')).format('DD-MM-YYYY')}.
                    </span>
                  </span>
                  <div className="md-contribute clearfix">
                    <div className="form-group is-text">
                      <NumberFormat
                        value={pointDonate}
                        onChange={setPointDonateA}
                        className="form-control"
                        placeholder="Nhập số điểm"
                        thousandSeparator={true}
                      />
                    </div>
                    <div className="d-charity-detail__mid__btn">
                      <button onClick={openContribute}>Đóng góp</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-charity-detail__bot">
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
                  <div className="md-charity-donates">
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
                              <th>{index + 1}</th>
                              <th>{get(item, 'customerName', '') ?? 'Anonymous'}</th>
                              <th> {numeral(get(item, 'point', '')).format('#,#')} điểm</th>
                              <th>{moment(get(item, 'createdAt', '')).format('DD-MM-YYYY')}</th>
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
        </div>
        <FooterDesktop />
      </div>
      <Modal show={showModal} onHide={handleClose} centered className="m-modal-charity">
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modalbody">Bạn có muốn đóng góp {numeral(pointDonate).format('#,#')} điểm?</div>
          </div>
          <div className="m-modal-charity__btn">
            <button onClick={addCharityPoint} style={{ background: '#F58323' }}>
              Đóng góp
            </button>
            <button onClick={() => setShowModal(false)} style={{ background: '#818285' }}>
              Huỷ
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  charityStore: store?.charityStore,
  loading: store.loading,
}))(observer(PageDesktop))
