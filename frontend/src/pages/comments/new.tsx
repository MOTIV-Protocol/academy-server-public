import { Block, Button, f7, Input, Navbar, Page } from 'framework7-react';
import React, { useState } from 'react';
import { postComments } from "../../common/api";
import ReviewItem from '../reviews/ReviewItem';

const CommentNew: React.FC<any> = (props) => {
  const { review, updateCommentAction = null } = props;
  const [state, setState] = useState({
    comment: "",
  })

  const submit = async () => {
    try {
      const comment = {
        body: state.comment,
        target_type: "Review",
        target_id: review.id
      }
      const response = await postComments({ comment })
      const commentData = response.data
      if( updateCommentAction ) updateCommentAction( commentData )
      f7.views.current.router.back()
    } catch (e) {
      alert("문제가 발생했습니다.")
    }
  }

  const inputHandler = (key) => (e) => {
    const {value} = e.target
    setState(state => ({...state, [key]: value}))
  }

  return <Page className="comments-new">
    <Navbar backLink title="리뷰 답글 달기" slot="fixed" />
    <Block>
      <ReviewItem review={review} />
      <h3>리뷰에 대한 답글을 작성해주세요!</h3>
      <Input type="textarea" className="comment-textarea" placeholder="답글을 작성해보세요!"
        value={state.comment} onInput={inputHandler('comment')} />
      <Button fill large onClick={submit}>댓글 작성</Button>
    </Block>
  </Page>
}

export default CommentNew