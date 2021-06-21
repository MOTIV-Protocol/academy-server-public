class V1::ReviewEachSerializer < V1::BaseSerializer
  attributes :id, :score, :content, :created_at
  has_one :user, serializer: self.module_parent::UserEachSerializer
  has_one :order, serializer: self.module_parent::OrderEachSerializer
  has_one :comment, serializer: self.module_parent::CommentEachSerializer
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
end