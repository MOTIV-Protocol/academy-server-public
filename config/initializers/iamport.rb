Iamport.configure do |config|
  config.api_key = Rails.application.credentials.dig(:iamport, :api_key)
  config.api_secret = Rails.application.credentials.dig(:iamport, :api_secret)
end
