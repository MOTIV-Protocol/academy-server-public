class Review < ApplicationRecord
  after_save :calculate_average_score, :review_count_up
  after_destroy :calculate_average_score, :review_count_down
  
  paginates_per 16
  include Imagable
  include Commentable
  belongs_to :order, dependent: :destroy
  belongs_to :user

  private
  def calculate_average_score
    school = self&.order&.school
    return if school.nil?
    school.average_score = school.reviews.average(:score)
    school.save!
  end

  private 
  def review_count_up
    school = self&.order&.school
    return if school.nil?
    school.review_count += 1
    school.save!
  end

  private
  def review_count_down
    school = self&.order&.school
    return if school.nil?
    school.review_count -= 1
    school.save!
  end

end
