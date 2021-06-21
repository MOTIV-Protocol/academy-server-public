class V1::OrderSerializer < V1::BaseSerializer
  attributes :id, :status, :title, :school, :pay_method, :say_to_teacher, :say_to_owner, :total_price, :amount, :used_point
  has_many :line_items, each_serializer: self.module_parent::LineItemEachSerializer
  has_one :school, serializer: self.module_parent::SchoolSerializer, only: {
    instance: [:id, :name, :phone]
  }
  has_one :user, serializer: self.module_parent::UserSerializer, only: {
    instance: [:id, :name]
  }

  def title 
    lectures = object.lectures
    "#{lectures.first.title}#{"외 #{lectures.size}건" if lectures.size > 1}"
  end

  def total_price
    object.line_items.sum(:price)
  end
end