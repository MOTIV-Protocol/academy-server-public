class V1::UserCouponEachSerializer < V1::BaseSerializer
  attributes :id, :user_id, :coupon_id, :order_id, :status, :used_at, :created_at, :updated_at 
  has_one :coupon, serializer: self.module_parent::CouponEachSerializer, only: {
    instance: [:name, :content, :discount_price, :minimum_order_price, :expires_at]
  }
end