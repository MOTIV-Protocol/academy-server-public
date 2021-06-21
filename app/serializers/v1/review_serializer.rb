class V1::ReviewSerializer < V1::BaseSerializer
  attributes :id, :score, :content, :created_at
  has_one :user, serializer: self.module_parent::UserSerializer
  has_one :order, serializer: self.module_parent::OrderSerializer
  has_one :comment, serializer: self.module_parent::CommentSerializer
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
end