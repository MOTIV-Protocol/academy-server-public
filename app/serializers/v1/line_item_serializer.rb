class V1::LineItemSerializer < V1::BaseSerializer
  attributes :id, :price
  has_one :lecture, serializer: self.module_parent::LectureSerializer, only: {
    instance: [:id, :school],
    school: [:id, :name]
  }
end