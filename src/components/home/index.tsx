import React, { FC } from 'react'
import { Container } from 'react-bootstrap'
import HomeBanner from './HomeBanner'
import HomeEvent from './HomeEvent'
import HomeMovie from './HomeMovie'

interface HomeProps {}

const Home: FC<HomeProps> = (props: HomeProps) => {
  const {} = props
  return (
    <React.Fragment>
      <Container>
        <HomeBanner />
        <HomeEvent />
        <HomeMovie />
      </Container>
    </React.Fragment>
  )
}

export default Home
