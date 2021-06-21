import EmptyList from '@components/shared/EmptyList';
import { F7ComponentProps } from '@constants';
import { userSelector } from '@selectors';
import { Block, Page } from 'framework7-react';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getLectures } from '../../common/api';
import HomeNavbar from '../../components/shared/HomeNavbar';
import LectureItem from '../lectures/LectureItem';
import { LoadingSkeleton } from './skeleton/indexSkeleton';

const AttendanceIndex: React.FC<F7ComponentProps> = (props) => {
  const user = useRecoilValue(userSelector);

  const belongedSchool = (user: { role: string; own_school: any; teaching_school: any }) =>
    user.role === 'owner' ? user.own_school : user.role === 'teacher' ? user.teaching_school : null;

  const {
    data: lectures,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['lectures', user.role], async () => {
    const q = {
      start_at_lteq: Date(),
      end_at_gteq: Date(),
    };
    if (user.role === 'owner') q['school_id_eq'] = user.own_school.id;
    else if (user.role === 'teacher') q['teacher_id_eq'] = user.id;
    const response = await getLectures({ q });
    return response.data || [];
  });

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  return (
    <Page ptr ptrPreloader onPtrRefresh={reload}>
      <HomeNavbar title="출석부" slot="fixed" main />
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : lectures.length === 0 ? (
        <EmptyList text="현재 진행중인 수업이 없어요!" />
      ) : (
        <Block>
          {lectures.map((lecture) => (
            <a key={lecture.id} href={`/attendances/${lecture.id}`}>
              <LectureItem lecture={lecture} />
            </a>
          ))}
        </Block>
      )}
    </Page>
  );
};

export default AttendanceIndex;
