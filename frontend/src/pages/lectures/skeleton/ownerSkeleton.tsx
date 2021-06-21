import React from "react"
import LectureItem from "../LectureItem"

export const LoadingSkeleton = () => {
  return <div className="block skeleton-text skeleton-effect-wave">
    {
      [...Array(8)].map((_, index) =>
        <LectureItem key={index} skeleton={true} />
      )
    }
  </div>
}
