class AddCouponNumberToCoupons < ActiveRecord::Migration[6.0]
  def change
    add_column :coupons, :coupon_number, :string
  end
end
