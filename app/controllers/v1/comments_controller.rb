class V1::CommentsController < V1::BaseController 
  def index
    comments = Comment.ransack(params[:q]).result.order(created_at: :desc).includes(:user).page(params[:page])
    render json: {
      comments: each_serialize(comments),
      total_pages: comments.total_pages
    }
  end 

  def create
    comment = current_api_user.comments.create!(comment_params)
    render json: serialize(comment)
  end

  def show
    comment = Comment.find params[:id]
    render json: serialize(comment)
  end

  def destroy
    comment = current_api_user.comments.find params[:id]
    comment.destroy
    render :ok
  end

  private
  def comment_params
    params.fetch(:comment, {}).permit(:body, :target_type, :target_id)
  end
end


