class Users::SessionsController < Devise::SessionsController
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
  skip_before_action :verify_signed_out_user, only: [:destroy]
  before_action :authorize_access_request!, only: [:destroy]
  include JWTSessions::RailsAuthorization
  
  def create
    super do |user|
      if user.persisted?
        payload = { user_id: user.id }
        session = JWTSessions::Session.new(payload: payload, refresh_by_access_allowed: true)
        tokens = session.login
        response.set_cookie(
          JWTSessions.access_cookie,
          value: tokens[:access],
          httponly: true,
          secure: Rails.env.production?,
        )

        render json: { csrf: tokens[:csrf], token: tokens[:access] } and return
      else
        not_found
      end
    end
  end

  def destroy
    session = JWTSessions::Session.new(payload: payload)
    session.flush_by_access_payload
    render json: :ok and return
  end

  private

  def not_found
    render json: { error: "Cannot find email/password combination"}, status: :not_found
  end
end
