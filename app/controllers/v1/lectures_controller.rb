class V1::LecturesController < V1::BaseController
  def index
    lectures = Lecture.ransack(params[:q]).result(distinct: true).page(params[:page])
    render json: each_serialize(lectures)
  end

  def create
    lecture = current_api_user.own_school.lectures.create! lecture_params
    render json: serialize(lecture)
  end

  def update
    lecture = current_api_user.own_school.lectures.find params[:id]
    lecture.update! lecture_params
    render json: serialize(lecture)
  end

  def show
    lecture = Lecture.find(params[:id])
    render json: serialize(lecture)
  end

  # 선생님이 이 Action에 접근 시, 선생님이 담당하시는 Lecture 목록을 내보내준다.
  def teaching_lectures
    lectures = current_api_user.teaching_lectures.ransack(params[:q]).result.page(params[:page])
    render json: each_serialize(lectures)
  end

  # 수업(:id)을 듣는 학생들의 리스트를 보내준다.
  def attenders
    lecture = Lecture.find params[:id]
    render json: each_serialize(lecture.users)
  end

  private
  def lecture_params
    params.require(:lecture).permit(:teacher_id, :category_id, :title, :price, :description)
  end

end
