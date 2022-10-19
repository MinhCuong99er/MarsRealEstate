import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import Breadcrumb from '@src/components/common/Breadcrumb'
import { VoucherHydration } from '@src/stores/voucher.store'
import get from 'lodash/get'
import numeral from 'numeral'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageDesktopProps {
  voucherStore?: VoucherHydration
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { voucherStore } = props
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)

  const voucherDetailData = voucherStore.detail
  const voucherInfo = get(voucherDetailData, 'voucherInfo', {}) || {}
  const partnerInfo = get(voucherDetailData, 'partnerInfo', {}) || {}

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <Breadcrumb nameLink={'Ưu đãi khóa học'} link={'/uu-dai-khoa-hoc'} />
          <div className="container">
            <div className="d-offer-detail">
              <div className="d-offer-detail__top">
                <div className="d-offer-detail__top__img">
                  <Swiper spaceBetween={0} slidesPerView={1} loop={true}>
                    {get(voucherInfo, 'images', '').map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <img src={item} />
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
                <div className="d-offer-detail__top__title">
                  <div className="d-offer-detail__top__title__left">
                    <img src={get(partnerInfo, 'logo', '')} />
                    <span>{get(partnerInfo, 'name', '')}</span>
                  </div>
                  {/* <div className="d-offer-detail__top__title__right">
                    <img src="/images/charity2-love.png" />
                    <a href="/#">
                      <img src="/images/charity2-share.png" />
                    </a>
                  </div> */}
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${get(voucherInfo, 'description', '')}`,
                    }}
                    className="b-maincontent"
                  ></div>
                </div>
                <div className="d-offer-detail__mid__bot">
                  {voucherInfo?.paymentPoint ? (
                    <div className="d-offer-detail__mid__bot__left">
                      <span>Số điểm cần mua </span>
                      <i>
                        {numeral(get(voucherInfo, 'paymentPoint', '') ?? 0).format('0,0')}
                        <span className="c-pointlogo">đ</span>
                      </i>
                    </div>
                  ) : (
                    <div className="d-offer-detail__mid__bot__left">
                      <i>Miễn phí</i>
                    </div>
                  )}
                  <div className="d-offer-detail__mid__bot__right">
                    <button onClick={() => router.push(`/doi-qua/${get(voucherInfo, 'id', '') ?? 0}/chi-tiet`)}>
                      Mua khóa học
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Chi tiết khóa học</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
                    <pre className="b-maincontent">{get(voucherInfo, 'description', '')}</pre>
                    {/* <span style={{ marginTop: '3%', display: 'block' }}>
                      <b>Thời gian áp dụng:</b> Từ 20/08/2021 đến hết
                      01/11/2021.
                    </span> */}
                  </div>
                </div>
              </div>
              {/* <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Cách nhận và sử dụng Voucher</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
                    <div>
                      <p>Bước 1: Vào phần Loyalty trên App VnDirect</p>
                      <p>Bước 2: Chọn mục Sức khoẻ.</p>
                      <p>
                        Bước 3: Chọn voucher Khoá học Yoga online cùng
                        California Fitness & Yoga Centers giảm thêm 30%.
                      </p>
                      <p>Bước 4: Nhấn Nhận ngay để nhận mã voucher.</p>
                      <p>
                        Bước 5: Nhập mã voucher khi đăng ký khóa học tại Link
                        Yoga Fat Loss hoặc Link Yoga Sleep để sử dụng ưu đãi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Điều kiện áp dụng</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
                    <span>
                      - Áp dụng 01 voucher/hóa đơn.
                      <br />
                      <br />- Mỗi voucher có giá trị sử dụng 01 lần.
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Về California Fitness & Yoga Centers</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
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
              </div> */}
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
      <Modal show={showModal} onHide={handleClose} centered className="m-modal-charity is-maxwidth">
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
                height={50}
                width={1.2}
                fontSize={13}
                textMargin={2}
                textSpacing={5}
                background={'transparent'}
              />
            </div>
            <div className="m-accumulatepoint-modal__content__qrcode" style={{ margin: '6% 0' }}>
              <QRCode value="17754883920" bgColor={'transparent'} size={190} />
            </div>
            <button onClick={handleClose} className="m-accumulatepoint-modal__content__btn">
              <span>Đóng</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
}))(observer(PageDesktop))
