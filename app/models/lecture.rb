class Lecture < ApplicationRecord
  paginates_per 8
  include Imagable
  include Commentable
  belongs_to :category
  belongs_to :school
  belongs_to :teacher, class_name: "User", foreign_key: "teacher_id", optional: true, inverse_of: :teaching_lectures
  has_many :line_items, dependent: :nullify
  has_many :orders, through: :line_items, source: :order
  has_and_belongs_to_many :users # 수강생들
  has_many :attendances, dependent: :destroy

  before_save do
    if self.teacher.present?
      self.teacher.teaching_school = self.school
      self.teacher.save!
    end
  end
end
