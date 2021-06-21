class V1::CategorySerializer < V1::BaseSerializer
  include ImagableSerializer
  
  attributes :id, :title, :position

  has_one :root, serializer: self.module_parent::CategorySerializer
end