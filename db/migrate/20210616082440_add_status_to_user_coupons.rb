class AddStatusToUserCoupons < ActiveRecord::Migration[6.0]
  def change
    add_column :user_coupons, :status, :integer, default: 0
    remove_column :user_coupons, :used
  end
end
