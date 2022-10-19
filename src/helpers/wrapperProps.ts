import { GetStaticPropsContext, GetServerSidePropsContext } from 'next'

export const withStaticProps = (pageStaticProps) => async (context: GetStaticPropsContext) => {
  const pageProps = await pageStaticProps(context)
  return {
    revalidate: 60,
    ...pageProps,
    props: {
      ...pageProps.props,
    },
  }
}

export const withServerSideProps = (pageServerSideProps) => async (context: GetServerSidePropsContext) => {
  const pageProps = await pageServerSideProps(context)
  return {
    ...pageProps,
    props: {
      ...pageProps.props,
    },
  }
}
