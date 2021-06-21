class V1::AttendanceSerializer < V1::BaseSerializer
  attributes :id, :attended_at, :status
  has_one :lecture, serializer: self.module_parent::LectureEachSerializer
  has_one :user, serializer: self.module_parent::UserEachSerializer
end