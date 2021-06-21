class UserCoupon < ApplicationRecord
  belongs_to :user
  belongs_to :coupon
  belongs_to :order, optional: true

  enum status: %i[yet used]
  ransacker :status, formatter: proc {|v| statuses[v]}
end
