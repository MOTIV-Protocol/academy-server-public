import EmptyList from '@components/shared/EmptyList';
import { userSelector } from '@selectors';
import { Block, Page, useStore } from 'framework7-react';
import React, { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { deleteComments, getReviews } from '../../common/api';
import HomeNavbar from '../../components/shared/HomeNavbar';
import ReviewItem from './ReviewItem';
import { LoadingSkeleton } from './skeleton/ownerSkeleton';

const ReviewOwner = () => {
  const user = useRecoilValue(userSelector);
  const { data, isLoading, isError, error, refetch, fetchNextPage } = useInfiniteQuery(
    ['reviews', user.role],
    async ({ pageParam: page = 1 }) => {
      const response = await getReviews({ page, q: { order_school_id_eq: user.own_school.id } });
      return response.data;
    },
    { getNextPageParam: (lastPage, pages) => pages.length + 1 },
  );
  const reviews = useMemo(() => data?.pages?.flat(), [data]);

  const removeComment = (review) => async () => {
    try {
      await deleteComments(review.comment.id);
      await refetch();
    } catch (e) {
      alert('삭제하는 중 실패했습니다.');
    }
  };

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  const loadMore = async () => {
    if (isLoading || data.pages.slice(-1)[0].length === 0) return;
    await fetchNextPage();
  };

  return (
    <Page
      ptr
      ptrPreloader
      onPtrRefresh={reload}
      infinite
      infiniteDistance={50}
      infinitePreloader={isLoading}
      onInfinite={loadMore}
    >
      <HomeNavbar title="리뷰 관리" slot="fixed" main />
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : reviews.length === 0 ? (
        <EmptyList text="작성된 리뷰가 없어요!" />
      ) : (
        <Block>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              owner
              removeCommentAction={removeComment(review)}
              updateCommentAction={refetch}
            />
          ))}
        </Block>
      )}
    </Page>
  );
};

export default ReviewOwner;
