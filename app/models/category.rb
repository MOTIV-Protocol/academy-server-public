class Category < ApplicationRecord
  has_ancestry
  include ImageUrl
  has_many :lectures, dependent: :nullify
  validates :title, presence: true
  
  def image_path size = :square
    image? ? image.url(size) : '/image/profile.png'
  end

end
