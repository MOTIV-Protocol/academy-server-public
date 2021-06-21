module ImageUrl
  extend ActiveSupport::Concern

  included do
    mount_uploader :image, ImageUploader
  end

  def thumbnail_path size = :thumb
    image? ? image.url(size) : '/image/profile.png'
  end

  def image_path size = :square
    image? ? image.url(size) : '/image/profile.png'
  end

  def upload_image_path size = :square
    image? ? image.url(size) : '/image/profile.png'
  end
end
