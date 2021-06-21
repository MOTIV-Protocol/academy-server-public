module ImagableSerializer
  extend ActiveSupport::Concern

  included do
    attributes :image_path, :thumbnail_path

    def image_path
      object.image_path 
    end

    def thumbnail_path
      object.image_path(:thumb)
    end
  end
end
