import React from "react"

export const BookLoadingSkeleton = () => (
  <div className="list inset skeleton-text skeleton-effect-wave">
    <ul>
      {
        [...Array(10)].map((_, index) =>
          <li key={index}>
            <div className="item-content">
              <div className="item-media">
                <div className="skeleton-block" width="32" height="48" />
              </div>
              <div className="item-inner">
                <div className="item-title">_________</div>
                <div className="item-after">
                  <div className="skeleton-block" width="64" height="48" />
                </div>
              </div>
            </div>
          </li>
        )
      }
    </ul>
  </div>
)

export const LoadingSkeleton = () => {
  return <div className="skeleton-text skeleton-effect-wave">
    <div className="block">
      <small>______</small>
      <h2>____________________</h2>
      <h3 className="margin-bottom">_____________</h3>

      <h4>___________________</h4>
      <div className="margin-bottom-half">_______________</div>
      <div className="skeleton-block" width="100%" height="10" />
    </div>
    <BookLoadingSkeleton/>
  </div>
}