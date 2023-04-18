import React, { FC } from 'react'
import Title from '../common/Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'

import 'swiper/css'
import 'swiper/css/autoplay'

interface HomeEventProps {}

const HomeEvent: FC<HomeEventProps> = () => {
  const events = [
    '/images/event/1.jpg',
    '/images/event/2.jpg',
    '/images/event/3.jpg',
    '/images/event/4.png',
    '/images/event/5.jpg',
    '/images/event/6.jpg',
    '/images/event/7.jpg',
    '/images/event/8.png',
  ]

  return (
    <div className="c-home-event">
      <Title title="Sự kiện" />
      <br />
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={false}
        modules={[Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1080: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {events.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="c-home-banner">
                <img src={item} alt={`home-event-${index}`} />
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default HomeEvent
