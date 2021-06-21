import React from "react"

export const PointHistoriesSkeleton = () => {
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="block skeleton-text skeleton-effect-fade">
          <h2>Order title</h2>
          <p>Order description</p>
          <div className="row">
            <div className="col-33">
              <div>button1</div>
            </div>
            <div className="col-33">
              <div>button2</div>
            </div>
            <div className="col-33">
              <div>button3</div>
            </div>
          </div>
          <small>review period</small>
        </div>
      ))}
    </div>
  )
}
