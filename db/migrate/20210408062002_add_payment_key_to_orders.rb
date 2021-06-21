class AddPaymentKeyToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :payment_key, :string
  end
end
