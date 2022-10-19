import { CartType } from '@src/interfaces/enums'
import { ICategory } from '@src/interfaces/Global'
import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

interface CategorySwiperProps {
  type?: CartType
  data?: Array<ICategory>
  onChange?: (categoryId: number) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dataCategory = [
  {
    id: 1,
    name: 'Ẩm thực',
    image: '/images/swapgift/ico-amthuc.png',
  },
  {
    id: 2,
    name: 'Mua sắm',
    image: '/images/swapgift/ico-muasam.png',
  },
  {
    id: 3,
    name: 'Giải trí',
    image: '/images/swapgift/ico-giaitri.png',
  },
  {
    id: 4,
    name: 'Sức khoẻ',
    image: '/images/swapgift/ico-suckhoe.png',
  },
  {
    id: 5,
    name: 'Đặt xe',
    image: '/images/swapgift/ico-datxe.png',
  },
  {
    id: 6,
    name: 'Khách sạn',
    image: '/images/swapgift/ico-khachsan.png',
  },
]

const CategorySwiper: FC<CategorySwiperProps> = (props: CategorySwiperProps) => {
  let { data } = props
  if (!data) {
    data = dataCategory as any
  }

  const onChange = (catgoryId: number) => {
    props?.onChange(catgoryId)
  }

  return (
    <React.Fragment>
      <Swiper
        spaceBetween={5}
        slidesPerView={5}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {(data || []).map((i, idx) => (
          <SwiperSlide key={`swiper-category-${idx}`}>
            <div className="is-ico" onClick={() => onChange(i.id)}>
              <img src={i.image} />
              <span>{i.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </React.Fragment>
  )
}

export default CategorySwiper
