import React from 'react';
import packageJson from '../../../package.json';
import { AttendanceModel, CalculateHistoryModel, CategoryModel, CommentModel, ContactModel, CouponModel, EventModel, FaqModel, Imagable, ImageModel, LectureModel, LikeModel, LineItemModel, Model, NoticeModel, OrderModel, PointHistoryModel, ReviewModel, SchoolModel, UserModel, UserCouponModel } from './schema';
export type { Model, Imagable, UserModel, AttendanceModel, CalculateHistoryModel, CategoryModel, CommentModel, ContactModel, CouponModel, EventModel, FaqModel, ImageModel, LectureModel, LikeModel, LineItemModel, NoticeModel, OrderModel, PointHistoryModel, ReviewModel, SchoolModel, UserCouponModel };

/** 리터럴 혹은 불변 객체 */
export const TOKEN_KEY = `${packageJson.name}_TOKEN`;
export const CSRF_KEY = `${packageJson.name}_CSRF`;

export const ACTIONS = {
  NEW: 'new',
  INDEX: 'index',
  EDIT: 'edit',
  SHOW: 'show',
};

export const LOGIN_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
};

export const DEFAULT_ACTIONS = Object.values(ACTIONS);

/** 인터페이스 */

export interface F7ComponentProps {
  f7route?: any;
  f7router?: any;
  id?: number | string;
  [key: string]: any;
}

/* User Auth Interfaces */
export interface Token {
  token: null | string;
  csrf: null | string;
}

export interface TokenPayload {
  user: any; // TODO IToknePayload any 타입 변경
}

/* Routes Interfaces */

export interface Route {
  path: string;
  component?: React.FunctionComponent;
  async?: any;
}

export interface ResourceRoute {
  resource: string;
  collection?: string[];
  member?: string[];
  only?: ('show' | 'edit' | 'new' | 'index')[];
}