class ApiController < ActionController::API
  before_action :authorize_access_request!, if: :authorize_controller?
  before_action :configure_permitted_parameters, if: :devise_controller?

  include JWTSessions::RailsAuthorization
  rescue_from JWTSessions::Errors::Unauthorized, with: :un_authorized

  def render_resource(resource)
    if resource.errors.empty?
      render json: resource
    else
      validation_error(resource)
    end
  end

  def validation_error(resource)
    render json: {
      errors: [
        {
          status: "400",
          title: "Bad Request",
          detail: resource.errors,
          code: "100",
        },
      ],
    }, status: :bad_request
  end

  protected

  def authorize_controller?
    return false if devise_controller?
    return false if controller_name == "refresh"
    return false if controller_name == "schools" && action_name == "list"
    return false if controller_name == "orders" && ( ["success", "fail"].include? action_name )
    return true
  end

  def configure_permitted_parameters
    user_fields = %w(name gender birthday)

    devise_parameter_sanitizer.permit(:sign_up, keys: user_fields)
    devise_parameter_sanitizer.permit(:account_update, keys: user_fields)
  end



  def current_api_user
    return unless request.headers.include? "Authorization"
    begin
      @current_api_user ||= User.find(payload["user_id"])
    rescue => exception
      @current_api_user = nil
    end
  end

  def un_authorized(exception)
    message = exception.message
    render json: { error: "Not authorized", msg: message }, status: :unauthorized
  end

  def serialize object, serializer_name = "#{object.class.name}Serializer"
    self.class.module_parent.const_get("#{serializer_name}").new.serialize(object)
  end

  def each_serialize objects, serializer_name = "#{objects.name}EachSerializer"
    Panko::ArraySerializer.new(
      objects,
      each_serializer: self.class.module_parent.const_get(serializer_name)
    ).to_a
  end
end
