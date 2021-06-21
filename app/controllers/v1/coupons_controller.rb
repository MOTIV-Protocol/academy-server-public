class V1::CouponsController < V1::BaseController
  def index
    coupons = current_api_user.coupons.ransack(params[:q]).result
    render json: each_serialize(coupons)
  end

  def destroy
    coupon = current_api_user.coupons.find params[:id]
    coupon.destroy!
    render :ok
  end
end
