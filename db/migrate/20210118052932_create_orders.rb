class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.integer :pay_method
      t.string :say_to_teacher
      t.string :say_to_owner
      t.integer :status, default: 0
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end
  end
end
