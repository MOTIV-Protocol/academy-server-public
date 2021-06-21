import { userSelector } from '@selectors';
import { Button, List, Page } from 'framework7-react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { api_url } from '../../common/api';
import HomeNavBar from '../../components/shared/HomeNavbar';

const MyPage = () => {
  const user = useRecoilValue(userSelector);

  return (
    <Page>
      <HomeNavBar title="My학원" slot="fixed" main />

      <div className="margin-half display-flex align-items-center">
        <div>
          <img src={api_url + user?.thumbnail_path} alt={user?.name} width="64" height="64" className="radius" />
        </div>
        <div className="flex-shrink-1 margin-left">
          <h4 className="text-lg font-bold">{user?.name}</h4>
          <p className="text-sm text-gray-600">{user?.phone}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* <div className="row margin-top align-items-center">
        <div className="bg-color-gray display-flex justify-content-center align-items-center" style="height: 50px; flex: 1;">
          등급</div>
          <a href="#" className="button">등급별 혜택</a>
        </div> */}

      <div className="flex flex-row w-full py-4">
        <div className="flex-1">
          <Button href="/point_histories">포인트내역</Button>
        </div>
        <div className="flex-1">
          <Button href="/user_coupons">쿠폰함</Button>
        </div>
        <div className="flex-1">
          <Button href="/reviews">리뷰관리</Button>
        </div>
        <div className="flex-1">
          <Button href="/lectures">내 수업</Button>
        </div>
      </div>

      <List linksList>
        <li>
          <a href="/notices/">공지사항</a>
        </li>
        <li>
          <a href="/events/">이벤트</a>
        </li>
        <li>
          <a href="/faqs/">자주 묻는 질문</a>
        </li>
        <li>
          <a href="/contacts/">이메일 문의</a>
        </li>
      </List>
    </Page>
  );
};

export default MyPage;
