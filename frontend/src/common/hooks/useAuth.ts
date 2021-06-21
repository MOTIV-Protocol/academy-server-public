import { useRecoilState } from 'recoil';
import { Token } from '@constants';
import { getCurrentUserFromToken } from '@utils';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';
import { AuthState } from '@constants/states';
import { AppInterface } from '@utils/interfaces';
import { putUsers } from '@api';
import { getDevice } from 'framework7';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = async ({ token, csrf }: Token) => {
    saveToken({ token, csrf });
    const newCurrentUser = await getCurrentUserFromToken(token);
    setCurrentUser({ token, csrf, currentUser: newCurrentUser });

    // Android, iOS 환경일 경우, FCM Token 받은 후, 서버에 저장
    const device_type = (AppInterface.isAndroid() && 'android') || (AppInterface.isIOS() && 'ios') || null;
    if (getDevice().ios || getDevice().android) {
      try {
        const device_token = await AppInterface.getFCMToken();
        putUsers(newCurrentUser.id, { device_token, device_type });
      } catch (error) {
        console.log('FCM토큰 서버 저장 실패');
      }
    }
  };

  const unAuthenticateUser = () => {
    destroyToken();
    setCurrentUser({ token: null, csrf: null, currentUser: null });
  };

  return {
    ...currentUser,
    authenticateUser,
    unAuthenticateUser,
    isAuthenticated: !!currentUser.token && !!currentUser.csrf,
  };
};

export default useAuth;
