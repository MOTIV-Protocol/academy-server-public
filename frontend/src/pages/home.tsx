import { cartState, likedSchoolsState } from '@atoms';
import BannerSlide from '@components/shared/BannerSlide';
import EventSwiper from '@components/shared/EventSwiper';
import Footer from '@components/shared/Footer';
import HomeNavbar from '@components/shared/HomeNavbar';
import { userSelector } from '@selectors';
import { toast } from '@utils';
import { utils } from 'framework7';
import { Button, f7ready, Icon, NavRight, Page } from 'framework7-react';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getCart, getLikedSchools, successOrder } from '../common/api/index';
import CategoriesGrid from './categories/CategoriesGrid';

const HomePage = ({ f7route, f7router }) => {
  const user = useRecoilValue(userSelector);
  const setLikedSchools = useSetRecoilState(likedSchoolsState);
  const setCartState = useSetRecoilState(cartState);
  const queryClient = useQueryClient();
  const orderQuery = utils.parseUrlQuery(location.href) as any;
  const keys = Object.keys(orderQuery);

  useEffect(() => {
    if (utils.parseUrlQuery(location.href).hasOwnProperty('result')) {
      if (keys.length !== 0 && orderQuery.result === 'success') {
        (async () => {
          window.history.replaceState({}, document.title, '/');
          const res = await successOrder(orderQuery);
          if (res.data.error) {
            toast.get().setToastText(`${res.data.error}`).openIconToast('exclamationmark');
          } else {
            f7router.navigate(`/orders/${res.data.id}`);
            await getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data })));
            queryClient.setQueryData(['orders'], (data) => ({
              pages: [res.data, ...data.pages],
            }));
          }
        })();
      } else if (keys.length !== 0 && orderQuery.result === 'fail') {
        window.history.replaceState({}, document.title, '/');
        toast.get().setToastText(`${orderQuery.message}`).openIconToast('exclamationmark');
      }
    }
  }, []);

  useEffect(() => {
    const onInit = async () => {
      const promises = [
        getLikedSchools().then(({ data }) => setLikedSchools(data)),
        getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data }))),
      ];
      await Promise.all(promises);
      // 위치 설정이 안된 유저는 강제 위치설정
      if (!user.lat || !user.lng) {
        f7ready((f7) =>
          f7.views.current.router.navigate('/current-location/', { props: { force: true }, animate: false }),
        );
        toast.get().setToastText('찾으실 학원 근처 위치를 설정해주세요!').openToast();
      }
    };
    onInit();
  }, []);

  return (
    <Page name="home">
      <HomeNavbar
        title={
          <a href="/current-location/" className="button text-color-black">
            <span>{user.address2}</span>
            <i className="icon f7-icons if-not-md" style={{ fontSize: 16 }}>
              chevron_down
            </i>
            <i className="icon material-icons if-md" style={{ fontSize: 16 }}>
              chevron_down
            </i>
          </a>
        }
        slot="fixed"
        main
      >
        <NavRight>
          <Button href="/schools/search">
            <Icon f7="search" />
          </Button>
        </NavRight>
      </HomeNavbar>
      <BannerSlide />
      <CategoriesGrid />
      <EventSwiper />
      {/* <Button onClick={testHandler} fill>
        Test Alamofire Interface
      </Button> */}
      <div className="h-16" />
      <Footer />
    </Page>
  );
};

export default HomePage;
