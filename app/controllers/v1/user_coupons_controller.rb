class V1::UserCouponsController < V1::BaseController
  def index
    user_coupons = current_api_user.user_coupons
    render json: each_serialize(user_coupons)
  end

  def create
    coupon = Coupon.find_by(user_coupons_params)
    if current_api_user.user_coupons.find_by_coupon_id(coupon.id).present?
      render json: { error: '동일한 쿠폰이 존재합니다' }, status: 200
    else
      current_api_user.user_coupons.create({coupon: coupon})
      user_coupons = current_api_user.user_coupons
      render json: each_serialize(user_coupons)
    end
  end

  private 
  def user_coupons_params
    params.require(:user_coupon).permit(:coupon_number)
  end
end
