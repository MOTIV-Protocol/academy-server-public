class Order < ApplicationRecord
  after_save :modify_calculate_history_price,
    -> (obj) {obj.saved_change_to_calculate_history_id? || obj.saved_change_to_payment_total}
  before_destroy :reduce_calculate_history_price

  belongs_to :user, optional: true
  belongs_to :calculate_history, optional: true, counter_cache: :order_count
  belongs_to :school, optional: true, counter_cache: :order_count
  has_many :line_items, dependent: :destroy
  has_many :lectures, through: :line_items, source: :lecture
  has_one :review, dependent: :destroy
  has_many :point_histories, dependent: :nullify
  has_many :user_coupons, dependent: :nullify
  paginates_per 8

  enum pay_method: [:card, :kakao, :toss]
  ransacker :pay_method, formatter: proc {|v| pay_methods[v]}
  enum status: [:cart, :ready, :paid, :complete, :canceled]
  ransacker :status, formatter: proc {|v| statuses[v]}
  
  def update_order_number 
    order_number = ''
    loop do
      order_number = SecureRandom.hex(10).upcase
      break if Order.find_by(order_number: order_number).nil?
    end
    self.update!(order_number: order_number)
  end

  private
  def modify_calculate_history_price
    before = CalculateHistory.find_by_id calculate_history_id_before_last_save
    if before.present?
      before.profit -= payment_total_before_last_save
      before.save!
    end
    after = CalculateHistory.find_by_id calculate_history_id
    if after.present?
      after.profit += payment_total
      after.save!
    end
  end

  private
  def reduce_calculate_history_price
    calculate_history = CalculateHistory.find_by_id self.calculate_history_id
    if calculate_history.present? && self.payment_total.present?
      calculate_history.profit -= self.payment_total
      calculate_history.save!
    end
  end
end
