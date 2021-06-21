class V1::SchoolEachSerializer < V1::BaseSerializer
  attributes :id, :name, :location, :introduce, :phone, :lat, :lng, :average_score, :like_count
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
end