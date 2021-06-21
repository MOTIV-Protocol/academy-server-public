class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :title
      t.integer :price
      t.text :video
      t.bigint :category_id, index: true
      t.text :description
      t.bigint :user_id, index: true
      t.string :image
      t.integer :status, default: 0
      t.decimal :reviews_average, default: 0.0
      t.integer :reviews_count
      t.integer :view_count, default: 0
      t.string :zipcode
      t.string :address1
      t.string :address2
      t.datetime :start_at
      t.datetime :end_at
      t.integer :_type
      t.decimal :lat, precision: 15, scale: 10
      t.decimal :lng, precision: 15, scale: 10
      t.timestamps
    end
  end
end