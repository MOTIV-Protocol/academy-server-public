class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  def filename
    "#{secure_token}#{original_filename.truncate(200, omission: "")}.#{file.extension}" if original_filename.present?
  end

  process :right_orientation
  storage :file

  version :thumb do
    process resize_to_fill: [64, 64]
  end

  version :square do
    process resize_to_fill: [1024,1024]
  end

  # version :banner do
  #   process resize_to_fill: [1024,768]
  # end

  # version :ratio do
  #   process resize_to_fit: [1600,1600]
  # end

  def right_orientation
   manipulate! do |img|
     img.auto_orient
     img
   end
  end

  protected
  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end
end
