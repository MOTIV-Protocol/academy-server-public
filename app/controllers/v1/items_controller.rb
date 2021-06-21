class V1::ItemsController < V1::BaseController
  skip_before_action :authorize_access_request!, only: [:health]
  def index
    items = Item.ransack(params[:q]).result.page(params[:page])
    render json: each_serialize(items)
  end

  def health
    render json: {env: Rails.env}
  end

  def show
    item = Item.find(params[:id])
    render json: serialize(item)
  end
end
