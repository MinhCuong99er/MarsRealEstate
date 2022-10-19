import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import numeral from 'numeral'
import Accordion from 'react-bootstrap/Accordion'
import get from 'lodash/get'

import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'

import { GlobalHydration } from '@src/stores/global.store'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageDesktopProps {
  globalStore?: GlobalHydration
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { globalStore } = props
  const questionAnswers = get(globalStore, 'questionAnswers', []) || []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
  }, [])

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content container">
          <br />
          <div className="md-terms-title" data-aos="fade-up" data-aos-delay="500">
            Điều kiện điều khoản
          </div>
          <br />
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
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  globalStore: store?.globalStore,
}))(observer(PageDesktop))
