ActiveAdmin.setup do |config|

  config.site_title = "Academy"
  config.root_to = "users#index"
  
  config.before_action do 
    params.permit!
  end
  config.comments = false
  config.footer = 'MADE WITH INSOMENIA'
  
  config.authentication_method = :authenticate_admin_user!
  config.current_user_method = :current_admin_user
  config.logout_link_path = :destroy_admin_user_session_path

  config.batch_actions = true
  config.filter_attributes = [:encrypted_password, :password, :password_confirmation]
  config.localize_format = :long
end
