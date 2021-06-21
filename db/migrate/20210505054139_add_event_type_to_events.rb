class AddEventTypeToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :event_type, :integer, :limit => 2, :default => 0
  end
end
