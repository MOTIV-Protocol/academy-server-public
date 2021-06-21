require 'test_helper'

class V1::ReviewsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get v1_reviews_show_url
    assert_response :success
  end

end
