class AddSortingColumnToSchool < ActiveRecord::Migration[6.0]
  def change
    add_column :schools, :order_count, :integer, default: 0
    add_column :schools, :average_score, :decimal, default: 0
    add_column :schools, :like_count, :integer, default: 0
    add_column :schools, :review_count, :integer, default: 0
    add_column :schools, :comment_count, :integer, default: 0
  end
end
