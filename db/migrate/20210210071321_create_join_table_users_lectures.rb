class CreateJoinTableUsersLectures < ActiveRecord::Migration[6.0]
  def change
    create_join_table :users, :lectures do |t|
      t.index [:user_id, :lecture_id]
      t.index [:lecture_id, :user_id]
    end
  end
end
