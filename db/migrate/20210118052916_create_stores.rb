class CreateStores < ActiveRecord::Migration[6.0]
  def change
    create_table :stores do |t|
      t.string :name
      t.string :location
      t.text :introduce
      t.text :location_info
      t.string :business_number
      t.string :business_owner
      t.string :business_brand
      t.string :business_address
      t.text :opening_time
      t.string :phone
      t.string :image

      t.timestamps
    end
  end
end
