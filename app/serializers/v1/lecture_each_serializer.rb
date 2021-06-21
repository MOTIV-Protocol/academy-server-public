class V1::LectureEachSerializer < V1::BaseSerializer
  attributes :id, :title, :price, :start_at, :end_at
  has_one :teacher, serializer: self.module_parent::UserSerializer, only: {
    instance: [:id, :name]
  }
  has_one :school, serializer: self.module_parent::SchoolSerializer, only: {
    instance: [:id, :name]
  }
  has_one :category, serializer: self.module_parent::CategorySerializer, only: {
    instance: [:id, :title]
  }
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
end