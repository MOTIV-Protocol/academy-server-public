class V1::OrdersController < V1::BaseController 
  
  # 주문내역 보여주기
  def index
    if current_api_user.role == "owner"
      query = current_api_user.own_school.orders.ransack(params[:q]).result(distinct: true).order(created_at: :desc)
    else
      params[:q].merge!("status_not_eq" => "cart")
      query = current_api_user.orders.ransack(params[:q]).result
    end
    orders = query.page(params[:page])
    render json: each_serialize(orders)
  end

  #  주문내역 상세보기
  def show
    order = current_api_user.orders.find params[:id]
    render json: serialize(order)
  end

  # 카트 수정하기 (결제처리 등)
  def payment
    render :ok
  end

  def success
    order = Order.find_by_order_number(params['orderId'])
    current_user = order.user
    used_point = params['used_point'].to_i
    payment_total = params['amount']
  end

  private

  def order_params
    params.permit(:say_to_teacher, :say_to_owner, :buyer_tel, :amount, :payment_key)
  end
end
