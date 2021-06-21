class AddStatusToPointHistories < ActiveRecord::Migration[6.0]
  def change
    # 적립, 사용 외에 어떤 상태가 들어올지 몰라 우선 limit은 걸지 않을게요
    add_column :point_histories, :status, :integer, default: 0
    add_reference :point_histories, :order, foreign_key: true
  end
end
