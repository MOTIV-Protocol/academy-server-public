import React from "react"
import LectureItem from "../../lectures/LectureItem"

export const LoadingSkeleton = () => {
  return <div className="m-3 skeleton-text skeleton-effect-wave">
    {
      [...Array(3)].map((_, index) =>
        <LectureItem key={index} skeleton />
      )
    }
  </div>
}
