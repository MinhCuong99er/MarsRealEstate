import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import Accordion from 'react-bootstrap/Accordion'
import get from 'lodash/get'
import numeral from 'numeral'

import HeaderMobile from '@src/components/common/HeaderMoblie'
import FooterMobile from '@src/components/common/FooterMobile'

import { GlobalHydration } from '@src/stores/global.store'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  globalStore?: GlobalHydration
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { globalStore } = props
  const questionAnswers = get(globalStore, 'questionAnswers', []) || []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
  }, [])

  return (
    <React.Fragment>
      <div className="m-body is-bgbody-white">
        <HeaderMobile title={'Điều kiện Điều khoản'} />
        <Accordion flush className="md-terms-accordion">
          {(questionAnswers || []).map((item, index) => {
            return (
              <Accordion.Item eventKey={index} key={index} className="md-terms-accordion__item">
                <Accordion.Header className="md-terms-accordion__item__header">
                  <span>{get(item, 'question', '') || ''}</span>
                </Accordion.Header>
                <Accordion.Body className="md-terms-accordion__item__body">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${get(item, 'answer', '') || ''}`,
                    }}
                  />
                </Accordion.Body>
              </Accordion.Item>
            )
          })}
        </Accordion>
        <FooterMobile activeMenu={4} />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  globalStore: store?.globalStore,
}))(observer(PageMobile))
