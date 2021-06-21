class V1::CalculateHistorySerializer < V1::BaseSerializer
  attributes :id, :start_at, :end_at, :name, :order_count, :status
end