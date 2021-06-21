class CreateUserCoupons < ActiveRecord::Migration[6.0]
  def change
    create_table :user_coupons do |t|
      t.references :user, null: false, foreign_key: true
      t.references :coupon, null: false, foreign_key: true
      t.references :order, null: true, foreign_key: true
      t.integer 'used', default: 0
      t.datetime 'used_at'
      t.timestamps
    end
  end
end
