class V1::LineItemsController < V1::BaseController 
  before_action :load_cart

  def index
    line_items = LineItem.ransack(params[:q]).result.page(params[:page])
    render json: each_serialize(line_items)
  end

  # 장바구니 조회
  def cart
    line_items = @cart.line_items.all
    render json: { line_items: each_serialize(line_items), order_number: @cart.order_number }
  end

  # 장바구니에 lecture 추가
  def create
    line_item = @cart.line_items.find_or_initialize_by line_item_params
    # 타 학원 강의가 들어올 시, 비우고 담기
    @cart.line_items = [line_item] if line_item.lecture.school.id != @cart.line_items[0].lecture.school.id
    @cart.update!(school_id: line_item.lecture.school.id)
    line_item.save!
    render :ok
  end

  # 장바구니에서 삭제
  def destroy
    order = @cart
    order.line_items.find(params[:id]).destroy!
    if order.line_items.blank?
      order.destroy!
      render plain: "blank"
    else
      render :ok
    end
  end

  private

  def line_item_params
    params.fetch(:line_item, {}).permit(:lecture_id, :price)
  end

  def load_cart
    @cart = current_api_user.orders.cart.first_or_create
    @cart.update_order_number if @cart.order_number.nil?
    @cart
  end
end
