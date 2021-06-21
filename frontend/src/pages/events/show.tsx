import { cartState } from '@atoms';
import { imagePath, timeAgo } from '@utils/helpers';
import { Navbar, Page, Block, Preloader } from 'framework7-react';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { getEvent } from '../../common/api';

const EventShow = ({ f7route }) => {
  const { id: eventId } = f7route.params;
  const setCartState = useSetRecoilState(cartState);
  const { data: event, isLoading, isError, error, refetch } = useQuery(['event', eventId], async () => {
    const response = await getEvent(eventId);
    return response.data || {};
  });

  const loadMore = async (done = null) => {
    await refetch();
    if (done) done();
  };

  useEffect(() => {
    setCartState((state) => ({ ...state, visible: false }));
    return () => setCartState((state) => ({ ...state, visible: true }));
  }, []);

  return (
    <Page noToolbar ptr ptrPreloader onPtrRefresh={loadMore}>
      <Navbar title="이벤트" backLink slot="fixed"></Navbar>
      {isLoading ? (
        <Preloader />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : (
        <>
          <img src={imagePath(event)} alt={event.title} />
          <Block>
            <h1 className="text-xl">{event?.title}</h1>
            <h2 className="text-base">
              {event.start_at.slice(0, 10).replaceAll('-', '/')} ~ {event.end_at.slice(0, 10).replaceAll('-', '/')}
            </h2>
            <div className="text-sm">{timeAgo.format(new Date(event?.created_at))}</div>
            <hr />
            <p className="margin-vertical">{event.content}</p>
          </Block>
        </>
      )}
    </Page>
  );
};

export default EventShow;
