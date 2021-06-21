class CreateNotices < ActiveRecord::Migration[6.0]
  def change
    create_table :notices do |t|
      t.string "title"
      t.text "body"
      t.integer "position"
      t.integer "view_count", default: 0
      t.timestamps
    end
  end
end
