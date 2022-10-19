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

interface BannerMenuMobileProps {
  globalStore?: GlobalHydration
}

const BannerMenuMobile: FC<BannerMenuMobileProps> = (props: BannerMenuMobileProps) => {
  const { globalStore } = props

  return (
    <div className="m-home-banner">
      <div className="container">
        <div className="m-home-banner__list">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={5}
            slidesPerView={1.1}
            centeredSlides={true}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              375: {
                slidesPerView: 1.1,
              },
            }}
          >
            {globalStore.bannerSorted.map((item) => (
              <SwiperSlide key={item.id}>
                <BannerItem banner={item} />
              </SwiperSlide>
            ))}
            {/* <SwiperSlide>
              <Link href="/">
                <a>
                  <img src="/images/banner-home.jpg" />
                </a>
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href="/">
                <a>
                  <img src="/images/banner-home.jpg" />
                </a>
              </Link>
            </SwiperSlide> */}
          </Swiper>
        </div>
        <div className="m-home-banner__menu">
          <ul className="clearfix">
            <li>
              <Link href="/uu-dai-gan-day">
                <a>
                  <div>
                    <i>
                      <img src="/images/uu-dai-quanh-day.png?v=1.1" />
                    </i>
                    <span>Ưu đãi quanh đây</span>
                  </div>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/uu-dai-khoa-hoc">
                <a>
                  <div>
                    <i>
                      <img src="/images/khoa-hoc-menu.png?v=1.2" />
                    </i>
                    <span>
                      Ưu đãi khoá học
                      <br /> đầu tư
                    </span>
                  </div>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/tu-thien-vi-cong-dong">
                <a>
                  <div>
                    <i>
                      <img src="/images/tu-thien-menu.png?v=1.2" />
                    </i>
                    <span>Đóng góp vì cộng đồng</span>
                  </div>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  globalStore: store?.globalStore,
}))(observer(BannerMenuMobile))
