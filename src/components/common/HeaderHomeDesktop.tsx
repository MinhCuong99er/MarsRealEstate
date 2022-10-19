import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import get from 'lodash/get'
import { observer, inject } from 'mobx-react'
import numeral from 'numeral'
import { useRouter } from 'next/router'
import { AuthHydration } from '@src/stores/auth.store'
import { GlobalHydration } from '@src/stores/global.store'
import { flowResult } from 'mobx'
import { STATE } from '@src/interfaces/enums'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')
interface HeaderHomeDesktopProps {
  authStore?: AuthHydration
  globalStore?: GlobalHydration
}

const HeaderHomeDesktop: FC<HeaderHomeDesktopProps> = (props: HeaderHomeDesktopProps) => {
  const { globalStore } = props
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [searchBox, setSearchBox] = useState(false)
  const [searchDropdownList, setSearchDropdownList] = useState([])
  const [showErrSearchList, setShowErrSearchList] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  useEffect(() => {
    document.body.addEventListener('click', setSearchBoxClose)
  }, [])

  function setSearchBoxClose(event) {
    const noRedirect = '.d-header-box__search *'
    if (!event.target.matches(noRedirect)) {
      setSearchBox(false)
    }
  }

  useEffect(() => {
    if (!search) {
      setSearchDropdownList([])
      setSearchDone(false)
      setSearchBox(false)
    }
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        setShowErrSearchList(false)
        searchAutoComplete()
      } else {
        setSearchDropdownList([])
        setSearchDone(false)
        setSearchBox(false)
      }
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const searchAutoComplete = async () => {
    const resSearchList = await flowResult<any>(globalStore?.doSearch?.(search))
    if (resSearchList.code == 0) {
      setSearchDropdownList(resSearchList.data)
      setSearchDone(true)
      setSearchBox(true)
      if (resSearchList?.data?.length == 0) {
        setShowErrSearchList(true)
        setSearchBox(true)
      }
    }
  }

  /*  const refreshInfo = async () => {
    await flowResult(authStore?.getCustomerInfo())
  }

  useEffect(() => {
    if (
      !authStore?.token ||
      !authStore?.tokenPayload ||
      !authStore?.tokenPayload.phone ||
      !authStore?.tokenPayload.refId ||
      !authStore?.tokenPayload.voucherId ||
      !Object.keys(authStore?.tokenPayload).length
    ) {
      const a = setTimeout(() => {
        router.replace('/404')
      }, 1000)
      return () => clearTimeout(a)
    }
    refreshInfo()
    const refreshInfoSubcrice = setInterval(() => {
      async function anyName() {
        await flowResult(authStore?.getCustomerInfo())
      }
      anyName()
    }, DEFAULT_REFRESH_INFO)

    return () => clearInterval(refreshInfoSubcrice)
  }, []) */

  return (
    <div className="d-header">
      <div className="container">
        <div className="d-header-box">
          <div className="d-header-box__logo">
            <Link href="/">
              <img src="/images/logo-mpoint.png?v=1.3" />
              {/* <span style={{ color: '#ee0033', fontSize: '30px' }}>
                MPOINT
              </span> */}
            </Link>
          </div>
          <div className="d-header-box__search">
            <div
              className="form-group"
              onClick={() => {
                if (!searchBox) setSearchBox(!searchBox)
              }}
            >
              <input
                className="form-control"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {globalStore.state == STATE.PROCESSING && (
                <div className="spinner-wrapper">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </div>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!search) return
                  router.push(`/search?search=${search}`)
                }}
              >
                <img src="/images/icon-search.png" />
              </button>
            </div>
            {searchBox && search && searchDone ? (
              <div className="d-header-box__search__dropdown">
                {searchDropdownList.length ? (
                  <ul className="clearfix">
                    {searchDropdownList.map((item) => {
                      let itemP = get(item, '_source.doc', null) || null
                      if (!itemP) {
                        itemP = get(item, '_source', null) || null
                      }
                      if (!itemP || Object.keys(itemP).length <= 0) {
                        return null
                      }
                      return (
                        <li
                          key={`search-${itemP.name}-${itemP.id}`}
                          onClick={() => {
                            if (itemP.typeSearch == 'product') {
                              router.push(`/doi-qua/san-pham/${itemP.id}`)
                            } else {
                              router.push(`/doi-qua/${itemP.id}`)
                            }
                          }}
                        >
                          <div className="is-left">
                            <img src={get(itemP, 'images', '')} />
                          </div>
                          <div className="is-right">
                            <b>{get(itemP, 'name', '')}</b>
                            <span>{get(itemP, 'categoryName', '')}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : showErrSearchList ? (
                  <ul className="clearfix">
                    <li>
                      <div className="is-right">
                        <b>Không có kết quả</b>
                      </div>
                    </li>
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
          {/* <div className="d-header-box__user">
            <ul className="clearfix"> */}
          {/* <li>
                <div className="is-img">
                  <img src="/images/star-home-header-2.png" />
                </div>
                <div className="is-des">
                  <span>Hạng</span>
                  <b>{authStore?.currentTier?.name ?? 'N/A'}</b>
                </div>
              </li> */}
          {/* <li> */}
          {/* <div className="is-img">
                  <img src="/images/point-home-header-2.png" />
                </div> */}
          {/* <div className="is-des">
                  <span>Số điểm</span>
                  <b>
                    {numeral(authStore?.auth?.point ?? 0).format('#,#')}{' '}
                    <span className="c-pointlogo">đ</span>
                  </b>
                </div>
              </li>
            </ul> */}
          {/* <div className="d-header-box__user__avatar">
              <div className="is-img">
                <img src="/images/user-demo.png" />
              </div>
              <div className="is-dropdown-menu">
                <ul className="clearfix">
                  <li>
                    <Link href="/tai-khoan">
                      <a>Thông tin cá nhân</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/lich-su-diem">
                      <a>Lịch sử giao dịch điểm</a>
                    </Link>
                  </li> */}
          {/* <li>
                    <Link href="/diem-va-xep-hang">
                      <a>Điều kiện nâng hạng và quyền lợi</a>
                    </Link>
                  </li> */}
          {/* <li>
                    <Link href="/uu-dai-cua-toi">
                      <a>Ưu đãi của tôi</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/trang-thai-don-hang">
                      <a>Trạng thái đơn hàng</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dieu-khoan">
                      <a>Điều kiện điều khoản</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  globalStore: store?.globalStore,
}))(observer(HeaderHomeDesktop))
