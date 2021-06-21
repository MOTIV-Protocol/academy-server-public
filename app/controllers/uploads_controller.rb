class UploadsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    file = params[:upload][:image]
    uploader = ImageUploader.new #업로더라는 이름으로 업로더 객체 생성
    begin
      uploader.store!(file)
    rescue
      puts "keep going"
    end

    render json: {
      image: {
        url: uploader.url
      }
    }, content_type: "text/html"
  end

end
