class V1::LineItemEachSerializer < V1::BaseSerializer
  attributes :id, :price
  has_one :lecture, serializer: self.module_parent::LectureSerializer, only: {
    instance: [:id, :school, :teacher, :price, :title, :images, :category, :start_at, :end_at],
    school: [:id, :name, :phone],
    teacher: [:id, :name],
    category: [:id, :title],
  }
end