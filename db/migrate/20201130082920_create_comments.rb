class CreateComments < ActiveRecord::Migration[6.0]
  def change

    create_table "comments" do |t|
      t.text "body"
      t.string "target_type"
      t.bigint "target_id"
      t.bigint "user_id"
      t.index ["target_type", "target_id"], name: "index_comments_on_target_type_and_target_id"
      t.index ["user_id"], name: "index_comments_on_user_id"
      t.timestamps
    end
    add_foreign_key "comments", "users"
  end
end
