import { CSRF_KEY, Token, TOKEN_KEY } from '@constants';
import jwt_decode from 'jwt-decode';
import { Resetter } from 'recoil';

export const getToken = (): Token => ({
  csrf: window.localStorage.getItem(CSRF_KEY),
  token: window.localStorage.getItem(TOKEN_KEY),
});

export const saveToken = ({ token, csrf }: Token) => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(CSRF_KEY, csrf);
};

export const destroyToken = (resetter?: Resetter) => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(CSRF_KEY);
  if (resetter) resetter();
  else window.location.reload();
};

export default { getToken, saveToken, destroyToken };
