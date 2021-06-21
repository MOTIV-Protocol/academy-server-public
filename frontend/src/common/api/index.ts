import {
  AttendanceModel,
  CalculateHistoryModel,
  CategoryModel,
  CommentModel,
  ContactModel,
  CouponModel,
  EventModel,
  FaqModel,
  ImageModel,
  LectureModel,
  LikeModel,
  LineItemModel,
  NoticeModel,
  OrderModel,
  PointHistoryModel,
  ReviewModel,
  SchoolModel,
  Token,
  UserModel,
  UserCouponModel,
} from '@constants';
import { CartState } from '@constants/states';
import { getToken, saveToken, destroyToken } from '@store';
import { Resetter } from 'recoil';
import { PlainAPI, API, API_URL, version, KakaoAPI } from './api.config';
export { version };

export const refresh = (): Promise<Token> =>
  PlainAPI.post<Token>(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  ).then((res) => {
    saveToken(res.data);
    return res.data;
  });

export const get = (url: string, params?: any) => PlainAPI.get(url, { params });
export const loginAPI = (params: any) => PlainAPI.post<Token>('/login', params);
export const signUpAPI = (params: any) => PlainAPI.post<Token>('/signup', params);
export const logOutAPI = (resetter?: Resetter) => API.delete('/logout').then(() => destroyToken(resetter));

export const getSmsAuth = (params?: any) => API.get('/phone_certifications/sms_auth', { params });
export const getCategories = (params?: any) => API.get<CategoryModel[]>('/categories', { params });
export const getCategory = (id: number, params?: any) => API.get<CategoryModel>(`/categories/${id}`, { params });

export const getSchools = (params?: any) => API.get<SchoolModel[]>('/schools', { params });
export const getSchool = (id: number, params?: any) => API.get<SchoolModel>(`/schools/${id}`, params);
export const updateSchool = (id: number, data: any) => API.put<SchoolModel>(`/schools/${id}`, data);
export const getSchoolsWithoutToken = (params?: any) => PlainAPI.get<SchoolModel[]>('/schools/list', { params });

export const getLectures = (params?: any) => API.get<LectureModel[]>('/lectures', { params });
export const getLecture = (id: number, params?: any) => API.get<LectureModel>(`/lectures/${id}`, { params });
export const postLectures = (data?: any) => API.post<LectureModel>('/lectures/', data);
export const putLectures = (id: number, data?: any) => API.put<LectureModel>(`/lectures/${id}`, data);
export const getTeachingLectures = (params?: any) => API.get<LectureModel[]>('/lectures/teaching_lectures', { params });
export const getAttenders = (lectureId: number, params?: any) =>
  API.get<UserModel[]>(`/lectures/${lectureId}/attenders`, { params });

export const getComments = (params?: any) => API.get<CommentModel[]>(`/comments`, { params });
export const getComment = (id: number, params?: any) => API.get<CommentModel>(`/comments/${id}`, { params });
export const postComments = (data?: any) => API.post(`/comments`, data);
export const deleteComments = (id: number, params?: any) => API.delete(`/comments/${id}`, { params });

export const getNotices = (params?: any) => API.get<NoticeModel[]>(`/notices`, { params });
export const getNotice = (id: number, params?: any) => API.get<NoticeModel>(`/notices/${id}`, { params });

export const getUsers = (params?: any) => API.get<UserModel[]>('/users', { params });
export const getUser = (id: number, params?: any) => API.get<UserModel>(`/users/${id}`, { params });
export const putUsers = (id: number, data?: any) => API.put(`/users/${id}`, data);
export const postUserAccept = (id: number, data?: any) => API.post(`/users/${id}/accept`, data);
export const postUserReject = (id: number, data?: any) => API.post(`/users/${id}/reject`, data);

export const getCart = (params?: any) => API.get<CartState>('/line_items/cart', { params });
export const getLineItems = (params?: any) => API.get<LineItemModel[]>('/line_items', { params });
export const postLineItems = (data?: any) => API.post('/line_items', data);
export const destroyLineItems = (id: number, params?: any) => API.delete(`/line_items/${id}`, { params });

export const getOrders = (params?: any) => API.get<OrderModel[]>('/orders', { params });
export const getOrder = (id: number, params?: any) => API.get<OrderModel>(`/orders/${id}`, { params });
export const updateCart = (params?: any) => API.put('/orders/payment', { params });
export const successOrder = (params?: any) => PlainAPI.get('/orders/success', { params });
export const failOrder = (params?: any) => PlainAPI.get('/orders/fail', { params });

export const getLikes = (params?: any) => API.get<LikeModel[]>('/likes', { params });
export const postLikes = (params?: any) => API.post('/likes', { ...params });
export const deleteLikes = (id: number, params?: any) => API.delete(`/likes/${id}`, { params });
export const getLikedSchools = (params?: any) => API.get<SchoolModel[]>('/likes/liked_schools', { params });

export const getReviews = (params?: any) => API.get<ReviewModel[]>('/reviews', { params });
export const getReview = (id: number, params?: any) => API.get<ReviewModel>(`/reviews/${id}`, { params });
export const postReviews = (data?: any) => API.post('/reviews', data);
export const deleteReviews = (id: number, params?: any) => API.delete(`/reviews/${id}`, { params });

export const getEvents = (params?: any) => API.get<EventModel[]>('/events', { params });
export const getEvent = (id: number, params?: any) => API.get<EventModel>(`/events/${id}`, { params });

export const getImages = (params?: any) => API.get<ImageModel[]>(`/images`, { params });
export const postImages = (data?: any) => API.post<ImageModel>('/images', data);
export const putImages = (id: number, data?: any) => API.put<ImageModel>(`/images/${id}`, data);
export const deleteImage = (id: number, params?: any) => API.delete(`/images/${id}`, { params });

export const getCalculateHistories = (params?: any) =>
  API.get<CalculateHistoryModel[]>('/calculate_histories', { params });
export const getCalculateHistory = (id: number, params?: any) =>
  API.get<CalculateHistoryModel>(`/calculate_histories/${id}`, { params });

export const getFaqs = (params?: any) => API.get<FaqModel[]>('/faqs', { params });

export const getContacts = (params?: any) => API.get<ContactModel[]>('/contacts', { params });
export const postContacts = (data?: any) => API.post('/contacts', data);

export const getPointHistories = (params?: any) => API.get<PointHistoryModel[]>('/point_histories', { params });

export const getCoupons = (params?: any) => API.get<CouponModel[]>('/coupons', { params });
export const deleteCoupons = (id: number, params?: any) => API.get<CouponModel[]>(`/coupons/${id}`, { params });

export const getUserCoupons = (params?: any) => API.get<UserCouponModel[]>('/user_coupons', { params });
export const postUserCoupons = (data?: any) => API.post('/user_coupons', data);

export const getAttendances = (params?: any) => API.get<AttendanceModel[]>('/attendances', { params });
export const postAttendances = (data?: any) => API.post('/attendances', data);
export const putAttendences = (id: number, data?: any) => API.put(`/attendances/${id}`, data);
export const deleteAttendances = (id: number, params?: any) => API.delete(`/attendances/${id}`, { params });
export const postAttendanceBook = (lectureId: number, attended_at: any) =>
  API.post('/attendances/book', { attended_at, lecture: { id: lectureId } });
export const getAttendanceByLecture = (lecture_id: number, params?: any) =>
  API.get<AttendanceModel[]>('/attendances/one_by_lecture', { params: { ...params, attendance: { lecture_id } } });

export const searchAddress = (term: any, { lat, lng }) =>
  KakaoAPI.get('/v2/local/search/keyword.json', { params: { query: term, x: lng, y: lat } });
export const getAddressByLatLng = (lat: number, lng: number) =>
  KakaoAPI.get('/v2/local/geo/coord2address.json', { params: { x: lng, y: lat } });

export const api_url = API_URL;
