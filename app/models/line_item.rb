class LineItem < ApplicationRecord
  belongs_to :lecture
  belongs_to :order

  before_create do
    self.price = self.lecture.price if self.price.nil?
  end
end
