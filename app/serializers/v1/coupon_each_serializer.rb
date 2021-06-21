class V1::CouponEachSerializer < V1::BaseSerializer
  attributes :id, :name, :created_at, :updated_at, :discount_price, :minimum_order_price, :expires_at, :used_at
  has_one :user, serializer: self.module_parent::UserEachSerializer, only: {
    instance: [:id, :name]
  }
  has_one :order, serializer: self.module_parent::OrderEachSerializer, only: {
    instance: [:id, :title]
  }
end