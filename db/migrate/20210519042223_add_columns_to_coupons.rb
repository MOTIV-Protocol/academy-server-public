class AddColumnsToCoupons < ActiveRecord::Migration[6.0]
  def change
    add_column :coupons, :name, :string, :null => false
    add_column :coupons, :discount_price, :integer, :null => false, default: 0
    add_column :coupons, :minimum_order_price, :integer, :null => false, default: 0
    add_column :coupons, :expires_at, :datetime
    add_column :coupons, :used_at, :datetime
    add_reference :coupons, :order, null: true, foreign_key: { on_delete: :cascade }
  end
end
