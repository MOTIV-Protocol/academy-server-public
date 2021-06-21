class Attendance < ApplicationRecord
  paginates_per 8
  belongs_to :lecture
  belongs_to :user

  enum status: [:absence, :presence] # 결석, 출석
  ransacker :status, formatter: proc {|v| statuses[v]}

  before_create do
    self.attended_at = DateTime.now if self.attended_at.nil?
  end
end
