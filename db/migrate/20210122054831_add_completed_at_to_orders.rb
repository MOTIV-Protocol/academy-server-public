class AddCompletedAtToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :completed_at, :datetime
    add_column :orders, :imp_uid, :string
    add_column :orders, :order_number, :string
    add_column :orders, :payment_total, :integer
  end
end
