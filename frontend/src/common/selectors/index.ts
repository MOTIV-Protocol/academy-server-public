import _ from 'lodash';
import { selector } from 'recoil';
import { AuthState } from '@constants/states';
import { authState } from '@atoms';
import { UserModel } from '@constants';

export const authSelector = selector<AuthState>({
  key: 'authSelector',
  get: ({ get }) => get(authState),
  set: ({ set }, newAuthState: AuthState) => set(authState, newAuthState),
});

export const userSelector = selector<UserModel>({
  key: 'userSelector',
  get: ({ get }) => get(authState).currentUser,
  set: ({ set }, currentUser: any) =>
    set(authState, (state) => ({ ...state, currentUser: { ...state.currentUser, ...currentUser } })),
});
