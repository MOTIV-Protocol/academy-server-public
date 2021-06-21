class V1::UsersController < V1::BaseController
  def index
    users = User.ransack(params[:q]).result
    render json: each_serialize(users)
  end

  def show
    user = User.find params[:id]
    render json: serialize(user)
  end

  def update
    user = User.find params[:id]
    raise Exception.new "Cannot access other user" unless current_api_user.id == user.id
    user.update! user_params
    render json: serialize(user)
  end

  def accept
    user = current_api_user.own_school.teachers.wait.find params[:id]
    user.status = "accepted"
    user.save!
  end

  def reject
    user = current_api_user.own_school.teachers.wait.find params[:id]
    user.status = "rejected"
    user.save!
  end

  private
  def user_params
    params.require(:user).permit(:lat, :lng, :name, :phone, :image, :address1, :address2, :zipcode, :gender, :birthday, :device_token, :device_type)
  end
end