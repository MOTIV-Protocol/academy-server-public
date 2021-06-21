class V1::ImagesController < V1::BaseController
  def index
    images = Image.ransack(params[:q]).result
    render json: each_serialize(images)
  end

  def create
    image = Image.create! image_params
    render json: serialize(image)
  end

  def show
    image = Image.find(params[:id])
    render json: serialize(image)
  end

  def update
    image = Image.find(params[:id])
    image.update(image_params)
    render json: serialize(image)
  end

  def destroy
    image = Image.find(params[:id])
    image.destroy!
    render :ok
  end

  private
  def image_params
    params.require(:image).permit(:image, :imagable_id, :imagable_type)
  end
end
