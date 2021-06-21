import React, { useEffect, useRef } from 'react';
import { Page, Navbar, Block, Popover } from 'framework7-react';
import { getPointHistories } from '../../common/api';
import { PointHistoriesSkeleton } from './skeleton/indexSkeleton';
import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { currency } from '@utils/helpers';
import moment from 'moment';
import { useRecoilValue } from 'recoil';
import { userSelector } from '@selectors';

const PointHistoryIndex = () => {
  const allowInfinite = useRef(true);
  const queryClient = useQueryClient();
  const user = useRecoilValue(userSelector)
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery(["pointHistories"], 
    async ({ pageParam: page = 1}) => {
      const response = await getPointHistories({ 
        page,
        q: {
          s: 'created_at desc',
        }
      });
        return response.data || []
    },
    {
      getNextPageParam: (lastPage, pages) => (pages ? pages.length + 1 : 1)
    }
  )
    
  const reload = async (done?: Function) => {
    queryClient.removeQueries(['pointHistories']);
    await refetch();
    allowInfinite.current = true;
    if (done) done();
  }

  const loadMore = async () => {
    if (!allowInfinite.current) return;
    allowInfinite.current = false;
    if (hasNextPage && data.pages.slice(-1)[0].length > 0 ){
      await fetchNextPage();
      allowInfinite.current = true;
    }
  }

  return (
    <Page noToolbar className="point-history"
      ptr ptrPreloader ptrMousewheel ptrDistance="55" onPtrRefresh={reload}
      infinite infinitePreloader={isLoading} onInfinite={loadMore}>
      <Navbar title="포인트" backLink slot="fixed" />

      { isLoading ? <PointHistoriesSkeleton /> :
        isError ? <Block>{error['message']}</Block> :
          <>
            <Block className="point-history-header">
              <div className="point-history-header__title">보유포인트 {currency(user.point)}원</div>
              <div className="point-history-header__sub-title">1원 이상 1원 단위로 사용 가능</div>
            </Block>
            <div className="list virtual-list virtual-list-vdom point-history-list">
              <div className="point-history-list__title">포인트 이용내역<a className="link popover-open" href="#" data-popover=".popover-about"><i className="las la-question-circle"></i></a></div>
              <ul>
                {
                  data?.pages?.flat()?.map((point_history) => (
                    <li key={point_history.id} className="point-history-list__item">
                      <div className="point-history-list__item--inner item-inner">
                        <div className="point-history-list__item--row">
                          <div className="point-history-list__item--title">{point_history?.order?.school?.name}</div>
                          <div className="point-history-list__item--sub-title">{moment(point_history?.created_at).format("YYYY.MM.DD")}</div>
                        </div>
                        <div className="point-history-list__item-subtitle">
                          {point_history.status === "plus" ? `+ ${point_history?.amount} 적립` : `- ${point_history?.amount} 사용`}
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          </>
      }
      <Popover className="popover-about">
        <Block>
          <p>About</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac diam ac quam euismod porta vel a
          nunc. Quisque sodales scelerisque est, at porta justo cursus ac.</p>
        </Block>
      </Popover>
    </Page>
  )
}

export default PointHistoryIndex
