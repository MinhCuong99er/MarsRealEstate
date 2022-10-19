import React, { FC, useEffect, useState } from 'react'
import { GlobalHydration } from '@src/stores/global.store'
import { flowResult } from 'mobx'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import { observer, inject } from 'mobx-react'
import { AuthHydration } from '@src/stores/auth.store'
// import { DEFAULT_REFRESH_INFO } from '@src/contains/contants'
import { STATE } from '@src/interfaces/enums'

interface HeaderSwapMobileProps {
  title?: any
  globalStore?: GlobalHydration
  authStore?: AuthHydration
}

const HeaderSwapMobile: FC<HeaderSwapMobileProps> = (props: HeaderSwapMobileProps) => {
  const { title, globalStore } = props
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [searchBox, setSearchBox] = useState(false)
  const [searchDropdownList, setSearchDropdownList] = useState([])
  const [showErrSearchList, setShowErrSearchList] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  /* const refreshInfo = async () => {
    await flowResult(authStore?.getCustomerInfo())
  } */

  useEffect(() => {
    document.body.addEventListener('click', setSearchBoxClose)
    /* refreshInfo()
    const refreshInfoSubcrice = setInterval(() => {
      async function anyName() {
        await flowResult(authStore?.getCustomerInfo())
      }
      anyName()
    }, DEFAULT_REFRESH_INFO)

    return () => clearInterval(refreshInfoSubcrice) */
  }, [])

  function setSearchBoxClose(event) {
    const noRedirect = '.m-header-share *'
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

  return (
    <>
      <div className="m-header-moblieswap">
        <span className="m-header-moblieswap__title" style={{ display: 'none' }}>
          {title}
        </span>
        {/* <img
          className="m-header-moblieswap__back"
          onClick={() => router.push('/')}
          src="/images/icon-back-moblie.png?v=1.1"
        /> */}
        <div className="m-header-share">
          <div
            className="form-group"
            onClick={() => {
              if (!searchBox) setSearchBox(!searchBox)
            }}
          >
            <input
              type="text"
              placeholder="Từ khoá tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {globalStore.state == STATE.PROCESSING && (
              <div className="spinner-wrapper">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </div>
            )}
            <a href={`/doi-qua?search=${search}`}>
              <img src="/images/ico-share-moblie.png?v=1.1" />
            </a>
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
        </div>
      </div>
      {searchBox ? <div className="m-filter-search"></div> : null}
    </>
  )
}

export default inject(({ store }) => ({
  globalStore: store?.globalStore,
  authStore: store?.authStore,
}))(observer(HeaderSwapMobile))
