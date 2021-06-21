class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.string :title
      t.text :body
      t.integer :position
      t.string :image
      t.timestamps
    end
  end
end
