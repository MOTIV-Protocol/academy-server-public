class AddTotalPriceAndStatusToCalculateHistories < ActiveRecord::Migration[6.0]
  def change
    add_column :calculate_histories, :profit, :integer, :null => false, :default => 0
    add_column :calculate_histories, :status, :integer, :limit => 2, :null => false, :default => 0
  end
end
