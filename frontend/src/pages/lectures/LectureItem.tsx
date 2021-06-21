import { LectureModel } from '@constants';
import { currency, imagePath, timeAgo } from '@utils/helpers';
import { userSelector } from '@selectors';
import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { SkeletonView } from './skeleton/LectureItemSkeleton';
import { getAttendanceByLecture } from '@api';

interface LectureItemProps {
  lecture?: LectureModel;
  remove?: Function;
  selected?: boolean;
  skeleton?: boolean;
  showPrice?: boolean;
  mine?: boolean;
}

const LectureItem:React.FC<LectureItemProps> = (props) => {
  const { lecture, remove = null, selected = false, skeleton = false, showPrice = true, mine = false } = props
  
  const user = useRecoilValue(userSelector)
  // 시작, 끝을 new Date()로 파싱하여 수업 기간을 텍스트로 나타냄. ex) `4월`, `4월~5월`, `2020년 12월~2021년 1월`
  const startToEnd = (start_at, end_at) => {
    if (!start_at || !end_at) return ""
    const startAt = new Date(start_at)
    const endAt = new Date(end_at)
    if (startAt.getFullYear() === endAt.getFullYear()) {
      if (startAt.getMonth() === endAt.getMonth())
        return `${startAt.getMonth() + 1}월`
      else
        return `${startAt.getMonth() + 1}월~${endAt.getMonth() + 1}월`
    } else return `${startAt.getFullYear()}년 ${startAt.getMonth() + 1}월~${endAt.getFullYear()}년 ${endAt.getMonth() + 1}월`
  }
  
  const { data: attendance, isLoading, isError } = useQuery(["attendance", "one_by_lecture", lecture?.id], async () => {
    const response = await getAttendanceByLecture(lecture?.id)
    return response.data || {}
  }, { refetchOnWindowFocus: false, enabled: mine && user.role === "student" })

  // 받아온 Attendance 객체로 `X분전 결석/출석` 텍스트 출력
  const displayAttendance = useCallback( attendance => !attendance?.attended_at ? null :
    `${timeAgo.format(new Date(attendance?.attended_at))} ${attendance.status === "presence" ? "출석" : "결석"}`,[attendance])


  if (skeleton)
    return <SkeletonView />

  return <div className="margin-vertical-half grid grid-cols-12 gap-3">
    <div className="col-span-4">
      <img src={imagePath(lecture)} alt="" className="width-100 radius" />
    </div>
    <div className={selected ? "col-span-7" : "col-span-8"}>
      <div className="flex flex-row justify-between">
        <div className="text-sm text-gray-500">{lecture?.category?.title}</div>
        <div className="text-xs text-white bg-blue-500 rounded px-1 py-0.5">{`${startToEnd(lecture?.start_at, lecture?.end_at)} 수업`}</div>
      </div>
      <h4 className="mt-1 text-md font-bold">{lecture?.title}</h4>
      <h5 className="text-sm font-semibold my-0 py-0">{lecture?.teacher?.name} 선생님</h5>
      {showPrice &&
      <div className="text-md font-bold text-blue-500">{currency(lecture?.price)}원</div>}
      {mine && !isLoading && !isError &&
        <div className="mt-1 text-sm font-semibold text-blue-500">{displayAttendance(attendance)}</div>
      }
      {remove &&
        <div className="">
          <a onClick={remove} className="button float-right">삭제</a>
        </div>
      }
    </div>
    {selected &&
      <div className="col-10 align-self-center">
        <i className="las la-check" />
      </div>
    }
  </div >
}

export default LectureItem
