class V1::AttendancesController < V1::BaseController
  def index
    query = Attendance.ransack(params[:q])
    query.sorts = ['attended_at desc']
    attendances = query.result.page(params[:page])
    render json: each_serialize(attendances)
  end

  def one_by_lecture
    attendance = current_api_user.attendances.order(attended_at: :desc).find_by(attendance_params)
    render :ok if attendance.nil?
    render json: serialize(attendance) unless attendance.nil?
  end

  def create
    attendance = Attendance.find_or_create_by attendance_paramss
    attendance.save! if attendance.new_record?
    render :ok
  end

  # custom route : /attendances/book
  def create_many
    lecture = Lecture.find_by(lecture_params)
    students = lecture.users
    students.each do |student|
      Attendance.create({
        user: student,
        lecture: lecture,
        status: :absence,
        attended_at: params[:attended_at]
      })
    end
  end

  def update
    attendance = Attendance.find params[:id]
    attendance.update! attendance_params if attendance
  end

  def destroy
    attendance = Attedance.find params[:id]
    attendance.destroy
    render :ok
  end

  private
  def attendance_params
    params.require(:attendance).permit(:lecture_id, :user_id, :status, :attended_at)
  end

  private
  def lecture_params
    params.require(:lecture).permit(:id)
  end
end
