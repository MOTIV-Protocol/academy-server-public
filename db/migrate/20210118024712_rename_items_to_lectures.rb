class RenameItemsToLectures < ActiveRecord::Migration[6.0]
  def change
    rename_table :items, :lectures
  end
end
