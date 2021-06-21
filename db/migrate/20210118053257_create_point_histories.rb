class CreatePointHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :point_histories do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount

      t.timestamps
    end
  end
end
