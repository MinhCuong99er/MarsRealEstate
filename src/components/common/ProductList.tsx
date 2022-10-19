import React, { FC /*, useState */ } from 'react'
import Link from 'next/link'
import numeral from 'numeral'
import get from 'lodash/get'
import { observer, inject } from 'mobx-react'
import { Product } from '@src/interfaces/Product'
import PageLoading from '@src/helpers/PageLoading'
import AuthStore from '@src/stores/auth.store'
import { RootStoreHydration } from '@src/stores/RootStore'
// import Barcode from 'react-barcode'
// import QRCode from 'react-qr-code'
// import { Modal } from 'react-bootstrap'

interface ProductListProps {
  data?: Array<Product>
  isLoading?: boolean | React.Dispatch<React.SetStateAction<boolean>>
  isMyProduct?: boolean
  lastElementRef: (node: any) => void
  action?: 'point' | 'loadMore' | 'type' | 'category' | ''
  authStore?: AuthStore
}

const ProductItem = ({
  item,
  isMyProduct,
  token,
}: // setCodeShow,
// setModalQRCode,
// setLinkPartner,
{
  item: Product
  isMyProduct?: boolean
  token?: string
  // setCodeShow: (code: string) => void
  // setModalQRCode: (visibile: boolean) => void
  // setLinkPartner: (url: string) => void
}) => (
  <>
    <Link href={`/doi-qua/san-pham/${item.id}`}>
      <a>
        <div className="md-voucher-list-box__outer">
          <div className="is-img">
            {isMyProduct ? <img src={get(item, 'imagesProduct[0]', '')} /> : <img src={get(item, 'images[0]', '')} />}
          </div>
          <div className="is-content">
            {/* <div className="is-partner">
              {isMyProduct ? (
                <img src={get(item, 'logoPartner', '')} />
              ) : (
                <img src={get(item, 'partnerLogo', '')} />
              )}
            </div> */}
            {/* <b className="is-title">{get(item, 'partnerName', '')}</b> */}
            <span className="is-description">{get(item, 'name', '')}</span>
            {item?.payment == 'cash' ? (
              <span className="is-point">
                <b>{numeral(get(item, 'paymentCash', 0)).format('0,0')}</b> <span className="c-pointlogo">đ</span>
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
    {isMyProduct && token ? (
      <button
        onClick={() => {
          // setCodeShow(get(item, 'code', ''))
          // setLinkPartner(get(item, 'linkPartner', ''))
          // setModalQRCode(true)
        }}
        className="btn"
      >
        Sử dụng
      </button>
    ) : !isMyProduct && token ? (
      <Link href={`/doi-qua/san-pham/${item.id}`}>
        <a className="btn">Mua ngay</a>
      </Link>
    ) : null}
  </>
)

const ProductList: FC<ProductListProps> = (props: ProductListProps) => {
  const { data = [], isLoading = false, isMyProduct = false, action, authStore } = props
  // const [modalQRCode, setModalQRCode] = useState(false)
  // const [codeShow, setCodeShow] = useState<string>('')
  // const [linkPartner, setLinkPartner] = useState<string>('')
  // const handleCloseQRCode = () => setModalQRCode(false)

  return (
    <>
      <div className="md-voucher-list">
        <div className="container">
          <div className="md-voucher-list-box">
            {data.length <= 0 && !isLoading ? (
              isMyProduct ? (
                <span>Bạn không có sản phẩm nào!</span>
              ) : (
                <span>Không tìm thấy sản phẩm nào</span>
              )
            ) : (
              <ul className="clearfix">
                {isLoading && typeof action == 'string' && (action == 'point' || action == 'type') ? (
                  <PageLoading style={{ height: '150px' }} />
                ) : null}
                {data.map((item, idx) => {
                  if (data.length == idx + 1) {
                    return (
                      <li ref={props.lastElementRef} key={`product-${item.name}-${item.id}-${idx}`}>
                        <ProductItem
                          item={item}
                          isMyProduct={isMyProduct}
                          token={authStore?.token}
                          // setCodeShow={setCodeShow}
                          // setModalQRCode={setModalQRCode}
                          // setLinkPartner={setLinkPartner}
                        />
                      </li>
                    )
                  }
                  return (
                    <li key={`voucher-${item.name}-${item.id}-${idx}`}>
                      <ProductItem
                        item={item}
                        isMyProduct={isMyProduct}
                        token={authStore?.token}
                        // setCodeShow={setCodeShow}
                        // setModalQRCode={setModalQRCode}
                        // setLinkPartner={setLinkPartner}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
            {isLoading && typeof action == 'string' && (action == '' || action == 'loadMore') ? (
              <PageLoading style={{ height: '150px' }} />
            ) : null}
            {/* <Modal
              show={modalQRCode}
              onHide={handleCloseQRCode}
              centered
              className="m-modal-charity is-maxwidth"
            >
              <Modal.Body>
                <div className="m-accumulatepoint-modal__content">
                  <div className="m-accumulatepoint-modal__content__text">
                    <span>
                      Quý khách vui lòng đưa mã cho <br />
                      nhân viên thu ngân để sử dụng
                    </span>
                  </div>
                  <div className="m-accumulatepoint-modal__content__barcode">
                    <Barcode
                      value={codeShow ?? ''}
                      displayValue={true}
                      height={50}
                      width={1.2}
                      fontSize={13}
                      textMargin={2}
                      textSpacing={5}
                      background={'transparent'}
                    />
                  </div>
                  <div
                    className="m-accumulatepoint-modal__content__qrcode"
                    style={{ margin: '6% 0' }}
                  >
                    <QRCode
                      value={codeShow ?? ''}
                      bgColor={'transparent'}
                      size={190}
                    />
                  </div>
                  {linkPartner != '' ? (
                    <div>
                      <a href={linkPartner} target="_blank" rel="noreferrer">
                        Hoặc nhấn vào đây để sử dụng
                      </a>
                    </div>
                  ) : null}
                  <button
                    onClick={handleCloseQRCode}
                    className="m-accumulatepoint-modal__content__btn"
                  >
                    <span>Đóng</span>
                  </button>
                </div>
              </Modal.Body>
            </Modal> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  authStore: store?.authStore,
}))(observer(ProductList))
