class CalculateHistory < ApplicationRecord
  has_many :orders, dependent: :destroy
  has_many :schools, through: :orders

  enum status: [:yet, :done] # 미지급, 지급
  ransacker :status, formatter: proc {|v| statuses[v]}

  # 정산 생성 후 정산에 포함되지 않은 Order를 모두 새로 생성되는 CalculateHistory에 담습니다.
  after_create do
    orders = Order.complete.ransack(calculate_history_id_null: true).result
    orders.each do |order|
      order.calculate_history = self
      order.save!
    end
    self.save!
  end
end
