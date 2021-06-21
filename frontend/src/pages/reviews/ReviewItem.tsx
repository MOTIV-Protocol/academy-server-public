import { thumbnailPath, timeAgo } from '@utils/helpers';
import { f7 } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { api_url, deleteComments } from "../../common/api"
import Rateyo from '../../components/reviews/Rateyo';


const SkeletonView = () => {
  return <div className="review-item skeleton-text skeleton-effect-wave">
    <div className="skeleton-block margin-bottom-half" style={{ width: '80px', height: '14px' }} />
    <div className="display-flex flex-direction-row">
      <div className="review-item__title">________</div>
    </div>
    <div className="review-item__subtitle margin-bottom-half">___________  __________</div>
    <div className="review-item__content">
      _____________________________
    </div>
  </div>
}

const ReviewItem = (props) => {
  const { review, skeleton = false, removeAction = null, removeCommentAction = null, updateCommentAction = null, owner = false } = props

  const linkToComment = () => {
    f7.views.current.router.navigate('/comments/new', {
      props: {
        review,
        updateCommentAction
      }
    })
  }

  return skeleton ? <SkeletonView />
    : <div className="review-item">
      <div className="review-item__user">
        <img src={thumbnailPath(review?.user)} className="review-item__user--thumbnail" />
        <div className="review-item__user--vertical">
          <div className="review-item__user--horizontal">
            <div className="review-item__user--name">{review?.user.name}</div>
            {
              !!removeAction &&
              <a href="#" className="button" onClick={removeAction}>삭제</a>
            }
          </div>
          <div className="review-item__user--horizontal">
            <div className="rateyo"></div>
            <Rateyo starWidth="12px" halfStar readOnly rating={review?.score || 0} />
            <div className="review-item__user--date">{timeAgo.format(new Date(review?.created_at))}</div>
          </div>
        </div>
      </div>

      <div className="review-item__images">
        {review?.images.map(({ id, image_path }) => <img key={id} src={`${api_url}${image_path}`} />)}
      </div>
      <div className="review-item__content">
        {review?.content}
      </div>
      <div className="review-item__school-lecture">{review?.order?.school?.name} | {review?.order?.title}</div>
      {
        review?.comment &&
        <div className="review-item__comment">
          <div>
            <span className="review-item__comment--owner">원장님</span>
            <span className="review-item__comment--timeago">{timeAgo.format(new Date(review?.comment?.created_at))}</span>
          </div>
          <div className="review-item__comment--body">
            {review?.comment.body}
          </div>
        </div>
      }
      {
        !!owner &&
        (review?.comment ?
          removeCommentAction &&
          <a href="#" onClick={removeCommentAction} className="button button-outline margin-top">
            리뷰 답글 삭제하기
        </a>
          :
          <a href="#" onClick={linkToComment} className="button button-fill margin-top">
            리뷰 답글 작성하기
        </a>
        )
      }
    </div>
}

export default ReviewItem
