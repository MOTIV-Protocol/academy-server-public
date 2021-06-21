import EmptyList from '@components/shared/EmptyList';
import { userSelector } from '@selectors';
import { toast } from '@utils';
import { Block, Button, List, Page, Segmented } from 'framework7-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getUsers, postUserAccept, postUserReject } from '../../common/api';
import HomeNavbar from '../../components/shared/HomeNavbar';
import { LoadingSkeleton } from './skeleton/teachersSkeleton';

const STATUS_WAIT = 0;
const STATUS_ACCEPTED = 1;

const UserTeachers = (props) => {
  const user = useRecoilValue(userSelector);
  const [status, setStatus] = useState(STATUS_ACCEPTED);
  const {
    data: teachers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['users', 'teachers', status], async () => {
    const response = await getUsers({ q: { teaching_school_id_eq: user.own_school.id, status_eq: status } });
    return response.data;
  });

  const accept = (id: number) => async () => {
    await postUserAccept(id);
    await reload();
    toast.get().setToastText('수락했습니다').openToast();
  };

  const reject = (id: number) => async () => {
    await postUserReject(id);
    await reload();
    toast.get().setToastText('거절했습니다').openToast();
  };

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  return (
    <Page ptr ptrPreloader onPtrRefresh={reload}>
      <HomeNavbar title="우리학원 선생님" slot="fixed" main />
      <Segmented raised className="margin">
        <Button active={status === STATUS_ACCEPTED} onClick={() => setStatus(STATUS_ACCEPTED)}>
          등록된 선생님
        </Button>
        <Button active={status === STATUS_WAIT} onClick={() => setStatus(STATUS_WAIT)}>
          등록 대기중 선생님
        </Button>
      </Segmented>
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <Block>{error['message']}</Block>
      ) : teachers.length === 0 ? (
        <EmptyList text="등록된 선생님이 없어요!" />
      ) : (
        <List simpleList>
          {teachers.map((teacher) => (
            <li key={teacher.id}>
              <div>{teacher.name} 선생님</div>
              {status === STATUS_WAIT && (
                <div className="display-flex flex-direction-row">
                  <Button className="margin-horizontal-half" onClick={reject(teacher.id)} outline>
                    거절
                  </Button>
                  <Button className="margin-horizontal-half" onClick={accept(teacher.id)} fill>
                    수락
                  </Button>
                </div>
              )}
            </li>
          ))}
        </List>
      )}
    </Page>
  );
};

export default UserTeachers;
