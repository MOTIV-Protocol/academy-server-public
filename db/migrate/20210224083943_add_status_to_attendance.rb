class AddStatusToAttendance < ActiveRecord::Migration[6.0]
  def change
    add_column :attendances, :status, :integer, limit: 2, default: 0
  end
end
