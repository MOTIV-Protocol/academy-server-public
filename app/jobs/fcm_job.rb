class FcmJob
  include SuckerPunch::Job

  def perform(user_id, body)
    user = User.find(user_id)
    user.send_push_message(body)
  end
end