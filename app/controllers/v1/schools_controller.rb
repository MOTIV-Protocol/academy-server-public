class V1::SchoolsController < V1::BaseController   
  def index
    # page sort_type lectures_category_id_in
    sort_type = {default: 0, closest: 1, order: 2, score: 3, like: 4}
    schools = School.ransack(params[:q]).result(distinct: true)
    schools = School.from(schools, :schools).by_distance(origin: current_api_user) if params[:sort_type].to_i == sort_type[:closest] && current_api_user.lat.present? && current_api_user.lng.present?
    schools = schools.page(params[:page])
    render json: each_serialize(schools)
  end

  def show
    school = School.find(params[:id])
    render json: serialize(school).merge!( {did_like: current_api_user.likes.find_by(school: school).present? } )
  end

  def update
    school = School.find(params[:id])
    school.update! school_params
    render json: serialize(school)
  end

  def list
    schools = School.ransack(params[:q]).result(distinct: true).limit 20
    render json: each_serialize(schools)
  end

  private
  def school_params
    params.require(:school).permit( :name, :business_address, :business_brand, :business_number, :business_owner, :introduce, :location, :location_info, :opening_time, :phone )
  end

end
