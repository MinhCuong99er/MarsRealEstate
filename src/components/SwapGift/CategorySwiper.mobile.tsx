import { CartType } from '@src/interfaces/enums'
import { ICategory } from '@src/interfaces/Global'
import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { observer, inject } from 'mobx-react'
import { VoucherHydration } from '@src/stores/voucher.store'

interface CategorySwiperProps {
  voucherStore?: VoucherHydration
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
  const { voucherStore } = props
  if (!data) {
    data = dataCategory as any
  }

  // const [modalQRCode, setModalQRCode] = useState(false)

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
            slidesPerView: 5,
            spaceBetween: 5,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
      >
        {/* <SwiperSlide key={`swiper-category-100`}>
          <div
            className={`is-ico`}
            onClick={() => {
              setModalQRCode(true)
            }}
          >
            <img src="https://vndirect.mediaone.dev/images/tich-diem.png?v=1.2" />
            <span>Tích điểm</span>
          </div>
        </SwiperSlide> */}

        {(data || []).map((i, idx) => (
          <SwiperSlide key={`swiper-category-${idx}`}>
            <div
              className={`is-ico ${i.id === voucherStore?.params?.categoryId ? 'active' : ''}`}
              onClick={() => {
                if (voucherStore?.params?.categoryId == i.id) {
                  voucherStore?.setParams({
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
  voucherStore: store?.voucherStore,
}))(observer(CategorySwiper))
