class AddOwnerIdToSchool < ActiveRecord::Migration[6.0]
  def change
    add_column :schools, :owner_id, :bigint
    add_index :schools, :owner_id
  end
end
