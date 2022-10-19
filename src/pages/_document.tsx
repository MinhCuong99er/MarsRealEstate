import { ReactElement, JSXElementConstructor, ReactFragment } from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { Helmet, HelmetData } from 'react-helmet'
// import getConfig from 'next/config'
import { GA_TRACKING_ID } from '../lib/gtag'

interface MyDocumentProps {
  helmet: HelmetData
}

// const { publicRuntimeConfig } = getConfig()
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

          {/* <link
            rel="stylesheet"
            id="contact-form-7-css"
            href="/static/lib/contact-form-7/includes/css/styles.css"
            type="text/css"
            media="all"
          /> */}

          {this.helmetHeadComponents}
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          {/* <div id="fb-root" /> */}
          {/* <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyCwsJNSsbDwyEtvNlRHTDOgyjpxlZZji30" type="text/javascript"></script> */}
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
                window.fbAsyncInit = function() {
                  FB.init({
                    appId: '${publicRuntimeConfig.FACEBOOK_APP_ID || ''}',
                    autoLogAppEvents: true,
                    cookie     : true,
                    xfbml: false,
                    version: 'v10.0'
                  }); 
                  // FB.AppEvents.logPageView();
                };
                (function(d, s, id){
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(id)) {return;}
                  js = d.createElement(s); js.id = id;
                  js.src = "https://connect.facebook.net/en_US/sdk.js";
                  fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
              `,
            }}
          /> */}
          {/* <script dangerouslySetInnerHTML={{
            __html: `
              (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js#xfbml=1&version=v10.0&autoLogAppEvents=1";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-js-sdk'));
            `
          }}
          />
          <div className="fb-customerchat" minimized="false" logged_in_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?" logged_out_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?" page_id={`${publicRuntimeConfig.FACEBOOK_PAGE_ID}`} theme_color="#ff6b1e"> </div> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
