JWTSessions.encryption_key = Rails.application.credentials.dig(:jwt_secret_key)
JWTSessions.access_exp_time = 7200 # 2 hour in seconds
JWTSessions.refresh_exp_time = 604_800 # 1 week in seconds 604_800 = 604800
