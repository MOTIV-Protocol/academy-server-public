import React from "react"

export const SkeletonView = () => {
  return <div className="margin-vertical-half row skeleton-text skeleton-effect-wave">
    <div className="col-30">
      <div className="skeleton-block radius" style={{width: "calc(30vw - 14.4px)", height: "calc(30vw - 14.4px)"}} />
    </div>
    <div className="col-70">
      <p className="small">________</p>
      <h4>______________</h4>
      <div>_________</div>
    </div>
  </div>
}
