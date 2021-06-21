export const configs = {
  api_url: process.env.API_URL || "http://localhost:3000",
  service_url: process.env.SERVICE_URL || "http://localhost:8080",
  env: process.env.NODE_ENV || "development",
  version: process.env.VERSION || '1',
  kakao_base_url: "https://dapi.kakao.com/",
  kakao_javascript_key: process.env.KAKAO_JAVASCRIPT_KEY,
  kakao_rest_api_key: process.env.KAKAO_REST_API_KEY,
  toss_client_key: process.env.TOSS_CLIENT_KEY
}

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';