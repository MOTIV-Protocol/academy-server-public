class ReplaceSchoolToOrderOnReviews < ActiveRecord::Migration[6.0]
  def change
    remove_reference :reviews, :school
    add_reference :reviews, :order, index: true
  end
end
