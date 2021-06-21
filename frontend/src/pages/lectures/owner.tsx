import { userSelector } from '@selectors';
import { Block, Page, useStore } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { getLectures } from "../../common/api"
import HomeNavbar from '../../components/shared/HomeNavbar';
import LectureItem from './LectureItem';
import { LoadingSkeleton } from './skeleton/ownerSkeleton';

const LectureOwner = () => {
  const user = useRecoilValue(userSelector)
  const {data: lectures, isLoading, isError, error, refetch} = useQuery(["lectures", user.role], async () => {
    const q = {}
    if( user.role === "owner" )
      q["school_id_eq"] = user.own_school.id
    else if( user.role === "teacher" )
      q["teacher_id_eq"] = user.id
    const response = await getLectures({q})
    return response.data || []
  })

  const reload = async ( done ) => {
    await refetch()
    if( done ) done()
  }

  return <Page ptr ptrPreloader onPtrRefresh={reload}>
    <HomeNavbar title="강의 목록" slot="fixed" main/>
    {
      isLoading ? <LoadingSkeleton /> :
      isError ? <Block>{error['message']}</Block> :
      lectures.length === 0 ? <Block>담당하고 있는 수업이 없습니다.</Block> : 
        <Block>
          {
            user?.role === "owner" &&
            <a href="/lectures/new" className="button button-fill button-large margin-vertical">새 강의 개설하기</a>
          }
          {
            lectures.map(lecture =>
              <a href={`/lectures/${lecture.id}`} key={lecture.id}>
                <LectureItem lecture={lecture} />
              </a>
            )
          }
        </Block>
    }
  </Page>
}

export default LectureOwner
