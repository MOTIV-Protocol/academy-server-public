class AddStoreInLectures < ActiveRecord::Migration[6.0]
  def change
    add_reference :lectures, :store, index: true
  end
end
