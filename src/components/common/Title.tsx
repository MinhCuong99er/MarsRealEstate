import React, { FC } from 'react'

interface TitleProps {
  title: string
}

const Title: FC<TitleProps> = (props: TitleProps) => {
  const { title } = props
  return (
    <div className="c-title">
      <h2>
        <span>{title}</span>
      </h2>
    </div>
  )
}

export default Title
