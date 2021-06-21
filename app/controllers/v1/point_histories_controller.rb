class V1::PointHistoriesController < V1::BaseController
  def index
    point_histories = current_api_user.point_histories.ransack(params[:q]).result
    render json: each_serialize(point_histories)
  end
end
