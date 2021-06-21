class V1::CalculateHistoriesController < ApiController
  # 원장님이 자신의 학원 관련 정산 확인
  def index
    calculate_histories = current_api_user.own_school.calculate_histories.ransack(params[:q]).result(distinct: true).page(params[:page])
    render json: each_serialize(calculate_histories)
  end

  # 원장님이 자신의 학원 관련 정산 내용 확인
  def show
    calculate_history = current_api_user.own_school.calculate_histories.find params[:id]
    render json: serialize(calculate_history).merge({
      owner_profit: calculate_history.orders.where({school_id: current_api_user.own_school.id}).sum(:payment_total)
    })
  end
end
