import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

interface HomeBannerProps {}

const HomeBanner: FC<HomeBannerProps> = () => {
  const banners = [
    '/images/banner/1.png',
    '/images/banner/2.jpg',
    '/images/banner/3.jpg',
    '/images/banner/4.jpg',
    '/images/banner/5.png',
    '/images/banner/6.jpg',
    '/images/banner/7.jpg',
  ]

  return (
    <div className="c-swiper-home-banner">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={false}
        navigation
        pagination={{ clickable: true }}
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        {banners.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="c-home-banner">
                <img src={item} alt={`home-banner-${index}`} />
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default HomeBanner
