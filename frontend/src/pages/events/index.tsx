import React from 'react';
import { Page, Navbar, List, ListItem, Block } from 'framework7-react';
import { getEvents } from "../../common/api"
import { useQuery } from 'react-query';
import { imagePath } from '@utils/helpers';
import EmptyList from '@components/shared/EmptyList';

const EventIndex = () => {
  const { data: events, isLoading, isError, error, refetch } = useQuery(["events"], async () => {
    const response = await getEvents({
      q: {
        s: ["end_at desc", "start_at desc"]
      }
    })
    return response.data || []
  })

  const reload = async (done) => {
    await refetch()
    if( done ) done()
  }

  return (
    <Page ptr ptrPreloader ptrDistance={30} onPtrRefresh={reload}>
      <Navbar backLink title="이벤트" slot="fixed" />
      { !isLoading && (
        isError ? <Block>{error['message']}</Block> :
        events.length === 0 ? <EmptyList text="진행중인 이벤트가 없어요!"/> : 
        <List>
        { events.map(event =>
            <a key={event.id} href={`/events/${event.id}`} className="">
              <div className="relative mx-5 py-3">
                <img src={imagePath(event)} className="rounded-xl shadow-lg w-full h-40 object-cover"/>
                <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center">
                  <div className="text-lg font-black px-2 py-1 mb-2 rounded text-white bg-gray-800 bg-opacity-60">{event.title}</div>
                  <div className="text-xs font-semibold px-0.5 text-gray-900 bg-white bg-opacity-60">{event.end_at.slice(0, 10)}까지</div>
                </div>
              </div>
            </a>
            )}
        </List>
      )}
    </Page>
  )
}

export default EventIndex
