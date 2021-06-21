class V1::UserCouponSerializer < V1::BaseSerializer
  attributes :id, :user_id, :coupon_id, :order_id, :status, :used_at, :created_at, :updated_at 
end