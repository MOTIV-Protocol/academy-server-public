class V1::CategoriesController < V1::BaseController
  skip_before_action :authorize_access_request!
  def index
    categories = Category.roots
    render json: each_serialize(categories)
  end

  def show
    category = Category.find(params[:id])
    render json: serialize(category)
  end
end