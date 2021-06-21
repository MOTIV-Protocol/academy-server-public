import { getEvents } from '@api';
import { imagePath } from '@utils/helpers';
import { Swiper, SwiperSlide } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';

const EventSwiper: React.FC = () => {
  const { data: events } = useQuery(['events', { event_type_eq: 'in_page' }], async () => {
    const response = await getEvents({
      q: {
        start_at_lteq: Date(),
        end_at_gteq: Date(),
        event_type_eq: 'in_page',
      },
    });
    return response.data;
  });

  return (
    <Swiper slidesPerView={1.3} loop centeredSlides className="py-3">
      {events?.map((event) => (
        <SwiperSlide>
          <a href={`/events/${event.id}`} className="relative flex justify-center items-center h-40 mx-2">
            <img
              src={imagePath(event)}
              className="absolute left-0 top-0 w-full h-full object-cover shadow-md rounded-lg p-1"
            />
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center p-3 ">
              <div className="text-base font-bold">{event.title}</div>
            </div>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default EventSwiper;
