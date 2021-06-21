class EditColumnsInCoupons < ActiveRecord::Migration[6.0]
  def change
    remove_column :coupons, :user_id
    remove_column :coupons, :used_at
    remove_column :coupons, :order_id
    add_column :coupons, :content, :string
  end
end
