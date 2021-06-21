import React from 'react';
import { Block, List, Navbar, Page, Preloader } from 'framework7-react';
import { useQuery } from 'react-query';
import { getLectures } from '../../common/api';
import LectureItem from './LectureItem';
import { useRecoilValue } from 'recoil';
import { userSelector } from '@selectors';

const LectureIndexPage = () => {
  const user = useRecoilValue(userSelector);
  const {
    data: lectures,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['lectures', 'mypage'], async () => {
    const response = await getLectures({ q: { users_id_eq: user.id, start_at_lteq: Date(), end_at_gteq: Date() } });
    return response.data || [];
  });

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };
  return (
    <Page ptr ptrPreloader onPtrRefresh={reload}>
      <Navbar backLink title="수강중인 강의" />
      <List simpleList noHairlines noHairlinesBetween className="margin">
        {isLoading ? (
          <Preloader />
        ) : isError ? (
          <Block>{error['message']}</Block>
        ) : lectures.length === 0 ? (
          <Block>등록한 수업이 없습니다.</Block>
        ) : (
          <>
            <h2 className="text-sm font-bold">수강중인 수업</h2>
            {lectures.map((lecture) => (
              <a key={lecture.id} href={`/lectures/${lecture.id}`}>
                <LectureItem lecture={lecture} showPrice={false} mine />
              </a>
            ))}
          </>
        )}
      </List>
    </Page>
  );
};

export default LectureIndexPage;
