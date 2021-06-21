class AddLatLngToSchools < ActiveRecord::Migration[6.0]
  def change
    add_column :schools, :lat, :decimal, precision: 15, scale: 10
    add_column :schools, :lng, :decimal, precision: 15, scale: 10
  end
end
