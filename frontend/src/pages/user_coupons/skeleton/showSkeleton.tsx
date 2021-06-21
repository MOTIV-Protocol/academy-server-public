import React from 'react'
import LectureItem from '../../lectures/LectureItem'

export const LoadingSkeleton = () => (
  <div className="skeleton-text skeleton-effect-wave">
    <div className="school__header">
      <div className="school__header--title">______________</div>
      <div className="skeleton-block" style={{ width: 125, height: 25 }} />
      <div className="school__header--small">
        __________________________
      </div>
      <div className="school__header--buttons">
        <div className="skeleton-block" style={{ flex: 1, margin: 8, height: 44 }} />
        <div className="skeleton-block" style={{ flex: 1, margin: 8, height: 44 }} />
        <div className="skeleton-block" style={{ flex: 1, margin: 8, height: 44 }} />
      </div>
    </div>

    <div className="school__info">
      <div className="row">
        <div className="school__info--key col-20">______</div>
        <div className="school__info--value col-80">__________________________</div>
      </div>

      <div className="row">
        <div className="school__info--key col-20">______</div>
        <div className="school__info--value col-80">__________________________</div>
      </div>
    </div>

    <div className="school__menus scrollmenu">
      <a href="#" className="tab-link tab-link-active">___</a>
      <a href="#" className="tab-link">___</a>
      <a href="#" className="tab-link">___</a>
    </div>

    <div className="school__tabs">
      <LectureItem skeleton />
      <LectureItem skeleton />
      <LectureItem skeleton />
    </div>
  </div>
)
