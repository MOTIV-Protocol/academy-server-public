class AddPaymentTotalAndUsedPointToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :amount, :integer
    add_column :orders, :used_point, :integer
    add_column :orders, :buyer_tel, :string
  end
end
