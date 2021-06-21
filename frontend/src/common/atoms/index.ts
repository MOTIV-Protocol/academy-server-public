import { atom } from 'recoil';
import { getCurrentUserFromToken } from '@utils';
import { AuthState, CartState } from '@constants/states';
import { SchoolModel, Token } from '@constants';
import { getToken } from '@store';

/*
 Type 정의는 이곳에 합니다.
  - '@constants/states' (기본)
  - '@constants' (Model 그 자체를 단수/복수로 사용하는 경우, 별도 State를 만들지 않고 사용합니다.)
*/

// 토큰과 유저 정보를 저장합니다.
export const authState = atom<AuthState>({
  key: 'authState',
  default: new Promise(async (resolve) =>
    resolve({
      ...(getToken() as Token),
      currentUser: getToken()?.token ? await getCurrentUserFromToken(getToken()?.token) : null,
    }),
  ),
});

// 장바구니(강의) 항목을 저장합니다.
export const cartState = atom<CartState>({
  key: 'cartState',
  default: {
    line_items: [],
    visible: true,
    order_number: '',
  },
});

// 찜한 학원 목록을 저장합니다.
export const likedSchoolsState = atom<SchoolModel[]>({
  key: 'likedSchoolState',
  default: [],
});
