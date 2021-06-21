class V1::CouponSerializer < V1::BaseSerializer
  attributes :id, :name, :created_at, :updated_at, :discount_price, :minimum_order_price, :expires_at, :used_at
end