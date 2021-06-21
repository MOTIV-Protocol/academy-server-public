class PointHistory < ApplicationRecord
  belongs_to :user
  belongs_to :order
  after_create :update_user_point

  enum status: [:plus, :minus]
  ransacker :status, formatter: proc {|v| statuses[v]}

  def update_user_point
    user = self.user
    current_point = user.point
    value = amount
    result = self.plus? ? current_point + value : current_point - value
    user.update(point: result)
  end
end
