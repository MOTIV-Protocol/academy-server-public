import { getDevice } from 'framework7';

// 타입스크립트 에러를 막기위해 any 타입으로 캐스팅
const _window = window as any;

export const AppInterface = {
  // Android 환경인지 판별
  isAndroid() {
    return getDevice().android;
  },
  // iOS 환경인지 판별
  isIOS() {
    return getDevice().ios;
  },
  // Native에 데이터를 보내기위한 유틸 함수
  send(interfaceName: string, body: any = {}) {
    if (AppInterface.isAndroid()) {
      _window[interfaceName]?.popOpened(body);
    } else if (AppInterface.isIOS()) {
      _window.webkit?.messageHandlers[interfaceName]?.postMessage(body);
    } else {
      console.error('No native APIs found.');
    }
  },
  // AppInterface.debug("something")을 입력하면 Native 콘솔창에 출력됩니다. console.log()와 같은 디버깅용 함수
  debug(message: any) {
    AppInterface.send('debug', { message: `${message}` });
  },
  // FCMToken을 응답 받는 비동기 함수
  getFCMToken(timeout: number = 5000) {
    if (getDevice().ios) {
      AppInterface.send('fcm', { cmd: 'getToken' });
      return new Promise<String>((resolve, reject) => {
        setTimeout(() => reject && reject('Swift 응답 타임아웃'), timeout);
        _window.fcm.promises.push(resolve);
      });
    } else if (getDevice().android) {
      // 안드로이드에서 FCM 토큰을 받아주세요.
      return new Promise((resolve) => resolve('INPUT_FCM_TOKEN_HERE'));
    }
  },
  // Geolocation을 응답 받는 비동기 함수
  getGeolocation(): Promise<GeolocationResponse> {
    if (getDevice().ios && _window.webkit) {
      // iOS는 Swift로 요청
      AppInterface.send('geolocation');
      return new Promise<GeolocationResponse>((resolve) => {
        _window.geolocation.promises.push(resolve);
      });
    } else {
      // Android, Web은 기존 방식대로 진행
      return new Promise<GeolocationResponse>((resolve) => {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            resolve({ lat, lng, status: 'success' });
          },
          () => resolve({ lat: 0, lng: 0, status: 'fail' }),
          { enableHighAccuracy: true },
        );
      });
    }
  },
  gotoGeolocationSettings() {
    if (getDevice().android) {
      window.location.href = 'package:root=location-settings';
    } else if (getDevice().ios) {
      window.location.href = 'app-settings:root=LOCATION_SERVICES';
    }
  },
};

interface AlamofireRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  headers: {
    [key: string]: string;
  };
  params: {
    [key: string]: string;
  };
}

interface AlamofireResponse {
  statusCode: string;
  data: string;
}

export const AlamofireInterface = {
  request(requestBody: AlamofireRequest, timeout: number = 10000) {
    const _event_id = `${Math.random()}`.slice(2);
    AppInterface.send('alamofire', { ...requestBody, _event_id });
    return new Promise<AlamofireResponse>((resolve, reject) => {
      setTimeout(() => reject && reject('Swift 응답 타임아웃'), timeout);
      _window.alamofire.appendEvent({
        _event_id,
        resolve,
        reject,
      });
    });
  },
};

interface IEvent {
  _event_id: string;
  resolve: (response: AlamofireResponse) => void;
  reject: (reason?: any) => void;
}

// Alamofire 요청에 대한 응답을 Native로 부터 콜백 응답 받기 위함
_window.alamofire = {
  events: [] as IEvent[],
  callback(_event_id: string, statusCode?: string, data?: string) {
    const event = (_window.alamofire.events as Array<IEvent>).find((each) => each._event_id === _event_id);
    if (event) {
      if (statusCode && data) event.resolve({ statusCode, data });
      else event.reject('failure');
    }
  },
  appendEvent(event: IEvent) {
    _window.alamofire.events.push(event);
  },
};

// FCM Token에 대한 요청을 Native로 부터 콜백 응답 받기 위함
_window.fcm = {
  promises: [] as Promise<string>[],
  callback(value) {
    _window.fcm.promises.forEach((promise) => promise && promise(value));
    _window.fcm.promises = [];
  },
};

interface GeolocationResponse {
  lat: number;
  lng: number;
  status: 'success' | 'fail';
}

// Geolocation 에 대한 요청을 Native로 부터 콜백 응답 받기 위함
_window.geolocation = {
  promises: [] as Promise<string>[],
  callback(lat: string, lng: string, status: 'success' | 'fail') {
    _window.geolocation.promises.forEach(
      (promise) => promise && promise({ lat: parseFloat(lat), lng: parseFloat(lng), status }),
    );
    _window.geolocation.promises = [];
  },
};
