class V1::OrderEachSerializer < V1::BaseSerializer
  attributes :id, :status, :title, :has_review, :total_price, :amount, :used_point
  has_many :line_items, each_serializer: self.module_parent::LineItemEachSerializer
  has_one :school, serializer: self.module_parent::SchoolSerializer, only: {
    instance: [:id, :name, :phone]
  }
  has_one :user, serializer: self.module_parent::UserSerializer, only: {
    instance: [:name]
  }

  def title
    lectures = object.lectures
    return nil if lectures.size == 0
    return "#{lectures.first.title}#{"외 #{lectures.size}건" if lectures.size > 1}"
  end

  # def school
  #   lectures = object.lectures
  #   return nil if object.lectures.size == 0
  #   return self.class.module_parent::SchoolEachSerializer.new.serialize(lectures.first.school)
  # end

  def has_review
    object.review.present?
  end

  def total_price
    object.line_items.sum(:price)
  end
end