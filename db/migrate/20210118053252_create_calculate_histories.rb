class CreateCalculateHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :calculate_histories do |t|
      t.references :user, null: false, foreign_key: true
      t.references :order, null: false, foreign_key: true
      t.integer :price

      t.timestamps
    end
  end
end