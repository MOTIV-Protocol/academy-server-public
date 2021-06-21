class Comment < ApplicationRecord
  after_save :comment_count_up
  after_destroy :comment_count_down

  paginates_per 5
  PERMIT_PARAMS = %i(body target_type target_id)
  belongs_to :target, polymorphic: true
  belongs_to :user, optional: true
  validates :body, presence: true
  
  private 
  def comment_count_up
    school = self&.target&.order&.school
    return if school.nil?
    school.comment_count += 1
    school.save!
  end

  private
  def comment_count_down
    school = self&.target&.order&.school
    return if school.nil?
    school.comment_count -= 1
    school.save!
  end
end
