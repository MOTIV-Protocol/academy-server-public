class CreateLineItems < ActiveRecord::Migration[6.0]
  def change
    create_table :line_items do |t|
      t.references :lecture, null: true, foreign_key: true
      t.references :order, null: false, foreign_key: true
      t.integer :price
      t.integer :amount, default: 1

      t.timestamps
    end
  end
end
