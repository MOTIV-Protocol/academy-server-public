class V1::LikesController < V1::BaseController

  def index
    likes = Like.ransack(params[:q]).result.page(params[:page])
    render json: each_serialize(likes)
  end

  def liked_schools
    # 찜한 학원 보기
    schools = current_api_user.liked_schools
    render json: each_serialize(schools)
  end

  def create
    # 학원 찜하기
    # id : school_id
    current_api_user.likes.find_or_create_by school_id: params[:id]
    render :ok
  end

  def destroy
    # 학원 찜하기 해제
    # id : school_id
    school = current_api_user.likes.find_by school_id: params[:id]
    school.destroy if school
    render :ok
  end
end
