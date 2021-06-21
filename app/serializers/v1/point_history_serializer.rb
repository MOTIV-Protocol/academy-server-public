class V1::PointHistorySerializer < V1::BaseSerializer
  attributes :id, :user_id, :amount, :created_at, :updated_at, :status, :order_id
  has_one :order, serializer: self.module_parent::OrderEachSerializer, only: {
    instance: [:id, :school],
    school: [:id, :name]
  }
end