class RedesignCalculateHistories < ActiveRecord::Migration[6.0]
  def change
    remove_column :calculate_histories, :user_id
    remove_column :calculate_histories, :order_id
    remove_column :calculate_histories, :price
    
    add_column :calculate_histories, :start_at, :date
    add_column :calculate_histories, :end_at, :date
    add_column :calculate_histories, :name, :string, :null => false
    add_column :calculate_histories, :order_count, :integer, :null => false, :default => 0

    add_column :orders, :calculate_history_id, :integer, :null => true
  end
end
