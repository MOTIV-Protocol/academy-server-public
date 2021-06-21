import EmptyList from '@components/shared/EmptyList';
import { AttendanceModel } from '@constants';
import { toast } from '@utils';
import { Block, Button, f7, List, Navbar, NavRight, Page, Progressbar, Row } from 'framework7-react';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useQueries } from 'react-query';
import { api_url, getAttendances, getLecture, postAttendanceBook, putAttendences } from '../../common/api';
import { BookLoadingSkeleton, LoadingSkeleton } from './skeleton/showSkeleton';

const AttendanceShow = (props) => {
  const { id: lectureId } = props;
  const [state, setState] = useState({
    attendances: [] as AttendanceModel[],
    targetDate: new Date(),
  });
  const { attendances, targetDate } = state;

  const { data: lecture, ...lectureQuery } = useQuery(
    ['lecture', lectureId],
    async () => {
      const response = await getLecture(lectureId);
      return response.data;
    },
    { refetchOnWindowFocus: false },
  );

  const attendanceQuery = useQuery(
    ['attendances', lectureId, targetDate],
    async () => {
      const lecture_id_eq = lectureId;
      const attended_at_gteq = new Date(+targetDate.getFullYear(), +targetDate.getMonth(), +targetDate.getDate());
      const attended_at_lt = new Date(+attended_at_gteq + 1000 * 60 * 60 * 24);
      const response = await getAttendances({ q: { lecture_id_eq, attended_at_gteq, attended_at_lt } });
      return response.data;
    },
    {
      onSuccess: (attendances) => setState((state) => ({ ...state, attendances: attendances as AttendanceModel[] })),
      refetchOnWindowFocus: false,
    },
  );

  // 출석률 계산
  const calculateAttendancePercent = (attedances: AttendanceModel[]) =>
    attedances?.length > 0
      ? (attedances.filter((each) => each.status === 'presence').length / attedances.length) * 100
      : 0;

  // 출석기록 로드
  const loadAttendances = async (date = null) => {
    if (!date) attendanceQuery.refetch();
  };

  // 날짜 변경 시, 핸들러
  const dateChangeHandler = (_, targetDate) => setState((state) => ({ ...state, targetDate }));

  // 전체 출석/결석 처리 동작
  const setAllStatus = (status) => () => {
    const attendances = [...state.attendances];
    attendances.forEach((each) => (each.status = status));
    setState((state) => ({ ...state, attendances }));
  };

  // 학생 1명 출석/결석 처리 동작
  const toggleHandler = (attendanceId) => async () => {
    const attendances = [...state.attendances];
    const target = attendances.find((each) => each.id === attendanceId);
    if (target.status === 'presence') target.status = 'absence';
    else target.status = 'presence';
    setState((state) => ({ ...state, attendances }));
  };

  // 해당날짜 출석부 만들기
  const createAttendanceBook = async () => {
    await postAttendanceBook(lecture?.id, targetDate);
    await loadAttendances();
  };

  // 출석부 저장하기
  const saveAttendances = async () => {
    f7.preloader.show();
    const promises = attendances.map(({ id, status }) => putAttendences(id, { attendance: { status } }));
    await Promise.all(promises);
    f7.preloader.hide();
    toast.get().setToastText('저장했어요!').openToast();
  };

  const calendarRef = useCallback((el) => {
    initCalander(el, dateChangeHandler);
  }, []);

  return (
    <Page>
      <Navbar backLink title={lecture?.title ?? '출석 보기'} slot="fixed">
        <NavRight>
          <Button onClick={saveAttendances}>저장하기</Button>
        </NavRight>
      </Navbar>

      {lectureQuery.isLoading ? (
        <LoadingSkeleton />
      ) : lectureQuery.isError ? (
        <div>{lectureQuery.error['message']}</div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="p-4">
            <small>{lecture?.category.title}</small>
            <h2>{lecture?.title}</h2>
            <h4>{lecture?.teacher?.name} 선생님</h4>

            <label className="margin-top">
              <h2>날짜 선택</h2>
              <input ref={calendarRef} type="text" placeholder="날짜 선택" readOnly />
            </label>
          </div>

          {attendanceQuery.isFetching ? (
            <BookLoadingSkeleton />
          ) : attendanceQuery.isError ? (
            <div>{attendanceQuery.error['message']}</div>
          ) : (
            <>
              <div className="p-4">
                <div className="margin-bottom-half">출석률 {parseInt(calculateAttendancePercent(attendances))}%</div>
                <Progressbar color="blue" progress={calculateAttendancePercent(attendances)} />
                <Row>
                  <Button className="col-50" large onClick={setAllStatus('absence')}>
                    전체결석
                  </Button>
                  <Button className="col-50" large onClick={setAllStatus('presence')}>
                    전체출석
                  </Button>
                </Row>
              </div>
              <List className="flex-1">
                {attendances?.length === 0 ? (
                  <>
                    <Button large fill onClick={createAttendanceBook} className="m-4">
                      출석부 만들기
                    </Button>
                    <EmptyList text="이 날짜에 출석기록이 없습니다." subText="출석부를 만들어보세요." small className="p-4"/>
                  </>
                ) : (
                  attendances?.map(({ user: student, status, id }) => (
                    <li key={id}>
                      <div className="item-content">
                        <div className="item-media">
                          <img src={`${api_url}${student?.thumbnail_path}`} width="32" height="32" />
                        </div>
                        <div className="item-inner">
                          <div className="item-title">{student?.name}</div>
                          <div className="item-after">
                            <label className="toggle toggle-init">
                              <input type="checkbox" checked={status === 'presence'} onChange={toggleHandler(id)} />
                              <span className="toggle-icon"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </List>
            </>
          )}
        </div>
      )}
    </Page>
  );
};

function initCalander(inputEl, changeHandler = null) {
  const calendarModal = f7.calendar.create({
    inputEl,
    openIn: 'customModal',
    value: [new Date()],
    renderToolbar: function () {
      return `
        <div class="toolbar calendar-custom-toolbar no-shadow">
          <div class="toolbar-inner">
            <div class="left">
              <a href="#" class="link icon-only"><i class="icon icon-back ${
                f7.theme === 'md' ? 'color-black' : ''
              }"></i></a>
            </div>
            <div class="center"></div>
            <div class="right">
              <a href="#" class="link icon-only"><i class="icon icon-forward ${
                f7.theme === 'md' ? 'color-black' : ''
              }"></i></a>
            </div>
          </div>
        </div>
        `;
    },
    on: {
      open: function (c) {
        $('.calendar-custom-toolbar .center').text(`${c.currentYear}년 ${c.currentMonth + 1}월`);
        $('.calendar-custom-toolbar .left .link').on('click', function () {
          calendarModal.prevMonth();
        });
        $('.calendar-custom-toolbar .right .link').on('click', function () {
          calendarModal.nextMonth();
        });
      },
      monthYearChangeStart(c) {
        $('.calendar-custom-toolbar .center').text(`${c.currentYear}년 ${c.currentMonth + 1}월`);
      },
      calendarChange(calendar, date) {
        if (changeHandler) changeHandler(calendar, date[0]);
      },
    },
    footer: true,
  });
  return calendarModal;
}

export default AttendanceShow;
