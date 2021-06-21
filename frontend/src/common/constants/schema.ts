export interface Model {
  created_at?: Date | string;
  updated_at?: Date | string;
  id: number;
}

// 이미지 복수개, has_many :images
export interface Imagable {
  images: ImageModel[];
}

// 자신이 이미지를 가지고 있음, image :string
export interface SelfImage {
  image_path?: string;
  thumbnail_path?: string;
}

export interface LatLng {
  lat?: number;
  lng?: number;
}

export type UserRole = 'student' | 'teacher' | 'owner';
export interface UserModel extends Model, SelfImage, LatLng {
  email?: string;
  name?: string;
  description?: string;
  thumbnail_path?: string;
  role?: UserRole;
  status?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  own_school?: SchoolModel;
  teaching_school?: SchoolModel;
  teaching_lectures?: LectureModel;
  point?: number;
  bank?: string;
  bank_account?: string;
  comments?: CommentModel[];
  reviews?: ReviewModel[];
  coupons?: CouponModel[];
  orders?: OrderModel[];
  point_histories?: PointHistoryModel[];
  likes?: LikeModel[];
  liked_schools?: SchoolModel[];
  contacts?: ContactModel[];
  attendances?: AttendanceModel[];
  device_type?: 'android' | 'ios';
  device_otken?: string;
}

export interface AttendanceModel extends Model {
  status?: string;
  attended_at?: Date | string;
  user?: UserModel;
  lecture?: LectureModel;
}

export interface CalculateHistoryModel extends Model {
  name?: string;
  order_count?: number;
  profit?: number;
  status?: string;
  orders?: OrderModel[];
  schools?: SchoolModel[];
  owner_profit?: number;
}

export interface CategoryModel extends Model, SelfImage {
  title?: string;
  body?: string;
  position?: number;
  lectures?: LectureModel[];
  children?: CategoryModel[];
  root?: CategoryModel;
}

export interface CommentModel extends Model {
  body?: string;
  target_type?: string;
  target_id?: number;
  user?: UserModel;
}

export interface ContactModel extends Model {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  content?: string;
}

export interface CouponModel extends Model {
  name?: string;
  content?: string;
  discount_price?: number;
  minimum_order_price?: number;
  expires_at?: string | Date;
}

export interface UserCouponModel extends Model {
  user_id?: number;
  coupon_id?: number;
  status?: string;
  used_at?: string | Date;
  coupon: CouponModel;
}

export type EventType = 'banner' | 'in_page';
export interface EventModel extends Model, SelfImage {
  title?: string;
  content?: string;
  start_at?: Date | string;
  end_at?: Date | string;
  event_type?: EventType;
}

export interface FaqModel extends Model {
  title?: string;
  content?: string;
  classification?: string;
}

export interface ImageModel extends Model, SelfImage {
  imagable_type?: string;
  imagable_id?: string;
}

export interface LectureModel extends Model, Imagable {
  title?: string;
  price?: number;
  category?: CategoryModel;
  description?: string;
  teacher?: UserModel;
  status?: string;
  reviews_average?: number;
  reviews_count?: number;
  start_at?: Date | string;
  end_at?: Date | string;
  capacity?: number;
  school?: SchoolModel;
  line_items?: LineItemModel[];
  orders?: OrderModel[];
  attendances?: AttendanceModel[];
  users?: UserModel[];
}

export interface LikeModel extends Model {
  user: UserModel;
  school: SchoolModel;
}

export interface LineItemModel extends Model {
  lecture?: LectureModel;
  order?: OrderModel;
  price?: number;
  amount?: number;
}

export interface NoticeModel extends Model {
  title: string;
  body: string;
}

export interface OrderModel extends Model {
  pay_method?: string;
  say_to_teacher?: string;
  say_to_owner?: string;
  status?: string;
  user?: UserModel;
  completed_at?: Date | string;
  order_number?: number;
  payment_total?: number;
  school?: SchoolModel;
  payment_key?: string;
  calculate_history?: CalculateHistoryModel;
  schools?: SchoolModel;
  title?: string;
  has_review?: boolean;
  total_price?: number;
  line_items?: LineItemModel[];
  lectures?: LectureModel[];
  review?: ReviewModel;
  point_history?: PointHistoryModel;
  amount?: number;
  used_point?: number;
}

export interface PointHistoryModel extends Model {
  user?: UserModel;
  amount?: number;
  status?: string;
  order?: OrderModel;
  school?: SchoolModel;
}

export interface ReviewModel extends Model, Imagable {
  score?: number;
  content?: string;
  user?: UserModel;
  order?: OrderModel;
}

export type ReviewCount = { score: number; count: number };
export interface SchoolModel extends Model, LatLng, Imagable {
  name?: string;
  location?: string;
  introduce?: string;
  location_info?: string;
  business_number?: string;
  business_owner?: string;
  business_brand?: string;
  business_address?: string;
  opening_time?: string;
  phone?: string;
  owner?: UserModel;
  order_count?: number;
  average_score?: number;
  like_count?: number;
  review_count?: number;
  comment_count?: number;
  lectures: LectureModel[];
  likes?: LikeModel[];
  orders?: OrderModel[];
  reviews?: ReviewModel[];
  comments?: CommentModel[];
  calculate_histories?: CalculateHistoryModel[];
  teachers?: UserModel[];
  review_counts?: ReviewCount[];
  did_like?: boolean;
}
