class RenameStoreToSchool < ActiveRecord::Migration[6.0]
  def change
    rename_table :stores, :schools
    rename_column :lectures, :store_id, :school_id
    rename_column :reviews, :store_id, :school_id
  end
end
