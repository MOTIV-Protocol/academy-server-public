import EmptyList from '@components/shared/EmptyList';
import { currency } from '@utils/helpers';
import { Badge, Block, List, ListItem, Navbar, Page, Preloader, useStore } from 'framework7-react';
import React, { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { getCalculateHistory, getOrders } from '../../common/api';


const CalculateHistoryShow: React.FC<any> = ({ f7route }) => {
  const statusDict = {
    yet: '처리 필요',
    done: '완료',
  };
  const { id: calculateHistoryId } = f7route.params;

  const { data: calculateHistory, ...calculateHistoryQuery } = useQuery(
    ['calculateHistory', calculateHistoryId],
    async () => {
      const response = await getCalculateHistory(calculateHistoryId);
      return response.data;
    },
  );
  const { data: orderData, isLoading, isError, error, refetch, fetchNextPage } = useInfiniteQuery(
    ['orders', { calculateHistoryId }],
    async ({ pageParam: page = 1 }) => {
      const response = await getOrders({
        page,
        q: {
          calculate_history_id_eq: calculateHistoryId,
          s: 'created_at desc',
        },
      });
      return response.data || [];
    },
    { getNextPageParam: (lastPage, pages) => pages.length + 1 },
  );
  const orders = useMemo(() => orderData?.pages?.flat() || [], [orderData]);

  const reload = async (done?: Function) => {
    await Promise.all([calculateHistoryQuery.refetch, refetch]);
    if (done) done();
  };

  const loadMore = async () => {
    if (!isLoading && orderData.pages?.slice(-1)[0]?.length > 0) await fetchNextPage();
  };

  return (
    <Page
      ptr
      ptrPreloader
      ptrDistance={50}
      onPtrRefresh={reload}
      infinite
      onInfinite={loadMore}
      infinitePreloader={isLoading}
    >
      <Navbar backLink title={calculateHistory?.name || '정산 자세히보기'} slot="fixed" />
      {calculateHistoryQuery.isLoading || isLoading ? (
        <Preloader />
      ) : calculateHistoryQuery.isError ? (
        <Block>{calculateHistoryQuery.error['message']}</Block>
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : orders.length === 0 ? (
        <EmptyList text="결제내역이 없어요!" />
      ) : (
        <>
          <div className="text-lg font-semibold m-4 flex flex-row justify-between items-center">
            <div>총 {currency(calculateHistory?.owner_profit)}원</div>
            <Badge color={calculateHistory?.status === 'done' ? 'blue' : 'gray'}>
              {statusDict[calculateHistory?.status]}
            </Badge>
          </div>
          <List mediaList>
            {orders.map((order) => (
              <ListItem
                key={order?.id}
                title={order?.title}
                subtitle={`${order?.school?.name} 학원 | 구매자 ${order?.user?.name}`}
                after={`${currency(order?.total_price)}원`}
              />
            ))}
          </List>
        </>
      )}
    </Page>
  );
};

export default CalculateHistoryShow;
