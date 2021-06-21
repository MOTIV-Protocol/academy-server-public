import { Block } from "framework7-react"
import React from "react"
import ReviewItem from "../ReviewItem"

export const LoadingSkeleton = () => {
  return <Block>
    {
      [...Array(10)].map((_, index) =>
        <ReviewItem key={index} skeleton={true} />
      )
    }
  </Block>
}
