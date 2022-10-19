import { CartType } from '@src/interfaces/enums'
import { ICategory } from '@src/interfaces/Global'
import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { observer, inject } from 'mobx-react'
import { ProductHydration } from '@src/stores/product.store'

interface CategorySwiperProductProps {
  productStore?: ProductHydration
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

const CategorySwiperProduct: FC<CategorySwiperProductProps> = (props: CategorySwiperProductProps) => {
  let { data } = props
  const { productStore } = props
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
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: data.length >= 5 ? 5 : data.length,
            spaceBetween: 5,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: data.length >= 5 ? 5 : data.length,
            spaceBetween: 30,
          },
        }}
      >
        {(data || []).map((i, idx) => (
          <SwiperSlide key={`swiper-category-${idx}`}>
            <div
              className={`is-ico ${i.id === productStore?.params?.categoryId ? 'active' : ''}`}
              onClick={() => {
                if (productStore?.params?.categoryId == i.id) {
                  productStore?.setParams({
                    categoryId: 0,
                  })
                } else {
                  onChange(i.id)
                }
              }}
            >
              <img src={i.image} />
              <span>{i.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  productStore: store?.productStore,
}))(observer(CategorySwiperProduct))
