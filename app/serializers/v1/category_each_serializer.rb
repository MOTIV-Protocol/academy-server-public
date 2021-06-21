class V1::CategoryEachSerializer < V1::BaseSerializer
  include ImagableSerializer
  
  attributes :id, :title, :position
  has_many :children, each_serializer: self.module_parent::CategorySerializer
end