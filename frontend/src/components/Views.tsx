import { getCart, getUser, logOutAPI } from '@api';
import { cartState } from '@atoms';
import { SchoolModel, UserModel } from '@constants';
import useAuth from '@hooks/useAuth';
import { authSelector, userSelector } from '@selectors';
import { toast } from '@utils';
import {
  f7,
  f7ready,
  Fab,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  PageContent,
  Panel,
  Toolbar,
  View,
  Views,
} from 'framework7-react';
import 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import '../common/utils/helpers';
import capacitorApp from '../js/capacitor-app';
import i18n from '../lang/i18n';

moment.locale(i18n.language);
global.moment = moment;

const F7Views: React.FC = () => {
  const setUserState = useSetRecoilState(userSelector);
  const setCartState = useSetRecoilState(cartState);
  const { visible: cartVisibility, line_items: cartList } = useRecoilValue(cartState);
  const { currentUser } = useAuth();
  const loggedIn = useMemo(() => !!currentUser, [currentUser]);
  const resetAuth = useResetRecoilState(authSelector);
  const logout = async () => {
    await logOutAPI(resetAuth);
    toast.get().setToastText('로그아웃되었습니다').openToast();
    window.location.reload();
  };

  const belongedSchool = (user: UserModel): SchoolModel | null =>
    user?.role === 'owner' ? user?.own_school : user?.role === 'teacher' ? user.teaching_school : null;

  const loginedMenuList = [
    { title: '공지사항', link: '/notices', icon: 'las la-bullhorn' },
    { title: 'FAQ', link: '/faqs', icon: 'las la-question' },
    { title: '로그아웃', onClick: logout, link: '#', icon: 'la-sign-out-alt' },
  ];
  const logoffedMenuList = [{ title: '로그인', link: '/users/sign_in', icon: 'la-sign-in-alt' }];
  const teacherOwnerMenuList = (user) => [
    { title: '출석부', link: '/attendances', reloadCurrent: true, icon: 'la-check-square' },
    { title: 'My학원', link: `/schools/${belongedSchool(user)?.id}`, reloadCurrent: true, icon: 'la-campground' },
    { title: '강의 목록', link: '/lectures/owner', reloadCurrent: true, icon: 'la-chalkboard' },
  ];
  const onlyOwnerMenuList = [
    { title: '리뷰', link: '/reviews/owner', reloadCurrent: true, icon: 'la-comment' },
    { title: '우리학원 선생님', link: '/users/teachers', reloadCurrent: true, icon: 'la-chalkboard-teacher' },
    { title: '정산', link: '/calculate_histories', reloadCurrent: true, icon: 'la-chalkboard-teacher' },
  ];

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const onInit = async () => {
      if (loggedIn) {
        await getUser(currentUser.id).then(({ data }) => setUserState((state) => ({ ...state, ...data })));
        if (currentUser?.role === 'student')
          await getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data })));
      }
    };
    onInit();
  }, []);

  useEffect(() => {
    if (currentUser)
      setMenuList([
        ...(loggedIn ? loginedMenuList : logoffedMenuList),
        ...(currentUser?.role === 'teacher' || currentUser?.role === 'owner' ? teacherOwnerMenuList(currentUser) : []),
        ...(currentUser?.role === 'owner' ? onlyOwnerMenuList : []),
      ]);
  }, [currentUser]);

  f7ready(() => {
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }
    toast.set(f7);
  });

  return (
    <>
      <Panel left cover>
        <Page pageContent={false}>
          <Navbar title="도움닫기" slot="fixed" />
          <PageContent>
            <List>
              {menuList.map(({ icon, ...menu }, index) => (
                <ListItem key={index} {...menu} panelClose>
                  {' '}
                </ListItem>
              ))}
            </List>
          </PageContent>
        </Page>
      </Panel>
      {loggedIn &&
        (currentUser?.role === 'student' ? (
          <Views tabs className="safe-areas">
            {/* Tabbar for switching views-tabs */}
            <Toolbar tabbar labels bottom>
              <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
              <Link tabLink="#view-favorite" icon="las la-bookmark" text="찜한학원" />
              <Link tabLink="#view-receipt" icon="las la-receipt" text="결제내역" />
              <Link tabLink="#view-mypage" icon="las la-user" text="My학원" />
            </Toolbar>
            <View id="view-home" main tab tabActive url="/">
              {cartVisibility && cartList.length > 0 && (
                <Fab position="right-bottom" color="blue" text={cartList.length.toString()} href="/line_items">
                  <Icon f7="cart_fill"></Icon>
                </Fab>
              )}
            </View>
            <View id="view-favorite" name="favorite" tab url="/likes/" />
            <View id="view-receipt" name="receipt" tab url="/orders/" />
            <View id="view-mypage" name="mypage" tab url="/users/mypage" />
          </Views>
        ) : currentUser?.role === 'teacher' || currentUser?.role === 'owner' ? (
          <View main url={`/schools/${belongedSchool(currentUser)?.id}`} />
        ) : null)}
      {!loggedIn && <View main url="/intro" />}
    </>
  );
};

export default F7Views;
