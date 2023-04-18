import React, { FC } from 'react'
import Title from '../common/Title'

interface HomeMovieProps {}

const HomeMovie: FC<HomeMovieProps> = () => {
  return (
    <div className="c-home-movie">
      <Title title="Lựa chọn phim" />
      <br />
    </div>
  )
}

export default HomeMovie
