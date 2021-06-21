class AddRoleToUsers < ActiveRecord::Migration[6.0]
  def change
    # 유저는 "학생", "선생", "원장" 과 같은 역할이 있어야 합니다.
    add_column :users, :role, :integer, default: 0, limit: 2
  end
end
