import React, { FC, useState } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import { observer, inject } from 'mobx-react'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import { VoucherHydration } from '@src/stores/voucher.store'
import get from 'lodash/get'
import numeral from 'numeral'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import moment from 'dayjs'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  voucherStore?: VoucherHydration
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { voucherStore } = props
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)

  const voucherDetailData = voucherStore.detail
  const voucherInfo = get(voucherDetailData, 'voucherInfo', {}) || {}
  const partnerInfo = get(voucherDetailData, 'partnerInfo', {}) || {}

  return (
    <>
      <div className="m-body">
        <HeaderMobile title={'Chi tiết khoá học'} />
        <div className="m-offer">
          <div className="m-offer__top">
            <div className="m-offer__top__img">
              <Swiper spaceBetween={0} slidesPerView={1} loop={true}>
                {get(voucherInfo, 'images', '').map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="m-offer__top__img__outer">
                        <img src={item} />
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
            <div className="m-offer__top__text">
              <div className="m-offer__top__text__left">
                <img src={get(partnerInfo, 'logo', '')} />
                <span>{get(partnerInfo, 'name', '')}</span>
              </div>
              {/* <div className="m-offer__top__text__right">
                <img src="/images/charity2-love.png" />
                <a href="/#">
                  <img src="/images/charity2-share.png" />
                </a>
              </div> */}
            </div>
          </div>
          <div className="m-offer__mid">
            <div className="m-offer__mid__top">
              <span>{get(voucherInfo, 'name', '')}</span>
            </div>
            <div className="m-offer__mid__bot">
              {voucherInfo?.paymentPoint ? (
                <div className="is-text">
                  <span>Số điểm cần mua </span>
                  <span>
                    {numeral(get(voucherInfo, 'paymentPoint', '') ?? 0).format('0,0')} Vnđ
                    {/* <span className="c-pointlogo">L</span> */}
                  </span>
                </div>
              ) : (
                <div className="is-text">
                  <span>Miễn phí</span>
                </div>
              )}
              <button onClick={() => router.push(`/doi-qua/${get(voucherInfo, 'id', '') ?? 0}/chi-tiet`)}>
                Mua khóa học
              </button>
            </div>
          </div>
          <div className="m-offer__bot">
            <ul>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Chi tiết khóa học</span>
                  </div>
                  <div className="is-text__content" style={{ lineHeight: '1.4' }}>
                    <span>
                      Thương hiệu: {get(partnerInfo, 'name', '') || 'Đang cập nhật'}
                      <br />
                      Ngày bắt đầu: {moment(get(voucherInfo, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Ngày kết thúc: {moment(get(voucherInfo, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Khu vực: {get(voucherInfo, 'area', '') || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Mô tả khóa học</span>
                  </div>
                  <div className="is-text__content">
                    <pre className="b-maincontent">{get(voucherInfo, 'description', '')}</pre>
                  </div>
                </div>
              </li>
              {/* <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Điều kiện áp dụng</span>
                  </div>
                  <div className="is-text__content">
                    <span>
                      - Áp dụng 01 voucher/hóa đơn.
                      <br />
                      - Mỗi voucher có giá trị sử dụng 01 lần.
                      <br />
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Về California Fitness & Yoga Centers</span>
                  </div>
                  <div className="is-text__content">
                    <span>
                      Ra đời từ năm 2007, California Fitness & Yoga Centers là
                      nhà cung cấp dịch vụ thể dục thể hình quốc tế đầu tiên và
                      lớn nhất tại Việt Nam, phục vụ hơn 250,000 hội viên với hệ
                      thống 36 phòng tập trên toàn quốc và hơn 6 triệu lượt tập
                      luyện mỗi năm. Năm 2021, California Fitness & Yoga Centers
                      đã cho ra mắt các chương trình online trên nền tảng Zoom
                      để mọi người có thể rèn luyện sức khỏe thể chất lẫn tinh
                      thần tại nhà.
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Địa chỉ áp dụng:</span>
                  </div>
                  <div className="is-text__content">
                    <span>
                      - SHOP1: …..
                      <br />- SHOP1: …..
                    </span>
                  </div>
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} centered className="m-accumulatepoint-modal">
        <Modal.Body>
          <div className="m-accumulatepoint-modal__content">
            <div className="m-accumulatepoint-modal__content__text">
              <span>
                Quý khách vui lòng đưa mã cho <br />
                nhân viên thu ngân để tích thêm điểm
              </span>
            </div>
            <div className="m-accumulatepoint-modal__content__barcode">
              <Barcode
                value="17754883920"
                displayValue={true}
                background={'transparent'}
                height={50}
                width={1.2}
                fontSize={13}
                textMargin={2}
                textSpacing={5}
              />
            </div>
            <div className="m-accumulatepoint-modal__content__qrcode">
              <QRCode value="17754883920" bgColor={'transparent'} size={190} />
            </div>
            <button onClick={handleClose} className="m-accumulatepoint-modal__content__btn">
              <span>Đóng</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
}))(observer(PageMobile))
