class V1::UserSerializer < V1::BaseSerializer
  include ImagableSerializer
  attributes :id, :email, :name, :description, :role, :status, :address1, :address2, :lat, :lng, :point
  has_one :own_school, serializer: self.module_parent::SchoolSerializer
  has_one :teaching_school, serializer: self.module_parent::SchoolSerializer
  has_many :teaching_lectures, each_serializer: self.module_parent::LectureEachSerializer
end