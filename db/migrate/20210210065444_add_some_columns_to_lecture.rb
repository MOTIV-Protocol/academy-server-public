class AddSomeColumnsToLecture < ActiveRecord::Migration[6.0]
  def change
    # add_column :lectures, :begin_at, :date
    # add_column :lectures, :end_at, :date
    add_column :lectures, :capacity, :integer, null: true
    add_reference :lectures, :teacher, foreign_key: { to_table: :users }
    
  end
end
