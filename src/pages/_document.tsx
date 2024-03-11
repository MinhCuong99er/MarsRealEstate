import { ReactElement, JSXElementConstructor, ReactFragment } from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { Helmet, HelmetData } from 'react-helmet'
import { GA_TRACKING_ID } from '@src/lib/gtag'

interface MyDocumentProps {
  helmet: HelmetData
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<{
    asPath: any
    pathname: any
    query: any
    helmet: HelmetData
    html: string
    head?: JSX.Element[]
    styles?: ReactElement<any, string | JSXElementConstructor<any>>[] | ReactFragment
  }> {
    const { ...args } = ctx
    const documentProps = await super.getInitialProps(ctx)
    const { asPath, pathname, query } = args
    return {
      ...documentProps,
      asPath,
      pathname,
      query,
      helmet: Helmet.renderStatic(),
    }
  }

  // should render on <html>
  get helmetHtmlAttrComponents(): any {
    return this.props.helmet.htmlAttributes.toComponent()
  }

  // should render on <body>
  get helmetBodyAttrComponents(): any {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  // should render on <head>
  get helmetHeadComponents(): any {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map((el) => this.props.helmet[el].toComponent())
  }

  render(): JSX.Element {
    return (
      <Html {...this.helmetHtmlAttrComponents}>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />

          {this.helmetHeadComponents}
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
