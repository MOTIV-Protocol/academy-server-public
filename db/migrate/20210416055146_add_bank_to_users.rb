class AddBankToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :bank, :string
    add_column :users, :bank_account, :string
  end
end
