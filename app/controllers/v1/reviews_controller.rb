class V1::ReviewsController < V1::BaseController 
  def index
    query = Review.ransack(params[:q])
    query.sorts = ['created_at desc']
    reviews = query.result.page(params[:page])
    render json: each_serialize(reviews)
  end

  def create
    # 유저 한명은 리뷰는 한 주문당 1개의 리뷰만 남길 수 있고, 중복 요청 시 업데이트로 간주한다.
    review = current_api_user.reviews.find_by order_id: review_params[:order_id]
    if review.nil?
      review = current_api_user.reviews.create! review_params
    else
      review.order.complete!
      review.update review_params
    end
    review.order.complete!
    render json: serialize(review)
  end

  def destroy
    review = current_api_user.reviews.find params[:id]
    review.destroy
    render :ok
  end

  private
  def review_params
    params.require(:review).permit(:score, :content, :order_id)
  end
end
