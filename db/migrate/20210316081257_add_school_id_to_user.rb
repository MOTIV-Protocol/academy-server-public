class AddSchoolIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :school_id, :bigint, null: true
    add_index :users, :school_id
  end
end
