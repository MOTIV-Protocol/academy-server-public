import React, { useEffect, useState } from 'react';
import { Block, Button, f7, f7ready, List, ListItem, Page, PageContent } from 'framework7-react';
import { configs } from '@config';
import { getAddressByLatLng, getUser, putUsers, searchAddress } from '../../common/api';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userSelector } from '@selectors';
import { toast } from '@utils';
import { cartState } from '@atoms';
import { AppInterface } from '@utils/interfaces';
import { getDevice } from 'framework7';

const CurrentLocation = (props) => {
  const { force = false } = props;
  const [user, setUserState] = useRecoilState(userSelector);
  const setCartState = useSetRecoilState(cartState);
  const [state, setState] = useState({
    term: '',
    data: null,
    kakaoMap: null,
    kakaoMapMarker: null,
    kakaoLocation: null,
    addressName: user.address1,
    placeName: user.address2,
    lat: user.lat || 37.506502,
    lng: user.lng || 127.053617,
    gpsLoading: false,
  });

  // 현재 위치로 설정
  const setCurrentLocation = async () => {
    f7.preloader.show();
    setState((state) => ({ ...state, gpsLoading: true }));
    const { lat, lng, status } = await AppInterface.getGeolocation();
    if (status === 'success') {
      locateTo(lat, lng);
    } else if (status === 'fail') {
      f7.dialog.confirm('위치 권한이 없습니다. <br/> 위치 추적 권한을 허용해주세요.', '', () =>
        AppInterface.gotoGeolocationSettings(),
      );
    }
    setState((state) => ({ ...state, gpsLoading: false }));
    f7.preloader.hide();
  };

  // 카카오 지도 Init 작업
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${configs.kakao_javascript_key}&autoload=false`;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        const initialLocation = new kakao.maps.LatLng(state.lat, state.lng);
        let container = document.getElementById('map');
        let options = {
          center: initialLocation,
          level: 5,
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        const kakaoMapMarker = new kakao.maps.Marker({ position: initialLocation });
        kakaoMapMarker.setMap(kakaoMap);
        setState((state) => ({ ...state, kakaoMap, kakaoMapMarker, kakaoLocation: initialLocation }));
        if (!state.addressName) locateTo(state.lat, state.lng);
      });
    };
    document.head.appendChild(script);
    setCartState((state) => ({ ...state, visible: false }));
    return () => {
      document.head.removeChild(script);
      setCartState((state) => ({ ...state, visible: true }));
    };
  }, []);

  // 검색창 입력 및 검색 버튼 핸들러
  const inputHandler = (e) => setState((state) => ({ ...state, term: e.target.value }));
  const searchByTerm = async () => {
    const options = { lat: state.kakaoLocation?.getLat(), lng: state.kakaoLocation?.getLng() };
    const {
      data: { documents },
    } = await searchAddress(state.term, options);
    setState((state) => ({ ...state, data: documents || [] }));
  };

  // 설정한 좌표로 지도, 마커를 이동합니다.
  const locateTo = async (lat, lng, placeName = null, addressName = null) => {
    const { kakaoMap, kakaoMapMarker } = state;

    if (placeName === null || addressName === null) {
      f7.preloader.show();
      const {
        data: { documents },
      } = await getAddressByLatLng(lat, lng);
      placeName = addressName = documents[0]?.address?.address_name || null;
      f7.preloader.hide();
    }

    var kakaoLocation = new kakao.maps.LatLng(lat, lng);
    kakaoMap?.panTo(kakaoLocation);
    kakaoMapMarker?.setMap(null);
    const newMarker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(lat, lng) });
    newMarker.setMap(kakaoMap);
    setState((state) => ({ ...state, kakaoMapMarker: newMarker, placeName, addressName, kakaoLocation, lat, lng }));
  };

  // 지도 설정 완료
  const submit = async () => {
    const { lat, lng, addressName: address1, placeName: address2 } = state;
    if (!lat || !lng) {
      toast.get().setToastText('위치를 설정해주세요!').openToast();
      return;
    }
    f7.preloader.show();
    try {
      await putUsers(user.id, { user: { lat, lng, address1, address2 } });
      await getUser(user.id).then(({ data }) => setUserState((state) => ({ ...state, ...data })));
      toast.get().setToastText('위치를 저장했어요!').openToast();
      f7ready((f7) => f7.views.current.router.back());
    } catch (err) {
      toast.get().setToastText(err.message).openToast();
    } finally {
      f7ready((f7) => f7.preloader.hide());
    }
  };

  return (
    <Page noSwipeback noToolbar className="padding-horizontal" pageContent={false}>
      <PageContent className="flex flex-col" style={{ paddingTop: 16, paddingBottom: 0 }}>
        <div className="flex justify-between">
          {force ? (
            <div></div>
          ) : (
            <a href="#" className="back flex items-center">
              <i className="icon f7-icons if-not-md">xmark</i>
              <i className="icon material-icons if-md">xmark</i>
            </a>
          )}
          {state.placeName && <div className="font-bold text-lg flex items-center">{state.placeName}</div>}
          <Button onClick={submit} large disabled={!state.lat}>
            선택
          </Button>
        </div>

        <div className="relative">
          <div id="map" className="w-full rounded" style={{ height: 200 }}></div>
          <div className="absolute right-1 bottom-1 z-10">
            <Button disabled={state.gpsLoading} fill onClick={setCurrentLocation}>
              현재 위치로 설정
            </Button>
          </div>
        </div>

        <h1 style={{ wordBreak: 'keep-all' }}>지번, 도로명, 건물명을 입력하세요</h1>
        <div className="display-flex align-items-center">
          <input
            type="text"
            placeholder="예) 학동동 17-3 또는 닷컴아파트"
            style={{ fontSize: '18px', padding: '8px', flex: '1' }}
            value={state.term}
            onInput={inputHandler}
          />
          <a href="#" className="button button-fill" onClick={searchByTerm}>
            <i className="icon f7-icons if-not-md" style={{ fontSize: '20px' }}>
              search
            </i>
            <i className="icon material-icons if-md" style={{ fontSize: '20px' }}>
              search
            </i>
          </a>
        </div>

        <hr />

        <List mediaList noHairlines className="flex-1 overflow-y-scroll">
          {state.data === null ? (
            <Block>
              집 주소를 검색해주세요!
              <br />
              <small>주변 학원을 보여드릴게요!</small>
            </Block>
          ) : state.data.length === 0 ? (
            <Block>검색 결과가 없어요!</Block>
          ) : (
            state.data.map(({ id, place_name, address_name, y: lat, x: lng }) => (
              <ListItem
                link="#"
                key={id}
                title={place_name}
                subtitle={address_name}
                onClick={() => locateTo(lat, lng, place_name, address_name)}
              ></ListItem>
            ))
          )}
        </List>
      </PageContent>
    </Page>
  );
};

export default CurrentLocation;
