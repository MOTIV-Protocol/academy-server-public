import { getEvents } from '@api';
import { imagePath } from '@utils/helpers';
import { Block, Swiper, SwiperSlide } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';

const BannerSlide: React.FC = () => {
  const {
    data: events,
    isLoading,
    error,
    isError,
  } = useQuery(['events', { event_type_eq: 'banner' }], async () => {
    const response = await getEvents({
      q: {
        start_at_lteq: Date(),
        end_at_gteq: Date(),
        event_type_eq: 'banner',
      },
    });
    return response.data || [];
  });

  return (
    <Swiper className="slider swiper-container">
      {isLoading ? (
        <div className="content">
          <div className="mask rounded-none"></div>
          <div className="slider-caption text-align-left"></div>
        </div>
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : (
        events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="content rounded-none">
              <a href={`/events/${event.id}`}>
                <div className="mask rounded-none"></div>
                <img src={imagePath(event)} alt={event.title} className="width-100 rounded-none" />
                <div className="slider-caption text-align-left">
                  <span className="label">{event.title}</span>
                  <p>{event.end_at?.slice(0, 10)?.replaceAll('-', '/')} 까지</p>
                </div>
              </a>
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  );
};

export default BannerSlide;
