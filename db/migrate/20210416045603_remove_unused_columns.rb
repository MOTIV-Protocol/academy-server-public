class RemoveUnusedColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :schools, :image
    
    remove_column :lectures, :video
    remove_column :lectures, :view_count
    remove_column :lectures, :zipcode
    remove_column :lectures, :address1
    remove_column :lectures, :address2
    remove_column :lectures, :_type
    remove_column :lectures, :image

    remove_column :notices, :position

    remove_column :users, :birthday
    remove_column :users, :customs_number
    remove_column :users, :user_type
    remove_column :users, :en_address
    remove_column :users, :description
    remove_column :users, :uid
    remove_column :users, :provider
    remove_column :users, :link
  end
end
