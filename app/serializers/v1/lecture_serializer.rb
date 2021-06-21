class V1::LectureSerializer < V1::BaseSerializer
  attributes :id, :title, :price, :description, :start_at, :end_at, :school_id
  has_many :images, each_serializer: self.module_parent::ImageSerializer
  has_one :teacher, serializer: self.module_parent::UserSerializer
  has_one :school, serializer: self.module_parent::SchoolSerializer, only: {
    instance: [:id, :name, :phone]
  }
  has_one :category, serializer: self.module_parent::CategorySerializer, only: {
    instance: [:id, :title, :root],
    # root: [:id, :title]
    root: {
      instance: [:id, :title]
    }
  }
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
end