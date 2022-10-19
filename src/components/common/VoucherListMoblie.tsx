import React, { FC } from 'react'
import Link from 'next/link'
import numeral from 'numeral'
import get from 'lodash/get'
import { Voucher } from '@src/interfaces/Voucher'
import { Swiper, SwiperSlide } from 'swiper/react'

interface VoucherListMoblieProps {
  data?: Array<Voucher>
}

const VoucherListMoblie: FC<VoucherListMoblieProps> = (props: VoucherListMoblieProps) => {
  const { data = [] } = props
  return (
    <div className="md-voucher-list">
      <div className="container">
        <div className="md-voucher-list-box">
          <Swiper
            spaceBetween={3}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={true}
            breakpoints={{
              375: {
                slidesPerView: 1.2,
              },
            }}
          >
            {data.map((item) => {
              return (
                <SwiperSlide key={`voucher-${item.name}-${item.id}`}>
                  <Link href={`/doi-qua/${item.id}`}>
                    <a>
                      <div className="md-voucher-list-box__outer">
                        <div className="is-img">
                          <img src={get(item, 'images[0]', '')} />
                        </div>
                        <div className="is-content">
                          <div className="is-partner">
                            <img src={get(item, 'partnerLogo', '')} />
                          </div>
                          <b className="is-title">{get(item, 'partnerName', '')}</b>
                          <span className="is-description">{get(item, 'name', '')}</span>
                          {item?.type == 'earn_on_ecom' || item?.type == 'earn_off' ? (
                            <span className="is-point">
                              <b>{numeral(get(item, 'giftPoint', 0)).format('0,0')} Vnđ</b>{' '}
                              {/* <span className="c-pointlogo">L</span> */}
                            </span>
                          ) : item?.paymentPoint ? (
                            <span className="is-point">
                              <b>{numeral(get(item, 'paymentPoint', 0)).format('0,0')} Vnđ</b>{' '}
                              {/* <span className="c-pointlogo">L</span> */}
                            </span>
                          ) : (
                            <span className="is-point">
                              <b>Miễn phí</b>
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  <Link href={`/doi-qua/${item.id}/chi-tiet`}>
                    <a className="btn">Mua ngay</a>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default VoucherListMoblie
