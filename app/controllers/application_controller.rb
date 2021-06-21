class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    user_fields = %w(school_id name phone role gender birthday weight height position_id country_id foot image)
    user_fields.push({ is_marketing: [] })

    devise_parameter_sanitizer.permit(:sign_up, keys: user_fields)
    devise_parameter_sanitizer.permit(:account_update, keys: user_fields)
  end

  def authenticate_admin_user!
    unless admin_user_signed_in?
      redirect_to new_admin_user_session_path
    end
  end  
end
