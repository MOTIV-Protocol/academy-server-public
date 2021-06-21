class V1::EventEachSerializer < V1::BaseSerializer
  include ImagableSerializer

  attributes :id, :title, :created_at, :start_at, :end_at
end