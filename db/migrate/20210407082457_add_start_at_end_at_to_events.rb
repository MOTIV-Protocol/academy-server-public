class AddStartAtEndAtToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :start_at, :datetime
    add_column :events, :end_at, :datetime
  end
end
