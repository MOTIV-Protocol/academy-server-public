class RemoveStartAtEndAtFromCalculateHistories < ActiveRecord::Migration[6.0]
  def change
    remove_column :calculate_histories, :start_at
    remove_column :calculate_histories, :end_at
  end
end
