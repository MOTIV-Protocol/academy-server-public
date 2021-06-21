class AddCascadeToIndex < ActiveRecord::Migration[6.0]
  def change
    remove_reference :orders, :school, null: true, foreign_key: true
    remove_reference :reviews, :order, index: true
    remove_reference :contacts, :user, null: false, foreign_key: true
    remove_reference :lectures, :teacher, foreign_key: { to_table: :users }
    remove_reference :point_histories, :order, foreign_key: true
    remove_reference :line_items, :lecture, null: true, foreign_key: true
    remove_reference :line_items, :order, null: false, foreign_key: true

    add_reference :orders, :school, null: true, foreign_key: { on_delete: :cascade }
    add_reference :reviews, :order, index: true, foreign_key: { on_delete: :cascade }
    add_reference :contacts, :user, null: false, foreign_key: { on_delete: :cascade }
    add_column :lectures, :teacher_id, :bigint, null: true, foreign_key: { on_delete: :cascade }
    add_index :lectures, :teacher_id
    add_reference :point_histories, :order, foreign_key: { on_delete: :cascade }
    add_reference :line_items, :lecture, null: true, foreign_key: { on_delete: :cascade }
    add_reference :line_items, :order, null: false, foreign_key: { on_delete: :cascade }
  end
end
