import React, { useEffect } from 'react';
import { Page, Navbar, List, useStore, Preloader, Block } from 'framework7-react';
import { deleteReviews, getReviews } from '../../common/api';
import ReviewItem from './ReviewItem';
import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userSelector } from '@selectors';

import { toast } from '@utils';
import EmptyList from '@components/shared/EmptyList';

const ReviewIndex = () => {
  const user = useRecoilValue(userSelector)
  const { data, isLoading, isError, error, fetchNextPage, refetch } = useInfiniteQuery(['reviews'],
    async ({ pageParam: page = 1 }) => {
      const response = await getReviews({ page, q: { user_id_eq: user.id } })
      return response.data
    }, { getNextPageParam: (lastPage, pages) => pages.length + 1, }
  )

  const showAlertToast = msg => toast.get().setToastText(msg).openToast()

  const remove = (id) => async () => {
    await deleteReviews(id)
    await refetch()
    showAlertToast("삭제되었습니다!")
  }

  const loadMore = () => {
    if( !isLoading && data.pages.slice(-1)[0].length > 0 )
      fetchNextPage()
  }

  const reload = async (done = null) => {
    await refetch()
    if( done ) done()
  }

  return (
    <Page noToolbar className="reviews-index"
      ptr ptrPreloader onPtrRefresh={reload}
      infinite onInfinite={loadMore} infinitePreloader={isLoading}>
      <Navbar title="리뷰관리" backLink slot="fixed" />
      {
        isLoading ? null :
        isError ? <Block>{error['message']}</Block> :
        data.pages.flat().length === 0 ? <EmptyList text="작성한 리뷰가 없어요!"/> :
        <List noHairlines className="padding">
          {
            data.pages.flat().map(review => (
              <li key={review.id}>
                <ReviewItem review={review} removeAction={remove(review.id)} />
              </li>
            ))
          }
        </List>
      }
    </Page>
  );
}

export default ReviewIndex
