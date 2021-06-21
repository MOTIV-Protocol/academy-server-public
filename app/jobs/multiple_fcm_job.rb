class MultipleFcmJob
  include SuckerPunch::Job

  def perform(body, device_tokens)
    User.send_multiple_push_message(body, device_tokens)
  end
end