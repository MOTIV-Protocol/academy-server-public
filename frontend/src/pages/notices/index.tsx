import EmptyList from '@components/shared/EmptyList';
import { Page, Navbar, Block, Preloader, Button } from 'framework7-react';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { getNotices } from '../../common/api';

const NoticeIndex = () => {
  const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery(
    ['notices'],
    async ({ pageParam: page = 1 }) => {
      const response = await getNotices({ page });
      return response.data;
    },
    { getNextPageParam: (lastPage, pages) => pages.length + 1 },
  );

  const loadMore = async (done = null) => {
    if (!isLoading && data.pages.slice(-1)[0]?.length > 0) fetchNextPage();
    if (done) done();
  };

  return (
    <Page noToolbar infinite infiniteDistance={30} infinitePreloader={isLoading} onInfinite={loadMore}>
      <Navbar backLink title="공지사항" slot="fixed" />
      {isLoading ? (
        <Preloader />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : !(data.pages.flat().length > 0) ? (
        <EmptyList text="등록된 공지사항이 없어요!" />
      ) : (
        <Block>
          {data.pages.flat().map((notice) => (
            <div key={notice.id} className="content-box margin-top">
              <a href={`/notices/${notice.id}`}>
                <div className="content-text">
                  <h4>{notice.title}</h4>
                  <div className="row no-margin">
                    <span className="col-60">운영자</span>
                    <div className="col-40 small text-align-right">
                      {moment(notice.created_at).format(i18next.t('date_formats').time)}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Block>
      )}
    </Page>
  );
};

export default NoticeIndex;
