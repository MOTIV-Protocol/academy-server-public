import { LectureModel, LineItemModel, SchoolModel, Token, UserModel } from "@constants";

export interface AuthState extends Token {
  // isLoading: boolean;
  currentUser: UserModel; // TODO currentUser 인터페이스화
}

export interface CartState {
  line_items: LineItemModel[];
  order_number?: string;
  visible: boolean;
}
