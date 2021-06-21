class V1::EventSerializer < V1::BaseSerializer
  include ImagableSerializer
  
  attributes :id, :title, :content, :created_at, :start_at, :end_at
end