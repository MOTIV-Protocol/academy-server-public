import EmptyList from '@components/shared/EmptyList';
import { currency } from '@utils/helpers';
import { Block, Col, Link, List, Page, Row } from 'framework7-react';
import React, { useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { getOrders } from '../../common/api';
import HomeNavbar from '../../components/shared/HomeNavbar';
import { IndexSkeleton } from './skeleton/IndexSkeleton';

const OrderIndex = ({ f7route, f7router }) => {
  const allowInfinite = useRef(true);
  const queryClient = useQueryClient();
  const dictionary = {
    ready: '결제 대기 중',
    paid: '결제 완료',
    complete: '등록 완료',
    canceled: '취소',
  };

  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery(
    ['orders'],
    async ({ pageParam: page = 1 }) => {
      const response = await getOrders({
        page,
        q: {
          s: 'created_at desc',
        },
      });
      return response.data;
    },
    { getNextPageParam: (lastPage, pages) => pages.length + 1 },
  );

  const reload = async (done?: Function) => {
    queryClient.removeQueries('orders');
    await refetch();
    allowInfinite.current = true;
    if (done) done();
  };

  const loadMore = async () => {
    if (!allowInfinite.current) return;
    allowInfinite.current = false;
    if (hasNextPage && data.pages.slice(-1)[0].length > 0) {
      await fetchNextPage();
      allowInfinite.current = true;
    }
  };

  return (
    <Page
      className="orders-index"
      infinite
      onInfinite={loadMore}
      infinitePreloader={isLoading}
      ptr={true}
      onPtrRefresh={reload}
    >
      <HomeNavbar title="결제 내역" slot="fixed" main />
      {isLoading ? (
        <IndexSkeleton />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : !data?.pages?.flat()?.length || data?.pages?.flat()?.length === 0 ? (
        <EmptyList text="주문내역이 없어요!" />
      ) : (
        <List noHairlines>
          {data?.pages?.flat()?.map((order) => (
            <li key={order.id} className="m-4 p-4 rounded shadow-lg">
              <span className="badge">{dictionary[order.status]}</span>
              <h2 className="mt-2 text-lg font-bold">{order.title}</h2>
              <p className="text-md font-bold text-blue-500">{currency(order.amount)}원</p>
              <Row>
                <Col width="33">
                  <Link
                    href={`/reviews/new?order_id=${order.id}`}
                    className={`button button-raised button-fill margin-vertical-half ${
                      order.status != 'paid' && 'disabled'
                    }`}
                    text="리뷰쓰기"
                  />
                </Col>
                <Col width="33">
                  <Link
                    href={`/schools/${order?.school?.id}`}
                    className="button button-raised button-fill margin-vertical-half"
                    text="학원보기"
                  />
                </Col>
                <Col width="33">
                  <Link
                    href={`/orders/${order.id}`}
                    className="button button-raised button-fill margin-vertical-half"
                    text="결제상세"
                  />
                </Col>
                <small>리뷰 쓰기는 수강 종료 이후 7일 동안만 가능합니다.</small>
              </Row>
            </li>
          ))}
        </List>
      )}
    </Page>
  );
};

export default OrderIndex;
