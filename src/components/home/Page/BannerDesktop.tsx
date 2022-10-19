import React, { FC } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'
import { inject, observer } from 'mobx-react'
import { RootStoreHydration } from '@src/stores/RootStore'
import { GlobalHydration } from '@src/stores/global.store'
import BannerItem from './BannerItem'
import { toJS } from 'mobx'

interface BannerDesktopProps {
  globalStore?: GlobalHydration
}

const BannerDesktop: FC<BannerDesktopProps> = (props: BannerDesktopProps) => {
  const { globalStore } = props

  return (
    <div className="d-home-banner">
      <div className="d-home-banner__list">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
        >
          {toJS(globalStore.bannerSorted).map((item) => (
            <SwiperSlide key={item.id}>
              <BannerItem banner={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="d-home-banner__menu">
        <div className="container">
          <div className="d-home-banner__menu__box">
            <ul className="clearfix">
              <li data-aos="fade-up" data-aos-delay="0">
                <Link href="/doi-qua">
                  <a>
                    <div>
                      <picture>
                        <img src="/images/qua-san-pham-l.png" />
                      </picture>
                      <span>Đổi quà</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="300">
                <Link href="/happy-client">
                  <a>
                    <div>
                      <picture>
                        <img src="/images/gioi-thieu-l.png" />
                      </picture>
                      <span>Happy Client</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="600">
                <Link href="/tang-diem-cho-ban">
                  <a>
                    <div>
                      <picture>
                        <img src="/images/tang-diem-l.png" />
                      </picture>
                      <span>Tặng điểm cho bạn</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="900">
                <Link href="/uu-dai-khoa-hoc">
                  <a>
                    <div>
                      <picture>
                        <img src="/images/khoa-hoc-l.png" />
                      </picture>
                      <span>Ưu đãi khoá học đầu tư</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="1200">
                <Link href="/tu-thien-vi-cong-dong">
                  <a>
                    <div>
                      <picture>
                        <img src="/images/tu-thien-l.png" />
                      </picture>
                      <span>Đóng góp vì cộng đồng</span>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  globalStore: store?.globalStore,
}))(observer(BannerDesktop))
