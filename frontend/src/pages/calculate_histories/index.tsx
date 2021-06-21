import EmptyList from '@components/shared/EmptyList';
import { userSelector } from '@selectors';
import { Badge, Block, List, ListItem, Page, Preloader } from 'framework7-react';
import React, { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { getCalculateHistories } from '../../common/api';
import HomeNavbar from '../../components/shared/HomeNavbar';

const CalculateHistoryIndex = (_props: any) => {
  const statusDict = {
    yet: '처리 필요',
    done: '완료',
  };

  const user = useRecoilValue(userSelector);
  const { data, isError, error, fetchNextPage, isLoading, refetch } = useInfiniteQuery(
    'calculateHistories',
    async ({ pageParam: page = 1 }) => {
      const response = await getCalculateHistories({
        page,
        q: {
          orders_school_id_eq: user.own_school.id,
          s: 'end_at desc',
        },
      });
      return response.data || [];
    },
    {
      getNextPageParam: (lastPage, pages) => (pages ? pages.length + 1 : 1),
    },
  );
  const calculate_histories = useMemo(() => data?.pages?.flat() || [], [data]);

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  const loadMore = async () => {
    if (!isLoading && data.pages?.slice(-1)[0]?.length > 0) await fetchNextPage();
  };

  return (
    <Page ptr ptrPreloader onPtrRefresh={reload} infinite infinitePreloader={isLoading} onInfinite={loadMore}>
      <HomeNavbar title="정산" slot="fixed" main />
      {isLoading ? (
        <Preloader />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : (
        <List mediaList>
          {calculate_histories.length === 0 ? (
            <EmptyList text="정산 내역이 없어요!" />
          ) : (
            calculate_histories.map((each) => (
              <ListItem
                link={`/calculate_histories/${each.id}`}
                key={each.id}
                title={each.name}
                after={<Badge color={each.status === 'done' ? 'blue' : 'gray'}>{statusDict[each.status]}</Badge>}
              />
            ))
          )}
        </List>
      )}
    </Page>
  );
};

export default CalculateHistoryIndex;
