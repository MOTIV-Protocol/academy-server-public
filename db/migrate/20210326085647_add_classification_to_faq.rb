class AddClassificationToFaq < ActiveRecord::Migration[6.0]
  def change
    add_column :faqs, :classification, :integer
  end
end
